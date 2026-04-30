import { defineEventHandler, readBody } from 'h3'
import type { DepartureDocument, SearchResponse, TripDocument } from '~/types/trip'
import { getTypesenseClient } from '~~/server/utils/typesense'

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const body = await readBody<any>(event)
  let client
  try {
    client = getTypesenseClient()
  } catch (err: any) {
    console.error('Failed to initialize Typesense client:', err?.message || err)
    return {
      hits: [],
      facets: {},
      totalHits: 0,
      page,
      totalPages: 1,
      processingTimeMs: 0,
    }
  }
  const collection = process.env.TYPESENSE_COLLECTION || 'dev_intrepid_departure'
  const perPage = 12
  const page = body.page || 1

  const filters: string[] = []
  const quote = (value: string) => `"${value.replace(/"/g, '\\"')}"`

  if (body.filters?.destinations?.length) {
    filters.push(`destinations:=[${body.filters.destinations.map(quote).join(',')}]`)
  }
  if (body.filters?.styles?.length) {
    filters.push(`styles:=[${body.filters.styles.map(quote).join(',')}]`)
  }
  if (body.filters?.themes?.length) {
    filters.push(`themes:=[${body.filters.themes.map(quote).join(',')}]`)
  }
  if (body.filters?.physicalRating?.length) {
    filters.push(`physicalRating:=[${body.filters.physicalRating.join(',')}]`)
  }
  if (typeof body.filters?.durationMin === 'number') {
    filters.push(`duration:>=${body.filters.durationMin}`)
  }
  if (typeof body.filters?.durationMax === 'number') {
    filters.push(`duration:<=${body.filters.durationMax}`)
  }
  if (typeof body.filters?.priceMin === 'number') {
    filters.push(`lowestPrice.usd.price:>=${body.filters.priceMin}`)
  }
  if (typeof body.filters?.priceMax === 'number') {
    filters.push(`lowestPrice.usd.price:<=${body.filters.priceMax}`)
  }
  if (body.filters?.deals?.length) {
    filters.push(`tags:=[${body.filters.deals.map(quote).join(',')}]`)
  }
  if (body.filters?.showNewTrips) {
    // best-effort: map "new trips" to onSale flag if present in schema
    filters.push(`onSale:=true`)
  }

  const filterString = filters.length ? filters.join(' && ') : undefined

  const sortByMap: Record<string, string | undefined> = {
    recommended: 'reviewRating:desc',
    'price-asc': 'lowestPrice.usd.price:asc',
    'price-desc': 'lowestPrice.usd.price:desc',
    'duration-asc': 'duration:asc',
    'duration-desc': 'duration:desc',
    'rating-desc': 'reviewRating:desc',
    newest: 'startDate:desc',
  }

  const sortString = sortByMap[body.sortBy]

  const searchParams = {
    q: body.q?.trim() || '*',
    query_by: 'name,primaryCountry,destinations,marketingRegions,themes,styles,locations,productUrl',
    filter_by: filterString,
    sort_by: sortString,
    per_page: 250,
  }

  // Request facet counts for UI: destinations, styles, themes, physicalRating, regions, primaryCountry, tags
  const facetFields = ['destinations', 'styles', 'themes', 'physicalRating', 'primaryCountry', 'regions', 'tags']
  ;(searchParams as any).facet_by = facetFields.join(',')
  ;(searchParams as any).max_facet_values = 200

  // Include grouping parameters if provided by the client
  if (body.group_by) {
    ;(searchParams as any).group_by = body.group_by
  }
  if (typeof body.group_limit === 'number') {
    ;(searchParams as any).group_limit = body.group_limit
  }

  const executeSearch = async () => {
    // Try with full params first. If Typesense rejects facet_by/group_by
    // (e.g. because a field isn't facetable) attempt progressively simpler
    // fallbacks so the API returns results instead of a 500.
    try {
      return await client.collections(collection).documents().search(searchParams)
    } catch (error: any) {
      console.error('Typesense search failed (full params):', error?.message || error)

      // 1) Try without facet_by
      try {
        const { facet_by, max_facet_values, ...noFacets } = searchParams as any
        return await client.collections(collection).documents().search(noFacets)
      } catch (err2: any) {
        console.error('Typesense search failed (no facets):', err2?.message || err2)

        // 2) Try an even simpler fallback without sort_by/grouping
        try {
          const { sort_by, group_by, group_limit, facet_by, max_facet_values, ...minimal } = searchParams as any
          return await client.collections(collection).documents().search(minimal)
        } catch (err3: any) {
          console.error('Typesense search final fallback failed:', err3?.message || err3)
          throw err3
        }
      }
    }
  }

  const searchResults: any = await executeSearch()

  // Build facets result mapping from Typesense response
  const facetsResult: Record<string, Array<{ value: string; count: number }>> = {}
  const rawFacetCounts = searchResults.facet_counts || searchResults.facetCounts || []
  if (Array.isArray(rawFacetCounts)) {
    for (const fc of rawFacetCounts) {
      const fieldName = fc.field_name || fc.field || fc.fieldName || fc.fieldName
      const counts = fc.counts || fc.values || []
      facetsResult[fieldName] = counts.map((c: any) => ({ value: String(c.value), count: c.count }))
    }
  }

  // If Typesense returned grouped_hits (when using group_by), extract the
  // first document from each group. Otherwise fall back to flat hits.
  let hitsDocs: DepartureDocument[] = []
  if (Array.isArray(searchResults.grouped_hits) && searchResults.grouped_hits.length) {
    hitsDocs = searchResults.grouped_hits
      .map((g: any) => (g.hits && g.hits[0] && g.hits[0].document) || null)
      .filter(Boolean)
  } else {
    hitsDocs = (searchResults.hits || []).map((hit: { document: DepartureDocument }) => hit.document)
  }

  // Deduplicate by productId/productCode/name as a safeguard (for non-grouped responses)
  const groupedProducts = new Map<string, DepartureDocument>()
  for (const doc of hitsDocs) {
    const key = String(doc.productId || doc.productCode || doc.name || Math.random())
    if (!groupedProducts.has(key)) {
      groupedProducts.set(key, doc)
    }
  }

  const allGroupedDocs = Array.from(groupedProducts.values())
  const totalHits = allGroupedDocs.length
  const totalPages = Math.max(1, Math.ceil(totalHits / perPage))
  
  const startIndex = (page - 1) * perPage
  const paginatedDocs = allGroupedDocs.slice(startIndex, startIndex + perPage)

  const normalizeAssetUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `https://www.intrepidtravel.com${url.startsWith('/') ? '' : '/'}${url}`
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return undefined
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const mapDocToTrip = (doc: DepartureDocument): TripDocument => {
    const usd = doc.lowestPrice?.usd || doc.lowestPrice?.USD
    const slug = doc.productUrl?.split('/').filter(Boolean).pop() || doc.productCode || doc.name || 'trip'
    const mapUrl = normalizeAssetUrl(doc.map?.url)
    const imageUrl = normalizeAssetUrl(doc.productImages?.[0]?.url) || mapUrl

    return {
      id: `${doc.productId || doc.departureId || doc.objectID || slug}`,
      name: doc.name || 'Untitled trip',
      slug,
      duration: doc.duration || 0,
      destinations: doc.destinations || [],
      style: doc.styles?.[0] || 'Original',
      themes: doc.themes || [],
      physicalRating: doc.physicalRating || 0,
      price: usd?.price || 0,
      originalPrice: usd?.price,
      discountPrice: usd?.discountPrice,
      onSale: usd?.onSale || false,
      saleBadge: usd?.isHighlightedDeal ? 'Deal' : undefined,
      rating: doc.reviewRating || 0,
      reviewCount: doc.reviewCount || 0,
      lowestPriceDate: formatDate(doc.startDate),
      imageUrl,
      mapUrl: mapUrl || imageUrl,
    }
  }

  const hits = paginatedDocs.map(mapDocToTrip)

  return {
    hits,
    facets: facetsResult,
    totalHits,
    page,
    totalPages,
    processingTimeMs: searchResults.search_time_ms || 0,
  }
})

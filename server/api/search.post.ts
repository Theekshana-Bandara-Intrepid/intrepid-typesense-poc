import { defineEventHandler, readBody } from 'h3'
import type { DepartureDocument, SearchResponse, TripDocument } from '~/types/trip'
import { getTypesenseClient } from '~~/server/utils/typesense'
import getTripCollectionSchema from '~~/server/utils/schema'

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const body = await readBody<any>(event)
  // Pagination and defaults
  const page = body.page || 1
  const perPage = 12

  // Initialize Typesense client
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

  // Date filters: expect YYYY-MM-DD strings from the frontend; convert to epoch seconds
  if (body.filters?.startDate) {
    const sd = Date.parse(body.filters.startDate)
    if (!isNaN(sd)) {
      const startTs = Math.floor(sd / 1000)
      filters.push(`startDate:>=${startTs}`)
    }
  }
  if (body.filters?.endDate) {
    const ed = Date.parse(body.filters.endDate)
    if (!isNaN(ed)) {
      const endDateObj = new Date(ed)
      endDateObj.setHours(23, 59, 59, 999)
      const endTs = Math.floor(endDateObj.getTime() / 1000)
      filters.push(`startDate:<=${endTs}`)
    }
  }

  // Support AND / OR filter logic (default AND)
  const filterLogic = (body.filterLogic || 'AND').toString().toUpperCase()
  const filterOp = filterLogic === 'OR' ? ' || ' : ' && '
  const filterString = filters.length ? filters.join(filterOp) : undefined

  const sortByMap: Record<string, string | undefined> = {
    relevance: undefined,
    'price-asc': 'lowestPrice.usd.price:asc',
    'price-desc': 'lowestPrice.usd.price:desc',
    'duration-asc': 'duration:asc',
  }

  const sortString = sortByMap[body.sortBy || 'relevance']

  const searchParams: Record<string, any> = {
    q: body.q?.trim() || '*',
    query_by: 'name,primaryCountry,destinations,marketingRegions,themes,styles,locations,productUrl',
    filter_by: filterString,
    per_page: 250,
  }

  if (sortString) {
    searchParams.sort_by = sortString
  }

  // Typo tolerance: allow client to enable/disable; default to true
  ;(searchParams as any).typo_tolerance = typeof body.typoTolerance === 'boolean' ? body.typoTolerance : true

  // Request facet counts for UI: only include fields that are facetable in our local schema
  try {
    const desiredFacetFields = ['destinations', 'styles', 'themes', 'physicalRating', 'primaryCountry', 'regions', 'tags']
    const localSchema = getTripCollectionSchema()
    const localFacetable = new Set((localSchema.fields || []).filter((f: any) => f.facet).map((f: any) => f.name))

    // Try to retrieve the remote collection schema to avoid requesting facets that don't exist remotely
    let remoteFacetable = new Set<string>()
    try {
      const remoteSchema: any = await client.collections(collection).retrieve()
      if (remoteSchema && Array.isArray(remoteSchema.fields)) {
        remoteFacetable = new Set(remoteSchema.fields.filter((f: any) => f.facet).map((f: any) => f.name))
      }
    } catch (e) {
      // ignore remote schema errors and fall back to local schema
      console.warn('Could not fetch remote Typesense collection schema:', e?.message || e)
    }

    // Only include facet fields that are facetable both locally and remotely (if remote schema available)
    const facetFields = desiredFacetFields.filter((f) => localFacetable.has(f) && (remoteFacetable.size ? remoteFacetable.has(f) : true))
    if (facetFields.length) {
      ;(searchParams as any).facet_by = facetFields.join(',')
      ;(searchParams as any).max_facet_values = 200
    }
  } catch (err: any) {
    console.warn('Could not compute facet fields from local schema:', err?.message || err)
  }

  // Include grouping parameters if provided by the client and if the field is facetable
  if (body.group_by) {
    try {
      const schema = getTripCollectionSchema()
      const groupField = body.group_by
      const fieldDef = (schema.fields || []).find((f: any) => f.name === groupField)
      if (fieldDef && fieldDef.facet) {
        ;(searchParams as any).group_by = groupField
      } else {
        console.warn(`Skipping group_by=${groupField} because it's not facetable in the local schema.`)
      }
    } catch (err: any) {
      console.warn('Error checking schema for group_by:', err?.message || err)
      ;(searchParams as any).group_by = body.group_by
    }
  }
  if (typeof body.group_limit === 'number') {
    ;(searchParams as any).group_limit = body.group_limit
  }

  // Geo search: if provided, we'll post-filter results by distance (km)
  const geoQuery = body.geo // { lat: number, lng: number, radiusKm?: number }

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

  // Geo filtering (post-filter): if client provided geo query, keep docs that
  // have at least one _geoloc point within the requested radius (km).
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180
    const R = 6371 // Earth radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  if (geoQuery && typeof geoQuery.lat === 'number' && typeof geoQuery.lng === 'number') {
    const radiusKm = typeof geoQuery.radiusKm === 'number' ? geoQuery.radiusKm : 50
    hitsDocs = hitsDocs.filter((doc) => {
      const geo = (doc as any)._geoloc || (doc as any).geo || []
      if (!Array.isArray(geo) || geo.length === 0) return false
      for (const loc of geo) {
        const lat = loc.lat ?? loc.latitude ?? loc[0]
        const lng = loc.lng ?? loc.longitude ?? loc[1]
        if (typeof lat === 'number' && typeof lng === 'number') {
          if (haversineKm(lat, lng, geoQuery.lat, geoQuery.lng) <= radiusKm) return true
        }
      }
      return false
    })
  }

  // Deduplicate by productId/productCode/name as a safeguard (for non-grouped responses)
  const groupedProducts = new Map<string, DepartureDocument>()
  for (const doc of hitsDocs) {
    const key = String(doc.productId || doc.productCode || doc.name || Math.random())
    if (!groupedProducts.has(key)) {
      groupedProducts.set(key, doc)
    }
  }

  let allGroupedDocs = Array.from(groupedProducts.values())

  // Merchandising / pinned results: allow pinned product IDs from env var
  const pinnedCsv = process.env.TYPESENSE_PINNED_PRODUCT_IDS || process.env.PINNED_PRODUCT_IDS || ''
  const pinnedIds = pinnedCsv.split(',').map((s) => s.trim()).filter(Boolean)
  if (pinnedIds.length) {
    const pinnedSet = new Set(pinnedIds.map(String))
    const pinnedDocs = allGroupedDocs.filter((d) => pinnedSet.has(String(d.productId)))
    const otherDocs = allGroupedDocs.filter((d) => !pinnedSet.has(String(d.productId)))
    allGroupedDocs = [...pinnedDocs, ...otherDocs]
  }

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
    const currencyKey = (body.currency || 'usd').toString().toLowerCase()
    const priceObj = (doc.lowestPrice && (doc.lowestPrice as any)[currencyKey]) || doc.lowestPrice?.usd || doc.lowestPrice?.USD || {}
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
      price: priceObj?.price || 0,
      originalPrice: priceObj?.price,
      discountPrice: priceObj?.discountPrice,
      onSale: priceObj?.onSale || false,
      saleBadge: priceObj?.isHighlightedDeal ? 'Deal' : undefined,
      rating: doc.reviewRating || 0,
      reviewCount: doc.reviewCount || 0,
      lowestPriceDate: formatDate(doc.startDate),
      imageUrl,
      mapUrl: mapUrl || imageUrl,
      currency: (body.currency || 'USD').toString().toUpperCase(),
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

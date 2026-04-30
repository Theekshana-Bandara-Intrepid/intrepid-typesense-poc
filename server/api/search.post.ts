import { defineEventHandler, readBody } from 'h3'
import type { DepartureDocument, SearchResponse, TripDocument } from '~/types/trip'
import { getTypesenseClient } from '~~/server/utils/typesense'

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const body = await readBody<any>(event)
  const client = getTypesenseClient()
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

  const executeSearch = async () => {
    try {
      return await client.collections(collection).documents().search(searchParams)
    } catch (error: any) {
      const { sort_by, ...fallbackParams } = searchParams
      return await client.collections(collection).documents().search(fallbackParams)
    }
  }

  const searchResults: any = await executeSearch()
  
  const hitsDocs = (searchResults.hits || []).map((hit: { document: DepartureDocument }) => hit.document)
  
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
    facets: {},
    totalHits,
    page,
    totalPages,
    processingTimeMs: searchResults.search_time_ms || 0,
  }
})

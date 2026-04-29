import { defineEventHandler, getRouterParam } from 'h3'
import type { DepartureDocument, TripDetail } from '~/types/trip'
import { getTypesenseClient } from '~~/server/utils/typesense'

/**
 * Product Detail API Route (/api/trip/:slug)
 * 
 * This GET endpoint retrieves the full detailed data for a single trip based on its slug.
 * It is called by the `app/pages/trip/[slug].vue` page during server-side rendering (SSR).
 * In a real implementation, this might query a separate Typesense collection (e.g., `trips_detailed`),
 * retrieve the document from a CMS/PIM, or simply fetch the document from the `trips` 
 * collection if all detailed data (itinerary, inclusions, etc.) is indexed there.
 */

export default defineEventHandler(async (event): Promise<TripDetail | null> => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    return null
  }

  const client = getTypesenseClient()
  const collection = process.env.TYPESENSE_COLLECTION || 'dev_intrepid_departure'

  const normalizeAssetUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `https://www.intrepidtravel.com${url.startsWith('/') ? '' : '/'}${url}`
  }

  const extractSlug = (productUrl?: string) => {
    if (!productUrl) return undefined
    return productUrl.split('/').filter(Boolean).pop()
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const runSearch = async () => {
    try {
      const slugIdMatch = slug.match(/-(\d+)$/)
      const filterStr = slugIdMatch ? `productId:=${slugIdMatch[1]}` : undefined
      return await client.collections(collection).documents().search({
        q: slugIdMatch ? '*' : slug,
        query_by: 'productUrl,name,productCode,primaryCountry,destinations,marketingRegions,themes,styles',
        filter_by: filterStr,
        per_page: 10,
      })
    } catch (error: any) {
      return await client.collections(collection).documents().search({
        q: slug,
        query_by: 'name,productCode',
        per_page: 10,
      })
    }
  }

  const searchResults: any = await runSearch()

  const docs = (searchResults.hits || []).map((hit: { document: DepartureDocument }) => hit.document)
  const primaryDoc = docs.find((doc) => extractSlug(doc.productUrl) === slug) || docs[0]

  if (!primaryDoc) {
    return null
  }

  const productId = primaryDoc.productId
  let departureDocs: DepartureDocument[] = []

  if (productId) {
    try {
      const departuresResult: any = await client.collections(collection).documents().search({
        q: '*',
        query_by: 'name',
        filter_by: `productId:=${productId}`,
        sort_by: 'startDate:asc',
        per_page: 250,
      })

      departureDocs = (departuresResult.hits || []).map((hit: { document: DepartureDocument }) => hit.document)
    } catch (error: any) {
      const fallbackResult: any = await client.collections(collection).documents().search({
        q: '*',
        query_by: 'name',
        filter_by: `productId:=${productId}`,
        per_page: 250,
      })

      departureDocs = (fallbackResult.hits || []).map((hit: { document: DepartureDocument }) => hit.document)
    }
  }

  const toStatus = (doc: DepartureDocument) => {
    if (doc.closedForBooking || doc.hasPlacesLeft === false) return 'sold-out'
    if (doc.placesLeft && doc.placesLeft <= 3) return 'limited'
    if (doc.placesLeft === 0) return 'sold-out'
    return 'available'
  }

  const departures = departureDocs.map((doc) => {
    const usd = doc.lowestPrice?.usd || doc.lowestPrice?.USD
    return {
      id: `${doc.departureId || doc.objectID || doc.productId || Math.random().toString(36).slice(2)}`,
      startDate: formatDate(doc.startDate),
      endDate: formatDate(doc.endDate),
      status: toStatus(doc),
      spacesLeft: doc.placesLeft,
      price: usd?.discountPrice || usd?.price || 0,
      originalPrice: usd?.price,
      onSale: usd?.onSale || false,
      saleBadge: usd?.isHighlightedDeal ? 'Deal' : undefined,
    }
  })

  const usd = primaryDoc.lowestPrice?.usd || primaryDoc.lowestPrice?.USD
  const slugValue = extractSlug(primaryDoc.productUrl) || primaryDoc.productCode || primaryDoc.name || slug
  const mapUrl = normalizeAssetUrl(primaryDoc.map?.url) || normalizeAssetUrl(primaryDoc.productImages?.[0]?.url)
  const imageUrl = normalizeAssetUrl(primaryDoc.productImages?.[0]?.url) || mapUrl
  const productImages = (primaryDoc.productImages || []).map((image) => ({
    alt: image.alt || primaryDoc.name || 'Trip image',
    url: normalizeAssetUrl(image.url),
  }))

  const tripDetail: TripDetail = {
    id: `${primaryDoc.productId || primaryDoc.departureId || primaryDoc.objectID || slugValue}`,
    name: primaryDoc.name || 'Untitled trip',
    slug: slugValue,
    duration: primaryDoc.duration || 0,
    destinations: primaryDoc.destinations || [],
    style: primaryDoc.styles?.[0] || 'Original',
    themes: primaryDoc.themes || [],
    physicalRating: primaryDoc.physicalRating || 0,
    price: usd?.discountPrice || usd?.price || 0,
    originalPrice: usd?.price,
    discountPrice: usd?.discountPrice,
    onSale: usd?.onSale || false,
    saleBadge: usd?.isHighlightedDeal ? 'Deal' : undefined,
    rating: primaryDoc.reviewRating || 0,
    reviewCount: primaryDoc.reviewCount || 0,
    lowestPriceDate: formatDate(primaryDoc.startDate),
    imageUrl,
    mapUrl,
    productCode: primaryDoc.productCode || '',
    startCity: primaryDoc.startCity || '',
    endCity: primaryDoc.endCity || '',
    ageRange: '15-99',
    maxGroupSize: 12,
    styles: primaryDoc.styles || [],
    mapAlt: primaryDoc.map?.alt || `Map of ${primaryDoc.name || 'trip'}`,
    productImages: productImages.length ? productImages : [{ alt: primaryDoc.name || 'Trip image', url: imageUrl }],
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: (primaryDoc.activities || []).map((act, i) => ({
      day: i + 1,
      title: act,
      description: '',
      accommodation: '',
      meals: [],
      activities: [],
    })),
    departures,
  }

  return tripDetail
})

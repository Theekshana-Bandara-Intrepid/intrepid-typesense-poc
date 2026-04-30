/**
 * Trip Types and Interfaces
 * 
 * Defines the shapes of data used across the POC for both search indexing
 * and detailed product retrieval. These interfaces ensure consistency between
 * the UI components, the Nuxt API layer, and the Typesense collections.
 */

/**
 * TripDocument represents the structure of a document inside the Typesense `trips` collection.
 * It contains only the fields necessary for search, faceting, sorting, and displaying 
 * the TripCard on the search results page.
 */
export interface TripDocument {
  id: string
  name: string
  slug: string
  duration: number
  destinations: string[]
  style: string
  themes: string[]
  physicalRating: number
  price: number
  originalPrice?: number
  discountPrice?: number
  onSale: boolean
  saleBadge?: string
  rating: number
  reviewCount: number
  lowestPriceDate?: string
  imageUrl: string
  mapUrl: string
  isNewTrip?: boolean
}

/**
 * DepartureDocument represents the structure of a single departure
 * record inside the `dev_intrepid_departure` collection.
 */
export interface DepartureDocument {
  objectID?: string
  name?: string
  departureId?: number
  productCode?: string
  productId?: number
  productUrl?: string
  primaryCountry?: string
  destinations?: string[]
  marketingRegions?: string[]
  themes?: string[]
  styles?: string[]
  locations?: string[]
  startCity?: string
  endCity?: string
  duration?: number
  startDate?: number
  endDate?: number
  physicalRating?: number
  placesLeft?: number
  hasPlacesLeft?: boolean
  closedForBooking?: boolean
  reviewCount?: number
  reviewRating?: number
  lowestPrice?: Record<string, {
    type?: string
    price?: number
    onSale?: boolean
    currencyCode?: string
    depositAmount?: number
    discountPrice?: number
    isHighlightedDeal?: boolean
    isHighlightedPrice?: boolean
  }>
  map?: {
    alt?: string
    url?: string
    title?: string
    width?: number
    height?: number
  }
  productImages?: Array<{ alt?: string; url?: string }>
  activities?: string[]
}

/**
 * TripDetail represents the full product data required for the Product Detail Page (PDP).
 * This might be fetched either from a separate detailed Typesense collection or a CMS API,
 * but for this POC, we structure it to match the hardcoded data in `app/pages/trip/[slug].vue`.
 */
export interface TripDetail extends TripDocument {
  productCode: string
  startCity: string
  endCity: string
  ageRange: string
  maxGroupSize: number
  styles?: string[]
  mapAlt: string
  productImages: Array<{ alt: string; url: string }>
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    accommodation: string
    meals: string[]
    activities: string[]
  }>
  departures: Array<{
    id: string
    startDate: string
    endDate: string
    status: string
    spacesLeft?: number
    price: number
    originalPrice?: number
    onSale?: boolean
    saleBadge?: string
  }>
}

/**
 * SearchResponse represents the formatted response returned to the frontend
 * from the Nuxt API search route.
 */
export interface SearchResponse {
  hits: TripDocument[]
  facets: Record<string, any>
  totalHits: number
  page: number
  totalPages: number
  processingTimeMs: number
}

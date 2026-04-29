// ─── Geo & Media ────────────────────────────────────────────
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface ImageAsset {
  alt: string;
  url: string;
}

export interface MapAsset {
  alt: string;
  url: string;
  title: string;
  width: number;
  height: number;
}

// ─── Pricing ────────────────────────────────────────────────
export interface PriceInfo {
  type: string;
  price: number;
  onSale: boolean;
  currencyCode: string;
  depositAmount: number;
  discountPrice: number;
  isHighlightedDeal: boolean;
  isHighlightedPrice: boolean;
}

export type CurrencyCode = 'aud' | 'cad' | 'chf' | 'eur' | 'gbp' | 'nzd' | 'usd' | 'zar';

export type LowestPrice = Record<CurrencyCode, PriceInfo>;

// ─── Promotion ──────────────────────────────────────────────
export interface Promotion {
  name: string;
  discount: number;
  type: string;
}

// ─── Trip Product (Search Result) ───────────────────────────
export interface TripProduct {
  objectID: string;
  name: string;
  departureId: number;
  productCode: string;
  productId: number;
  productUrl: string;
  primaryCountry: string;
  destinations: string[];
  marketingRegions: string[];
  themes: string[];
  styles: string[];
  locations: string[];
  startCity: string;
  endCity: string;
  regions: string[];
  subdivisions: string[];
  _geoloc: GeoLocation[];
  activities: string[];
  excludedSaleRegions: string[];
  tags: string[];
  lowestPrice: LowestPrice;
  closedForBooking: boolean;
  duration: number;
  startDate: number;
  endDate: number;
  physicalRating: number;
  promotions: Promotion[];
  subdivisionCountries: string[];
  map: MapAsset;
  placesLeft: number;
  reviewCount: number;
  reviewRating: number;
  hasPlacesLeft: boolean;
  productImages: ImageAsset[];
  marketingRating: number;
}

// ─── Extended Product Detail ────────────────────────────────
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string[];
  activities: string[];
  locations: string[];
}

export interface ReviewItem {
  author: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
}

export interface TripDetail extends TripProduct {
  overview: string;
  highlights: string[];
  ageRange: string;
  maxGroupSize: number;
  operatedBy: string;
  transportModes: string[];
  accommodationTypes: string[];
  itinerary: ItineraryDay[];
  includedMeals: string;
  inclusions: string[];
  exclusions: string[];
  reviews: ReviewItem[];
}

// ─── Search / Filtering ─────────────────────────────────────
export interface FilterOption {
  label: string;
  value: string;
  count: number;
  checked: boolean;
}

export interface FacetGroup {
  name: string;
  key: string;
  options: FilterOption[];
}

export interface SearchResponse {
  hits: TripProduct[];
  totalHits: number;
  query: string;
  page: number;
  totalPages: number;
  facets: FacetGroup[];
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc' | 'rating-desc';

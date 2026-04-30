import type { SearchResponse, TripDocument } from '~/types/trip'

/**
 * useTypesenseSearch Composable
 * 
 * This composable encapsulates all search-related state and logic for the frontend UI.
 * It manages the reactive query, active filters, sorting, and pagination state. 
 * It provides a function to trigger a search request to the Nuxt server-side API
 * (`/api/search`), and exposes the resulting `hits` and `facets` back to the UI.
 * This effectively replaces Algolia's InstantSearch widgets with custom Nuxt logic.
 */

export const useTypesenseSearch = () => {
  // 1. Define reactive state for the search inputs
  const query = ref('')
  
  // 2. Define reactive state for pagination and sorting
  const page = ref(1)
  const sortBy = ref('recommended') // e.g., 'price-asc', 'duration-desc'

  // 3. Define reactive state for active filters
  const filters = reactive({
    destinations: [] as string[],
    durationMin: undefined as number | undefined,
    durationMax: undefined as number | undefined,
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    deals: [] as string[],
    showNewTrips: false,
    physicalRating: [] as number[],
    styles: [] as string[],
    themes: [] as string[],
  })

  // 4. Define reactive state for the API response
  const results = ref<TripDocument[]>([])
  const facets = ref<Record<string, any>>({})
  const totalHits = ref(0)
  const totalPages = ref(1)
  const isSearching = ref(false)

  /**
   * Triggers a search request to the Nuxt API.
   * Watches for changes in `query`, `page`, `sortBy`, or `filters` 
   * and can be configured to auto-fetch or debounce.
   */
  const performSearch = async () => {
    isSearching.value = true
    
    try {
      const response = await $fetch<SearchResponse>('/api/search', {
        method: 'POST',
        body: {
          q: query.value,
          page: page.value,
          filters,
          sortBy: sortBy.value,
        },
      })
      
      results.value = response.hits
      facets.value = response.facets
      totalHits.value = response.totalHits
      totalPages.value = response.totalPages
    } catch (error) {
      console.error('Typesense search failed:', error)
      // Handle error gracefully in UI
    } finally {
      isSearching.value = false
    }
  }

  // 5. Expose methods to update filters, clear filters, change page, etc.
  const setPage = (newPage: number) => {
    page.value = newPage
  }
  
  const clearFilters = () => {
    filters.destinations = []
    filters.durationMin = undefined
    filters.durationMax = undefined
    filters.priceMin = undefined
    filters.priceMax = undefined
    filters.deals = []
    filters.showNewTrips = false
    filters.physicalRating = []
    filters.styles = []
    filters.themes = []
  }

  return {
    query,
    page,
    sortBy,
    filters,
    results,
    facets,
    totalHits,
    totalPages,
    isSearching,
    performSearch,
    setPage,
    clearFilters
  }
}

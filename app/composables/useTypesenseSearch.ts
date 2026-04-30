import type { SearchResponse, TripDocument } from '~/types/trip'
import useRegion from '~/composables/useRegion'

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
  const sortBy = ref('relevance') // 'relevance' means Typesense relevance (no sort_by)
  // 2.b Grouping (return one document per product)
  const groupBy = ref<string | null>('productId')
  const groupLimit = ref<number>(1)
  const geo = ref<{ lat?: number; lng?: number; radiusKm?: number }>({})
  const filterLogic = ref<'AND' | 'OR'>('AND')
  const typoTolerance = ref<boolean | undefined>(undefined)

  // 3. Define reactive state for active filters
  const filters = reactive({
    destinations: [] as string[],
    durationMin: undefined as number | undefined,
    durationMax: undefined as number | undefined,
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
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
      const { region } = useRegion()
      const currency = region?.value?.code || 'USD'

      const response = await $fetch<SearchResponse>('/api/search', {
        method: 'POST',
        body: {
          q: query.value,
          page: page.value,
          filters,
          sortBy: sortBy.value,
          group_by: groupBy.value || undefined,
          group_limit: groupLimit.value || undefined,
          geo: geo.value,
          filterLogic: filterLogic.value,
          typoTolerance: typoTolerance.value,
          currency,
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
    groupBy,
    groupLimit,
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

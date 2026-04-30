<script setup lang="ts">
useHead({ title: 'Search Results | Intrepid Travel' })

import { provide } from 'vue'

const search = useTypesenseSearch()

const {
  query,
  page,
  sortBy,
  results,
  totalHits,
  totalPages,
  isSearching,
  performSearch,
  setPage,
  filters,
  facets,
} = search

provide('search', search)

const searchQuery = ref('')

type SearchPayload = string | { query?: string; startDate?: string; endDate?: string }

const onSearch = async (value: SearchPayload) => {
  if (typeof value === 'string') {
    query.value = value
    searchQuery.value = value
    filters.startDate = undefined
    filters.endDate = undefined
  } else {
    query.value = value.query || ''
    searchQuery.value = value.query || ''
    filters.startDate = value.startDate || undefined
    filters.endDate = value.endDate || undefined
  }
  setPage(1)
  await performSearch()
}

watch(sortBy, async () => {
  setPage(1)
  await performSearch()
})

watch(page, async () => {
  await performSearch()
})

onMounted(async () => {
  await performSearch()
})
</script>

<template>
  <div class="search-page">
    <!-- ── Header Area ─────────────────────────────────────── -->
    <div class="search-header-area">
      <div class="breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span class="bc-sep">></span>
        <span>Search</span>
      </div>
      <h1 class="page-title">{{ totalHits }} trips found for "{{ searchQuery || query }}"</h1>
      
      <div class="main-search-bar-wrap">
        <SearchBar v-model="searchQuery" @search="onSearch" />
      </div>
    </div>

    <!-- ── Results Bar ─────────────────────────────────────── -->
    <div class="results-bar" id="results-bar">
      <div class="results-bar__left">
        <!-- Optional: active filters could go here -->
      </div>
      <div class="results-bar__right">
        <SearchSortDropdown v-model="sortBy" />
      </div>
    </div>

    <!-- ── Main Layout ─────────────────────────────────────── -->
    <div class="search-layout">
      <!-- Sidebar -->
      <SearchFilterSidebar />

      <!-- Results -->
      <div class="results-area">
        <div class="trip-grid">
          <SearchTripCard
            v-for="trip in results"
            :key="trip.id"
            :id="trip.id"
            :name="trip.name"
            :duration="trip.duration"
            :destinations="trip.destinations"
            :trip-style="trip.style"
            :map-url="trip.mapUrl"
            :image-url="trip.imageUrl"
            :price="trip.price"
            :original-price="trip.originalPrice"
            :discount-price="trip.discountPrice"
            :on-sale="trip.onSale"
            :sale-badge="trip.saleBadge"
            :rating="trip.rating"
            :review-count="trip.reviewCount"
            :physical-rating="trip.physicalRating"
            :themes="trip.themes"
            :slug="trip.slug"
            :lowest-price-date="trip.lowestPriceDate"
            currency="USD"
          />
        </div>

        <p v-if="!isSearching && results.length === 0" class="empty-state">No trips found.</p>

        <!-- Pagination -->
        <SearchPaginationBar v-model:current-page="page" :total-pages="totalPages" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
.empty-state {
  padding: var(--space-6) 0;
  color: var(--gray-600);
  text-align: center;
}

/* ── Header Area ───────────────────────────────────────────── */
.search-header-area {
  padding: var(--space-6) 0 var(--space-4);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 11px;
  color: var(--gray-600);
  margin-bottom: var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.breadcrumb a { color: var(--gray-600); text-decoration: none; }
.breadcrumb a:hover { color: var(--intrepid-red); }
.bc-sep { color: var(--gray-400); font-size: 10px; }

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.main-search-bar-wrap {
  margin-bottom: var(--space-4);
}

/* ── Results Bar ───────────────────────────────────────────── */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 var(--space-4) 0;
  margin-bottom: var(--space-4);
}

/* ── Layout ────────────────────────────────────────────────── */
.search-layout {
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;
  padding-bottom: var(--space-16);
}
.results-area {
  flex: 1;
  min-width: 0;
}

/* ── Trip Grid ─────────────────────────────────────────────── */
.trip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}
@media (max-width: 1200px) {
  .trip-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .search-layout { flex-direction: column; }
  .trip-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .trip-grid { grid-template-columns: 1fr; }
  .results-bar { flex-direction: column; align-items: flex-start; }
}
</style>

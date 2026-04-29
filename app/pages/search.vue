<script setup lang="ts">
useHead({ title: 'Search Results — Vietnam | Intrepid Travel' })

const searchQuery = ref('Vietnam')
const sortBy = ref('recommended')
const currentPage = ref(1)
const totalPages = ref(3)

const totalTrips = 247

const trips = ref([
  {
    id: '1',
    name: 'Best of Vietnam',
    duration: 12,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'best-of-vietnam-166796',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Vietnam+Route+Map',
    imageUrl: 'https://placehold.co/400x300/2196F3/ffffff?text=Ha+Long+Bay',
    price: 2195,
    originalPrice: 2595,
    discountPrice: 2195,
    onSale: true,
    saleBadge: 'Save 15%',
    rating: 4.9,
    reviewCount: 617,
    physicalRating: 3,
    themes: ['Explorer', 'Cultural'],
    lowestPriceDate: 'Sep 14, 2026',
  },
  {
    id: '2',
    name: 'Premium Vietnam in Depth',
    duration: 14,
    destinations: ['Vietnam'],
    style: 'Premium',
    slug: 'premium-vietnam-in-depth',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Vietnam+Route',
    imageUrl: 'https://placehold.co/400x300/FF9800/ffffff?text=Hoi+An',
    price: 5295,
    rating: 4.8,
    reviewCount: 234,
    physicalRating: 2,
    themes: ['Cultural', 'Food & Culinary'],
    lowestPriceDate: 'Oct 3, 2026',
  },
  {
    id: '3',
    name: 'Cycle Vietnam',
    duration: 13,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'cycle-vietnam',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Cycle+Route',
    imageUrl: 'https://placehold.co/400x300/4CAF50/ffffff?text=Cycling+Tour',
    price: 2890,
    rating: 4.7,
    reviewCount: 89,
    physicalRating: 4,
    themes: ['Cycling', 'Explorer'],
    lowestPriceDate: 'Aug 22, 2026',
  },
  {
    id: '4',
    name: 'Vietnam Real Food Adventure',
    duration: 12,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'vietnam-real-food-adventure',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Food+Route',
    imageUrl: 'https://placehold.co/400x300/E91E63/ffffff?text=Food+Adventure',
    price: 3150,
    originalPrice: 3500,
    discountPrice: 3150,
    onSale: true,
    saleBadge: 'Save 10%',
    rating: 4.8,
    reviewCount: 156,
    physicalRating: 2,
    themes: ['Food & Culinary', 'Cultural'],
    lowestPriceDate: 'Nov 1, 2026',
  },
  {
    id: '5',
    name: 'Vietnam Family Holiday',
    duration: 9,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'vietnam-family-holiday',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Family+Route',
    imageUrl: 'https://placehold.co/400x300/9C27B0/ffffff?text=Family+Holiday',
    price: 2480,
    rating: 4.6,
    reviewCount: 73,
    physicalRating: 2,
    themes: ['Family', 'Explorer'],
    lowestPriceDate: 'Jul 18, 2026',
  },
  {
    id: '6',
    name: 'Simply Vietnam',
    duration: 8,
    destinations: ['Vietnam'],
    style: 'Basix',
    slug: 'simply-vietnam',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Simple+Route',
    imageUrl: 'https://placehold.co/400x300/00BCD4/ffffff?text=Mekong+Delta',
    price: 1535,
    rating: 4.5,
    reviewCount: 312,
    physicalRating: 3,
    themes: ['Explorer'],
    lowestPriceDate: 'Jun 10, 2026',
  },
  {
    id: '7',
    name: 'Vietnam Explorer',
    duration: 10,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'vietnam-explorer',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Explorer+Route',
    imageUrl: 'https://placehold.co/400x300/795548/ffffff?text=Sapa+Trek',
    price: 2210,
    rating: 4.7,
    reviewCount: 198,
    physicalRating: 3,
    themes: ['Explorer', 'Trekking & Hiking'],
    lowestPriceDate: 'Sep 28, 2026',
  },
  {
    id: '8',
    name: 'Vietnam Hike, Bike & Kayak',
    duration: 10,
    destinations: ['Vietnam'],
    style: 'Original',
    slug: 'vietnam-hike-bike-kayak',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Active+Route',
    imageUrl: 'https://placehold.co/400x300/FF5722/ffffff?text=Active+Adventure',
    price: 2675,
    rating: 4.8,
    reviewCount: 64,
    physicalRating: 4,
    themes: ['Cycling', 'Trekking & Hiking'],
    lowestPriceDate: 'Oct 14, 2026',
  },
  {
    id: '9',
    name: 'Comfort Vietnam',
    duration: 11,
    destinations: ['Vietnam'],
    style: 'Comfort',
    slug: 'comfort-vietnam',
    mapUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Comfort+Route',
    imageUrl: 'https://placehold.co/400x300/3F51B5/ffffff?text=Luxury+Tour',
    price: 3890,
    rating: 4.9,
    reviewCount: 147,
    physicalRating: 2,
    themes: ['Cultural', 'Explorer'],
    lowestPriceDate: 'Dec 5, 2026',
  },
])
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
      <h1 class="page-title">14 trips found for "{{ searchQuery }}"</h1>
      
      <div class="main-search-bar-wrap">
        <SearchBar v-model="searchQuery" />
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
            v-for="trip in trips"
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

        <!-- Pagination -->
        <SearchPaginationBar v-model:current-page="currentPage" :total-pages="totalPages" />
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

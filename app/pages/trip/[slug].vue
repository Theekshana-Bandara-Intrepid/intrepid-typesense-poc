<script setup lang="ts">
const route = useRoute()
const { fetchTripBySlug } = useTrip()

const slug = computed(() => route.params.slug as string)
const { trip, pending } = await fetchTripBySlug(slug.value)

const tripStyles = computed(() => trip.value?.styles?.length ? trip.value.styles : trip.value ? [trip.value.style] : [])

useHead(() => ({
  title: trip.value ? `${trip.value.name} — ${trip.value.duration} Days | Intrepid Travel` : 'Trip Details | Intrepid Travel',
}))
</script>

<template>
  <div class="product-page">
    <div v-if="pending" class="loading-state">Loading trip details...</div>

    <template v-else-if="trip">
      <ProductPricingStickyBar :name="trip.name" :price="trip.price" currency="USD" />

      <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span class="bc-sep">></span>
      <NuxtLink to="/search">Asia</NuxtLink>
      <span class="bc-sep">></span>
      <NuxtLink to="/search">Sri Lanka</NuxtLink>
      <span class="bc-sep">></span>
      <span>{{ trip.name }}</span>
      </div>

    <!-- Title Section -->
      <div class="title-section">
      <h1 class="trip-title">{{ trip.name }}</h1>
      <div class="title-badges">
        <SearchStyleBadge :trip-style="tripStyles[0]" />
      </div>
      </div>

    <!-- Hero & Summary Layout -->
      <div class="top-layout">
      <div class="top-main">
        <ProductTripHero :images="trip.productImages" />
      </div>
      <div class="top-sidebar">
        <ProductSummaryBox
          :rating="trip.rating"
          :review-count="trip.reviewCount"
          :product-code="trip.productCode"
          :duration="trip.duration"
          :start-city="trip.startCity"
          :end-city="trip.endCity"
          :min-age="trip.ageRange"
          :physical-rating="trip.physicalRating"
          :styles="tripStyles"
          :price="trip.price"
          currency="USD"
        />
      </div>
      </div>

      <ProductTripHighlights v-if="trip.highlights && trip.highlights.length > 0" :highlights="trip.highlights" />

      <ProductItineraryAccordion
        v-if="trip.itinerary && trip.itinerary.length > 0"
        :days="trip.itinerary"
        :map-url="trip.mapUrl"
        :map-alt="trip.mapAlt"
      />


      <ProductDatesAndPrices :departures="trip.departures" currency="USD" />
    </template>

    <div v-else class="loading-state">Trip not found.</div>
  </div>
</template>

<style scoped>
.product-page {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
.loading-state {
  padding: var(--space-8) 0;
  font-size: var(--font-size-base);
  color: var(--gray-600);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}
.breadcrumb a { color: var(--gray-600); }
.breadcrumb a:hover { color: var(--intrepid-red); }
.bc-sep { color: var(--gray-400); font-size: 10px; }

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-4);
}
.trip-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
}
.title-badges {
  display: flex;
  align-items: center;
}

.top-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  align-items: flex-start;
}
.top-main {
  min-width: 0;
}

@media (max-width: 900px) {
  .top-layout {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
interface Day {
  day: number
  title: string
  description: string
  accommodation: string
  meals: string[]
  activities: string[]
}

defineProps<{
  days: Day[]
  mapUrl: string
  mapAlt: string
}>()
</script>

<template>
  <section class="itinerary-section" id="itinerary-section">
    <h2 class="section-title">Itinerary</h2>

    <div class="itinerary-layout">
      <!-- Route map on the left -->
      <div class="itinerary-map">
        <div class="map-card">
          <img :src="mapUrl" :alt="mapAlt" class="map-image" loading="lazy" @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Map+Not+Found'" />
        </div>
      </div>

      <!-- Day-by-day accordion on the right -->
      <div class="itinerary-days">
        <ProductItineraryDay
          v-for="day in days"
          :key="day.day"
          :day="day.day"
          :title="day.title"
          :description="day.description"
          :accommodation="day.accommodation"
          :meals="day.meals"
          :activities="day.activities"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.itinerary-section {
  padding: var(--space-10) 0;
  border-top: 1px solid var(--gray-200);
}
.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--gray-900);
}
.itinerary-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-8);
  align-items: flex-start;
}
.map-card {
  background: var(--gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  border: 1px solid var(--gray-200);
  position: sticky;
  top: calc(var(--header-height) + var(--space-6));
}
.map-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}
.itinerary-days {
  border-top: 1px solid var(--gray-200);
}

@media (max-width: 900px) {
  .itinerary-layout {
    grid-template-columns: 1fr;
  }
  .map-card {
    position: static;
  }
}
</style>

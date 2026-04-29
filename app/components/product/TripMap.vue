<script setup lang="ts">
defineProps<{
  mapUrl: string
  mapAlt: string
}>()
</script>

<template>
  <section class="trip-map">
    <h2 class="section-title">Route Map</h2>
    <div class="map-wrapper">
      <img :src="mapUrl" :alt="mapAlt" class="map-image" loading="lazy" />
    </div>
  </section>
</template>

<style scoped>
.trip-map { padding: var(--space-8) 0; }
.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-5);
}
.map-wrapper {
  background: var(--gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
}
.map-image {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: var(--radius-sm);
}
</style>

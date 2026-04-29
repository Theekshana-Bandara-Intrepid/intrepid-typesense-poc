<script setup lang="ts">
defineProps<{
  duration: number
  destinations: string[]
  startCity: string
  endCity: string
  ageRange: string
  maxGroupSize: number
  physicalRating: number
  productCode: string
}>()
</script>

<template>
  <div class="overview">
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Duration</span>
        <span class="fact-value">{{ duration }} Days</span>
      </div>
    </div>
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Destinations</span>
        <span class="fact-value">{{ destinations.join(', ') }}</span>
      </div>
    </div>
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Cities</span>
        <span class="fact-value">{{ startCity }} → {{ endCity }}</span>
      </div>
    </div>
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Max Group Size</span>
        <span class="fact-value">{{ maxGroupSize }}</span>
      </div>
    </div>
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Age Range</span>
        <span class="fact-value">{{ ageRange }}</span>
      </div>
    </div>
    <div class="fact">
      <div class="fact-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div class="fact-content">
        <span class="fact-label">Physical Rating</span>
        <div class="dots">
          <span v-for="i in 5" :key="i" class="dot" :class="{ filled: i <= physicalRating }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  padding: var(--space-6) 0;
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
}
.fact {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}
.fact-icon { flex-shrink: 0; margin-top: 2px; }
.fact-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}
.fact-value {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--gray-900);
}
.dots { display: flex; gap: 3px; margin-top: 4px; }
.dot {
  width: 10px; height: 10px;
  border-radius: var(--radius-full);
  background: var(--gray-200);
}
.dot.filled { background: var(--gray-800); }
</style>

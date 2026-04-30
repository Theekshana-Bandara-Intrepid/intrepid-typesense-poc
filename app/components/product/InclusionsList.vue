<script setup lang="ts">
defineProps<{
  inclusions: string[]
  exclusions: string[]
}>()
</script>

<template>
  <section class="inclusions">
    <h2 class="section-title">What's included</h2>
    <div class="inc-grid">
      <div class="inc-col">
        <h3 class="inc-heading included">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-green)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Included
        </h3>
        <ul class="inc-list">
          <li v-for="item in inclusions" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="inc-col">
        <h3 class="inc-heading excluded">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-red)" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Not included
        </h3>
        <ul class="inc-list">
          <li v-for="item in exclusions" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.inclusions { padding: var(--space-8) 0; }
.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-5);
}
.inc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}
.inc-heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--space-4);
}
.inc-list li {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--gray-100);
  line-height: 1.5;
}
@media (max-width: 640px) {
  .inc-grid { grid-template-columns: 1fr; }
}
</style>

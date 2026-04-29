<script setup lang="ts">
defineProps<{
  highlights: string[]
}>()
</script>

<template>
  <section class="highlights">
    <h2 class="section-title">Why you'll love this trip</h2>
    <ul class="highlight-list">
      <li v-for="(item, i) in highlights" :key="i" class="highlight-item">
        <svg class="check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--intrepid-green)" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.highlights {
  padding: var(--space-8) 0;
}
.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-5);
}
.highlight-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-3);
}
.highlight-item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: var(--font-size-base);
  color: var(--gray-800);
  line-height: 1.5;
}
.check { flex-shrink: 0; margin-top: 2px; }
</style>

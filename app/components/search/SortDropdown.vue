<script setup lang="ts">
const sortBy = defineModel<string>({ default: 'recommended' })

const options = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Duration: Short to Long', value: 'duration-asc' },
  { label: 'Duration: Long to Short', value: 'duration-desc' },
  { label: 'Rating: Highest', value: 'rating-desc' },
  { label: 'Newest first', value: 'newest' },
]
</script>

<template>
  <div class="sort-dropdown" id="sort-dropdown">
    <label class="sort-label" for="sort-select">Sort by</label>
    <div class="sort-select-wrap">
      <select id="sort-select" v-model="sortBy" class="sort-select">
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <svg class="sort-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.sort-dropdown {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.sort-label {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  white-space: nowrap;
  font-weight: 500;
}
.sort-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.sort-select {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-800);
  padding: var(--space-2) var(--space-8) var(--space-2) var(--space-3);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  background: var(--white);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color var(--transition-fast);
}
.sort-select:focus {
  border-color: var(--intrepid-red);
  outline: none;
}
.sort-select:hover {
  border-color: var(--gray-300);
}
.sort-chevron {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: var(--gray-500);
}
</style>

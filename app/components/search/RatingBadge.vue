<script setup lang="ts">
defineProps<{
  rating: number
  count: number
}>()
</script>

<template>
  <div class="rating-badge">
    <div class="stars">
      <svg v-for="i in 5" :key="i" width="14" height="14" viewBox="0 0 24 24"
        :class="['star', { filled: i <= Math.round(rating) }]">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <span class="count">{{ rating }} ({{ count }} reviews)</span>
  </div>
</template>

<style scoped>
.rating-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.stars { display: flex; gap: 1px; }
.star {
  fill: var(--gray-300);
  stroke: none;
}
.star.filled {
  fill: var(--intrepid-orange);
}
.count {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}
</style>

<script setup lang="ts">
defineProps<{ tripStyle: string }>()

const colorMap: Record<string, string> = {
  Original: '#0077CC',
  Comfort: '#2E7D32',
  Premium: '#B8860B',
  Basix: '#E65100',
}
</script>

<template>
  <span class="badge" :style="{ background: colorMap[tripStyle] || '#666' }">
    {{ tripStyle }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  color: var(--white);
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
  letter-spacing: 0.02em;
}
</style>

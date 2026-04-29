<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }
  return pages
})

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      class="page-btn prev"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Prev
    </button>

    <template v-if="visiblePages[0] > 1">
      <button class="page-btn" @click="goTo(1)">1</button>
      <span v-if="visiblePages[0] > 2" class="ellipsis">…</span>
    </template>

    <button
      v-for="page in visiblePages"
      :key="page"
      class="page-btn"
      :class="{ active: page === currentPage }"
      @click="goTo(page)"
    >
      {{ page }}
    </button>

    <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
      <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="ellipsis">…</span>
      <button class="page-btn" @click="goTo(totalPages)">{{ totalPages }}</button>
    </template>

    <button
      class="page-btn next"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
    >
      Next
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-8) 0;
}
.page-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-700);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  min-width: 36px;
  justify-content: center;
}
.page-btn:hover:not(:disabled):not(.active) {
  background: var(--gray-100);
  color: var(--intrepid-red);
}
.page-btn.active {
  background: var(--intrepid-red);
  color: var(--white);
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ellipsis {
  padding: 0 var(--space-1);
  color: var(--gray-400);
}
</style>

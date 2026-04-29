<script setup lang="ts">
defineProps<{
  name: string
  expanded?: boolean
}>()

const isOpen = ref(true)
</script>

<template>
  <div class="filter-group">
    <button class="filter-header" @click="isOpen = !isOpen">
      <span class="filter-name">{{ name }}</span>
      <svg
        class="chevron"
        :class="{ open: isOpen }"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <Transition name="collapse">
      <div v-show="isOpen" class="filter-body">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.filter-group {
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-4) 0;
}
.filter-group:last-child {
  border-bottom: none;
}
.filter-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  background: none;
}
.filter-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-800);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.chevron {
  transition: transform var(--transition-fast);
  color: var(--gray-400);
}
.chevron.open { transform: rotate(180deg); }
.filter-body {
  padding-top: var(--space-3);
}
.collapse-enter-active, .collapse-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}
.collapse-enter-from, .collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
.collapse-enter-to, .collapse-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>

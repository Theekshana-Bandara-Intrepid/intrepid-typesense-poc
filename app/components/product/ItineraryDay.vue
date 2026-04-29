<script setup lang="ts">
defineProps<{
  day: number
  title: string
  description: string
  accommodation: string
  meals: string[]
  activities: string[]
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="day" :class="{ open: isOpen }">
    <button class="day-header" @click="isOpen = !isOpen">
      <div class="day-marker">
        <span class="day-number">Day {{ day }}</span>
      </div>
      <h3 class="day-title">{{ title }}</h3>
      <svg class="chevron" :class="{ rotated: isOpen }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <Transition name="slide">
      <div v-show="isOpen" class="day-body">
        <p class="day-desc">{{ description }}</p>
        <div class="day-details">
          <div v-if="accommodation" class="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span>{{ accommodation }}</span>
          </div>
          <div v-if="meals.length" class="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
            <span>{{ meals.join(', ') }}</span>
          </div>
        </div>
        <div v-if="activities.length" class="day-activities">
          <span v-for="act in activities" :key="act" class="activity-tag">{{ act }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.day {
  border-bottom: 1px solid var(--gray-200);
}
.day-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  text-align: left;
}
.day-marker {
  background: var(--intrepid-red);
  color: var(--white);
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  white-space: nowrap;
}
.day-title {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 600;
}
.chevron {
  color: var(--gray-400);
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}
.chevron.rotated { transform: rotate(180deg); }
.day-body {
  padding: 0 0 var(--space-5) calc(70px + var(--space-4));
}
.day-desc {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  line-height: 1.7;
  margin-bottom: var(--space-4);
}
.day-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}
.detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}
.day-activities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.activity-tag {
  font-size: var(--font-size-xs);
  color: var(--intrepid-red);
  background: var(--intrepid-red-light);
  padding: 2px var(--space-3);
  border-radius: var(--radius-full);
}
.slide-enter-active, .slide-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>

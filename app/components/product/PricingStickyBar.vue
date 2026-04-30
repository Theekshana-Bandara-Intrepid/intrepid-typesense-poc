<script setup lang="ts">
defineProps<{
  name: string
  price: number
  currency?: string
}>()

const isVisible = ref(false)

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

function checkScroll() {
  isVisible.value = window.scrollY > 400
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <Transition name="slide-down">
    <div v-show="isVisible" class="sticky-bar">
      <div class="sticky-inner">
        <h3 class="sticky-title">{{ name }}</h3>
        <div class="sticky-right">
          <span class="sticky-price">
            From {{ formatPrice(price, currency || 'USD') }} pp
          </span>
          <button class="sticky-cta">See dates &amp; prices</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sticky-bar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  z-index: 90;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
}
.sticky-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-3) var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sticky-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--gray-900);
}
.sticky-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.sticky-price {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--gray-900);
}
.sticky-cta {
  background: var(--intrepid-red);
  color: var(--white);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--font-size-base);
  transition: background var(--transition-fast);
}
.sticky-cta:hover { background: var(--intrepid-red-dark); }
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

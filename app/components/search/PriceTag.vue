<script setup lang="ts">
defineProps<{
  price: number
  discountPrice?: number
  currency?: string
  onSale?: boolean
}>()

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <div class="price-tag">
    <span class="price-label">From</span>
    <span v-if="onSale && discountPrice" class="price-original">
      {{ formatPrice(price, currency || 'USD') }}
    </span>
    <span class="price-current" :class="{ sale: onSale }">
      {{ formatPrice(onSale && discountPrice ? discountPrice : price, currency || 'USD') }}
    </span>
    <span class="price-suffix">pp</span>
  </div>
</template>

<style scoped>
.price-tag {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  flex-wrap: wrap;
}
.price-label {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}
.price-original {
  font-size: var(--font-size-sm);
  color: var(--gray-400);
  text-decoration: line-through;
}
.price-current {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--gray-900);
}
.price-current.sale {
  color: var(--intrepid-red);
}
.price-suffix {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}
</style>

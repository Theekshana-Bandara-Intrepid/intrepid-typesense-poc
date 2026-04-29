<script setup lang="ts">
defineProps<{
  rating: number
  reviewCount: number
  productCode: string
  duration: number
  startCity: string
  endCity: string
  minAge: string
  physicalRating: number
  styles: string[]
  price: number
  currency?: string
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
  <div class="summary-box">
    <!-- Header: Reviews & Code -->
    <div class="sb-header">
      <div class="sb-reviews">
        <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="var(--intrepid-orange)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <span class="rating-val">{{ rating }}</span>
        <span class="review-count"><a href="#reviews">{{ reviewCount }} reviews</a></span>
      </div>
      <div class="sb-code">Trip code: <strong>{{ productCode }}</strong></div>
    </div>

    <!-- Stats Grid -->
    <div class="sb-stats">
      <div class="sb-stat">
        <span class="stat-label">Duration</span>
        <span class="stat-val">{{ duration }} days</span>
      </div>
      <div class="sb-stat">
        <span class="stat-label">Cities</span>
        <span class="stat-val">{{ startCity }} → {{ endCity }}</span>
      </div>
      <div class="sb-stat">
        <span class="stat-label">Minimum age</span>
        <span class="stat-val">{{ minAge }} years old</span>
      </div>
      <div class="sb-stat">
        <span class="stat-label">Travel style</span>
        <span class="stat-val">{{ styles.join(', ') }}</span>
      </div>
      <div class="sb-stat">
        <span class="stat-label">Physical rating</span>
        <div class="dots">
          <span v-for="i in 5" :key="i" class="dot" :class="{ filled: i <= physicalRating }"></span>
        </div>
      </div>
    </div>

    <!-- Price & CTA -->
    <div class="sb-price-section">
      <div class="price-wrap">
        <span class="price-from">From</span>
        <span class="price-amount">{{ formatPrice(price, currency || 'USD') }}</span>
      </div>
      <button class="cta-btn">View dates and prices</button>
      <button class="wishlist-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Add to Wishlist
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary-box {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

/* Header */
.sb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
}
.sb-reviews {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.rating-val { font-weight: 700; color: var(--gray-900); }
.review-count a { color: var(--intrepid-blue); text-decoration: underline; }
.sb-code { color: var(--gray-500); }
.sb-code strong { color: var(--gray-900); }

/* Stats Grid */
.sb-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.sb-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-label {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-val {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-900);
}
.dots {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-200);
}
.dot.filled { background: var(--gray-800); }

/* Price & CTA */
.sb-price-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}
.price-wrap {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.price-from {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  text-transform: uppercase;
}
.price-amount {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
}
.cta-btn {
  width: 100%;
  background: var(--intrepid-red);
  color: var(--white);
  padding: var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-md);
  font-weight: 700;
  transition: background var(--transition-fast);
}
.cta-btn:hover { background: var(--intrepid-red-dark); }
.wishlist-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-700);
  background: transparent;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}
.wishlist-btn:hover { background: var(--gray-50); }
</style>

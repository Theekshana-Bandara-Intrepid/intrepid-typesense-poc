<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  duration: number
  destinations: string[]
  tripStyle: string
  mapUrl: string
  imageUrl: string
  price: number
  discountPrice?: number
  originalPrice?: number
  onSale?: boolean
  saleBadge?: string
  currency?: string
  rating: number
  reviewCount: number
  physicalRating: number
  themes?: string[]
  slug: string
  lowestPriceDate?: string
}>()

const wishlisted = ref(false)
const compareAdded = ref(false)

import useRegion from '~/composables/useRegion'
const { region } = useRegion()

function formatPrice(amount: number, currency: string): string {
  const locale = (region && region.value && region.value.locale) || 'en-US'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch (e) {
    return String(amount)
  }
}
</script>

<template>
  <article class="trip-card" :id="`trip-card-${id}`">
    <!-- ── Image Area ──────────────────────────────────────── -->
    <div class="card-image">
      <NuxtLink :to="`/trip/${slug}`" class="card-overlay-link" :aria-label="`View ${name} details`"></NuxtLink>
      <img :src="mapUrl" :alt="`Route map for ${name}`" class="map-img" loading="lazy" @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Image+Not+Found'" />

      <!-- Sale badge / Promos -->
      <div v-if="onSale && saleBadge" class="sale-badge">
        {{ saleBadge }}
      </div>

      <!-- Wishlist button -->
      <button
        class="wishlist-btn"
        :class="{ active: wishlisted }"
        @click.prevent="wishlisted = !wishlisted"
        :aria-label="wishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
        :id="`wishlist-btn-${id}`"
      >
        <Icon 
          name="lucide:heart" 
          size="16" 
          :style="{ fill: wishlisted ? '#E41D39' : 'none', color: wishlisted ? '#E41D39' : 'currentColor' }" 
        />
      </button>
    </div>

    <!-- ── Card Body ───────────────────────────────────────── -->
    <div class="card-body">
      <!-- Rating (moved above title based on screenshot) -->
      <div class="card-rating">
        <Icon name="mdi:star" size="14" style="color: var(--intrepid-orange);" />
        <span class="rating-text">{{ rating }}</span>
        <span class="review-count">({{ reviewCount }})</span>
      </div>

      <NuxtLink :to="`/trip/${slug}`" class="card-title-link">
        <h3 class="card-title">{{ name }}</h3>
      </NuxtLink>

      <!-- Meta row: Duration & Destination -->
      <p class="card-meta">
        <span>{{ duration }} days • {{ destinations[0] }}</span>
      </p>

      <!-- Themes & Style (shown as small pills) -->
      <div class="card-themes">
        <span class="theme-tag">{{ tripStyle }}</span>
        <span v-for="theme in themes?.slice(0, 2)" :key="theme" class="theme-tag">
          {{ theme }}
        </span>
      </div>

      <!-- Physical Rating -->
      <div class="physical-rating">
        <span class="physical-label">Physical rating:</span>
        <div class="physical-bars">
          <span
            v-for="i in 5"
            :key="i"
            class="physical-bar"
            :class="{ filled: i <= physicalRating }"
          />
        </div>
      </div>
      
      <button
        class="compare-btn"
        :class="{ active: compareAdded }"
        @click.prevent="compareAdded = !compareAdded"
        :id="`compare-btn-${id}`"
      >
        <span v-if="!compareAdded">+</span><span v-else>✓</span> Add to compare
      </button>
    </div>

    <!-- ── Card Footer (Pricing) ─────────────────── -->
    <div class="card-footer">
      <div class="pricing-area">
        <div class="price-row">
          <span class="price-from-label">From</span>
          <span class="price-current">
            {{ formatPrice(onSale && discountPrice ? discountPrice : price, currency || 'USD') }}
          </span>
        </div>
        <div v-if="onSale && originalPrice && discountPrice" class="sale-save-pill">
          Save up to {{ formatPrice(originalPrice - discountPrice, currency || 'USD') }}*
        </div>
        <span v-if="lowestPriceDate" class="lowest-date">
          Lowest price {{ lowestPriceDate }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.trip-card {
  background: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-100);
}
.trip-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

/* ── Image Area ────────────────────────────────────────────── */
.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--gray-100);
}
.card-overlay-link {
  position: absolute;
  inset: 0;
  z-index: 5;
}
.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.trip-card:hover .map-img {
  transform: scale(1.03);
}
.sale-badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  background: var(--intrepid-green);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  z-index: 6;
}
.wishlist-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  z-index: 6;
  border: none;
  cursor: pointer;
}
.wishlist-btn:hover {
  transform: scale(1.1);
}
.wishlist-btn.active {
  color: var(--intrepid-red);
}

/* ── Card Body ─────────────────────────────────────────────── */
.card-body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  position: relative;
  z-index: 6;
  pointer-events: none; /* Let overlay link handle clicks */
}
.card-body > * {
  pointer-events: auto; /* Buttons inside body can be clicked */
}
.card-title-link { text-decoration: none; display: block; margin-top: 2px;}
.card-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.3;
}
.card-title-link:hover .card-title {
  color: var(--intrepid-red);
}
.card-meta {
  font-size: 11px;
  color: var(--gray-600);
  margin-bottom: var(--space-1);
}

/* ── Rating ────────────────────────────────────────────────── */
.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
}
.rating-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--gray-800);
}
.review-count {
  font-size: 11px;
  color: var(--gray-500);
}

/* ── Themes ────────────────────────────────────────────────── */
.card-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--space-2);
}
.theme-tag {
  font-size: 10px;
  color: var(--gray-700);
  background: var(--gray-100);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

/* ── Physical Rating ───────────────────────────────────────── */
.physical-rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.physical-label {
  font-size: 10px;
  color: var(--gray-500);
}
.physical-bars {
  display: flex;
  gap: 2px;
}
.physical-bar {
  width: 14px;
  height: 4px;
  border-radius: 1px;
  background: var(--gray-200);
}
.physical-bar.filled {
  background: var(--gray-800);
}

.compare-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  padding: 4px 10px;
  background: transparent;
  width: fit-content;
  cursor: pointer;
}
.compare-btn:hover { background: var(--gray-50); }
.compare-btn.active { color: var(--intrepid-red); border-color: var(--intrepid-red); }

/* ── Card Footer ───────────────────────────────────────────── */
.card-footer {
  padding: 0 var(--space-4) var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: var(--white);
  position: relative;
  z-index: 6;
  pointer-events: none;
}
.pricing-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.price-from-label {
  font-size: 10px;
  color: var(--gray-500);
}
.price-current {
  font-size: var(--font-size-lg);
  font-weight: 800;
  color: var(--gray-900);
}
.sale-save-pill {
  font-size: 10px;
  font-weight: 700;
  color: var(--intrepid-green);
  background: #E8F5E9;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin-top: 2px;
  margin-bottom: 2px;
}
.lowest-date {
  font-size: 10px;
  color: var(--gray-500);
}

</style>

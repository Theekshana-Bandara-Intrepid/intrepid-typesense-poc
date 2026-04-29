<script setup lang="ts">
interface Departure {
  id: string
  startDate: string
  endDate: string
  status: 'available' | 'limited' | 'request' | 'sold-out'
  spacesLeft?: number
  price: number
  originalPrice?: number
  onSale?: boolean
  saleBadge?: string
}

defineProps<{
  departures: Departure[]
  currency?: string
}>()

const showAll = ref(false)
const dateFilter = ref('')
const sortBy = ref('date-asc')

const sortOptions = [
  { label: 'Date (soonest)', value: 'date-asc' },
  { label: 'Price (lowest)', value: 'price-asc' },
  { label: 'Price (highest)', value: 'price-desc' },
]

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusText(dep: Departure): string {
  if (dep.status === 'sold-out') return 'Sold out'
  if (dep.status === 'request') return 'Available on request'
  if (dep.status === 'limited' && dep.spacesLeft) return `${dep.spacesLeft} space${dep.spacesLeft > 1 ? 's' : ''} left`
  return 'Available'
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    'available': 'status--available',
    'limited': 'status--limited',
    'request': 'status--request',
    'sold-out': 'status--sold-out',
  }
  return map[status] || ''
}
</script>

<template>
  <section class="dates-section" id="dates-and-prices">
    <h2 class="section-title">Dates and prices</h2>

    <!-- Filter bar -->
    <div class="dates-toolbar">
      <div class="toolbar-left">
        <div class="toolbar-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="toolbar-label">Travel dates</span>
        </div>
        <p class="toolbar-hint">Prices are per person for departures in USD from</p>
      </div>
      <div class="toolbar-right">
        <div class="toolbar-filter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          <span>Filter selling</span>
        </div>
        <div class="toolbar-sort">
          <label class="sort-label" for="dates-sort">Sort by</label>
          <select id="dates-sort" v-model="sortBy" class="sort-select">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table header -->
    <div class="dates-table-header">
      <span class="col-date">Starting</span>
      <span class="col-date">Ending</span>
      <span class="col-status"></span>
      <span class="col-avail">Availability</span>
      <span class="col-price">Price per person</span>
    </div>

    <!-- Departure rows -->
    <div class="dates-table-body">
      <div
        v-for="(dep, i) in (showAll ? departures : departures.slice(0, 7))"
        :key="dep.id"
        class="departure-row"
        :id="`departure-row-${dep.id}`"
      >
        <span class="col-date">
          <span class="date-text">{{ dep.startDate }}</span>
        </span>
        <span class="col-date">
          <span class="date-text">{{ dep.endDate }}</span>
        </span>
        <span class="col-status">
          <span class="status-dot" :class="getStatusClass(dep.status)"></span>
        </span>
        <span class="col-avail">
          <span class="avail-text" :class="getStatusClass(dep.status)">
            {{ getStatusText(dep) }}
          </span>
          <span v-if="dep.onSale && dep.saleBadge" class="sale-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
            {{ dep.saleBadge }}
          </span>
        </span>
        <span class="col-price">
          <span v-if="dep.onSale && dep.originalPrice" class="price-original">
            {{ formatPrice(dep.originalPrice, currency || 'USD') }}
          </span>
          <span class="price-current" :class="{ sale: dep.onSale }">
            {{ formatPrice(dep.price, currency || 'USD') }}
          </span>
        </span>
      </div>
    </div>

    <!-- Show more -->
    <div v-if="departures.length > 7 && !showAll" class="show-more-wrap">
      <button class="show-more-btn" @click="showAll = true">
        Show more dates
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.dates-section {
  padding: var(--space-10) 0;
  border-top: 1px solid var(--gray-200);
}
.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--gray-900);
}

/* ── Toolbar ───────────────────────────────────────────────── */
.dates-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
  gap: var(--space-4);
  flex-wrap: wrap;
}
.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toolbar-field {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--gray-800);
}
.toolbar-field svg { color: var(--gray-500); }
.toolbar-hint {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.toolbar-filter {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: var(--white);
}
.toolbar-sort {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.sort-label {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  white-space: nowrap;
}
.sort-select {
  font-size: var(--font-size-sm);
  color: var(--gray-800);
  padding: var(--space-2) var(--space-6) var(--space-2) var(--space-3);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  background: var(--white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

/* ── Table Header ──────────────────────────────────────────── */
.dates-table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 40px 1.2fr 1fr;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--gray-200);
}

/* ── Departure Row ─────────────────────────────────────────── */
.departure-row {
  display: grid;
  grid-template-columns: 1fr 1fr 40px 1.2fr 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition-fast);
}
.departure-row:hover {
  background: var(--gray-50);
}
.date-text {
  font-size: var(--font-size-base);
  color: var(--gray-800);
  font-weight: 500;
}

/* ── Status Dot ────────────────────────────────────────────── */
.status-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  display: inline-block;
}
.status-dot.status--available { background: var(--intrepid-green); }
.status-dot.status--limited { background: var(--intrepid-red); }
.status-dot.status--request { background: var(--intrepid-orange); }
.status-dot.status--sold-out { background: var(--gray-400); }

/* ── Availability ──────────────────────────────────────────── */
.col-avail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.avail-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-700);
}
.avail-text.status--limited { color: var(--intrepid-red); }
.avail-text.status--request { color: var(--intrepid-orange); }
.avail-text.status--sold-out { color: var(--gray-400); }
.sale-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 600;
  color: var(--intrepid-red);
  background: var(--intrepid-red-light);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  width: fit-content;
}

/* ── Price ──────────────────────────────────────────────────── */
.col-price {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.price-original {
  font-size: var(--font-size-xs);
  color: var(--gray-400);
  text-decoration: line-through;
}
.price-current {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--gray-900);
}
.price-current.sale { color: var(--intrepid-red); }

/* ── Show More ─────────────────────────────────────────────── */
.show-more-wrap {
  text-align: center;
  padding: var(--space-6) 0;
}
.show-more-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--gray-700);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  background: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.show-more-btn:hover {
  border-color: var(--intrepid-red);
  color: var(--intrepid-red);
}

@media (max-width: 768px) {
  .dates-table-header { display: none; }
  .departure-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
    padding: var(--space-4);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-3);
  }
  .col-price { align-items: flex-start; }
  .col-status { display: none; }
}
</style>

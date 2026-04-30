<script setup lang="ts">
/* ── Destinations (nested) ─────────────────────────────────── */
const destinations = reactive([
  {
    region: 'Asia',
    expanded: true,
    countries: [
      { label: 'Armenia', count: 4, checked: false },
      { label: 'Bhutan', count: 6, checked: false },
      { label: 'Cambodia', count: 12, checked: false },
      { label: 'China', count: 8, checked: false },
      { label: 'India', count: 22, checked: false },
      { label: 'Japan', count: 15, checked: false },
      { label: 'Laos', count: 7, checked: false },
      { label: 'Mongolia', count: 3, checked: false },
      { label: 'Myanmar', count: 5, checked: false },
      { label: 'Nepal', count: 11, checked: false },
      { label: 'Sri Lanka', count: 14, checked: false },
      { label: 'Thailand', count: 18, checked: false },
      { label: 'Vietnam', count: 21, checked: true },
    ],
  },
  {
    region: 'Africa',
    expanded: false,
    countries: [
      { label: 'Egypt', count: 9, checked: false },
      { label: 'Kenya', count: 7, checked: false },
      { label: 'Morocco', count: 14, checked: false },
      { label: 'South Africa', count: 11, checked: false },
      { label: 'Tanzania', count: 8, checked: false },
    ],
  },
  {
    region: 'Europe',
    expanded: false,
    countries: [
      { label: 'Croatia', count: 5, checked: false },
      { label: 'Greece', count: 7, checked: false },
      { label: 'Italy', count: 12, checked: false },
      { label: 'Spain', count: 9, checked: false },
      { label: 'Turkey', count: 10, checked: false },
    ],
  },
  {
    region: 'Central & South America',
    expanded: false,
    countries: [
      { label: 'Argentina', count: 6, checked: false },
      { label: 'Colombia', count: 4, checked: false },
      { label: 'Costa Rica', count: 8, checked: false },
      { label: 'Ecuador', count: 5, checked: false },
      { label: 'Peru', count: 13, checked: false },
    ],
  },
])

/* ── Duration range ────────────────────────────────────────── */
const durationMin = ref(1)
const durationMax = ref(30)

/* ── Price range ───────────────────────────────────────────── */
const priceMin = ref(0)
const priceMax = ref(10000)

/* ── Deals & New Trips ─────────────────────────────────────── */
const deals = reactive([
  { label: 'Last minute deals', count: 8, checked: false },
  { label: 'Early bird savings', count: 12, checked: false },
  { label: 'Flash sale', count: 3, checked: false },
  { label: 'Free trip upgrades', count: 5, checked: false },
])
const showNewTrips = ref(false)

/* ── Physical rating ───────────────────────────────────────── */
const physicalRatings = reactive([
  { label: '1 – Easy going', value: 1, count: 24, checked: false },
  { label: '2 – Average', value: 2, count: 89, checked: false },
  { label: '3 – Moderate', value: 3, count: 112, checked: false },
  { label: '4 – Demanding', value: 4, count: 46, checked: false },
  { label: '5 – Challenging', value: 5, count: 11, checked: false },
])

/* ── Travel Style ──────────────────────────────────────────── */
const styles = reactive([
  { label: 'Basix', count: 18, checked: false },
  { label: 'Original', count: 97, checked: false },
  { label: 'Comfort', count: 34, checked: false },
  { label: 'Premium', count: 12, checked: false },
])

/* ── Themes ────────────────────────────────────────────────── */
const themes = reactive([
  { label: 'Explorer', count: 64, checked: false },
  { label: 'Wildlife & Nature', count: 31, checked: false },
  { label: 'Food & Culinary', count: 22, checked: false },
  { label: 'Trekking & Hiking', count: 28, checked: false },
  { label: 'Cycling', count: 14, checked: false },
  { label: 'Sailing', count: 9, checked: false },
  { label: 'Family', count: 16, checked: false },
  { label: 'Festival & Events', count: 7, checked: false },
  { label: 'Cultural', count: 42, checked: false },
  { label: 'Photography', count: 5, checked: false },
])

/* ── Active filters ────────────────────────────────────────── */
const activeFilterCount = computed(() => {
  let count = 0
  destinations.forEach(r => r.countries.forEach(c => { if (c.checked) count++ }))
  deals.forEach(d => { if (d.checked) count++ })
  physicalRatings.forEach(p => { if (p.checked) count++ })
  styles.forEach(s => { if (s.checked) count++ })
  themes.forEach(t => { if (t.checked) count++ })
  if (showNewTrips.value) count++
  return count
})

function clearAll() {
  destinations.forEach(r => r.countries.forEach(c => c.checked = false))
  deals.forEach(d => d.checked = false)
  physicalRatings.forEach(p => p.checked = false)
  styles.forEach(s => s.checked = false)
  themes.forEach(t => t.checked = false)
  showNewTrips.value = false
  durationMin.value = 1
  durationMax.value = 30
  priceMin.value = 0
  priceMax.value = 10000
}
</script>

<template>
  <aside class="filter-sidebar" id="filter-sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        <Icon name="lucide:sliders-horizontal" size="18" />
        Filters
      </h2>
      <button
        v-if="activeFilterCount > 0"
        class="clear-all-btn"
        @click="clearAll"
        id="clear-all-filters-btn"
      >
        Clear all ({{ activeFilterCount }})
      </button>
    </div>

    <!-- ── Destinations ──────────────────────────────────────── -->
    <SearchFilterGroup name="Destinations">
      <div class="destination-group" v-for="region in destinations" :key="region.region">
        <button
          class="region-toggle"
          @click="region.expanded = !region.expanded"
        >
          <Icon
            name="lucide:chevron-right"
            class="region-chevron"
            :class="{ open: region.expanded }"
            size="16"
          />
          <span class="region-name">{{ region.region }}</span>
          <span class="region-count">({{ region.countries.reduce((a, c) => a + c.count, 0) }})</span>
        </button>
        <Transition name="collapse">
          <div v-show="region.expanded" class="region-countries">
            <label
              v-for="country in region.countries"
              :key="country.label"
              class="checkbox-item"
            >
              <input type="checkbox" v-model="country.checked" class="cb" />
              <span class="cb-label">{{ country.label }}</span>
              <span class="cb-count">{{ country.count }}</span>
            </label>
          </div>
        </Transition>
      </div>
    </SearchFilterGroup>

    <!-- ── Duration ──────────────────────────────────────────── -->
    <SearchFilterGroup name="Duration (days)">
      <div class="range-inputs">
        <div class="range-field">
          <div class="input-with-label">
            <span class="inline-label">Min</span>
            <input
              type="number"
              v-model.number="durationMin"
              min="1"
              max="30"
              class="range-input"
              id="duration-min-input"
            />
          </div>
        </div>
        <span class="range-dash">–</span>
        <div class="range-field">
          <div class="input-with-label">
            <span class="inline-label">Max</span>
            <input
              type="number"
              v-model.number="durationMax"
              min="1"
              max="60"
              class="range-input"
              id="duration-max-input"
            />
          </div>
        </div>
      </div>
    </SearchFilterGroup>

    <!-- ── Price ──────────────────────────────────────────────── -->
    <SearchFilterGroup name="Price (USD)">
      <div class="range-inputs">
        <div class="range-field">
          <div class="input-with-label">
            <span class="inline-label">Min $</span>
            <input
              type="number"
              v-model.number="priceMin"
              min="0"
              class="range-input"
              id="price-min-input"
            />
          </div>
        </div>
        <span class="range-dash">–</span>
        <div class="range-field">
          <div class="input-with-label">
            <span class="inline-label">Max $</span>
            <input
              type="number"
              v-model.number="priceMax"
              min="0"
              class="range-input"
              id="price-max-input"
            />
          </div>
        </div>
      </div>
    </SearchFilterGroup>

    <!-- ── Deals ─────────────────────────────────────────────── -->
    <SearchFilterGroup name="Deals">
      <label
        v-for="deal in deals"
        :key="deal.label"
        class="checkbox-item"
      >
        <input type="checkbox" v-model="deal.checked" class="cb" />
        <span class="cb-label">{{ deal.label }}</span>
        <span class="cb-count">{{ deal.count }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── New Trips ─────────────────────────────────────────── -->
    <SearchFilterGroup name="New Trips">
      <label class="checkbox-item">
        <input type="checkbox" v-model="showNewTrips" class="cb" />
        <span class="cb-label">Show new trips only</span>
        <span class="cb-count">14</span>
      </label>
    </SearchFilterGroup>

    <!-- ── Physical Rating ───────────────────────────────────── -->
    <SearchFilterGroup name="Physical Rating">
      <label
        v-for="pr in physicalRatings"
        :key="pr.value"
        class="checkbox-item checkbox-item--physical"
      >
        <input type="checkbox" v-model="pr.checked" class="cb" />
        <span class="cb-label">
          <span class="physical-dots">
            <span
              v-for="i in 5"
              :key="i"
              class="physical-dot"
              :class="{ filled: i <= pr.value }"
            />
          </span>
          {{ pr.label }}
        </span>
        <span class="cb-count">{{ pr.count }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── Travel Style ──────────────────────────────────────── -->
    <SearchFilterGroup name="Travel Style">
      <label
        v-for="s in styles"
        :key="s.label"
        class="checkbox-item"
      >
        <input type="checkbox" v-model="s.checked" class="cb" />
        <span class="cb-label">{{ s.label }}</span>
        <span class="cb-count">{{ s.count }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── Themes ────────────────────────────────────────────── -->
    <SearchFilterGroup name="Themes">
      <label
        v-for="t in themes"
        :key="t.label"
        class="checkbox-item"
      >
        <input type="checkbox" v-model="t.checked" class="cb" />
        <span class="cb-label">{{ t.label }}</span>
        <span class="cb-count">{{ t.count }}</span>
      </label>
    </SearchFilterGroup>
  </aside>
</template>

<style scoped>
.filter-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  border-right: 1px solid var(--gray-200);
  padding-right: var(--space-6);
}

/* ── Header ────────────────────────────────────────────────── */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-2);
}
.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.clear-all-btn {
  font-size: var(--font-size-xs);
  color: var(--intrepid-red);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color var(--transition-fast);
}
.clear-all-btn:hover {
  color: var(--intrepid-red-dark);
}

/* ── Destination nested ────────────────────────────────────── */
.destination-group {
  margin-bottom: var(--space-1);
}
.region-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-1) 0;
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-800);
  cursor: pointer;
}
.region-chevron {
  transition: transform var(--transition-fast);
  color: var(--gray-500);
  flex-shrink: 0;
}
.region-chevron.open {
  transform: rotate(90deg);
}
.region-name { flex: 1; }
.region-count {
  color: var(--gray-400);
  font-weight: 400;
  font-size: var(--font-size-xs);
}
.region-countries {
  padding-left: var(--space-5);
  padding-top: var(--space-1);
}

/* ── Checkbox Items ────────────────────────────────────────── */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 3px 0;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: background var(--transition-fast);
  border-radius: var(--radius-sm);
}
.checkbox-item:hover {
  background: var(--gray-50);
}
.cb {
  width: 16px;
  height: 16px;
  accent-color: var(--intrepid-red);
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 3px;
}
.cb-label {
  color: var(--gray-800);
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.cb-count {
  color: var(--gray-400);
  font-size: var(--font-size-xs);
  min-width: 20px;
  text-align: right;
}

/* ── Physical rating dots ──────────────────────────────────── */
.physical-dots {
  display: inline-flex;
  gap: 2px;
  margin-right: 2px;
}
.physical-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--gray-200);
  display: inline-block;
}
.physical-dot.filled {
  background: var(--gray-700);
}

/* ── Range inputs ──────────────────────────────────────────── */
.range-inputs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.range-field {
  flex: 1;
}
.input-with-label {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-2);
  background: var(--white);
  transition: border-color var(--transition-fast);
}
.input-with-label:focus-within {
  border-color: var(--intrepid-red);
}
.inline-label {
  font-size: 10px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 4px;
}
.range-input {
  width: 100%;
  font-size: var(--font-size-sm);
  color: var(--gray-800);
  background: transparent;
  border: none;
  outline: none;
  padding: var(--space-2) 0;
}
.range-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.range-dash {
  color: var(--gray-400);
  font-weight: 500;
}



/* ── Collapse Transition ───────────────────────────────────── */
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

@media (max-width: 900px) {
  .filter-sidebar {
    width: 100%;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid var(--gray-200);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
  }
}
</style>

<script setup lang="ts">
/* ── Destinations (nested) ─────────────────────────────────── */
import { inject, computed, reactive, ref } from 'vue'

const search = inject('search') as any
if (!search) {
  throw new Error('FilterSidebar must be used within the search page (provide "search").')
}

const filters = search.filters
const facets = search.facets
const performSearch = search.performSearch

const destinations = reactive([
  {
    region: 'Asia',
    expanded: true,
    countries: [
      { label: 'Armenia' },
      { label: 'Bhutan' },
      { label: 'Cambodia' },
      { label: 'China' },
      { label: 'India' },
      { label: 'Japan' },
      { label: 'Laos' },
      { label: 'Mongolia' },
      { label: 'Myanmar' },
      { label: 'Nepal' },
      { label: 'Sri Lanka' },
      { label: 'Thailand' },
      { label: 'Vietnam' },
    ],
  },
  {
    region: 'Africa',
    expanded: false,
    countries: [
      { label: 'Egypt' },
      { label: 'Kenya' },
      { label: 'Morocco' },
      { label: 'South Africa' },
      { label: 'Tanzania' },
    ],
  },
  {
    region: 'Europe',
    expanded: false,
    countries: [
      { label: 'Croatia' },
      { label: 'Greece' },
      { label: 'Italy' },
      { label: 'Spain' },
      { label: 'Turkey' },
    ],
  },
  {
    region: 'Central & South America',
    expanded: false,
    countries: [
      { label: 'Argentina' },
      { label: 'Colombia' },
      { label: 'Costa Rica' },
      { label: 'Ecuador' },
      { label: 'Peru' },
    ],
  },
])

/* ── Duration range ────────────────────────────────────────── */
// Use central filters if available
const durationMin = ref(filters.durationMin ?? 1)
const durationMax = ref(filters.durationMax ?? 30)

/* ── Price range ───────────────────────────────────────────── */
const priceMin = ref(filters.priceMin ?? 0)
const priceMax = ref(filters.priceMax ?? 10000)

/* ── Deals & New Trips ─────────────────────────────────────── */
const deals = reactive([
  { label: 'Last minute deals' },
  { label: 'Early bird savings' },
  { label: 'Flash sale' },
  { label: 'Free trip upgrades' },
])
const showNewTrips = ref(filters.showNewTrips ?? false)

/* ── Physical rating ───────────────────────────────────────── */
const physicalRatings = reactive([
  { label: '1 – Easy going', value: 1 },
  { label: '2 – Average', value: 2 },
  { label: '3 – Moderate', value: 3 },
  { label: '4 – Demanding', value: 4 },
  { label: '5 – Challenging', value: 5 },
])

/* ── Travel Style ──────────────────────────────────────────── */
const styles = reactive([
  { label: 'Basix' },
  { label: 'Original' },
  { label: 'Comfort' },
  { label: 'Premium' },
])

// Map UI labels to stored values in the index
const facetValueMap: Record<string, Record<string, string>> = {
  styles: {
    // UI label : stored value
    Basix: 'Basic',
  },
}

/* ── Themes ────────────────────────────────────────────────── */
const themes = reactive([
  { label: 'Explorer' },
  { label: 'Wildlife & Nature' },
  { label: 'Food & Culinary' },
  { label: 'Trekking & Hiking' },
  { label: 'Cycling' },
  { label: 'Sailing' },
  { label: 'Family' },
  { label: 'Festival & Events' },
  { label: 'Cultural' },
  { label: 'Photography' },
])

/* ── Active filters ────────────────────────────────────────── */
const activeFilterCount = computed(() => {
  let count = 0
  if (Array.isArray(filters.destinations)) count += filters.destinations.length
  if (Array.isArray(filters.styles)) count += filters.styles.length
  if (Array.isArray(filters.themes)) count += filters.themes.length
  if (Array.isArray(filters.physicalRating)) count += filters.physicalRating.length
  if (filters.showNewTrips) count++
  if (typeof filters.durationMin === 'number' || typeof filters.durationMax === 'number') count++
  if (typeof filters.priceMin === 'number' || typeof filters.priceMax === 'number') count++
  return count
})

function clearAll() {
  filters.destinations = []
  filters.styles = []
  filters.themes = []
  filters.physicalRating = []
  filters.showNewTrips = false
  filters.durationMin = undefined
  filters.durationMax = undefined
  filters.priceMin = undefined
  filters.priceMax = undefined
  // update local controls too
  durationMin.value = 1
  durationMax.value = 30
  priceMin.value = 0
  priceMax.value = 10000
  performSearch()
}

function getFacetCount(field: string, value: string | number) {
  const normalized = (facetValueMap[field] && typeof value === 'string' && facetValueMap[field][value]) || value
  const arr = (facets?.value?.[field] || []) as Array<{ value: string; count: number }>
  const found = arr.find((x: any) => String(x.value) === String(normalized))
  if (found) return found.count

  // Fallback: compute counts from current search results when Typesense did not return facet counts.
  // `search.results` is a ref in the injected `search` composable.
  try {
    const resultsRef = (search && (search.results as any))
    const results = resultsRef && (resultsRef.value || resultsRef) ? (resultsRef.value || resultsRef) : []
    let cnt = 0
    for (const doc of results) {
      const fieldVal = (doc as any)[field]
      if (fieldVal === undefined || fieldVal === null) continue
      if (Array.isArray(fieldVal)) {
        // array of strings or numbers
        const match = fieldVal.some((v) => String(v) === String(normalized))
        if (match) cnt++
      } else {
        // single value
        if (String(fieldVal) === String(normalized)) cnt++
      }
    }
    return cnt
  } catch (e) {
    return 0
  }
}

function toggleDestination(label: string) {
  filters.destinations = filters.destinations || []
  const i = filters.destinations.indexOf(label)
  if (i === -1) filters.destinations.push(label)
  else filters.destinations.splice(i, 1)
  performSearch()
}

function toggleStyle(label: string) {
  filters.styles = filters.styles || []
  const storedValue = (facetValueMap.styles && facetValueMap.styles[label]) || label
  const i = filters.styles.indexOf(storedValue)
  if (i === -1) filters.styles.push(storedValue)
  else filters.styles.splice(i, 1)
  performSearch()
}

function toggleTheme(label: string) {
  filters.themes = filters.themes || []
  const i = filters.themes.indexOf(label)
  if (i === -1) filters.themes.push(label)
  else filters.themes.splice(i, 1)
  performSearch()
}

function togglePhysical(value: number) {
  filters.physicalRating = filters.physicalRating || []
  const i = filters.physicalRating.indexOf(value)
  if (i === -1) filters.physicalRating.push(value)
  else filters.physicalRating.splice(i, 1)
  performSearch()
}

function applyDuration() {
  filters.durationMin = durationMin.value
  filters.durationMax = durationMax.value
  performSearch()
}

function applyPrice() {
  filters.priceMin = priceMin.value
  filters.priceMax = priceMax.value
  performSearch()
}

function toggleDeal(label: string) {
  filters.deals = filters.deals || []
  const i = filters.deals.indexOf(label)
  if (i === -1) filters.deals.push(label)
  else filters.deals.splice(i, 1)
  performSearch()
}

function toggleShowNewTrips() {
  filters.showNewTrips = !filters.showNewTrips
  performSearch()
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
          <span class="region-count">({{ region.countries.reduce((a, c) => a + getFacetCount('primaryCountry', c.label), 0) }})</span>
        </button>
        <Transition name="collapse">
          <div v-show="region.expanded" class="region-countries">
            <label
              v-for="country in region.countries"
              :key="country.label"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="(filters.destinations || []).includes(country.label)"
                @change="() => toggleDestination(country.label)"
                class="cb"
              />
              <span class="cb-label">{{ country.label }}</span>
              <span class="cb-count">{{ getFacetCount('primaryCountry', country.label) }}</span>
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
              @change="applyDuration"
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
              @change="applyDuration"
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
              @change="applyPrice"
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
              @change="applyPrice"
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
        <input
          type="checkbox"
          :checked="(filters.deals || []).includes(deal.label)"
          @change="() => toggleDeal(deal.label)"
          class="cb"
        />
        <span class="cb-label">{{ deal.label }}</span>
        <span class="cb-count">{{ getFacetCount('tags', deal.label) }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── New Trips ─────────────────────────────────────────── -->
    <SearchFilterGroup name="New Trips">
      <label class="checkbox-item">
        <input
          type="checkbox"
          :checked="!!filters.showNewTrips"
          @change="toggleShowNewTrips"
          class="cb"
        />
        <span class="cb-label">Show new trips only</span>
        <span class="cb-count">{{ getFacetCount('tags', 'new') || 0 }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── Physical Rating ───────────────────────────────────── -->
    <SearchFilterGroup name="Physical Rating">
      <label
        v-for="pr in physicalRatings"
        :key="pr.value"
        class="checkbox-item checkbox-item--physical"
      >
        <input
          type="checkbox"
          :checked="(filters.physicalRating || []).includes(pr.value)"
          @change="() => togglePhysical(pr.value)"
          class="cb"
        />
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
        <span class="cb-count">{{ getFacetCount('physicalRating', pr.value) }}</span>
      </label>
    </SearchFilterGroup>

    <!-- ── Travel Style ──────────────────────────────────────── -->
    <SearchFilterGroup name="Travel Style">
          <label
            v-for="s in styles"
            :key="s.label"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :checked="(filters.styles || []).includes((facetValueMap.styles && facetValueMap.styles[s.label]) || s.label)"
              @change="() => toggleStyle(s.label)"
              class="cb"
            />
            <span class="cb-label">{{ s.label }}</span>
            <span class="cb-count">{{ getFacetCount('styles', s.label) }}</span>
          </label>
    </SearchFilterGroup>

    <!-- ── Themes ────────────────────────────────────────────── -->
    <SearchFilterGroup name="Themes">
      <label
        v-for="t in themes"
        :key="t.label"
        class="checkbox-item"
      >
        <input
          type="checkbox"
          :checked="(filters.themes || []).includes(t.label)"
          @change="() => toggleTheme(t.label)"
          class="cb"
        />
        <span class="cb-label">{{ t.label }}</span>
        <span class="cb-count">{{ getFacetCount('themes', t.label) }}</span>
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

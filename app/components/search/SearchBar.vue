<script setup lang="ts">
const query = defineModel<string>({ default: '' })
const startDate = ref('')
const endDate = ref('')

const today = new Date().toISOString().split('T')[0]

const emit = defineEmits<{
  search: [string | { query: string; startDate?: string; endDate?: string }]
}>()

const { suggestions, isLoading } = useAutocomplete(query)
const showSuggestions = ref(false)

watch([query, suggestions], () => {
  showSuggestions.value = !!(query.value && String(query.value).trim() && suggestions.value.length)
})

function onSubmit() {
  emit('search', { query: query.value, startDate: startDate.value || undefined, endDate: endDate.value || undefined })
  showSuggestions.value = false
}

function selectSuggestion(s: string) {
  query.value = s
  showSuggestions.value = false
  emit('search', { query: s, startDate: startDate.value || undefined, endDate: endDate.value || undefined })
}
</script>

<template>
  <form class="search-bar" @submit.prevent="onSubmit" id="search-bar-form">
    <!-- Location -->
    <div class="search-field search-field--location">
      <Icon name="lucide:map-pin" class="search-field__icon" size="20" />
      <input
        v-model="query"
        type="text"
        class="search-field__input"
        placeholder="Search 18 to 35s"
        aria-label="Search destination"
        id="search-destination-input"
        autocomplete="off"
      />

      <div class="autocomplete-wrapper" v-if="showSuggestions">
        <ul class="autocomplete-dropdown" role="listbox" aria-label="Search suggestions">
          <li
            v-for="(s, idx) in suggestions"
            :key="idx"
            class="autocomplete-item"
            @mousedown.prevent="selectSuggestion(s)"
            role="option"
          >
            {{ s }}
          </li>
        </ul>
      </div>
    </div>

    <div class="search-divider"></div>

    <!-- Dates -->
    <div class="search-field search-field--date">
      <Icon name="lucide:calendar" class="search-field__icon" size="20" />
      <div class="date-inputs">
        <input
          v-model="startDate"
          type="text"
          class="search-field__input date-input"
          placeholder="Start date"
          aria-label="Start date"
          :min="today"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
        />
        <span class="date-sep">—</span>
        <input
          v-model="endDate"
          type="text"
          class="search-field__input date-input"
          placeholder="End date"
          aria-label="End date"
          :min="today"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="search-btn-wrap">
      <button type="submit" class="search-btn" id="search-submit-btn">
        Search
        <Icon name="lucide:search" size="18" />
      </button>
    </div>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  padding: 6px 6px 6px 24px;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}
.search-bar:focus-within {
  box-shadow: var(--shadow-md);
  border-color: var(--gray-300);
}
.search-field {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.search-field--location {
  flex: 2;
  position: relative;
}
.search-field--date {
  flex: 1.5;
  padding-left: var(--space-4);
}
.search-field__icon {
  color: var(--gray-500);
  flex-shrink: 0;
}
.search-field__input {
  width: 100%;
  font-size: var(--font-size-base);
  color: var(--gray-900);
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 0;
}
.search-field__input::placeholder {
  color: var(--gray-400);
}

.autocomplete-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: var(--white);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-sm);
  max-height: 280px;
  overflow: auto;
  z-index: 60;
  list-style: none;
  margin: 0;
  padding: 6px 0;
}
.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-900);
}
.autocomplete-item:hover {
  background: var(--gray-100);
}
.date-inputs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
}
.date-input {
  width: auto;
  min-width: 90px;
}
.date-sep {
  color: var(--gray-400);
}
.search-divider {
  width: 1px;
  height: 24px;
  background: var(--gray-200);
  flex-shrink: 0;
}
.search-btn-wrap {
  margin-left: auto;
}
.search-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--intrepid-red);
  color: var(--white);
  font-size: var(--font-size-base);
  font-weight: 700;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background var(--transition-fast);
  white-space: nowrap;
}
.search-btn:hover {
  background: var(--intrepid-red-dark);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    border-radius: var(--radius-md);
    padding: var(--space-2);
    align-items: stretch;
  }
  .search-field {
    padding: var(--space-3);
  }
  .search-field--date {
    padding-left: var(--space-3);
  }
  .search-divider {
    width: 100%;
    height: 1px;
    margin: 0;
  }
  .search-btn-wrap {
    margin-left: 0;
    margin-top: var(--space-2);
  }
  .search-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

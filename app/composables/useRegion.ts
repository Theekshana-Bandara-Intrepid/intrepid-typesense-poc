import { ref, readonly } from 'vue'

export const REGION_STORAGE_KEY = 'intrepid_region_code'

export const REGION_OPTIONS = [
  { code: 'AUD', label: 'Australia (AUD)', locale: 'en-AU' },
  { code: 'CAD', label: 'Canada (CAD)', locale: 'en-CA' },
  { code: 'CHF', label: 'Switzerland (CHF)', locale: 'de-CH' },
  { code: 'EUR', label: 'Europe (EUR)', locale: 'en-GB' },
  { code: 'GBP', label: 'United Kingdom (GBP)', locale: 'en-GB' },
  { code: 'NZD', label: 'New Zealand (NZD)', locale: 'en-NZ' },
  { code: 'USD', label: 'United States (USD)', locale: 'en-US' },
  { code: 'ZAR', label: 'South Africa (ZAR)', locale: 'en-ZA' },
]

function initialCode() {
  if (typeof window === 'undefined') return 'USD'
  const stored = localStorage.getItem(REGION_STORAGE_KEY)
  return stored || 'USD'
}

const region = ref(REGION_OPTIONS.find((r) => r.code === initialCode()) || REGION_OPTIONS[6])

export function useRegion() {
  const setRegion = (code: string) => {
    const found = REGION_OPTIONS.find((r) => r.code === code)
    if (found) {
      region.value = found
      if (typeof window !== 'undefined') localStorage.setItem(REGION_STORAGE_KEY, found.code)
    }
  }

  return {
    region: readonly(region),
    setRegion,
    REGION_OPTIONS,
  }
}

export default useRegion

import { ref, watch, onUnmounted, type Ref } from 'vue'

export const useAutocomplete = (externalQuery?: Ref<string>) => {
  const query = (externalQuery as Ref<string>) || ref('')
  const suggestions = ref<string[]>([])
  const isLoading = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const fetchSuggestions = async () => {
    if (!query.value || !String(query.value).trim()) {
      suggestions.value = []
      return
    }
    isLoading.value = true
    try {
      const res = await $fetch<{ suggestions: string[] }>('/api/autocomplete', { params: { q: query.value } })
      suggestions.value = (res?.suggestions || []).slice(0, 8)
    } catch (err) {
      console.error('Autocomplete fetch failed', err)
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }

  watch(query, (val) => {
    if (timer) clearTimeout(timer)
    if (!val || !String(val).trim()) {
      suggestions.value = []
      return
    }
    timer = setTimeout(fetchSuggestions, 250)
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { query, suggestions, isLoading, fetchSuggestions }
}

export default useAutocomplete

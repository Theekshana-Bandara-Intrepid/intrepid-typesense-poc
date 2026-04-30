import { defineEventHandler, getQuery } from 'h3'
import { getTypesenseClient } from '~~/server/utils/typesense'

interface AutocompleteQuery {
  q?: string
}

export default defineEventHandler(async (event) => {
  const { q } = getQuery<AutocompleteQuery>(event) || {}

  if (!q || String(q).trim().length === 0) {
    return { suggestions: [] }
  }

  try {
    const client = getTypesenseClient()
    const collection = process.env.TYPESENSE_COLLECTION || 'dev_intrepid_departure'

    const params = {
      q: String(q),
      query_by: 'name,destinations',
      prefix: true,
      per_page: 8,
    }

    const response: any = await client.collections(collection).documents().search(params)

    const suggestionsSet = new Set<string>()

    const hits = response.hits || []
    for (const hit of hits) {
      const doc = hit.document || {}
      if (doc.name && typeof doc.name === 'string') {
        suggestionsSet.add(doc.name)
      }
      if (Array.isArray(doc.destinations)) {
        for (const dest of doc.destinations) {
          if (typeof dest === 'string') {
            // only include destinations that match the user's typed text
            if (dest.toLowerCase().includes(String(q).toLowerCase())) {
              suggestionsSet.add(dest)
            }
          }
        }
      }
      if (suggestionsSet.size >= 8) break
    }

    return { suggestions: Array.from(suggestionsSet).slice(0, 8) }
  } catch (error) {
    console.error('Autocomplete error:', error)
    return { suggestions: [] }
  }
})

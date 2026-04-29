import { defineEventHandler, getRouterParam } from 'h3'
import type { TripDetail } from '~/types/trip'
// import { getTypesenseClient } from '~/server/utils/typesense'

/**
 * Product Detail API Route (/api/trip/:slug)
 * 
 * This GET endpoint retrieves the full detailed data for a single trip based on its slug.
 * It is called by the `app/pages/trip/[slug].vue` page during server-side rendering (SSR).
 * In a real implementation, this might query a separate Typesense collection (e.g., `trips_detailed`),
 * retrieve the document from a CMS/PIM, or simply fetch the document from the `trips` 
 * collection if all detailed data (itinerary, inclusions, etc.) is indexed there.
 */

export default defineEventHandler(async (event): Promise<TripDetail | null> => {
  // 1. Extract the `slug` parameter from the URL router
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    // Return 404 or throw error
    return null
  }

  // 2. Initialize Typesense client
  // const client = getTypesenseClient()

  // 3. Search the collection for a document matching the slug exactly
  /*
    const response = await client.collections('trips').documents().search({
      q: slug,
      query_by: 'slug',
      filter_by: `slug:=${slug}`,
      per_page: 1
    })
  */

  // 4. If no document is found, return null (triggering Nuxt 404 page)
  
  // 5. Map the returned Typesense document to the `TripDetail` interface
  // (which matches the shape currently hardcoded in the frontend UI).

  return null
})

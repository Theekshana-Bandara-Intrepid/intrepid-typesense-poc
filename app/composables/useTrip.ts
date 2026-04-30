import type { TripDetail } from '~/types/trip'
import { createError } from 'h3'

/**
 * useTrip Composable
 * 
 * This composable is responsible for fetching and managing the state of a single
 * trip for the Product Detail Page (PDP). It interacts with the Nuxt API endpoint
 * (`/api/trip/:slug`) utilizing Nuxt's `useAsyncData` or `useFetch` to ensure 
 * the data is fetched securely during Server-Side Rendering (SSR) for optimal SEO.
 */

export const useTrip = () => {
  /**
   * Fetches detailed trip data by its slug.
   * 
   * @param slug The unique URL slug of the trip.
   * @returns A reactive reference to the trip details, along with loading/error states.
   */
  const fetchTripBySlug = async (slug: string) => {
    const { data: trip, pending, error } = await useAsyncData<TripDetail | null>(
      `trip-${slug}`,
      () => $fetch(`/api/trip/${slug}`)
    )

    if (!trip.value) {
      throw createError({ statusCode: 404, statusMessage: 'Trip not found' })
    }

    return {
      trip,
      pending,
      error,
    }
  }

  return {
    fetchTripBySlug
  }
}

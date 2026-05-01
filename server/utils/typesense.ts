import { Client } from 'typesense'

/**
 * Typesense Client Configuration
 * 
 * This utility initializes a singleton instance of the Typesense client to be used
 * across all server-side API routes (search, autocomplete, etc.).
 * It reads configuration from environment variables (defined in `.env` or Nuxt config)
 * to securely connect to Typesense Cloud without exposing the admin API key to the frontend.
 */

let typesenseClient: Client | null = null

/**
 * Gets or initializes the Typesense client.
 * 
 * @returns {Client} An initialized Typesense client instance.
 * @throws {Error} If required environment variables (e.g., TYPESENSE_API_KEY, TYPESENSE_HOST) are missing.
 */
export function getTypesenseClient(): Client {
  const host = process.env.TYPESENSE_HOST || process.env.NUXT_PUBLIC_TYPESENSE_HOST
  const protocol = process.env.TYPESENSE_PROTOCOL || process.env.NUXT_PUBLIC_TYPESENSE_PROTOCOL || 'https'
  const portValue = process.env.TYPESENSE_PORT || process.env.NUXT_PUBLIC_TYPESENSE_PORT
  const port = portValue ? parseInt(portValue, 10) : protocol === 'https' ? 443 : 8108
  // Prefer an admin key when available, fall back to the public/search-only key.
  const apiKey = process.env.TYPESENSE_API_KEY || process.env.TYPESENSE_ADMIN_API_KEY || process.env.NUXT_PUBLIC_TYPESENSE_SEARCH_ONLY_KEY

  if (!host || !apiKey) {
    throw new Error('Missing Typesense configuration. Ensure TYPESENSE_HOST and TYPESENSE_API_KEY (or NUXT_PUBLIC_TYPESENSE_* equivalents) are set.')
  }

  if (!typesenseClient) {
    typesenseClient = new Client({
      nodes: [
        {
          host,
          port,
          protocol,
        },
      ],
      apiKey,
      connectionTimeoutSeconds: 10,
    })
  }

  return typesenseClient
}

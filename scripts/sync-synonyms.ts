#!/usr/bin/env node
import { getTypesenseClient } from '../server/utils/typesense'

async function main() {
  const client = getTypesenseClient()
  const collection = process.env.TYPESENSE_COLLECTION || 'dev_intrepid_departure'

  // Example synonym sets - expand as needed
  const synonymSets = [
    {
      id: 'beach_coastal',
      synonyms: ['beach', 'coastal'],
    },
    {
      id: 'trek_hike',
      synonyms: ['trek', 'hike', 'tramping'],
    },
  ]

  for (const s of synonymSets) {
    try {
      if (typeof (client.collections(collection).synonyms as any) === 'function') {
        // @ts-ignore
        const res = await (client.collections(collection).synonyms() as any).upsert(s.id, { synonyms: s.synonyms })
        console.log('Upserted', s.id, res)
      } else {
        // Fallback: plain HTTP
        const host = process.env.TYPESENSE_HOST
        const protocol = process.env.TYPESENSE_PROTOCOL || 'https'
        const port = process.env.TYPESENSE_PORT ? `:${process.env.TYPESENSE_PORT}` : ''
        const apiKey = process.env.TYPESENSE_API_KEY
        if (!host || !apiKey) throw new Error('Missing Typesense host or API key')
        const url = `${protocol}://${host}${port}/api/collections/${collection}/synonyms/${encodeURIComponent(s.id)}`
        const resp = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': apiKey,
          },
          body: JSON.stringify({ synonyms: s.synonyms }),
        })
        const json = await resp.json()
        console.log('Upserted (http)', s.id, json)
      }
    } catch (err) {
      console.error('Failed to upsert', s.id, err)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

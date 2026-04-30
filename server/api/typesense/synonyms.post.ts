import { defineEventHandler, readBody } from 'h3'
import { getTypesenseClient } from '~~/server/utils/typesense'

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)
  const collection = process.env.TYPESENSE_COLLECTION || 'dev_intrepid_departure'

  if (!body || !Array.isArray(body.synonyms) || body.synonyms.length < 2) {
    return { ok: false, message: 'Provide at least two synonyms in `synonyms` array.' }
  }

  const synonymId = body.id || body.synonyms.join('-').replace(/\s+/g, '_').toLowerCase()

  try {
    const client = getTypesenseClient()

    // Try using Typesense Node client synonyms helper if available
    if (typeof (client.collections(collection).synonyms as any) === 'function') {
      // Node client v3 exposes a synonyms() helper. Attempt an upsert.
      try {
        // @ts-ignore - best-effort call; returns promise
        const res = await (client.collections(collection).synonyms() as any).upsert(synonymId, {
          synonyms: body.synonyms,
        })
        return { ok: true, result: res }
      } catch (err: any) {
        // fall-through to HTTP fallback
        console.error('Node client synonyms upsert failed:', err?.message || err)
      }
    }

    // HTTP fallback: call Typesense REST API directly
    const host = process.env.TYPESENSE_HOST
    const protocol = process.env.TYPESENSE_PROTOCOL || 'https'
    const port = process.env.TYPESENSE_PORT ? `:${process.env.TYPESENSE_PORT}` : ''
    const apiKey = process.env.TYPESENSE_API_KEY || process.env.NUXT_PUBLIC_TYPESENSE_API_KEY
    if (!host || !apiKey) {
      throw new Error('Missing Typesense host or admin API key in environment.')
    }

    const url = `${protocol}://${host}${port}/api/collections/${collection}/synonyms/${encodeURIComponent(synonymId)}`
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-TYPESENSE-API-KEY': apiKey,
      },
      body: JSON.stringify({ synonyms: body.synonyms }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Typesense API responded ${resp.status}: ${text}`)
    }

    const json = await resp.json()
    return { ok: true, result: json }
  } catch (error: any) {
    console.error('Synonyms upsert failed:', error?.message || error)
    return { ok: false, message: error?.message || String(error) }
  }
})

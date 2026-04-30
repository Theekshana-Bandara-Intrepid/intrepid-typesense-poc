import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

/**
 * Typesense Collection Schema Definition
 * 
 * This file defines the exact structure of the `trips` index in Typesense.
 * It is used by the ingestion script to create or update the collection before
 * pushing data. The schema directly maps to the fields used in the UI for
 * display, filtering (faceting), and sorting.
 * 
 * Schema decisions for POC:
 * - `name`, `destinations`, `themes` need to be searchable for text queries.
 * - `destinations`, `style`, `themes`, `physicalRating`, `onSale` must be facet=true to populate the left sidebar.
 * - `price`, `duration` must be facet=true for range sliders/inputs.
 * - `price`, `duration`, `rating` must be sort=true for the Sort dropdown.
 */

/**
 * Returns the Typesense Collection schema for trips.
 * 
 * @returns {CollectionCreateSchema} The schema configuration object to pass to typesenseClient.collections().create()
 */
export function getTripCollectionSchema(): CollectionCreateSchema {
  // TODO: Implement the schema object.
  // Must include:
  // name: 'trips'
  // fields: array of objects { name: string, type: string, facet: boolean, sort: boolean, ... }
  // default_sorting_field: 'rating' (or similar, if desired)
  
  return {
    name: 'trips',
    fields: [
      // Example stub:
      // { name: 'name', type: 'string' },
      // { name: 'price', type: 'float', facet: true, sort: true },
      // ... add all fields derived from TripDocument interface
    ]
  } as CollectionCreateSchema
}

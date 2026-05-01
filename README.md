# Typesense Search Migration POC

Short proof-of-concept to re-create a subset of the Intrepid Travel website search using Typesense instead of Algolia. The goal is to verify Typesense supports our requirements (facets, geo-search, typo tolerance, synonyms, pinned results) and to measure response speed.

Key goals
- Evaluate core search features: facets, geo-search, typo tolerance, synonyms, and merchandising (pinned results).
- Measure query latency for common user flows (autocomplete, filtered search).
- Verify query logic support (AND / OR conditions) and result relevance.

What to test
- Implement Instant Search with Autocomplete (real-time results and suggestions).
- Implement Faceted Filtering and Sorting (destination, theme, duration, price, date; sort options: Relevance, Price low→high, Price high→low).
- Configure Typo Tolerance and Synonyms (e.g. "beach" ↔ "coastal").
- Implement Merchandising Rules (pinned/featured results at top).
- Implement Query Conditions (AND / OR logic for filters and terms).

Repository pointers
- API autocomplete endpoint: [server/api/autocomplete.get.ts](server/api/autocomplete.get.ts)
- API search endpoint: [server/api/search.post.ts](server/api/search.post.ts)
- Typesense client + helpers: [utils/typesense.ts](utils/typesense.ts)
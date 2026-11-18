# Daily article view trends

Requested daily line chart in the owner-only analytics Site. Existing 09:00 Asia/Seoul collection is retained.

- Query `date` + `pagePath` and `screenPageViews` over the existing production hosts, start 2026-07-30 through yesterday. One complete paginated report derives both cumulative and daily values; cumulative differences are not used to reconstruct history.
- Keep snapshot schemaVersion 1 and its cumulative fields; add optional `daily: { dates, totals, articles }`. `articles[path]` is a date-aligned array. No-record days are zero; dates before the published date with no reported events are null. Actual reported events are retained even if an article's publication metadata is later.
- Daily totals for every article and the entire published-article scope must reconcile with cumulative values before atomic publication. Invalid dates, duplicates, incomplete/thresholded/sampled reports or mismatched totals fail without replacing the previous snapshot.
- Existing authentication, GitHub-only single-file publication, host filters, canonical URLs, retries and schedule stay unchanged. No public website UI or content changes.
- Private dashboard: total/per-article selector, 7/30/90-day and full range, daily line chart with hover/keyboard inspection and exact values table. End date follows the stored report period in Asia/Seoul. Partial prior-day processing and GA4 no-record distinctions remain visible.
- Verification: existing cumulative and collection fixtures plus daily canonical/pagination/range/reconciliation/rejection tests. Actual activation collection, persisted daily sum, Site rendering and deployment are to be verified before completion.

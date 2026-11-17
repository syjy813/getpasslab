# Private analytics dashboard daily collection

- Requested: 2026-11-17 KST. Daily collection at **10:00 Asia/Seoul** (`0 1 * * *` UTC), through yesterday. Scheduling time is a target; GitHub can delay execution, and GA4 prior-day counts can be revised later.
- Split from unmerged PR #278 on current main. This change adds collection/authentication/tests only; no public page, sorting UI, content, image, canonical or category changes.
- Source of truth: published Markdown and existing `src/config/facility.ts` navigation mapping. One atomic `src/data/facility-page-views.json` includes counts and current titles/dates/categories. Dashboard reads main only.
- Existing WIF trust, 300-second analytics.readonly access token, property 547805075 and production host filters are reused. No credential file, new cloud service, or additional billing setup.
- Schedule, manual dispatch and collector-code push on main use the same collection path. The initial approved main merge starts a real collection immediately. Pull requests run fixture tests without Google credentials. Full report/aggregate checks precede publication; failures retain the prior snapshot, with at most 3 collection attempts.
- Snapshot updates use the GitHub token and `[skip ci]`; they do not invoke Pages deployment. Daily collection does not require republishing either website. The existing Pages workflow may run once for the initial code merge without changing public UI.
- Locally verified: authentication fixtures (7), pagination/canonical matching and rejected incomplete reports, atomic collection including new-post metadata, draft exclusion, failure preservation, timezone boundary, and main-only snapshot publication.
- Activation completion evidence must include merged SHA, first main collection run and persisted fetchedAt/endDate, plus the private Site deployment and readback. A saved schedule alone is not successful collection.

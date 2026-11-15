# GA4 GitHub authentication — completed

## Scope and verified source

- Updated: **2026-11-15 18:10 KST**.
- Work branch: `chore/ga4-auth-connection`; [PR #278](https://github.com/syjy813/getpasslab/pull/278).
- Verified code commit: `49741b6b32703a7843d673d74359bd6ca261a9f2`.
- Baseline initially `main@281264ee`; merged `main@40a4b722` while preserving the parallel sasugoldae files and handover.
- No page-view ingestion, ranking UI, schedule, merge, or Production deployment in this change. Remote files were inspected through GitHub; no pre-existing local checkout was replaced.

## Google configuration — applied and verified

- Project: `GetPassLab Analytics`, ID `level-array-514808-v0`, number `528916134663`.
- Billing account **not linked**. No card, billing association, or free-trial signup was submitted.
- Analytics Data, IAM, Resource Manager, IAM Credentials, and STS APIs enabled without linking billing.
- Reader: `getpasslab-ga4-reader@level-array-514808-v0.iam.gserviceaccount.com`; no service-account keys created.
- GA4 property `547805075`: Viewer, cost and revenue metrics access disabled; applied after user confirmation and verified in the access list.
- Workload identity pool `getpasslab-github`, provider `github-actions`, issuer `https://token.actions.githubusercontent.com`, default provider audience.
- Mappings: `google.subject=assertion.sub`, `attribute.repository_id=assertion.repository_id`, `attribute.repository_owner_id=assertion.repository_owner_id`.
- Condition requires repository ID `1292439277`, owner ID `73263769`, refs `main` or `chore/ga4-auth-connection`, events push/workflow_dispatch/schedule, and the exact `.github/workflows/ga4-analytics.yml` reference on those refs. The schedule event is permitted for a future workflow, but this workflow has no schedule.
- Service-account-only impersonation grant: `roles/iam.workloadIdentityUser`, principal `principalSet://iam.googleapis.com/projects/528916134663/locations/global/workloadIdentityPools/getpasslab-github/attribute.repository_id/1292439277`.
- Console confirmed linked reader and `attribute.repository_id="1292439277"`, with policy update success.
- No project-level Cloud role, domain-wide delegation, or persistent private key was granted.

## GitHub configuration

- `.github/workflows/ga4-analytics.yml`: work-branch path-filtered push and manual dispatch; no schedule, write permission, deploy job, or artifact upload. Manual dispatch from GitHub's normal UI becomes available once the workflow is on the default branch.
- Explicit permission: contents read, id-token write only for the auth job.
- Approved activation is committed in the workflow; **GA4_WIF_ENABLED repository variable is not used or required**. The earlier preparation gate was removed after user approval. The GitHub settings page required sign-in, so no GitHub account setting was changed; the already connected GitHub API performed the code update.
- Official auth/checkout Actions pinned to release commits.
- Access token lifetime 300 seconds, scope `analytics.readonly`; credentials file and environment export disabled. No persistent checkout credential.
- `scripts/check-ga4-auth.mjs`: one `runReport`, `pagePath`/`screenPageViews`, production host filter, metric TOTAL, page limit 1. No individual page path, token, raw report, or headers in public logs.
- This limit-1 query verifies auth, report shape, rowCount and grand total; it does **not** download all URL rows for ingestion.

## Evidence

- Local syntax/YAML permission-boundary inspection and 7 fixture checks PASS.
- Earlier validation run `43697285839` at `56b78731`: validation success, auth intentionally skipped before approval.
- **Live run [43697865632](https://github.com/syjy813/getpasslab/actions/runs/43697865632), code commit `49741b6b`: completed/success.**
- Job `132762293308` validate: success, including 7 fixture cases.
- Job `132762356025` authenticate-and-query: success. Both token issuance and live report request succeeded.
- Executed at 2026-11-15 09:09:56 UTC / 18:09:56 KST.
- GA4 property: `547805075`; period **2026-07-30 through 2026-11-14** (query end yesterday, property reporting time zone).
- Hosts: `getpasslab.co.kr`, `www.getpasslab.co.kr`.
- **419 reported page paths; 5,441 total page views.** Includes home/list pages, not article-only totals.
- Daily quota remaining **199,999 / 200,000** after this request (1 quota token consumed; a quota unit, not a monetary charge).
- Earlier UI check was property-wide without the production-host restriction: 428 paths / 5,886 views. Different report scope; do not replace it with an article-only claim or infer the excluded host identities without another report.
- Latest follow-up checkpoint commit changes documentation only. Auth script/test/workflow remain byte-identical to the verified code commit, so the live evidence is reused rather than making another API request.
- No site Build/UI/Production QA: no site source or deployment workflow changed. No main merge or Pages deployment performed.

## Next stage and resume

1. Authentication stage is complete. Do not recreate credentials or reapply IAM.
2. Implement full ingestion separately: paginate all relevant production URL rows, match existing canonical published article URLs, preserve fixed identifiers, store period/time zone/fetchedAt, replace cumulative totals rather than incrementing them, retain prior data on a failed refresh.
3. Add latest/view-count sorting and daily refresh only as the corresponding implementation stages proceed.
4. Any main merge still needs Production authorization because this repository's main push deploys Pages.
5. Preserve parallel work: prior handover is copied in `previous-handover.md`; current `AI_HANDOVER.md` retains the sasugoldae section.

# GA4 GitHub authentication checkpoint

## Scope and baseline

- Baseline: `main` at `281264eefaa894de4f71392107765cef27e5044f`.
- Synchronized parallel `main@40a4b722ff60cbce62b4179dd9ee2483dcff3ed8` without overwriting the sasugoldae checkpoint or site changes. Original latest handover is retained both inline as the parallel task and in `previous-handover.md`.
- Work branch: `chore/ga4-auth-connection`.
- Scope: authenticate GitHub Actions to the existing GA4 reader and run a read-only cumulative page-view smoke test. No page counters, ingestion, ranking UI, schedule, merge, or Production deployment in this change.
- Remote files were inspected through GitHub. The scratch directory was not a pre-existing local checkout; no existing local work was replaced.

## Confirmed Google configuration

- Project: `GetPassLab Analytics`, ID `level-array-514808-v0`, number `528916134663`.
- Billing account is **not linked**, confirmed in the console before this checkpoint. No payment method or free-trial signup was submitted.
- Google Analytics Data API enabled.
- Service account: `getpasslab-ga4-reader@level-array-514808-v0.iam.gserviceaccount.com`; no service-account keys created.
- GA4 property `547805075`: Viewer role applied after user confirmation, with cost and revenue metric access disabled. Verified in the property access list.

- IAM, Resource Manager, Service Account Credentials, and STS APIs were enabled successfully without linking billing.

## Prepared federation (not saved or granted yet)

- Pool ID `getpasslab-github`; OIDC provider ID `github-actions`.
- Issuer `https://token.actions.githubusercontent.com`; default provider audience.
- Mappings: `google.subject=assertion.sub`, `attribute.repository_id=assertion.repository_id`, `attribute.repository_owner_id=assertion.repository_owner_id`.
- Condition requires repository ID `1292439277`, owner ID `73263769`, refs `main` or `chore/ga4-auth-connection`, events push/workflow_dispatch/schedule, and the exact `.github/workflows/ga4-analytics.yml` workflow reference on those refs.
- Intended IAM grant: `roles/iam.workloadIdentityUser` **on the reader service account only**, to `principalSet://iam.googleapis.com/projects/528916134663/locations/global/workloadIdentityPools/getpasslab-github/attribute.repository_id/1292439277`.
- No project-level Cloud roles, service-account keys, or domain-wide delegation required.
- Saving federation and granting impersonation are pending action-time user confirmation for new external authentication access.

## Implementation and validation

- `.github/workflows/ga4-analytics.yml`: validation on the work branch, optional manual execution once on the default branch; no schedule. Authentication is gated by the repository variable `GA4_WIF_ENABLED == true`, which has not been created/enabled.
- Auth requests a 300-second access token with `analytics.readonly`; no credentials file exported, persisted checkout credentials disabled. Actions pinned to reviewed release commits.
- `scripts/check-ga4-auth.mjs`: one bounded `runReport`, 2026-07-30 through yesterday in the property time zone, production host filter, pagePath/screenPageViews. Only aggregate counts and quota balance are printed, never tokens, raw reports, or individual page paths.
- Local `node --check`: PASS.
- Local `node scripts/test-ga4-auth.mjs`: 7/7 PASS (valid response, 403, 429, invalid schema, thresholding, sampling, invalid property ID), including public-log credential/raw-path redaction checks.
- Workflow YAML structure and permission-boundary inspection: PASS.
- GitHub code commit `56b78731c600ee352194f321f087a027391e1f4f`, [run 43697285839](https://github.com/syjy813/getpasslab/actions/runs/43697285839): validate **success**, authenticate-and-query **skipped** as expected. Documentation/main-sync changes leave all three auth code/workflow files byte-identical, so this evidence is reused.
- Live service-account query: **not run**; external identity trust and GitHub variable remain disabled.
- Site Build/UI/Production QA: not applicable to these isolated auth files; no site source or deployment workflow changed.

## Resume after approval

1. The four prerequisite authentication APIs are enabled. Reuse this console evidence unless configuration changes; do not link billing.
2. Save the prepared pool/provider, verify exact mappings and numeric-ID/branch/workflow restrictions, then grant the service-account impersonation role to the principal above.
3. Set repository Actions variable `GA4_WIF_ENABLED=true` (non-secret), then rerun the workflow on this branch.
4. Inspect authentication and live report results; handle permission propagation before changing policy. Update this checkpoint with actual run/commit evidence. Do not claim the API test passed based on mock fixtures.
5. Keep this PR unmerged until a separate Production approval or a change that cannot trigger Pages deployment is established.

## Next product step

After successful live authentication, implement full page-view ingestion with complete pagination, canonical URL matching, cumulative replacement, source dates/time zone, and failed-refresh preservation. GA4 totals include homes/list pages; they are not article-only totals. Ranking and daily refresh remain separate stages.

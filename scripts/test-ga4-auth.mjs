import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const fixtureToken = 'fixture-token-must-not-appear-in-output';
const valid = {
  dimensionHeaders: [{ name: 'pagePath' }],
  metricHeaders: [{ name: 'screenPageViews' }],
  totals: [{ metricValues: [{ value: '12' }] }],
  rowCount: 2,
  rows: [{ dimensionValues: [{ value: '/example/' }], metricValues: [{ value: '8' }] }],
  metadata: {},
};
const cases = [
  { name: 'valid report', status: 200, body: valid, pass: true },
  { name: 'permission denied', status: 403, body: { error: { message: fixtureToken } } },
  { name: 'quota exceeded', status: 429, body: { error: { message: fixtureToken } } },
  { name: 'invalid response', status: 200, body: { rowCount: 2 } },
  { name: 'thresholded response', status: 200, body: { ...valid, metadata: { subjectToThresholding: true } } },
  { name: 'sampled response', status: 200, body: { ...valid, metadata: { samplingMetadatas: [{}] } } },
  { name: 'invalid property ID', status: 200, body: valid, property: 'invalid/property' },
];
for (const fixture of cases) {
  const stub = `globalThis.fetch = async () => new Response(${JSON.stringify(JSON.stringify(fixture.body))}, { status: ${fixture.status} });`;
  const result = spawnSync(process.execPath, [
    '--import', `data:text/javascript,${encodeURIComponent(stub)}`,
    'scripts/check-ga4-auth.mjs',
  ], {
    env: { ...process.env, GA4_PROPERTY_ID: fixture.property ?? '123', GA4_ACCESS_TOKEN: fixtureToken, GITHUB_STEP_SUMMARY: '' },
    encoding: 'utf8', timeout: 5000,
  });
  assert.equal(result.error, undefined, fixture.name);
  assert.equal(result.status, fixture.pass ? 0 : 1, fixture.name);
  const output = `${result.stdout}${result.stderr}`;
  assert.ok(!output.includes(fixtureToken), `${fixture.name}: credential redaction`);
  assert.ok(!output.includes('/example/'), `${fixture.name}: raw page path is not logged`);
  if (fixture.pass) assert.match(output, /Total page views: 12/);
  else assert.ok(!output.includes(': PASS'), `${fixture.name}: no false success`);
  console.log(`PASS ${fixture.name}`);
}

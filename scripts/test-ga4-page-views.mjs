import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  PAGE_SIZE, buildFacilityViewData, canonicalPagePath, fetchAllPageViews, publishedFacilityPaths,
} from './lib/facility-page-views.mjs';

const publishedPaths = await publishedFacilityPaths(resolve('src/content/facility'));
assert.ok(publishedPaths.includes('/facility-management/career/sasugoldae/'));
assert.ok(!publishedPaths.includes('/facility-management/'));
assert.ok(!publishedPaths.some(path => path.endsWith('/reading-job-postings/')));
assert.equal(canonicalPagePath('/facility-management/career/first-job'), '/facility-management/career/first-job/');
assert.equal(canonicalPagePath('/facility-management/career/first-job/?ref=a'), null);
assert.equal(canonicalPagePath('/facility-management//career/first-job/'), null);

const target = '/facility-management/career/sasugoldae/';
const other = '/facility-management/career/hobyeongbaekma/';
const responseFor = (rows, rowCount, total, metadata = { timeZone: 'Asia/Seoul' }) => ({
  dimensionHeaders: [{ name: 'pagePath' }],
  metricHeaders: [{ name: 'screenPageViews' }],
  rowCount,
  totals: [{ metricValues: [{ value: String(total) }] }],
  rows: rows.map(([path, views]) => ({
    dimensionValues: [{ value: path }], metricValues: [{ value: String(views) }],
  })),
  metadata,
});
const fakeFetch = reports => async (url, options) => {
  assert.match(url, /properties\/547805075:runReport$/);
  const body = JSON.parse(options.body);
  assert.equal(body.dateRanges[0].startDate, '2026-07-30');
  assert.deepEqual(body.dimensionFilter.filter.inListFilter.values, ['getpasslab.co.kr', 'www.getpasslab.co.kr']);
  assert.equal(body.limit, PAGE_SIZE);
  assert.equal(body.offset, reports.calls++ * PAGE_SIZE);
  return new Response(JSON.stringify(reports.items[reports.calls - 1]), { status: 200 });
};
const fixture = {
  calls: 0,
  items: [responseFor([[target, 5], [target.slice(0, -1), 2], ['/facility-management/', 10], ['/unknown/', 1]], 4, 18)],
};
const report = await fetchAllPageViews({ propertyId: '547805075', token: 'fixture', fetchReport: fakeFetch(fixture), now: new Date('2026-11-15T01:00:00Z') });
const snapshot = buildFacilityViewData({ publishedPaths, report, propertyId: '547805075', now: new Date('2026-11-15T01:00:00Z') });
assert.equal(snapshot.articles[target].views, 7);
assert.equal(snapshot.articles[target].recorded, true);
assert.equal(snapshot.articles[other].views, 0);
assert.equal(snapshot.articles[other].recorded, false);
assert.equal(snapshot.totalArticleViews, 7);
assert.equal(snapshot.period.endDate, '2026-11-14');
assert.equal(snapshot.articleCount, publishedPaths.length);
assert.equal(Object.keys(snapshot.articles).length, publishedPaths.length);
assert.ok(!Object.keys(snapshot.articles).includes('/unknown/'));
console.log('PASS published-only canonical matching and missing-view distinction');

const longRows = Array.from({ length: PAGE_SIZE + 1 }, (_, index) => [`/fixture-${index}/`, 1]);
const paging = {
  calls: 0,
  items: [responseFor(longRows.slice(0, PAGE_SIZE), longRows.length, longRows.length),
    responseFor(longRows.slice(PAGE_SIZE), longRows.length, longRows.length)],
};
const complete = await fetchAllPageViews({ propertyId: '547805075', token: 'fixture', fetchReport: fakeFetch(paging) });
assert.equal(paging.calls, 2);
assert.equal(complete.totalRows, PAGE_SIZE + 1);
assert.equal(complete.totalViews, PAGE_SIZE + 1);
console.log('PASS complete GA4 report pagination');

for (const [name, mutation] of [
  ['thresholding', r => { r.metadata.subjectToThresholding = true; }],
  ['sampling', r => { r.metadata.samplingMetadatas = [{}]; }],
  ['data loss', r => { r.metadata.dataLossFromOtherRow = true; }],
  ['mismatched totals', r => { r.totals[0].metricValues[0].value = '99'; }],
  ['incomplete page', r => { r.rowCount = 2; }],
]) {
  const invalid = structuredClone(responseFor([[target, 5]], 1, 5));
  mutation(invalid);
  await assert.rejects(fetchAllPageViews({
    propertyId: '547805075', token: 'fixture', fetchReport: fakeFetch({ calls: 0, items: [invalid] }),
  }), Error, name);
  console.log(`PASS reject ${name}`);
}

const noToken = spawnSync(process.execPath, ['scripts/sync-ga4-page-views.mjs'], {
  encoding: 'utf8', env: { ...process.env, GA4_ACCESS_TOKEN: '', GA4_PROPERTY_ID: '547805075' },
});
assert.equal(noToken.status, 1);
assert.ok(!(`${noToken.stdout}${noToken.stderr}`).includes(target));
console.log('PASS missing credentials fail without exposing article paths');

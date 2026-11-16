import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

export const ga4DataPath = 'src/data/facility-page-views.json';
export const ga4SortingPath = 'src/pages/facility-management/[category]/index.astro';
const approvedSortingBlob = 'b803f73197c9251658e52573e39785b5f31de053';
const gitBlob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

export function assertGA4Snapshot() {
  const snapshot = JSON.parse(fs.readFileSync(ga4DataPath, 'utf8'));
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.scope, 'published-facility-articles');
  assert.equal(snapshot.metric, 'screenPageViews');
  assert.equal(snapshot.period.startDate, '2026-07-30');
  assert.equal(snapshot.period.requestedEndDate, 'yesterday');
  const expected = fs.readdirSync('src/content/facility').filter(name => name.endsWith('.md')).flatMap(name => {
    const source = fs.readFileSync(`src/content/facility/${name}`, 'utf8');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1];
    if (!frontmatter || !/^status:\s*published\s*$/m.test(frontmatter)) return [];
    const category = /^category:\s*([a-z-]+)\s*$/m.exec(frontmatter)?.[1];
    assert.ok(category, 'published facility article has a category');
    return [`/facility-management/${category}/${name.slice(0, -3)}/`];
  }).sort();
  // A newly published article can appear before the next daily GA4 refresh.
  // It is temporarily displayed as unrecorded; never reject a valid publication for that lag.
  const published = new Set(expected);
  const tracked = Object.keys(snapshot.articles);
  assert.ok(tracked.every(path => published.has(path)), 'GA4 snapshot never includes drafts or non-article paths');
  assert.equal(snapshot.articleCount, tracked.length);
  let recordedCount = 0;
  let totalViews = 0;
  for (const { views, recorded } of Object.values(snapshot.articles)) {
    assert.ok(Number.isSafeInteger(views) && views >= 0, 'nonnegative integer page views');
    assert.equal(typeof recorded, 'boolean');
    if (recorded) recordedCount++;
    else assert.equal(views, 0, 'missing GA4 path is not fabricated');
    totalViews += views;
  }
  assert.equal(snapshot.recordedArticleCount, recordedCount);
  assert.equal(snapshot.totalArticleViews, totalViews);
}

export function beforeGA4Sorting(file, bytes) {
  if (file !== ga4SortingPath) return bytes;
  assert.equal(gitBlob(bytes), approvedSortingBlob, 'approved category sorting source exact blob');
  let source = bytes.toString('utf8');
  const suffix = '\n<style is:inline>\n';
  assert.equal(source.split(suffix).length, 2, 'one scoped sorting-style block');
  source = source.slice(0, source.indexOf(suffix));

  const updatedImport = "import { FACILITY_CATEGORIES, facilityArticlePath, facilityCategoryPath, sortFacilityArticles } from '../../../config/facility';";
  const historicalImport = "import { FACILITY_CATEGORIES, facilityCategoryPath, sortFacilityArticles } from '../../../config/facility';";
  assert.ok(source.includes(updatedImport));
  source = source.replace(updatedImport, historicalImport);
  const additions = [
    "import pageViews from '../../../data/facility-page-views.json';\n",
    "const viewStats = pageViews.articles as Record<string, { views: number; recorded: boolean }>;\n",
    "const categoryViewStats = Object.fromEntries(articles.map(article => [facilityArticlePath(article), viewStats[facilityArticlePath(article)] ?? { views: 0, recorded: false }]));\n",
    "const viewDate = pageViews.period.endDate?.replaceAll('-', '.') ?? '집계 확인 중';\n",
  ];
  for (const line of additions) {
    assert.equal(source.split(line).length, 2, `exact GA4 addition: ${line.slice(0, 24)}`);
    source = source.replace(line, '');
  }
  const begin = '\n    {articles.length ? <>';
  const end = ' : <div class="facility-empty"';
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start);
  assert.ok(start >= 0 && finish > start, 'single category-list sorting block');
  source = source.slice(0, start)
    + '\n    {articles.length ? <div class="grid grid-3">{articles.map(article => <FacilityCard article={article} />)}</div>'
    + source.slice(finish);
  return Buffer.from(source);
}

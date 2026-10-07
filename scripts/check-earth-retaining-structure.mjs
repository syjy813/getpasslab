import { readFile } from './read-before-20190804-review.mjs';
import assert from 'node:assert/strict';
import { readdir } from './read-before-formwork-lateral-pressure.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { restoreDisplayReview, reviewedChapterHash, reviewedAssetAdditions } from './reviewed-chapter-hash.mjs';

const sourceReview = JSON.parse(await readFile('docs/audits/2026-10-06-industrial-question-source-repair/review.json', 'utf8'));

const audit = 'docs/audits/2026-10-05-earth-retaining-structure';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const chapter = sourceReview.chapters.find(row => row.path === review.chapters[0].path) ?? review.chapters[0];
async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}
assert.deepEqual([...await walk('src'), ...await walk('public')].sort(), [...Object.keys(baseline.protectedFiles), ...review.assets.map(a => a.path), ...reviewedAssetAdditions.map(a => a.path)].sort());
for (const [file, original] of Object.entries(baseline.protectedFiles)) {
  const row = [...sourceReview.chapters, ...sourceReview.canonicalFiles, ...review.chapters, ...review.displayFiles].find(row => row.path === file);
  if (row && !sourceReview.chapters.includes(row)) assert.equal(row.originalSha256, original);
  const actual = hash(await readFile(file)), expected = row?.sha256 ?? original;
  if (actual !== expected) assert.equal(actual, reviewedChapterHash(file, expected), `${file}: only reviewed changes permitted`);
}
for (const row of review.displayFiles) await restoreDisplayReview(row.path, await readFile(row.path, 'utf8'), `${audit}/review.json`);
const source = await readFile(chapter.path, 'utf8');
const original = await readFile(`${audit}/original-earth-retaining-components.md`, 'utf8');
assert.equal(hash(original), review.chapters[0].originalSha256);
assert.equal(hash(source.slice(0, source.indexOf('---', 3) + 3)), chapter.frontmatterSha256, 'exact source-reviewed metadata and primary assignments');
for (const part of ['흙막이판', '엄지말뚝', '띠장', '버팀대']) assert(source.includes(part));
assert(!source.includes('답안 확인 주의') && !source.includes('2019년 8월 118번'), 'obsolete source-mismatch warning removed after question restoration');
const route = new URL(chapter.url).pathname;
const html = await readFile(`dist${route}index.html`, 'utf8');
assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), chapter.articleSha256);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert(html.includes(`href="${chapter.url}"`) && !html.includes('noindex'));
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), chapter.questions);
assert.equal(hash(await readFile('src/data/questions/industrial-safety.json')), reviewedChapterHash('src/data/questions/industrial-safety.json', review.canonicalSha256));
assert(html.includes('학습용 입체 절개도') && html.includes('치수·접합 상세 생략'));
for (const asset of review.assets) {
  const svg = await readFile(asset.path, 'utf8');
  assert.equal(hash(svg), asset.sha256);
  assert.equal(hash(await readFile(asset.path.replace(/^public\//, 'dist/'))), asset.sha256);
  assert(svg.includes(`viewBox="0 0 ${asset.width} ${asset.height}"`));
  assert(!/<script|<image|<foreignObject|(?:href|src)=/.test(svg));
  for (const part of ['흙막이판', '엄지말뚝', '띠장', '버팀대']) assert(svg.includes(`>${part}</text>`));
  assert((await readFile('dist/sitemap-0.xml', 'utf8')).includes(chapter.url));
}
console.log('[Historical release: Earth retaining] one structure SVG and five matching primary questions; exact reviewed source restoration and all other assets preserved');

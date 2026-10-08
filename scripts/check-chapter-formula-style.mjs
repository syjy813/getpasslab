import { readFile } from './read-before-20190804-review.mjs';
import { publication } from './read-before-clam-shell.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdir } from './read-before-formwork-lateral-pressure.mjs';
import path from 'node:path';
import { readFile as nativeReadFile } from 'node:fs/promises';
import { restoreDisplayReview, reviewedChapterHash, restoreQuestionSourceAssetRefs, reviewedAssetAdditions } from './reviewed-chapter-hash.mjs';

const sourceReview = JSON.parse(await readFile('docs/audits/2026-10-06-industrial-question-source-repair/review.json', 'utf8'));

const audit = 'docs/audits/2026-10-05-all-chapter-gray-formulas';
const reviewFile = `${audit}/review.json`;
const review = JSON.parse(await readFile(reviewFile, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const ftaReview = JSON.parse(await readFile('docs/audits/2026-10-05-fta-symbols-split/review.json', 'utf8'));
const batchReview = JSON.parse(await readFile('docs/audits/2026-10-05-industrial-remaining-splits/review.json', 'utf8'));
const earthReview = JSON.parse(await readFile('docs/audits/2026-10-05-earth-retaining-structure/review.json', 'utf8'));
const addedFiles = [...ftaReview.chapters, ...ftaReview.displayFiles, ...batchReview.chapters, ...earthReview.assets, ...reviewedAssetAdditions].filter(row => row.newFile);
const publicPages = evidence.publicPages.map(row => sourceReview.chapters.find(later => later.url === row.url) ?? earthReview.chapters.find(later => later.url === row.url) ?? batchReview.chapters.find(later => later.url === row.url) ?? ftaReview.chapters.find(later => later.url === row.url) ?? row).concat([...ftaReview.chapters, ...batchReview.chapters].filter(row => row.newFile));
const hash = value => createHash('sha256').update(value).digest('hex');
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}
const files = [...await walk('src'), ...await walk('public')];

// This historical release predates the instant-practice pilot. These two
// paths were added by that separately reviewed feature after the snapshot.
// The all-chapter rollout additionally introduces one static JSON endpoint.
// Keep the allowlist exact; every other unexpected source/asset addition,
// deletion or rename must still fail this inventory guard.
const laterApprovedSources = [
  'src/components/InstantQuestionPractice.astro',
  'src/config/instantPracticeExplanations.js',
];
const optionalRolloutSources = [
  'src/pages/practice-data/[cert].json.ts',
];
const presentRolloutSources = optionalRolloutSources.filter(file => files.includes(file));
const expectedFiles = [
  ...Object.keys(evidence.protectedFiles),
  ...review.displayFiles.map(row => row.path),
  ...addedFiles.map(row => row.path),
  ...laterApprovedSources,
  ...presentRolloutSources,
];
assert.deepEqual(files.sort(), expectedFiles.sort(), 'source/asset inventory preserved');
// The previously approved instant-practice pilot added only two imports and
// one conditional component mount to the shared chapter route. Undo precisely
// those insertions before checking the older reviewed source hash. Do not
// rewrite audit snapshots or ignore arbitrary source changes.
const pilotRoutePath = 'src/pages/[cert]/[exam]/[subject]/[slug].astro';
const pilotRouteInsertions = [
  "import InstantQuestionPractice from '../../../../components/InstantQuestionPractice.astro';",
  "import { INSTANT_PRACTICE_PILOT_SLUG, INSTANT_PRACTICE_PILOT_EXPLANATIONS } from '../../../../config/instantPracticeExplanations.js';",
  `  {chapter.data.cert_id === 'industrial-safety' && chapter.data.exam === 'written' && chapter.data.slug === INSTANT_PRACTICE_PILOT_SLUG && (
    <InstantQuestionPractice questions={linked as any} explanations={INSTANT_PRACTICE_PILOT_EXPLANATIONS} />
  )}`,
].map(fragment => fragment + String.fromCharCode(10));
function restorePilotRoute(file, source) {
  if (file !== pilotRoutePath) return source;
  for (const addition of pilotRouteInsertions) {
    assert.equal(source.split(addition).length, 2, `${file}: expected one exact approved pilot insertion`);
    source = source.replace(addition, '');
  }
  return source;
}
// The independently approved 2026-10-08 homepage simplification (#156)
// replaced this one exact source file. This digest represents the published
// current source, not a wildcard exception or a rewritten historical audit.
const laterApprovedHashes = new Map([
  ['src/pages/index.astro', '12da7256151ddd38f08f7c99f1b3b90b103b3b3d859cf3ffef4235ad0898ead1'],
]);
const sourceViolations = [];
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  const bytes = await readFile(file);
  const verifiedBytes = file === pilotRoutePath
    ? Buffer.from(restorePilotRoute(file, bytes.toString('utf8')), 'utf8')
    : bytes;
  const actual = hash(verifiedBytes);
  if (actual !== expected && actual !== reviewedChapterHash(file, expected) && actual !== laterApprovedHashes.get(file)) {
    sourceViolations.push({ file, actual, expected });
  }
}
for (const row of sourceViolations) console.error('[Historical source hash mismatch]', JSON.stringify(row));
assert.equal(sourceViolations.length, 0, 'unapproved source/asset changes');
for (const row of review.displayFiles) {
  await restoreDisplayReview(row.path, await readFile(row.path, 'utf8'), reviewFile);
}
const pilotDebugFile = 'dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html';
const pilotDebugHtml = await nativeReadFile(pilotDebugFile, 'utf8');
const pilotDebugArticle = pilotDebugHtml.match(/<article\\b[^>]*>([\\s\\S]*?)<\\/article>/)?.[1] ?? '';
const pilotDebugAt = pilotDebugArticle.indexOf('data-instant-practice');
const pilotDebugStart = pilotDebugArticle.lastIndexOf('<div', pilotDebugAt);
const pilotDebugRelated = pilotDebugArticle.indexOf('<h2>관련 챕터</h2>', pilotDebugAt);
console.log('[Formula historical pilot debug]', JSON.stringify({
  articleLength: pilotDebugArticle.length,
  insertionIndex: pilotDebugStart,
  relatedIndex: pilotDebugRelated,
  start: pilotDebugArticle.slice(pilotDebugStart-180,pilotDebugStart+500),
  beforeRelated: pilotDebugArticle.slice(pilotDebugRelated-500,pilotDebugRelated+180),
  scripts: [...pilotDebugArticle.matchAll(/<script\\b[^>]*>/g)].map(x=>x[0]),
}));

const actualRoutes = [];
for (const file of await walk('dist')) {
  if (!file.endsWith('/index.html')) continue;
  const html = await readFile(file, 'utf8');
  if (html.includes('chapter-page') && /<article\b/.test(html)) actualRoutes.push(file.slice(4, -10));
}
assert.deepEqual(actualRoutes.sort(), [...publicPages.map(row => new URL(row.url).pathname), new URL(publication.chapter.url).pathname].sort(), 'all historical routes plus approved clamshell publication');
for (const row of publicPages) {
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  let restoredArticle = sourceReview.chapters.some(chapter => chapter.url === row.url) ? article : restoreQuestionSourceAssetRefs(article);
  for (const release of sourceReview.chapters.some(chapter => chapter.url === row.url) ? [] : [batchReview, ftaReview]) {
    const links = release.relatedLinkChanges.find(change => change.url === row.url);
    if (!links) continue;
    assert.equal(hash(restoredArticle), links.articleSha256);
    assert.equal(restoredArticle.split(links.after).length, 2);
    restoredArticle = restoredArticle.replace(links.after, links.before);
    assert.equal(hash(restoredArticle), links.originalArticleSha256, `${row.url}: only exact related links may change`);
  }
  assert.equal(hash(restoredArticle), row.articleSha256, `${row.url}: article contents changed`);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions, `${row.url}: questions changed`);
  assert(html.includes(`href="${row.url}"`), `${row.url}: canonical changed`);
  assert(!html.includes('formula-gray-sample'), `${row.url}: obsolete sample class`);
}
console.log(`[Historical release: Chapter formula style] ${publicPages.length} public articles/routes and ${Object.keys(evidence.protectedFiles).length} source/assets preserved; 3 display edits reverse exactly`);

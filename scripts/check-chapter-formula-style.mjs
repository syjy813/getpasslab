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
  // The Oct 10 historical reader already verifies and hides these two
  // post-release additions. When it is active, do not count them twice.
  ...laterApprovedSources.filter(file => files.includes(file)),
  ...presentRolloutSources,
];
assert.deepEqual(files.sort(), expectedFiles.sort(), 'source/asset inventory preserved');
// The previously approved instant-practice pilot added only two imports and
// one conditional component mount to the shared chapter route. Undo precisely
// those insertions before checking the older reviewed source hash. Do not
// rewrite audit snapshots or ignore arbitrary source changes.
const pilotRoutePath = 'src/pages/[cert]/[exam]/[subject]/[slug].astro';
const chapterLayoutPath = 'src/layouts/ChapterLayout.astro';
// Only the exact Git-reviewed additions are reversible; every other edit
// must still match historical source hashes. Pilot and rollout forms are
// separately enumerated so this guard can validate both release stages.
const pilotRouteInsertions = [
  "import InstantQuestionPractice from '../../../../components/InstantQuestionPractice.astro';\n",
  "import { INSTANT_PRACTICE_PILOT_SLUG, INSTANT_PRACTICE_PILOT_EXPLANATIONS } from '../../../../config/instantPracticeExplanations.js';\n",
  "  {chapter.data.cert_id === 'industrial-safety' && chapter.data.exam === 'written' && chapter.data.slug === INSTANT_PRACTICE_PILOT_SLUG && (\n    <InstantQuestionPractice questions={linked as any} explanations={INSTANT_PRACTICE_PILOT_EXPLANATIONS} />\n  )}\n"
];
const rolloutRouteInsertions = [
  "import InstantQuestionPractice from '../../../../components/InstantQuestionPractice.astro';\n",
  "import { INSTANT_PRACTICE_PILOT_SLUG } from '../../../../config/instantPracticeExplanations.js';\n",
  "  practiceQuestions={chapter.data.cert_id === 'industrial-safety' && chapter.data.slug === INSTANT_PRACTICE_PILOT_SLUG ? undefined : linked.some(question => !question.review && question.choices.length === 4 && question.answer >= 1 && question.answer <= 4) ? linked as any : undefined}\n",
  "  {chapter.data.cert_id === 'industrial-safety' && chapter.data.exam === 'written' && chapter.data.slug === INSTANT_PRACTICE_PILOT_SLUG && (\n    <InstantQuestionPractice questions={linked as any} certificationId={chapter.data.cert_id} chapterSlug={chapter.data.slug} />\n  )}\n"
];
const rolloutLayoutInsertions = [
  "import InstantQuestionPractice from '../components/InstantQuestionPractice.astro';\n",
  "  practiceQuestions?: any[];\n",
  "  practiceQuestions,\n",
  "  {practiceQuestions && <InstantQuestionPractice questions={practiceQuestions} certificationId={cert_id} chapterSlug={slug} />}\n"
];
function restorePilotRoute(file, source) {
  let insertions = [];
  if (file === pilotRoutePath) {
    // The Oct 10 source audit can already restore the pre-pilot bytes after
    // validating the current rollout hash. Leave that verified baseline alone.
    insertions = source.includes('  practiceQuestions=')
      ? rolloutRouteInsertions
      : source.includes('INSTANT_PRACTICE_PILOT_EXPLANATIONS')
        ? pilotRouteInsertions : [];
  } else if (file === chapterLayoutPath && source.includes('  practiceQuestions?: any[];')) {
    insertions = rolloutLayoutInsertions;
  }
  for (const addition of insertions) {
    assert.equal(source.split(addition).length, 2, `${file}: expected one exact approved insertion`);
    source = source.replace(addition, '');
  }
  return source;
}
// Exact separately reviewed homepage source from 2026-10-08 PR #156.
const laterApprovedHashes = new Map([
  ['src/pages/index.astro', '12da7256151ddd38f08f7c99f1b3b90b103b3b3d859cf3ffef4235ad0898ead1'],
]);
const sourceViolations = [];
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  const bytes = await readFile(file);
  const verifiedBytes = (file === pilotRoutePath || file === chapterLayoutPath)
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
  // The formula release's exact layout snapshot predates the approved
  // all-chapter practice overlay. Reverse only those four reviewed additions
  // before passing bytes to the existing strict display snapshot verifier.
  const current = await readFile(row.path, 'utf8');
  await restoreDisplayReview(row.path, restorePilotRoute(row.path, current), reviewFile);
}

const postPilotPath = 'dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html';
const source2019Audit = 'docs/audits/2026-10-06-industrial-20190804-full-review/';
const source2019Review = JSON.parse(await nativeReadFile(source2019Audit + 'review.json', 'utf8'));
const source2019Baseline = JSON.parse(await nativeReadFile(source2019Audit + 'baseline.json', 'utf8'));
const originalPilotPage = source2019Baseline.pages.find(row => row.path === postPilotPath);
assert(originalPilotPage, 'pilot chapter must be covered by the historical baseline');
async function readHistoricalBuildHtml(file) {
  if (file !== postPilotPath) return readFile(file, 'utf8');

  // The 2026-10-08 pilot introduces precisely one quiz block after the old
  // question-history script and before "관련 챕터". The block is not historical
  // course content; remove it only for the old snapshot comparison.
  const html = await nativeReadFile(file, 'utf8');
  const match = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/);
  assert(match, 'pilot public article must exist');
  const article = match[1];
  const marker = article.indexOf('data-instant-practice');
  const start = article.lastIndexOf('<div', marker);
  const end = article.indexOf('<h2>관련 챕터</h2>', marker);
  assert(marker > 0 && start >= 0 && end > start, 'one bounded pilot modal insertion');
  const inserted = article.slice(start, end);
  assert(inserted.startsWith('<div class="instant-practice"'), 'only the pilot component may be stripped');
  assert(inserted.includes('data-practice-dialog') && inserted.includes('data-practice-item'), 'practice structure verified');
  // Astro may inline this module or emit a separate bundled script as the
  // component grows. Its insertion boundary is validated by the historical
  // article SHA-256 below; either complete ending is allowed.
  assert(inserted.trimEnd().endsWith('</script>') || inserted.trimEnd().endsWith('</div>'), 'complete pilot overlay boundary');

  let restored = article.slice(0, start) + ' ' + article.slice(end);
  // Retain the original 2019 source audit's exact JS-asset reference reversal.
  for (const edit of source2019Review.articleAssetReferenceEdits) {
    assert(restored.split(edit.after).length <= 2, 'at most one approved loader asset');
    restored = restored.replace(edit.after, edit.before);
  }
  assert.equal(hash(restored), originalPilotPage.articleSha256, 'pilot: all historical article bytes preserved');
  return html.replace(article, restored);
}

const actualRoutes = [];
for (const file of await walk('dist')) {
  if (!file.endsWith('/index.html')) continue;
  const html = await readHistoricalBuildHtml(file);
  if (html.includes('chapter-page') && /<article\b/.test(html)) actualRoutes.push(file.slice(4, -10));
}
assert.deepEqual(actualRoutes.sort(), [...publicPages.map(row => new URL(row.url).pathname), new URL(publication.chapter.url).pathname].sort(), 'all historical routes plus approved clamshell publication');
for (const row of publicPages) {
  const html = await readHistoricalBuildHtml(`dist${new URL(row.url).pathname}index.html`);
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

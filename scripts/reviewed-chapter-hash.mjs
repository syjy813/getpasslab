import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

// Keep the release's historical snapshot immutable. Permit only the exact files
// covered by a later text or structural review, retaining their original hashes.
const reviewed = new Map();
for (const file of [
  'docs/audits/2026-10-02-computer-literacy-text-review/review.json',
  'docs/audits/2026-10-02-computer-literacy-082-159-copyedit/review.json',
  'docs/audits/2026-10-03-industrial-safety-machine-tools-split/review.json',
  'docs/audits/2026-10-04-machine-tools-copyedit/review.json',
  'docs/audits/2026-10-04-machine-tools-linebreaks/review.json',
  'docs/audits/2026-10-04-machine-tools-visuals/review.json',
  'docs/audits/2026-10-04-lathe-illustrated-learning/review.json',
  'docs/audits/2026-10-04-lathe-image-crop-fix/review.json',
  'docs/audits/2026-10-04-lathe-figure-spacing/review.json',
  'docs/audits/2026-10-04-milling-illustrated-learning/review.json',
  'docs/audits/2026-10-04-drill-illustrated-learning/review.json',
  'docs/audits/2026-10-04-planer-illustrated-learning/review.json',
  'docs/audits/2026-10-04-accident-analysis-figures/review.json',
  'docs/audits/2026-10-04-accident-analysis-table/review.json',
  'docs/audits/2026-10-04-industrial-safety-chapter-splits/review.json',
  'docs/audits/2026-10-05-split-chapter-concept-copy/review.json',
  'docs/audits/2026-10-05-industrial-remaining-review/review.json',
  'docs/audits/2026-10-05-concentration-gray-formula/review.json',
  'docs/audits/2026-10-05-concentration-bold-formula/review.json',
  'docs/audits/2026-10-05-all-chapter-gray-formulas/review.json',
  'docs/audits/2026-10-05-fta-symbols-split/review.json',
  'docs/audits/2026-10-05-industrial-remaining-splits/review.json',
  'docs/audits/2026-10-05-earth-retaining-structure/review.json',
  'docs/audits/2026-10-06-industrial-question-source-repair/review.json',
  'docs/audits/2026-10-06-fta-original-options/review.json',
]) {
  let review;
  try {
    review = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  const seen = new Set();
  for (const chapter of [...review.chapters, ...(review.canonicalFiles ?? []), ...(review.assetRegistries ?? []), ...(review.displayFiles ?? []).filter(file => !file.newFile)].filter(chapter => chapter.changed)) {
    assert(!seen.has(chapter.path), `${chapter.path}: duplicate file in one review`);
    seen.add(chapter.path);
    const chain = reviewed.get(chapter.path) ?? [];
    if (chain.length) {
      assert.equal(chapter.originalSha256, chain.at(-1).sha256, `${chapter.path}: review chain must preserve the previous approved hash`);
    }
    chain.push(chapter);
    reviewed.set(chapter.path, chain);
  }
}
export function reviewedChapterHash(file, originalHash) {
  const chain = reviewed.get(file);
  if (!chain) return originalHash;
  assert(chain.some(chapter => chapter.originalSha256 === originalHash), `${file}: review must refer to a verified release hash`);
  return chain.at(-1).sha256;
}

// A canonical question correction changes Astro's shared loader filename. Reverse
// only that exact reference so historical article snapshots remain meaningful.
const questionSourceReview = JSON.parse(await readFile('docs/audits/2026-10-06-industrial-question-source-repair/review.json', 'utf8'));
// This later restoration adds only the reviewed image attributes to one button.
const ftaOriginalReview = JSON.parse(await readFile('docs/audits/2026-10-06-fta-original-options/review.json', 'utf8'));
export const reviewedAssetAdditions = ftaOriginalReview.assets;
export function restoreFTAOriginalAssetAttrs(article) {
  for (const edit of ftaOriginalReview.articleEdits) {
    const occurrences = article.split(edit.after).length - 1;
    assert(occurrences <= 1, 'one exact FTA question image button');
    if (occurrences) article = article.replace(edit.after, edit.before);
  }
  return article;
}
export function restoreQuestionSourceAssetRefs(article) {
  article = restoreFTAOriginalAssetAttrs(article);
  for (const edit of questionSourceReview.articleAssetReferenceEdits) {
    const occurrences = article.split(edit.after).length - 1;
    assert(occurrences <= 1, 'at most one exact question loader reference per article');
    if (occurrences) article = article.replace(edit.after, edit.before);
  }
  return article;
}

// Reconstruct a prior display snapshot without weakening its historical checks.
export async function restoreDisplayReview(file, source, reviewFile) {
  const review = JSON.parse(await readFile(reviewFile, 'utf8'));
  const row = review.displayFiles.find(row => row.path === file);
  if (!row) return source;
  const hash = value => createHash('sha256').update(value).digest('hex');
  // Reverse this later figure-only addition before checking older display snapshots.
  if (hash(source) !== row.sha256 && reviewFile !== 'docs/audits/2026-10-05-earth-retaining-structure/review.json') {
    const later = JSON.parse(await readFile('docs/audits/2026-10-05-earth-retaining-structure/review.json', 'utf8'));
    if (later.displayFiles.some(entry => entry.path === file)) {
      source = await restoreDisplayReview(file, source, 'docs/audits/2026-10-05-earth-retaining-structure/review.json');
    }
  }
  assert.equal(hash(source), row.sha256, `${file}: exact later display review`);
  for (const edit of [...row.edits].reverse()) {
    assert.equal(source.split(edit.after).length, 2, `${file}: one exact display edit`);
    source = source.replace(edit.after, edit.before);
  }
  assert.equal(hash(source), row.originalSha256, `${file}: all other display source preserved`);
  return source;
}

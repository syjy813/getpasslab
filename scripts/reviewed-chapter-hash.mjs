import assert from 'node:assert/strict';
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
]) {
  let review;
  try {
    review = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  const seen = new Set();
  for (const chapter of review.chapters.filter(chapter => chapter.changed)) {
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

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Keep the release's historical snapshot immutable. Permit only the exact files
// approved in the later text review, while retaining their original hashes.
const reviewed = new Map();
for (const file of [
  'docs/audits/2026-10-02-computer-literacy-text-review/review.json',
  'docs/audits/2026-10-02-computer-literacy-082-159-copyedit/review.json',
]) {
  let review;
  try {
    review = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  for (const chapter of review.chapters.filter(chapter => chapter.changed)) {
    assert(!reviewed.has(chapter.path), `${chapter.path}: duplicate review override`);
    reviewed.set(chapter.path, chapter);
  }
}
export function reviewedChapterHash(file, originalHash) {
  const chapter = reviewed.get(file);
  if (!chapter) return originalHash;
  assert.equal(chapter.originalSha256, originalHash, `${file}: review must refer to the original release hash`);
  return chapter.sha256;
}

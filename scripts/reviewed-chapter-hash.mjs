import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Keep the release's historical snapshot immutable. Permit only the exact files
// approved in the later text review, while retaining their original hashes.
let review = { chapters: [] };
try {
  review = JSON.parse(await readFile('docs/audits/2026-10-02-computer-literacy-text-review/review.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const reviewed = new Map(review.chapters.filter(chapter => chapter.changed).map(chapter => [chapter.path, chapter]));
export function reviewedChapterHash(file, originalHash) {
  const chapter = reviewed.get(file);
  if (!chapter) return originalHash;
  assert.equal(chapter.originalSha256, originalHash, `${file}: review must refer to the original release hash`);
  return chapter.sha256;
}

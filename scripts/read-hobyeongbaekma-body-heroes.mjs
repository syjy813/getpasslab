import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// Reconstruct only the approved leading-figure deletions for immutable release guards.
// Exact before/after hashes keep every other source byte protected.
export const bodyHeroRemoval = JSON.parse(fs.readFileSync('docs/audits/2026-11-17-hobyeongbaekma-body-heroes/manifest.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function beforeBodyHeroRemoval(file, bytes) {
  const row = bodyHeroRemoval.articles.find(row => row.file === file);
  if (!row) return bytes;
  assert.equal(sha(bytes), row.afterSHA256, file + ': only approved leading figure removed');
  const text = bytes.toString('utf8');
  const previous = text.slice(0, row.offset) + row.removed + text.slice(row.offset);
  assert.equal(sha(previous), row.beforeSHA256, file + ': exact original article restored');
  return Buffer.from(previous);
}

import assert from 'node:assert/strict';
import { readFile, readdir as readActualDirectory } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Historical inventories omit only this exact approved added chapter/route.
// The latest guard independently checks the entire real source/article tree.
export { readFile };
export const excavator = JSON.parse(await readFile('docs/audits/2026-10-07-excavator-operation-safety/review.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readdir(dir, options) {
  const entries = await readActualDirectory(dir, options);
  const key = path.normalize(String(dir));
  const source = key === path.dirname(excavator.chapter.path);
  const route = key === path.dirname(path.dirname(excavator.chapter.articlePath));
  if (!source && !route) return entries;
  const name = source ? path.basename(excavator.chapter.path) : excavator.chapter.slug;
  assert(entries.some(e => (typeof e === 'string' ? e : e.name) === name), 'approved excavator chapter present');
  assert.equal(hash(await readFile(excavator.chapter.path)), excavator.chapter.sha256);
  if (route) {
    const html = await readFile(excavator.chapter.articlePath, 'utf8');
    assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), excavator.chapter.articleSha256);
  }
  return entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
}

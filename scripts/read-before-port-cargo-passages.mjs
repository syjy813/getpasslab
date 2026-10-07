import assert from 'node:assert/strict';
import { readFile, readdir as readActualDirectory } from './read-before-excavator-operation-safety.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Historical inventories omit only this exact approved added chapter/route.
// The latest guard independently checks the entire real source/article tree.
export { readFile };
export const port = JSON.parse(await readFile('docs/audits/2026-10-07-port-cargo-passages/review.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readdir(dir, options) {
  const entries = await readActualDirectory(dir, options);
  const key = path.normalize(String(dir));
  const source = key === path.dirname(port.chapter.path);
  const route = key === path.dirname(path.dirname(port.chapter.articlePath));
  if (!source && !route) return entries;
  const name = source ? path.basename(port.chapter.path) : port.chapter.slug;
  assert(entries.some(e => (typeof e === 'string' ? e : e.name) === name), 'approved port chapter present');
  assert.equal(hash(await readFile(port.chapter.path)), port.chapter.sha256);
  if (route) {
    const html = await readFile(port.chapter.articlePath, 'utf8');
    assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), port.chapter.articleSha256);
  }
  return entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
}

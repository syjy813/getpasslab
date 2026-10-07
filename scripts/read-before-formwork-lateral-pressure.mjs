import assert from 'node:assert/strict';
import { readFile as readActualFile, readdir as readActualDirectory } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Historical inventories omit only this exactly hashed new chapter/route.
// The current publication guard uses native reads and validates the full tree.
const audit = 'docs/audits/2026-10-07-formwork-lateral-pressure';
export const formwork = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const hash = b => createHash('sha256').update(b).digest('hex');
async function verifyAddition(isRoute) {
  assert.equal(hash(await readActualFile(formwork.chapter.path)), formwork.chapter.sha256, 'exact approved added chapter');
  if (isRoute) {
    const html = await readActualFile(formwork.chapter.articlePath, 'utf8');
    assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), formwork.chapter.articleSha256, 'exact approved added article');
  }
}
export async function readdir(dir, options) {
  const entries = await readActualDirectory(dir, options);
  const key = path.normalize(String(dir));
  const source = key === path.dirname(formwork.chapter.path);
  const route = key === path.dirname(path.dirname(formwork.chapter.articlePath));
  if (!source && !route) return entries;
  const name = source ? path.basename(formwork.chapter.path) : formwork.chapter.slug;
  assert(entries.some(e => (typeof e === 'string' ? e : e.name) === name), 'approved addition present');
  await verifyAddition(route);
  return entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
}
export async function readFile(file, encoding) {
  let bytes = await readActualFile(file);
  const row = formwork.relatedArticleChanges.find(row => row.path === String(file));
  if (row) {
    const html = bytes.toString('utf8'), article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    assert.equal(hash(article), row.sha256, 'exact approved automatic related link');
    assert.equal(article.split(row.insertedHtml).length, 2);
    const original = article.replace(row.insertedHtml, '');
    assert.equal(hash(original), row.originalSha256, 'all prior article bytes preserved');
    assert.equal(original, JSON.parse(await readActualFile(row.originalFile, 'utf8')).article);
    bytes = Buffer.from(html.replace(article, () => original));
  }
  return encoding ? bytes.toString(encoding) : bytes;
}

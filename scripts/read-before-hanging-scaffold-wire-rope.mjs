import assert from 'node:assert/strict';
import { readFile as readActualFile, readdir as readActualDirectory } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Exact historical reads only; the newest guard checks all real source and article bytes.
const audit = 'docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const review = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const compatibility = JSON.parse(await readActualFile(`${audit}/compatibility.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function approvedOriginal(row, bytes, articleOnly = false) {
  const actual = articleOnly ? bytes.toString('utf8').match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1] : bytes;
  assert.equal(hash(actual), row.sha256, `${row.path}: exact already-approved change`);
  const original = articleOnly ? JSON.parse(await readActualFile(row.originalFile, 'utf8')).article : await readActualFile(row.originalFile);
  assert.equal(hash(original), row.originalSha256, `${row.path}: exact historical bytes`);
  return articleOnly ? Buffer.from(bytes.toString('utf8').replace(actual, () => original)) : original;
}
export async function readFile(file, encoding) {
  let bytes = await readActualFile(file);
  const key = path.normalize(String(file));
  const related = review.relatedArticleChanges.find(r => r.path === key);
  if (related) {
    const html = bytes.toString('utf8'), article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    assert.equal(hash(article), related.sha256); assert.equal(article.split(related.insertedHtml).length, 2);
    const original = article.replace(related.insertedHtml, ''); assert.equal(hash(original), related.originalSha256);
    bytes = Buffer.from(html.replace(article, () => original));
  }
  const source = compatibility.sourceChanges.find(r => r.path === key && !r.newFile);
  if (source) bytes = await approvedOriginal(source, bytes);
  const pilot = compatibility.articleChanges.find(r => r.path === key);
  if (pilot) bytes = await approvedOriginal(pilot, bytes, true);
  return encoding ? bytes.toString(encoding) : bytes;
}
export async function readdir(dir, options) {
  let entries = await readActualDirectory(dir, options);
  const key = path.normalize(String(dir));
  for (const row of compatibility.sourceChanges.filter(r => r.newFile && path.dirname(r.path) === key)) {
    assert.equal(hash(await readActualFile(row.path)), row.sha256);
    assert(entries.some(e => (typeof e === 'string' ? e : e.name) === path.basename(row.path)));
    entries = entries.filter(e => (typeof e === 'string' ? e : e.name) !== path.basename(row.path));
  }
  const source = key === path.dirname(review.chapter.path);
  const route = key === path.dirname(path.dirname(review.chapter.articlePath));
  if (!source && !route) return entries;
  assert.equal(hash(await readActualFile(review.chapter.path)), review.chapter.sha256);
  if (route) assert.equal(hash((await readActualFile(review.chapter.articlePath, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
  const name = source ? path.basename(review.chapter.path) : review.chapter.slug;
  assert(entries.some(e => (typeof e === 'string' ? e : e.name) === name));
  return entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
}

import assert from 'node:assert/strict';
import { readFile as readActualFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Only the exact six approved source/article revisions can be restored for
// historical assertions. The latest guard separately checks actual bytes.
const audit = 'docs/audits/2026-10-07-industrial-unassigned-links';
export const links = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readFile(file, encoding) {
  let bytes = await readActualFile(file);
  const source = links.chapters.find(row => row.path === String(file));
  const article = links.articles.find(row => row.path === String(file));
  if (source) {
    assert.equal(hash(bytes), source.sha256, 'exact approved chapter link revision');
    bytes = await readActualFile(source.originalFile);
    assert.equal(hash(bytes), source.originalSha256, 'exact original chapter');
  } else if (article) {
    const html = bytes.toString('utf8');
    const current = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    assert.equal(hash(current), article.sha256, 'exact approved article revision');
    const original = JSON.parse(await readActualFile(article.originalFile, 'utf8')).article;
    assert.equal(hash(original), article.originalSha256, 'exact original article');
    bytes = Buffer.from(html.replace(current, original));
  }
  return encoding ? bytes.toString(encoding) : bytes;
}

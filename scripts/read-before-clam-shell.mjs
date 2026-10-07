import assert from 'node:assert/strict';
import { readFile as readActualFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Restore the exact unpublished stub for historical release assertions. The
// current publication guard checks actual sources, articles and allocation.
const audit = 'docs/audits/2026-10-07-clam-shell-chapter';
export const publication = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readFile(file, encoding) {
  let bytes = await readActualFile(file);
  if (String(file) === publication.chapter.path) {
    assert.equal(hash(bytes), publication.chapter.sha256, 'exact approved clamshell chapter');
    bytes = await readActualFile(publication.chapter.originalFile);
    assert.equal(hash(bytes), publication.chapter.originalSha256, 'exact original unpublished stub');
  } else {
    const row = publication.relatedArticleChanges.find(row => row.path === String(file));
    if (row) {
      let html = bytes.toString('utf8');
      const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
      assert.equal(hash(article), row.sha256, 'exact approved related link addition');
      assert.equal(article.split(row.insertedHtml).length, 2);
      const original = article.replace(row.insertedHtml, '');
      assert.equal(hash(original), row.articleSha256, 'all previous article content preserved');
      html = html.replace(article, original);
      bytes = Buffer.from(html);
    }
  }
  return encoding ? bytes.toString(encoding) : bytes;
}

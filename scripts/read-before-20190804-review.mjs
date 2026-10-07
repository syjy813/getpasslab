import assert from 'node:assert/strict';
import { readFile as readActualFile } from './read-before-clam-shell.mjs';
import { createHash } from 'node:crypto';

// Historical release checks operate on their original snapshot. Undo only this
// later, explicitly hashed review; the new check verifies the actual release.
const audit = 'docs/audits/2026-10-06-industrial-20190804-full-review';
const review = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const edits = JSON.parse(await readActualFile(`${audit}/canonical-edits.json`, 'utf8'));
const baseline = JSON.parse(await readActualFile(`${audit}/baseline.json`, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
export async function readFile(file, encoding) {
  const key = String(file), loader = review.generatedLoader;
  let bytes = await readActualFile(key === `dist${loader.originalPath}` ? `dist${loader.path}` : file);
  const row = [...review.chapters, ...review.canonicalFiles, ...review.assetRegistries, ...review.displayFiles].find(row => row.path === key);
  if (row) {
    assert.equal(hash(bytes), row.sha256, `${key}: exact approved later source`);
    if (row.originalFile) bytes = await readActualFile(row.originalFile);
    else {
      let text = bytes.toString('utf8');
      for (const edit of [...(row.editsFile ? edits : row.edits)].reverse()) {
        assert.equal(text.split(edit.after).length, 2, `${key}: one exact later edit`);
        text = text.replace(edit.after, edit.before);
      }
      bytes = Buffer.from(text);
    }
    assert.equal(hash(bytes), row.originalSha256, `${key}: historical bytes preserved`);
  } else if (key === `dist${loader.originalPath}`) {
    assert.equal(hash(bytes), loader.sha256);
    let text = bytes.toString('utf8');
    for (const edit of loader.edits) {
      assert.equal(text.split(edit.after).length, 2);
      text = text.replace(edit.after, edit.before);
    }
    bytes = Buffer.from(text);
    assert.equal(hash(bytes), loader.originalSha256, 'only dataset import changed');
  } else if (key.startsWith('dist/') && key.endsWith('/index.html')) {
    let html = bytes.toString('utf8');
    const match = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/);
    if (match) {
      let article = match[1];
      const changed = review.articles.find(row => row.path === key);
      if (changed) {
        assert.equal(hash(article), changed.articleSha256, `${key}: exact reviewed article`);
        article = await readActualFile(changed.originalFile, 'utf8');
        assert.equal(hash(article), changed.originalArticleSha256);
      } else {
        for (const edit of review.articleAssetReferenceEdits) {
          assert(article.split(edit.after).length <= 2);
          article = article.replace(edit.after, edit.before);
        }
      }
      const prior = baseline.pages.find(row => row.path === key);
      if (prior) assert.equal(hash(article), prior.articleSha256, `${key}: all other article bytes preserved`);
      html = html.replace(match[1], article);
    }
    bytes = Buffer.from(html);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}

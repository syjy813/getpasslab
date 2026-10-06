import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { restoreDisplayReview, reviewedChapterHash, restoreQuestionSourceAssetRefs, reviewedAssetAdditions } from './reviewed-chapter-hash.mjs';

const sourceReview = JSON.parse(await readFile('docs/audits/2026-10-06-industrial-question-source-repair/review.json', 'utf8'));

const audit = 'docs/audits/2026-10-05-all-chapter-gray-formulas';
const reviewFile = `${audit}/review.json`;
const review = JSON.parse(await readFile(reviewFile, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const ftaReview = JSON.parse(await readFile('docs/audits/2026-10-05-fta-symbols-split/review.json', 'utf8'));
const batchReview = JSON.parse(await readFile('docs/audits/2026-10-05-industrial-remaining-splits/review.json', 'utf8'));
const earthReview = JSON.parse(await readFile('docs/audits/2026-10-05-earth-retaining-structure/review.json', 'utf8'));
const addedFiles = [...ftaReview.chapters, ...ftaReview.displayFiles, ...batchReview.chapters, ...earthReview.assets, ...reviewedAssetAdditions].filter(row => row.newFile);
const publicPages = evidence.publicPages.map(row => sourceReview.chapters.find(later => later.url === row.url) ?? earthReview.chapters.find(later => later.url === row.url) ?? batchReview.chapters.find(later => later.url === row.url) ?? ftaReview.chapters.find(later => later.url === row.url) ?? row).concat([...ftaReview.chapters, ...batchReview.chapters].filter(row => row.newFile));
const hash = value => createHash('sha256').update(value).digest('hex');
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}
const files = [...await walk('src'), ...await walk('public')];
assert.deepEqual(files.sort(), [...Object.keys(evidence.protectedFiles), ...review.displayFiles.map(row => row.path), ...addedFiles.map(row => row.path)].sort(), 'source/asset inventory preserved');
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  const actual = hash(await readFile(file));
  if (actual !== expected) assert.equal(actual, reviewedChapterHash(file, expected), `${file}: content/question/asset changed`);
}
for (const row of review.displayFiles) {
  await restoreDisplayReview(row.path, await readFile(row.path, 'utf8'), reviewFile);
}
const actualRoutes = [];
for (const file of await walk('dist')) {
  if (!file.endsWith('/index.html')) continue;
  const html = await readFile(file, 'utf8');
  if (html.includes('chapter-page') && /<article\b/.test(html)) actualRoutes.push(file.slice(4, -10));
}
assert.deepEqual(actualRoutes.sort(), publicPages.map(row => new URL(row.url).pathname).sort(), 'all public chapter routes preserved');
for (const row of publicPages) {
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  let restoredArticle = sourceReview.chapters.some(chapter => chapter.url === row.url) ? article : restoreQuestionSourceAssetRefs(article);
  for (const release of sourceReview.chapters.some(chapter => chapter.url === row.url) ? [] : [batchReview, ftaReview]) {
    const links = release.relatedLinkChanges.find(change => change.url === row.url);
    if (!links) continue;
    assert.equal(hash(restoredArticle), links.articleSha256);
    assert.equal(restoredArticle.split(links.after).length, 2);
    restoredArticle = restoredArticle.replace(links.after, links.before);
    assert.equal(hash(restoredArticle), links.originalArticleSha256, `${row.url}: only exact related links may change`);
  }
  assert.equal(hash(restoredArticle), row.articleSha256, `${row.url}: article contents changed`);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions, `${row.url}: questions changed`);
  assert(html.includes(`href="${row.url}"`), `${row.url}: canonical changed`);
  assert(!html.includes('formula-gray-sample'), `${row.url}: obsolete sample class`);
}
console.log(`[Chapter formula style] ${publicPages.length} public articles/routes and ${Object.keys(evidence.protectedFiles).length} source/assets preserved; 3 display edits reverse exactly`);

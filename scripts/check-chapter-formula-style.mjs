import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { restoreDisplayReview } from './reviewed-chapter-hash.mjs';

const audit = 'docs/audits/2026-10-05-all-chapter-gray-formulas';
const reviewFile = `${audit}/review.json`;
const review = JSON.parse(await readFile(reviewFile, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
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
assert.deepEqual(files.sort(), [...Object.keys(evidence.protectedFiles), ...review.displayFiles.map(row => row.path)].sort(), 'source/asset inventory preserved');
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  assert.equal(hash(await readFile(file)), expected, `${file}: content/question/asset changed`);
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
assert.deepEqual(actualRoutes.sort(), evidence.publicPages.map(row => new URL(row.url).pathname).sort(), 'all public chapter routes preserved');
for (const row of evidence.publicPages) {
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), row.articleSha256, `${row.url}: article contents changed`);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions, `${row.url}: questions changed`);
  assert(html.includes(`href="${row.url}"`), `${row.url}: canonical changed`);
  assert(!html.includes('formula-gray-sample'), `${row.url}: obsolete sample class`);
}
console.log(`[Chapter formula style] ${evidence.publicPages.length} public articles/routes and ${Object.keys(evidence.protectedFiles).length} source/assets preserved; 3 display edits reverse exactly`);

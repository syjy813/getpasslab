import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { reviewedChapterHash } from './reviewed-chapter-hash.mjs';

const audit = 'docs/audits/2026-10-05-industrial-remaining-review';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const hash = source => createHash('sha256').update(source).digest('hex');
const normalize = source => source.replace(/\s+/gu, '').replaceAll('·', '');
assert.equal(review.chapters.length, 211);
assert.equal(review.chapters.filter(c => c.changed).length, evidence.changedChapterCount);
for (const row of review.chapters) {
  const source = await readFile(row.path, 'utf8');
  assert.equal(hash(source), row.sha256, `${row.slug}: unreviewed changes`);
  const end = source.indexOf('---', 3) + 3;
  assert.equal(hash(source.slice(0, end)), row.frontmatterSha256, `${row.slug}: metadata changed`);
  assert.equal(hash(normalize(source)), row.preservedContentSha256, `${row.slug}: learning text changed beyond recorded edits`);
  const route = new URL(row.url).pathname;
  const html = await readFile(`dist${route}index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`href="${row.url}"`), `${row.slug}: canonical changed`);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions, `${row.slug}: question buttons changed`);
  assert(!html.includes('class="katex-error"'), `${row.slug}: math parse error`);
}
for (const row of review.displayFiles ?? []) {
  assert.equal(hash(await readFile(row.path, 'utf8')), reviewedChapterHash(row.path, row.sha256), `${row.path}: unreviewed display change`);
}
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  assert.equal(hash(await readFile(file)), expected, `${file}: unrelated source or asset changed`);
}
console.log(`[Remaining chapter review] ${review.chapters.length} pages / ${evidence.changedChapterCount} edited; metadata, learning tokens and ${Object.keys(evidence.protectedFiles).length} other source/assets preserved`);

// Verify the bold-only CSS insertion, then reconstruct the preceding color preview.
const bold = JSON.parse(await readFile('docs/audits/2026-10-05-concentration-bold-formula/review.json', 'utf8'));
const beforeBold = new Map();
for (const row of bold.displayFiles) {
  const source = await readFile(row.path, 'utf8');
  assert.equal(hash(source), row.sha256);
  assert.equal(source.split(row.insertedCss).length, 2);
  const restored = source.replace(row.insertedCss, '');
  assert.equal(hash(restored), row.originalSha256, `${row.path}: bold preview must preserve all other CSS`);
  beforeBold.set(row.path, restored);
}
// A later one-chapter color preview must reproduce the preceding display files exactly.
const sample = JSON.parse(await readFile('docs/audits/2026-10-05-concentration-gray-formula/review.json', 'utf8'));
for (const row of sample.displayFiles) {
  let source = beforeBold.get(row.path) ?? await readFile(row.path, 'utf8');
  assert.equal(hash(source), row.sha256);
  if (row.insertedCss) {
    assert.equal(source.split(row.insertedCss).length, 2);
    source = source.replace(row.insertedCss, '');
  }
  for (const edit of [...(row.edits ?? [])].reverse()) {
    assert.equal(source.split(edit.after).length, 2);
    source = source.replace(edit.after, edit.before);
  }
  assert.equal(hash(source), row.originalSha256, `${row.path}: color sample must preserve all other source`);
}
const sampleProtection = JSON.parse(await readFile('docs/audits/2026-10-05-concentration-gray-formula/source-verification.json', 'utf8'));
for (const [file, expected] of Object.entries(sampleProtection.protectedFiles)) assert.equal(hash(await readFile(file)), expected, `${file}: one-chapter preview changed unrelated source`);

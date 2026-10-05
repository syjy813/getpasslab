import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

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
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  assert.equal(hash(await readFile(file)), expected, `${file}: unrelated source or asset changed`);
}
console.log(`[Remaining chapter review] ${review.chapters.length} pages / ${evidence.changedChapterCount} edited; metadata, learning tokens and ${Object.keys(evidence.protectedFiles).length} other source/assets preserved`);

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';

const base = 'cbcb81020d6489193e278eeee1160f4268972f33';
const audit = 'docs/audits/2026-10-02-computer-literacy-text-review/';
const baseline = JSON.parse(await readFile('docs/audits/2026-09-30-computer-literacy-001-081/source-verification.json', 'utf8'));
const hash = content => createHash('sha256').update(content).digest('hex');
const parse = content => yaml.load(content.match(/^---\n([\s\S]*?)\n---/)[1]);
const fixed = data => ({
  ...data,
  summary: undefined,
  supportingQuestions: data.supportingQuestions?.map(({ note, ...identity }) => identity),
});
const chapters = [];
for (const chapter of baseline.chapters) {
  const original = execFileSync('git', ['show', base + ':' + chapter.path]);
  const current = await readFile(chapter.path);
  assert.equal(hash(original), chapter.sha256, chapter.path + ': baseline');
  assert.deepEqual(fixed(parse(current.toString())), fixed(parse(original.toString())), chapter.path + ': stable fields');
  chapters.push({
    order: chapter.order, path: chapter.path, slug: chapter.slug, title: chapter.title,
    originalSha256: hash(original), sha256: hash(current), changed: !current.equals(original),
    status: current.equals(original) ? '전체 검토 · 수정 불필요' : '문구 수정',
  });
}
for (const file of ['src/data/questions/computer-literacy.json', 'src/data/question-assets/computer-literacy.json']) {
  assert.equal(hash(await readFile(file)), hash(execFileSync('git', ['show', base + ':' + file])), file + ': canonical data unchanged');
}
const review = { base, reviewedAt: new Date().toISOString(), reviewed: chapters.length, changed: chapters.filter(c => c.changed).length, stableFieldsAndCanonicalData: 'PASS', chapters };
await writeFile(audit + 'review.json', JSON.stringify(review, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: review.reviewed, changed: review.changed, preserved: review.reviewed - review.changed, stableFieldsAndCanonicalData: review.stableFieldsAndCanonicalData }));

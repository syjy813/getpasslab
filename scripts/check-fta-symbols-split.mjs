import { readFile } from './read-before-20190804-review.mjs';
import { reviewedChapterHash, restoreQuestionSourceAssetRefs } from './reviewed-chapter-hash.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-05-fta-symbols-split';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const parse = source => yaml.load(source.match(/^---\n([\s\S]*?)\n---\n/)[1]);
const original = await readFile(`${audit}/original.md`, 'utf8');
assert.equal(hash(original), baseline.parentBeforeSha256);
assert.equal(hash(await readFile('src/data/questions/industrial-safety.json')), reviewedChapterHash('src/data/questions/industrial-safety.json', baseline.canonicalSha256));
assert.equal(hash(await readFile('src/data/question-assets/industrial-safety.json')), reviewedChapterHash('src/data/question-assets/industrial-safety.json', baseline.questionAssetsSha256));
assert.equal(hash(await readFile('public/images/chapters/fta-symbols/fta-symbols.svg')), baseline.originalFigureSha256);
assert.equal(review.chapters.length, 3);
const assigned = review.chapters.flatMap(row => row.questions);
assert.equal(assigned.length, 12);
assert.equal(new Set(assigned).size, 12);
assert.deepEqual(assigned.sort(), [...baseline.parentBeforeQuestions].sort());
const canonical = new Map(JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8')).map(q => [q.id, q]));
for (const row of review.chapters) {
  const source = await readFile(row.path, 'utf8');
  assert.equal(hash(source), row.sha256);
  const fields = parse(source);
  assert.equal(fields.slug, row.slug); assert.equal(fields.subject_id, 2); assert.equal(fields.status, '완료');
  assert.deepEqual(fields.questions, row.questions); assert.deepEqual(fields.related, row.related);
  if (!row.newFile) {
    const before = parse(original);
    for (const key of ['slug', 'title', 'subject_id', 'order', 'group', 'priority']) assert.equal(fields[key], before[key], `parent ${key}`);
    const boolean = original.split('## FTA에 쓰는 불대수 기본정리\n\n')[1].split('\n## 기호 구분')[0];
    assert(source.includes(boolean), 'Boolean foundation preserved exactly');
  }
  for (const id of row.questions) {
    assert.equal(canonical.get(id)?.subject_id, 2); assert.equal(canonical.get(id)?.review, '');
  }
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  assert.equal(hash(restoreQuestionSourceAssetRefs(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1])), row.articleSha256);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(!/katex-error|noindex|http-equiv="refresh"/.test(html));
  assert(html.includes(`href="${row.url}"`));
  for (const child of review.families[0].children) {
    if (row.slug === 'fta-symbols') assert(html.includes(`/industrial-safety/written/ergonomics/${child}/`));
    else assert(html.includes('/industrial-safety/written/ergonomics/fta-symbols/'));
  }
}
for (const row of review.displayFiles) assert.equal(hash(await readFile(row.path)), row.sha256);
const toc = await readFile('dist/industrial-safety/written/ergonomics/index.html', 'utf8');
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const row of review.chapters) { assert(toc.includes(new URL(row.url).pathname)); assert(sitemap.includes(row.url)); }
// Independent Boolean truth-table check of the retained distribution/De Morgan/absorption laws.
for (const a of [false, true]) for (const b of [false, true]) for (const c of [false, true]) {
  assert.equal(a && (b || c), (a && b) || (a && c));
  assert.equal(a || (b && c), (a || b) && (a || c));
  assert.equal(!(a || b), !a && !b); assert.equal(!(a && b), !a || !b);
  assert.equal(a || (a && b), a); assert.equal(a && (a || b), a); assert.equal(a || (!a && b), a || b);
}
console.log('[Historical release: FTA split] 3 routes, 5+7 unique primary questions, original payloads/figures and Boolean foundation preserved; TOC/sitemap/return links pass');

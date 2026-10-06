import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';
import { restoreQuestionSourceAssetRefs, restoreFTAOriginalAssetAttrs, reviewedAssetAdditions, reviewedChapterHash } from './reviewed-chapter-hash.mjs';

const audit = 'docs/audits/2026-10-06-industrial-question-source-repair';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const sourceQuestions = JSON.parse(await readFile(`${audit}/question-source-review.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const parse = text => yaml.load(text.match(/^---\n([\s\S]*?)\n---\n/)[1]);
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}
assert.deepEqual([...await walk('src'), ...await walk('public')].sort(), [...Object.keys(baseline.protectedFiles), ...reviewedAssetAdditions.map(row => row.path)].sort());
const changed = new Map([...review.chapters, ...review.canonicalFiles].map(row => [row.path, row]));
assert.equal(changed.size, 5);
for (const [file, before] of Object.entries(baseline.protectedFiles)) {
  const row = changed.get(file);
  if (row) assert.equal(row.originalSha256, before);
  const actual = hash(await readFile(file)), expected = row?.sha256 ?? before;
  if (actual !== expected) assert.equal(actual, reviewedChapterHash(file, expected), `${file}: only exact reviewed edits allowed`);
}
const canonicalRow = review.canonicalFiles[0];
let restored = await readFile(canonicalRow.path, 'utf8');
assert.deepEqual(canonicalRow.edits.map(row => row.id).sort(), ['20190804_117', '20190804_118', '20190804_120']);
for (const edit of [...canonicalRow.edits].reverse()) {
  assert.equal(restored.split(edit.after).length, 2);
  restored = restored.replace(edit.after, edit.before);
}
assert.equal(hash(restored), canonicalRow.originalSha256, 'restore exact original bytes: all other 1677 records and formatting preserved');
const oldQuestions = JSON.parse(restored);
const questions = JSON.parse(await readFile(canonicalRow.path, 'utf8'));
assert.equal(questions.length, 1680);
assert.equal(new Set(questions.map(q => q.id)).size, 1680);
for (const [index, question] of questions.entries()) {
  const old = oldQuestions[index], source = sourceQuestions.find(row => row.id === question.id);
  if (!source) { assert.deepEqual(question, old); continue; }
  assert.deepEqual(source.before, old); assert.deepEqual(source.after, question);
  for (const key of Object.keys(question).filter(key => !['body', 'choices'].includes(key))) assert.deepEqual(question[key], old[key], `${question.id}: frozen ${key}`);
  assert.equal(question.answer, source.sourceAnswer); assert.equal(source.sourcePage, 8);
}
const allocations = new Map();
const beforeAllocations = new Map();
let published = 0;
for (const file of await walk('src/content/chapters')) {
  if (!file.endsWith('.md')) continue;
  const fields = parse(await readFile(file, 'utf8'));
  if ((fields.cert_id ?? 'industrial-safety') !== 'industrial-safety' || fields.status !== '완료') continue;
  published++;
  const row = changed.get(file);
  const beforeFields = row ? parse(await readFile(`${audit}/originals/${row.slug}.md`, 'utf8')) : fields;
  for (const [collection, ids] of [[allocations, fields.questions ?? []], [beforeAllocations, beforeFields.questions ?? []]]) {
    for (const id of ids) collection.set(id, [...collection.get(id) ?? [], fields.slug]);
  }
}
assert.equal(published, 258);
assert.deepEqual([...allocations.keys()].sort(), [...beforeAllocations.keys()].sort());
assert.equal([...allocations.values()].flat().length, 1019);
for (const [id, slugs] of beforeAllocations) {
  const moved = review.allocations.find(row => row.id === id);
  if (moved) { assert.deepEqual(slugs, [moved.from]); assert.deepEqual(allocations.get(id), [moved.to]); }
  else assert.deepEqual(allocations.get(id), slugs, `${id}: unrelated assignment changed`);
}
assert(!allocations.has('20190804_120'), 'previously unassigned Clam shell question stays unassigned');
assert.equal(review.unchangedArticles.length, 438);
for (const row of review.unchangedArticles) {
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  assert.equal(hash(restoreFTAOriginalAssetAttrs(article)), row.articleSha256);
  assert.equal(hash(restoreQuestionSourceAssetRefs(article)), row.originalArticleSha256, `${row.url}: only generated loader filename changed`);
}
const loader = review.generatedLoader;
let loaderSource = await readFile(`dist${loader.path}`, 'utf8');
assert.equal(hash(loaderSource), loader.sha256);
for (const edit of [...loader.edits].reverse()) {
  assert.equal(loaderSource.split(edit.after).length, 2);
  loaderSource = loaderSource.replace(edit.after, edit.before);
}
assert.equal(hash(loaderSource), loader.originalSha256, 'shared popup logic unchanged; only dataset filename changed');
for (const row of review.chapters) {
  const source = await readFile(row.path, 'utf8');
  const original = await readFile(`${audit}/originals/${row.slug}.md`, 'utf8');
  assert.equal(hash(original), row.originalSha256);
  const fields = parse(source), before = parse(original);
  for (const key of Object.keys(before).filter(key => !['questions', ...(row.slug === 'earth-retaining-components' ? ['summary', 'examComment'] : [])].includes(key))) assert.deepEqual(fields[key], before[key], `${row.slug}: frozen ${key}`);
  assert.deepEqual(fields.questions, row.questions);
  assert.equal(hash(source.slice(0, source.indexOf('---', 3) + 3)), row.frontmatterSha256);
  const html = await readFile(`dist${new URL(row.url).pathname}index.html`, 'utf8');
  assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), row.articleSha256);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(match => match[1]), row.questions);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`href="${row.url}"`) && !/noindex|katex-error/.test(html));
}
console.log('[Question source repair] 117/118/120 restored; 1677 other records, all answers/IDs/assets unchanged; only two primary assignments moved; 258 chapters / 1019 primary references');

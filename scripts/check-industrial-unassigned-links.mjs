import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-07-industrial-unassigned-links';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${review.baselineAudit}/baseline.json`, 'utf8'));
const publication = JSON.parse(await readFile(`${review.baselineAudit}/review.json`, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/question-review.json`, 'utf8'));
const hash = b => createHash('sha256').update(b).digest('hex');
const fields = text => yaml.load(text.match(/^---\n([\s\S]*?)\n---/)[1]);
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    files.push(...(entry.isDirectory() ? await walk(file) : [file]));
  }
  return files;
}
assert.equal(review.head, '22e57b360a492c69596a72bee590b8cf3c38214a');
assert.deepEqual(review.chapters.map(r => r.addedQuestion), ['20190804_103', '20190804_110', '20190804_111', '20190804_112', '20190804_114', '20190804_115']);
const protectedFiles = { ...baseline.protectedFiles, [publication.chapter.path]: publication.chapter.sha256 };
assert.deepEqual([...await walk('src'), ...await walk('public')].sort(), Object.keys(protectedFiles).sort());
for (const [file, expected] of Object.entries(protectedFiles)) {
  const row = review.chapters.find(row => row.path === file);
  assert.equal(hash(await readFile(file)), row?.sha256 ?? expected, `${file}: exact approved scope`);
  if (!row) continue;
  const original = await readFile(row.originalFile, 'utf8');
  assert.equal(hash(original), row.originalSha256); assert.equal(hash(original), expected);
  const before = fields(original), after = fields(await readFile(file, 'utf8'));
  assert(!before.questions.includes(row.addedQuestion));
  assert.deepEqual(after.questions, [...before.questions, row.addedQuestion]);
  assert.deepEqual(after.questions, row.questions);
  for (const key of Object.keys(before).filter(k => k !== 'questions' && !(row.slug === 'safety-factor' && k === 'examComment'))) assert.deepEqual(after[key], before[key], `${row.slug}: frozen ${key}`);
  if (!['safety-factor', 'safety-management-cost'].includes(row.slug)) assert.equal((await readFile(file, 'utf8')).split('\n---')[1], original.split('\n---')[1], 'metadata-only revision');
}
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
assert.equal(evidence.length, 11);
for (const row of evidence) {
  assert.deepEqual(questions.find(q => q.id === row.record.id), row.record);
  assert.equal(row.record.answer, row.sourceAnswer);
}
let industrial = 0, all = 0, references = 0; const assignments = {};
for (const file of await walk('src/content/chapters')) {
  if (!file.endsWith('.md')) continue;
  const chapter = fields(await readFile(file, 'utf8'));
  if (chapter.status !== '완료') continue;
  all++;
  if ((chapter.cert_id ?? 'industrial-safety') !== 'industrial-safety') continue;
  industrial++; references += (chapter.questions ?? []).length;
  for (const id of chapter.questions ?? []) (assignments[id] ??= []).push(file);
}
assert.deepEqual({ industrial, all, references }, review.after);
for (const row of review.chapters) assert.deepEqual(assignments[row.addedQuestion], [row.path]);
for (const n of review.unassigned) assert.equal(assignments[`20190804_${n}`], undefined);
const sf = fields(await readFile(review.chapters[0].path, 'utf8'));
assert.equal(new Set(sf.questions.map(id => id.slice(0, 8))).size, 7);
assert.equal(questions.find(q => q.id === '20190804_103').subject_id, 6, 'cross-subject teaching reuse preserves canonical exam subject');
const pages = [...baseline.pages.map(row => ({ ...row, articleSha256: publication.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })), { path: publication.chapter.articlePath, articleSha256: publication.chapter.articleSha256 }];
const routes = [];
for (const file of await walk('dist')) if (file.endsWith('/index.html') && /<article\b/.test(await readFile(file, 'utf8'))) routes.push(file);
assert.deepEqual(routes.sort(), pages.map(row => row.path).sort());
for (const page of pages) {
  const html = await readFile(page.path, 'utf8'), article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  const row = review.articles.find(row => row.path === page.path);
  assert.equal(hash(article), row?.sha256 ?? page.articleSha256, `${page.path}: exact article scope`);
  if (!row) continue;
  const original = JSON.parse(await readFile(row.originalFile, 'utf8')).article;
  assert.equal(hash(original), page.articleSha256); assert.equal(hash(original), row.originalSha256);
  const chapter = review.chapters.find(c => c.url === row.url);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), chapter.questions);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
}
console.log(`[Current unassigned links] ${industrial} industrial / ${all} all chapters; ${references} primary references; 6 new links; 5 remaining unassigned; 725 source/assets protected; 440 other articles unchanged`);

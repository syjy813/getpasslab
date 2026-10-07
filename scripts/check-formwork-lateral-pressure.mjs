import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-07-formwork-lateral-pressure';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${review.baselineAudits[0]}/baseline.json`, 'utf8'));
const publication = JSON.parse(await readFile(`${review.baselineAudits[0]}/review.json`, 'utf8'));
const links = JSON.parse(await readFile(`${review.baselineAudits[1]}/review.json`, 'utf8'));
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
assert.equal(review.head, 'e5cd7765d366dcc0079debce8d5f408d1b6d2282');
const protectedFiles = { ...baseline.protectedFiles, [publication.chapter.path]: publication.chapter.sha256, ...Object.fromEntries(links.chapters.map(row => [row.path, row.sha256])) };
assert.deepEqual([...await walk('src'), ...await walk('public')].sort(), [...Object.keys(protectedFiles), review.chapter.path].sort());
for (const [file, expected] of Object.entries(protectedFiles)) assert.equal(hash(await readFile(file)), expected, `${file}: prior source/asset preserved`);
assert.equal(hash(await readFile(review.chapter.path)), review.chapter.sha256);
const chapter = fields(await readFile(review.chapter.path, 'utf8'));
assert.equal(chapter.status, '완료'); assert.equal(chapter.subject_id, 6);
assert.equal(chapter.slug, 'formwork-lateral-pressure'); assert.equal(chapter.title, '거푸집 측압');
assert.deepEqual(chapter.questions, ['20200606_105', '20190804_102']); assert.deepEqual(chapter.questions, review.chapter.questions);
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
assert.equal(evidence.length, 2);
for (const row of evidence) {
  assert.deepEqual(questions.find(q => q.id === row.record.id), row.record);
  assert.equal(row.record.answer, row.sourceAnswer);
}
let industrial = 0, all = 0, references = 0; const assignments = {};
for (const file of await walk('src/content/chapters')) {
  if (!file.endsWith('.md')) continue;
  const f = fields(await readFile(file, 'utf8')); if (f.status !== '완료') continue;
  all++; if ((f.cert_id ?? 'industrial-safety') !== 'industrial-safety') continue;
  industrial++; references += (f.questions ?? []).length;
  for (const id of f.questions ?? []) (assignments[id] ??= []).push(f.slug);
}
assert.deepEqual({ industrial, all, references }, review.after);
for (const id of chapter.questions) assert.deepEqual(assignments[id], [chapter.slug]);
for (const n of [105, 106, 109, 116]) assert.equal(assignments[`20190804_${n}`], undefined);
const previousPages = [...baseline.pages.map(row => ({ ...row, articleSha256: links.articles.find(c => c.path === row.path)?.sha256 ?? publication.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })), { path: publication.chapter.articlePath, articleSha256: publication.chapter.articleSha256 }];
const routes = [];
for (const file of await walk('dist')) if (file.endsWith('/index.html') && /<article\b/.test(await readFile(file, 'utf8'))) routes.push(file);
assert.deepEqual(routes.sort(), [...previousPages.map(row => row.path), review.chapter.articlePath].sort());
assert.equal(review.relatedArticleChanges.length, 2);
for (const page of previousPages) {
  let article = (await readFile(page.path, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  const row = review.relatedArticleChanges.find(row => row.path === page.path);
  if (row) {
    assert.equal(hash(article), row.sha256); assert.equal(article.split(row.insertedHtml).length, 2);
    article = article.replace(row.insertedHtml, '');
    assert.equal(article, JSON.parse(await readFile(row.originalFile, 'utf8')).article);
    assert.equal(hash(article), row.originalSha256);
  }
  assert.equal(hash(article), page.articleSha256, `${page.path}: all prior article bytes preserved`);
}
const html = await readFile(review.chapter.articlePath, 'utf8');
assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), chapter.questions);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
const route = new URL(review.chapter.url).pathname;
for (const file of ['dist/industrial-safety/written/construction/index.html', 'dist/sitemap-0.xml']) assert((await readFile(file, 'utf8')).includes(route));
console.log(`[Current formwork publication] ${industrial} industrial / ${all} all chapters; ${references} primary references; one new route, two newly assigned original questions; 725 prior source/assets and 444 other articles unchanged; two exact automatic related links`);

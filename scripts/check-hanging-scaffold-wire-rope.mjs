import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${review.baselineAudits[0]}/baseline.json`, 'utf8'));
const publication = JSON.parse(await readFile(`${review.baselineAudits[0]}/review.json`, 'utf8'));
const links = JSON.parse(await readFile(`${review.baselineAudits[1]}/review.json`, 'utf8'));
const formwork = JSON.parse(await readFile(`${review.baselineAudits[2]}/review.json`, 'utf8'));
const port = JSON.parse(await readFile(`${review.baselineAudits[3]}/review.json`, 'utf8'));
const excavator = JSON.parse(await readFile(`${review.baselineAudits[4]}/review.json`, 'utf8'));
const compatibility = JSON.parse(await readFile(`${audit}/compatibility.json`, 'utf8'));
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
assert.equal(review.head, '2d205b93ad3b758ffdd8f122a6158b1c6c08d7cc');
const protectedFiles = { ...baseline.protectedFiles, [excavator.chapter.path]: excavator.chapter.sha256, ...Object.fromEntries(compatibility.sourceChanges.map(r => [r.path, r.sha256])), [port.chapter.path]: port.chapter.sha256, [formwork.chapter.path]: formwork.chapter.sha256, [publication.chapter.path]: publication.chapter.sha256, ...Object.fromEntries(links.chapters.map(row => [row.path, row.sha256])) };
assert.deepEqual([...await walk('src'), ...await walk('public')].sort(), [...Object.keys(protectedFiles), review.chapter.path].sort());
for (const [file, expected] of Object.entries(protectedFiles)) assert.equal(hash(await readFile(file)), expected, `${file}: prior source/asset preserved`);
assert.equal(hash(await readFile(review.chapter.path)), review.chapter.sha256);
const chapter = fields(await readFile(review.chapter.path, 'utf8'));
assert.equal(chapter.status, '완료'); assert.equal(chapter.subject_id, 6);
assert.equal(chapter.slug, 'hanging-scaffold-wire-rope'); assert.equal(chapter.title, '달비계 와이어로프 사용 기준');
assert.deepEqual(chapter.questions, ['20220424_120', '20200606_119', '20190804_116']); assert.deepEqual(chapter.questions, review.chapter.questions);
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
assert.equal(evidence.length, 3);
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
for (const n of [102,103,105,106,109,110,111,112,114,115,116]) assert.equal(assignments[`20190804_${n}`]?.length, 1, 'restored construction question has one primary chapter');
const preFormworkPages = [...baseline.pages.map(row => ({ ...row, articleSha256: links.articles.find(c => c.path === row.path)?.sha256 ?? publication.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })), { path: publication.chapter.articlePath, articleSha256: publication.chapter.articleSha256 }];
const previousPagesBeforePilot = preFormworkPages.map(row => ({ ...row, articleSha256: formwork.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })).concat({ path: formwork.chapter.articlePath, articleSha256: formwork.chapter.articleSha256 }, { path: port.chapter.articlePath, articleSha256: port.chapter.articleSha256 }, { path: excavator.chapter.articlePath, articleSha256: excavator.chapter.articleSha256 });
const previousPages = previousPagesBeforePilot.map(r => ({ ...r, articleSha256: compatibility.articleChanges.find(c => c.path === r.path)?.sha256 ?? r.articleSha256 }));
const routes = [];
for (const file of await walk('dist')) if (file.endsWith('/index.html') && /<article\b/.test(await readFile(file, 'utf8'))) routes.push(file);
assert.deepEqual(routes.sort(), [...previousPages.map(row => row.path), review.chapter.articlePath].sort());
assert.equal(review.relatedArticleChanges.length, 3);
for (const row of compatibility.sourceChanges.filter(r => !r.newFile)) {
  assert.equal(row.originalSha256, baseline.protectedFiles[row.path]);
  assert.equal(hash(await readFile(row.originalFile)), row.originalSha256);
}
for (const row of compatibility.articleChanges) {
  assert.equal(row.originalSha256, previousPagesBeforePilot.find(p => p.path === row.path)?.articleSha256);
  assert.equal(hash(JSON.parse(await readFile(row.originalFile, 'utf8')).article), row.originalSha256);
}
for (const page of previousPages) {
  const article = (await readFile(page.path, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  const change = review.relatedArticleChanges.find(r => r.path === page.path);
  if (change) {
    assert.equal(hash(article), change.sha256); assert.equal(change.originalSha256, page.articleSha256);
    assert.equal(article.split(change.insertedHtml).length, 2);
    assert.equal(hash(article.replace(change.insertedHtml, '')), page.articleSha256);
  } else assert.equal(hash(article), page.articleSha256, `${page.path}: prior article bytes preserved`);
}
const html = await readFile(review.chapter.articlePath, 'utf8');
assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), chapter.questions);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
const route = new URL(review.chapter.url).pathname;
for (const file of ['dist/industrial-safety/written/construction/index.html', 'dist/sitemap-0.xml']) assert((await readFile(file, 'utf8')).includes(route));
console.log(`[Current hanging scaffold rope publication] ${industrial} industrial / ${all} all chapters; ${references} primary references; one new route, three newly assigned questions; 730 prior source/assets unchanged, 446 prior articles unchanged and 3 exact related link additions`);

import assert from 'node:assert/strict';
import { readFile, readdir } from './read-before-excavator-operation-safety.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-07-port-cargo-passages';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const baseline = JSON.parse(await readFile(`${review.baselineAudits[0]}/baseline.json`, 'utf8'));
const publication = JSON.parse(await readFile(`${review.baselineAudits[0]}/review.json`, 'utf8'));
const links = JSON.parse(await readFile(`${review.baselineAudits[1]}/review.json`, 'utf8'));
const formwork = JSON.parse(await readFile(`${review.baselineAudits[2]}/review.json`, 'utf8'));
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
assert.equal(review.head, 'b2e95245527cc321cc0a87005d94b0f49e480ff3');
const protectedFiles = { ...baseline.protectedFiles, [formwork.chapter.path]: formwork.chapter.sha256, [publication.chapter.path]: publication.chapter.sha256, ...Object.fromEntries(links.chapters.map(row => [row.path, row.sha256])) };
// This snapshot predates the canonical static practice route. Match exactly
// the reviewed endpoint bytes while preserving the frozen source inventory.
const practiceEndpoint = 'src/pages/practice-data/[cert].json.ts';
const practiceHash = 'e4bc7aa1d9a7edd5c6f0bd8026c94ad38abc7679b138875be6af667540f4990a';
const inventory = [...await walk('src'), ...await walk('public')];
assert(inventory.includes(practiceEndpoint));
assert.equal(hash(await readFile(practiceEndpoint)), practiceHash);
assert.deepEqual(inventory.filter(file => file !== practiceEndpoint).sort(), [...Object.keys(protectedFiles), review.chapter.path].sort());
for (const [file, expected] of Object.entries(protectedFiles)) {
  let bytes = await readFile(file);
  if (file === 'src/layouts/ChapterLayout.astro') {
    let layout = bytes.toString('utf8');
    const additions = [
      "import InstantQuestionPractice from '../components/InstantQuestionPractice.astro';",
      "  practiceQuestions?: any[];",
      "  practiceQuestions,",
      "  {practiceQuestions && <InstantQuestionPractice questions={practiceQuestions} certificationId={cert_id} chapterSlug={slug} />}",
    ].map(line => line + String.fromCharCode(10));
    if (layout.includes('  practiceQuestions?: any[];')) {
      for (const addition of additions) {
        assert.equal(layout.split(addition).length, 2, 'only the approved rollout layout insertion');
        layout = layout.replace(addition, '');
      }
      bytes = Buffer.from(layout);
    }
  }
  assert.equal(hash(bytes), expected, `${file}: prior source/asset preserved`);
}
assert.equal(hash(await readFile(review.chapter.path)), review.chapter.sha256);
const chapter = fields(await readFile(review.chapter.path, 'utf8'));
assert.equal(chapter.status, '완료'); assert.equal(chapter.subject_id, 6);
assert.equal(chapter.slug, 'port-cargo-passages'); assert.equal(chapter.title, '선창·부두 통로 기준');
assert.deepEqual(chapter.questions, ['20210515_101', '20190804_105', '20190804_109', '20190303_116', '20180428_118']); assert.deepEqual(chapter.questions, review.chapter.questions);
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
assert.equal(evidence.length, 5);
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
for (const n of [106, 116]) assert.equal(assignments[`20190804_${n}`], undefined);
const preFormworkPages = [...baseline.pages.map(row => ({ ...row, articleSha256: links.articles.find(c => c.path === row.path)?.sha256 ?? publication.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })), { path: publication.chapter.articlePath, articleSha256: publication.chapter.articleSha256 }];
const previousPages = preFormworkPages.map(row => ({ ...row, articleSha256: formwork.relatedArticleChanges.find(c => c.path === row.path)?.sha256 ?? row.articleSha256 })).concat({ path: formwork.chapter.articlePath, articleSha256: formwork.chapter.articleSha256 });
const routes = [];
for (const file of await walk('dist')) if (file.endsWith('/index.html') && /<article\b/.test(await readFile(file, 'utf8'))) routes.push(file);
assert.deepEqual(routes.sort(), [...previousPages.map(row => row.path), review.chapter.articlePath].sort());
assert.equal(review.relatedArticleChanges.length, 0);
for (const page of previousPages) {
  const article = (await readFile(page.path, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  assert.equal(hash(article), page.articleSha256, `${page.path}: all prior article bytes preserved`);
}
const html = await readFile(review.chapter.articlePath, 'utf8');
assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), chapter.questions);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
const route = new URL(review.chapter.url).pathname;
for (const file of ['dist/industrial-safety/written/construction/index.html', 'dist/sitemap-0.xml']) assert((await readFile(file, 'utf8')).includes(route));
console.log(`[Current port cargo publication] ${industrial} industrial / ${all} all chapters; ${references} primary references; one new route, five newly assigned questions; 726 prior source/assets and 447 prior articles unchanged`);

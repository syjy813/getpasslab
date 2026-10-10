import assert from 'node:assert/strict';
import { readdir } from './read-before-formwork-lateral-pressure.mjs';
import { readFile } from './read-before-industrial-unassigned-links.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';

const audit = 'docs/audits/2026-10-07-clam-shell-chapter';
const baseline = JSON.parse(await readFile(`${audit}/baseline.json`, 'utf8'));
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const evidence = JSON.parse(await readFile(`${audit}/question-review.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fields = text => yaml.load(text.match(/^---\n([\s\S]*?)\n---/)[1]);
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    files.push(...(entry.isDirectory() ? await walk(file) : [file]));
  }
  return files;
}
// One immutable, read-only practice-data endpoint was introduced after this
// historical publication. Match its exact reviewed source hash; retain strict
// inventory and hash checks for every source file from this release.
const practiceEndpoint = 'src/pages/practice-data/[cert].json.ts';
const practiceHash = 'e4bc7aa1d9a7edd5c6f0bd8026c94ad38abc7679b138875be6af667540f4990a';
const currentInventory = [...await walk('src'), ...await walk('public')];
assert(currentInventory.includes(practiceEndpoint), 'the approved practice endpoint is present');
assert.equal(hash(await readFile(practiceEndpoint)), practiceHash, 'exact approved practice endpoint source');
assert.deepEqual(currentInventory.filter(file => file !== practiceEndpoint).sort(), Object.keys(baseline.protectedFiles).sort());
for (const [file, expected] of Object.entries(baseline.protectedFiles)) {
  let bytes = await readFile(file);
  // The approved rollout adds only these four layout lines. Undo exactly
  // those additions for this pre-rollout historical publication comparison.
  if (file === 'src/layouts/ChapterLayout.astro') {
    let layout = bytes.toString('utf8');
    const insertions = [
      "import InstantQuestionPractice from '../components/InstantQuestionPractice.astro';",
      "  practiceQuestions?: any[];",
      "  practiceQuestions,",
      "  {practiceQuestions && <InstantQuestionPractice questions={practiceQuestions} certificationId={cert_id} chapterSlug={slug} />}",
    ].map(value => value + String.fromCharCode(10));
    if (layout.includes('  practiceQuestions?: any[];')) {
      for (const part of insertions) {
        assert.equal(layout.split(part).length, 2, 'one approved layout insertion');
        layout = layout.replace(part, '');
      }
      bytes = Buffer.from(layout);
    }
  }
  assert.equal(hash(bytes), file === review.chapter.path ? review.chapter.sha256 : expected, `${file}: exact publication scope`);
}
const original = await readFile(review.chapter.originalFile, 'utf8');
assert.equal(hash(original), review.chapter.originalSha256);
assert.equal(hash(original), baseline.protectedFiles[review.chapter.path]);
const old = fields(original), current = fields(await readFile(review.chapter.path, 'utf8'));
assert.equal(old.status, '미시작'); assert.deepEqual(old.questions, []);
assert.equal(current.status, '완료'); assert.deepEqual(current.questions, ['20190804_120']);
for (const key of Object.keys(old).filter(key => !['questions', 'status'].includes(key))) assert.deepEqual(current[key], old[key], `frozen ${key}`);
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
assert.deepEqual(questions.find(q => q.id === evidence.record.id), evidence.record);
assert.equal(evidence.record.answer, evidence.sourceAnswer);
let industrial = 0, all = 0, references = 0; const assigned = [];
for (const file of await walk('src/content/chapters')) {
  if (!file.endsWith('.md')) continue;
  const chapter = fields(await readFile(file, 'utf8'));
  if (chapter.status !== '완료') continue;
  all++;
  if ((chapter.cert_id ?? 'industrial-safety') !== 'industrial-safety') continue;
  industrial++; references += (chapter.questions ?? []).length;
  if (chapter.questions?.includes(evidence.record.id)) assigned.push(chapter.slug);
}
assert.equal(industrial, baseline.beforePublished + 1);
assert.equal(all, baseline.beforeAllPublished + 1);
assert.equal(references, baseline.beforePrimaryReferences + 1);
assert.deepEqual(assigned, ['clam-shell']);
const routes = [];
for (const file of await walk('dist')) {
  if (file.endsWith('/index.html') && /<article\b/.test(await readFile(file, 'utf8'))) routes.push(file);
}
assert.deepEqual(routes.sort(), [...baseline.pages.map(row => row.path), review.chapter.articlePath].sort());
for (const row of baseline.pages) {
  const html = await readFile(row.path, 'utf8');
  let article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  const change = review.relatedArticleChanges.find(change => change.path === row.path);
  if (change) {
    assert.equal(hash(article), change.sha256);
    assert.equal(article.split(change.insertedHtml).length, 2);
    article = article.replace(change.insertedHtml, '');
    assert.equal(article, JSON.parse(await readFile(change.originalFile, 'utf8')).article);
  }
  assert.equal(hash(article), row.articleSha256, `${row.path}: all prior article bytes preserved`);
}
const html = await readFile(review.chapter.articlePath, 'utf8');
assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), current.questions);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert(html.includes(`href="${review.chapter.url}"`));
const route = new URL(review.chapter.url).pathname;
for (const file of ['dist/industrial-safety/written/construction/index.html', 'dist/sitemap-0.xml']) assert((await readFile(file, 'utf8')).includes(route));
console.log(`[Historical release: Clam shell publication] ${industrial} industrial / ${all} total chapters; ${references} primary references; one newly assigned original question; ${baseline.pages.length} prior articles preserved except ${review.relatedArticleChanges.length} exact related link addition`);

import { readFile } from './read-before-20190804-review.mjs';
import assert from 'node:assert/strict';
import { readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';
import { reviewedChapterHash, restoreDisplayReview } from './reviewed-chapter-hash.mjs';

const audit = 'docs/audits/2026-10-04-industrial-safety-chapter-splits';
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const headingReview = JSON.parse(await readFile('docs/audits/2026-10-04-chapter-section-heading-ui/review.json', 'utf8'));
const ftaReview = JSON.parse(await readFile('docs/audits/2026-10-05-fta-symbols-split/review.json', 'utf8'));
const batchReview = JSON.parse(await readFile('docs/audits/2026-10-05-industrial-remaining-splits/review.json', 'utf8'));
const addedChapters = [...ftaReview.chapters, ...batchReview.chapters].filter(row => row.newFile);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const parse = source => yaml.load(source.match(/^---\n([\s\S]*?)\n---\n/)[1]);
const subjects = { 1: 'safety-management', 2: 'ergonomics', 3: 'mechanical', 4: 'electrical', 5: 'chemical', 6: 'construction' };
const changed = new Map(review.chapters.map(c => [c.path, c]));
assert.equal(changed.size, 35);
assert.equal(review.families.length, 12);
assert.equal(review.chapters.filter(c => c.newFile).length, 18);
assert.equal(review.chapters.filter(c => c.previousStatus === '미시작').length, 4);
assert.equal(review.chapters.filter(c => c.newFile || c.previousStatus === '미시작').length, 22);
assert.deepEqual(review.deduplicated.map(q => q.id), ['20200822_031']);

for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  if (file === 'src/styles/global.css') {
    const css = await restoreDisplayReview(file, await readFile(file, 'utf8'), 'docs/audits/2026-10-05-all-chapter-gray-formulas/review.json');
    assert.equal(headingReview.path, file);
    assert.equal(headingReview.originalSha256, expected, 'heading style: preserve the historical baseline');
    assert.equal(hash(css), headingReview.sha256, 'heading style: exact reviewed CSS');
    assert.equal(css.split(headingReview.insertedCss).length, 2, 'heading style: one scoped insertion');
    assert.equal(hash(css.replace(headingReview.insertedCss, '')), expected, 'heading style: all other CSS unchanged');
    continue;
  }
  const row = changed.get(file);
  if (row) assert.equal(row.originalSha256, expected, `${file}: baseline review hash`);
  const baselineHash = row ? row.sha256 : expected;
  const actualHash = hash(await readFile(file));
  if (actualHash !== baselineHash) assert.equal(actualHash, reviewedChapterHash(file, baselineHash), `${file}: unreviewed baseline change`);
}
async function walk(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...await walk(file));
    else if (file.endsWith('.md')) files.push(file);
  }
  return files;
}
const files = await walk('src/content/chapters');
const beforeFiles = Object.keys(evidence.protectedFiles).filter(f => f.startsWith('src/content/chapters/') && f.endsWith('.md'));
assert.deepEqual(files.sort(), [...beforeFiles, ...review.chapters.filter(c => c.newFile).map(c => c.path), ...addedChapters.map(c => c.path)].sort(), 'only reviewed new chapters may be added');
const chapters = await Promise.all(files.map(async file => ({ ...parse(await readFile(file, 'utf8')), file })));
const published = chapters.filter(c => (c.cert_id ?? 'industrial-safety') === 'industrial-safety' && c.status === '완료');
assert.equal(published.length, 246 + addedChapters.length);
assert.equal(published.flatMap(c => c.questions ?? []).length, 1003 + batchReview.addedPrimaryQuestionIds.length);
const beforeIds = new Set(evidence.beforePublishedChapters.flatMap(c => c.questions));
const afterIds = new Set(published.flatMap(c => c.questions ?? []));
assert.deepEqual([...afterIds].sort(), [...new Set([...beforeIds, ...batchReview.addedPrimaryQuestionIds])].sort(), 'preserve all original primary coverage; add only reviewed unassigned questions');
assert.equal(published.filter(c => c.questions.includes('20200822_031')).length, 1);
assert(published.find(c => c.slug === 'therp-human-error').questions.includes('20200822_031'));
assert.equal(new Set(published.map(c => `${c.subject_id}/${c.slug}`)).size, 246 + addedChapters.length);
const bySlug = new Map(published.map(c => [c.slug, c]));
const canonical = new Map(JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8')).map(q => [q.id, q]));
assert.equal(canonical.size, 1680);
for (const family of review.families) {
  const parent = bySlug.get(family.parent);
  const parentPath = parent.file;
  const before = evidence.originals[parentPath].frontmatter.questions;
  const expected = family.parent === 'system-analysis-techniques' ? [...new Set([...before, ...evidence.originals[bySlug.get('therp-human-error').file].frontmatter.questions])] : before;
  const allocated = [family.parent, ...family.children].flatMap(slug => bySlug.get(slug).questions);
  assert.equal(new Set(allocated).size, allocated.length, `${family.parent}: duplicate family primary assignment`);
  assert.deepEqual(allocated.sort(), [...expected].sort(), `${family.parent}: question coverage`);
  for (const child of family.children) assert(bySlug.get(child).related.includes(family.parent), `${child}: return link`);
}
for (const before of evidence.beforePublishedChapters) {
  await access(`dist/industrial-safety/written/${subjects[before.subject_id]}/${before.slug}/index.html`);
}
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const row of review.chapters) {
  const source = await readFile(row.path, 'utf8');
  const sourceHash = hash(source);
  if (sourceHash !== row.sha256) assert.equal(sourceHash, reviewedChapterHash(row.path, row.sha256), `${row.slug}: exact reviewed copy`);
  const fields = parse(source), original = evidence.originals[row.path]?.frontmatter;
  if (original) {
    for (const key of ['slug', 'subject_id', 'title', 'group', 'order', 'priority']) assert.equal(fields[key], original[key], `${row.slug}: frozen existing ${key}`);
  }
  assert.equal(fields.slug, row.slug);
  assert.equal(fields.subject_id, row.subject_id);
  assert.equal(fields.status, '완료');
  assert.deepEqual(fields.questions, row.questions);
  assert(!fields.supportingQuestions?.length, `${row.slug}: no duplicate support assignments`);
  for (const id of row.questions) {
    assert.equal(canonical.get(id)?.subject_id, row.subject_id);
    assert.equal(canonical.get(id)?.review, '');
  }
  const body = source.split('\n---\n').at(-1);
  assert(!/[\x00-\x09\x0b-\x1f\x7f]|\d{8}_\d{3}|편집 메모|canonical|PDF|JSON|STUB/.test(body), `${row.slug}: editorial/control characters`);
  assert(!/\]\((?:\/|\.\.\/)/.test(body), `${row.slug}: hardcoded body links`);
  const url = `/industrial-safety/written/${subjects[row.subject_id]}/${row.slug}/`;
  const html = await readFile(`dist${url}index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`href="https://getpasslab.co.kr${url}"`));
  assert(!/noindex|http-equiv="refresh"/.test(html));
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), row.questions);
  assert(sitemap.includes(`https://getpasslab.co.kr${url}`));
  const toc = await readFile(`dist/industrial-safety/written/${subjects[row.subject_id]}/index.html`, 'utf8');
  assert(toc.includes(`href="${url}"`));
  const related = html.match(/<ul class="related-list">([\s\S]*?)<\/ul>/)?.[1] ?? '';
  for (const slug of row.related) {
    const target = bySlug.get(slug);
    assert(target, `${row.slug}: unpublished related target ${slug}`);
    assert(related.includes(`/industrial-safety/written/${subjects[target.subject_id]}/${slug}/`), `${row.slug}: related link ${slug} not rendered`);
  }
  const rendered = html.match(/<article\b[\s\S]*?<\/article>/)?.[0] ?? html;
  assert(!/katex-error|class="[^\"]*error/.test(rendered), `${row.slug}: math render error`);
}
console.log(`[Historical release: Chapter splits] 12 families / 35 reviewed routes / 22 newly published chapters; ${published.length} published, ${1003 + batchReview.addedPrimaryQuestionIds.length} primary references; all unique primary coverage preserved`);
console.log(`[Historical release: Chapter splits] ${Object.keys(evidence.protectedFiles).length} baseline files protected; 1680 canonical questions, images and unrelated chapters unchanged`);

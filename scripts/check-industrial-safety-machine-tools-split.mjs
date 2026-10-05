import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { reviewedChapterHash } from './reviewed-chapter-hash.mjs';

const audit = 'docs/audits/2026-10-03-industrial-safety-machine-tools-split';
const evidence = JSON.parse(await readFile(`${audit}/source-verification.json`, 'utf8'));
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const laterSplits = JSON.parse(await readFile('docs/audits/2026-10-04-industrial-safety-chapter-splits/review.json', 'utf8'));
const ftaReview = JSON.parse(await readFile('docs/audits/2026-10-05-fta-symbols-split/review.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const parse = source => yaml.load(source.match(/^---\n([\s\S]*?)\n---\n/)[1], { schema: yaml.FAILSAFE_SCHEMA });
const scope = '/industrial-safety/written/mechanical/';
const questions = JSON.parse(await readFile('src/data/questions/industrial-safety.json', 'utf8'));
const byId = new Map(questions.map(q => [q.id, q]));

// Baseline evidence is independent of the live assignments. Canonical question
// payloads, answers, image registries and all unrelated chapters remain frozen.
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  const actual = hash(await readFile(file));
  if (actual !== expected) assert.equal(actual, reviewedChapterHash(file, expected), `${file}: protected baseline changed without an exact reviewed chapter hash`);
}
assert.equal(questions.length, 1680);
assert.equal(byId.size, 1680);
const assigned = Object.values(evidence.allocations).flat();
assert.equal(assigned.length, 24);
assert.equal(new Set(assigned).size, 24, 'split duplicates a primary question');
assert.deepEqual([...assigned].sort(), [...evidence.parentBeforeQuestions].sort(), 'question lost or added in split');

async function walk(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...await walk(file));
    else if (file.endsWith('.md')) files.push(file);
  }
  return files;
}
const chapters = [];
for (const file of await walk('src/content/chapters')) {
  const fields = parse(await readFile(file, 'utf8'));
  if ((fields.cert_id ?? 'industrial-safety') === 'industrial-safety' && fields.status === '완료') chapters.push({ ...fields, file });
}
assert.equal(laterSplits.families.length, 12);
assert.equal(laterSplits.chapters.filter(c => c.newFile || c.previousStatus === '미시작').length, 22);
assert.deepEqual(laterSplits.deduplicated.map(q => q.id), ['20200822_031']);
assert.equal(chapters.length, evidence.beforeCompleted + 4 + 22 + ftaReview.chapters.filter(row => row.newFile).length, 'unexpected industrial-safety publication count');
assert.equal(chapters.flatMap(c => c.questions ?? []).length, evidence.beforePrimaryReferences - 1, 'only the reviewed duplicate THERP primary reference may be removed');
assert.equal(chapters.filter(c => c.questions?.includes('20200822_031')).length, 1);
assert(chapters.find(c => c.slug === 'therp-human-error')?.questions.includes('20200822_031'));
assert.equal(new Set(chapters.map(c => `${c.subject_id}/${c.slug}`)).size, chapters.length, 'route collision');
const subjects = { 1: 'safety-management', 2: 'ergonomics', 3: 'mechanical', 4: 'electrical', 5: 'chemical', 6: 'construction' };
for (const chapter of chapters) {
  await access(`dist/industrial-safety/written/${subjects[chapter.subject_id]}/${chapter.slug}/index.html`);
}

const toc = await readFile(`dist${scope}index.html`, 'utf8');
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const [slug, ids] of Object.entries(evidence.allocations)) {
  const source = await readFile(`src/content/chapters/mechanical/${slug}.md`, 'utf8');
  const reviewedPath = `src/content/chapters/mechanical/${slug}.md`;
  assert.equal(hash(source), reviewedChapterHash(reviewedPath, review.chapters.find(c => c.path === reviewedPath)?.sha256), `${slug}: unreviewed learning copy`);
  const fields = parse(source);
  assert.deepEqual(fields.questions, ids, `${slug}: wrong primary allocation`);
  assert.equal(fields.subject_id, '3');
  assert.equal(fields.slug, slug);
  assert.equal(fields.status, '완료');
  assert.equal(fields.group, '공작기계');
  assert(!fields.supportingQuestions?.length, `${slug}: duplicated supporting references`);
  if (slug === 'machine-tools-safety') assert.equal(fields.title, '공작기계 안전 (선반·밀링·드릴·플레이너)');
  const body = source.split('\n---\n').at(-1);
  assert(!/\d{8}_\d{3}|편집 메모|canonical|PDF|JSON/.test(body), `${slug}: editorial data in learning copy`);
  assert(!/\]\((?:\/|\.\.\/)/.test(body), `${slug}: hardcoded internal body link`);
  for (const id of ids) {
    assert.equal(byId.get(id)?.subject_id, 3, `${id}: wrong subject`);
    assert.equal(byId.get(id)?.review, '', `${id}: unreviewed canonical question`);
  }
  const url = scope + slug + '/';
  const html = await readFile(`dist${url}index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`href="https://getpasslab.co.kr${url}"`), `${slug}: canonical URL`);
  assert(!/noindex|http-equiv="refresh"/.test(html), `${slug}: not a public chapter`);
  assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), ids, `${slug}: rendered question mismatch`);
  assert(html.includes('data-question-history-mode="deferred"'));
  assert.equal((html.match(/id="deferred-question-dialog"/g) ?? []).length, 1);
  assert(toc.includes(`href="${url}"`), `${slug}: missing TOC entry`);
  assert(sitemap.includes(`https://getpasslab.co.kr${url}`), `${slug}: missing sitemap entry`);
  const related = html.match(/<ul class="related-list">([\s\S]*?)<\/ul>/)?.[1] ?? '';
  for (const target of fields.related) {
    assert(related.includes(`href="${scope}${target}/"`), `${slug}: missing related link ${target}`);
    await access(`dist${scope}${target}/index.html`);
  }
  if (slug !== 'machine-tools-safety') assert(fields.related.includes('machine-tools-safety'), `${slug}: missing return link`);
}
console.log(`[Machine tools split] 5 routes + TOC/sitemap/related links passed; all 24 questions allocated once; ${chapters.length} completed chapters / 1003 primary references after the reviewed splits`);
console.log(`[Machine tools split] ${Object.keys(evidence.protectedFiles).length} protected files unchanged or covered by exact reviewed chapter hashes; 1680 canonical questions and historical image registries/assets unchanged`);

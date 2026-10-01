import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

// Frozen review evidence, not runtime relationships. Run after npm run build.
const evidence = JSON.parse(await readFile('docs/audits/2026-09-30-computer-literacy-001-081/source-verification.json', 'utf8'));
const questions = JSON.parse(await readFile('src/data/questions/computer-literacy.json', 'utf8'));
const byId = new Map(questions.map(q => [q.id, q]));
const hash = value => createHash('sha256').update(value).digest('hex');
assert.equal(byId.size, questions.length, 'duplicate question IDs');
for (const [id, expected] of Object.entries({ ...evidence.existingQuestionHashes, ...evidence.questionHashes })) {
  const q = byId.get(id);
  assert(q, `missing canonical question: ${id}`);
  const payload = Object.fromEntries(Object.keys(q).sort().filter(k => k !== 'review').map(k => [k, q[k]]));
  assert.equal(hash(JSON.stringify(payload)), expected, `${id}: original question changed`);
}
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  assert.equal(hash(await readFile(file)), expected, `${file}: existing chapter changed`);
}
const registry = JSON.parse(await readFile('src/data/question-assets/computer-literacy.json', 'utf8'));
const imageIds = new Set(evidence.images.map(image => image.id));
for (const image of evidence.images) {
  const bytes = await readFile(image.asset_path);
  assert.equal(hash(bytes), image.sha256, `${image.id}: original image changed`);
  assert.equal(bytes.readUInt32BE(16), image.width);
  assert.equal(bytes.readUInt32BE(20), image.height);
  const entry = registry.find(entry => entry.id === image.id);
  assert(entry?.alt.trim(), `${image.id}: missing image registry/alt`);
  assert.equal(entry.asset_path, image.asset_path);
}

const scope = '/computer-literacy/written/computer-basics/';
const subjectHtml = await readFile(`dist${scope}index.html`, 'utf8');
const slugs = new Set();
const primary = new Set();
const cautionIds = new Set(['20160305_012', '20190831_010', '20190831_012', '20150307_019', '20150627_013', '20161022_018']);
let previousPosition = -1;
let supportingCount = 0;
let dialogs = 0;
let newChapters = 0;
let imageOccurrences = 0;
for (const [i, chapter] of evidence.chapters.entries()) {
  assert.equal(chapter.order, i + 1, 'integrated order gap');
  assert(!slugs.has(chapter.slug), `${chapter.id}: slug collision`);
  slugs.add(chapter.slug);
  const markdown = (await readFile(chapter.path, 'utf8')).replace(/\r\n/g, '\n');
  assert.equal(hash(await readFile(chapter.path)), chapter.sha256, `${chapter.id}: reviewed chapter changed`);
  const [, frontmatter, body] = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  // The original four public files retain their existing YAML and identity map.
  if (![38, 39, 40, 43].includes(chapter.order)) {
    const fields = Object.fromEntries(frontmatter.trim().split('\n').map(line => {
      const split = line.indexOf(':');
      return [line.slice(0, split), JSON.parse(line.slice(split + 1))];
    }));
    for (const [key, value] of Object.entries({ chapter_id: chapter.id, title: chapter.title, order: chapter.order, subject_id: chapter.subject_id, group: chapter.group, slug: chapter.slug })) {
      assert.deepEqual(fields[key], value, `${chapter.id}: ${key} mismatch`);
    }
    assert.deepEqual(fields.questions, chapter.primary);
    assert.deepEqual(fields.supportingQuestions.map(ref => ref.id), chapter.support);
    for (const ref of fields.supportingQuestions) {
      assert(ref.note.trim(), `${chapter.id}: supporting scope note missing`);
      if (ref.chapter) await access(`dist${scope}${ref.chapter}/index.html`);
    }
    assert(!/편집 메모|canonical|주 기출 적용 검토|통합 검수|P1-\d|ADD-\d|\d{8}_\d{3}/.test(body.replace(/\]\([^)]*\)/g, ']')), `${chapter.id}: editorial content leaked`);
  }
  if (chapter.status === '신규 파일 반영') newChapters++;
  assert.equal(new Set([...chapter.primary, ...chapter.support]).size, chapter.primary.length + chapter.support.length);
  for (const id of [...chapter.primary, ...chapter.support]) {
    assert.equal(byId.get(id)?.subject_id, chapter.subject_id, `${id}: subject mismatch`);
    assert.equal(byId.get(id)?.review, '', `${id}: review unresolved for rendering`);
  }
  for (const id of chapter.primary) {
    assert(!primary.has(id), `${id}: duplicate primary assignment`);
    primary.add(id);
  }
  const html = await readFile(`dist${scope}${chapter.slug}/index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`https://getpasslab.co.kr${scope}${chapter.slug}/`));
  assert(!/noindex|로컬 미리보기|편집 메모|\/admin\//.test(html));
  const roleIds = role => {
    const section = html.match(new RegExp(`<div[^>]*data-question-role="${role}"[^>]*>([\\s\\S]*?)</div>\\s*</div>`))?.[1] ?? '';
    return [...section.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(match => match[1]);
  };
  assert.deepEqual(roleIds('primary'), chapter.primary, `${chapter.id}: primary rendering`);
  assert.deepEqual(roleIds('supporting'), chapter.support, `${chapter.id}: supporting rendering`);
  const dialogIds = [...html.matchAll(/<dialog[^>]*id="q-(\d{8}_\d{3})"/g)].map(match => match[1]);
  assert.deepEqual(dialogIds.sort(), [...chapter.primary, ...chapter.support].sort(), `${chapter.id}: dialogs`);
  for (const id of dialogIds) {
    const dialog = html.match(new RegExp(`<dialog[^>]*id="q-${id}"[^>]*>([\\s\\S]*?)</dialog>`))[1];
    const options = [...dialog.matchAll(/<li\b([^>]*)>/g)];
    assert.equal(options.length, 4, `${id}: four choices`);
    assert.equal(options.findIndex(option => option[1].includes('is-answer')) + 1, byId.get(id).answer, `${id}: answer`);
    assert.equal(/class="q-image"/.test(dialog), imageIds.has(id), `${id}: image`);
    assert.equal(/data-question-caution\b[^>]*hidden/.test(dialog), cautionIds.has(id), `${id}: caution`);
    assert.equal(dialog.includes('(수록 답안)'), cautionIds.has(id), `${id}: recorded answer label`);
  }
  for (const [, source] of html.matchAll(/<img\b[^>]*src="(\/[^"?#]+)"/g)) await access(path.join('dist', source));
  if (!chapter.primary.length && !chapter.support.length) assert(html.includes('기출 미배정'), `${chapter.id}: no invented questions`);
  const position = subjectHtml.indexOf(`href="${scope}${chapter.slug}/"`);
  assert(position > previousPosition, `${chapter.id}: subject order`);
  previousPosition = position;
  dialogs += dialogIds.length;
  supportingCount += chapter.support.length;
  imageOccurrences += (html.match(/class="q-image"/g) ?? []).length;
}
assert.equal(slugs.size, 81);
assert.equal(newChapters, 50);
assert.equal(evidence.newQuestionIds.length, 70);
console.log(`[001–081] ${slugs.size} chapters (50 new, 31 preserved); ${primary.size} primary + ${supportingCount} supporting links; ${dialogs} rendered dialogs/answers; ${imageIds.size} original images / ${imageOccurrences} occurrences passed`);
console.log('[001–081] Canonical hashes, all prior chapter files, URLs, IDs, sequence, scoped support links, 6 caution questions, and editorial separation passed');

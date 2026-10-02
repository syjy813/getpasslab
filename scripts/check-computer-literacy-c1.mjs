import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

// Frozen review evidence from the unchanged local canonical data and integrated outline.
// Runtime relationships remain solely in chapter frontmatter.
const evidence = JSON.parse(await readFile('docs/audits/2026-09-25-c1/source-verification.json', 'utf8'));
const questions = JSON.parse(await readFile('src/data/questions/computer-literacy.json', 'utf8'));
const byId = new Map(questions.map(question => [question.id, question]));
assert.equal(byId.size, questions.length, 'duplicate canonical question IDs');
const hash = value => createHash('sha256').update(value).digest('hex');
for (const [id, expected] of Object.entries(evidence.questionHashes)) {
  const question = byId.get(id);
  assert(question, `missing question: ${id}`);
  const payload = Object.fromEntries(Object.keys(question).sort().filter(key => key !== 'review').map(key => [key, question[key]]));
  assert.equal(hash(JSON.stringify(payload)), expected, `${id}: canonical text/choices/answer/metadata changed`);
  assert.equal(question.review, '', `${id}: not reviewed for local rendering`);
}
for (const image of evidence.images) {
  const bytes = await readFile(image.path);
  assert.equal(hash(bytes), image.sha256, `${image.id}: original image changed`);
  assert.equal(bytes.readUInt32BE(16), image.width);
  assert.equal(bytes.readUInt32BE(20), image.height);
}

const slugs = new Set();
const primary = new Set();
// Independently reviewed exceptions: guidance must follow both assignment roles.
const cautionIds = new Set(['20160305_012', '20190831_010', '20190831_012', '20150307_019']);
const cautionNotes = new Map();
let cautionOccurrences = 0;
let supportingCount = 0;
let dialogs = 0;
let imageOccurrences = 0;
const scope = '/computer-literacy/written/computer-basics/';
const imageIds = new Set(evidence.images.map(image => image.id));
const subjectHtml = await readFile(`dist${scope}index.html`, 'utf8');
let previousPosition = -1;
for (const chapter of evidence.chapters) {
  const markdown = (await readFile(chapter.path, 'utf8')).replace(/\r\n/g, '\n');
  const [, frontmatter, body] = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fields = Object.fromEntries(frontmatter.trim().split('\n').map(line => {
    const split = line.indexOf(':');
    return [line.slice(0, split), JSON.parse(line.slice(split + 1))];
  }));
  for (const [key, value] of Object.entries({ chapter_id: chapter.id, title: chapter.title, order: chapter.order, subject_id: chapter.subject_id, group: chapter.group, slug: chapter.slug })) {
    assert.deepEqual(fields[key], value, `${chapter.id}: ${key} changed`);
  }
  assert.equal(path.basename(chapter.path), `${chapter.slug}.md`);
  assert(!slugs.has(fields.slug), `${chapter.id}: slug collision`);
  slugs.add(fields.slug);
  assert.deepEqual(fields.questions, chapter.primary, `${chapter.id}: primary assignments changed`);
  assert.deepEqual(fields.supportingQuestions.map(ref => ref.id), chapter.support, `${chapter.id}: supporting assignments changed`);
  assert.equal(new Set([...chapter.primary, ...chapter.support]).size, chapter.primary.length + chapter.support.length, 'duplicate question on chapter');
  for (const id of chapter.primary) {
    assert(!primary.has(id), `primary question assigned twice: ${id}`);
    primary.add(id);
  }
  const prose = body.replace(/\]\([^)]*\)/g, ']');
  assert(!/편집 메모|canonical|주 기출 적용 검토|통합 검수|P1-\d|ADD-\d|\d{8}_\d{3}/.test(prose), `${chapter.id}: editorial content leaked`);
  assert(!/[^\d]\.(?:\s*$)|(?:합니다|습니다|한다|된다|이다)\s*$/m.test(body), `${chapter.id}: prose tone`);
  const html = await readFile(`dist${scope}${chapter.slug}/index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`https://getpasslab.co.kr${scope}${chapter.slug}/`));
  assert(!/noindex|로컬 미리보기|편집 메모|\/admin\//.test(html));
  const roleIds = role => {
    const section = html.match(new RegExp(`<div[^>]*data-question-role="${role}"[^>]*>([\\s\\S]*?)</div>\\s*</div>`))?.[1] ?? '';
    return [...section.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(match => match[1]);
  };
  assert.deepEqual(roleIds('primary'), chapter.primary, `${chapter.id}: missing primary buttons`);
  assert.deepEqual(roleIds('supporting'), chapter.support, `${chapter.id}: missing support buttons`);
  const dialogIds = [...html.matchAll(/<dialog[^>]*id="q-(\d{8}_\d{3})"/g)].map(match => match[1]);
  assert.deepEqual(dialogIds.sort(), [...chapter.primary, ...chapter.support].sort(), `${chapter.id}: dialogs`);
  for (const id of dialogIds) {
    const dialog = html.match(new RegExp(`<dialog[^>]*id="q-${id}"[^>]*>([\\s\\S]*?)</dialog>`))[1];
    const options = [...dialog.matchAll(/<li\b([^>]*)>/g)];
    assert.equal(options.length, 4, `${id}: four choices`);
    assert.equal(options.findIndex(option => option[1].includes('is-answer')) + 1, byId.get(id).answer, `${id}: rendered answer`);
    assert.equal(/class="q-image"/.test(dialog), imageIds.has(id), `${id}: image rendering`);
    const caution = dialog.match(/<div\b[^>]*data-question-caution\b[^>]*hidden[^>]*>([\s\S]*?)<\/div>/);
    assert.equal(Boolean(caution), cautionIds.has(id), `${id}: caution scope or initial visibility`);
    assert.equal(dialog.includes('(수록 답안)'), cautionIds.has(id), `${id}: recorded answer label`);
    if (caution) {
      assert(dialog.includes(`q-caution-${id}`), `${id}: accessible caution target`);
      assert(dialog.includes('수록 답안 확인'), `${id}: answer action label`);
      if (cautionNotes.has(id)) assert.equal(caution[1], cautionNotes.get(id), `${id}: primary/support guidance differs`);
      cautionNotes.set(id, caution[1]);
      cautionOccurrences++;
    }
  }
  for (const reference of fields.supportingQuestions) {
    assert(reference.note.trim(), 'support scope note missing');
    if (reference.chapter) await access(`dist${scope}${reference.chapter}/index.html`);
  }
  for (const [, source] of html.matchAll(/<img\b[^>]*src="(\/[^"?#]+)"/g)) {
    await access(path.join('dist', source));
  }
  if (chapter.id === 'ADD-17') {
    assert(html.includes('이 챕터에 직접 연결된 기출은 없음'));
    assert(!html.includes('수록 기출 0문항'));
  }
  const position = subjectHtml.indexOf(`href="${scope}${chapter.slug}/"`);
  assert(position > previousPosition, `${chapter.id}: integrated learning order`);
  previousPosition = position;
  dialogs += dialogIds.length;
  supportingCount += chapter.support.length;
  imageOccurrences += (html.match(/class="q-image"/g) ?? []).length;
}
assert.equal(slugs.size, 27);
assert.equal(primary.size, 63);
assert.equal(supportingCount, 41);
assert.equal(dialogs, 104);
assert.equal(imageOccurrences, 8);
assert.equal(cautionNotes.size, 4);
assert.equal(cautionOccurrences, 6);
console.log('[C1] 27 chapters; canonical hashes for 70 questions; 63 primary + 41 supporting assignments; 104 rendered dialogs/answers; 2 original images; order, links, and editorial separation passed');
console.log('[C1] 4 caution questions across 6 primary/support dialogs; recorded answers distinguished; guidance initially hidden and consistent');

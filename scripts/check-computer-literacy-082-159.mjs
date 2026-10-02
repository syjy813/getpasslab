import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

// Frozen source-review evidence; live assignments exist only in frontmatter.
const evidence = JSON.parse(await readFile('docs/audits/2026-10-02-computer-literacy-082-159/source-verification.json', 'utf8'));
const questions = JSON.parse(await readFile('src/data/questions/computer-literacy.json', 'utf8'));
const byId = new Map(questions.map(q => [q.id, q]));
const hash = value => createHash('sha256').update(value).digest('hex');
assert.equal(byId.size, questions.length, 'duplicate question IDs');
for (const [id, expected] of Object.entries({ ...evidence.existingQuestionHashes, ...evidence.questionHashes })) {
  const q = byId.get(id);
  assert(q, `missing canonical question ${id}`);
  const payload = Object.fromEntries(Object.keys(q).sort().filter(k => k !== 'review').map(k => [k, q[k]]));
  assert.equal(hash(JSON.stringify(payload)), expected, `${id}: canonical payload changed`);
}
for (const [file, expected] of Object.entries(evidence.protectedFiles)) {
  assert.equal(hash(await readFile(file)), expected, `${file}: Production source changed`);
}
assert.equal(questions.length, Object.keys(evidence.existingQuestionHashes).length + evidence.newQuestionIds.length);
assert.equal(evidence.newQuestionIds.length, 134);
const registry = JSON.parse(await readFile('src/data/question-assets/computer-literacy.json', 'utf8'));
assert.equal(new Set(registry.map(i => i.id)).size, registry.length, 'duplicate image registry IDs');
for (const entry of evidence.existingAssetRegistry) assert.deepEqual(registry.find(i => i.id === entry.id), entry);
for (const image of evidence.images) {
  const bytes = await readFile(image.asset_path);
  assert.equal(hash(bytes), image.sha256, `${image.id}: original image changed`);
  assert.equal(bytes.readUInt32BE(16), image.width);
  assert.equal(bytes.readUInt32BE(20), image.height);
  const entry = registry.find(i => i.id === image.id);
  for (const key of ['asset_path', 'width', 'height', 'alt']) assert.equal(entry?.[key], image[key]);
}

const root = 'src/content/chapters/computer-literacy/written';
const chapters = [];
for (const subject of ['computer-basics', 'spreadsheets']) {
  for (const file of await readdir(`${root}/${subject}`)) {
    if (!file.endsWith('.md')) continue;
    const markdown = await readFile(`${root}/${subject}/${file}`, 'utf8');
    const fields = Object.fromEntries([...markdown.split('\n---\n')[0].matchAll(/^(chapter_id|title|slug|order|subject_id|questions): (.+)$/gm)].map(m => [m[1], JSON.parse(m[2])]));
    chapters.push({ ...fields, subject, file });
  }
}
assert.equal(chapters.length, 163, 'unexpected chapter/stub');
assert.equal(new Set(chapters.map(c => `${c.subject}/${c.slug}`)).size, chapters.length, 'slug collision');
assert.equal(new Set(chapters.filter(c => c.chapter_id).map(c => c.chapter_id)).size, chapters.filter(c => c.chapter_id).length, 'chapter ID collision');
const primary = chapters.flatMap(c => c.questions);
assert.equal(new Set(primary).size, primary.length, 'duplicate primary assignment');
const imageIds = new Set(evidence.images.map(i => i.id));
const cautions = new Set(['20150307_019', '20150307_005', '20151017_006', '20151017_035']);
let dialogs = 0;
let support = 0;
let images = 0;
assert.equal(evidence.chapters.length, 78);
for (const [index, chapter] of evidence.chapters.entries()) {
  assert.equal(chapter.order, index + 82);
  const markdown = await readFile(chapter.path, 'utf8');
  assert.equal(hash(markdown), chapter.sha256, `${chapter.id}: unreviewed chapter change`);
  const [, fm, body] = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fields = Object.fromEntries(fm.trim().split('\n').map(line => {
    const split = line.indexOf(':');
    return [line.slice(0, split), JSON.parse(line.slice(split + 1))];
  }));
  for (const [key, value] of Object.entries({chapter_id: chapter.id, title: chapter.title, slug: chapter.slug, subject_id: chapter.subject_id, group: chapter.group, order: chapter.order, status: '완료'})) assert.deepEqual(fields[key], value);
  assert.deepEqual(fields.questions, chapter.primary);
  assert.deepEqual(fields.supportingQuestions.map(i => i.id), chapter.support);
  assert(fields.summary.length < 70 && fields.summary.length > 10, `${chapter.id}: summary readability`);
  assert(!/편집 메모|canonical|주 기출 적용 검토|통합 검수|P[12]-\d|ADD-\d|\d{8}_\d{3}|BLOCKED|직접 확인 완료/.test(body), `${chapter.id}: editorial content leaked`);
  assert(!/(?:합니다|습니다|한다|된다|이다)[.!]?\s*$/m.test(body), `${chapter.id}: prose tone`);
  assert.equal(new Set([...chapter.primary, ...chapter.support]).size, chapter.primary.length + chapter.support.length);
  const scope = `/computer-literacy/written/${chapter.subject_id === 1 ? 'computer-basics' : 'spreadsheets'}/`;
  const html = await readFile(`dist${scope}${chapter.slug}/index.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes(`https://getpasslab.co.kr${scope}${chapter.slug}/`));
  assert(!/noindex|로컬 미리보기|편집 메모|\/admin\//.test(html));
  const roleIds = role => [...(html.match(new RegExp(`<div[^>]*data-question-role="${role}"[^>]*>([\\s\\S]*?)</div>\\s*</div>`))?.[1] ?? '').matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]);
  assert.deepEqual(roleIds('primary'), chapter.primary);
  assert.deepEqual(roleIds('supporting'), chapter.support);
  for (const ref of fields.supportingQuestions) {
    assert(ref.note.trim());
    if (ref.chapter) {
      const target = chapters.find(c => c.slug === ref.chapter);
      assert(target?.questions.includes(ref.id), `${chapter.id}: wrong support owner`);
      await access(`dist/computer-literacy/written/${target.subject}/${target.slug}/index.html`);
    }
  }
  for (const id of [...chapter.primary, ...chapter.support]) {
    const q = byId.get(id);
    assert.equal(q?.subject_id, chapter.subject_id, `${id}: wrong subject`);
    assert.equal(q?.review, '', `${id}: review incomplete`);
    const dialog = html.match(new RegExp(`<dialog[^>]*id="q-${id}"[^>]*>([\\s\\S]*?)</dialog>`))?.[1];
    assert(dialog, `${chapter.id}: missing dialog ${id}`);
    const options = [...dialog.matchAll(/<li\b([^>]*)>/g)];
    assert.equal(options.length, 4);
    assert.equal(options.findIndex(o => o[1].includes('is-answer')) + 1, q.answer);
    assert.equal(/class="q-image"/.test(dialog), imageIds.has(id), `${id}: missing/wrong original image`);
    assert.equal(/data-question-caution\b[^>]*hidden/.test(dialog), cautions.has(id));
    assert.equal(dialog.includes('(수록 답안)'), cautions.has(id));
    dialogs++;
  }
  if (!chapter.primary.length) {
    assert.equal(chapter.support.length, 0);
    assert(html.includes(chapter.subject_id === 1 ? '이 챕터에 직접 연결된 기출은 없음' : '기출 미배정 · 기초 개념 학습'), `${chapter.id}: missing unassigned question notice`);
    assert(!/출제 경향|수록 기출 \d+문항/.test(html));
  }
  for (const [, source] of html.matchAll(/<img\b[^>]*src="(\/[^"?#]+)"/g)) await access(path.join('dist', source));
  const subjectHtml = await readFile(`dist${scope}index.html`, 'utf8');
  assert(subjectHtml.includes(`href="${scope}${chapter.slug}/"`), `${chapter.id}: missing TOC link`);
  const ordered = chapters.filter(c => c.subject_id === chapter.subject_id).sort((a,b) => a.order - b.order);
  const at = ordered.findIndex(c => c.slug === chapter.slug);
  if (at > 0) assert(html.includes(`class="chapter-mobile-link previous" href="${scope}${ordered[at - 1].slug}/"`));
  if (at < ordered.length - 1) assert(html.includes(`class="chapter-mobile-link next" href="${scope}${ordered[at + 1].slug}/"`));
  else assert(html.includes('class="chapter-mobile-link next is-disabled" aria-disabled="true"'));
  support += chapter.support.length;
  images += (html.match(/class="q-image"/g) ?? []).length;
}
assert.deepEqual(evidence.blocked, { order:160, id:'P2-02a', status:'BLOCKED', reasons:['20200704_024 실행 재현 대기','20190302_034 원본 이미지 검수 필요'] });
assert(!chapters.some(c => c.chapter_id === 'P2-02a' || c.order === 160));
for (const id of ['20190302_027','20190302_034','20200704_024']) assert(!evidence.newQuestionIds.includes(id), `blocked question imported ${id}`);
const before = JSON.parse(await readFile('docs/audits/2026-09-30-computer-literacy-001-081/source-verification.json','utf8')).chapters.at(-1);
const boundary = await readFile(`dist/computer-literacy/written/computer-basics/${before.slug}/index.html`, 'utf8');
assert(boundary.includes(`class="chapter-mobile-link next" href="/computer-literacy/written/computer-basics/${evidence.chapters[0].slug}/"`), '81 → 82 boundary');
console.log(`[082–159] 78 chapters; 149 primary + ${support} supporting links; ${dialogs} dialogs; 7 original images / ${images} occurrences passed`);
console.log('[082–159] 134 canonical additions; all prior chapter/image/payload hashes preserved; IDs, subjects, slugs, support owners, TOC, 81→82, final 159 and BLOCKED 160 passed');

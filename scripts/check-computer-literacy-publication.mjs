import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const scope = '/computer-literacy/written';
const expected = {
  'computer-basics/windows-apps-files-windows': [],
  'computer-basics/window-states': [],
  'computer-basics/taskbar-settings': ['20160305_016', '20170902_017', '20180901_007'],
  'computer-basics/windows-shortcuts': ['20150627_015', '20180303_019', '20190302_019', '20200704_006'],
  'spreadsheets/operator-precedence': [],
  'spreadsheets/function-arguments-nesting': ['20151017_031'],
  'spreadsheets/named-range-calculations': ['20150307_037'],
  'spreadsheets/goal-seek': ['20161022_037', '20170902_021', '20180303_023', '20180901_040', '20200704_023'],
};
const supporting = {
  'computer-basics/windows-apps-files-windows': '20200704_006',
  'computer-basics/window-states': '20180303_019',
  'spreadsheets/operator-precedence': '20150307_037',
};
let questionCount = 0;
let supportingCount = 0;
let imageCount = 0;
for (const [chapter, ids] of Object.entries(expected)) {
  const url = `${scope}/${chapter}/`;
  const html = await readFile(path.join(root, url, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${chapter}: h1`);
  assert(html.includes(`https://getpasslab.co.kr${url}`), `${chapter}: canonical`);
  assert(!/noindex|로컬 미리보기|편집 메모|편집 이력|\/admin\//.test(html), `${chapter}: private content`);
  assert(!html.includes('일부 챕터 공개 · 현재 8개 챕터 제공'), `${chapter}: repeated release notice`);
  assert(!/class="[^"]*\b(?:top-)?frequent\b/.test(html), `${chapter}: partial-sample frequency badge`);
  const renderedIds = [...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]);
  const supportId = supporting[chapter];
  assert.deepEqual(renderedIds.sort(), [...ids, ...(supportId ? [supportId] : [])].sort(), `${chapter}: linked questions`);
  if (supportId) {
    supportingCount++;
    assert(html.includes('기초 개념을 적용할 기출'));
    assert(html.includes('함께 볼 설명:'));
    assert(html.includes('data-question-role="supporting"'));
    assert(!html.includes('수록 기출 1문항'));
    assert(!html.includes('기출 미배정'));
    assert(html.includes(`id="q-${supportId}"`));
  }
  for (const id of ids) assert(html.includes(`id="q-${id}"`), `${chapter}: missing dialog ${id}`);
  questionCount += ids.length;
  for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src?.startsWith('/')) continue;
    await access(path.join(root, src));
    if (/q-image/.test(tag)) imageCount += 1;
  }
}
assert.equal(questionCount, 14);
assert.equal(imageCount, 8);
assert.equal(supportingCount, 3);
const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
assert(homepage.includes(`${scope}/`));
for (const subject of ['computer-basics', 'spreadsheets']) {
  const files = await readdir(path.join(root, scope, subject));
  assert.equal(files.filter(f => f !== 'index.html').length, 4, `${subject}: only four released chapters`);
}
for (const name of ['goal-seek-sheet', 'goal-seek-settings', 'named-range-products', 'named-range-index']) {
  await access(path.join(root, `images/computer-literacy/${name}.svg`));
}
console.log('[Computer literacy] 8 chapters, 14 primary questions, 3 supporting links, 8 rendered question images, 4 learning SVGs, public links and release scope passed');

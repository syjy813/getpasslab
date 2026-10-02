// Mechanical spelling cleanup only; titles, IDs and question assignments stay unchanged.
import { readFile, writeFile, readdir } from 'node:fs/promises';
const root = 'src/content/chapters/computer-literacy/written/computer-basics/';
for (const file of await readdir(root)) {
  const original = await readFile(root + file, 'utf8');
  const split = original.indexOf('\n---\n', 4) + 5;
  const normalize = text => text
    .replace(/바탕화면/g, '바탕 화면')
    .replace(/바로가기/g, '바로 가기')
    .replace(/일정시간/g, '일정 시간')
    .replace(/우선 순위/g, '우선순위');
  // The summary and support notes are displayed prose, not stable identifiers.
  const frontmatter = original.slice(0, split).split('\n').map(line =>
    /^(summary:|supportingQuestions:|\s+note:)/.test(line) ? normalize(line) : line
  ).join('\n');
  const updated = frontmatter + normalize(original.slice(split)).replace(/\n{4,}/g, '\n\n\n');
  if (updated !== original) await writeFile(root + file, updated);
}

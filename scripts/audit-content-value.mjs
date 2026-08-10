import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('../', import.meta.url));
const CHAPTER_DIR = path.join(ROOT_DIR, 'src', 'content', 'chapters');
const AUDIT_DIR = path.join(ROOT_DIR, 'docs', 'audits');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
  }

  return files;
}

function unquote(value = '') {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) return trimmed.slice(1, -1);
  return trimmed;
}

function scalar(frontmatter, key, fallback = '') {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'));
  return match ? unquote(match[1]) : fallback;
}

function questionIds(frontmatter) {
  const match = frontmatter.match(/^questions:\s*\[([\s\S]*?)\]\s*$/m);
  if (!match || !match[1].trim()) return [];
  return match[1]
    .split(',')
    .map(value => unquote(value))
    .filter(Boolean);
}

function bodyCharacterCount(body) {
  const readableBody = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[^\n]*\n?/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-+*]|\d+[.)])\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_`~|]/g, '')
    .replace(/\$|\\\[|\\\]|\\\(|\\\)/g, ' ');

  return readableBody.replace(/\s/g, '').length;
}

function hasMarkdownTable(body) {
  const lines = body.split(/\r?\n/);
  return lines.some((line, index) => {
    const separator = lines[index + 1] ?? '';
    return line.includes('|')
      && /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(separator);
  });
}

function hasMath(body) {
  return /\$\$[\s\S]*?\$\$|(^|[^\\])\$[^$\n]+\$|\\\[[\s\S]*?\\\]|\\\([^\n]*?\\\)/m.test(body);
}

function auditDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function csvValue(value) {
  const stringValue = String(value ?? '');
  return /[",\r\n]/.test(stringValue)
    ? `"${stringValue.replaceAll('"', '""')}"`
    : stringValue;
}

function markdownValue(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

const chapterFiles = (await walk(CHAPTER_DIR)).sort();
const completedChapters = [];

for (const file of chapterFiles) {
  const source = await readFile(file, 'utf8');
  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatterMatch) {
    throw new Error(`Frontmatter not found: ${path.relative(ROOT_DIR, file)}`);
  }

  const frontmatter = frontmatterMatch[1];
  if (scalar(frontmatter, 'status', '미시작') !== '완료') continue;

  const body = source.slice(frontmatterMatch[0].length);
  const characters = bodyCharacterCount(body);
  const h2Count = (body.match(/^##(?!#)\s+.+$/gm) ?? []).length;
  const h3Count = (body.match(/^###(?!#)\s+.+$/gm) ?? []).length;
  const relations = questionIds(frontmatter);
  const density = relations.length > 0
    ? Number((characters / relations.length).toFixed(1))
    : null;
  const reasons = [];

  if (relations.length >= 8 && characters < 800) {
    reasons.push('기출 관계가 8개 이상인데 본문이 800자 미만');
  }
  if (h2Count < 2 && h3Count === 0) {
    reasons.push('H2가 2개 미만이고 H3가 없어 실질적인 학습 섹션이 적음');
  }
  if (characters < 450) {
    reasons.push('완료 챕터의 자체 본문이 450자 미만');
  }

  completedChapters.push({
    priority: reasons.some(reason => reason.startsWith('기출 관계')) || characters < 300
      ? '우선'
      : '검토',
    cert_id: scalar(frontmatter, 'cert_id', 'industrial-safety'),
    subject_id: Number(scalar(frontmatter, 'subject_id')),
    slug: scalar(frontmatter, 'slug'),
    title: scalar(frontmatter, 'title'),
    body_characters: characters,
    h2_count: h2Count,
    h3_count: h3Count,
    has_table: hasMarkdownTable(body),
    has_math: hasMath(body),
    question_relation_count: relations.length,
    body_characters_per_question: density,
    audit_reason: reasons.join('; '),
  });
}

const candidates = completedChapters
  .filter(chapter => chapter.audit_reason)
  .sort((a, b) =>
    (a.priority === '우선' ? 0 : 1) - (b.priority === '우선' ? 0 : 1)
    || a.body_characters - b.body_characters
    || b.question_relation_count - a.question_relation_count
    || a.slug.localeCompare(b.slug)
  );
const date = auditDate();
const csvPath = path.join(AUDIT_DIR, `${date}-content-value-audit.csv`);
const markdownPath = path.join(AUDIT_DIR, `${date}-content-value-audit.md`);
const csvColumns = [
  'priority',
  'cert_id',
  'subject_id',
  'slug',
  'title',
  'body_characters',
  'h2_count',
  'h3_count',
  'has_table',
  'has_math',
  'question_relation_count',
  'body_characters_per_question',
  'audit_reason',
];
const csv = [
  csvColumns.join(','),
  ...candidates.map(chapter =>
    csvColumns.map(column => csvValue(chapter[column])).join(','),
  ),
].join('\n');
const priorityCount = candidates.filter(chapter => chapter.priority === '우선').length;
const candidateRows = candidates.length > 0
  ? candidates.map(chapter =>
      `| ${markdownValue(chapter.priority)} | ${markdownValue(chapter.cert_id)} | ${chapter.subject_id} | ${markdownValue(chapter.slug)} | ${markdownValue(chapter.title)} | ${chapter.body_characters} | ${chapter.h2_count}/${chapter.h3_count} | ${chapter.has_table ? '있음' : '없음'} | ${chapter.has_math ? '있음' : '없음'} | ${chapter.question_relation_count} | ${chapter.body_characters_per_question ?? '해당 없음'} | ${markdownValue(chapter.audit_reason)} |`,
    ).join('\n')
  : '| - | - | - | - | 후보 없음 | - | - | - | - | - | - | - |';
const markdown = `# ${date} 콘텐츠 가치 내부 감사

이 감사는 완료 챕터 중 자체 학습 콘텐츠가 얇을 가능성이 있는 후보를 찾기 위한 **내부 품질 휴리스틱**이다. Google 또는 AdSense가 아래 글자 수·섹션 수·밀도 기준을 요구한다는 의미가 아니며, 심사 통과를 보장하는 기준도 아니다.

## 결과 요약

- 검사한 완료 챕터: ${completedChapters.length}개
- 얇은 콘텐츠 후보: ${candidates.length}개
- 우선 검토 후보: ${priorityCount}개
- 자동 수정한 챕터: 0개

## 측정·선별 방법

- 본문 문자 수는 frontmatter를 제외한 Markdown에서 링크 주소와 Markdown·HTML 표식, 공백을 제거한 뒤 계산했다.
- 기출 대비 본문 밀도는 연결 기출 1문항당 본문 문자 수다. 기출 관계가 없으면 해당 없음으로 표시한다.
- 다음 중 하나 이상이면 후보로 표시한다: 기출 관계 8개 이상이면서 본문 800자 미만, H2 2개 미만이면서 H3 없음, 완료 본문 450자 미만.
- 수치 기준은 후속 육안 검토 범위를 좁히기 위한 내부 기준이며, 후보라고 해서 곧바로 공개 중단 또는 자동 보강하지 않는다.

## 후보 목록

| 우선순위 | cert_id | subject_id | slug | title | 본문 문자 | H2/H3 | 표 | 수식 | 질문 관계 | 문항당 문자 | 감사 사유 |
|---|---|---:|---|---|---:|---:|---|---|---:|---:|---|
${candidateRows}
`;

await mkdir(AUDIT_DIR, { recursive: true });
await writeFile(csvPath, `\uFEFF${csv}\n`, 'utf8');
await writeFile(markdownPath, markdown, 'utf8');

console.log(`[Content value audit] 완료 챕터 ${completedChapters.length}개 검사`);
console.log(`[Content value audit] 후보 ${candidates.length}개 (우선 ${priorityCount}개)`);
console.log(`[Content value audit] CSV ${path.relative(ROOT_DIR, csvPath).replaceAll(path.sep, '/')}`);
console.log(`[Content value audit] Markdown ${path.relative(ROOT_DIR, markdownPath).replaceAll(path.sep, '/')}`);

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const chapterRoot = path.resolve('src/content/chapters');
const auditRoot = path.resolve('docs/audits');
const auditDate = '2026-08-13';
const industrialSubjectSlugs = {
  1: 'safety-management',
  2: 'ergonomics',
  3: 'mechanical',
  4: 'electrical',
  5: 'chemical',
  6: 'construction',
};

async function listFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath, extension));
    else if (entry.isFile() && entry.name.endsWith(extension)) files.push(fullPath);
  }
  return files;
}

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'm'));
  return match?.[1]?.replace(/^['"]|['"]$/g, '') ?? '';
}

function arrayField(frontmatter, name) {
  const raw = field(frontmatter, name);
  if (!raw.startsWith('[') || !raw.endsWith(']')) return [];
  return raw.slice(1, -1).split(',').map((value) => value.trim()).filter(Boolean);
}

function normalize(value) {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_~$\\{}[\]()<>]/g, ' ')
    .replace(/[^0-9A-Za-z가-힣℃%]+/g, '')
    .toLowerCase();
}

const stopwords = new Set([
  '것', '경우', '대한', '위한', '있는', '없는', '한다', '된다', '이다', '아닌', '옳은',
  '가장', '다음', '설명', '항목', '기준', '방법', '조치', '종류', '내용', '해당',
]);

function tokens(value) {
  return [...new Set(String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_~$\\{}[\]()<>]/g, ' ')
    .match(/[A-Za-z](?:[＜<][A-Za-z]){2,}|[A-Za-z][가-힣]+|[A-Za-z]{2,}|\d+(?:\.\d+)?|[가-힣]{2,}/g) ?? [])]
    .map((token) => token.toLowerCase())
    .filter((token) => !stopwords.has(token));
}

function extractExamPoint(body) {
  const heading = /^## 시험 포인트\s*$/m.exec(body);
  if (!heading) return '';
  const rest = body.slice(heading.index + heading[0].length).replace(/^\r?\n/, '');
  const nextHeading = /^##\s+/m.exec(rest);
  return (nextHeading ? rest.slice(0, nextHeading.index) : rest).trim();
}

function csvCell(value) {
  const string = String(value ?? '');
  return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

const questionFiles = [
  path.resolve('src/data/questions/industrial-safety.json'),
  path.resolve('src/data/questions/energy-management.json'),
];
const questions = new Map();
for (const file of questionFiles) {
  for (const question of JSON.parse(await readFile(file, 'utf8'))) questions.set(question.id, question);
}

const rows = [];
const chapterFiles = await listFiles(chapterRoot, '.md');
for (const file of chapterFiles) {
  const source = await readFile(file, 'utf8');
  const parts = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!parts) continue;
  const [, frontmatter, body] = parts;
  if (field(frontmatter, 'status') !== '완료') continue;

  const title = field(frontmatter, 'title');
  const slug = field(frontmatter, 'slug');
  const subjectId = field(frontmatter, 'subject_id');
  const questionIds = arrayField(frontmatter, 'questions');
  const tags = arrayField(frontmatter, 'tags');
  const section = extractExamPoint(body);
  const sectionNormalized = normalize(section);
  const sectionTokens = new Set(tokens(section));
  const bodyNormalized = normalize(body);
  const bodyTokens = new Set(tokens(body));
  const tableRows = section.split('\n').filter((line) => /^\|.+\|\s*$/.test(line) && !/^\|\s*[-:]+/.test(line)).length - 1;
  const boldCount = (section.match(/\*\*[^*]+\*\*/g) ?? []).length;
  const missingQuestionIds = questionIds.filter((id) => !questions.has(id));
  let exactMatches = 0;
  let tokenMatches = 0;
  let negationQuestions = 0;
  let positiveQuestions = 0;
  let bodyTokenMatches = 0;

  for (const id of questionIds) {
    const question = questions.get(id);
    if (!question) continue;
    const correctChoice = question.choices?.[question.answer - 1] ?? '';
    const choiceNormalized = normalize(correctChoice);
    const choiceTokens = tokens(correctChoice);
    if (choiceNormalized.length >= 2 && sectionNormalized.includes(choiceNormalized)) exactMatches += 1;
    if (choiceTokens.some((token) => sectionTokens.has(token) || sectionNormalized.includes(token))) tokenMatches += 1;
    const isNegation = /(아닌|옳지|잘못|제외|거리가 먼|해당하지 않|틀린|적합하지|관계없는|관계가 없는|맞지 않|부적절|오류|해당되지 않)/.test(question.body);
    if (isNegation) negationQuestions += 1;
    else {
      positiveQuestions += 1;
      if (choiceTokens.some((token) => bodyTokens.has(token) || bodyNormalized.includes(token))) bodyTokenMatches += 1;
    }
  }

  const relative = path.relative(chapterRoot, file).replaceAll('\\', '/');
  const segments = relative.split('/');
  const isEnergy = segments[0] === 'energy-management';
  const subject = isEnergy ? segments[1] : (industrialSubjectSlugs[subjectId] ?? segments[0]);
  const cert = isEnergy ? 'energy-management' : 'industrial-safety';
  const url = `/${cert}/written/${subject}/${slug}/`;
  const total = questionIds.length;
  const tokenCoverage = total === 0 ? 1 : tokenMatches / total;
  const bodyCoverage = positiveQuestions === 0 ? 1 : bodyTokenMatches / positiveQuestions;
  const flags = [];
  if (!section) flags.push('시험 포인트 없음');
  if (tableRows < 1) flags.push('매핑 표 없음');
  if (boldCount < 1) flags.push('정답 강조 없음');
  if (missingQuestionIds.length) flags.push(`기출 ID 누락 ${missingQuestionIds.length}`);
  if (total > 0 && tokenCoverage < 0.25) flags.push('정답 키워드 대조 낮음');
  if (positiveQuestions > 0 && bodyCoverage < 0.5) flags.push('본문 정답 근거 대조 낮음');
  if (tags.includes('계산')) flags.push('계산 직접 검토');
  if (tags.includes('법령')) flags.push('법령 직접 검토');
  if (negationQuestions > 0) flags.push(`부정형 ${negationQuestions}`);

  rows.push({
    title, url, relative, total, tableRows: Math.max(0, tableRows), boldCount,
    exactMatches, tokenMatches, tokenCoverage, negationQuestions,
    positiveQuestions, bodyTokenMatches, bodyCoverage,
    missingQuestionIds: missingQuestionIds.join(' '), tags: tags.join(' '), flags: flags.join(' · '),
  });
}

rows.sort((a, b) => a.relative.localeCompare(b.relative, 'en'));
const csvHeaders = [
  '챕터명', '사이트 링크', '파일', '연결 기출', '시험 포인트 행', '볼드 수',
  '정답 선택지 완전 일치', '정답 키워드 대조', '키워드 대조율', '부정형 문항',
  '긍정형 문항', '본문 정답 근거 대조', '본문 대조율', '누락 기출 ID', '태그', '검토 플래그',
];
const csvKeys = [
  'title', 'url', 'relative', 'total', 'tableRows', 'boldCount',
  'exactMatches', 'tokenMatches', 'tokenCoverage', 'negationQuestions',
  'positiveQuestions', 'bodyTokenMatches', 'bodyCoverage', 'missingQuestionIds', 'tags', 'flags',
];
const csvLines = [csvHeaders.map(csvCell).join(',')];
for (const row of rows) {
  csvLines.push(csvKeys.map((key) => csvCell(['tokenCoverage', 'bodyCoverage'].includes(key) ? row[key].toFixed(3) : row[key])).join(','));
}

const totalQuestions = rows.reduce((sum, row) => sum + row.total, 0);
const totalExact = rows.reduce((sum, row) => sum + row.exactMatches, 0);
const totalToken = rows.reduce((sum, row) => sum + row.tokenMatches, 0);
const missingSections = rows.filter((row) => row.tableRows < 1 || row.boldCount < 1);
const lowCoverage = rows.filter((row) => row.total > 0 && row.tokenCoverage < 0.25);
const lowBodyCoverage = rows.filter((row) => row.positiveQuestions > 0 && row.bodyCoverage < 0.5);
const missingIds = rows.filter((row) => row.missingQuestionIds);
const highRisk = rows.filter((row) => /계산 직접 검토|법령 직접 검토/.test(row.flags));
const knownQuestionDataIssues = [
  ['20180304_036', 'FTA 문제의 원본 도형 이미지가 질문 데이터에 없어 지문만으로 완전 복원이 불가능함'],
  ['20220424_003', '보호구 문제의 ㄱ·ㄴ·ㄷ·ㄹ 항목 내용이 질문 데이터에 누락됨'],
  ['20180428_116', '해체 순서 문제의 A·B·C·D 작업 정의 또는 이미지가 질문 데이터에 누락됨'],
  ['20190804_105', '타워크레인 지지 문제의 저장 정답 번호와 선택지 의미가 충돌할 가능성이 있어 원본 대조가 필요함'],
  ['20200822_015', '동기요인 문제의 저장 정답 선택지에 `쇼임감` 오탈자가 있으며 문맥상 책임감을 뜻하는 것으로 판단됨'],
];

const markdown = `# 전체 공개 챕터 시험 포인트 QA 감사

- 기준일: ${auditDate}
- 공개 챕터: ${rows.length}개
- 연결 기출 참조: ${totalQuestions}개
- 정답 선택지 완전 일치: ${totalExact}개
- 정답 키워드 대조: ${totalToken}개
- 시험 포인트 표·정답 강조 누락: ${missingSections.length}개
- 존재하지 않는 기출 ID 참조: ${missingIds.length}개 챕터
- 키워드 대조율 25% 미만: ${lowCoverage.length}개 챕터
- 본문 정답 근거 대조율 50% 미만: ${lowBodyCoverage.length}개 챕터
- 계산·법령 직접 검토 대상: ${highRisk.length}개 챕터

## 판정 기준

- 완전 일치는 정답 선택지 전체가 시험 포인트 영역에 그대로 포함되는지를 보는 보수적 지표임
- 키워드 대조는 정답 선택지의 유효 토큰이 시험 포인트 영역에 존재하는지를 보는 후보 추출용 지표임
- 두 지표는 의미 일치나 정답의 정확성을 자동 확정하지 않으며, 계산·법령·부정형은 직접 검토가 필요함

## 확인된 질문 데이터 예외

| 문제 ID | 상태 |
|---|---|
${knownQuestionDataIssues.map(([id, issue]) => `| ${id} | ${issue} |`).join('\n')}

## 대조율 해석 주의

- \`boiler-water-treatment\`는 수질 외에 수리·배관·난방 항목이 섞인 96개 과거 기출을 연결하고 있어 단일 시험 포인트 표와의 자동 키워드 대조율이 낮게 나타남
- 관계 데이터는 이번 작업의 동결 범위이므로 변경하지 않았으며, 수질 핵심과 반복 출제된 수리 안전 단서만 본문 목적을 해치지 않는 범위에서 보강함

## 우선 직접 검토 후보

| 챕터 | 기출 | 대조 | 플래그 |
|---|---:|---:|---|
${[...rows]
  .sort((a, b) => a.tokenCoverage - b.tokenCoverage || b.total - a.total)
  .slice(0, 40)
  .map((row) => `| [${row.title}](${row.url}) | ${row.total} | ${(row.tokenCoverage * 100).toFixed(1)}% | ${row.flags || '-'} |`)
  .join('\n')}

상세 결과는 같은 날짜의 CSV에 기록함
`;

await mkdir(auditRoot, { recursive: true });
await writeFile(path.join(auditRoot, `${auditDate}-exam-point-all-chapters-audit.csv`), `\ufeff${csvLines.join('\n')}\n`, 'utf8');
await writeFile(path.join(auditRoot, `${auditDate}-exam-point-all-chapters-audit.md`), markdown, 'utf8');

console.log(`공개 챕터: ${rows.length}개`);
console.log(`연결 기출 참조: ${totalQuestions}개`);
console.log(`표·강조 누락: ${missingSections.length}개`);
console.log(`누락 기출 ID: ${missingIds.length}개 챕터`);
console.log(`키워드 대조율 25% 미만: ${lowCoverage.length}개 챕터`);
console.log(`본문 정답 근거 대조율 50% 미만: ${lowBodyCoverage.length}개 챕터`);
console.log(`감사 결과: docs/audits/${auditDate}-exam-point-all-chapters-audit.{csv,md}`);

if (rows.length !== 239 || missingSections.length || missingIds.length) process.exitCode = 1;

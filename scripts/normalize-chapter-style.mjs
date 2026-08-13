import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/chapters');
const shouldWrite = process.argv.includes('--write');

const exact = new Map(Object.entries({
  '다': '임',
  '과다': '과다',
  '약어보다': '약어보다',
  '외우기보다': '외우기보다',
  '하기보다': '하기보다',
  '아니다': '아님',
  '있다': '있음',
  '없다': '없음',
  '않다': '않음',
  '않는다': '않음',
  '않았다': '않았음',
  '못한다': '못함',
  '이다': '임',
  '것이다': '것임',
  '수다': '수임',
  '같다': '같음',
  '다르다': '다름',
  '쉽다': '쉬움',
  '어렵다': '어려움',
  '높다': '높음',
  '낮다': '낮음',
  '크다': '큼',
  '작다': '작음',
  '넓다': '넓음',
  '좁다': '좁음',
  '빠르다': '빠름',
  '느리다': '느림',
  '길다': '김',
  '짧다': '짧음',
  '많다': '많음',
  '적다': '적음',
  '맞다': '맞음',
  '틀리다': '틀림',
  '좋다': '좋음',
  '나쁘다': '나쁨',
  '강하다': '강함',
  '약하다': '약함',
  '중요하다': '중요함',
  '필요하다': '필요함',
  '가능하다': '가능함',
  '불가능하다': '불가능함',
  '유리하다': '유리함',
  '불리하다': '불리함',
  '동일하다': '동일함',
  '일정하다': '일정함',
  '위험하다': '위험함',
  '안전하다': '안전함',
  '명확하다': '명확함',
  '복잡하다': '복잡함',
  '단순하다': '단순함',
  '반대다': '반대임',
  '만든다': '만듦',
  '연다': '엶',
  '든다': '듦',
  '걸린다': '걸림',
  '다룬다': '다룸',
  '묻는다': '물음',
  '본다': '봄',
  '준다': '줌',
  '둔다': '둠',
  '된다': '됨',
  '됐다': '됐음',
  '되었다': '되었음',
  '정리합니다': '정리함',
  '제시했다': '제시했음',
  '바뀌었다': '바뀌었음',
  '달라졌다': '달라졌음',
  '하였다': '했음',
  '했다': '했음',
  '이내마다': '이내마다',
}));

const contractedCopulas = [
  '문제다', '장치다', '범위다', '단계다', '지표다', '분류다', '구조다', '관계다',
  '보호장치다', '절차다', '정도다', '각도다', '거리다', '먼저다', '비례상수다',
  '상태다', '온도다', '온도차다', '자료다', '제도다', '주제다', '결과다', '경우다',
  '계수다', '공작기계다', '단서다', '덮개다', '도구다', '두께다', '문서다', '방지다',
  '방지장치다', '방호설비다', '방호장치다', '버드다', '별개다', '비열비다', '사례다',
  '설비다', '세기다', '소화약제다', '순서다', '습도다', '신호다', '안전구조다',
  '안전조치다', '안전화다', '액체온도다', '억제다', '여부다', '여유다', '예다',
  '유도자다', '음수다', '장비다', '전류다', '정의다', '제어다', '조치다', '주기다',
  '증기다', '척도다', '체계다', '포화증기다', '표준편차다', '형태다', '흑구온도다',
];
for (const word of contractedCopulas) exact.set(word, `${word.slice(0, -1)}임`);

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONG_NIEUN = 4;
const JONG_MIEUM = 16;

function nominalizeNda(word) {
  const beforeDa = word.slice(0, -1);
  const last = beforeDa.at(-1);
  const code = last?.charCodeAt(0);
  if (code === undefined || code < HANGUL_START || code > HANGUL_END) return null;

  const offset = code - HANGUL_START;
  const jong = offset % 28;
  if (jong !== JONG_NIEUN) return null;

  const withMieum = String.fromCharCode(code - JONG_NIEUN + JONG_MIEUM);
  return `${beforeDa.slice(0, -1)}${withMieum}`;
}

function nominalize(word) {
  if (exact.has(word)) return exact.get(word);

  if (word.endsWith('했습니다')) return `${word.slice(0, -4)}했음`;
  if (word.endsWith('합니다')) return `${word.slice(0, -3)}함`;
  if (word.endsWith('하였다')) return `${word.slice(0, -3)}했음`;
  if (word.endsWith('했다')) return `${word.slice(0, -2)}했음`;
  if (word.endsWith('되었습니다')) return `${word.slice(0, -5)}되었음`;
  if (word.endsWith('되었다')) return `${word.slice(0, -3)}되었음`;
  if (word.endsWith('됐다')) return `${word.slice(0, -2)}됐음`;
  if (word.endsWith('됩니다')) return `${word.slice(0, -3)}됨`;
  if (word.endsWith('된다')) return `${word.slice(0, -2)}됨`;
  if (word.endsWith('이었다')) return `${word.slice(0, -3)}이었음`;
  if (word.endsWith('였다')) return `${word.slice(0, -2)}였음`;
  if (word.endsWith('입니다')) return `${word.slice(0, -3)}임`;
  if (word.endsWith('이다')) return `${word.slice(0, -2)}임`;
  if (word.endsWith('하였다')) return `${word.slice(0, -3)}했음`;
  if (word.endsWith('한다')) return `${word.slice(0, -2)}함`;
  if (word.endsWith('하다')) return `${word.slice(0, -2)}함`;
  if (word.endsWith('는다')) return `${word.slice(0, -2)}음`;

  if (/[A-Za-z0-9%℃]다$/.test(word)) return `${word.slice(0, -1)}임`;

  return nominalizeNda(word);
}

function transformPlain(segment, unresolved) {
  const transformed = segment.replace(/([\p{L}\p{N}%℃]*(?:다|니다))\.(\*{1,2})?(?=\s|$|["'”’)\]])/gu, (match, word, closer = '', offset, source) => {
    const converted = nominalize(word);
    if (!converted) {
      unresolved.set(word, (unresolved.get(word) ?? 0) + 1);
      return match;
    }

    const next = source[offset + match.length];
    return next === ' ' || next === '\t' ? `${converted}${closer} ·` : `${converted}${closer}`;
  });

  return transformed
    .replace(/([\p{L}\p{N}%℃]*(?:다|니다))(?=(?:\*\*|__|<\/strong>)?\s*(?:\||$))/gu, (match, word) => {
      const converted = nominalize(word);
      if (!converted) {
        unresolved.set(word, (unresolved.get(word) ?? 0) + 1);
        return match;
      }
      return converted;
    })
    .replace(/\. (?=\S)/g, (match, offset, source) => {
      const before = source.slice(0, offset).trim();
      return /^(?:\d+|[A-Za-z])$/.test(before) ? match : ' · ';
    })
    .replace(/\.$/, '')
    .replace(/\.(?=(?:\*\*|__|<\/strong>|["”'])$)/, '');
}

function transformLine(line, unresolved) {
  const parts = line.split(/(`[^`]*`)/g);
  return parts.map((part, index) => index % 2 === 0 ? transformPlain(part, unresolved) : part).join('');
}

function emphasizeExamPointAnswer(line) {
  const match = line.match(/^\|([^|]+)\|([^|]+)\|\s*$/);
  if (!match || /^\s*[-:]+\s*$/.test(match[1]) || /정답으로 연결/.test(match[2])) return line;

  const answer = match[2].trim();
  if (/\*\*[^*]+\*\*/.test(answer)) return line;
  return `| ${match[1].trim()} | **${answer}** |`;
}

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
  }
  return files;
}

const files = await listMarkdownFiles(root);
const unresolved = new Map();
let publicCount = 0;
let changedCount = 0;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (!/^status:\s*완료\s*$/m.test(source)) continue;
  publicCount += 1;

  let inFence = false;
  let inExamPoint = false;
  const transformed = source.split(/\r?\n/).map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;

    if (/^##\s+/.test(line)) inExamPoint = /^## 시험 포인트\s*$/.test(line);
    const transformedLine = transformLine(line, unresolved);
    return inExamPoint ? emphasizeExamPointAnswer(transformedLine) : transformedLine;
  }).join('\n');

  if (transformed !== source.replace(/\r\n/g, '\n')) {
    changedCount += 1;
    if (shouldWrite) await writeFile(file, transformed, 'utf8');
  }
}

console.log(`공개 챕터: ${publicCount}개`);
console.log(`${shouldWrite ? '수정' : '수정 예정'}: ${changedCount}개`);
if (unresolved.size > 0) {
  console.log('미변환 문장 종결어:');
  for (const [word, count] of [...unresolved.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))) {
    console.log(`${String(count).padStart(4)} ${word}`);
  }
  process.exitCode = 1;
}

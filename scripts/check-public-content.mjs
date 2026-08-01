import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const CHAPTER_DIR = path.resolve('src/content/chapters');
const INTERNAL_QUESTION_ID = /\b\d{8}_\d{3}\b/g;
const INTERNAL_QUESTION_ALIAS = /\bq\d{8}\b/gi;
const SOURCE_CONTROL_CHARACTER = /[\x00-\x09\x0b-\x1f\x7f]/g;
const ORPHANED_RHO_TOKEN = /(?:^|\n)ho\s*=/gm;
const UNRENDERED_EMPHASIS = /(?:\*\*[^*\n]{1,200}\*\*|__[^_\n]{1,200}__)/g;
const INTERNAL_COPY_RULES = [
  { label: 'PDF', pattern: /\bPDF\b/gi },
  { label: 'JSON', pattern: /\bJSON\b/gi },
  { label: 'question_id', pattern: /\bquestion_id\b/gi },
  { label: 'review 상태', pattern: /\breview\s*:/gi },
  { label: 'jpg 확필', pattern: /jpg\s*확필/gi },
  { label: '저장소', pattern: /저장소/g },
  { label: '저장된 기출', pattern: /저장된\s*기출/g },
  { label: '후속 관계', pattern: /후속\s*관계/g },
  { label: '역사적 관계', pattern: /역사적\s*관계/g },
  { label: '이미지 자산', pattern: /이미지\s*자산/g },
  { label: '공개 렌더링', pattern: /공개\s*렌더링/g },
  { label: '공개 화면', pattern: /공개\s*화면/g },
  { label: '공개 페이지', pattern: /공개\s*페이지/g },
  { label: '안전 필터', pattern: /안전\s*필터/g },
  { label: 'questions 배열', pattern: /questions\s*배열/gi },
  { label: '기출 DB', pattern: /기출\s*DB/gi },
  { label: 'DB ID', pattern: /DB\s*ID/gi },
  { label: '기출 매칭', pattern: /기출\s*매칭/g },
  { label: '등록 기출 데이터', pattern: /등록\s*기출\s*데이터/g },
];

const errors = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }

  return files;
}

function decodeHtml(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function visibleText(html) {
  return decodeHtml(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pagePath(file) {
  const relative = path.relative(DIST_DIR, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/index\.html$/, '')}`;
}

function uniqueMatches(text, pattern) {
  pattern.lastIndex = 0;
  return [...new Set(text.match(pattern) ?? [])];
}

async function chapterSlugs() {
  const files = (await walk(CHAPTER_DIR)).filter((file) => file.endsWith('.md'));
  const slugs = new Set();

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const relative = path.relative(CHAPTER_DIR, file).replaceAll(path.sep, '/');
    const controlCharacters = uniqueMatches(source, SOURCE_CONTROL_CHARACTER);
    if (controlCharacters.length > 0) {
      const codes = controlCharacters.map((value) =>
        `U+${value.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
      );
      errors.push(`${relative}: 챕터 원문에 제어문자 포함 (${codes.join(', ')})`);
    }

    if (uniqueMatches(source, ORPHANED_RHO_TOKEN).length > 0) {
      errors.push(`${relative}: LaTeX rho 명령이 줄바꿈으로 손상된 흔적(ho=) 발견`);
    }

    const slug = source.match(/^slug:\s*['"]?([^'"\r\n]+)['"]?\s*$/m)?.[1]?.trim();
    if (slug) slugs.add(slug);
  }

  return slugs;
}

const files = await walk(DIST_DIR);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const knownSlugs = await chapterSlugs();

for (const file of htmlFiles) {
  const publicPath = pagePath(file);
  if (publicPath.startsWith('/admin/')) continue;

  const html = await readFile(file, 'utf8');
  const text = visibleText(html);

  const ids = uniqueMatches(text, INTERNAL_QUESTION_ID);
  if (ids.length > 0) {
    errors.push(`${publicPath}: 공개 본문에 내부 question_id 노출 (${ids.join(', ')})`);
  }

  const aliases = uniqueMatches(text, INTERNAL_QUESTION_ALIAS);
  if (aliases.length > 0) {
    errors.push(`${publicPath}: 공개 본문에 내부 기출 별칭 노출 (${aliases.join(', ')})`);
  }

  const emphasis = uniqueMatches(text, UNRENDERED_EMPHASIS);
  if (emphasis.length > 0) {
    errors.push(`${publicPath}: 렌더링되지 않은 Markdown 강조 표기 (${emphasis.join(' | ')})`);
  }

  for (const rule of INTERNAL_COPY_RULES) {
    const matches = uniqueMatches(text, rule.pattern);
    if (matches.length > 0) {
      errors.push(`${publicPath}: 내부 운영 문구 노출 [${rule.label}] (${matches.join(', ')})`);
    }
  }

  const codeValues = [...html.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/gi)]
    .map(([, value]) => visibleText(value))
    .filter((value) => knownSlugs.has(value));

  if (codeValues.length > 0) {
    errors.push(`${publicPath}: 내부 chapter slug가 코드 표기로 노출 (${[...new Set(codeValues)].join(', ')})`);
  }
}

console.log(`[Public content] HTML ${htmlFiles.length}개 검사`);
for (const error of errors) console.error(`[Public content error] ${error}`);
console.log(`[Public content] 오류 ${errors.length}개`);

if (errors.length > 0) process.exitCode = 1;

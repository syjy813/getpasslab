import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ENERGY_WRITTEN_DIR = path.resolve('dist/energy-management/written');
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

function countMatches(value, pattern) {
  pattern.lastIndex = 0;
  return [...value.matchAll(pattern)].length;
}

let files = [];
try {
  files = await walk(ENERGY_WRITTEN_DIR);
} catch (error) {
  console.error('[Deferred questions error] 에너지관리기능사 빌드 경로를 찾을 수 없습니다. 먼저 npm run build를 실행하세요.');
  console.error(error);
  process.exit(1);
}

const chapterFiles = files.filter((file) => {
  if (!file.endsWith('index.html')) return false;
  const relative = path.relative(ENERGY_WRITTEN_DIR, file).replaceAll(path.sep, '/');
  return relative.split('/').length === 3;
});

if (chapterFiles.length === 0) {
  errors.push('검사할 에너지관리기능사 공개 챕터 HTML이 없습니다.');
}

let deferredButtonsTotal = 0;
let deferredDialogsTotal = 0;

for (const file of chapterFiles) {
  const relative = path.relative(path.resolve('dist'), file).replaceAll(path.sep, '/');
  const html = await readFile(file, 'utf8');

  const deferredModeCount = countMatches(html, /data-question-history-mode=["']deferred["']/g);
  const allQuestionButtons = countMatches(html, /<button\b[^>]*\bdata-open=/g);
  const deferredQuestionButtons = countMatches(
    html,
    /<button\b[^>]*\bdata-deferred-question=["']true["'][^>]*>/g,
  );
  const staticQuestionDialogs = countMatches(html, /<dialog\b[^>]*\bid=["']q-[^"']+["'][^>]*>/g);
  const deferredDialogs = countMatches(
    html,
    /<dialog\b[^>]*\bid=["']deferred-question-dialog["'][^>]*>/g,
  );
  const questionBodies = countMatches(html, /class=["'][^"']*\bq-body\b[^"']*["']/g);
  const questionChoiceLists = countMatches(html, /class=["'][^"']*\bq-choices\b[^"']*["']/g);

  deferredButtonsTotal += deferredQuestionButtons;
  deferredDialogsTotal += deferredDialogs;

  if (deferredModeCount !== 1) {
    errors.push(`${relative}: deferred question-history mode 표식이 ${deferredModeCount}개입니다.`);
  }
  if (staticQuestionDialogs !== 0) {
    errors.push(`${relative}: 정적 기출 dialog가 ${staticQuestionDialogs}개 남아 있습니다.`);
  }
  if (allQuestionButtons !== deferredQuestionButtons) {
    errors.push(
      `${relative}: 기출 버튼 ${allQuestionButtons}개 중 deferred 버튼은 ${deferredQuestionButtons}개입니다.`,
    );
  }

  if (allQuestionButtons > 0) {
    if (deferredDialogs !== 1) {
      errors.push(`${relative}: deferred 공용 dialog가 ${deferredDialogs}개입니다.`);
    }
    if (questionBodies !== 1) {
      errors.push(`${relative}: 초기 HTML의 q-body가 ${questionBodies}개입니다. placeholder 1개만 허용합니다.`);
    }
    if (questionChoiceLists !== 1) {
      errors.push(`${relative}: 초기 HTML의 q-choices가 ${questionChoiceLists}개입니다. 빈 공용 목록 1개만 허용합니다.`);
    }
  } else {
    if (deferredDialogs !== 0 || questionBodies !== 0 || questionChoiceLists !== 0) {
      errors.push(`${relative}: 연결 기출이 없는데 deferred 문제 UI가 초기 HTML에 남아 있습니다.`);
    }
  }
}

console.log(
  `[Deferred questions] 에너지관리기능사 챕터 ${chapterFiles.length}개 · deferred 버튼 ${deferredButtonsTotal}개 · 공용 dialog ${deferredDialogsTotal}개 검사`,
);
for (const error of errors) console.error(`[Deferred questions error] ${error}`);
console.log(`[Deferred questions] 오류 ${errors.length}개`);

if (errors.length > 0) process.exitCode = 1;

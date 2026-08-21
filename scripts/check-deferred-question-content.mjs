import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const CERTIFICATIONS = [
  { id: 'energy-management', label: '에너지관리기능사' },
  { id: 'industrial-safety', label: '산업안전산업기사' },
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

function countMatches(value, pattern) {
  pattern.lastIndex = 0;
  return [...value.matchAll(pattern)].length;
}

function hasAttribute(tag, name) {
  return new RegExp(`\\b${name}=["'][^"']+["']`).test(tag);
}

let industrialImageIds = new Set();
try {
  const manifestPath = path.resolve('src/data/question-assets/industrial-safety.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  industrialImageIds = new Set(manifest.map(entry => entry.id));
} catch (error) {
  console.error('[Deferred questions error] 산업안전산업기사 이미지 manifest를 읽지 못했습니다.');
  console.error(error);
  process.exit(1);
}

for (const certification of CERTIFICATIONS) {
  const writtenDir = path.resolve(`dist/${certification.id}/written`);
  let files = [];
  try {
    files = await walk(writtenDir);
  } catch (error) {
    console.error(
      `[Deferred questions error] ${certification.label} 빌드 경로를 찾을 수 없습니다. 먼저 npm run build를 실행하세요.`,
    );
    console.error(error);
    process.exit(1);
  }

  const chapterFiles = files.filter((file) => {
    if (!file.endsWith('index.html')) return false;
    const relative = path.relative(writtenDir, file).replaceAll(path.sep, '/');
    return relative.split('/').length === 3;
  });

  if (chapterFiles.length === 0) {
    errors.push(`검사할 ${certification.label} 공개 챕터 HTML이 없습니다.`);
  }

  let deferredButtonsTotal = 0;
  let deferredDialogsTotal = 0;
  let imageButtonsTotal = 0;

  for (const file of chapterFiles) {
    const relative = path.relative(path.resolve('dist'), file).replaceAll(path.sep, '/');
    const html = await readFile(file, 'utf8');

    const deferredModeCount = countMatches(html, /data-question-history-mode=["']deferred["']/g);
    const questionButtons = [...html.matchAll(/<button\b[^>]*\bdata-open=["']([^"']+)["'][^>]*>/g)]
      .map(match => ({ id: match[1], tag: match[0] }));
    const allQuestionButtons = questionButtons.length;
    const deferredQuestionButtons = questionButtons.filter(({ tag }) => (
      /\bdata-deferred-question=["']true["']/.test(tag)
    )).length;
    const staticQuestionDialogs = countMatches(html, /<dialog\b[^>]*\bid=["']q-[^"']+["'][^>]*>/g);
    const deferredDialogs = countMatches(
      html,
      /<dialog\b[^>]*\bid=["']deferred-question-dialog["'][^>]*>/g,
    );
    const datasetMarkers = countMatches(
      html,
      new RegExp(`data-question-dataset=["']${certification.id}["']`, 'g'),
    );
    const questionBodies = countMatches(html, /class=["'][^"']*\bq-body\b[^"']*["']/g);
    const questionChoiceLists = countMatches(html, /class=["'][^"']*\bq-choices\b[^"']*["']/g);
    const questionFigures = countMatches(html, /\bdata-question-figure(?:\s|>|=)/g);
    const questionImages = countMatches(html, /\bdata-question-image(?:\s|>|=)/g);
    const deferredImageTag = html.match(/<img\b[^>]*\bdata-question-image(?:\s|=)[^>]*>/)?.[0] ?? '';

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

    if (certification.id === 'industrial-safety') {
      for (const { id, tag } of questionButtons) {
        const shouldHaveImage = industrialImageIds.has(id);
        const hasImageSrc = hasAttribute(tag, 'data-question-image-src');
        const hasImageWidth = hasAttribute(tag, 'data-question-image-width');
        const hasImageHeight = hasAttribute(tag, 'data-question-image-height');
        const hasCompleteImageMetadata = hasImageSrc && hasImageWidth && hasImageHeight;

        if (shouldHaveImage) {
          imageButtonsTotal += 1;
          if (!hasCompleteImageMetadata) {
            errors.push(`${relative}: 이미지 문항 ${id}의 deferred 이미지 메타데이터가 불완전합니다.`);
          }
        } else if (hasImageSrc || hasImageWidth || hasImageHeight) {
          errors.push(`${relative}: 비이미지 문항 ${id}에 deferred 이미지 메타데이터가 있습니다.`);
        }
      }
    }

    if (allQuestionButtons > 0) {
      if (deferredDialogs !== 1) {
        errors.push(`${relative}: deferred 공용 dialog가 ${deferredDialogs}개입니다.`);
      }
      if (datasetMarkers !== 1) {
        errors.push(`${relative}: ${certification.id} deferred dataset 표식이 ${datasetMarkers}개입니다.`);
      }
      if (questionBodies !== 1) {
        errors.push(`${relative}: 초기 HTML의 q-body가 ${questionBodies}개입니다. placeholder 1개만 허용합니다.`);
      }
      if (questionChoiceLists !== 1) {
        errors.push(`${relative}: 초기 HTML의 q-choices가 ${questionChoiceLists}개입니다. 빈 공용 목록 1개만 허용합니다.`);
      }
      if (questionFigures !== 1 || questionImages !== 1) {
        errors.push(
          `${relative}: deferred 이미지 placeholder는 figure/image 각 1개여야 합니다. 현재 ${questionFigures}/${questionImages}개입니다.`,
        );
      }
      if (deferredImageTag && /\ssrc=["'][^"']+["']/.test(deferredImageTag)) {
        errors.push(`${relative}: deferred 공용 이미지가 초기 HTML에서 eager src를 갖고 있습니다.`);
      }
    } else {
      if (
        deferredDialogs !== 0
        || datasetMarkers !== 0
        || questionBodies !== 0
        || questionChoiceLists !== 0
        || questionFigures !== 0
        || questionImages !== 0
      ) {
        errors.push(`${relative}: 연결 기출이 없는데 deferred 문제 UI가 초기 HTML에 남아 있습니다.`);
      }
    }
  }

  const imageSummary = certification.id === 'industrial-safety'
    ? ` · 이미지 버튼 ${imageButtonsTotal}개`
    : '';
  console.log(
    `[Deferred questions] ${certification.label} 챕터 ${chapterFiles.length}개 · deferred 버튼 ${deferredButtonsTotal}개 · 공용 dialog ${deferredDialogsTotal}개${imageSummary} 검사`,
  );
}

for (const error of errors) console.error(`[Deferred questions error] ${error}`);
console.log(`[Deferred questions] 오류 ${errors.length}개`);

if (errors.length > 0) process.exitCode = 1;

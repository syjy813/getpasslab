import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const INTERNAL_QUESTION_ID = /\b\d{8}_\d{3}\b/g;
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

const files = await walk(DIST_DIR);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const text = visibleText(html);
  const ids = [...new Set(text.match(INTERNAL_QUESTION_ID) ?? [])];

  if (ids.length > 0) {
    errors.push(`${pagePath(file)}: 공개 본문에 내부 question_id 노출 (${ids.join(', ')})`);
  }
}

console.log(`[Public content] HTML ${htmlFiles.length}개 검사`);
for (const error of errors) console.error(`[Public content error] ${error}`);
console.log(`[Public content] 오류 ${errors.length}개`);

if (errors.length > 0) process.exitCode = 1;

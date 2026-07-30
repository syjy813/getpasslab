import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const SITE_ORIGIN = 'https://getpasslab.co.kr';
const warnings = [];
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
    .replace(/&gt;/g, '>');
}

function attr(html, tagPattern, attribute) {
  const tag = html.match(tagPattern)?.[0];
  if (!tag) return '';
  return decodeHtml(tag.match(new RegExp(`${attribute}=["']([^"']*)["']`, 'i'))?.[1] ?? '');
}

function pageUrl(file) {
  const relative = path.relative(DIST_DIR, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}/${relative.replace(/index\.html$/, '')}`;
}

const files = await walk(DIST_DIR);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length === 0) errors.push('dist에 HTML 파일이 없습니다. 먼저 npm run build를 실행하세요.');

const titles = new Map();
const descriptions = new Map();
const noindexUrls = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const url = pageUrl(file);
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const description = attr(html, /<meta\s+[^>]*name=["']description["'][^>]*>/i, 'content');
  const robots = attr(html, /<meta\s+[^>]*name=["']robots["'][^>]*>/i, 'content').toLowerCase();
  const canonical = attr(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, 'href');
  const jsonLdBlocks = [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  if (!title) errors.push(`${url}: title 누락`);
  if (!description) errors.push(`${url}: description 누락`);
  if (!canonical) errors.push(`${url}: canonical 누락`);
  if (canonical && !canonical.startsWith(SITE_ORIGIN)) errors.push(`${url}: canonical 도메인 불일치 (${canonical})`);
  if (!robots) warnings.push(`${url}: robots meta 누락`);
  if (robots.includes('noindex')) noindexUrls.add(canonical || url);
  if (!jsonLdBlocks.length) errors.push(`${url}: JSON-LD 누락`);

  for (const [, rawJson] of jsonLdBlocks) {
    try {
      JSON.parse(rawJson);
    } catch (error) {
      errors.push(`${url}: 유효하지 않은 JSON-LD (${error.message})`);
    }
  }

  if (title && (title.length < 15 || title.length > 60)) warnings.push(`${url}: title 길이 ${title.length}자`);
  if (description && (description.length < 50 || description.length > 160)) warnings.push(`${url}: description 길이 ${description.length}자`);

  if (title) titles.set(title, [...(titles.get(title) ?? []), url]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), url]);
}

for (const [title, urls] of titles) {
  if (urls.length > 1) warnings.push(`중복 title (${urls.length}개): ${title} -> ${urls.join(', ')}`);
}
for (const [description, urls] of descriptions) {
  if (urls.length > 1) warnings.push(`중복 description (${urls.length}개): ${description} -> ${urls.join(', ')}`);
}

const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/i.test(path.basename(file)));
if (!sitemapFiles.length) errors.push('sitemap XML이 생성되지 않았습니다.');
const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) sitemapUrls.add(decodeHtml(match[1]));
}
for (const url of sitemapUrls) {
  if (url.includes('/admin')) errors.push(`sitemap에 admin URL 포함: ${url}`);
  if (url.endsWith('/404/') || url.endsWith('/404.html')) errors.push(`sitemap에 404 URL 포함: ${url}`);
  if (!url.startsWith(SITE_ORIGIN)) errors.push(`sitemap 도메인 불일치: ${url}`);
  if (noindexUrls.has(url)) errors.push(`noindex URL이 sitemap에 포함됨: ${url}`);
}

const ogImage = path.join(DIST_DIR, 'og-default.png');
try {
  const info = await stat(ogImage);
  if (!info.isFile() || info.size === 0) errors.push('dist/og-default.png가 유효한 파일이 아닙니다.');
} catch {
  errors.push('dist/og-default.png 누락');
}

console.log(`[SEO] HTML ${htmlFiles.length}개, sitemap URL ${sitemapUrls.size}개 검사`);
for (const warning of warnings) console.warn(`[SEO warning] ${warning}`);
for (const error of errors) console.error(`[SEO error] ${error}`);
console.log(`[SEO] 경고 ${warnings.length}개, 오류 ${errors.length}개`);
if (errors.length > 0) process.exitCode = 1;

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'parse5';

const root = 'dist/facility-management';
const expected = [
  ['intro', '시설 사전', 2],
  ['career', '취업·커리어', 8],
  ['stories', '시설 이야기', 19],
  ['qualifications', '법정선임·자격 활용', 5],
];
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, key) => node.attrs?.find(item => item.name === key)?.value;
const content = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(content).join('');
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);
const load = path => walk(parse(fs.readFileSync(`${root}/${path}index.html`, 'utf8')));
const cardUrls = nodes => nodes.filter(node => node.tagName === 'a' && hasClass(node, 'facility-card')).map(node => attr(node, 'href'));

const home = load('');
const categoryNav = home.find(node => node.tagName === 'nav' && hasClass(node, 'facility-category-grid'));
assert(categoryNav, 'home category navigation');
const mainCategoryLinks = walk(categoryNav).filter(node => node.tagName === 'a' && hasClass(node, 'facility-category-link'));
assert.deepEqual(mainCategoryLinks.map(node => attr(node, 'href')), expected.map(([slug]) => `/facility-management/${slug}/`));

const allCategoryUrls = [];
for (const [slug, label, count] of expected) {
  const nodes = load(`${slug}/`);
  const main = nodes.find(node => node.tagName === 'main');
  assert.equal(content(nodes.find(node => node.tagName === 'h1')), label, `${slug}: H1`);
  assert(content(main).includes(`공개 콘텐츠 ${count}개`), `${slug}: count`);
  const urls = cardUrls(nodes);
  assert.equal(urls.length, count, `${slug}: card count`);
  assert.equal(new Set(urls).size, count, `${slug}: no duplicate articles`);
  allCategoryUrls.push(...urls);
}

const publishedUrls = fs.readdirSync('src/content/facility').filter(file => file.endsWith('.md')).flatMap(file => {
  const markdown = fs.readFileSync(`src/content/facility/${file}`, 'utf8');
  if (!/^status:\s*published\s*$/m.test(markdown)) return [];
  const route = markdown.match(/^category:\s*['"]?([\w-]+)['"]?\s*$/m)?.[1];
  assert(route, `${file}: route category`);
  return [`/facility-management/${route}/${file.slice(0, -3)}/`];
});
assert.equal(publishedUrls.length, 34, 'published article count after electric article launch');
assert.deepEqual(allCategoryUrls.sort(), publishedUrls.sort(), 'five-category IA covers all published articles once, at their original URLs');
for (const url of publishedUrls) {
  const nodes = load(url.replace('/facility-management/', ''));
  const canonical = nodes.find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
  assert.equal(attr(canonical, 'href'), `https://getpasslab.co.kr${url}`, `${url}: original canonical`);
}

const episodeOrders = JSON.parse(fs.readFileSync('docs/audits/2026-11-18-series-episode-order/manifest.json')).orders;
const storyNodes = load('stories/');
for (const [label, ids] of Object.entries(episodeOrders)) {
  const group = storyNodes.find(node => node.tagName === 'section' && hasClass(node, 'facility-category-subgroup') && attr(node, 'aria-label') === label);
  assert(group, `${label}: series group`);
  assert.deepEqual(cardUrls(walk(group)), ids.map(id => `/facility-management/career/${id}/`), `${label}: ascending episode order, complete and unique`);
}

const career = load('career/');
const stories = load('stories/');
for (const [nodes, labels] of [
  [career, ['취업 가이드', '기업·채용 분석']],
  [stories, ['호병백마 시리즈', '사수골대 시리즈']],
]) {
  const h2s = nodes.filter(node => node.tagName === 'h2').map(content);
  for (const label of labels) assert(h2s.includes(label), `subcategory ${label}`);
}

assert.equal(cardUrls(load('jobs/')).length, 5, 'legacy /jobs/ listing is retained');
assert(fs.existsSync(`${root}/practice/index.html`), 'empty practice page is retained');
for (const [articlePath, categoryPath, categoryName] of [
  ['career/what-is-facility-management/', '/facility-management/intro/', '시설 사전'],
  ['career/hobyeongbaekma/', '/facility-management/stories/', '시설 이야기'],
  ['jobs/hanfms/', '/facility-management/career/', '취업·커리어'],
]) {
  const nodes = load(articlePath);
  const breadcrumb = nodes.find(node => node.tagName === 'nav' && hasClass(node, 'breadcrumb'));
  assert(walk(breadcrumb).some(node => node.tagName === 'a' && attr(node, 'href') === categoryPath && content(node) === categoryName), `${articlePath}: new visible category breadcrumb`);
}

console.log('[Facility five-category IA] PASS', JSON.stringify({ categories: expected.map(([slug, , count]) => ({ slug, count })), publishedUrls: publishedUrls.length, originalUrls: 'preserved', legacyJobs: 'preserved' }));

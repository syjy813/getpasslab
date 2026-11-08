import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { episode00Release as release, assertEpisode00Release } from './read-hobyeongbaekma-publication.mjs';

assertEpisode00Release();
const preview = process.env.FACILITY_DRAFT_PREVIEW === '1';
const origin = 'https://getpasslab.co.kr';
const nodes = n => [n, ...(n.childNodes || []).flatMap(nodes)];
const attr = (n, key) => n?.attrs?.find(a => a.name === key)?.value;
const text = n => n?.nodeName === '#text' ? n.value : (n?.childNodes || []).map(text).join('');
const read = route => nodes(parse(fs.readFileSync('dist' + route + 'index.html', 'utf8')));
const list = read(release.route);
const meta = name => attr(list.find(n => n.tagName === 'meta' && attr(n, 'name') === name), 'content');
assert.equal(meta('robots'), preview ? 'noindex, nofollow' : 'index, follow');
assert.equal(attr(list.find(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical'), 'href'), origin + release.route);
assert.equal(list.filter(n => n.tagName === 'h1').length, 1);
assert(text(list.find(n => n.tagName === 'h1')).startsWith('[호병백마 ep.0]'));
assert(!/검토용 초안|공개 전 사실 및 이미지 검증 필요|EDITOR_NOTES|SOURCE_AUDIT/.test(text(list.find(n => n.tagName === 'main'))));
const schemas = list.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json').flatMap(n => {
  const value = JSON.parse(text(n)); return Array.isArray(value) ? value : [value];
}).filter(n => n['@type'] === 'Article');
assert.equal(schemas.length, preview ? 0 : 1);
if (!preview) {
  assert.equal(schemas[0].datePublished, release.publishedAt);
  assert.equal(schemas[0].dateModified, release.updatedAt);
  assert.equal(schemas[0].mainEntityOfPage, origin + release.route);
  assert.equal(schemas[0].citation.length, 10);
}
const body = list.find(n => (attr(n, 'class') || '').split(/\s+/).includes('facility-body'));
assert(!text(body).includes('네 시설'));
assert(!list.some(n => n.tagName === 'a' && attr(n, 'href')?.includes('no=184217')));
assert(!list.some(n => (attr(n, 'class') || '').split(/\s+/).includes('facility-sources')));
assert(text(body).includes('4개의 시설은 무엇이 다를까?'));
const images = nodes(body).filter(n => n.tagName === 'img');
assert.equal(images.length, 4, 'hero plus three complete comparison images');
assert.equal(nodes(body).filter(n=>n.tagName==='picture').length,3);
for (const [index,image] of images.entries()) {
  const path = attr(image, 'src');
  const row=release.images[index];
  assert.equal(path,row.src,'exact display-image order');
  assert(attr(image, 'alt') && attr(image, 'width') && attr(image, 'height'));
  assert.equal(Number(attr(image,'width')),row.width);assert.equal(Number(attr(image,'height')),row.height);
  const expected = release.additions['public' + path]; assert(expected, path);
  assert.equal(createHash('sha256').update(fs.readFileSync('dist' + path)).digest('hex'), expected);
  if(row.mobile){
    const source=image.parentNode.childNodes.find(n=>n.tagName==='source');
    assert.equal(attr(source,'srcset'),row.mobile.src);
    assert.equal(attr(source,'media'),'(max-width:767px)');
    assert.equal(Number(attr(source,'width')),row.mobile.width);assert.equal(Number(attr(source,'height')),row.mobile.height);
    assert.equal(createHash('sha256').update(fs.readFileSync('dist'+row.mobile.src)).digest('hex'),row.mobile.sha256);
  }
}
assert(!images.some(image=>/-(1|2)\.webp$/.test(attr(image,'src'))),'split images are no longer rendered');
for (const route of ['/facility-management/', '/facility-management/career/']) {
  const cards = read(route).filter(n => n.tagName === 'a' && attr(n, 'href') === release.route);
  assert.equal(cards.length, 1, 'exactly one episode card: ' + route);
  const cover = nodes(cards[0]).find(n => n.tagName === 'img');
  assert.equal(attr(cover, 'src'), attr(images[0], 'src'), 'approved hero on listing');
  assert.equal(attr(cover, 'width'), '1440'); assert.equal(attr(cover, 'height'), '1080');
}
const sitemap = fs.readdirSync('dist').filter(f => /^sitemap.*\.xml$/.test(f)).map(f => fs.readFileSync('dist/' + f, 'utf8')).join('');
assert.equal(sitemap.includes('<loc>' + origin + release.route + '</loc>'), !preview);
assert(!fs.existsSync('dist/facility-management/career/hobyeongbaekma-hotel/index.html'), 'episode one remains unpublished');
for (const n of list.filter(n => n.tagName === 'a')) {
  const href = attr(n, 'href');
  if (href?.startsWith('/facility-management/')) assert(fs.existsSync('dist' + href.replace(/\/$/, '') + '/index.html'), href);
}
console.log('Episode 00 publication: preserved prose and hero, three complete comparison pictures, six responsive assets, metadata/canonical/schema/sitemap/links PASS');

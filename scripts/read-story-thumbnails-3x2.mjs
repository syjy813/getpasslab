import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { beforeFacilityEntryThumbnails } from './read-facility-career-thumbnails.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const component = 'src/components/FacilityCard.astro';
const componentBefore = '096027cd76308a87bf0f399020a2e8433ef724cc761e00fa135f5d163f121501';
const componentAfter = 'a1c1b77928c181a0a7dc37ec4ac1eed3961fde481e561338606ffa7ba1e6b6a2';

// Preserve the two individually approved previews while extending the same
// list-only contract to the remaining seventeen stories. Article / OG and
// historical 4:3 files are not changed.
const originalPreviewRows = [
  {
    id: 'hobyeongbaekma-hotel-despair',
    image: 'hobyeongbaekma-hotel-despair',
    oldLine: "  'hobyeongbaekma-hotel-despair': ['/images/facility-series/list-thumbnails/hobyeongbaekma-hotel-despair.webp', 1448, 1086],\n",
    pngSha: '6c084669bb37ffd5d78a8d306e9d2ab96da133f175ae53b536098436b6e74ae2',
    webpSha: '5e018fc019c7c03f8285db2979e4b8af95008b7aa885d1dcdca5f79c9ab8b6f7',
  },
  {
    id: 'sasugoldae-sauna-hope',
    image: 'sasugoldae-sauna-hope',
    oldLine: '',
    pngSha: '50165b6f83d100023dce67e4536dec96c294536eff5126c2b71a272c78c17b3d',
    webpSha: 'bdb3cf240570f4f9ce45498905f03b35779006c21a9b93406e3e49e41965a0fd',
  },
];
const newRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-23-story-thumbnails-rest-3x2/manifest.json', 'utf8'));
assert.equal(newRelease.rows.length, 17, 'exact remaining 17 story thumbnails');
const listedBefore = new Set([
  'hobyeongbaekma', 'hobyeongbaekma-hotel-hope',
  'hobyeongbaekma-hospital-despair', 'hobyeongbaekma-hospital-hope',
  'hobyeongbaekma-hospital-large-university',
  'hobyeongbaekma-department-store-despair', 'hobyeongbaekma-department-store-hope',
  'hobyeongbaekma-mart-despair', 'hobyeongbaekma-mart-hope', 'sasugoldae',
]);
const extraRows = newRelease.rows.map(row => {
  const oldName = row.id === 'hobyeongbaekma' ? 'hobyeongbaekma-ep0'
    : row.id === 'sasugoldae' ? 'sasugoldae-ep0' : row.id;
  return {
    id: row.id, image: row.id,
    oldLine: listedBefore.has(row.id)
      ? `  '${row.id}': ['/images/facility-series/list-thumbnails/${oldName}.webp', 1448, 1086],\n` : '',
    pngSha: null, webpSha: row.webpSha256, webpBytes: row.bytes,
    source: row.source, sourceSha: row.sourceSha256,
  };
});
export const storyThumbnail3x2Rows = [...originalPreviewRows, ...extraRows].map(row => ({
  ...row,
  newLine: `  '${row.id}': ['/images/facility-series/list-thumbnails-3x2/${row.image}.webp', 1536, 1024],\n`,
  master: row.pngSha ? `facility-assets/story-thumbnails-3x2/${row.image}.png` : null,
  publicFile: `public/images/facility-series/list-thumbnails-3x2/${row.image}.webp`,
  outputFile: `dist/images/facility-series/list-thumbnails-3x2/${row.image}.webp`,
  route: `/facility-management/career/${row.id}/`,
}));
assert.equal(new Set(storyThumbnail3x2Rows.map(row=>row.id)).size, 19, '19 distinct story list thumbnails');
export const storyThumbnail3x2PublicFiles = storyThumbnail3x2Rows.map(row => row.publicFile);
export const storyThumbnail3x2OutputFiles = storyThumbnail3x2Rows.map(row => row.outputFile);
export const storyThumbnail3x2MasterFiles = storyThumbnail3x2Rows.map(row => row.master).filter(Boolean);

// Reverse precisely the 17 new mappings, then verify the exact two-preview
// predecessor hash; undo those original two to retain all older immutability guards.
export function beforeStoryThumbnails3x2(file, bytes) {
  if (file !== component) return bytes;
  let current = beforeFacilityEntryThumbnails(file, bytes).toString('utf8');
  for (const row of storyThumbnail3x2Rows.slice(2)) {
    assert.equal(current.split(row.newLine).length, 2, row.id + ': unique new 3:2 mapping');
    current = current.replace(row.newLine, row.oldLine);
  }
  assert.equal(sha(current), componentAfter, 'exact two-preview predecessor restored');
  for (const row of storyThumbnail3x2Rows.slice(0,2)) {
    assert.equal(current.split(row.newLine).length, 2, row.id + ': original preview retained');
    current = current.replace(row.newLine,row.oldLine);
  }
  assert.equal(sha(current), componentBefore, 'all original story listings preserved');
  return Buffer.from(current);
}

const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
const attr = (node, key) => node?.attrs?.find(entry => entry.name === key)?.value;
const cardFor = (document, route) => nodes(document).find(node => node.tagName === 'a'
  && (attr(node, 'class') || '').split(/\s+/).includes('facility-card') && attr(node, 'href') === route);

export async function assertStoryThumbnails3x2() {
  beforeStoryThumbnails3x2(component, fs.readFileSync(component));
  const { default: sharp } = await import('sharp');
  const stories = parse(fs.readFileSync('dist/facility-management/stories/index.html', 'utf8'));
  const home = parse(fs.readFileSync('dist/facility-management/index.html', 'utf8'));
  for (const row of storyThumbnail3x2Rows) {
    if (row.source) assert.equal(sha(fs.readFileSync(row.source)), row.sourceSha, `${row.id}: source preserved`);
    for (const [file, expected, format] of [
      [row.master, row.pngSha, 'png'], [row.publicFile, row.webpSha, 'webp'], [row.outputFile, row.webpSha, 'webp'],
    ]) {
      if (!file) continue;
      const bytes = fs.readFileSync(file);
      assert.equal(sha(bytes), expected, `${row.id}: approved ${format} bytes (${file})`);
      const meta = await sharp(bytes).metadata();
      assert.deepEqual([meta.format, meta.width, meta.height], [format, 1536, 1024], `${row.id}: 3:2 image`);
      if (format === 'webp') {
        assert(bytes.length < 300_000, `${row.id}: optimized list WebP`);
        if (row.webpBytes) assert.equal(bytes.length, row.webpBytes, `${row.id}: recorded asset size`);
      }
    }
    const expectedSrc = row.publicFile.replace(/^public/, '');
    const cards = [cardFor(stories, row.route), cardFor(home, row.route)].filter(Boolean);
    assert(cards.length >= 1, `${row.id}: visible in stories list`);
    for (const card of cards) {
      const image = nodes(card).find(node => node.tagName === 'img');
      assert.equal(attr(image, 'src'), expectedSrc, `${row.id}: new listing-only image`);
      assert.deepEqual([attr(image, 'width'), attr(image, 'height')], ['1536', '1024'], `${row.id}: intrinsic size`);
    }
    const detail = nodes(parse(fs.readFileSync(`dist${row.route}index.html`, 'utf8')));
    assert(!detail.some(node => node.tagName === 'img' && attr(node, 'src') === expectedSrc), `${row.id}: body image unchanged`);
    assert(!detail.some(node => node.tagName === 'meta' && attr(node, 'property') === 'og:image'
      && attr(node, 'content')?.includes('/list-thumbnails-3x2/')), `${row.id}: social image unchanged`);
  }
}

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';

const sha = value => createHash('sha256').update(value).digest('hex');
const component = 'src/components/FacilityCard.astro';
const componentBefore = '096027cd76308a87bf0f399020a2e8433ef724cc761e00fa135f5d163f121501';
const componentAfter = 'a1c1b77928c181a0a7dc37ec4ac1eed3961fde481e561338606ffa7ba1e6b6a2';

// This release tests two 3:2 list-only previews; the other seventeen story
// entries and every approved original hero, OG image and 4:3 thumbnail stay put.
export const storyThumbnail3x2Rows = [
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
].map(row => ({
  ...row,
  newLine: `  '${row.id}': ['/images/facility-series/list-thumbnails-3x2/${row.image}.webp', 1536, 1024],\n`,
  master: `facility-assets/story-thumbnails-3x2/${row.image}.png`,
  publicFile: `public/images/facility-series/list-thumbnails-3x2/${row.image}.webp`,
  outputFile: `dist/images/facility-series/list-thumbnails-3x2/${row.image}.webp`,
  route: `/facility-management/career/${row.id}/`,
}));
export const storyThumbnail3x2PublicFiles = storyThumbnail3x2Rows.map(row => row.publicFile);
export const storyThumbnail3x2OutputFiles = storyThumbnail3x2Rows.map(row => row.outputFile);
export const storyThumbnail3x2MasterFiles = storyThumbnail3x2Rows.map(row => row.master);

// Reverse only the two reviewed list mappings before old immutable source guards.
export function beforeStoryThumbnails3x2(file, bytes) {
  if (file !== component) return bytes;
  assert.equal(sha(bytes), componentAfter, 'exact two-story-thumbnail source change');
  let current = bytes.toString('utf8');
  for (const row of storyThumbnail3x2Rows) {
    assert.equal(current.split(row.newLine).length, 2, row.id + ': unique 3:2 list mapping');
    current = current.replace(row.newLine, row.oldLine);
  }
  assert.equal(sha(current), componentBefore, 'previous approved story listings preserved');
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
    for (const [file, expected, format] of [
      [row.master, row.pngSha, 'png'], [row.publicFile, row.webpSha, 'webp'], [row.outputFile, row.webpSha, 'webp'],
    ]) {
      const bytes = fs.readFileSync(file);
      assert.equal(sha(bytes), expected, `${row.id}: approved ${format} bytes (${file})`);
      const meta = await sharp(bytes).metadata();
      assert.deepEqual([meta.format, meta.width, meta.height], [format, 1536, 1024], `${row.id}: 3:2 image`);
      if (format === 'webp') assert(bytes.length < 160_000, `${row.id}: optimized list WebP`);
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

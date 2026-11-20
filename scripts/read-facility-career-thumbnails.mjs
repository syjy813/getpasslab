import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';

const component = 'src/components/FacilityCard.astro';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// 2026-11-20 approved, listing-only job analysis thumbnails. The older
// publication guards still compare against their original exact source bytes.
export const careerThumbnailRows = [
  { id: 'hanfms', hash: 'c3d2899923886887a727a029777efb71632abcfe2267a71a459b320c6d56c73a' },
  { id: 'kamcofmc', hash: '2919514325c6cba5da3b0eba8b52559bf917fe658ef122d9a255f4cf4e5a01d7' },
  { id: 'korailtech', hash: '2b88ee903612ddd7a16e6d7ccc351b440d24debbc8ad2e180371f3938f105cd7' },
  { id: 'postal-facilities', hash: '7c7e993cb096c1f0e754a7764262a8cd6d8d46c87260dc6148935a0dc0182db1' },
].map(row => ({
  ...row,
  publicFile: `public/images/facility-career/list-thumbnails/${row.id}.webp`,
  outputFile: `dist/images/facility-career/list-thumbnails/${row.id}.webp`,
  route: `/facility-management/jobs/${row.id}/`,
}));
export const careerThumbnailPublicFiles = careerThumbnailRows.map(row => row.publicFile);
export const careerThumbnailOutputFiles = careerThumbnailRows.map(row => row.outputFile);

// Reconstruct only the four newly approved lines before checking historical
// exact file hashes. Missing or modified mappings still fail the guards.
export function beforeFacilityCareerThumbnails(file, bytes) {
  if (file !== component) return bytes;
  let text = bytes.toString('utf8');
  for (const row of careerThumbnailRows) {
    const line = `  '${row.id}': ['${row.publicFile.replace(/^public/, '')}', 1536, 1024],\n`;
    assert.equal(text.split(line).length, 2, `${file}: exact approved ${row.id} thumbnail mapping`);
    text = text.replace(line, '');
  }
  return Buffer.from(text);
}

const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
const attr = (node, name) => node?.attrs?.find(row => row.name === name)?.value;

export async function assertFacilityCareerThumbnails() {
  const { default: sharp } = await import('sharp');
  const jobs = nodes(parse(fs.readFileSync('dist/facility-management/jobs/index.html', 'utf8')));
  for (const row of careerThumbnailRows) {
    for (const [file, kind] of [[row.publicFile, 'source'], [row.outputFile, 'built']]) {
      const bytes = fs.readFileSync(file);
      assert.equal(sha(bytes), row.hash, `${row.id}: approved ${kind} image bytes`);
      assert(bytes.length < 160_000, `${row.id}: optimized WebP`);
      const meta = await sharp(bytes).metadata();
      assert.deepEqual([meta.format, meta.width, meta.height], ['webp', 1536, 1024], `${row.id}: 3:2 WebP`);
    }
    const card = jobs.find(node => node.tagName === 'a' && attr(node, 'href') === row.route);
    assert(card, `${row.route}: listing card`);
    const img = nodes(card).find(node => node.tagName === 'img');
    assert.equal(attr(img, 'src'), row.publicFile.replace(/^public/, ''), `${row.id}: listing thumbnail`);
    assert.deepEqual([attr(img, 'width'), attr(img, 'height')], ['1536', '1024'], `${row.id}: image aspect reservation`);
    const article = nodes(parse(fs.readFileSync(`dist${row.route}index.html`, 'utf8')));
    assert(!article.some(node => node.tagName === 'meta' && attr(node, 'property') === 'og:image' && attr(node, 'content')?.includes('/facility-career/list-thumbnails/')), `${row.id}: original social image preserved`);
    assert(!article.some(node => node.tagName === 'img' && attr(node, 'src')?.includes('/facility-career/list-thumbnails/')), `${row.id}: original article images preserved`);
  }
}

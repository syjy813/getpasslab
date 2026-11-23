import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';

const component = 'src/components/FacilityCard.astro';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// 2026-11-23 approved contrast refresh of listing-only job analysis thumbnails.
// The older publication guards still compare against their original exact source bytes.
export const careerThumbnailRows = [
  { id: 'hanfms', hash: '06d23f06efdbe503ed8c97963d5d45044fbaa1de6762bc5074d1aeb307ce7cbd' },
  { id: 'kamcofmc', hash: '51ec2f69c43093d424b607a3b932db9e52a06631b323546b14aaff8fafff80dd' },
  { id: 'korailtech', hash: 'ae18863c3d7f3f7a52a61b899062a83d6b9bef80809de9f76c3870277a755f76' },
  { id: 'postal-facilities', hash: '5e88d8dcb28c2818741dc8c3030c3a86dda700dc3a340d5d2577c1f07bc469e6' },
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

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { parse } from 'parse5';

export const bodyThumbnailRemovals = JSON.parse(fs.readFileSync('docs/audits/2026-11-24-facility-body-thumbnails.json', 'utf8'));

// Reinsert the exact deleted image block for existing source fingerprint checks.
export function beforeBodyThumbnailRemoval(file, bytes) {
  const slug = /^src\/content\/facility\/([\w-]+)\.md$/.exec(file)?.[1];
  const row = bodyThumbnailRemovals[slug];
  if (!row) return bytes;
  assert(!bytes.includes(`src="${row.src}"`), `${file}: old cover removed from body`);
  return Buffer.concat([bytes.subarray(0, row.offset), Buffer.from(row.markup), bytes.subarray(row.offset)]);
}

const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node?.attrs?.find(item => item.name === name)?.value;

export function assertBodyThumbnailsRemoved() {
  for (const [slug, row] of Object.entries(bodyThumbnailRemovals)) {
    const file = `src/content/facility/${slug}.md`;
    const original = beforeBodyThumbnailRemoval(file, fs.readFileSync(file));
    assert.equal(createHash('sha256').update(original).digest('hex'), row.beforeSHA256, `${slug}: only the cover block was removed`);

    const page = nodes(parse(fs.readFileSync(`dist${row.route}index.html`, 'utf8')));
    const body = page.find(node => attr(node, 'class')?.split(/\s+/).includes('facility-body'));
    assert(body, `${slug}: article body rendered`);
    assert(!nodes(body).some(node => node.tagName === 'img' && attr(node, 'src') === row.src), `${slug}: old cover absent from rendered body`);
  }
}

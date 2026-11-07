import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const episode00Release = JSON.parse(fs.readFileSync('docs/audits/2026-11-07-hobyeongbaekma-publication/manifest.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function assertEpisode00Release() {
  const draft = fs.readFileSync('docs/drafts/facility/hobyeongbaekma/episode00.md', 'utf8');
  assert.equal(sha(draft), episode00Release.approvedDraftSHA256, 'approved editorial draft preserved');
  const released = draft.replace('status: draft', 'status: published')
    .replace("publishedAt: '2026-11-06'", "publishedAt: '2026-11-07'")
    .replace("updatedAt: '2026-11-06'", "updatedAt: '2026-11-07'");
  assert.equal(fs.readFileSync('src/content/facility/hobyeongbaekma.md', 'utf8'), released, 'only release status and publication dates change');
  for (const [file, hash] of Object.entries(episode00Release.additions)) assert.equal(sha(fs.readFileSync(file)), hash, file);
  const images = JSON.parse(fs.readFileSync('docs/drafts/facility/hobyeongbaekma/image-manifest.json')).images;
  assert.equal(images.length, 7);
  for (const row of images) {
    const file = 'public/images/facility-series/hobyeongbaekma-00/' + row.file.split('/').at(-1);
    assert.equal(sha(fs.readFileSync(file)), row.sha256, 'approved image bytes: ' + row.id);
  }
}

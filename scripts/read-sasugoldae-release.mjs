import {beforePendingRelease,seriesRelease} from './read-pending-release.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {beforeFacilityListLayout} from './read-facility-list-layout.mjs';

export const sasugoldaeRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-sasugoldae-ep00/manifest.json'));
export const sasugoldaeOutputAdditions = [
  'dist' + sasugoldaeRelease.route + 'index.html',
  sasugoldaeRelease.hero.publicFile.replace(/^public/, 'dist'),
];
export const sasugoldaeSourceAdditions = [sasugoldaeRelease.source, sasugoldaeRelease.hero.publicFile];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Restore only the two approved additions before running immutable older guards.
// Every other byte continues to be checked against its original release hash.
export function beforeSasugoldae(file, bytes) {
  bytes=beforePendingRelease(file, bytes);
  bytes = beforeFacilityListLayout(file, bytes);
  const changes = {
    'src/components/FacilityCard.astro': [
      "  'sasugoldae': '/images/facility-series/sasugoldae-00/01-sasugoldae-hero.webp',\n", '',
    ],
    'src/layouts/FacilityArticleLayout.astro': [
      "const showSourceList = !article.id.startsWith('hobyeongbaekma') && article.id !== 'sasugoldae';",
      "const showSourceList = !article.id.startsWith('hobyeongbaekma');",
    ],
  };
  if (!Object.hasOwn(changes, file)) return bytes;
  const [current, previous] = changes[file];
  const text = bytes.toString('utf8');
  assert.equal(text.split(current).length, 2, file + ': exact approved sasugoldae addition');
  return Buffer.from(text.replace(current, previous));
}

export function assertSasugoldaeRelease() {
  assert.equal(sasugoldaeRelease.route, '/facility-management/career/sasugoldae/');
  assert.equal(sasugoldaeRelease.source, 'src/content/facility/sasugoldae.md');
  for (const [file, hash] of [
    [sasugoldaeRelease.source, sasugoldaeRelease.sourceSha256],
    [sasugoldaeRelease.hero.master, sasugoldaeRelease.hero.masterSha256],
    [sasugoldaeRelease.hero.publicFile, sasugoldaeRelease.hero.webpSha256],
  ]) assert.equal(sha(beforePendingRelease(file,fs.readFileSync(file))), hash, file + ': approved sasugoldae release');
}

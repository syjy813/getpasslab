import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const originalRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-07-hobyeongbaekma-publication/manifest.json'));
export const episode00Revision = JSON.parse(fs.readFileSync('docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json'));
export const episode00Release = { ...originalRelease, additions: { ...originalRelease.additions, ...episode00Revision.additions }, layoutBlob: episode00Revision.layoutBlob };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function assertEpisode00Release() {
  const draft = fs.readFileSync('docs/drafts/facility/hobyeongbaekma/episode00.md', 'utf8');
  assert.equal(sha(draft), episode00Release.approvedDraftSHA256, 'approved editorial draft preserved');
  const released = draft.replace('status: draft', 'status: published')
    .replace("publishedAt: '2026-11-06'", "publishedAt: '2026-11-07'")
    .replace("updatedAt: '2026-11-06'", "updatedAt: '2026-11-07'");
  assert.equal(fs.readFileSync(episode00Revision.previousSource, 'utf8'), released, 'original release preserved');
  const revised = released
    .replace("  - title: '호백병마에 대해 알아보자 (2023년)'\n    url: 'https://gall.dcinside.com/board/view/?id=siseol&no=184217'\n    note: '비공식 용어 사용을 확인하는 자료. 글의 시설별 평판·고용형태 주장은 일반화하지 않음'\n", '')
    .replace(' [2023년 시설관리 갤러리의 설명 글](https://gall.dcinside.com/board/view/?id=siseol&no=184217)도 ‘호백병마’라는 이름으로 네 시설을 소개한다.', '')
    .replaceAll('네 시설', '4개의 시설').replaceAll('네 건물', '4개의 시설');
  assert.equal(fs.readFileSync('src/content/facility/hobyeongbaekma.md', 'utf8'), revised, 'only requested editorial changes');
  for (const [file, hash] of Object.entries(episode00Release.additions)) assert.equal(sha(fs.readFileSync(file)), hash, file);
  const images = JSON.parse(fs.readFileSync('docs/drafts/facility/hobyeongbaekma/image-manifest.json')).images;
  assert.equal(images.length, 7);
  for (const row of images) {
    const file = 'public/images/facility-series/hobyeongbaekma-00/' + row.file.split('/').at(-1);
    assert.equal(sha(fs.readFileSync(file)), row.sha256, 'approved image bytes: ' + row.id);
  }
}

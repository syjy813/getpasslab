import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {integratedImageRoot,integrateEpisode00Images,integratedImageStyles} from './hobyeongbaekma-integrated-images.mjs';

const originalRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-07-hobyeongbaekma-publication/manifest.json'));
export const episode00Revision = JSON.parse(fs.readFileSync('docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json'));
export const episode00Integration=JSON.parse(fs.readFileSync(integratedImageRoot+'/manifest.json'));
const originalImages=JSON.parse(fs.readFileSync('docs/drafts/facility/hobyeongbaekma/image-manifest.json')).images;

// The 2026-11-08 image-integration audit is immutable. Allow only the separately
// approved 2026-11-11 editorial continuation while preserving that exact baseline.
export const episode00NextLinkDate = '2026-11-11';
const previousDisclaimer = '*이 글은 공개 커뮤니티에 게시된 경험담과 의견을 검토해 작성했습니다. 확인 가능한 원문 내용을 바탕으로 소개했지만 게시자의 근무 사실은 독립적으로 인증되지 않았으며, 커뮤니티 후기는 전체 시설관리 종사자의 대표 표본이 아닙니다. 조사·교정 기준일: 2026년 11월 6일.*';
const approvedContinuation = [
  '## 다음 편 보기',
  '',
  '이제 첫 번째 시설인 **호텔**을 살펴볼 차례다. 객실 민원과 야간 당직, 업무분장 문제부터 확인해 보자.',
  '',
  '**[호병백마 ep.1-1 절망편] 호텔 시설관리로 취업했는데, 왜 객실 청소까지?**',
  '',
  '[호텔 시설관리 절망편 보러가기](/facility-management/career/hobyeongbaekma-hotel-despair/)'
].join('\n');

export function applyEpisode00NextLink(integrated) {
  const oldDate = "updatedAt: '2026-11-08'";
  const oldRelated = 'related:\n  - what-is-facility-management\n';
  assert.equal(integrated.split(oldDate).length, 2, 'expected prior episode-0 date exactly once');
  assert.equal(integrated.split(oldRelated).length, 2, 'expected prior related links exactly once');
  assert(integrated.endsWith(previousDisclaimer + '\n'), 'expected original disclaimer at end of episode 0');
  return integrated
    .replace(oldDate, "updatedAt: '" + episode00NextLinkDate + "'")
    .replace(oldRelated, 'related:\n  - hobyeongbaekma-hotel-despair\n  - what-is-facility-management\n')
    .replace(previousDisclaimer + '\n', approvedContinuation + '\n');
}
export const episode00Release = { ...originalRelease, additions: { ...originalRelease.additions, ...episode00Revision.additions, ...episode00Integration.additions }, layoutBlob: episode00Revision.layoutBlob,
  outputAdditions:[...originalRelease.outputAdditions,...Object.keys(episode00Integration.additions).filter(file=>file.startsWith('public/')).map(file=>'dist'+file.slice('public'.length))],
  updatedAt:episode00NextLinkDate,facilityStyleBlob:episode00Integration.facilityStyleBlob,
  images:[{...originalImages[0],src:'/images/facility-series/hobyeongbaekma-00/'+originalImages[0].id+'.webp'},...episode00Integration.groups.map(row=>({id:row.id,...row.desktop,mobile:row.mobile,alt:row.alt,count:row.count}))] };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export const approvedBorderlessHeroStyle="\n/* Borderless employment-types cover only: preserve all other facility image frames. */\n.facility-body img[src$=\"/03/01-employment-types-hero.webp\"]{\n  border:0;\n  border-radius:0;\n}\n.facility-card-cover:has(> img[src$=\"/03/01-employment-types-hero.webp\"]){\n  border:0;\n  border-radius:0;\n}\n";
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
  const previous=fs.readFileSync(episode00Integration.previousSource,'utf8');
  assert.equal(previous,revised,'previous editorial release preserved');
  assert.equal(sha(previous),episode00Revision.additions['src/content/facility/hobyeongbaekma.md'],'exact prior released source');
  assert.equal(sha(previous),episode00Integration.previousSourceSHA256);
  const imageIntegrated = integrateEpisode00Images(previous,episode00Integration);
  assert.equal(fs.readFileSync('src/content/facility/hobyeongbaekma.md','utf8'),applyEpisode00NextLink(imageIntegrated),'approved editorial continuation, no unrelated source modifications');
  assert.equal(sha(Buffer.from(imageIntegrated)), episode00Integration.additions['src/content/facility/hobyeongbaekma.md'], 'immutable 2026-11-08 source baseline preserved');
  const blob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(blob(fs.readFileSync(episode00Integration.previousStyle)),episode00Integration.previousStyleBlob,'previous facility CSS preserved');

  const originalFacilityCss=fs.readFileSync(episode00Integration.previousStyle,'utf8')+integratedImageStyles;
  assert.equal(fs.readFileSync('src/styles/facility.css','utf8'),originalFacilityCss+approvedBorderlessHeroStyle,'only scoped complete-sheet and approved borderless hero CSS rules');
  assert.equal(blob(Buffer.from(originalFacilityCss)),episode00Integration.facilityStyleBlob,'original scoped responsive image rules preserved');
  assert.equal(sha(Buffer.from(originalFacilityCss)),episode00Integration.facilityStyleSHA256);
  assert.deepEqual(episode00Integration.groups.map(row=>[row.id,row.count]),[['02-four-workplaces',4],['03-why-hard',4],['05-before-applying',6]]);
  for(const row of episode00Integration.groups){
    assert.equal(sha(fs.readFileSync(row.spec)),row.specSHA256,'preserved approved card data');
    for(const viewport of ['desktop','mobile']){
      const image=row[viewport];
      assert.equal(sha(fs.readFileSync(image.master)),image.masterSHA256,'editable combined image master');
      assert.equal(sha(fs.readFileSync(image.pngMaster)),image.pngSHA256,'PNG master preserved');
      assert.equal(sha(fs.readFileSync(image.file)),image.sha256,'approved combined image WebP');
    }
  }
  for (const [file, hash] of Object.entries(episode00Release.additions)) {
    // Compare the historical approved source to its frozen hash, not the newly edited article.
    if (file === 'src/content/facility/hobyeongbaekma.md') continue;
    assert.equal(sha(fs.readFileSync(file)), hash, file);
  }
  const images = JSON.parse(fs.readFileSync('docs/drafts/facility/hobyeongbaekma/image-manifest.json')).images;
  assert.equal(images.length, 7);
  for (const row of images) {
    const file = 'public/images/facility-series/hobyeongbaekma-00/' + row.file.split('/').at(-1);
    assert.equal(sha(fs.readFileSync(file)), row.sha256, 'approved image bytes: ' + row.id);
  }
}

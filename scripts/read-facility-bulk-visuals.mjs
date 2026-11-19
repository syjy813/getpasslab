import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/audits/2026-11-06-facility-image-bulk/';
export const bulkVisuals=JSON.parse(fs.readFileSync(root+'manifest.json'));
const sha=b=>createHash('sha256').update(b).digest('hex');
// Only the approved 2026-11-19 editorial corrections may differ from the reviewed
// 2026-11-06 image-only sources. Reverse them exactly before baseline checks.
const approvedEditorialReversals = {
  "src/content/facility/mechanical-career-records.md": [
    [
      "updatedAt: '2026-11-19'",
      "updatedAt: '2026-11-05'"
    ],
    [
      "alt=\"경력확인서 직인 기준: 보험 사업자명이 발주자면 발주자 직인, 위탁업체면 위탁업체 직인. 위탁업체 소속자가 발주자 직인을 받는 경우 계약관계 증빙 제출 시 조건부 인정\"",
      "alt=\"경력확인서 직인 주체: 발주자 소속 보험 사업자명: 발주자, 위탁업체 소속 보험 사업자명: 위탁업체, 위탁업체 소속 직인: 발주자\""
    ]
  ],
  "src/content/facility/kamcofmc.md": [
    [
      "updatedAt: '2026-11-19'",
      "updatedAt: '2026-11-05'"
    ],
    [
      "- title: 캠코FMC 2026년 하반기 현장직 2차 공식 공고\n  url: https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=248\n  note: 2026-08-05 게시·08-19 접수 마감 · 2026-11-05 재대조\n- title: 캠코FMC 2027년 상반기 일반직 및 현장직 채용 공고\n  url: https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=252\n  note: 2026-11-10 게시 · 2026-11-19 확인; 아래 2026년 8월 사례와 별도 회차",
      "- title: 캠코FMC 2026년 하반기 현장직 2차 공식 공고\n  url: https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=248\n  note: 2026-08-05 게시·08-19 접수 마감 · 2026-11-05 재대조"
    ],
    [
      "*위 금액은 [2026년 8월 5일 ‘하반기 현장직 2차’ 모집공고](https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=248)에 제시된 세전 월 급여 수준으로, 당시 채용 사례다. 이 공고의 접수는 2026년 8월 19일 종료됐다.*\n\n**최신 공고 안내(2026년 11월 19일 확인):** 캠코FMC는 [2027년 상반기 일반직 및 현장직 채용 공고](https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=252)를 별도로 게시했다. 아래의 직급·급여·사업소 사례는 **2026년 8월 종료된 공고 기준**이므로, 신규 공고에 그대로 적용하지 말고 공식 모집표를 확인해야 한다.",
      "*위 금액은 [2026년 8월 5일 ‘하반기 현장직 2차’ 모집공고](https://www.kamcofmc.co.kr/bbs/board.php?bo_table=s4_3&wr_id=248)에 제시된 세전 월 급여 수준으로, 당시 채용 사례다. 이 공고의 접수는 2026년 8월 19일 종료됐다.*"
    ]
  ]
};
function removeApprovedEditorialCorrections(file,bytes){
  const reversals=approvedEditorialReversals[file];if(!reversals)return bytes;
  let value=bytes.toString('utf8');
  for(const [current,previous] of reversals){
    assert.equal(value.split(current).length,2,file+': exact approved editorial correction');
    value=value.replace(current,previous);
  }
  return Buffer.from(value,'utf8');
}

export const bulkOutput=row=>'dist'+row.publicPath;
export function beforeBulkVisuals(file,bytes){
 const row=bulkVisuals.source[file];if(!row)return bytes;
 assert.equal(sha(removeApprovedEditorialCorrections(file,bytes)),row.sha256,file+': reviewed image-only article plus approved editorial correction');
 const previous=fs.readFileSync(row.previous);assert.equal(sha(previous),row.beforeSHA256,file+': preserved source');return previous;
}
const withoutImages=s=>s.replace(/<figure><img[^>]*><\/figure>|!\[[^\]]*\]\([^)]*\)/g,'').split('\n').filter(l=>l.trim()).join('\n');
export function assertBulkVisuals(){
 for(const [file,row] of Object.entries(bulkVisuals.source)){
  const current=fs.readFileSync(file),before=beforeBulkVisuals(file,current);
  assert.equal(withoutImages(removeApprovedEditorialCorrections(file,current).toString()),withoutImages(before.toString()),file+': exact original prose/frontmatter/links except approved editorial correction');
 }
 for(const [file,hash] of Object.entries(bulkVisuals.dependencies))assert.equal(sha(fs.readFileSync(file)),hash,file+': reviewed renderer dependency');
 const paths=new Set();for(const row of bulkVisuals.images){
  assert(!paths.has(row.publicPath),'unique serving URL');paths.add(row.publicPath);
  assert(!row.publicPath.includes('/05/'),'protected public-sector reference untouched');
  assert.equal(sha(fs.readFileSync(row.file)),row.sha256,row.file);
  assert.equal(sha(fs.readFileSync(row.master)),row.masterSHA256,row.master);
 }
}

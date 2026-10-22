// Exact inverse used only by historical release checks; current checks use
// native bytes. Unknown files and mutations are never projected away.
import assert from 'node:assert/strict';
import {readFile as nativeRead,readdir as nativeReaddir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {beforeStandardizedPractice} from './fire-mock-authoring/standardization.mjs';
const audit='docs/audits/2026-10-20-fire-persona-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
// Source-grounded exam-point revision, limited to one chapter and its scoped CSS.
// Pin native and restored full bytes; retain every previous historical baseline.
const gradeExamPointFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "720281f8ffb60da5808abf2ac94fd17045f26f711e340363289ebc4a4affa2e4",
    "beforeSHA256": "486522ab372d0b135e8bed5bd185a2320c83b6dfa4443a81904fc173fa409e4c",
    "at": 352,
    "current": "?v=fire-grade-20261022\">\n\n## 등급을 판별하는 순서\n용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 **가장 높은 등급** 적용\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n\n## 시험 포인트\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>",
    "before": "\">\n\n## 등급을 판별하는 순서\n용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 **가장 높은 등급** 적용\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상<br>아파트 외 30층 이상 또는 120m 이상<br>아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외<br>아파트 30층 이상 또는 120m 이상<br>아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상<br>가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외<br>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)<br>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만<br>지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외<br>간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>\n\n## 조건에 붙는 단서\n- 특급의 아파트 외 **30층은 지하층 포함** · 1급의 11층은 지상층 기준\n- 면적 기준에서 아파트 제외 여부를 먼저 확인 · 1급의 연면적 기준은 아파트·연립주택 제외 · 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급에서 제외\n- 주택전용 간이스프링클러는 3급 판정의 간이스프링클러에서 제외\n- 국보·보물로 지정된 목조건축물도 2급 대상 조건에 포함\n\n예: 비아파트 건축물이 지상 12층이고 연면적 8천㎡이면 지상층 조건으로 1급 판단 · 비아파트 30층 조건을 1급으로 읽지 않음"
  },
  "public/styles/fire-bulk-visual.css": {
    "sha256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "beforeSHA256": "687669282e6b99ad2a7f13f121c9f390df0bfbe13a41c2daecb6d21d90a4a08f",
    "at": 2143,
    "current": "\narticle ul.fire-grade-conditions{margin:0;padding-left:1em;list-style-type:disc}\narticle ul.fire-grade-conditions>li{padding-left:.1em;margin:0;font-size:inherit;color:inherit}\narticle ul.fire-grade-conditions>li+li{margin-top:.4em}\narticle ul.fire-grade-conditions>li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-scope-note{font-size:var(--fs-caption);color:var(--gray-700);line-height:1.7}\narticle .fire-grade-exam-points{padding:18px 20px;border:1px solid var(--gray-200);border-radius:var(--radius-md);background:var(--gray-50)}\narticle .fire-grade-exam-points ul{margin:0;padding-left:1em;list-style-type:disc}\narticle .fire-grade-exam-points li{margin:0;padding-left:.15em}\narticle .fire-grade-exam-points li+li{margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-200)}\narticle .fire-grade-exam-points li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-exam-points strong{color:var(--gray-900)}\narticle .fire-grade-exam-points p{margin:6px 0 0;color:var(--gray-700);line-height:1.75}\n",
    "before": ""
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "dad443251af3a2a6eef04d81e0aa5a115961a745907dd1b3e5df88b224ab66fb",
    "beforeSHA256": "b9b4c69b4b72d0a01dc0612b91adffc29c47f07673ddb8539c2fc45f7e4072dd",
    "at": 21808,
    "current": "?v=fire-grade-20261022\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div",
    "before": "\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상<br>아파트 외 30층 이상 또는 120m 이상<br>아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외<br>아파트 30층 이상 또는 120m 이상<br>아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상<br>가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외<br>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)<br>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만<br>지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외<br>간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>\n<h2 id=\"조건에-붙는-단서\">조건에 붙는 단서</h2>\n<ul>\n<li>특급의 아파트 외 <strong>30층은 지하층 포함</strong> · 1급의 11층은 지상층 기준</li>\n<li>면적 기준에서 아파트 제외 여부를 먼저 확인 · 1급의 연면적 기준은 아파트·연립주택 제외 · 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급에서 제외</li>\n<li>주택전용 간이스프링클러는 3급 판정의 간이스프링클러에서 제외</li>\n<li>국보·보물로 지정된 목조건축물도 2급 대상 조건에 포함</li>\n</ul>\n<p>예: 비아파트 건축물이 지상 12층이고 연면적 8천㎡이면 지상층 조건으로 1급 판단 · 비아파트 30층 조건을 1급으로 읽지 않음</p"
  },
  "dist/styles/fire-bulk-visual.css": {
    "sha256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "beforeSHA256": "687669282e6b99ad2a7f13f121c9f390df0bfbe13a41c2daecb6d21d90a4a08f",
    "at": 2143,
    "current": "\narticle ul.fire-grade-conditions{margin:0;padding-left:1em;list-style-type:disc}\narticle ul.fire-grade-conditions>li{padding-left:.1em;margin:0;font-size:inherit;color:inherit}\narticle ul.fire-grade-conditions>li+li{margin-top:.4em}\narticle ul.fire-grade-conditions>li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-scope-note{font-size:var(--fs-caption);color:var(--gray-700);line-height:1.7}\narticle .fire-grade-exam-points{padding:18px 20px;border:1px solid var(--gray-200);border-radius:var(--radius-md);background:var(--gray-50)}\narticle .fire-grade-exam-points ul{margin:0;padding-left:1em;list-style-type:disc}\narticle .fire-grade-exam-points li{margin:0;padding-left:.15em}\narticle .fire-grade-exam-points li+li{margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-200)}\narticle .fire-grade-exam-points li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-exam-points strong{color:var(--gray-900)}\narticle .fire-grade-exam-points p{margin:6px 0 0;color:var(--gray-700);line-height:1.75}\n",
    "before": ""
  }
};
export function beforeGradeExamPoints(file,bytes){
  const row=gradeExamPointFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact source-grounded exam-point revision');
  const text=bytes.toString('utf8');
  assert.equal(text.slice(row.at,row.at+row.current.length),row.current,'exact exam-point delta');
  const before=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-exam-point document');
  return before;
}
// This layout-only revision changes nine separators to line breaks in one
// grade table. Both complete native files and restored files are fingerprinted.
const gradeTableBefore = "<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상 · 아파트 외 30층 이상 또는 120m 이상 · 아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외 · 아파트 30층 이상 또는 120m 이상 · 아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상 · 가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외 · 옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외) · 도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만 · 지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외 · 간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>";
const gradeTableCurrent = gradeTableBefore.replaceAll(' · ','<br>');
const gradeTableFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "486522ab372d0b135e8bed5bd185a2320c83b6dfa4443a81904fc173fa409e4c",
    "beforeSHA256": "d0254349f42445b1f8572c34ab3022e76de72302c96a33fc30262d97f6fd2570"
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "b9b4c69b4b72d0a01dc0612b91adffc29c47f07673ddb8539c2fc45f7e4072dd",
    "beforeSHA256": "7999e5b35f0f7957cfccfeaffacf3260ecdd5d985a30726d8e29ce2573b938ab"
  }
};
export function beforeGradeTableFormatting(file,bytes){
  bytes=beforeGradeExamPoints(file,bytes);
  const row=gradeTableFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact grade table formatting');
  const text=bytes.toString('utf8');
  assert.equal(text.split(gradeTableCurrent).length,2,'exactly one formatted grade table');
  const before=Buffer.from(text.replace(gradeTableCurrent,gradeTableBefore));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-formatting text and document');
  return before;
}
// Fingerprinted UI deltas are reversed before archived source/HTML checks.
// Every current and restored document must match its complete SHA, so unrelated
// edits cannot disappear behind a structural regex or a changed baseline.
export function beforeQuestionFlow(file,bytes){
  bytes=beforeGradeTableFormatting(file,bytes);
  // Remove only the stale preparation notice; preserve archived config hashes.
  if(path.normalize(String(file))==='src/config/certifications.ts'){
    assert.equal(hash(bytes),'8c3cdee1b7bdf3bfe37c03a9bf4586875d82676bb385ffb2b46aedb98e6def07','exact fire notice removal');
    const before=Buffer.from(bytes.toString('utf8').replace("releaseNotice: '이론·실무 74개 챕터',","releaseNotice: '이론·실무 74개 챕터 · 문제풀이는 준비 중',"));
    assert.equal(hash(before),'b0db03f073cb9cecf096cbe8544dae1cadbc995faaf66a20e96b93b1fed66ed5','exact pre-notice config');
    return before;
  }
  bytes=beforeStandardizedPractice(file,bytes);
  const row=release.questionFlowProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact question flow UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-question flow document');
  return before;
}
export function beforePracticePolish(file,bytes){
  bytes=beforeQuestionFlow(file,bytes);
  const row=release.practicePolishProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact practice polish UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-practice polish document');
  return before;
}
export function beforeReview(file,bytes){
  bytes=beforePracticePolish(file,bytes);
  const row=release.reviewProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact readability UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-readability document');
  return before;
}
export function beforePopup(file,bytes){
  bytes=beforeReview(file,bytes);
  const row=release.popupProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact popup UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-popup document');
  return before;
}
// Publishing changes only the entry's count. Check both full documents, then
// restore that one exact label for archived lessons; unknown mutations fail.
export function beforePublishedChapterCount(file,bytes){
  bytes=beforePopup(file,bytes);
  const row=release.publicationEntryCounts?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.publishedSHA256,String(file)+': exact published chapter document');
  const html=bytes.toString('utf8');
  const projected=html.replace(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/,section=>{
    const label=new RegExp('(<small[^>]*>)'+row.count+'문제(<\\/small>)');
    assert(label.test(section),String(file)+': actual chapter count');
    return section.replace(label,'$1문제 준비 중$2');
  });
  const before=Buffer.from(projected);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-publication document');
  return before;
}
export async function readdir(dir,options){
  const entries=await nativeReaddir(dir,options);
  const result=[];
  for(const entry of entries){
    const name=typeof entry==='string'?entry:entry.name;
    const row=release.files.find(r=>r.added&&r.path===path.join(String(dir),name));
    if(row)assert.equal(hash(await nativeRead(row.path)),row.sha256,row.path+': exact integrated main addition');
    else result.push(entry);
  }
  return result;
}
export async function readFile(file,encoding){
  let bytes=beforePublishedChapterCount(file,await nativeRead(file));
  const row=release.files.find(r=>r.path===path.normalize(String(file)));
  if(row){
    assert.equal(hash(bytes),row.sha256,String(file)+': exact current persona correction');
    if(row.originalFile){
      bytes=await nativeRead(row.originalFile);
      assert.equal(hash(bytes),row.originalSha256,String(file)+': exact historical input');
    }
  }
  return encoding?bytes.toString(encoding):bytes;
}

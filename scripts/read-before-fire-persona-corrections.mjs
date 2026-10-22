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

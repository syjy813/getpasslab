// Exact inverse used only by historical release checks; current checks use
// native bytes. Unknown files and mutations are never projected away.
import assert from 'node:assert/strict';
import {readFile as nativeRead,readdir as nativeReaddir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-20-fire-persona-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
// Fingerprinted UI deltas are reversed before archived source/HTML checks.
// Every current and restored document must match its complete SHA, so unrelated
// edits cannot disappear behind a structural regex or a changed baseline.
export function beforeReview(file,bytes){
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

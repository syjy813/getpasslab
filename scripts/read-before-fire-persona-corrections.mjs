// Exact inverse used only by historical release checks; current checks use
// native bytes. Unknown files and mutations are never projected away.
import assert from 'node:assert/strict';
import {readFile as nativeRead,readdir as nativeReaddir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-20-fire-persona-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
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
  let bytes=await nativeRead(file);
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

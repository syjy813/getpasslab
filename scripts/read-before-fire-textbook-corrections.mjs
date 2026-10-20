// Exact projection for archived checks; the current checker reads native bytes.
import assert from 'node:assert/strict';
import {readFile as nativeRead, readdir} from './read-before-fire-practice.mjs';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-18-fire-level2-textbook-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
export {readdir};
export async function readFile(file,encoding){
 let bytes=await nativeRead(file);
 const row=release.files.find(r=>r.path===path.normalize(String(file)));
 if(row){
  assert.equal(hash(bytes),row.sha256,String(file)+': exact textbook correction bytes');
  bytes=await nativeRead(row.originalFile);
  assert.equal(hash(bytes),row.originalSha256,String(file)+': exact pre-correction bytes');
 }
 return encoding?bytes.toString(encoding):bytes;
}

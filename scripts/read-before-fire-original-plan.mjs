// Latest release projection: only complete fingerprinted files can be restored or hidden.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const originalPlanReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-fire-original-plan/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const key=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFireOriginalPlan(file,bytes){
 const row=originalPlanReview.changes[key(file)];if(!row||hash(bytes)!==row.sha256)return bytes;
 let before=bytes;
 for(const patch of [...row.patches].reverse()){
  const current=Buffer.from(originalPlanReview.chunks[patch.current],'base64');
  const old=Buffer.from(originalPlanReview.chunks[patch.before],'base64');
  assert(before.subarray(patch.at,patch.at+current.length).equals(current),'exact original-plan delta');
  before=Buffer.concat([before.subarray(0,patch.at),old,before.subarray(patch.at+current.length)]);
 }
 assert.equal(hash(before),row.beforeSHA256,'exact original-plan predecessor');return before;
}
export function isFireOriginalPlanAddition(file){
 const expected=originalPlanReview.additions[key(file)];if(!expected)return false;
 assert.equal(hash(fs.readFileSync(file)),expected,String(file)+': exact original-plan addition');return true;
}
const encode=(data,options)=>{const enc=typeof options==='string'?options:options?.encoding;return enc?data.toString(enc):data;};
export default {...fs,
 readFileSync(file,options){return encode(beforeFireOriginalPlan(file,fs.readFileSync(file)),options);},
 readdirSync(dir,options){return fs.readdirSync(dir,options).filter(e=>!isFireOriginalPlanAddition(path.join(String(dir),typeof e==='string'?e:e.name)));}
};

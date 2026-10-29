// Project only the exact reviewed shared-practice UI delta for historical audits.
import fs, { beforeServiceSplit } from './read-before-service-split.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const practiceUIReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-29-practice-ui-alignment/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforePracticeUIAlignment(file,bytes){
 bytes=beforeServiceSplit(file,bytes);
 const key=path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file));
 const row=practiceUIReview.changes[key];if(!row||hash(bytes)!==row.sha256)return bytes;
 let before=bytes;
 for(const p of [...row.patches].reverse()){
  const current=Buffer.from(practiceUIReview.chunks[p.current],'base64'),old=Buffer.from(practiceUIReview.chunks[p.before],'base64');
  assert(before.subarray(p.at,p.at+current.length).equals(current),'exact practice UI patch');
  before=Buffer.concat([before.subarray(0,p.at),old,before.subarray(p.at+current.length)]);
 }
 assert.equal(hash(before),row.beforeSHA256,'exact pre-alignment bytes');return before;
}
export default {...fs,readFileSync(file,options){
 const data=beforePracticeUIAlignment(file,fs.readFileSync(file));
 const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):data;
}};

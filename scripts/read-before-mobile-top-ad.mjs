// Project only this reviewed advertisement release for archived regression checks.
// Unknown bytes pass through unchanged and remain visible to the native guards.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const mobileTopAdReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-mobile-top-ad/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeMobileTopAd(file,bytes){
  const key=path.normalize(String(file)),row=mobileTopAdReview.files[key];
  if(!row||hash(bytes)!==row.sha256)return bytes;
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].sort((a,b)=>b.at-a.at)){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,key+': exact mobile ad delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const restored=Buffer.from(text);assert.equal(hash(restored),row.beforeSHA256,key+': complete prior bytes');return restored;
}

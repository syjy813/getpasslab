// Historical release checks only: invert the exact reviewed UI delta.
// Current source, HTML, article and asset integrity is checked independently.
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const mobileUXReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-26-mobile-learning-ux/review.json.gz')).toString('utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeMobileLearningUX(file,bytes){
  const key=path.normalize(String(file)),row=mobileUXReview.files[key];
  if(!row||hash(bytes)===row.beforeSHA256)return bytes;
  assert.equal(hash(bytes),row.sha256,key+': exact mobile UI revision');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    const current=mobileUXReview.chunks[patch.current],before=mobileUXReview.chunks[patch.before];
    assert.equal(text.slice(patch.at,patch.at+current.length),current,key+': exact mobile UI delta');
    text=text.slice(0,patch.at)+before+text.slice(patch.at+current.length);
  }
  const restored=Buffer.from(text);
  assert.equal(hash(restored),row.beforeSHA256,key+': full prior document');
  return restored;
}

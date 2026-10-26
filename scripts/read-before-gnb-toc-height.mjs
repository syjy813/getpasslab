// Historical readers invert only the exact reviewed height/style reference delta.
// Unrecognized bytes remain visible; the native height guard and prior guards reject them.
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const gnbTOCHeightReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-26-gnb-toc-height/review.json.gz')).toString('utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeGNBTOCHeight(file,bytes){
 const key=path.normalize(String(file)),row=gnbTOCHeightReview.files[key];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 let text=bytes.toString('utf8');
 for(const patch of [...row.patches].reverse()){
  const current=gnbTOCHeightReview.chunks[patch.current],before=gnbTOCHeightReview.chunks[patch.before];
  assert.equal(text.slice(patch.at,patch.at+current.length),current,key+': exact height delta');
  text=text.slice(0,patch.at)+before+text.slice(patch.at+current.length);
 }
 const restored=Buffer.from(text);assert.equal(hash(restored),row.beforeSHA256,key+': complete previous bytes');return restored;
}

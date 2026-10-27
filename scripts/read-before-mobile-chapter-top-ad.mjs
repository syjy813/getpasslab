// Restore only this exact reviewed chapter-ad insertion for archived guards.
// Native chapter-ad checks validate all current source and HTML independently.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {beforeFirePriorityChapters} from './read-before-fire-priority-chapters.mjs';
export const mobileChapterAdReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-mobile-chapter-top-ad/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeMobileChapterTopAd(file,bytes){
 bytes=beforeFirePriorityChapters(file,bytes);
 const key=path.normalize(String(file)),row=mobileChapterAdReview.files[key];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 let text=bytes.toString();
 for(const p of [...row.patches].sort((a,b)=>b.at-a.at)){
  assert.equal(text.slice(p.at,p.at+p.current.length),p.current,key+': exact chapter ad insertion');
  text=text.slice(0,p.at)+p.before+text.slice(p.at+p.current.length);
 }
 const restored=Buffer.from(text);assert.equal(hash(restored),row.beforeSHA256,key+': complete prior bytes');return restored;
}

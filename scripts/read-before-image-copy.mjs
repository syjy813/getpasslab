import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const imageCopyReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-31-image-copy/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeImageCopy(file,bytes){
 const key=path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file));
 const row=imageCopyReview.changes[key];if(!row||hash(bytes)!==row.sha256)return bytes;
 let old=bytes;
 for(const p of [...row.patches].reverse()){
  const now=Buffer.from(imageCopyReview.chunks[p.current],'base64'),before=Buffer.from(imageCopyReview.chunks[p.before],'base64');
  assert(old.subarray(p.at,p.at+now.length).equals(now),'exact image copy delta');
  old=Buffer.concat([old.subarray(0,p.at),before,old.subarray(p.at+now.length)]);
 }
 assert.equal(hash(old),row.beforeSHA256,'exact image copy predecessor');return old;
}

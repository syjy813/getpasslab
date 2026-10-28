// Restore only the exact reviewed presentation change for historical checks.
import fs from './read-before-fire-practice-phase2.mjs';
import {beforeMobileTOCWidth} from './read-before-mobile-toc-width.mjs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const imageCopyReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-fire-image-copy/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const keyFor=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFireImageCopy(file,bytes){
 bytes=beforeMobileTOCWidth(file,bytes);
 const row=imageCopyReview.changes[keyFor(file)];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 const before=Buffer.from(row.before,'base64');
 assert.equal(hash(before),row.beforeSHA256,'exact image-copy predecessor');return before;
}
const encode=(data,options)=>{const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):data;};
export default {...fs,readFileSync(file,options){return encode(beforeFireImageCopy(file,fs.readFileSync(file)),options);}};
export async function readFile(file,options){return encode(beforeFireImageCopy(file,await fsp.readFile(file)),options);}

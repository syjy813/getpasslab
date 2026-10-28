// Historical readers restore only the reviewed footer alignment CSS and stylesheet URLs.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const footerLeftReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-footer-left/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const keyFor=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFooterLeft(file,bytes){
 const row=footerLeftReview.changes[keyFor(file)];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 let restored=bytes.toString();
 for(const patch of [...row.patches].reverse()){
  const current=footerLeftReview.chunks[patch.current],before=footerLeftReview.chunks[patch.before];
  assert.equal(restored.slice(patch.at,patch.at+current.length),current,'exact reviewed stylesheet delta');
  restored=restored.slice(0,patch.at)+before+restored.slice(patch.at+current.length);
 }
 const before=Buffer.from(restored);
 assert.equal(hash(before),row.beforeSHA256,'exact footer predecessor');return before;
}
const encode=(data,options)=>{const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):data;};
export default {...fs,readFileSync(file,options){return encode(beforeFooterLeft(file,fs.readFileSync(file)),options);}};
export async function readFile(file,options){return encode(beforeFooterLeft(file,await fsp.readFile(file)),options);}

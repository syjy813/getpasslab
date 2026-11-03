// Historical views only. Unknown bytes are never projected away.
import fs from 'node:fs';
import {isFacilityAddition} from './read-before-facility-launch.mjs';
import {beforeImageCopy} from './read-before-image-copy.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const certificationUIReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-29-certification-discovery/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const key=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeCertificationDiscovery(file,bytes){
 bytes=beforeImageCopy(file,bytes);
 const row=certificationUIReview.changes[key(file)];if(!row||hash(bytes)!==row.sha256)return bytes;
 let old=bytes;
 for(const p of [...row.patches].reverse()){
  const now=Buffer.from(certificationUIReview.chunks[p.current],'base64'),before=Buffer.from(certificationUIReview.chunks[p.before],'base64');
  assert(old.subarray(p.at,p.at+now.length).equals(now),'exact certification UI delta');
  old=Buffer.concat([old.subarray(0,p.at),before,old.subarray(p.at+now.length)]);
 }
 assert.equal(hash(old),row.beforeSHA256,'complete main baseline restored');return old;
}
export const isCertificationAddition=file=>{
 if(isFacilityAddition(file))return true;
 const expected=certificationUIReview.additions[key(file)];if(!expected)return false;
 assert.equal(hash(fs.readFileSync(file)),expected,'exact reviewed addition');return true;
};
export default {...fs,
 readFileSync(file,options){
  const removed=certificationUIReview.removedBundles[key(file)];
  const raw=removed&&!fs.existsSync(file)?Buffer.from(certificationUIReview.chunks[removed],'base64'):fs.readFileSync(file);
  const bytes=beforeCertificationDiscovery(file,raw),encoding=typeof options==='string'?options:options?.encoding;return encoding?bytes.toString(encoding):bytes;
 },
 readdirSync(dir,options){return fs.readdirSync(dir,options).filter(e=>!isCertificationAddition(path.join(String(dir),typeof e==='string'?e:e.name)));}
};

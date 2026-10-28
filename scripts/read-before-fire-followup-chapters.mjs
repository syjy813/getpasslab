// Latest release projection: only complete fingerprinted files can be restored or hidden.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const followupReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-fire-followup-chapters/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const key=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFireFollowup(file,bytes){
 const row=followupReview.changes[key(file)];if(!row||hash(bytes)!==row.sha256)return bytes;
 assert.equal(row.beforeEncoding,'utf8');
 const before=Buffer.from(row.before,'utf8');assert.equal(hash(before),row.beforeSHA256,'exact followup predecessor');return before;
}
export function isFireFollowupAddition(file){
 const expected=followupReview.additions[key(file)];if(!expected)return false;
 assert.equal(hash(fs.readFileSync(file)),expected,String(file)+': exact followup addition');return true;
}
const encode=(data,options)=>{const enc=typeof options==='string'?options:options?.encoding;return enc?data.toString(enc):data;};
export default {...fs,
 readFileSync(file,options){return encode(beforeFireFollowup(file,fs.readFileSync(file)),options);},
 readdirSync(dir,options){return fs.readdirSync(dir,options).filter(e=>!isFireFollowupAddition(path.join(String(dir),typeof e==='string'?e:e.name)));}
};

// Restore only fingerprinted facility launch changes for older regression checks.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const facilityReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-31-facility-launch/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const key=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f)).replaceAll('\\','/');
export function beforeFacilityLaunch(file,bytes){
 const row=facilityReview.changes[key(file)];if(!row||hash(bytes)!==row.sha256)return bytes;
 let old=bytes;for(const p of [...row.patches].reverse()){
  const now=Buffer.from(facilityReview.chunks[p.current],'base64'),before=Buffer.from(facilityReview.chunks[p.before],'base64');
  assert(old.subarray(p.at,p.at+now.length).equals(now),'exact facility delta');
  old=Buffer.concat([old.subarray(0,p.at),before,old.subarray(p.at+now.length)]);
 }
 assert.equal(hash(old),row.beforeSHA256,key(file)+': complete predecessor');return old;
}
export function isFacilityAddition(file){
 const k=key(file); const rows=Object.entries(facilityReview.additions).filter(([p])=>p===k||p.startsWith(k+'/'));
 if(facilityReview.beforeInventory.some(p=>p===k||p.startsWith(k+'/'))||!rows.length)return false;
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 const files=fs.statSync(k).isDirectory()?walk(k):[k];
 assert.deepEqual(files.sort(),rows.map(([p])=>p).sort(),k+': exact addition inventory');
 for(const [p,sha] of rows)assert.equal(hash(fs.readFileSync(p)),sha,p+': reviewed addition');return true;
}

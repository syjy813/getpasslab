// Only exact reviewed changes/additions are hidden from historical release views.
import fs, {beforeFirePreactionCopy} from './read-before-fire-preaction-copy.mjs';
import {isFireFollowupAddition} from './read-before-fire-followup-chapters.mjs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const phase2Review=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-fire-practice-phase2/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const key=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFirePracticePhase2(file,bytes){
 bytes=beforeFirePreactionCopy(file,bytes);
 const row=phase2Review.changes[key(file)];if(!row||hash(bytes)!==row.sha256)return bytes;
 const before=Buffer.from(row.before,'base64');assert.equal(hash(before),row.beforeSHA256,'exact phase2 predecessor');return before;
}
export function isFirePracticePhase2Addition(file){
 if(isFireFollowupAddition(file))return true;
 const expected=phase2Review.additions[key(file)];if(!expected)return false;
 assert.equal(hash(fs.readFileSync(file)),expected,String(file)+': reviewed addition');return true;
}
const filter=(dir,entries)=>entries.filter(e=>!isFirePracticePhase2Addition(path.join(String(dir),typeof e==='string'?e:e.name)));
const encode=(data,options)=>{const enc=typeof options==='string'?options:options?.encoding;return enc?data.toString(enc):data;};
export default {...fs,readFileSync(file,options){return encode(beforeFirePracticePhase2(file,fs.readFileSync(file)),options);},readdirSync(dir,options){return filter(dir,fs.readdirSync(dir,options));}};
export async function readFile(file,options){return encode(beforeFirePracticePhase2(file,await fsp.readFile(file)),options);}
export async function readdir(dir,options){return filter(dir,await fsp.readdir(dir,options));}

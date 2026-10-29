// Invert only fingerprinted five-chapter changes for earlier release checks.
import fs, {isFirePracticePhase2Addition} from './read-before-fire-practice-phase2.mjs';
import {beforeFireImageCopy} from './read-before-fire-image-copy.mjs';
import fsp from 'node:fs/promises';
import {readdir as readdirBeforeServiceSplit} from './read-before-service-split.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const fivePanelReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-fire-five-full-panels/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const keyFor=f=>path.normalize(path.isAbsolute(String(f))?path.relative(process.cwd(),String(f)):String(f));
export function beforeFireFivePanels(file,bytes){
 bytes=beforeFireImageCopy(file,bytes);
 const row=fivePanelReview.changes[keyFor(file)];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 const before=Buffer.from(row.before,'base64');
 assert.equal(hash(before),row.beforeSHA256,'exact five-panel predecessor');return before;
}
export function isFireFivePanelAddition(file){
 if(isFirePracticePhase2Addition(file))return true;
 const expected=fivePanelReview.additions[keyFor(file)];if(!expected)return false;
 assert.equal(hash(fs.readFileSync(file)),expected,String(file)+': reviewed image addition');return true;
}
const filter=(dir,entries)=>entries.filter(e=>!isFireFivePanelAddition(path.join(String(dir),typeof e==='string'?e:e.name)));
export default {...fs,readFileSync(file,options){const data=beforeFireFivePanels(file,fs.readFileSync(file));const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):data;},readdirSync(dir,options){return filter(dir,fs.readdirSync(dir,options));}};
export async function readFile(file,options){const data=beforeFireFivePanels(file,await fsp.readFile(file));const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):data;}
export async function readdir(dir,options){return filter(dir,await readdirBeforeServiceSplit(dir,options));}

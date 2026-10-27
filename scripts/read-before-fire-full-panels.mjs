// Archived release checks receive the exact preceding bytes only for this
// fingerprinted edit. Native full-panel checks read node:fs directly.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const review=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-fire-full-panels/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const keyFor=file=>path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file));
export function beforeFireFullPanels(file,bytes){
  const key=keyFor(file),row=review.changes[key];
  if(!row||hash(bytes)!==row.sha256)return bytes;
  const before=Buffer.from(row.before,'base64');
  assert.equal(hash(before),row.beforeSHA256,key+': full-panel exact predecessor');
  return before;
}
export function isFireFullPanelAddition(file){
  const key=keyFor(file),expected=review.additions[key];
  if(!expected)return false;
  assert.equal(hash(fs.readFileSync(file)),expected,key+': fingerprinted full-panel addition');
  return true;
}
const filter=(dir,entries)=>entries.filter(e=>!isFireFullPanelAddition(path.join(String(dir),typeof e==='string'?e:e.name)));
export const historicalFS={...fs,
  readFileSync(file,options){
    const data=beforeFireFullPanels(file,fs.readFileSync(file));
    const encoding=typeof options==='string'?options:options?.encoding;
    return encoding?data.toString(encoding):data;
  },
  readdirSync(dir,options){return filter(dir,fs.readdirSync(dir,options));}
};
export default historicalFS;
export async function readFile(file,options){
  const data=beforeFireFullPanels(file,await fsp.readFile(file));
  const encoding=typeof options==='string'?options:options?.encoding;
  return encoding?data.toString(encoding):data;
}

export async function readdir(dir,options){return filter(dir,await fsp.readdir(dir,options));}

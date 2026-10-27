// Historical checks see the exact previous release, only after the current
// document/addition is fingerprinted. Current native checks never use this FS.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const priorityReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-fire-priority-chapters/review.json.gz')));
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-27-fire-priority-chapters/baseline.json'));
const previousFiles=[...Object.keys(baseline.files),...Object.keys(baseline.html)];
const hash=b=>createHash('sha256').update(b).digest('hex');
const keyFor=p=>path.normalize(path.isAbsolute(String(p))?path.relative(process.cwd(),String(p)):String(p));
export function beforeFirePriorityChapters(file,bytes){
  const key=keyFor(file),row=priorityReview.files[key];
  if(!row||hash(bytes)!==row.sha256)return bytes;
  const source=bytes.toString('utf8');
  assert.equal(source.slice(row.at,row.at+row.current.length),row.current,key+': exact priority chapter delta');
  const before=Buffer.from(source.slice(0,row.at)+row.before+source.slice(row.at+row.current.length));
  assert.equal(hash(before),row.beforeSHA256,key+': complete pre-priority document');
  return before;
}
export function isFirePriorityAddition(file){
  const key=keyFor(file),rows=Object.entries(priorityReview.additions).filter(([p])=>p===key||p.startsWith(key+'/'));
  if(previousFiles.some(p=>p===key||p.startsWith(key+'/')))return false;
  if(!rows.length)return false;
  const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
  const files=fs.statSync(key).isDirectory()?walk(key):[key];
  assert.deepEqual(files.sort(),rows.map(([p])=>p).sort(),key+': only fingerprinted priority additions');
  for(const [p,sha]of rows)assert.equal(hash(fs.readFileSync(p)),sha,p+': complete new priority file');
  return true;
}
const filter=(dir,entries)=>entries.filter(e=>!isFirePriorityAddition(path.join(String(dir),typeof e==='string'?e:e.name)));
export const historicalFS={...fs,
  readFileSync(file,options){
    const data=beforeFirePriorityChapters(file,fs.readFileSync(file));
    const encoding=typeof options==='string'?options:options?.encoding;
    return encoding?data.toString(encoding):data;
  },
  readdirSync(dir,options){return filter(dir,fs.readdirSync(dir,options));}
};
export default historicalFS;
export async function readFile(file,options){
  const data=beforeFirePriorityChapters(file,await fsp.readFile(file));
  const encoding=typeof options==='string'?options:options?.encoding;
  return encoding?data.toString(encoding):data;
}
export async function readdir(dir,options){return filter(dir,await fsp.readdir(dir,options));}

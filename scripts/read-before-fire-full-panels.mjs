// Archived release checks receive the exact preceding bytes only for this
// fingerprinted edit. Native full-panel checks read node:fs directly.
import fs, {beforeFireFivePanels,isFireFivePanelAddition,readFile as readFiveFile,readdir as readFiveDirectory} from './read-before-fire-five-full-panels.mjs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {isFacilityAddition} from './read-before-facility-launch.mjs';
import {beforeHomepageTitle} from './read-before-homepage-title.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const review=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-fire-full-panels/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const styleReviewPath='docs/audits/2026-10-27-fire-full-panels/text-steps-style.json';
export const textStepsStyle=fs.existsSync(styleReviewPath)?JSON.parse(fs.readFileSync(styleReviewPath,'utf8')):null;
if(textStepsStyle){
  assert.equal(textStepsStyle.file,'public/styles/fire-panel-lessons.css');
  assert.equal(textStepsStyle.beforeSHA256,review.current[textStepsStyle.file]);
  assert.equal(hash(Buffer.from(textStepsStyle.before,'base64')),textStepsStyle.beforeSHA256);
}
export function beforePanelTextStyle(file,bytes){
  if(!textStepsStyle||keyFor(file)!==textStepsStyle.file||hash(bytes)!==textStepsStyle.sha256)return bytes;
  return Buffer.from(textStepsStyle.before,'base64');
}
const keyFor=file=>path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file));
export function beforeFireFullPanels(file,bytes){
  bytes=beforeHomepageTitle(file,bytes);
  bytes=beforeFireFivePanels(file,bytes);
  bytes=beforePanelTextStyle(file,bytes);
  const key=keyFor(file),row=review.changes[key];
  if(!row||hash(bytes)!==row.sha256)return bytes;
  const before=Buffer.from(row.before,'base64');
  assert.equal(hash(before),row.beforeSHA256,key+': full-panel exact predecessor');
  return before;
}
export function isFireFullPanelAddition(file){
  if(isFacilityAddition(file)||isFireFivePanelAddition(file))return true;
  const key=keyFor(file),expected=review.additions[key];
  if(!expected)return false;
  assert.equal(hash(beforePanelTextStyle(file,fs.readFileSync(file))),expected,key+': fingerprinted full-panel addition');
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
  const data=beforeFireFullPanels(file,await readFiveFile(file));
  const encoding=typeof options==='string'?options:options?.encoding;
  return encoding?data.toString(encoding):data;
}

export async function readdir(dir,options){return filter(dir,await readFiveDirectory(dir,options));}

import { beforeBodyThumbnailRemoval } from './read-facility-body-thumbnails.mjs';
// Exact, approved November 18 deltas; older audit records remain immutable.
import fs from 'node:fs';
import {inflateSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const seriesRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-18-pending-release/manifest.json'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export const seriesSourceAdditions=seriesRelease.articles.flatMap(r=>[r.source,r.image]);
export const seriesOutputAdditions=seriesRelease.articles.flatMap(r=>['dist'+r.route+'index.html',r.image.replace(/^public/,'dist')]);
export function beforePendingRelease(file,bytes){
 const row=seriesRelease.changes[file];
 if(!row)return bytes;
 bytes=beforeBodyThumbnailRemoval(file, bytes);
 if(hash(bytes)===row.beforeSha256)return bytes;
 assert.equal(hash(bytes),row.sha256,file+': exact approved pending-release delta');
 const original=Buffer.from(row.before,'base64');
 assert.equal(hash(original),row.beforeSha256,file+': immutable predecessor');
 return original;
}
export function beforePendingOutput(file,bytes){
 const direct=seriesRelease.generatedChanges[file] || (file===seriesRelease.compiledStyle.path?seriesRelease.compiledStyle:null);
 if(direct){
  assert.equal(hash(bytes),direct.sha256,file+': exact approved compiled output');
  const original=inflateSync(Buffer.from(direct.before,'base64'));
  assert.equal(hash(original),direct.beforeSha256,file+': original compiled output');return original;
 }
 if(!file.endsWith('.html'))return bytes;
 let text=bytes.toString('utf8');
 for(const pair of seriesRelease.inlineScripts){
  if(!text.includes(pair.current))continue;
  assert.equal(text.split(pair.current).length,2,file+': exactly one approved script');text=text.replace(pair.current,pair.before);
 }
 const style=seriesRelease.compiledStyle;
 const current=style.path.replace(/^dist/,'');const previous=style.beforePath.replace(/^dist/,'');
 if(text.includes(current)){assert.equal(text.split(current).length,2,file+': exactly one approved stylesheet');text=text.replace(current,previous);}
 return Buffer.from(text);
}

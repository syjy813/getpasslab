import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/audits/2026-11-06-facility-image-bulk/';
export const bulkVisuals=JSON.parse(fs.readFileSync(root+'manifest.json'));
const sha=b=>createHash('sha256').update(b).digest('hex');
export const bulkOutput=row=>'dist'+row.publicPath;
export function beforeBulkVisuals(file,bytes){
 const row=bulkVisuals.source[file];if(!row)return bytes;
 assert.equal(sha(bytes),row.sha256,file+': reviewed image-only article');
 const previous=fs.readFileSync(row.previous);assert.equal(sha(previous),row.beforeSHA256,file+': preserved source');return previous;
}
const withoutImages=s=>s.replace(/<figure><img[^>]*><\/figure>|!\[[^\]]*\]\([^)]*\)/g,'').split('\n').filter(l=>l.trim()).join('\n');
export function assertBulkVisuals(){
 for(const [file,row] of Object.entries(bulkVisuals.source)){
  const current=fs.readFileSync(file),before=beforeBulkVisuals(file,current);
  assert.equal(withoutImages(current.toString()),withoutImages(before.toString()),file+': exact original prose/frontmatter/links');
 }
 for(const [file,hash] of Object.entries(bulkVisuals.dependencies))assert.equal(sha(fs.readFileSync(file)),hash,file+': reviewed renderer dependency');
 const paths=new Set();for(const row of bulkVisuals.images){
  assert(!paths.has(row.publicPath),'unique serving URL');paths.add(row.publicPath);
  assert(!row.publicPath.includes('/05/'),'protected public-sector reference untouched');
  assert.equal(sha(fs.readFileSync(row.file)),row.sha256,row.file);
  assert.equal(sha(fs.readFileSync(row.master)),row.masterSHA256,row.master);
 }
}

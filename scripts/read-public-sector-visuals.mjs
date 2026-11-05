// Exact approved visual delta. Historical snapshots remain unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const publicSectorVisuals = JSON.parse(fs.readFileSync('docs/audits/2026-11-05-public-sector-visuals/manifest.json'));
export const visualHash = b => createHash('sha256').update(b).digest('hex');
export const visualOutput = row => 'dist' + row.publicPath;
const key = file => path.relative(process.cwd(),path.resolve(String(file))).replaceAll('\\','/');
export function beforePublicSectorVisuals(file,bytes) {
  const row=publicSectorVisuals.source;
  if(key(file)!==row.file || visualHash(bytes)!==row.afterSHA256)return bytes;
  const before=fs.readFileSync(row.beforeFile);
  assert.equal(visualHash(before),row.beforeSHA256,'immutable previous article');
  return before;
}
export function assertPublicSectorVisuals(){
  const {source,images,template}=publicSectorVisuals;
  assert.equal(visualHash(fs.readFileSync(source.file)),source.afterSHA256,'approved current article');
  assert.equal(visualHash(fs.readFileSync(source.beforeFile)),source.beforeSHA256,'previous article preserved');
  assert.equal(images.length,5,'one hero and four card images');
  assert.equal(new Set(images.map(r=>r.publicPath)).size,5,'unique image identities');
  for(const row of images){
    assert.match(row.publicPath,/^\/images\/facility-drafts\/05\/[a-z0-9-]+\.webp$/);
    assert.equal(visualHash(fs.readFileSync(row.file)),row.sha256,row.file);
    assert.equal(visualHash(fs.readFileSync(row.master)),row.masterSHA256,row.master);
  }
  const bytes=fs.readFileSync(template.file);
  assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),template.gitBlob,'unmodified official renderer');
}

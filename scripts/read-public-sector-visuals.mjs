// Exact approved visual delta. Historical snapshots remain unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const historicalVisuals = JSON.parse(fs.readFileSync('docs/audits/2026-11-05-public-sector-visuals/manifest.json'));
const previousRefinement = JSON.parse(fs.readFileSync('docs/audits/2026-11-05-facility-card-template-refine/manifest.json'));
const iconRefinement = JSON.parse(fs.readFileSync('docs/audits/2026-11-05-facility-card-icons-center/manifest.json'));
const geometryFix = JSON.parse(fs.readFileSync('docs/audits/2026-11-06-pictogram-geometry-fix/manifest.json'));
const heroRefinement = JSON.parse(fs.readFileSync('docs/audits/2026-11-10-facility-hero-title-normalization-phase2/public-sector-hero.json'));
const refinement = {...iconRefinement,template:geometryFix.template,images:iconRefinement.images.map(row=>geometryFix.images.find(next=>next.publicPath===row.publicPath)||row)};
export const publicSectorVisuals = {...historicalVisuals, template:refinement.template, images:historicalVisuals.images.map(row=>heroRefinement.images.find(next=>next.publicPath===row.publicPath)||refinement.images.find(next=>next.publicPath===row.publicPath)||row)};
export const visualDerivativeFiles = [...new Set([...historicalVisuals.images,...previousRefinement.images,...iconRefinement.images,...refinement.images,...heroRefinement.images].map(row=>row.file))];
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
  assert.deepEqual(geometryFix.images.map(row=>row.publicPath),['/images/facility-drafts/05/05-compare-jobs-checklist.webp','/images/facility-drafts/05/06-compare-jobs-checklist.webp'],'only the two reviewed card images are replaced');
  assert.deepEqual(refinement.images.map(row=>row.publicPath),historicalVisuals.images.filter(row=>row.kind==='official-card-template').map(row=>row.publicPath),'only four approved card images refined');
  assert.deepEqual(heroRefinement.images.map(row=>row.publicPath),['/images/facility-drafts/05/01-public-sector-hero.webp'],'only the approved phase2 public-sector hero is replaced');
  for(const row of [...historicalVisuals.images,...previousRefinement.images,...iconRefinement.images]){
    assert.equal(visualHash(fs.readFileSync(row.file)),row.sha256,'previous derivative preserved: '+row.file);
    assert.equal(visualHash(fs.readFileSync(row.master)),row.masterSHA256,'previous master preserved: '+row.master);
  }
  assert.equal(visualHash(fs.readFileSync('docs/audits/2026-11-06-pictogram-geometry-fix/previous-pictograms.mjs')),iconRefinement.template.dependencies[0].sha256,'previous pictogram module preserved');
  const previousRenderer=fs.readFileSync('docs/audits/2026-11-05-facility-card-icons-center/previous-renderer.mjs');
  assert.equal(createHash('sha1').update('blob '+previousRenderer.length+'\0').update(previousRenderer).digest('hex'),previousRefinement.template.gitBlob,'previous canonical renderer preserved');
  const previous=fs.readFileSync(historicalVisuals.template.file);
  assert.equal(createHash('sha1').update('blob '+previous.length+'\0').update(previous).digest('hex'),historicalVisuals.template.gitBlob,'historical renderer preserved');
  assert.equal(visualHash(fs.readFileSync(source.file)),source.afterSHA256,'approved current article');
  assert.equal(visualHash(fs.readFileSync(source.beforeFile)),source.beforeSHA256,'previous article preserved');
  assert.equal(images.length,5,'one hero and four card images');
  assert.equal(new Set(images.map(r=>r.publicPath)).size,5,'unique image identities');
  for(const row of images){
    assert.match(row.publicPath,/^\/images\/facility-drafts\/05\/[a-z0-9-]+\.webp$/);
    assert.equal(visualHash(fs.readFileSync(row.file)),row.sha256,row.file);
    assert.equal(visualHash(fs.readFileSync(row.master)),row.masterSHA256,row.master);
  }
  for(const row of template.dependencies||[])assert.equal(visualHash(fs.readFileSync(row.file)),row.sha256,'current pictogram library');
  const bytes=fs.readFileSync(template.file);
  assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),template.gitBlob,'current canonical card renderer');
}

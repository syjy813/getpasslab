// Rebuild exactly the three approved public-sector-comparison SVG masters.
// Inputs: original immutable WebP artwork + reviewed JSON copy. Output: SVG
// sources converted to WebP by the existing Astro selective-assets hook.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {renderFacilityThumbnail} from './generate-facility-thumbnail.mjs';
import {renderInfographic} from './generate-facility-infographic.mjs';

const dir='docs/audits/2026-11-05-facility-05-visual-refresh/';
const target='facility-asset-edits/05/';
const names=['01-public-sector-hero','02-employer-types','04-pay-data-comparison'];
export function buildMasters(){
  const outputs=new Map();
  for(const name of names){
    const spec=JSON.parse(fs.readFileSync(dir+name+'.json','utf8'));
    const svg=name==='01-public-sector-hero'
      ?renderFacilityThumbnail(spec,{artworkComposition:true})
      :renderInfographic(spec);
    assert.match(svg,/<svg[^>]*viewBox="0 0 1440 1080"/);
    assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
    assert.equal((svg.match(/GetPassLab/g)||[]).length,1);
    assert.equal((svg.match(/font-size="64"/g)||[]).length,1);
    assert.equal((svg.match(/font-size="30"/g)||[]).length,1);
    outputs.set(target+name+'.svg',svg);
  }
  return outputs;
}

if(process.argv[1] && import.meta.url===(await import('node:url')).pathToFileURL((await import('node:path')).resolve(process.argv[1])).href){
  const mode=process.argv[2]||'--check';
  if(!['--check','--write'].includes(mode))throw Error('Usage: node scripts/generate-facility-05-templates.mjs --check|--write');
  for(const [path,svg] of buildMasters()){
    if(mode==='--write')fs.writeFileSync(path,svg,'utf8');
    else assert.equal(fs.readFileSync(path,'utf8'),svg,'stale master: '+path);
    console.log('[Facility 05 SVG]',mode==='--check'?'PASS':'WROTE',path,svg.length);
  }
}

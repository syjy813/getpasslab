import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const hotelRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-10-hotel-two-parter/manifest.json'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function assertHotelRelease(){
  assert.deepEqual(hotelRelease.articles.map(row=>row.slug),['hobyeongbaekma-hotel-despair','hobyeongbaekma-hotel-hope']);
  assert.equal(hotelRelease.outputAdditions.length,4);
  for(const [file,hash] of Object.entries(hotelRelease.additions))assert.equal(sha(fs.readFileSync(file)),hash,file+': approved hotel release');
  for(const [file,row] of Object.entries(hotelRelease.nativeChanges)){
    assert.equal(sha(fs.readFileSync(row.previous)),row.previousSHA256,file+': previous native source preserved');
    if(file==='src/layouts/FacilityArticleLayout.astro'){
      const current=fs.readFileSync(file,'utf8');
      assert.equal(current.split("const showSourceList = !article.id.startsWith('hobyeongbaekma');").length,2,file+': exact hobyeongbaekma source visibility extension');
      const historical=current.replace("const showSourceList = !article.id.startsWith('hobyeongbaekma');","const showSourceList = !['hobyeongbaekma', 'hobyeongbaekma-hotel-despair', 'hobyeongbaekma-hotel-hope'].includes(article.id);");
      assert.equal(sha(Buffer.from(historical)),row.sha256,file+': historical reviewed native source preserved');
    } else assert.equal(sha(fs.readFileSync(file)),row.sha256,file+': reviewed native source');
  }
  for(const row of hotelRelease.articles){
    const source=fs.readFileSync(row.source,'utf8');
    assert.match(source,/^status: published$/m);
    assert(!/dcinside|근거 및 (참고 )?자료/.test(source));
    assert(!/https?:\/\//.test(source.split('\n---\n').slice(1).join('\n')),'no external links in public body');
  }
}

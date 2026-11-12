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
    } else if(file==='src/components/FacilityCard.astro'){
      const current=fs.readFileSync(file,'utf8');
      const departmentStoreCovers="  'hobyeongbaekma-department-store-despair': '/images/facility-series/ep3-1-department-store-despair/01-hero.webp',\n  'hobyeongbaekma-department-store-hope': '/images/facility-series/ep3-2-department-store-hope/01-hero.webp',\n";
      const hospitalCovers="  'hobyeongbaekma-hospital-despair': '/images/facility-series/ep2-1-hospital-despair/01-hero.webp',\n  'hobyeongbaekma-hospital-hope': '/images/facility-series/ep2-2-hospital-hope/01-hero.webp',\n";
      assert.equal(current.split(departmentStoreCovers).length,2,file+': exact department-store cover additions');
      assert.equal(current.split(hospitalCovers).length,2,file+': exact hospital cover additions');
      assert.equal(current.split("const coverSize = article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];").length,2,file+': series cover size rule');
      const historical=current.replace(departmentStoreCovers,'').replace(hospitalCovers,'').replace("const coverSize = article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];","const coverSize = ['hobyeongbaekma', 'hobyeongbaekma-hotel-despair', 'hobyeongbaekma-hotel-hope'].includes(article.id) ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];");
      assert.equal(sha(Buffer.from(historical)),row.sha256,file+': historical reviewed card source preserved');
    } else assert.equal(sha(fs.readFileSync(file)),row.sha256,file+': reviewed native source');
  }
  for(const row of hotelRelease.articles){
    const source=fs.readFileSync(row.source,'utf8');
    assert.match(source,/^status: published$/m);
    assert(!/dcinside|근거 및 (참고 )?자료/.test(source));
    assert(!/https?:\/\//.test(source.split('\n---\n').slice(1).join('\n')),'no external links in public body');
  }
}

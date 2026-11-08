import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {integrateEpisode00Images,integratedImageRoot as root,integratedImageStyles} from './hobyeongbaekma-integrated-images.mjs';
const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));
const previous=fs.readFileSync(manifest.previousSource,'utf8');
const current=fs.readFileSync('src/content/facility/hobyeongbaekma.md','utf8');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');

test('only three image pairs and actual modification date change',()=>{
  assert.equal(current,integrateEpisode00Images(previous,manifest));
  const prose=s=>s.replace(/<figure[\s\S]*?<\/figure>/g,'').replace("updatedAt: '2026-11-08'","updatedAt: '2026-11-07'").split('\n').filter(l=>l.trim()).join('\n');
  assert.equal(prose(current),prose(previous),'all prose, source links, tables and metadata preserved');
  assert.equal((current.match(/<figure/g)||[]).length,4);
  assert.equal((current.match(/<picture>/g)||[]).length,3);
  const hero=s=>s.match(/<figure><img[^>]+01-hobyeongbaekma-hero[\s\S]*?<\/figure>/)[0];
  assert.equal(hero(current),hero(previous),'approved hero markup preserved');
});
test('all card fields from each split pair survive in order',()=>{
  for(const row of manifest.groups){
    const before=[1,2].flatMap(n=>JSON.parse(fs.readFileSync('docs/drafts/facility/hobyeongbaekma/specs/'+row.id+'-'+n+'.json')).cards);
    const spec=JSON.parse(fs.readFileSync(row.spec));
    assert.deepEqual(spec.cards,before);assert.equal(spec.cards.length,row.count);
    for(const old of row.previous)assert(!current.includes(old),'no split image reference');
  }
});
test('exact approved responsive assets and masters are available',()=>{
  for(const row of manifest.groups){
    assert.equal(sha(fs.readFileSync(row.spec)),row.specSHA256);
    for(const viewport of ['desktop','mobile']){
      const image=row[viewport];
      assert.equal(sha(fs.readFileSync(image.file)),image.sha256);
      assert.equal(sha(fs.readFileSync(image.master)),image.masterSHA256);
      assert.equal(sha(fs.readFileSync(image.pngMaster)),image.pngSHA256);
      assert(current.includes(image.src));
    }
  }
});
test('CSS is limited to complete-sheet layout and correct pre-load aspect ratios',()=>{
  assert.equal(fs.readFileSync('src/styles/facility.css','utf8'),fs.readFileSync(manifest.previousStyle,'utf8')+integratedImageStyles);
  for(const row of manifest.groups){
    assert(current.includes('--overview-ratio:'+row.desktop.width+'/'+row.desktop.height));
    assert(current.includes('--overview-mobile-ratio:'+row.mobile.width+'/'+row.mobile.height));
  }
});
test('unexpected, duplicate or already-integrated source fails closed',()=>{
  assert.throws(()=>integrateEpisode00Images(current,manifest),/source pair/);
  assert.throws(()=>integrateEpisode00Images(previous.replace(manifest.groups[0].previous[0],'missing.webp'),manifest),/source pair/);
  assert.throws(()=>integrateEpisode00Images(previous,{...manifest,groups:manifest.groups.slice(0,2)}),/three/);
});

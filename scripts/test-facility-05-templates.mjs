import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildMasters} from './generate-facility-05-templates.mjs';

const root='facility-asset-edits/05/';
const names=['01-public-sector-hero','02-employer-types','04-pay-data-comparison'];
const masters=buildMasters();

test('exact three approved SVG masters are reproducible and originals remain separately stored',()=>{
  assert.deepEqual([...masters.keys()],[...names.map(n=>root+n+'.svg')]);
  for(const [path,svg] of masters){
    assert.equal(svg,fs.readFileSync(path,'utf8'),'stale review master: '+path);
    assert.match(svg,/width="1440" height="1080" viewBox="0 0 1440 1080"/);
    assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
    assert.equal((svg.match(/GetPassLab/g)||[]).length,1);
  }
});

test('one hero uses centered title and crop-clipped high-detail original, no second text header',()=>{
  const svg=masters.get(root+'01-public-sector-hero.svg');
  assert.match(svg,/x="720" y="140"[^>]*text-anchor="middle"/);
  assert.match(svg,/x="720" y="230"[^>]*text-anchor="middle"/);
  assert.match(svg,/id="graphic-safe-area" data-variant="illustration"/);
  assert.match(svg,/href="data:image\/webp;base64,/);
  assert.match(svg,/id="main-graphic"/);
  assert.match(svg,/preserveAspectRatio="none" clip-path="url\(#graphic-safe-clip\)"/);
  assert.doesNotMatch(svg,/graphic-preview-placeholder/);
});

test('comparison 3-card and 2-card headers stay left aligned and retain original meaning',()=>{
  const employer=masters.get(root+'02-employer-types.svg');
  const salary=masters.get(root+'04-pay-data-comparison.svg');
  for(const svg of [employer,salary]){
    assert.match(svg,/x="80" y="140"[^>]*text-anchor="start"/);
    assert.match(svg,/x="80" y="230"[^>]*text-anchor="start"/);
    assert.doesNotMatch(svg,/href="data:image/);
  }
  assert.match(employer,/data-count="3"/);
  for(const text of ['기관 직접채용','자회사 채용','전문업체 채용','근무하는 건물 ≠ 실제 고용주']){
    assert.ok(employer.includes(text),text);
  }
  assert.match(salary,/data-count="2"/);
  for(const text of ['기관 평균보수','개별 채용공고','시설기사 초임과 같지 않다']){
    assert.ok(salary.includes(text),text);
  }
});

test('sharp decodes hero embedded artwork and all three masters to 1440x1080 WebP',async()=>{
  const {default:sharp}=await import('sharp');
  for(const [path,svg] of masters){
    const webp=await sharp(Buffer.from(svg),{density:96}).resize(1440,1080,{fit:'fill'}).webp({quality:86,effort:2}).toBuffer();
    const meta=await sharp(webp).metadata();
    assert.equal(meta.format,'webp',path);
    assert.equal(meta.width,1440,path);
    assert.equal(meta.height,1080,path);
    assert.ok(webp.length>5000,'empty graphic: '+path);
    if(path.endsWith('01-public-sector-hero.svg')){
      // The source imagery is raster embedded inside the SVG. Verify that the
      // renderer painted it, not merely the static frame/title shell.
      const stats=await sharp(webp).extract({left:130,top:395,width:1180,height:560}).stats();
      assert.ok(stats.channels[0].stdev>25,'hero image appears blank (red)');
      assert.ok(stats.channels[1].stdev>25,'hero image appears blank (green)');
      assert.ok(stats.channels[2].stdev>25,'hero image appears blank (blue)');
    }
  }
});

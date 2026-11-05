import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {parse} from 'parse5';
import {renderInfographic} from './generate-facility-infographic.mjs';
import {publicSectorVisuals as review,assertPublicSectorVisuals,visualHash,visualOutput} from './read-public-sector-visuals.mjs';

assertPublicSectorVisuals();
const audit='docs/audits/2026-11-05-facility-card-icons-center';
const old=fs.readFileSync(review.source.beforeFile,'utf8'),current=fs.readFileSync(review.source.file,'utf8');
const withoutImages=s=>s.replace(/!\[[^\]]*\]\([^)]+\)|<img[^>]+>/g,'').replace(/\n{3,}/g,'\n\n');
assert.equal(withoutImages(current),withoutImages(old),'only image tags/alt changed; article facts, dates, links and text preserved');
const tags=[...current.matchAll(/<img src="([^"]+)" alt="([^"]+)"/g)];
assert.deepEqual(tags.map(m=>m[1]),review.images.map(r=>r.publicPath),'same old card/hero URLs and one added checklist image');
assert(tags.every(m=>m[2].trim()),'all image alts present');
for(const row of review.images){
  const meta=await sharp(row.file).metadata();
  assert.deepEqual([meta.format,meta.width,meta.height],['webp',1440,1080],row.file);
  assert.equal(visualHash(fs.readFileSync(visualOutput(row))),row.sha256,'build serves approved bytes');
  if(row.kind==='official-card-template'){
    const name=row.publicPath.split('/').at(-1).replace('.webp','');
    const spec=JSON.parse(fs.readFileSync(`${audit}/specs/${name}.json`));
    const svg=fs.readFileSync(row.master,'utf8');
    assert.equal(svg,renderInfographic(spec),'official template regeneration: '+name);
    assert([2,3].includes(spec.cards.length),'approved two/three-card layout');
    assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1,'one official card brand');
    assert(svg.includes('id="header-fixed"')&&svg.includes('text-anchor="start"'),'left aligned title');
  }
}
const lastNames=['05-compare-jobs-checklist','06-compare-jobs-checklist'];
assert.deepEqual(lastNames.flatMap(n=>JSON.parse(fs.readFileSync(`${audit}/specs/${n}.json`)).cards.map(c=>c.title)),['실제 고용주','사업소·업무','자격·경력','근무표','급여 구성','계약·정년'],'all six checklist categories retained');
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,k)=>n?.attrs?.find(a=>a.name===k)?.value;
const article=nodes(parse(fs.readFileSync('dist/facility-management/jobs/public-sector-comparison/index.html','utf8')));
const body=article.find(n=>(attr(n,'class')||'').split(/\s+/).includes('facility-body'));
assert.deepEqual(nodes(body).filter(n=>n.tagName==='img').map(n=>attr(n,'src')),review.images.map(r=>r.publicPath),'rendered article images in approved order');
for(const row of review.images)assert(article.some(n=>n.tagName==='img'&&attr(n,'src')===row.publicPath&&attr(n,'width')&&attr(n,'height')),'reserved layout size: '+row.publicPath);
for(const page of ['dist/facility-management/index.html','dist/facility-management/jobs/index.html']){
 const all=nodes(parse(fs.readFileSync(page,'utf8')));
 const link=all.find(n=>n.tagName==='a'&&attr(n,'href')==='/facility-management/jobs/public-sector-comparison/'&&(attr(n,'class')||'').includes('facility-card'));
 assert(link,page+': article card exists');
 assert.equal(attr(nodes(link).find(n=>n.tagName==='img'),'src'),review.images[0].publicPath,'same approved hero in list and article');
}
console.log('[Public-sector visuals] PASS: hero + 4 template cards, exact asset delivery, 6 criteria, article text/URLs, list thumbnails');

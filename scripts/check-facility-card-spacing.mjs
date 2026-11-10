import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {cardRects} from './generate-facility-infographic.mjs';
import {infographicLayout,renderInfographic} from './generate-facility-compact-infographic.mjs';
import {registerExtraPictograms} from './facility-pictograms-extended.mjs';
import {applyBulkLabelOffsets} from './facility-bulk-labels.mjs';
import {bulkVisuals,assertBulkVisuals} from './read-facility-bulk-visuals.mjs';
registerExtraPictograms();assertBulkVisuals();sharp.cache(false);sharp.concurrency(1);
const audit='docs/audits/2026-11-06-facility-card-spacing';
const before=JSON.parse(fs.readFileSync(audit+'/before-manifest.json'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const bodyText=svg=>[...svg.matchAll(/<text(?! class="centered-label")[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0]);
const dark=(r,x,y)=>{const k=(y*r.info.width+x)*r.info.channels;return r.data[k]<120&&r.data[k+1]<150&&r.data[k+2]<120;};
function lastBodyInk(r,card,actionTop){
  for(let y=Math.ceil(actionTop)-1;y>=card.y+250;y--)
    for(let x=Math.ceil(card.x+24);x<card.x+card.w-24;x++)if(dark(r,x,y))return y;
  throw Error('Missing body ink');
}
const measurements=[];
const approvedHeroReplacements=new Map([
  ['/images/facility-drafts/03/01-employment-types-hero.webp',{
    sha256:'1c5ba3afc4f0cfa900a0099e388d318031cb99dda16382d8956f705c7b1c2190',
    masterSHA256:'34f51903b1c14e3864a1b800f0246d168b7810eafa12dd5c5aabc6c930526f6f'
  }],
  ['/images/facility-drafts/01/01-facility-management-hero.webp',{
    sha256:'649c9f00453893492def48198627f18302c6de5e3fa2dcc1a01edb58b6768e3a',
    masterSHA256:'8fd5433c0255084111b4f6dd19dcc35ed7880dda8b4ea392676d53594f29bda4'
  }],
  ['/images/facility-drafts/06/01-hanfms-hero.webp',{
    sha256:'b3598ac070c2d8f8da9d5c9eb28507f0cf69f44b5a2cfb01981094c128816b58',
    masterSHA256:'87df5deb86022d41653b1d39cc6fa681399621b04891d6c1e486c168c6afb30b'
  }],
  ['/images/facility-drafts/08/01-korailtech-hero.webp',{
    sha256:'df2a68b0be2ae3404b4333335202699931471020af0249f5bb33e20e9004b449',
    masterSHA256:'07968272b90dd85f04edfbc10726a27f4173740faba85982206aa9cc33fe4cb4'
  }],
  ['/images/facility-drafts/10/01-statutory-appointments-hero.webp',{
    sha256:'3bc8a95bc41335ac8705d5b9f0fda87c0c820ba52654e653ed8bbc9a36f83730',
    masterSHA256:'46beceb63097c8fa76a87e439b2d2697db10907b3ffa679a64915c8d571ca094'
  }],
  ['/images/facility-drafts/11/01-maintainer-grades-hero.webp',{
    sha256:'e2eefc106a820734a14514dd550b2ed2abbaa54974588bb9e9b472b675ad5431',
    masterSHA256:'a75335519dcf45571ee9a30b0c67e799a6a01e4d2d0468fb29ff847420f4185b'
  }],
  ['/images/facility-drafts/13/01-boiler-manager-hero-v2.webp',{
    sha256:'8a7392998f99e31205c996ca591c88108e5729f875a395c3a4b57ef57a06a80b',
    masterSHA256:'e15dc2e306022d5699a36042ee2f1ed406f3e788c60c43c87e79e9df82071d40'
  }]
,
  ['/images/facility-drafts/02/01-first-job-hero.webp',{
    sha256:'e33a07b03555b2d6355e70491c3bcf19037d8d477989589ecf6286dface337c1',
    masterSHA256:'2a78ffb8aa55fa9a50453d3db7adaedbeb7d2b5c9415fa1aa622dce893e4face'
  }],
  ['/images/facility-drafts/04/01-shifts-pay-hero.webp',{
    sha256:'ccc9fcb05904a5f0e9b82a84102f7d7160c73d66dfe2923a68982a3125351053',
    masterSHA256:'16a815bbca2292dca4e2edb6285309d57b8f1335d1dab0136773f1dd81d58139'
  }],
  ['/images/facility-drafts/07/01-postal-facilities-hero.webp',{
    sha256:'dd2ce538f70fe8ab95ecb4bb57a29b7d0df9029ffe3117ab2032d5d7d3e7bb89',
    masterSHA256:'148d7e4126793b551eacbdc1caf0e88ea597fdcae686f1b992b251f09bbd20be'
  }],
  ['/images/facility-drafts/09/01-camcofmc-hero.webp',{
    sha256:'3889bffcffad25f5ccc06cd8f2dea1300605b8c27b771f7d651018a0066044d0',
    masterSHA256:'6f18b1015f240c75063b5436dcff8846ab9006a966e947989294f050b064e603'
  }],
  ['/images/facility-drafts/12/01-career-reporting-hero.webp',{
    sha256:'54b8a8146ab26384443a290ae0935592351bf17a9d838e2652ada2408d05db35',
    masterSHA256:'440710d4ce3d01c5ccfe00da4fdd845ba70685cb4f8009c6e671d452c73d9958'
  }]
]);
for(const row of bulkVisuals.images){
  const old=before.images.find(r=>r.publicPath===row.publicPath);assert(old,'same public URL');
  const approvedHeroReplacement=approvedHeroReplacements.get(row.publicPath);
  if(approvedHeroReplacement){
    assert.equal(row.kind,'editorial-hero','approved replacement is hero only');
    assert.equal(row.sha256,approvedHeroReplacement.sha256,'approved replacement WebP');
    assert.equal(row.masterSHA256,approvedHeroReplacement.masterSHA256,'approved replacement master');
    assert.equal(sha(fs.readFileSync(row.file)),row.sha256,'approved WebP bytes');
    assert.equal(sha(fs.readFileSync(row.master)),row.masterSHA256,'approved PNG master bytes');
    assert.equal(row.alt,old.alt,'unchanged accessible description');
    continue;
  }
  assert.equal(sha(fs.readFileSync(old.file)),old.sha256,'previous WebP preserved');
  assert.equal(sha(fs.readFileSync(old.master)),old.masterSHA256,'previous master preserved');
  assert.equal(row.alt,old.alt,'unchanged accessible description');
  if(row.kind==='editorial-hero'){assert.equal(row.sha256,old.sha256,'hero bytes unchanged');continue;}
  const spec=JSON.parse(fs.readFileSync(row.spec)),oldSpec=JSON.parse(fs.readFileSync(old.spec));
  for(const key of ['title','subtitle','takeaway','cards'])assert.deepEqual(spec[key],oldSpec[key],'same copy and pictograms');
  const svg=fs.readFileSync(row.master,'utf8'),oldSvg=fs.readFileSync(old.master,'utf8');
  assert.deepEqual(bodyText(svg),bodyText(oldSvg),'body text geometry unchanged');
  assert.equal(svg,applyBulkLabelOffsets(renderInfographic(spec),spec.labelOffsets));
  const layout=infographicLayout(spec);assert.equal(row.height,layout.height);assert(layout.reduction>0);
  const oldCards=cardRects(spec.cards.length,layout.top);
  assert.equal(new Set(layout.cards.map(c=>c.y+c.h)).size,1,'aligned card bottoms');
  const previous=await sharp(old.file).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const current=await sharp(row.file).removeAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(current.info.width,row.width);assert.equal(current.info.height,row.height);
  const gaps=[];
  for(let i=0;i<spec.cards.length;i++){
    const offset=spec.cards.length===1?95:81,a=oldCards[i],b=layout.cards[i];
    const oldTop=a.y+a.h-offset,newTop=b.y+b.h-offset;
    const oldInk=lastBodyInk(previous,a,oldTop),newInk=lastBodyInk(current,b,newTop);
    assert(Math.abs(oldInk-newInk)<=1,'final explanation line stays in place');
    const oldGap=oldTop-oldInk-1,newGap=newTop-newInk-1;
    assert(newGap>=24,'safe explanation to label gap');
    assert(Math.abs(oldGap-newGap-layout.reduction)<=1,'remove only blank space');
    gaps.push({label:spec.cards[i].title,before:oldGap,after:newGap});
  }
  const oldMin=Math.min(...gaps.map(g=>g.before)),newMin=Math.min(...gaps.map(g=>g.after));
  assert(newMin/oldMin<=0.65,'row gap reduced to approximately half');
  measurements.push({publicPath:row.publicPath,height:row.height,reduction:layout.reduction,gaps});
}
assert.equal(measurements.length,73);
// The reusable 1-4 card examples retain the already compact 2x2 layout.
const root='docs/standards/facility-infographic-templates/';
for(const count of [1,2,3,4]){
 const spec=JSON.parse(fs.readFileSync(root+'compact-example-'+count+'.json'));
 assert.equal(fs.readFileSync(root+'compact-cards-'+count+'.svg','utf8'),renderInfographic(spec));
 if(count===4)assert.equal(infographicLayout(spec).reduction,0,'already compact 2x2 retained');
}
fs.writeFileSync(bulkVisuals.measurementAudit?bulkVisuals.measurementAudit+'/spacing-measurements.json':audit+'/measurements.json',JSON.stringify(measurements,null,2)+'\n');
console.log('[Card spacing] PASS '+JSON.stringify({images:measurements.length,cardItems:measurements.reduce((n,r)=>n+r.gaps.length,0),heights:[...new Set(measurements.map(r=>r.height))],sample:measurements.find(r=>r.publicPath.includes('job-types-part-2'))}));

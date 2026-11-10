import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {PICTOGRAMS,semanticIconSvg} from './facility-pictograms.mjs';
import {EXTRA_PICTOGRAMS,registerExtraPictograms} from './facility-pictograms-extended.mjs';
import {bulkVisuals,assertBulkVisuals} from './read-facility-bulk-visuals.mjs';
const audit='docs/audits/2026-11-06-facility-pictogram-review';
const oldSource=fs.readFileSync(audit+'/previous-pictograms-extended.mjs','utf8');
const old=await import('data:text/javascript;base64,'+Buffer.from(oldSource.replace("import {PICTOGRAMS} from './facility-pictograms.mjs';",'')).toString('base64'));
const changed=Object.keys(EXTRA_PICTOGRAMS).filter(k=>EXTRA_PICTOGRAMS[k].svg!==old.EXTRA_PICTOGRAMS[k].svg).sort();
assert.deepEqual(changed,['gas','mechanical','rail','submission']);
for(const key of Object.keys(EXTRA_PICTOGRAMS))assert.equal(EXTRA_PICTOGRAMS[key].meaning,old.EXTRA_PICTOGRAMS[key].meaning);
registerExtraPictograms();assertBulkVisuals();sharp.cache(false);sharp.concurrency(1);
const sizes=[24,26,28,31,35,38,104,118,128,140],measurements=[];
for(const [name,icon] of Object.entries(PICTOGRAMS))for(const size of sizes){
 const canvas=size+16;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">${semanticIconSvg(name,canvas/2,canvas/2,size)}</svg>`;
 const {data}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let ink=0,outside=0;
 for(let y=0;y<canvas;y++)for(let x=0;x<canvas;x++)if(data[(y*canvas+x)*4+3]>100){ink++;if(x<8||x>=8+size||y<8||y>=8+size)outside++;}
 assert(ink>20,name+' visible at '+size);assert.equal(outside,0,name+' not clipped at '+size);
 measurements.push({name,size,ink,outside});
}
async function partPixels(name,size){
 const part=EXTRA_PICTOGRAMS.submission.svg.match(new RegExp('<g data-part="'+name+'">[\\s\\S]*?<\\/g>'))?.[0];
 assert(part,'separate '+name+' geometry');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 104 104"><rect width="104" height="104" fill="white"/><g fill="none" stroke="#12523C" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${part}</g></svg>`;
 const {data,info}=await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({resolveWithObject:true});const points=[];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const k=(y*size+x)*info.channels;if(data[k]<120&&data[k+1]<150&&data[k+2]<120)points.push([x,y]);}
 assert(points.length>5,name+' visible');return points;
}
const clearances=[];
for(const size of sizes){
 const paper=await partPixels('paper',size),arrow=await partPixels('arrow',size),tray=await partPixels('tray',size);
 const gap=other=>{let min=Infinity;for(const [x,y] of arrow)for(const [a,b] of other)min=Math.min(min,Math.max(Math.abs(x-a),Math.abs(y-b)));return min-1;};
 const paperArrow=gap(paper),arrowTray=gap(tray);
 assert(paperArrow>=1,'paper/arrow have a clear pixel at '+size);assert(arrowTray>=1,'arrow/tray have a clear pixel at '+size);
 clearances.push({size,paperArrow,arrowTray});
}
const sha=b=>createHash('sha256').update(b).digest('hex');
const before=JSON.parse(fs.readFileSync(audit+'/before-manifest.json'));let repairedCards=0,repairedItems=0;
const approvedHeroReplacements=new Map([
 ['/images/facility-drafts/03/01-employment-types-hero.webp',['1c5ba3afc4f0cfa900a0099e388d318031cb99dda16382d8956f705c7b1c2190','34f51903b1c14e3864a1b800f0246d168b7810eafa12dd5c5aabc6c930526f6f']],
 ['/images/facility-drafts/01/01-facility-management-hero.webp',['649c9f00453893492def48198627f18302c6de5e3fa2dcc1a01edb58b6768e3a','8fd5433c0255084111b4f6dd19dcc35ed7880dda8b4ea392676d53594f29bda4']],
 ['/images/facility-drafts/06/01-hanfms-hero.webp',['b3598ac070c2d8f8da9d5c9eb28507f0cf69f44b5a2cfb01981094c128816b58','87df5deb86022d41653b1d39cc6fa681399621b04891d6c1e486c168c6afb30b']],
 ['/images/facility-drafts/08/01-korailtech-hero.webp',['df2a68b0be2ae3404b4333335202699931471020af0249f5bb33e20e9004b449','07968272b90dd85f04edfbc10726a27f4173740faba85982206aa9cc33fe4cb4']],
 ['/images/facility-drafts/10/01-statutory-appointments-hero.webp',['3bc8a95bc41335ac8705d5b9f0fda87c0c820ba52654e653ed8bbc9a36f83730','46beceb63097c8fa76a87e439b2d2697db10907b3ffa679a64915c8d571ca094']],
 ['/images/facility-drafts/11/01-maintainer-grades-hero.webp',['e2eefc106a820734a14514dd550b2ed2abbaa54974588bb9e9b472b675ad5431','a75335519dcf45571ee9a30b0c67e799a6a01e4d2d0468fb29ff847420f4185b']],
 ['/images/facility-drafts/13/01-boiler-manager-hero-v2.webp',['8a7392998f99e31205c996ca591c88108e5729f875a395c3a4b57ef57a06a80b','e15dc2e306022d5699a36042ee2f1ed406f3e788c60c43c87e79e9df82071d40']]
,
 ['/images/facility-drafts/02/01-first-job-hero.webp',['e33a07b03555b2d6355e70491c3bcf19037d8d477989589ecf6286dface337c1','2a78ffb8aa55fa9a50453d3db7adaedbeb7d2b5c9415fa1aa622dce893e4face']],
 ['/images/facility-drafts/04/01-shifts-pay-hero.webp',['ccc9fcb05904a5f0e9b82a84102f7d7160c73d66dfe2923a68982a3125351053','16a815bbca2292dca4e2edb6285309d57b8f1335d1dab0136773f1dd81d58139']],
 ['/images/facility-drafts/07/01-postal-facilities-hero.webp',['dd2ce538f70fe8ab95ecb4bb57a29b7d0df9029ffe3117ab2032d5d7d3e7bb89','148d7e4126793b551eacbdc1caf0e88ea597fdcae686f1b992b251f09bbd20be']],
 ['/images/facility-drafts/09/01-camcofmc-hero.webp',['3889bffcffad25f5ccc06cd8f2dea1300605b8c27b771f7d651018a0066044d0','6f18b1015f240c75063b5436dcff8846ab9006a966e947989294f050b064e603']],
 ['/images/facility-drafts/12/01-career-reporting-hero.webp',['54b8a8146ab26384443a290ae0935592351bf17a9d838e2652ada2408d05db35','440710d4ce3d01c5ccfe00da4fdd845ba70685cb4f8009c6e671d452c73d9958']]
]);
for(const row of bulkVisuals.images){
 const prev=before.images.find(r=>r.publicPath===row.publicPath);assert(prev,'stable image URL');
 const approvedHero=approvedHeroReplacements.get(row.publicPath);
 if(approvedHero){
  // Separately approved editorial hero updates; all pictogram-card baselines remain protected.
  assert.equal(row.kind,'editorial-hero');
  assert.equal(row.sha256,approvedHero[0]);
  assert.equal(row.masterSHA256,approvedHero[1]);
  assert.equal(sha(fs.readFileSync(row.file)),row.sha256,'approved hero WebP bytes');
  assert.equal(sha(fs.readFileSync(row.master)),row.masterSHA256,'approved hero master bytes');
  for(const key of ['width','height','alt'])assert.equal(row[key],prev[key],'layout and copy retained');
  assert.deepEqual(row.icons,prev.icons,'unchanged hero icon semantics');
  continue;
 }
 assert.equal(sha(fs.readFileSync(prev.file)),prev.sha256,'previous WebP retained');
 assert.equal(sha(fs.readFileSync(prev.master)),prev.masterSHA256,'previous master retained');
 for(const key of ['width','height','alt'])assert.equal(row[key],prev[key],'layout and copy retained');
 assert.deepEqual(row.icons,prev.icons,'same semantic icon keys');
 const affected=row.icons.some(k=>changed.includes(k));
 if(!affected)assert.equal(row.sha256,prev.sha256,'unaffected image bytes preserved');
 else{
  assert.notEqual(row.sha256,prev.sha256,'affected image rebuilt');repairedCards++;
  repairedItems+=row.icons.filter(k=>changed.includes(k)).length;
 }
}
const result={icons:Object.keys(PICTOGRAMS).length,sizes,changed,repairedCards,repairedItems,unchangedImages:85-repairedCards,clearances,measurements};
fs.writeFileSync(audit+'/measurements.json',JSON.stringify(result,null,2)+'\n');
console.log('[Pictogram review] PASS '+JSON.stringify({icons:result.icons,sizeChecks:measurements.length,changed,repairedCards,repairedItems,unchangedImages:result.unchangedImages}));

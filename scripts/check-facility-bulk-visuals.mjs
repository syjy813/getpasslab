import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
sharp.cache(false);sharp.concurrency(1);
import {bulkVisuals,assertBulkVisuals,bulkOutput} from './read-facility-bulk-visuals.mjs';
import {registerExtraPictograms,EXTRA_PICTOGRAMS} from './facility-pictograms-extended.mjs';
import {PICTOGRAMS,semanticIconSvg} from './facility-pictograms.mjs';
import {renderInfographic,infographicLayout} from './generate-facility-compact-infographic.mjs';
import {applyBulkLabelOffsets} from './facility-bulk-labels.mjs';
registerExtraPictograms();assertBulkVisuals();
assert.equal(bulkVisuals.images.length,85,'complete twelve-article refresh');
assert.equal(bulkVisuals.images.filter(r=>r.kind==='editorial-hero').length,12);
assert.equal(bulkVisuals.images.filter(r=>r.kind==='official-card-template').length,73);
const measurements=[];let cards=0;
const selected=process.argv[2];
if(!selected){
 const all=[];let topics=0;
 for(const article of Object.keys(bulkVisuals.source).map(f=>f.split('/').at(-1).replace('.md',''))){
  const child=spawnSync(process.execPath,['--expose-gc','--max-old-space-size=128',process.argv[1],article],{encoding:'utf8'});
  if(child.status!==0)throw Error(article+': '+child.stdout+child.stderr+' exit '+child.status);
  const r=JSON.parse(child.stdout);all.push(...r.centering);topics+=r.cardTopics;
 }
 measurements.push(...all);cards=topics;
}
for(const row of bulkVisuals.images.filter(r=>selected&&r.article===selected)){
 global.gc?.();
 const meta=await sharp(row.file).metadata();assert.equal(meta.width,row.width);assert.equal(meta.height,row.height);assert.equal(meta.format,'webp');
 if(fs.existsSync(bulkOutput(row)))assert.deepEqual(fs.readFileSync(bulkOutput(row)),fs.readFileSync(row.file),'reviewed bytes served');
 if(row.kind!=='official-card-template')continue;
 const spec=JSON.parse(fs.readFileSync(row.spec));const svg=fs.readFileSync(row.master,'utf8');assert.equal(svg,applyBulkLabelOffsets(renderInfographic(spec),spec.labelOffsets),'master matches reviewed brief');
 assert.equal((svg.match(/GetPassLab/g)||[]).length,1,'single logo');
 assert(!svg.includes('M1120 1080'),'no bottom-right circle');
 const layout=infographicLayout(spec);
 const boxes=layout.cards.map((r,i)=>({name:spec.cards[i].title,x:r.x+(spec.cards.length===1?100:22),y:r.y+r.h-(spec.cards.length===1?95:81),width:r.w-(spec.cards.length===1?200:44),height:spec.cards.length===1?64:57}));
 boxes.push({name:'footer',...layout.footer});
 for(const box of boxes){
  const {data,info}=await sharp(row.file).extract({left:Math.ceil(box.x+2),top:Math.round(box.y),width:Math.floor(box.width-4),height:box.height}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let min=Infinity,max=-1;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const k=(y*info.width+x)*info.channels;if(data[k]<120&&data[k+1]<150&&data[k+2]<120){min=Math.min(min,y);max=Math.max(max,y);}}
  const upper=min,lower=box.height-1-max;assert(max>=0,'visible ink');assert(Math.abs(upper-lower)<=2,`${row.publicPath}/${box.name}: ${upper}/${lower}`);measurements.push({publicPath:row.publicPath,label:box.name,upper,lower});
 }
 for(const card of spec.cards){assert(PICTOGRAMS[card.icon]?.meaning,'semantic icon');assert(svg.includes('data-icon="'+card.icon+'"'));cards++;}
}
if(selected){console.log(JSON.stringify({centering:measurements,cardTopics:cards}));process.exit(0);}
// Render with padding, then inspect alpha outside the canonical icon frame.
// This catches malformed paths and clipped strokes at actual mobile sizes.
const icons=[];
for(const [name,icon] of Object.entries(EXTRA_PICTOGRAMS))for(const size of [24,26,30,31,104,140]){
 const canvas=size+16;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">${semanticIconSvg(name,canvas/2,canvas/2,size)}</svg>`;
 const {data}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});let count=0,outside=0;
 for(let y=0;y<canvas;y++)for(let x=0;x<canvas;x++)if(data[(y*canvas+x)*4+3]>100){count++;if(x<8||x>=8+size||y<8||y>=8+size)outside++;}
 assert(count>20,name+' visible at '+size);assert.equal(outside,0,name+' clipping at '+size);icons.push({name,size,pixels:count});
}
fs.writeFileSync((bulkVisuals.measurementAudit||'docs/audits/2026-11-06-facility-card-spacing')+'/label-measurements.json',JSON.stringify({centering:measurements,icons},null,2)+'\n');
console.log('[Bulk visuals] PASS',JSON.stringify({images:bulkVisuals.images.length,cardTopics:cards,centeredLabels:measurements.length,newIcons:Object.keys(EXTRA_PICTOGRAMS).length,iconSizes:6}));

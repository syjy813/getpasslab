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
for(const row of bulkVisuals.images){
 const prev=before.images.find(r=>r.publicPath===row.publicPath);assert(prev,'stable image URL');
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

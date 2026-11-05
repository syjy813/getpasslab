import assert from 'node:assert/strict';
import sharp from 'sharp';
import {PICTOGRAMS} from './facility-pictograms.mjs';
import {PICTOGRAMS as previous} from '../docs/audits/2026-11-06-pictogram-geometry-fix/previous-pictograms.mjs';
const changed=Object.keys(PICTOGRAMS).filter(key=>PICTOGRAMS[key].svg!==previous[key].svg);
assert.deepEqual(changed.sort(),['shift-calendar','worksite'],'only two reviewed pictograms change');
async function bounds(svg,size){
  const {data}=await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 104 104"><g fill="none" stroke="#12523C" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">'+svg+'</g></svg>')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const xs=[],ys=[];
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(data[(y*size+x)*4+3]>100){xs.push(x);ys.push(y);}
  assert(xs.length,'part has visible geometry');
  return {left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
}
function part(key,name){
  const re=new RegExp('<g data-part="'+name+'"[^>]*>[\\s\\S]*?<\\/g>');
  const value=PICTOGRAMS[key].svg.match(re)?.[0];
  assert(value,key+': separate '+name+' layer');return value;
}
const measurements=[];
for(const size of [24,26,30,31,104,128]){
  const building=await bounds(part('worksite','building'),size),pin=await bounds(part('worksite','pin'),size),gear=await bounds(part('worksite','gear'),size);
  const sun=await bounds(part('shift-calendar','sun'),size),moon=await bounds(part('shift-calendar','moon'),size);
  const gaps={buildingGear:gear.left-building.right-1,pinGear:gear.top-pin.bottom-1,sunMoon:moon.left-sun.right-1};
  for(const [key,gap] of Object.entries(gaps))assert(gap>=1,`${size}px ${key}: requires a clear pixel, got ${gap}`);
  measurements.push({size,...gaps});
}
assert.match(PICTOGRAMS.worksite.svg,/data-teeth="8"/);
console.log('[Pictogram geometry] PASS: independent sun/moon and building/pin/gear at 24/26/30/31/104/128px; nine other icons unchanged');
console.log(JSON.stringify(measurements));

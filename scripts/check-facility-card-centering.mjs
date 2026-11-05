import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {cardRects,TOKENS} from './generate-facility-infographic.mjs';
import {PICTOGRAMS} from './facility-pictograms.mjs';
import {publicSectorVisuals} from './read-public-sector-visuals.mjs';
const audit='docs/audits/2026-11-05-facility-card-icons-center';
const review=publicSectorVisuals;
const measurements=[];
const used=[];
for(const row of review.images.filter(row=>row.kind==='official-card-template')){
  const stem=row.publicPath.split('/').at(-1).replace('.webp','');
  const spec=JSON.parse(fs.readFileSync(audit+'/specs/'+stem+'.json'));
  const svg=fs.readFileSync(row.master,'utf8');
  const top=Number(svg.match(/data-top="([\d.]+)"/)[1]);
  const boxes=cardRects(spec.cards.length,top).map((r,i)=>({name:spec.cards[i].title,x:r.x+22,y:r.y+r.h-81,width:r.w-44,height:57}));
  boxes.push({name:'하단 한 줄',...TOKENS.footer});
  for(const box of boxes){
    const {data,info}=await sharp(row.file).extract({left:Math.ceil(box.x+2),top:Math.round(box.y),width:Math.floor(box.width-4),height:box.height}).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const ys=[];
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
      const k=(y*info.width+x)*info.channels;
      if(data[k]<120 && data[k+1]<150 && data[k+2]<120)ys.push(y);
    }
    assert(ys.length,stem+': visible label ink: '+box.name);
    const upper=Math.min(...ys),lower=box.height-1-Math.max(...ys);
    assert(Math.abs(upper-lower)<=2,`${stem}/${box.name}: visible ink gaps ${upper}/${lower}px`);
    measurements.push({image:stem,label:box.name,upper,lower});
  }
  for(const card of spec.cards){
    assert(PICTOGRAMS[card.icon]?.meaning,card.title+': registered semantic icon');
    assert(svg.includes('data-icon="'+card.icon+'"'),card.title+': assigned icon is rendered');
    used.push(card.icon);
  }
}
assert.equal(used.length,11);
assert.equal(new Set(used).size,11,'all 11 distinct card topics use distinct pictograms');
console.log('[Card centering] PASS: '+measurements.length+' raster ink boxes centered within 2px; 11 distinct semantic pictograms');
console.log(JSON.stringify(measurements));

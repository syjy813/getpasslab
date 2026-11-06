// Calibrate each new label against its visible ink. The canonical template and
// already-approved public-sector assets remain unchanged.
import sharp from 'sharp';
import {renderInfographic,infographicLayout} from './generate-facility-compact-infographic.mjs';
export function applyBulkLabelOffsets(svg,offsets=[]){
 let index=0;
 return svg.replace(/<text class="centered-label"/g,match=>`${match} transform="translate(0 ${offsets[index++]??0})"`);
}
export async function measureBulkLabelOffsets(spec){
 const svg=renderInfographic(spec),layout=infographicLayout(spec);
 const boxes=layout.cards.map(r=>({x:r.x+(spec.cards.length===1?100:22),y:r.y+r.h-(spec.cards.length===1?95:81),width:r.w-(spec.cards.length===1?200:44),height:spec.cards.length===1?64:57}));
 boxes.push(layout.footer);
 const raster=await sharp(Buffer.from(svg)).png().toBuffer();
 const offsets=[];
 for(const box of boxes){
  const {data,info}=await sharp(raster).extract({left:Math.ceil(box.x+2),top:Math.round(box.y),width:Math.floor(box.width-4),height:box.height}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let min=Infinity,max=-1;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
   const k=(y*info.width+x)*info.channels;
   if(data[k]<120&&data[k+1]<150&&data[k+2]<120){min=Math.min(min,y);max=Math.max(max,y);}
  }
  if(max<0)throw Error('No visible label ink');
  offsets.push(Math.round(((box.height-1)-(min+max))/2));
 }
 return offsets;
}

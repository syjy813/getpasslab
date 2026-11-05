// GetPassLab 4:3 full-bleed facility hero: the artwork occupies the WHOLE canvas.
// ONLY the existing centered title, subtitle, and locked top-right brand are overlaid.
// No white/ivory header, divider, separate image slot, border, or colored text box.
import {TOKENS,logoSvg,tspanBlock,wrap,escapeXml} from './generate-facility-infographic.mjs';

export const FULLBLEED_LAYOUT=Object.freeze({
  canvasWidth:1440,canvasHeight:1080,centerX:720,
  titleY:TOKENS.title.top,titleLineHeight:TOKENS.title.lineHeight,
  subtitleGap:TOKENS.subtitle.gap,subtitleLineHeight:TOKENS.subtitle.lineHeight,
  titleCapacity:20.4,subtitleCapacity:40,
  logoX:TOKENS.logo.x,logoY:TOKENS.logo.y,
  fontSizeStatus:'PROVISIONAL — review composed image before approving type scale'
});

export function fullBleedGeometry(spec){
  if(!spec || !['string','object'].includes(typeof spec.title) || !['string','object'].includes(typeof spec.subtitle))
    throw Error('Title and subtitle are required');
  const title=wrap(spec.title,FULLBLEED_LAYOUT.titleCapacity,TOKENS.title.maxLines,'fullbleed title');
  const subtitle=wrap(spec.subtitle,FULLBLEED_LAYOUT.subtitleCapacity,TOKENS.subtitle.maxLines,'fullbleed subtitle');
  const subY=FULLBLEED_LAYOUT.titleY+title.length*FULLBLEED_LAYOUT.titleLineHeight+FULLBLEED_LAYOUT.subtitleGap;
  return {title,subtitle,subY};
}

export function renderFullBleedOverlay(spec){
  const g=fullBleedGeometry(spec),c=TOKENS.colors;
  const label=Array.isArray(spec.title)?spec.title.join(' '):spec.title;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1080" viewBox="0 0 1440 1080" role="img" aria-label="'+escapeXml(label)+'">',
    '<title>'+escapeXml(label)+'</title>',
    '<g id="fullbleed-foreground" font-family="Noto Sans CJK KR,NanumSquare,Noto Sans KR,Apple SD Gothic Neo,Malgun Gothic,sans-serif">',
    '<g id="header-fixed">',
    tspanBlock(g.title,720,140,TOKENS.typography.title,TOKENS.title.lineHeight,c.ink,700,'middle'),
    tspanBlock(g.subtitle,720,g.subY,TOKENS.typography.subtitle,TOKENS.subtitle.lineHeight,c.muted,400,'middle'),
    '</g>',
    '<g id="brand-fixed">',logoSvg(),'</g>',
    '</g></svg>'
  ].join('');
}

export async function composeFullBleedHero(spec,backgroundBytes,options={}){
  const {default:sharp}=await import('sharp');
  if(!Buffer.isBuffer(backgroundBytes)||backgroundBytes.length<64||backgroundBytes.length>20000000)
    throw Error('Full-bleed background must be a nonempty raster (max 20MB)');
  const src=sharp(backgroundBytes,{limitInputPixels:50000000,failOn:'error'});
  const meta=await src.metadata();
  if(!['png','jpeg','webp'].includes(meta.format))throw Error('Use PNG/JPEG/WebP background, not SVG');
  const ratio=meta.width/meta.height;
  if(Math.abs(ratio-4/3)>0.025)throw Error('Background must already be composed at 4:3; do not crop artwork during templating');
  const bg=await sharp(backgroundBytes).resize(1440,1080,{fit:'fill'}).png().toBuffer();
  const overlay=Buffer.from(renderFullBleedOverlay(spec),'utf8');
  const output=await sharp(bg).composite([{input:overlay,top:0,left:0}]).webp({quality:options.quality||90,effort:6}).toBuffer();
  return output;
}

if(process.argv[1] && import.meta.url===(await import('node:url')).pathToFileURL((await import('node:path')).resolve(process.argv[1])).href){
  const {readFileSync,writeFileSync}=await import('node:fs');
  const [input,flag,source,target]=process.argv.slice(2);
  if(!input||!['--overlay','--compose'].includes(flag)||!source|| (flag==='--compose'&&!target))
    throw Error('Usage: node scripts/render-facility-thumbnail-fullbleed.mjs spec.json --overlay output.svg | spec.json --compose background.png output.webp');
  const spec=JSON.parse(readFileSync(input,'utf8'));
  if(flag==='--overlay')writeFileSync(source,renderFullBleedOverlay(spec),'utf8');
  else writeFileSync(target,await composeFullBleedHero(spec,readFileSync(source)));
}

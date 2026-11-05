// Facility hero/thumbnail master: shared typography/branding, independently centered header.
// The sole variable visual layer is a separately authored PNG/JPEG/WebP inside the safe region.
import { TOKENS, logoSvg, tspanBlock, wrap, rect, escapeXml } from './generate-facility-infographic.mjs';

export const HERO_LAYOUT = Object.freeze({
  canvasWidth: 1440, canvasHeight: 1080,
  frame: {x:22,y:22,width:1396,height:1036,radius:30},
  header: {centerX:720, anchor:'middle', titleCapacity:20.4, subtitleCapacity:40},
  art: {x:80, bottom:1000, padding:18, radius:28, gapBelowRule:48, minHeight:450},
  collage: {gap:18, leftFraction:0.62, radius:18, names:['메인 장면','보조 장면 위','보조 장면 아래']},
  rule: {x1:80,x2:1360,width:4},
});

export function heroGeometry(spec) {
  const validText = v => typeof v === 'string' || (Array.isArray(v) && v.length>0 && v.every(line => typeof line === 'string'));
  if (!spec || !validText(spec.title) || !validText(spec.subtitle)) {
    throw Error('A title and subtitle are required as text or explicit text lines');
  }
  const variant = spec.variant ?? 'illustration';
  if (!['illustration','collage'].includes(variant)) throw Error('Unsupported hero variant: register and approve a new template first');
  const title = wrap(spec.title,HERO_LAYOUT.header.titleCapacity,TOKENS.title.maxLines,'hero title');
  const subtitle = wrap(spec.subtitle,HERO_LAYOUT.header.subtitleCapacity,TOKENS.subtitle.maxLines,'hero subtitle');
  const subTop = TOKENS.title.top + title.length*TOKENS.title.lineHeight + TOKENS.subtitle.gap;
  const ruleY = subTop + subtitle.length*TOKENS.subtitle.lineHeight + TOKENS.content.ruleGap;
  const artTop = ruleY + HERO_LAYOUT.art.gapBelowRule;
  const box = {x:HERO_LAYOUT.art.x,y:artTop,width:1280,height:HERO_LAYOUT.art.bottom-artTop};
  if (box.height < HERO_LAYOUT.art.minHeight) {
    throw Error('Hero header too tall: graphic area below safe minimum; shorten copy');
  }
  const inset = HERO_LAYOUT.art.padding;
  const safe = {x:box.x+inset,y:box.y+inset,width:box.width-2*inset,height:box.height-2*inset};
  const {gap,leftFraction} = HERO_LAYOUT.collage;
  const leftWidth=Math.round((safe.width-gap)*leftFraction);
  const rightWidth=safe.width-gap-leftWidth;
  const rightHeight=(safe.height-gap)/2;
  const collageSlots=[
    {x:safe.x,y:safe.y,width:leftWidth,height:safe.height},
    {x:safe.x+leftWidth+gap,y:safe.y,width:rightWidth,height:rightHeight},
    {x:safe.x+leftWidth+gap,y:safe.y+rightHeight+gap,width:rightWidth,height:rightHeight}
  ];
  return {title,subtitle,subTop,ruleY,box,safe,variant,collageSlots};
}

export function renderFacilityThumbnail(spec,{graphicHref=null,graphicHrefs=null,preview=false,artworkComposition=false}={}) {
  const layout=heroGeometry(spec);
  const c=TOKENS.colors;
  const collage=layout.variant==='collage';
  if (artworkComposition && (preview || graphicHref || graphicHrefs || !('graphicCrop' in spec) || !spec.graphicCrop)) throw Error('Artwork composition requires a crop spec and an empty production shell');
  if (artworkComposition && collage) throw Error('Artwork composition is not registered for collages');
  const validRasterHref = href => typeof href==='string' && /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(href) && href.length<=14500000;
  if (collage) {
    if (graphicHref) throw Error('Collage requires 3 distinct raster graphicHrefs, not a single graphicHref');
    if (preview && graphicHrefs) throw Error('Preview mode and final collage graphics are mutually exclusive');
    if (!preview && (!Array.isArray(graphicHrefs)||graphicHrefs.length!==3)) throw Error('Provide exactly 3 main collage graphics for a final thumbnail');
    if (graphicHrefs && (!Array.isArray(graphicHrefs)||graphicHrefs.length!==3||!graphicHrefs.every(validRasterHref))) {
      throw Error('Collage requires exactly 3 bounded embedded PNG/JPEG/WebP images');
    }
  } else {
    if (graphicHrefs) throw Error('Illustration template accepts exactly 1 raster graphic, not a collage');
    if (!preview && !graphicHref && !artworkComposition) throw Error('Provide the main graphic to render a final thumbnail. Use preview:true only for wireframes.');
    if (preview && graphicHref) throw Error('Preview mode and a final graphic are mutually exclusive');
    if (graphicHref && !validRasterHref(graphicHref)) throw Error('Only bounded embedded PNG/JPEG/WebP images are permitted');
  }
  const {box,safe}=layout;
  const crop=spec.graphicCrop||null;
  if (crop && collage) throw Error('graphicCrop is only supported for the single-illustration template');
  if (crop && (!Number.isInteger(crop.sourceWidth)||!Number.isInteger(crop.sourceHeight)
    ||![crop.x,crop.y,crop.width,crop.height].every(Number.isFinite)
    ||crop.sourceWidth<1||crop.sourceHeight<1||crop.x<0||crop.y<0||crop.width<=0||crop.height<=0
    ||crop.x+crop.width>crop.sourceWidth||crop.y+crop.height>crop.sourceHeight))
    throw Error('graphicCrop must be a valid rectangle contained in the source image');
  const cropScale=crop?Math.min(safe.width/crop.width,safe.height/crop.height):null;
  const cropImage=crop?{
    x:Number((safe.x+(safe.width-crop.width*cropScale)/2-crop.x*cropScale).toFixed(4)),
    y:Number((safe.y+(safe.height-crop.height*cropScale)/2-crop.y*cropScale).toFixed(4)),
    width:Number((crop.sourceWidth*cropScale).toFixed(4)),
    height:Number((crop.sourceHeight*cropScale).toFixed(4))
  }:null;
  const accessibleTitle=Array.isArray(spec.title)?spec.title.join(' '):spec.title;
  const background=[
    rect(0,0,1440,1080,0,c.background),
    '<path d="M0 365Q360 420 670 0H0Z" fill="#E9F5E6" opacity=".75"/>',
    '<path d="M1440 740Q1220 780 1240 1080H1440Z" fill="#E5F1E0" opacity=".6"/>',
    rect(22,22,1396,1036,30,'none',c.border),
  ].join('');
  const artGroup = collage
    ? '<g id="collage-graphic-layout" data-variant="collage">'
      + layout.collageSlots.map((slot,i)=>{
        const x=slot.x,y=slot.y,w=slot.width,h=slot.height,clip='collage-graphic-clip-'+(i+1);
        if (preview) {
          return '<g class="collage-preview-slot" data-slot="'+(i+1)+'">'
            + '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="18" fill="#F1F8F1" stroke="#9DC5A8" stroke-width="3" stroke-dasharray="12 10"/>'
            + '<text x="'+(x+w/2)+'" y="'+(y+h/2-10)+'" text-anchor="middle" font-size="30" font-weight="700" fill="'+c.ink+'">'+HERO_LAYOUT.collage.names[i]+'</text>'
            + '<text x="'+(x+w/2)+'" y="'+(y+h/2+31)+'" text-anchor="middle" font-size="20" fill="'+c.muted+'">그래픽 '+(i+1)+' / 3</text>'
            + '</g>';
        }
        return '<image id="main-graphic-'+(i+1)+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" href="'+graphicHrefs[i]+'" preserveAspectRatio="xMidYMid meet" clip-path="url(#'+clip+')" aria-hidden="true"/>';
      }).join('')+'</g>'
    : artworkComposition
    ? '<g id="main-graphic-composition-slot" data-artwork-layer="external-raster-by-sharp"/>'
    : preview
    ? '<g id="graphic-preview-placeholder">'
      + '<rect x="'+safe.x+'" y="'+safe.y+'" width="'+safe.width+'" height="'+safe.height+'" rx="18" fill="#F1F8F1" stroke="#9DC5A8" stroke-width="3" stroke-dasharray="12 10"/>'
      + '<g transform="translate(658 '+(safe.y+safe.height/2-85)+')" fill="none" stroke="#7DA88A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect width="124" height="89" rx="12"/><circle cx="91" cy="27" r="11"/><path d="M13 71l29-30 20 20 17-15 32 26"/></g>'
      + '<text x="720" y="'+(safe.y+safe.height/2+38)+'" text-anchor="middle" font-size="38" font-weight="700" fill="'+c.ink+'">메인 그래픽 교체 영역</text>'
      + '<text x="720" y="'+(safe.y+safe.height/2+93)+'" text-anchor="middle" font-size="25" fill="'+c.muted+'">완성된 일러스트 · 사진 · 시각자료만 배치</text>'
      + '</g>'
    : '<image id="main-graphic" x="'+(cropImage?cropImage.x:safe.x)+'" y="'+(cropImage?cropImage.y:safe.y)+'" width="'+(cropImage?cropImage.width:safe.width)+'" height="'+(cropImage?cropImage.height:safe.height)+'" href="'+graphicHref+'" preserveAspectRatio="'+(cropImage?'none':'xMidYMid meet')+'" clip-path="url(#graphic-safe-clip)" aria-hidden="true"/>';
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1080" viewBox="0 0 1440 1080" role="img" aria-label="'+escapeXml(accessibleTitle)+'">',
    '<title>'+escapeXml(accessibleTitle)+'</title>',
    '<defs><clipPath id="graphic-safe-clip"><rect x="'+safe.x+'" y="'+safe.y+'" width="'+safe.width+'" height="'+safe.height+'" rx="18"/></clipPath>'
      + (collage?layout.collageSlots.map((slot,i)=>'<clipPath id="collage-graphic-clip-'+(i+1)+'"><rect x="'+slot.x+'" y="'+slot.y+'" width="'+slot.width+'" height="'+slot.height+'" rx="'+HERO_LAYOUT.collage.radius+'"/></clipPath>').join(''):'')
      + '</defs>',
    background,
    '<g font-family="Noto Sans CJK KR,NanumSquare,Noto Sans KR,Apple SD Gothic Neo,Malgun Gothic,sans-serif">',
    '<g id="brand-fixed">',logoSvg(),'</g>',
    '<g id="header-fixed">',
    tspanBlock(layout.title,HERO_LAYOUT.header.centerX,TOKENS.title.top,TOKENS.typography.title,TOKENS.title.lineHeight,c.ink,700,HERO_LAYOUT.header.anchor),
    tspanBlock(layout.subtitle,HERO_LAYOUT.header.centerX,layout.subTop,TOKENS.typography.subtitle,TOKENS.subtitle.lineHeight,c.muted,400,HERO_LAYOUT.header.anchor),
    '<path d="M80 '+layout.ruleY+'H1360" stroke="'+c.rule+'" stroke-width="'+HERO_LAYOUT.rule.width+'" stroke-linecap="round"/>',
    '</g>',
    '<g id="graphic-safe-area" data-variant="'+layout.variant+'" data-x="'+safe.x+'" data-y="'+safe.y+'" data-width="'+safe.width+'" data-height="'+safe.height+'">',
    rect(box.x,box.y,box.width,box.height,box.radius||HERO_LAYOUT.art.radius,'#FFFFFF',c.border),
    artGroup,
    '</g>',
    '</g></svg>'
  ].join('');
}

// The graphic is a self-contained raster asset. Reject SVG/HTML/remote sources to avoid
// embedded text/branding scripts or network dependency in the exported SVG.
export function rasterToDataUri(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length<16 || bytes.length>10000000) throw Error('Graphic must be a 16B–10MB raster file');
  let mime;
  if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) mime='image/png';
  else if (bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) mime='image/jpeg';
  else if (bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') mime='image/webp';
  else throw Error('Unsupported raster; use PNG, JPEG or WebP');
  return 'data:'+mime+';base64,'+bytes.toString('base64');
}

if (process.argv[1] && import.meta.url === (await import('node:url')).pathToFileURL((await import('node:path')).resolve(process.argv[1])).href) {
  const {readFileSync,writeFileSync}=await import('node:fs');
  const {resolve}=await import('node:path');
  const [input,output,flag,...artPaths]=process.argv.slice(2);
  if (!input || !output || !['--preview','--art','--collage'].includes(flag)) {
    throw Error('Usage: node scripts/generate-facility-thumbnail.mjs spec.json output.svg --preview | --art illustration.png | --collage scene1.png scene2.png scene3.png');
  }
  if (flag==='--art' && artPaths.length!==1) throw Error('Illustration requires exactly 1 art file');
  if (flag==='--collage' && artPaths.length!==3) throw Error('Collage requires exactly 3 art files');
  if (flag==='--preview' && artPaths.length) throw Error('Do not provide art in preview mode');
  const spec=JSON.parse(readFileSync(resolve(input),'utf8'));
  if (flag==='--art' && spec.variant==='collage') throw Error('Use --collage for the collage template');
  if (flag==='--collage' && spec.variant!=='collage') throw Error('Set spec.variant to collage for --collage');
  const svg=renderFacilityThumbnail(spec,{
    preview:flag==='--preview',
    graphicHref:flag==='--art'?rasterToDataUri(readFileSync(resolve(artPaths[0]))):null,
    graphicHrefs:flag==='--collage'?artPaths.map(p=>rasterToDataUri(readFileSync(resolve(p)))):null
  });
  writeFileSync(resolve(output),svg,'utf8');
}

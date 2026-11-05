// GetPassLab facility infographic fixed-layout SVG renderer. Node built-ins only.
export const TOKENS = {
  "canvas": {
    "width": 1440,
    "height": 1080
  },
  "colors": {
    "background": "#F8FCF7",
    "ink": "#114935",
    "muted": "#52665B",
    "border": "#B7D6BD",
    "soft": "#E9F5E6",
    "card": "#FFFFFF",
    "rule": "#76B978",
    "brand": "#114935"
  },
  "typography": {
    "title": 64,
    "subtitle": 30,
    "logo": 24,
    "cardTitle": 36,
    "cardSub": 24,
    "detail": 23,
    "footer": 28
  },
  "title": {
    "x": 80,
    "top": 140,
    "lineHeight": 74,
    "maxLines": 2
  },
  "subtitle": {
    "x": 80,
    "gap": 16,
    "lineHeight": 40,
    "maxLines": 2
  },
  "logo": {
    "x": 1200,
    "y": 44,
    "width": 210,
    "height": 34,
    "markHeight": 28,
    "markWidth": 40,
    "gap": 8
  },
  "content": {
    "left": 80,
    "right": 1360,
    "bottom": 894,
    "ruleGap": 30,
    "cardGap": 20,
    "cardBelowRule": 38,
    "fourCardHeight": 236,
    "fourCardMinHeight": 230
  },
  "footer": {
    "x": 80,
    "y": 930,
    "width": 1280,
    "height": 85
  }
};

function escapeXml(v){return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}

function units(str){let n=0;for(const c of [...str]){if(c===" ")n+=.34;else if(/[A-Za-z0-9]/.test(c))n+=.58;else if(/[.,:;!?/()\-]/.test(c))n+=.43;else n+=.94;}return n;}

function wrap(str,capacity,maxLines,label){const arr=Array.isArray(str)?str.map(String):[];if(arr.length){if(arr.length>maxLines||arr.some(s=>units(s)>capacity))throw Error(label+" exceeds available width/lines");return arr;}const words=String(str||"").trim().split(/\s+/).filter(Boolean);if(!words.length)throw Error(label+" is required");let lines=[],line="";for(const word of words){if(units(word)>capacity)throw Error(label+": unbreakable segment too long: "+word);const test=line?line+" "+word:word;if(units(test)>capacity&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);if(lines.length>maxLines)throw Error(label+" requires "+lines.length+" lines; shorten copy or make separate layout");return lines;}

function tspanBlock(values,x,y,fontSize,lineHeight,color,weight,anchor){const a=anchor||"start";return '<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+fontSize+'" font-weight="'+weight+'" text-anchor="'+a+'" dominant-baseline="hanging">'+values.map((s,i)=>'<tspan x="'+x+'" dy="'+(i?lineHeight:0)+'">'+escapeXml(s)+'</tspan>').join("")+'</text>';}

function iconSvg(name,cx,cy,s){const color="#12523C";const shared='fill="none" stroke="'+color+'" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"';const x=cx-s/2,y=cy-s/2;let p='';if(name==="building"){p='<rect x="20" y="10" width="64" height="88" rx="4"/><path d="M32 30h9M53 30h9M74 30h1M32 52h9M53 52h9M74 52h1M42 98V76h20v22"/>';}else if(name==="people"){p='<circle cx="52" cy="32" r="13"/><circle cx="22" cy="43" r="10"/><circle cx="82" cy="43" r="10"/><path d="M23 88q5-33 29-33t29 33M6 88q3-24 19-26M98 88Q95 64 81 62"/>';}else if(name==="tools"){p='<path d="M25 10L91 91M85 14L16 87M17 16l16 17M70 79l18 18" /><circle cx="23" cy="19" r="10" />';}else if(name==="document"){p='<rect x="26" y="8" width="55" height="93" rx="7"/><path d="M40 34h27M40 52h27M40 70h27"/>';}else if(name==="check"){p='<circle cx="52" cy="52" r="43"/><path d="M29 52l14 15 30-33"/>';}else{p='<circle cx="52" cy="52" r="43"/><path d="M52 24v56M25 52h54"/>';}return '<g transform="translate('+x+' '+y+') scale('+(s/104)+')" '+shared+'>'+p+'</g>';}

function logoSvg(){return '<g id="gpl-brand" transform="translate('+TOKENS.logo.x+' '+TOKENS.logo.y+')"><g transform="scale(.109)"><path fill="'+TOKENS.colors.brand+'" d="M355 22C349 6 335 0 319 0H163C120 0 90 17 58 82C40 122 22 165 0 216C68 156 145 120 243 95C293 82 333 85 349 85L359 51C362 37 360 28 355 22Z"/><path fill="'+TOKENS.colors.brand+'" d="M346 98C264 110 198 134 141 175C108 198 86 226 65 257H245C281 257 302 236 315 201L346 98Z"/></g><text x="48" y="28" font-size="'+TOKENS.typography.logo+'" font-weight="600" fill="'+TOKENS.colors.brand+'">GetPassLab</text></g>';}

function rect(x,y,w,h,rx,fill,stroke){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+(stroke||"none")+'" stroke-width="2"/>';}

function cardSvg(c,g,i,count){const x=g.x,y=g.y,w=g.w,h=g.h;const compact=count===4;const titleSize=compact?30:count===3?32:36;const subSize=compact?22:24;const title=wrap(c.title,(w-75)/titleSize,1,"card "+(i+1)+" title");const summary=wrap(c.summary||"",(w-75)/subSize,2,"card "+(i+1)+" summary");const items=(c.details||[]).slice(0,compact?0:count===3?2:3);let out='<g class="card card-'+(i+1)+'">'+rect(x,y,w,h,30,TOKENS.colors.card,TOKENS.colors.border);out+='<circle cx="'+(x+38)+'" cy="'+(y+38)+'" r="28" fill="'+TOKENS.colors.ink+'"/><text x="'+(x+38)+'" y="'+(y+47)+'" font-size="25" fill="#FFFFFF" text-anchor="middle">'+String(i+1).padStart(2,"0")+'</text>';if(compact){out+=iconSvg(c.icon||"building",x+108,y+110,72);out+=tspanBlock(title,x+200,y+55,titleSize,37,TOKENS.colors.ink,700);out+=tspanBlock(summary,x+200,y+111,subSize,27,TOKENS.colors.muted,400);out+=rect(x+24,y+h-64,w-48,44,20,TOKENS.colors.soft);out+=tspanBlock(wrap(c.action||"확인할 항목", (w-95)/21,1,"card action"),x+w/2,y+h-53,21,26,TOKENS.colors.ink,700,"middle");}else if(count===1){out+=iconSvg(c.icon||"building",x+w/2,y+125,118);out+=tspanBlock(title,x+w/2,y+216,45,55,TOKENS.colors.ink,700,"middle");out+=tspanBlock(summary,x+w/2,y+282,29,39,TOKENS.colors.muted,400,"middle");items.forEach((s,j)=>{out+='<circle cx="'+(x+w/2-230)+'" cy="'+(y+354+j*43)+'" r="6" fill="'+TOKENS.colors.ink+'"/>'+tspanBlock(wrap(s,27,1,"detail"),x+w/2-208,y+341+j*43,27,34,TOKENS.colors.ink,400);});out+=rect(x+100,y+h-95,w-200,64,30,TOKENS.colors.soft);out+=tspanBlock(wrap(c.action||"핵심 확인 항목",36,1,"card action"),x+w/2,y+h-76,28,34,TOKENS.colors.ink,700,"middle");}else{out+=iconSvg(c.icon||"building",x+w/2,y+118,count===3?105:120);out+=tspanBlock(title,x+w/2,y+202,titleSize,44,TOKENS.colors.ink,700,"middle");out+=tspanBlock(summary,x+w/2,y+263,subSize,32,TOKENS.colors.muted,400,"middle");items.forEach((s,j)=>{out+='<circle cx="'+(x+42)+'" cy="'+(y+331+j*39)+'" r="6" fill="'+TOKENS.colors.ink+'"/>'+tspanBlock(wrap(s,(w-100)/21,1,"detail"),x+61,y+320+j*39,21,28,TOKENS.colors.ink,400);});out+=rect(x+22,y+h-81,w-44,57,25,TOKENS.colors.soft);out+=tspanBlock(wrap(c.action||"확인할 항목",(w-84)/22,1,"card action"),x+w/2,y+h-66,22,27,TOKENS.colors.ink,700,"middle");}return out+"</g>";}

function cardRects(count,top){const l=TOKENS.content.left,r=TOKENS.content.right,b=TOKENS.content.bottom,g=TOKENS.content.cardGap,w=r-l;if(count===4){const ww=(w-g)/2,available=(b-top-g)/2;if(available<TOKENS.content.fourCardMinHeight)throw Error("Four-card header too tall: shorten title/subtitle");const hh=Math.min(TOKENS.content.fourCardHeight,available);return [{x:l,y:top,w:ww,h:hh},{x:l+ww+g,y:top,w:ww,h:hh},{x:l,y:top+hh+g,w:ww,h:hh},{x:l+ww+g,y:top+hh+g,w:ww,h:hh}];}const ww=(w-g*(count-1))/count;return Array.from({length:count},(_,i)=>({x:l+(ww+g)*i,y:top,w:ww,h:b-top}));}

function renderInfographic(spec){if(!spec||!Array.isArray(spec.cards)||spec.cards.length<1||spec.cards.length>4)throw Error("cards length must be 1..4");const title=wrap(spec.title,20.4,2,"title");const subtitle=wrap(spec.subtitle,40,2,"subtitle");const c=TOKENS.colors;const titleTop=TOKENS.title.top;const subTop=titleTop+title.length*TOKENS.title.lineHeight+TOKENS.subtitle.gap;const ruleY=subTop+subtitle.length*TOKENS.subtitle.lineHeight+TOKENS.content.ruleGap;const cardTop=ruleY+TOKENS.content.cardBelowRule;if(cardTop>460)throw Error("Header is too tall: shorten title/subtitle");const cards=cardRects(spec.cards.length,cardTop);const markup=['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1080" viewBox="0 0 1440 1080" role="img" aria-label="'+escapeXml(spec.title)+'">','<title>'+escapeXml(spec.title)+'</title>',rect(0,0,1440,1080,0,c.background),'<path d="M0 365Q360 420 670 0H0Z" fill="#E9F5E6" opacity=".75"/>',rect(22,22,1396,1036,30,"none",c.border),'<g font-family="Noto Sans CJK KR,NanumSquare,Noto Sans KR,Apple SD Gothic Neo,Malgun Gothic,sans-serif">',logoSvg(),'<g id="header-fixed">',tspanBlock(title,80,titleTop,64,74,c.ink,700),tspanBlock(subtitle,80,subTop,30,40,c.muted,400),'<path d="M80 '+ruleY+'H1360" stroke="'+c.rule+'" stroke-width="4" stroke-linecap="round"/></g>','<g id="body-cards" data-count="'+spec.cards.length+'" data-top="'+cardTop+'">',...spec.cards.map((v,i)=>cardSvg(v,cards[i],i,spec.cards.length)),'</g>','<g id="footer-fixed">',rect(TOKENS.footer.x,TOKENS.footer.y,TOKENS.footer.width,TOKENS.footer.height,32,c.soft),tspanBlock(wrap(spec.takeaway||"기억할 것 | 실제 조건을 먼저 확인",40,1,"takeaway"),720,950,28,34,c.ink,700,"middle"),'</g>','</g></svg>'].join("");return markup;}

export { renderInfographic, cardRects, logoSvg, tspanBlock, wrap, rect, escapeXml };

// Optional CLI: node scripts/generate-facility-infographic.mjs spec.json output.svg
if (process.argv[1] && import.meta.url === new URL("file://" + process.argv[1]).href) {
  const { readFileSync, writeFileSync } = await import("node:fs");
  const [input,output] = process.argv.slice(2);
  if (!input || !output) throw Error("Usage: node scripts/generate-facility-infographic.mjs spec.json output.svg");
  writeFileSync(output,renderInfographic(JSON.parse(readFileSync(input,"utf8"))),"utf8");
}

// Compact spacing profile over the canonical renderer. Existing approved
// 4:3 assets keep their original renderer and byte-for-byte reproduction.
import {renderInfographic as renderBase,cardRects,TOKENS,wrap,rect} from './generate-facility-infographic.mjs';

export function infographicLayout(spec){
  const title=wrap(spec.title,20.4,2,'title');
  const subtitle=wrap(spec.subtitle,40,2,'subtitle');
  const top=TOKENS.title.top+title.length*TOKENS.title.lineHeight+TOKENS.subtitle.gap
    +subtitle.length*TOKENS.subtitle.lineHeight+TOKENS.content.ruleGap+TOKENS.content.cardBelowRule;
  const count=spec.cards.length,baseCards=cardRects(count,top);
  let reduction=0,previousGap=null;
  if(spec.cardSpacing==='compact'&&count<4){
    // Reserve the full final text line, then halve the common empty space.
    // Use the longest card in the row so all labels remain aligned.
    const contentBottom=Math.max(...spec.cards.map(c=>{
      const lines=wrap(c.summary||'',(baseCards[0].w-75)/24,2,'summary').length;
      const summaryBottom=(count===1?282:263)+(lines-1)*(count===1?39:32)+(count===1?39:32);
      const details=(c.details||[]).slice(0,count===3?2:3).length;
      return details?(count===1?341:320)+(details-1)*(count===1?43:39)+(count===1?34:28):summaryBottom;
    }));
    previousGap=baseCards[0].h-(count===1?95:81)-contentBottom;
    reduction=Math.max(0,Math.min(Math.floor(previousGap/2),previousGap-24));
  }
  return {top,reduction,previousGap,gap:previousGap===null?null:previousGap-reduction,
    width:TOKENS.canvas.width,height:TOKENS.canvas.height-reduction,
    baseCards,cards:baseCards.map(r=>({...r,h:r.h-reduction})),
    footer:{...TOKENS.footer,y:TOKENS.footer.y-reduction}};
}

export function renderInfographic(spec){
  let svg=renderBase(spec);
  if(spec.cardSpacing!=='compact')return svg;
  const layout=infographicLayout(spec),count=spec.cards.length,c=TOKENS.colors;
  const replaceOnce=(before,after)=>{
    if(!svg.includes(before))throw Error('Canonical template changed; compact spacing needs review');
    svg=svg.replace(before,after);
  };
  if(layout.reduction){
    for(let i=0;i<count;i++){
      const a=layout.baseCards[i],b=layout.cards[i];
      replaceOnce('<g class="card card-'+(i+1)+'">'+rect(a.x,a.y,a.w,a.h,30,c.card,c.border),
        '<g class="card card-'+(i+1)+'">'+rect(b.x,b.y,b.w,b.h,30,c.card,c.border));
      const inset=count===1?100:22,offset=count===1?95:81,height=count===1?64:57,radius=count===1?30:25;
      replaceOnce(rect(a.x+inset,a.y+a.h-offset,a.w-2*inset,height,radius,c.soft),
        rect(b.x+inset,b.y+b.h-offset,b.w-2*inset,height,radius,c.soft));
    }
    let labels=0;
    svg=svg.replace(/<text class="centered-label"[^>]*>/g,tag=>{
      labels++;
      return tag.replace(/(data-center-y|y)="([\d.]+)"/g,(_,key,y)=>`${key}="${Number(y)-layout.reduction}"`);
    });
    if(labels!==count+1)throw Error('Unexpected label count');
    const f=TOKENS.footer;
    replaceOnce(rect(f.x,f.y,f.width,f.height,32,c.soft),rect(f.x,layout.footer.y,f.width,f.height,32,c.soft));
    replaceOnce('width="1440" height="1080" viewBox="0 0 1440 1080"',
      `width="1440" height="${layout.height}" viewBox="0 0 1440 ${layout.height}"`);
    replaceOnce(rect(0,0,1440,1080,0,c.background),rect(0,0,1440,layout.height,0,c.background));
    replaceOnce(rect(22,22,1396,1036,30,'none',c.border),rect(22,22,1396,layout.height-44,30,'none',c.border));
  }
  return svg.replace('role="img"',`data-spacing="compact" data-reduction="${layout.reduction}" role="img"`);
}

if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
  const {readFileSync,writeFileSync}=await import('node:fs');
  const [input,output]=process.argv.slice(2);
  if(!input||!output)throw Error('Usage: node scripts/generate-facility-compact-infographic.mjs spec.json output.svg');
  writeFileSync(output,renderInfographic({...JSON.parse(readFileSync(input,'utf8')),cardSpacing:'compact'}));
}

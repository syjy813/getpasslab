// Content-preserving 4–6 card sheets. Helpers and pictograms come from the
// canonical renderer; legacy 1–4 templates keep their exact SVG bytes.
import {semanticIconSvg} from './facility-pictograms.mjs';
import {EXTRA_PICTOGRAMS} from './facility-pictograms-extended.mjs';
export function overviewLayout(spec, {TOKENS, wrap}) {
  const count = spec?.cards?.length;
  if (!Number.isInteger(count) || count < 4 || count > 6) throw Error('Overview cards length must be 4..6');
  if (spec.viewport !== undefined && !['desktop', 'mobile'].includes(spec.viewport)) throw Error('Unknown overview viewport');
  const mobile = spec.viewport === 'mobile';
  const width = mobile ? 720 : 1440;
  const margin = mobile ? 32 : TOKENS.content.left;
  const columns = mobile ? 1 : 2;
  const gap = mobile ? 20 : 24;
  const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
  const type = mobile
    ? {title:44, subtitle:32, cardTitle:40, summary:32, detail:32, action:32, footer:32}
    : {title:TOKENS.typography.title, subtitle:TOKENS.typography.subtitle, cardTitle:36, summary:28, detail:28, action:28, footer:28};
  const titleTop = mobile ? 104 : TOKENS.title.top;
  const titleLine = mobile ? 54 : TOKENS.title.lineHeight;
  const subtitleLine = mobile ? 42 : TOKENS.subtitle.lineHeight;
  const title = wrap(spec.title, (width - margin * 2) / type.title, 2, 'overview title');
  const subtitle = wrap(spec.subtitle, (width - margin * 2) / type.subtitle, 2, 'overview subtitle');
  const subtitleTop = titleTop + title.length * titleLine + 16;
  const ruleY = subtitleTop + subtitle.length * subtitleLine + 28;
  const top = ruleY + 32;
  const content = spec.cards.map((card, i) => {
    if (!card || !Array.isArray(card.details || [])) throw Error('Card details must be an array');
    if ((card.details || []).length > 3) throw Error('Overview supports at most 3 details; no content is silently dropped');
    const titleX = mobile ? 140 : 166;
    const summaryTop = mobile ? 106 : 102;
    const title = wrap(card.title, (cardWidth - titleX - 28) / type.cardTitle, 1, 'card '+(i+1)+' title');
    const summary = wrap(card.summary, (cardWidth - titleX - 28) / type.summary, 2, 'card '+(i+1)+' summary');
    let cursor = Math.max(mobile ? 186 : 176, summaryTop + summary.length * (mobile ? 42 : 38) + 24);
    const details = (card.details || []).map(detail => {
      const lines = wrap(detail, (cardWidth - 88) / type.detail, 2, 'card '+(i+1)+' detail');
      const entry = {lines, top:cursor};
      cursor += lines.length * (mobile ? 42 : 38) + 12;
      return entry;
    });
    if (details.length) cursor -= 12;
    const action = wrap(card.action || '확인할 항목', (cardWidth - 80) / type.action, 2, 'card '+(i+1)+' action');
    const actionHeight = action.length * (mobile ? 42 : 38) + 22;
    const actionTop = cursor + 24;
    return {title, summary, summaryTop, titleX, details, action, actionHeight, actionTop,
      h:actionTop + actionHeight + 22};
  });
  const cards = [];
  let y = top;
  for (let i = 0; i < count; i += columns) {
    const rowHeight = Math.max(...content.slice(i, i + columns).map(c => c.h));
    for (let col = 0; col < columns && i + col < count; col++) {
      // Keep the fifth card at the same width; centre the incomplete final row.
      const x = columns === 2 && i === count - 1 ? (width - cardWidth) / 2 : margin + col * (cardWidth + gap);
      cards.push({x, y, w:cardWidth, h:rowHeight, ...content[i+col],
        h:rowHeight, actionTop:rowHeight - content[i+col].actionHeight - 22});
    }
    y += rowHeight + gap;
  }
  const takeaways = Array.isArray(spec.takeaway) ? spec.takeaway : [spec.takeaway || '실제 조건과 담당 범위를 함께 확인'];
  const takeaway = takeaways.flatMap(line=>{
    const lines=wrap(line,(width-margin*2-48)/type.footer,3,'overview takeaway');
    // Avoid leaving a short Korean ending alone on the last line.
    if(lines.length>1 && lines.at(-1).length<4) {
      const words=lines.at(-2).split(' ');
      if(words.length>1) {lines[lines.length-1]=words.pop()+' '+lines.at(-1);lines[lines.length-2]=words.join(' ');}
    }
    return lines;
  });
  if(takeaway.length>(mobile?6:3))throw Error('Overview takeaway is too long');
  const footer = {x:margin, y:y-gap+28, w:width-margin*2, h:takeaway.length*(mobile?42:38)+28};
  return {mobile, width, height:footer.y+footer.h+40, margin, columns, gap, type,
    titleTop, titleLine, subtitleLine, title, subtitle, subtitleTop, ruleY, top,
    cards, takeaway, footer};
}

export function renderOverview(spec, helpers) {
  const {TOKENS, escapeXml, rect, tspanBlock, logoSvg, iconSvg, centeredLine} = helpers;
  const layout = overviewLayout(spec, helpers);
  const {width, height, mobile, type, margin} = layout;
  const c = TOKENS.colors;
  const lineHeight = mobile ? 42 : 38;
  const centered = (lines, x, top, size, leading) => lines.length === 1
    ? centeredLine(lines, x, top + leading / 2, size, c.ink)
    : tspanBlock(lines, x, top, size, leading, c.ink, 700, 'middle');
  const brand = mobile ? '<g transform="translate(-17 8) scale(.5)">'+logoSvg()+'</g>' : logoSvg();
  const cards = spec.cards.map((card, i) => {
    const g = layout.cards[i];
    const badgeX = g.x + 29, badgeY = g.y + 29;
    let svg = '<g class="card card-'+(i+1)+'" data-card-index="'+(i+1)+'">'+rect(g.x,g.y,g.w,g.h,26,c.card,c.border);
    svg += '<circle cx="'+badgeX+'" cy="'+badgeY+'" r="21" fill="'+c.ink+'"/>';
    svg += '<text x="'+badgeX+'" y="'+(badgeY+7)+'" fill="#FFFFFF" font-size="22" text-anchor="middle">'+String(i+1).padStart(2,'0')+'</text>';
    const icon = card.icon || 'building', cx = g.x+(mobile?72:87), cy = g.y+104, size = mobile?82:104;
    svg += semanticIconSvg(icon,cx,cy,size,EXTRA_PICTOGRAMS) || iconSvg(icon,cx,cy,size);
    svg += tspanBlock(g.title,g.x+g.titleX,g.y+46,type.cardTitle,mobile?50:46,c.ink,700);
    svg += tspanBlock(g.summary,g.x+g.titleX,g.y+g.summaryTop,type.summary,lineHeight,c.muted,400);
    for (const detail of g.details) {
      svg += '<circle cx="'+(g.x+32)+'" cy="'+(g.y+detail.top+type.detail*.52)+'" r="4" fill="'+c.ink+'"/>';
      svg += tspanBlock(detail.lines,g.x+52,g.y+detail.top,type.detail,lineHeight,c.ink,400);
    }
    svg += rect(g.x+22,g.y+g.actionTop,g.w-44,g.actionHeight,22,c.soft);
    svg += centered(g.action,g.x+g.w/2,g.y+g.actionTop+11,type.action,lineHeight);
    return svg+'</g>';
  }).join('');
  const f = layout.footer;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" data-layout="overview" data-viewport="'+(mobile?'mobile':'desktop')+'" role="img" aria-label="'+escapeXml(Array.isArray(spec.title)?spec.title.join(' '):spec.title)+'">'
    +'<title>'+escapeXml(Array.isArray(spec.title)?spec.title.join(' '):spec.title)+'</title>'
    +rect(0,0,width,height,0,c.background)
    +'<path d="M0 260Q'+width*.25+' 350 '+width*.46+' 0H0Z" fill="'+c.soft+'" opacity=".75"/>'
    +rect(16,16,width-32,height-32,26,'none',c.border)
    +'<g font-family="Noto Sans CJK KR,NanumSquare,Noto Sans KR,Apple SD Gothic Neo,Malgun Gothic,sans-serif">'+brand
    +'<g id="header-fixed">'+tspanBlock(layout.title,margin,layout.titleTop,type.title,layout.titleLine,c.ink,700)
    +tspanBlock(layout.subtitle,margin,layout.subtitleTop,type.subtitle,layout.subtitleLine,c.muted,400)
    +'<path d="M'+margin+' '+layout.ruleY+'H'+(width-margin)+'" stroke="'+c.rule+'" stroke-width="3"/></g>'
    +'<g id="body-cards" data-count="'+spec.cards.length+'" data-top="'+layout.top+'">'+cards+'</g>'
    +'<g id="footer-fixed">'+rect(f.x,f.y,f.w,f.h,24,c.soft)
    +centered(layout.takeaway,width/2,f.y+14,type.footer,lineHeight)+'</g></g></svg>';
}

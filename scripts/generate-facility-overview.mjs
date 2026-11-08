// Additive entry point: existing publication guards freeze the approved
// renderer/pictogram source hashes. Import their public helpers read-only.
import {TOKENS,wrap,escapeXml,rect,tspanBlock,logoSvg} from './generate-facility-infographic.mjs';
import {PICTOGRAMS} from './facility-pictograms.mjs';
import {EXTRA_PICTOGRAMS} from './facility-pictograms-extended.mjs';
import {overviewLayout,renderOverview} from './facility-overview-layout.mjs';

// Exact guest-bed geometry already used by the released episode 0 renderer.
const hotel={svg:'<g data-part="bed"><path d="M9 90V26M95 90V49M9 73h86M9 60h86V45H47v15"/><rect x="17" y="36" width="23" height="19" rx="6" fill="#E9F5E6"/><path d="M9 80h86"/></g>'};
const registry={...PICTOGRAMS,...EXTRA_PICTOGRAMS,hotel};
function iconSvg(name,cx,cy,size){
  const icon=registry[name==='building'?'office':name];
  if(!icon)throw Error('Unknown pictogram: '+name);
  return '<g class="semantic-pictogram" data-icon="'+name+'" transform="translate('+(cx-size/2)+' '+(cy-size/2)+') scale('+(size/104)+')" fill="none" stroke="#12523C" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">'+icon.svg+'</g>';
}
function centeredLine(lines,x,cy,size,color,weight=700){
  if(lines.length!==1)throw Error('centered label must be one line');
  return '<text class="centered-label" data-center-y="'+cy+'" x="'+x+'" y="'+cy+'" dy="'+(size>=28?-0.16:-0.04)+'em" fill="'+color+'" font-size="'+size+'" font-weight="'+weight+'" text-anchor="middle" dominant-baseline="central">'+escapeXml(lines[0])+'</text>';
}
const helpers={TOKENS,wrap,escapeXml,rect,tspanBlock,logoSvg,iconSvg,centeredLine};
export const infographicOverviewLayout=spec=>overviewLayout(spec,helpers);
export const renderInfographic=spec=>renderOverview(spec,helpers);

if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
  const {readFileSync,writeFileSync}=await import('node:fs');
  const [input,output,viewport='desktop']=process.argv.slice(2);
  if(!input||!output)throw Error('Usage: node scripts/generate-facility-overview.mjs spec.json output.svg [desktop|mobile]');
  writeFileSync(output,renderInfographic({...JSON.parse(readFileSync(input,'utf8')),viewport}));
}

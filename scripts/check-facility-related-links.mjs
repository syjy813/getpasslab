import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
const routes=['career/what-is-facility-management','career/first-job','career/employment-types','career/shifts-and-pay','jobs/public-sector-comparison'];
if(process.env.FACILITY_DRAFT_PREVIEW !== '1') {
 for(const route of routes) assert(!fs.existsSync(`dist/facility-management/${route}/index.html`),route+': draft must not be in normal build');
 assert(!fs.existsSync('dist/images/facility-drafts'),'draft images must not be in normal build');
 console.log('[Facility related links] PASS: drafts excluded from normal build');
 process.exit(0);
}
let checked=0;
let draftCards=0;
for(const page of ['facility-management','facility-management/career','facility-management/jobs', ...routes.map(route=>`facility-management/${route}`)]){
 const doc=parse(fs.readFileSync(`dist/${page}/index.html`,'utf8'));
 const walk=node=>{
  const href=node.attrs?.find(a=>a.name==='href')?.value;
  if(node.tagName==='a' && node.attrs?.some(a=>a.name==='class' && a.value.split(/\s+/).includes('facility-card')) && routes.some(route=>href===`/facility-management/${route}/`)){
   let text='', hasTime=false;
   const inspect=child=>{if(child.nodeName==='#text') text+=child.value; if(child.tagName==='time') hasTime=true; for(const next of child.childNodes||[]) inspect(next);};
   inspect(node);
   assert(text.includes('검토용 초안'),page+': draft card must be identified');
   assert(!hasTime,page+': draft must not show a publication date');
   draftCards++;
  }
  for(const child of node.childNodes||[]) walk(child);
 };
 walk(doc);
}
assert(draftCards>=5,'expected draft cards across facility pages');
for(const route of routes){
 const html=fs.readFileSync(`dist/facility-management/${route}/index.html`,'utf8');
 assert(html.includes('noindex, nofollow'),route+': draft noindex');
 const walk=node=>{if(node.tagName==='a'){const href=node.attrs.find(a=>a.name==='href')?.value;if(href?.startsWith('/facility-management/')){assert(fs.existsSync(`dist${href.replace(/\/$/,'')}/index.html`),`${route}: missing ${href}`);checked++;}}for(const child of node.childNodes||[])walk(child)};
 walk(parse(html));
}
assert(checked>=20,'expected facility links');console.log('[Facility related links] PASS',checked);

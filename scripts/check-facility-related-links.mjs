import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
const routes=['career/what-is-facility-management','career/first-job','career/employment-types','career/shifts-and-pay','jobs/public-sector-comparison'];
let checked=0;
for(const route of routes){
 const html=fs.readFileSync(`dist/facility-management/${route}/index.html`,'utf8');
 assert(html.includes('noindex, nofollow'),route+': draft noindex');
 const walk=node=>{if(node.tagName==='a'){const href=node.attrs.find(a=>a.name==='href')?.value;if(href?.startsWith('/facility-management/')){assert(fs.existsSync(`dist${href.replace(/\/$/,'')}/index.html`),`${route}: missing ${href}`);checked++;}}for(const child of node.childNodes||[])walk(child)};
 walk(parse(html));
}
assert(checked>=20,'expected facility links');console.log('[Facility related links] PASS',checked);

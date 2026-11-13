import {hotelRelease, assertHotelRelease} from './read-hotel-two-parter-release.mjs';
assertHotelRelease();
import { episode00Release, assertEpisode00Release } from './read-hobyeongbaekma-publication.mjs';
import {beforeIntegratedStyles} from './hobyeongbaekma-integrated-images.mjs';
assertEpisode00Release();
import {bulkVisuals,beforeBulkVisuals,assertBulkVisuals,bulkOutput} from './read-facility-bulk-visuals.mjs';
import fs from 'node:fs';
const hospitalRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-11-hospital-two-parter/manifest.json'));
const hospitalOutputAdditions=hospitalRelease.articles.flatMap(row=>['dist'+row.route+'index.html',row.image.replace(/^public/,'dist')]);
const departmentStoreRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-12-department-store-two-parter/manifest.json'));
const departmentStoreOutputAdditions=departmentStoreRelease.articles.flatMap(row=>['dist'+row.route+'index.html',row.image.replace(/^public/,'dist')]);
const martRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-12-mart-two-parter/manifest.json'));
const martOutputAdditions=martRelease.articles.flatMap(row=>['dist'+row.route+'index.html',row.image.replace(/^public/,'dist')]);
const hospitalExtraRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-13-hospital-ep2-3/manifest.json'));
const hospitalExtraOutputAdditions=hospitalExtraRelease.articles.flatMap(row=>['dist'+row.route+'index.html',row.image.replace(/^public/,'dist')]);
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {publicSectorVisuals,assertPublicSectorVisuals,visualOutput} from './read-public-sector-visuals.mjs';

assertPublicSectorVisuals();
assertBulkVisuals();

const audit='docs/audits/2026-11-05-facility-publication/';
const release=JSON.parse(fs.readFileSync(audit+'manifest.json'));
const original=JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/draft-manifest.json'));
const articles=Object.values(JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/site-article-map.json')));
const preview=process.env.FACILITY_DRAFT_PREVIEW==='1';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,k)=>n?.attrs?.find(a=>a.name===k)?.value;
const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes||[]).map(text).join('');
assert.equal(Object.keys(release.source).length,8);
assert.deepEqual(Object.keys(release.source).sort(),Object.keys(original.source).sort(),'same eight reviewed article identities');
assert.deepEqual(release.assets,original.assets,'all forty reviewed image bytes remain unchanged');
for(const [file,sha] of Object.entries({...release.source,...release.assets}))assert.equal(hash(beforeBulkVisuals(file,fs.readFileSync(file))),sha,file);
const sitemap=walk('dist').filter(f=>f.endsWith('.xml')).map(f=>fs.readFileSync(f,'utf8')).join('');
assert.equal(sitemap.includes('<loc>https://getpasslab.co.kr/facility-management/qualifications/</loc>'),!preview,'new populated category is searchable only in publication mode');
let links=0;
for(const article of articles){
 const source=fs.readFileSync('src/content/facility/'+article.slug+'.md','utf8');
 assert.match(source,/^status: published$/m);
 for(const field of ['publishedAt','updatedAt','reviewedAt'])assert(source.includes(field+": '"+release.plannedPublicationDate+"'"),article.slug+': '+field);
 const list=nodes(parse(fs.readFileSync('dist'+article.path+'index.html','utf8')));
 const meta=name=>attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')===name),'content');
 assert.equal(meta('robots'),preview?'noindex, nofollow':'index, follow');
 assert.equal(list.filter(n=>n.tagName==='h1').length,1);
 assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://getpasslab.co.kr'+article.path);
 assert(!/검토용 초안|공개 전 자료 확인 중|법령·선임 기준 확인 중/.test(text(list.find(n=>n.tagName==='main'))));
 assert(!list.some(n=>n.nodeName==='#text'&&n.value.includes('**')));
 assert(!list.some(n=>n.tagName==='del'));
 const body=list.find(n=>(attr(n,'class')||'').split(/\s+/).includes('facility-body'));
 const images=nodes(body).filter(n=>n.tagName==='img'&&attr(n,'src')?.includes('/images/facility-drafts/'));
 assert.equal(images.length,bulkVisuals.source['src/content/facility/'+article.slug+'.md']?.images??5);
 for(const image of images)assert(attr(image,'alt')&&attr(image,'width')&&attr(image,'height'));
 const data=list.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const d=JSON.parse(text(n));return Array.isArray(d)?d:[d]}).filter(d=>d['@type']==='Article');
 assert.equal(data.length,preview?0:1);
 if(!preview){assert.equal(data[0].datePublished,release.plannedPublicationDate);assert.equal(data[0].dateModified,release.plannedPublicationDate);assert(data[0].citation.length>0)}
 assert.equal(sitemap.includes('<loc>https://getpasslab.co.kr'+article.path+'</loc>'),!preview);
 for(const n of list){const href=n.tagName==='a'?attr(n,'href'):null;if(href?.startsWith('/facility-management/')){assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),href);links++}}
}
assert(!fs.readFileSync('src/content/facility/boiler-inspection-manager.md','utf8').includes('제31조의27의2'));
assert(fs.readFileSync('src/content/facility/statutory-appointments.md','utf8').includes('| A현장 |'));
const addedImages=Object.keys(release.assets).map(f=>f.replace('facility-assets/','dist/images/facility-drafts/'));
for(const [source,sha] of Object.entries(release.assets))assert.equal(hash(fs.readFileSync(source.replace('facility-assets/','dist/images/facility-drafts/'))),bulkVisuals.images.find(r=>r.publicPath===source.replace('facility-assets/','/images/facility-drafts/'))?.sha256??sha);
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/public-baseline.json')).files;
// The all-article heading rollout replaces exactly one content-hashed facility
// stylesheet. Preserve the historical baseline and pin both old and new bytes.
const headingCSS=JSON.parse(fs.readFileSync('docs/audits/2026-11-05-facility-heading-rollout/css-bundle.json'));
assert.equal(baseline[headingCSS.previousPath],headingCSS.previousSHA256,'original facility CSS fingerprint');
assert(!fs.existsSync(headingCSS.previousPath),'obsolete facility CSS bundle removed');
// The integration adds only three scoped rules to the same stylesheet. Locate
// its new content-hashed name, then recover and hash the exact previous bundle.
const facilityCSS=walk('dist/_astro').filter(file=>file.endsWith('.css')&&fs.readFileSync(file,'utf8').includes('.facility-overview-figure'));
assert.equal(facilityCSS.length,1,'one complete-sheet stylesheet');
const currentFacilityCSS=facilityCSS[0],compiledCSS=fs.readFileSync(currentFacilityCSS,'utf8');
assert(!fs.existsSync(headingCSS.currentPath),'previous content-hashed bundle replaced');
// Remove only the two user-approved employment-types borderless rules from
// compiled CSS before comparing the full historical bundle fingerprint.
const borderlessHeroPath='/03/01-employment-types-hero.webp';
const approvedHeroRules=[...compiledCSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(match=>match[0].includes(borderlessHeroPath));
assert(approvedHeroRules.length>=1&&approvedHeroRules.length<=2,'only one or two approved compiled hero blocks');
const seenSelectors=[];
for(const match of approvedHeroRules){
  const decls=match[2].split(';').map(s=>s.replace(/\s+/g,'')).filter(Boolean).sort();
  assert.deepEqual(decls,['border:0','border-radius:0'].sort(),'exact approved borderless declarations');
  seenSelectors.push(...match[1].split(',').map(s=>s.replace(/\s+/g,'').replace(/['"]/g,'')));
}
assert.deepEqual(seenSelectors.sort(),[
  '.facility-bodyimg[src$='+borderlessHeroPath+']',
  '.facility-card-cover:has(>img[src$='+borderlessHeroPath+'])'
].sort(),'exactly two scoped hero image selectors');
let originalCompiledCSS=compiledCSS;
for(const match of approvedHeroRules.reverse()){
  originalCompiledCSS=originalCompiledCSS.slice(0,match.index)+originalCompiledCSS.slice(match.index+match[0].length);
}
assert.equal(hash(beforeIntegratedStyles(originalCompiledCSS)),headingCSS.currentSHA256,'all pre-existing compiled CSS bytes are unchanged');
const files=walk('dist').filter(f=>!f.split('/').some(p=>p.startsWith('.'))).sort();
const addedVisualImages=publicSectorVisuals.images.filter(r=>!r.existing).map(visualOutput);
for(const row of publicSectorVisuals.images)assert.equal(hash(fs.readFileSync(visualOutput(row))),row.sha256,'approved public-sector output: '+row.publicPath);
assert.deepEqual(files,[...hotelRelease.outputAdditions,...episode00Release.outputAdditions,...hospitalOutputAdditions,...departmentStoreOutputAdditions,...martOutputAdditions,...hospitalExtraOutputAdditions,...Object.keys(baseline),...articles.map(a=>'dist'+a.path+'index.html'),...addedImages,...addedVisualImages,...bulkVisuals.images.filter(r=>!r.existing).map(bulkOutput)].map(f=>f===headingCSS.previousPath?currentFacilityCSS:f).sort(),'same routes plus approved hotel, episode-0, hospital, department-store, mart and hospital ep.2-3 outputs; exactly one facility CSS bundle replaced');
let unchanged=0;
const approvedRenders=new Set([...publicSectorVisuals.images.filter(r=>r.existing).map(visualOutput),...bulkVisuals.images.map(bulkOutput)]);
for(const [file,sha] of Object.entries(baseline)){
 if(file===headingCSS.previousPath)continue; // Replacement is hash-pinned above.
 // Facility lists/related links and XML reflect the reviewed release. Native
 // guard separately pins old source files and the three PR245 SVG renders.
 if(file.startsWith('dist/facility-management/')||file.endsWith('.xml')||approvedRenders.has(file))continue;
 assert.equal(hash(beforeBulkVisuals(file,fs.readFileSync(file))),sha,file+': existing public bytes protected');unchanged++;
}
console.log('[Facility release] PASS',JSON.stringify({articles:8,images:40,links,mode:preview?'private-preview':'publication-candidate',publicFiles:files.length,unchangedPublicFiles:unchanged,date:release.plannedPublicationDate}));

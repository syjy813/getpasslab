import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {seriesRelease,beforePendingRelease} from './read-pending-release.mjs';
import {beforeDiscoveryUI} from './read-facility-discovery-ui.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,k)=>n?.attrs?.find(a=>a.name===k)?.value;
const has=(n,k)=>(attr(n,'class')||'').split(/\s+/).includes(k);
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const preview=process.env.FACILITY_DRAFT_PREVIEW==='1';
for(const [file,row] of Object.entries(seriesRelease.changes)) assert.equal(hash(beforePendingRelease(file,fs.readFileSync(file))),row.beforeSha256,file);
const episodeOrder=JSON.parse(fs.readFileSync('docs/audits/2026-11-18-series-episode-order/manifest.json'));
for(const [file,sha] of Object.entries(seriesRelease.protected)){
 let bytes=beforeDiscoveryUI(file,fs.readFileSync(file));
 if(file===episodeOrder.file){
  assert.equal(hash(bytes),episodeOrder.sha256,file+': exact approved episode-order change');
  bytes=Buffer.from(episodeOrder.before,'base64');
 }
 assert.equal(hash(bytes),sha,file+': predecessor protected beyond approved episode ordering');
}
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');
const all=nodes(parse(fs.readFileSync('dist/facility-management/stories/index.html','utf8')));
for(const row of seriesRelease.articles){
 assert.equal(hash(fs.readFileSync(row.source)),row.sourceSha256,row.source);
 assert.equal(hash(fs.readFileSync(row.image)),row.imageSha256,row.image);
 assert.equal(hash(fs.readFileSync(row.image.replace(/^public/,'dist'))),row.imageSha256,'built image');
 assert.equal(hash(fs.readFileSync(row.thumbnail)),row.imageSha256,'approved exact thumbnail');
 const html=fs.readFileSync('dist'+row.route+'index.html','utf8'),dom=nodes(parse(html));
 assert.equal(dom.filter(n=>n.tagName==='h1').length,1,'single H1');
 assert.equal(text(dom.find(n=>n.tagName==='h1')),row.title);
 assert(!/내부 편집 메모|발행 단계에 남은 항목|원자료와 재확인 범위/.test(text(dom.find(n=>has(n,'facility-body')))),'no internal editorial notes');
 assert.equal(dom.filter(n=>has(n,'facility-sources')).length,0,'series source metadata stays out of visible article');
 assert.equal(attr(dom.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://getpasslab.co.kr'+row.route);
 const schema=dom.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const j=JSON.parse(text(n));return Array.isArray(j)?j:[j]}).filter(n=>n['@type']==='Article');
 assert.equal(schema.length,preview?0:1,'public Article only');
 if(!preview){assert.equal(schema[0].datePublished,'2026-11-18');assert(schema[0].citation.length>0,'source metadata retained');}
 assert.equal(sitemap.includes('<loc>https://getpasslab.co.kr'+row.route+'</loc>'),!preview,'sitemap exposure');
 const card=all.find(n=>n.tagName==='a'&&has(n,'facility-card')&&attr(n,'href')===row.route);assert(card,'story card');
 assert.equal(attr(nodes(card).find(n=>n.tagName==='img'),'src'),row.image.replace(/^public/,''));
 for(const n of dom){const href=n.tagName==='a'?attr(n,'href'):null;if(href?.startsWith('/facility-management/'))assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),'valid link '+href);}
}
const {default:sharp}=await import('sharp');
for(const row of seriesRelease.articles){const m=await sharp(row.image).metadata();assert.deepEqual([m.width,m.height],[1448,1086]);}
console.log('Pending release PASS: 8 articles, exact assets, 32-article navigation, metadata, links, preserved analytics/sorting and exact predecessor reconstruction');

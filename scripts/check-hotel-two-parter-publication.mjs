import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';
import {hotelRelease,assertHotelRelease} from './read-hotel-two-parter-release.mjs';
assertHotelRelease();
const preview=process.env.FACILITY_DRAFT_PREVIEW==='1';
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,key)=>n?.attrs?.find(a=>a.name===key)?.value;
const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes||[]).map(text).join('');
const hasClass=(n,name)=>(attr(n,'class')||'').split(/\s+/).includes(name);
const load=route=>nodes(parse(fs.readFileSync('dist'+route+'index.html','utf8')));
const sitemap=fs.readdirSync('dist').filter(f=>/^sitemap.*\.xml$/.test(f)).map(f=>fs.readFileSync('dist/'+f,'utf8')).join('');
for(const row of hotelRelease.articles){
 const list=load(row.route),body=list.find(n=>hasClass(n,'facility-body'));
 assert.equal(list.filter(n=>n.tagName==='h1').length,1);
 assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://getpasslab.co.kr'+row.route);
 assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots'),'content'),preview?'noindex, nofollow':'index, follow');
 assert(!list.some(n=>hasClass(n,'facility-sources')),'no reader-visible sources section');
 assert(!nodes(body).some(n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')||'')),'no external body links');
 assert(!/검토용 초안|공개 전 자료 확인 중/.test(text(list.find(n=>n.tagName==='article'))));
 const images=nodes(body).filter(n=>n.tagName==='img');assert.equal(images.length,1);
 for(const [key,value]of Object.entries({src:row.hero,alt:row.alt,width:'1440',height:'1080',loading:'eager',fetchpriority:'high'}))assert.equal(attr(images[0],key),value);
 assert.equal(createHash('sha256').update(fs.readFileSync('dist'+row.hero)).digest('hex'),hotelRelease.additions[row.image]);
 const schemas=list.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(text(n))).filter(n=>n['@type']==='Article');
 assert.equal(schemas.length,preview?0:1);
 if(!preview){assert.equal(schemas[0].mainEntityOfPage,'https://getpasslab.co.kr'+row.route);assert.equal(schemas[0].datePublished,row.publishedAt);assert.equal(schemas[0].citation.length,1);}
 assert.equal(sitemap.includes('<loc>https://getpasslab.co.kr'+row.route+'</loc>'),!preview);
 const other=hotelRelease.articles.find(r=>r.slug!==row.slug);
 assert(nodes(body).some(n=>n.tagName==='a'&&attr(n,'href')===other.route),'counterpart linked in body');
 {
  const route='/facility-management/career/';
  const card=load(route).find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);assert(card,route+': hotel article card');
  const cover=nodes(card).find(n=>n.tagName==='img');assert.equal(attr(cover,'src'),row.hero);assert.equal(attr(cover,'width'),'1440');assert.equal(attr(cover,'height'),'1080');
  const homeCard=load('/facility-management/').find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);
  assert.equal(homeCard,undefined,'hotel article displaced from six-card home slice by six newer hospital/department-store/mart articles');
 }
}
console.log('Hotel two-parter: approved images, sources visibility, links, dates, canonical, Article and sitemap PASS ('+(preview?'private preview':'publication')+')');

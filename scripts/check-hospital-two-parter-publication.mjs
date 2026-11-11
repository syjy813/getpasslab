import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';

const preview=process.env.FACILITY_DRAFT_PREVIEW==='1';
const origin='https://getpasslab.co.kr';
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,key)=>n?.attrs?.find(a=>a.name===key)?.value;
const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes||[]).map(text).join('');
const hasClass=(n,name)=>(attr(n,'class')||'').split(/\s+/).includes(name);
const load=route=>nodes(parse(fs.readFileSync('dist'+route+'index.html','utf8')));
const sitemap=fs.readdirSync('dist').filter(f=>/^sitemap.*\.xml$/.test(f)).map(f=>fs.readFileSync('dist/'+f,'utf8')).join('');
const articles=[
 {slug:'hobyeongbaekma-hospital-despair',route:'/facility-management/career/hobyeongbaekma-hospital-despair/',hero:'/images/facility-series/ep2-1-hospital-despair/01-hero.webp',alt:'병원 시설관리로 취업했는데 민원 처리와 설비 점검이 겹쳐 지친 시설관리자를 표현한 호병백마 ep.2-1 절망편',sha256:'5b444673f943866c90d30fd118d383303260611200db451854a0a4bba51c3489',publishedAt:'2026-11-11',citations:1},
 {slug:'hobyeongbaekma-hospital-hope',route:'/facility-management/career/hobyeongbaekma-hospital-hope/',hero:'/images/facility-series/ep2-2-hospital-hope/01-hero.webp',alt:'병원 시설관리의 안정적인 근무환경과 전문 설비 경험, 장기 경력 성장 가능성을 표현한 호병백마 ep.2-2 희망편',sha256:'38617aa764c3e5c77e0bcabf8110053c915f0689d1a6850c3334b814afb3d3b4',publishedAt:'2026-11-11',citations:2}
];
for(const row of articles){
 const list=load(row.route),body=list.find(n=>hasClass(n,'facility-body'));
 assert.equal(list.filter(n=>n.tagName==='h1').length,1);
 assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),origin+row.route);
 assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots'),'content'),preview?'noindex, nofollow':'index, follow');
 assert(!list.some(n=>hasClass(n,'facility-sources')),'no reader-visible sources section');
 assert(!nodes(body).some(n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')||'')),'no external body links');
 assert(!/검토용 초안|SOURCE_AUDIT|EDITOR_NOTES/.test(text(list.find(n=>n.tagName==='article'))));
 const images=nodes(body).filter(n=>n.tagName==='img');assert.equal(images.length,1);
 for(const [key,value] of Object.entries({src:row.hero,alt:row.alt,width:'1440',height:'1080',loading:'eager',fetchpriority:'high'})) assert.equal(attr(images[0],key),value);
 assert.equal(createHash('sha256').update(fs.readFileSync('dist'+row.hero)).digest('hex'),row.sha256);
 const schemas=list.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const v=JSON.parse(text(n));return Array.isArray(v)?v:[v]}).filter(n=>n['@type']==='Article');
 assert.equal(schemas.length,preview?0:1);
 if(!preview){assert.equal(schemas[0].mainEntityOfPage,origin+row.route);assert.equal(schemas[0].datePublished,row.publishedAt);assert.equal(schemas[0].dateModified,row.publishedAt);assert.equal(schemas[0].citation.length,row.citations);}
 assert.equal(sitemap.includes('<loc>'+origin+row.route+'</loc>'),!preview);
 const other=articles.find(r=>r.slug!==row.slug);
 assert(nodes(body).some(n=>n.tagName==='a'&&attr(n,'href')===other.route),'counterpart linked in body');
 for(const route of ['/facility-management/','/facility-management/career/']){
  const card=load(route).find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);assert(card,route+': hospital article card');
  const cover=nodes(card).find(n=>n.tagName==='img');assert.equal(attr(cover,'src'),row.hero);assert.equal(attr(cover,'width'),'1440');assert.equal(attr(cover,'height'),'1080');
 }
 for(const n of list.filter(n=>n.tagName==='a')){const href=attr(n,'href');if(href?.startsWith('/facility-management/'))assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),href);}
}
console.log('Hospital two-parter: images, links, sources visibility, dates, canonical, Article, cards and sitemap PASS ('+(preview?'private preview':'publication')+')');

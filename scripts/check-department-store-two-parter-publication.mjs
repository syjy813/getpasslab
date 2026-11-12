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
 {slug:'hobyeongbaekma-department-store-despair',route:'/facility-management/career/hobyeongbaekma-department-store-despair/',hero:'/images/facility-series/ep3-1-department-store-despair/01-hero.webp',alt:'백화점 폐점 후 매장 리뉴얼 공사와 야간 시설 업무에 지친 시설관리자를 표현한 호병백마 ep.3-1 절망편',sha256:'f2adf5a160cd34f29d57e1e80dff6aaf43744f2cf24a651afd57b0f6d214f62c',publishedAt:'2026-11-12',citations:3,required:['리뉴얼·입퇴점 공사가 겹치면 야간이 길어질 수 있다','매장 리뉴얼·입퇴점 공사 때 시설팀이 어디까지 지원하고']},
 {slug:'hobyeongbaekma-department-store-hope',route:'/facility-management/career/hobyeongbaekma-department-store-hope/',hero:'/images/facility-series/ep3-2-department-store-hope/01-hero.webp',alt:'백화점 시설관리의 대형 상업시설 경험과 리뉴얼 변경관리, 협업 경력 가치를 표현한 호병백마 ep.3-2 희망편',sha256:'610889534186260339f2df39b186690fb9b2d50174c4455cf87fb56fad2bed32',publishedAt:'2026-11-12',citations:3,required:['리뉴얼 공사를 겪으면 ‘건물이 어떻게 바뀌는지’도 보게 된다','변경관리 경험']}
];
const actualImageHashes=Object.fromEntries(articles.map(row=>[row.slug,createHash('sha256').update(fs.readFileSync('dist'+row.hero)).digest('hex')]));
console.log('[Department-store hero SHA256]',JSON.stringify(actualImageHashes));
for(const row of articles){
 const list=load(row.route),body=list.find(n=>hasClass(n,'facility-body')),bodyText=text(body);
 assert.equal(list.filter(n=>n.tagName==='h1').length,1);
 assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),origin+row.route);
 assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots'),'content'),preview?'noindex, nofollow':'index, follow');
 assert(!list.some(n=>hasClass(n,'facility-sources')),'no reader-visible sources section');
 assert(!nodes(body).some(n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')||'')),'no external body links');
 assert(!/검토용 초안|SOURCE_AUDIT|EDITOR_NOTES/.test(text(list.find(n=>n.tagName==='article'))));
 for(const phrase of row.required) assert(bodyText.includes(phrase),'required editorial phrase: '+phrase);
 const images=nodes(body).filter(n=>n.tagName==='img');assert.equal(images.length,1);
 for(const [key,value] of Object.entries({src:row.hero,alt:row.alt,width:'1440',height:'1080',loading:'eager',fetchpriority:'high'})) assert.equal(attr(images[0],key),value);
 assert.equal(actualImageHashes[row.slug],row.sha256);
 const schemas=list.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const v=JSON.parse(text(n));return Array.isArray(v)?v:[v]}).filter(n=>n['@type']==='Article');
 assert.equal(schemas.length,preview?0:1);
 if(!preview){assert.equal(schemas[0].mainEntityOfPage,origin+row.route);assert.equal(schemas[0].datePublished,row.publishedAt);assert.equal(schemas[0].dateModified,row.publishedAt);assert.equal(schemas[0].citation.length,row.citations);}
 assert.equal(sitemap.includes('<loc>'+origin+row.route+'</loc>'),!preview);
 const other=articles.find(r=>r.slug!==row.slug);
 assert(nodes(body).some(n=>n.tagName==='a'&&attr(n,'href')===other.route),'counterpart linked in body');
 for(const route of ['/facility-management/','/facility-management/career/']){
  const card=load(route).find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);assert(card,route+': department-store article card');
  const cover=nodes(card).find(n=>n.tagName==='img');assert.equal(attr(cover,'src'),row.hero);assert.equal(attr(cover,'width'),'1440');assert.equal(attr(cover,'height'),'1080');
 }
 for(const n of list.filter(n=>n.tagName==='a')){const href=attr(n,'href');if(href?.startsWith('/facility-management/'))assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),href);}
}
console.log('Department-store two-parter: images, links, sources visibility, dates, canonical, Article, cards and sitemap PASS ('+(preview?'private preview':'publication')+')');

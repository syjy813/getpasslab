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
 {slug:'hobyeongbaekma-mart-despair',route:'/facility-management/career/hobyeongbaekma-mart-despair/',hero:'/images/facility-series/ep4-1-mart-despair/01-hero.webp',alt:'마트 영업 종료 후에도 냉장·냉동 설비와 야간 작업에 지친 시설관리자를 표현한 호병백마 ep.4-1 절망편',sha256:'b092c1078f554251cfb29448bdc23db96abd4debf905865e16fd40a4531c778b',publishedAt:'2026-11-12',citations:3,required:['온도 이상은 ‘내일 아침에 보자’고 하기 어려울 수 있다','면접에서 꼭 확인할 여섯 가지']},
 {slug:'hobyeongbaekma-mart-hope',route:'/facility-management/career/hobyeongbaekma-mart-hope/',hero:'/images/facility-series/ep4-2-mart-hope/01-hero.webp',alt:'마트 시설관리의 냉장·냉동 설비 경험과 원격감시·장애 대응·영선 경험을 표현한 호병백마 ep.4-2 희망편',sha256:'0378c000a85565d64b3283660319860930adec3c642a13f7afb6db7a6447ceb1',publishedAt:'2026-11-12',citations:3,required:['냉동·냉장 설비의 가치는 ‘직접 수리’보다 운영 흐름을 배우는 데 있다','공조냉동 공부와 연결하기 좋다']}
];
const actualImageHashes=Object.fromEntries(articles.map(row=>[row.slug,createHash('sha256').update(fs.readFileSync('dist'+row.hero)).digest('hex')]));
console.log('[Mart hero SHA256]',JSON.stringify(actualImageHashes));
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
  const card=load(route).find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);assert(card,route+': mart article card');
  const cover=nodes(card).find(n=>n.tagName==='img');assert.equal(attr(cover,'src'),row.hero);assert.equal(attr(cover,'width'),'1440');assert.equal(attr(cover,'height'),'1080');
 }
 for(const n of list.filter(n=>n.tagName==='a')){const href=attr(n,'href');if(href?.startsWith('/facility-management/'))assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),href);}
}
console.log('Mart two-parter: images, links, sources visibility, dates, canonical, Article, cards and sitemap PASS ('+(preview?'private preview':'publication')+')');

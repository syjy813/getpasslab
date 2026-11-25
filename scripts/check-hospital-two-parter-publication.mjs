import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';
import {thumbnailRows} from './read-hobyeongbaekma-list-thumbnails.mjs';
import {storyThumbnail3x2Rows} from './read-story-thumbnails-3x2.mjs';

const preview=process.env.FACILITY_DRAFT_PREVIEW==='1';
const origin='https://getpasslab.co.kr';
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,key)=>n?.attrs?.find(a=>a.name===key)?.value;
const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes||[]).map(text).join('');
const hasClass=(n,name)=>(attr(n,'class')||'').split(/\s+/).includes(name);
const load=route=>nodes(parse(fs.readFileSync('dist'+route+'index.html','utf8')));
const sitemap=fs.readdirSync('dist').filter(f=>/^sitemap.*\.xml$/.test(f)).map(f=>fs.readFileSync('dist/'+f,'utf8')).join('');
const articles=[
 {slug:'hobyeongbaekma-hospital-despair',route:'/facility-management/career/hobyeongbaekma-hospital-despair/',hero:'/images/facility-series/ep2-1-hospital-despair/01-hero.webp',alt:'병원 시설관리로 취업했는데 민원 처리와 설비 점검이 겹쳐 지친 시설관리자를 표현한 호병백마 ep.2-1 절망편',sha256:'83a1ea84729f1da333f2fdbe8859ef22deff6a13ad4bb4f603e310bdf948a516',publishedAt:'2026-11-11',citations:2},
 {slug:'hobyeongbaekma-hospital-hope',route:'/facility-management/career/hobyeongbaekma-hospital-hope/',hero:'/images/facility-series/ep2-2-hospital-hope/01-hero.webp',alt:'병원 시설관리의 안정적인 근무환경과 전문 설비 경험, 장기 경력 성장 가능성을 표현한 호병백마 ep.2-2 희망편',sha256:'3e42d821e7ba280681e6fa5014a40eecf957a8517330d16e428d434e3d4d6f43',publishedAt:'2026-11-11',citations:3},
 {slug:'hobyeongbaekma-hospital-large-university',route:'/facility-management/career/hobyeongbaekma-hospital-large-university/',hero:'/images/facility-series/ep2-3-hospital-large/01-hero.webp',alt:'대학·대형병원 시설관리에서 직접고용, 직군, 복리후생, 장기근속 조건을 확인하는 호병백마 ep.2-3 썸네일',sha256:'184def5eb152d17238e77914709adcb8948c73449b9060b4d359bd5fb4e300e1',publishedAt:'2026-11-13',citations:3}
];
const actualImageHashes=Object.fromEntries(articles.map(row=>[row.slug,createHash('sha256').update(fs.readFileSync('dist'+row.hero)).digest('hex')]));
console.log('[Hospital hero SHA256]',JSON.stringify(actualImageHashes));
for(const row of articles){
 const list=load(row.route),body=list.find(n=>hasClass(n,'facility-body'));
 assert.equal(list.filter(n=>n.tagName==='h1').length,1);
 assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),origin+row.route);
 assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots'),'content'),preview?'noindex, nofollow':'index, follow');
 assert(!list.some(n=>hasClass(n,'facility-sources')),'no reader-visible sources section');
 assert(!nodes(body).some(n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')||'')),'no external body links');
 assert(!/검토용 초안|SOURCE_AUDIT|EDITOR_NOTES/.test(text(list.find(n=>n.tagName==='article'))));
 const images=nodes(body).filter(n=>n.tagName==='img');assert.equal(images.length,0,'approved body hero removed');
 assert.equal(actualImageHashes[row.slug],row.sha256);
 const schemas=list.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const v=JSON.parse(text(n));return Array.isArray(v)?v:[v]}).filter(n=>n['@type']==='Article');
 assert.equal(schemas.length,preview?0:1);
 if(!preview){assert.equal(schemas[0].mainEntityOfPage,origin+row.route);assert.equal(schemas[0].datePublished,row.publishedAt);assert.equal(schemas[0].dateModified,row.publishedAt);assert.equal(schemas[0].citation.length,row.citations);}
 assert.equal(sitemap.includes('<loc>'+origin+row.route+'</loc>'),!preview);
 const other=articles.find(r=>r.slug!==row.slug);
 assert(nodes(body).some(n=>n.tagName==='a'&&attr(n,'href')===other.route),'counterpart linked in body');
 const categoryRoute='/facility-management/stories/';
 const card=load(categoryRoute).find(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route);assert(card,categoryRoute+': hospital article card');
 const thumbnail=thumbnailRows.find(item=>item.id===row.slug);assert(thumbnail,'approved hospital listing thumbnail');
 const cover=nodes(card).find(n=>n.tagName==='img');
 const updated=storyThumbnail3x2Rows.find(item=>item.id===row.slug);
 assert.equal(attr(cover,'src'),(updated??thumbnail).publicFile.replace(/^public/,''));
 assert.equal(attr(cover,'width'),updated?'1536':'1448');assert.equal(attr(cover,'height'),updated?'1024':'1086');
 assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'property')==='og:image'),'content'),origin+'/og-facility.png','original OG image');
 for(const n of list.filter(n=>n.tagName==='a')){const href=attr(n,'href');if(href?.startsWith('/facility-management/'))assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),href);}
}
const home=load('/facility-management/');
const homeHospital=articles.filter(row=>home.some(n=>n.tagName==='a'&&hasClass(n,'facility-card')&&attr(n,'href')===row.route));
assert.equal(homeHospital.length,0,'hospital articles retained in category after eight new episodes advance the home slice');
console.log('Hospital series: 3 pages, images, links, sources visibility, dates, canonical, Article, cards and sitemap PASS ('+(preview?'private preview':'publication')+')');

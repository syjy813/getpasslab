import {seriesRelease} from './read-pending-release.mjs';
import {sasugoldaeRelease} from './read-sasugoldae-release.mjs';
import {hotelRelease} from './read-hotel-two-parter-release.mjs';
const hotelUrls=hotelRelease.articles.map(row=>row.route);
import assert from 'node:assert/strict';
import fs from 'node:fs';
const hospitalRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-11-hospital-two-parter/manifest.json'));
const hospitalUrls=hospitalRelease.articles.map(row=>row.route);
const hospitalSlugs=hospitalRelease.articles.map(row=>row.slug);
const hospitalExtraRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-13-hospital-ep2-3/manifest.json'));
const hospitalExtraUrls=hospitalExtraRelease.articles.map(row=>row.route);
const hospitalExtraSlugs=hospitalExtraRelease.articles.map(row=>row.slug);
const departmentStoreRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-12-department-store-two-parter/manifest.json'));
const departmentStoreUrls=departmentStoreRelease.articles.map(row=>row.route);
const departmentStoreSlugs=departmentStoreRelease.articles.map(row=>row.slug);
const martRelease=JSON.parse(fs.readFileSync('docs/audits/2026-11-12-mart-two-parter/manifest.json'));
const martUrls=martRelease.articles.map(row=>row.route);
const martSlugs=martRelease.articles.map(row=>row.slug);
import {parse} from 'parse5';
import {electricArticles} from './read-electric-release.mjs';

const episode00='/facility-management/career/hobyeongbaekma/';
const gracePeriodRoute='/facility-management/qualifications/mechanical-maintainer-grace-period/';
const glossaryArticles=[
 {slug:'gamdan-work',date:'2026-11-24',related:['career/shifts-and-pay','career/first-job','intro/musugi']},
 {slug:'gaeawigong',date:'2026-11-24',related:['intro/musugi','career/facility-career-start','qualifications/boiler-inspection-manager','qualifications/refrigeration-safety-manager','qualifications/statutory-appointment-overlap']},
].map(row=>({...row,route:`/facility-management/intro/${row.slug}/`}));
const newArticleRoutes=['/facility-management/intro/musugi/','/facility-management/career/facility-career-start/'];
const appointmentSlugs=['refrigeration-safety-manager','statutory-appointment-overlap'];
const appointmentRoutes=appointmentSlugs.map(slug=>`/facility-management/qualifications/${slug}/`);
const eligible=urls=>[...urls,...newArticleRoutes,...glossaryArticles.map(row=>row.route),gracePeriodRoute,...appointmentRoutes,...seriesRelease.articles.map(r=>r.route),sasugoldaeRelease.route,episode00,...hotelUrls,...hospitalUrls,...hospitalExtraUrls,...departmentStoreUrls,...martUrls,...electricArticles.map(row=>row.route)];
const origin='https://getpasslab.co.kr';
const preview=process.env.FACILITY_DRAFT_PREVIEW === '1';
const releaseDate='2026-11-03';
const publicationFile='docs/audits/2026-11-05-facility-publication/manifest.json';
const publication=fs.existsSync(publicationFile)?JSON.parse(fs.readFileSync(publicationFile)):null;
const expanded=preview||!!publication;
const routes=['career/what-is-facility-management','career/first-job','career/employment-types','career/shifts-and-pay','jobs/public-sector-comparison'];
const drafts = JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/site-article-map.json'));
const draftUrls = Object.values(drafts).map(row => typeof row === 'string' ? row : row.path);
const urls=routes.map(route=>`/facility-management/${route}/`);
const attrs=(node,key)=>node.attrs?.find(attr=>attr.name===key)?.value;
const nodes=root=>{const list=[];const visit=node=>{list.push(node);for(const child of node.childNodes||[])visit(child)};visit(root);return list;};
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const load=path=>nodes(parse(fs.readFileSync(`dist${path}index.html`,'utf8')));
const meta=(list,key)=>list.find(node=>node.tagName==='meta'&&(attrs(node,'name')===key||attrs(node,'property')===key));
const assertMetadata=(path,expectedRobots)=>{
 const list=load(path);
 const canonical=list.filter(node=>node.tagName==='link'&&attrs(node,'rel')==='canonical');
 assert.equal(canonical.length,1,path+': exactly one canonical');
 assert.equal(attrs(canonical[0],'href'),origin+path,path+': canonical');
 assert.equal(attrs(meta(list,'og:url'),'content'),origin+path,path+': og:url');
 assert.equal(attrs(meta(list,'robots'),'content'),preview?'noindex, nofollow':expectedRobots,path+': robots');
 assert.equal(list.filter(node=>node.tagName==='h1').length,1,path+': one H1');
 return list;
};
const published=fs.readdirSync('src/content/facility').filter(file=>file.endsWith('.md')&&/^status:\s*published\s*$/m.test(fs.readFileSync('src/content/facility/'+file,'utf8'))).map(file=>file.slice(0,-3)).sort();
assert.deepEqual(published,[...seriesRelease.articles.map(r=>r.slug),...routes.map(route=>route.split('/').at(-1)),...(publication?Object.values(drafts).map(row=>row.slug):[]),'sasugoldae','hobyeongbaekma',...hotelRelease.articles.map(row=>row.slug),...hospitalSlugs,...hospitalExtraSlugs,...departmentStoreSlugs,...martSlugs,...electricArticles.map(row=>row.id),'musugi','facility-career-start','mechanical-maintainer-grace-period',...glossaryArticles.map(row=>row.slug),...appointmentSlugs].sort(),'only reviewed articles in publication candidate');
for(const path of newArticleRoutes){
 const list=assertMetadata(path,'index, follow');
 const article=list.find(node=>node.tagName==='article');
 assert(text(article).includes('근거 및 참고 자료'),path+': citations shown');
 const otherPath=newArticleRoutes.find(route=>route!==path);
 assert(nodes(article).some(node=>node.tagName==='a'&&attrs(node,'href')===otherPath),path+': reciprocal body link');
}
const gracePeriod = assertMetadata(gracePeriodRoute,'index, follow');
const gracePeriodBody = nodes(gracePeriod.find(node=>node.tagName==='article'));
assert(text(gracePeriodBody[0]).includes('근거 및 참고 자료'),gracePeriodRoute+': citations shown');
for(const target of ['qualifications/mechanical-maintainer-levels','qualifications/mechanical-career-records','career/facility-career-start']){
 assert(gracePeriodBody.some(node=>node.tagName==='a'&&attrs(node,'href')===`/facility-management/${target}/`),gracePeriodRoute+': related body link');
}
for(const path of appointmentRoutes){
 const list=assertMetadata(path,'index, follow');
 const article=list.find(node=>node.tagName==='article');
 assert(text(article).includes('근거 및 참고 자료'),path+': citations shown');
 for(const link of nodes(article).filter(node=>node.tagName==='a')){
  const href=attrs(link,'href');
  if(href?.startsWith('/facility-management/'))assert(fs.existsSync(`dist${href}index.html`),path+': missing '+href);
 }
}
assert(!fs.existsSync('dist/facility-management/career/reading-job-postings/index.html'),'unapproved placeholder must not be built');
let checked=0;
for(const path of ['/facility-management/','/facility-management/career/','/facility-management/jobs/',...urls]){
 const list=assertMetadata(path,'index, follow');
 assert.equal(attrs(meta(list,'og:image'),'content'),origin+'/og-facility.png',path+': facility sharing image');
 const cards=list.filter(node=>node.tagName==='a'&&(attrs(node,'class')||'').split(/\s+/).includes('facility-card'));
 for(const card of cards){
  assert(eligible(expanded ? [...urls,...draftUrls] : urls).includes(attrs(card,'href')),path+': approved card');
  assert(preview || !text(card).includes('검토용 초안'),path+': publication card');
  assert.equal(nodes(card).filter(node=>node.tagName==='time').length,0,path+': no list publication date');
  assert(!nodes(card).some(node=>(attrs(node,'class')||'').split(/\s+/).includes('card-label')),path+': no list category badge');
 }
 if(path==='/facility-management/') {
  const homeUrls=[...new Set(cards.map(card=>attrs(card,'href')))];
  assert(homeUrls.every(url=>eligible(expanded ? [...urls,...draftUrls] : urls).includes(url)),'home only exposes eligible articles');
  const seriesHome=homeUrls.filter(url=>seriesRelease.articles.some(row=>row.route===url));
  assert.equal(seriesHome.length,4,'four newest series episodes visible on home');
  assert(!homeUrls.includes(sasugoldaeRelease.route),'ep0 retained in category after newer episodes advance the home slice');
 }
 for(const node of list){
  const href=node.tagName==='a'?attrs(node,'href'):undefined;
  if(href?.startsWith('/facility-management/')){
   assert(fs.existsSync(`dist${href.replace(/\/$/,'')}/index.html`),path+': missing '+href);checked++;
  }
 }
 if(!urls.includes(path))continue;
 assert(!list.some(node=>node.nodeName==='#text'&&/(검토용 초안|공개 전 자료 확인 중)/.test(node.value)),path+': no editorial status shown');
 assert(text(list.find(node=>node.tagName==='article')).includes('근거 및 참고 자료'),path+': sources');
 const times=nodes(list.find(node=>node.tagName==='article')).filter(node=>node.tagName==='time');
 assert.equal(times.length,2,path+': published and reviewed dates (updated shown only when different)');
 for(const time of times)assert.equal(attrs(time,'datetime'),releaseDate,path+': actual release metadata');
 const articles=list.filter(node=>node.tagName==='script'&&attrs(node,'type')==='application/ld+json').flatMap(node=>{
  const json=JSON.parse(text(node));return Array.isArray(json)?json:[json];
 }).filter(item=>item['@type']==='Article');
 assert.equal(articles.length,preview?0:1,path+': public Article only');
 if(!preview){
  assert.equal(articles[0].mainEntityOfPage,origin+path);assert.equal(articles[0].datePublished,releaseDate);assert.equal(articles[0].dateModified,releaseDate);
  assert(articles[0].citation.length>0,path+': Article citations');
 }
}
for(const category of ['practice','qualifications']){
 const path=`/facility-management/${category}/`;
 const list=assertMetadata(path,publication&&category==='qualifications'?'index, follow':'noindex, follow');
 assert(text(list.find(node=>node.tagName==='main')).includes(category === 'qualifications' ? '공개 콘텐츠 8개' : '공개 콘텐츠 0개'),path+': category count');
}
const sitemap=fs.readdirSync('dist').filter(file=>/^sitemap.*\.xml$/.test(file)).map(file=>fs.readFileSync('dist/'+file,'utf8')).join('');
for(const path of ['/facility-management/','/facility-management/career/','/facility-management/jobs/',...urls,...appointmentRoutes])assert.equal(sitemap.includes(`<loc>${origin+path}</loc>`),!preview,path+': sitemap publication eligibility');
assert.equal(sitemap.includes(`<loc>${origin+gracePeriodRoute}</loc>`),!preview,gracePeriodRoute+': sitemap publication eligibility');
for(const {route,date,related} of glossaryArticles){
 const page=assertMetadata(route,'index, follow');
 assert.equal(sitemap.includes(`<loc>${origin+route}</loc>`),!preview,route+': sitemap publication eligibility');
 const article=page.find(node=>node.tagName==='article');
 assert(text(article).includes('근거 및 참고 자료'),route+': sources visible');
 const schema=page.filter(node=>node.tagName==='script'&&attrs(node,'type')==='application/ld+json').flatMap(node=>JSON.parse(text(node))).filter(row=>row['@type']==='Article');
 assert.equal(schema.length,preview?0:1,route+': public Article only');
 if(!preview){
  assert.equal(schema[0].mainEntityOfPage,origin+route);
  assert.equal(schema[0].datePublished,date);
  assert(schema[0].citation.length>0);
 }
 for(const target of related){
  const path=`/facility-management/${target}/`;
  assert(page.some(node=>node.tagName==='a'&&attrs(node,'href')===path),route+': related link '+path);
  assert(fs.existsSync(`dist${path}index.html`),path+': related article exists');
 }
}
for(const category of (publication&&!preview?['practice']:['practice','qualifications']))assert(!sitemap.includes(`<loc>${origin}/facility-management/${category}/</loc>`),'empty category excluded from sitemap');
assert(fs.readFileSync('dist/computer-literacy/index.html','utf8').includes(origin+'/og-default.png'),'certificate sharing image preserved');
for(const excluded of ['01/04-qualifications-vs-appointment.webp','05/03-recruitment-patterns.webp'])assert(!fs.existsSync('dist/images/facility-drafts/'+excluded),'unreferenced figure must not be shipped');
console.log('[Facility publication] PASS',JSON.stringify({mode:preview?'private-preview':'published-candidate',articles:published.length,internalLinks:checked,emptyCategories:publication?1:2,canonicalAndDates:'PASS'}));

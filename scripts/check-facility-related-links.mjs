import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';

const origin='https://getpasslab.co.kr';
const preview=process.env.FACILITY_DRAFT_PREVIEW === '1';
const releaseDate='2026-11-03';
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
assert.deepEqual(published,routes.map(route=>route.split('/').at(-1)).sort(),'only approved five articles published');
assert(!fs.existsSync('dist/facility-management/career/reading-job-postings/index.html'),'unapproved placeholder must not be built');
let checked=0;
for(const path of ['/facility-management/','/facility-management/career/','/facility-management/jobs/',...urls]){
 const list=assertMetadata(path,'index, follow');
 assert.equal(attrs(meta(list,'og:image'),'content'),origin+'/og-facility.png',path+': facility sharing image');
 const cards=list.filter(node=>node.tagName==='a'&&(attrs(node,'class')||'').split(/\s+/).includes('facility-card'));
 for(const card of cards){
  assert((preview ? [...urls,...draftUrls] : urls).includes(attrs(card,'href')),path+': approved card');
  assert(preview || !text(card).includes('검토용 초안'),path+': publication card');
  const times=nodes(card).filter(node=>node.tagName==='time');
  if (urls.includes(attrs(card,'href'))) {
   assert.equal(times.length,1,path+': one card publication date');
   assert.equal(attrs(times[0],'datetime'),releaseDate);
  } else assert.equal(times.length,0,'draft has no publication date');
 }
 if(path==='/facility-management/') assert.deepEqual([...new Set(cards.map(card=>attrs(card,'href')))].sort(),[...(preview ? [...urls,...draftUrls] : urls)].sort(),'home exposes eligible articles');
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
 const list=assertMetadata(path,'noindex, follow');
 assert(text(list.find(node=>node.tagName==='main')).includes(preview && category === 'qualifications' ? '공개 콘텐츠 4개' : '공개 콘텐츠 0개'),path+': category count');
}
const sitemap=fs.readdirSync('dist').filter(file=>/^sitemap.*\.xml$/.test(file)).map(file=>fs.readFileSync('dist/'+file,'utf8')).join('');
for(const path of ['/facility-management/','/facility-management/career/','/facility-management/jobs/',...urls])assert.equal(sitemap.includes(`<loc>${origin+path}</loc>`),!preview,path+': sitemap publication eligibility');
for(const category of ['practice','qualifications'])assert(!sitemap.includes(`<loc>${origin}/facility-management/${category}/</loc>`),'empty category excluded from sitemap');
assert(fs.readFileSync('dist/computer-literacy/index.html','utf8').includes(origin+'/og-default.png'),'certificate sharing image preserved');
for(const excluded of ['01/04-qualifications-vs-appointment.webp','05/03-recruitment-patterns.webp'])assert(!fs.existsSync('dist/images/facility-drafts/'+excluded),'unreferenced figure must not be shipped');
console.log('[Facility publication] PASS',JSON.stringify({mode:preview?'private-preview':'published-candidate',articles:5,internalLinks:checked,emptyCategories:2,canonicalAndDates:'PASS'}));

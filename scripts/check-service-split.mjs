import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {serviceSplitReview as review, beforeServiceSplit} from './read-before-service-split.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => entry.name === '.prerender' ? [] : entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
const inventory = [...walk('src'),...walk('public'),...walk('dist'),'astro.config.mjs'].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort(),'complete live source/assets/build inventory');
for(const file of inventory) assert.equal(hash(fs.readFileSync(file)), review.current[file], `${file}: live bytes`);
let oldHTML = 0;
for(const [file,row] of Object.entries(review.changes)){
  const bytes = fs.readFileSync(file), before = beforeServiceSplit(file,bytes);
  assert.equal(hash(before),row.beforeSHA256,`${file}: exact predecessor`);
  assert.notEqual(hash(beforeServiceSplit(file,Buffer.concat([bytes,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown mutations stay visible');
  if(row.kind === 'html'){
    oldHTML++;
    const article = data => data.toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
    assert.equal(article(bytes),article(before),`${file}: lessons, questions, formulas, images unchanged`);
    for(const pattern of [/<title>[\s\S]*?<\/title>/,/<link rel="canonical"[^>]*>/,/<meta name="description"[^>]*>/]) assert.equal(bytes.toString().match(pattern)?.[0],before.toString().match(pattern)?.[0],'legacy SEO retained');
  }
}
assert.equal(oldHTML,554);
const attr = (node,name) => node.attrs?.find(a=>a.name===name)?.value;
const nodes = html => {const result=[];const visit=node=>{result.push(node);for(const child of node.childNodes||[])visit(child)};visit(parse(html));return result;};
const htmlFiles=inventory.filter(file=>file.endsWith('.html'));
let switched = 0;
for(const file of htmlFiles){
  const html=fs.readFileSync(file,'utf8'),all=nodes(html),switchLinks=all.filter(node=>attr(node,'data-service-link'));
  if(!switchLinks.length)continue; // popup focus mode deliberately has no GNB
  switched++;
  assert.equal(switchLinks.length,2);
  assert.equal(switchLinks.filter(node=>attr(node,'aria-current')==='true').length,1);
  const expected=file.startsWith('dist/facility-management/')?'facility':'certifications';
  assert.equal(attr(switchLinks.find(node=>attr(node,'aria-current')),'data-service-link'),expected);
  assert.equal(attr(all.find(node=>node.tagName==='body'),'data-service'),expected);
}
const newPages=Object.keys(review.additions).filter(f=>f.endsWith('.html'));assert.equal(newPages.length,7);
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');
for(const file of newPages){
 const html=fs.readFileSync(file,'utf8'),all=nodes(html),route=file.slice(4,-10);
 assert.equal(all.filter(node=>node.tagName==='h1').length,1);
 const empty=/\/(career|qualifications|practice)\/$/.test(route);
 assert.equal(html.includes('content="noindex, follow"'),empty);
 assert.equal(sitemap.includes('https://getpasslab.co.kr'+route),!empty);
 for(const node of all.filter(n=>n.tagName==='a')){
  const href=attr(node,'href');if(!href?.startsWith('/'))continue;
  const target=href.split(/[?#]/)[0];
  const destination=path.join('dist',target,target.endsWith('/')?'index.html':'');
  assert(fs.existsSync(destination),`${file}: broken internal link ${href}`);
 }
}
const article=fs.readFileSync('dist/facility-management/start/reading-job-postings/index.html','utf8');
assert(article.includes('"@type":"Article"')&&article.includes('"@type":"BreadcrumbList"'));
assert(article.includes('<time datetime="2026-10-29">')&&article.includes('공식 출처'));
assert(article.includes('scope="col"')&&article.includes('scope="row"')&&article.includes('facility-table-scroll'));
// Real theme color pairs, including active service labels, body links and focus outlines.
const luminance = hex => hex.match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
for(const [fg,bg] of [['18794E','FFFFFF'],['145C3E','FFFFFF'],['18794E','EAF5EE'],['145C3E','EAF5EE']]){
 const [a,b]=[luminance(fg),luminance(bg)].sort((a,b)=>b-a),ratio=(a+.05)/(b+.05);assert(ratio>=4.5);console.log(`[Facility contrast] #${fg} / #${bg}: ${ratio.toFixed(2)}:1`);
}
console.log('[Service split] PASS',JSON.stringify({nativeFiles:inventory.length,legacyHTMLPreserved:oldHTML,newPages:7,noindexCategories:3,navigationPages:switched,canonicalQuestionData:'unchanged'}));

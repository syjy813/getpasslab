import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mobileTopAdReview as review,beforeMobileTopAd} from './read-before-mobile-top-ad.mjs';
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-27-mobile-top-ad/baseline.json'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
assert.deepEqual(review.productFiles.slice().sort(),['src/layouts/BaseLayout.astro','src/pages/[cert]/[exam]/index.astro','src/pages/[cert]/[exam]/[subject]/index.astro','src/styles/global.css'].sort());
for(const [file,expected]of Object.entries(baseline.files))assert.equal(hash(beforeMobileTopAd(file,fs.readFileSync(file))),expected,file+': exact product scope');
for(const [file,row]of Object.entries(review.files)){
 const bytes=fs.readFileSync(file);assert.equal(hash(bytes),row.sha256,file+': native approved bytes');
 assert.equal(hash(beforeMobileTopAd(file,bytes)),row.beforeSHA256);
 const mutated=Buffer.concat([bytes,Buffer.from(' mutation')]);assert.notEqual(hash(beforeMobileTopAd(file,mutated)),row.beforeSHA256,file+': unknown mutation rejected');
}
let chapters=0,articles=0;const routes=[],certs={};
for(const [file,row]of Object.entries(baseline.html)){
 const bytes=fs.readFileSync(file),html=bytes.toString();
 assert.equal(hash(beforeMobileTopAd(file,bytes)),row.sha256,file+': complete previous build preserved');
 const article=html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];assert.equal(article?hash(article):null,row.articleSHA256,file+': native lesson unchanged');
 if(row.chapter)chapters++;if(article)articles++;
 if(html.includes('data-mobile-top-ad>')){
  const route=file.slice(4,-10);routes.push(route);
  assert(route.includes('/written/')&&route.split('/').length<=5,file+': listing pages only');
  assert.equal((html.match(/data-mobile-top-ad>/g)||[]).length,1);
  assert(html.indexOf('data-mobile-top-ad>')>html.indexOf('</header>')&&html.indexOf('data-mobile-top-ad>')<html.indexOf('<nav class="breadcrumb"'));
  assert(html.includes("ad.dataset.adUnit = 'DAN-aX4OBdYehvddWlai'"));
  certs[route.split('/')[1]]=(certs[route.split('/')[1]]||0)+1;
 }
}
assert.deepEqual(routes.sort(),review.routes.sort());assert.equal(routes.length,15);assert.equal(Object.keys(certs).length,4);assert.equal(chapters,521);
console.log('[Mobile top ad] PASS',JSON.stringify({sources:Object.keys(baseline.files).length,html:Object.keys(baseline.html).length,chapters,articles,routes:routes.length,certs}));

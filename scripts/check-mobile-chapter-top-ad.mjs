import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {mobileChapterAdReview as review,beforeMobileChapterTopAd} from './read-before-mobile-chapter-top-ad.mjs';
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-27-mobile-top-ad/baseline.json'));
const prior=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-mobile-top-ad/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
assert.deepEqual(review.productFiles,['src/layouts/ChapterLayout.astro']);
for(const [file,original]of Object.entries(baseline.files)){
 const bytes=fs.readFileSync(file),expected=prior.files[file]?.sha256||original;
 assert.equal(hash(beforeMobileChapterTopAd(file,bytes)),expected,file+': only chapter-layout flag changes');
}
for(const [file,row]of Object.entries(review.files)){
 const bytes=fs.readFileSync(file);assert.equal(hash(bytes),row.sha256,file+': complete reviewed native bytes');
 assert.equal(hash(beforeMobileChapterTopAd(file,bytes)),row.beforeSHA256);
 assert.notEqual(hash(beforeMobileChapterTopAd(file,Buffer.concat([bytes,Buffer.from(' mutation')]))),row.beforeSHA256,file+': unknown mutation stays visible');
}
let chapters=0,articles=0,slots=0;const certs={};
for(const [file,row]of Object.entries(baseline.html)){
 const bytes=fs.readFileSync(file),html=bytes.toString();
 assert.equal(hash(beforeMobileChapterTopAd(file,bytes)),prior.files[file]?.sha256||row.sha256,file+': exact prior deployment preserved');
 const article=html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];assert.equal(article?hash(article):null,row.articleSHA256,file+': native article/questions/images unchanged');
 if(article)articles++;
 const count=(html.match(/data-mobile-top-ad>/g)||[]).length;
 const expected=row.chapter||prior.routes.includes(file.slice(4,-10));assert.equal(count,expected?1:0,file+': every chapter and existing listing gets one slot');
 if(count){
  slots++;assert(html.includes("ad.dataset.adUnit = 'DAN-aX4OBdYehvddWlai'"));
  assert(html.indexOf('data-mobile-top-ad>')>html.indexOf('</header>')&&html.indexOf('data-mobile-top-ad>')<html.indexOf('class="breadcrumb"'));
 }
 if(row.chapter){chapters++;const cert=file.split('/')[1];certs[cert]=(certs[cert]||0)+1;assert(review.routes.includes(file.slice(4,-10)));}
}
assert.equal(chapters,521);assert.equal(slots,536);assert.equal(review.routes.length,521);assert.equal(articles,524);
console.log('[Mobile chapter top ad] PASS',JSON.stringify({chapters,articles,slots,certs,sources:Object.keys(baseline.files).length,html:Object.keys(baseline.html).length}));

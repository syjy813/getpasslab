import {beforeMobileTopAd} from './read-before-mobile-top-ad.mjs';
import fs from './read-before-fire-priority-chapters.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gnbTOCHeightReview as review,beforeGNBTOCHeight} from './read-before-gnb-toc-height.mjs';
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-gnb-toc-height/baseline.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
assert.deepEqual(review.productFiles,['src/styles/global.css']);
for(const [file,expected]of Object.entries(baseline.files))assert.equal(hash(beforeGNBTOCHeight(file,fs.readFileSync(file))),expected,file+': sole CSS source change');
for(const [file,row]of Object.entries(review.files)){
 const bytes=beforeMobileTopAd(file,fs.readFileSync(file));assert.equal(hash(bytes),row.sha256,file+': current reviewed bytes');
 assert.equal(hash(beforeGNBTOCHeight(file,bytes)),row.beforeSHA256);
 const mutation=Buffer.concat([bytes,Buffer.from(' mutation')]);
 assert.notEqual(hash(mutation),row.sha256);assert.notEqual(hash(beforeGNBTOCHeight(file,mutation)),row.beforeSHA256,file+': unknown change is not hidden');
}
let chapters=0,articles=0;
for(const [file,row]of Object.entries(baseline.html)){
 const bytes=fs.readFileSync(file);assert.equal(hash(beforeGNBTOCHeight(file,bytes)),row.sha256,file+': only stylesheet reference changed');
 const article=bytes.toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];assert.equal(article?hash(article):null,row.articleSHA256,file+': whole article unchanged');
 if(row.chapter)chapters++;if(article)articles++;
}
assert.equal(chapters,521);
console.log('[GNB TOC height] PASS',JSON.stringify({chapters,articles,sources:Object.keys(baseline.files).length,html:Object.keys(baseline.html).length,reviewedChanges:Object.keys(review.files).length}));

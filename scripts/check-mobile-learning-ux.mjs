import {beforeGNBChapterTOC} from './read-before-gnb-chapter-toc.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {mobileUXReview,beforeMobileLearningUX} from './read-before-mobile-learning-ux.mjs';
const audit='docs/audits/2026-10-26-mobile-learning-ux/';
const baseline=JSON.parse(fs.readFileSync(audit+'baseline.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
assert.deepEqual(mobileUXReview.productFiles.sort(),['src/components/GNB.astro','src/layouts/ChapterLayout.astro','src/styles/global.css']);
for(const [file,expected]of Object.entries(baseline.files)){
  const bytes=beforeGNBChapterTOC(file,fs.readFileSync(file));
  assert.equal(hash(beforeMobileLearningUX(file,bytes)),expected,file+': source/content/asset preservation');
}
for(const [file,row]of Object.entries(mobileUXReview.files)){
  const bytes=beforeGNBChapterTOC(file,fs.readFileSync(file));assert.equal(hash(bytes),row.sha256,file+': exact current bytes');
  assert.equal(hash(beforeMobileLearningUX(file,bytes)),row.beforeSHA256);
  assert.throws(()=>beforeMobileLearningUX(file,Buffer.concat([bytes,Buffer.from(' mutation')])));
}
let chapters=0,articles=0;const certs={};
for(const [file,row]of Object.entries(baseline.html)){
  const bytes=beforeGNBChapterTOC(file,fs.readFileSync(file)),html=bytes.toString();
  assert.equal(hash(beforeMobileLearningUX(file,bytes)),row.sha256,file+': complete original HTML restored');
  const article=html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
  assert.equal(article?hash(article):null,row.articleSHA256,file+': exact native article, question payload and figure markup');
  if(article)articles++;
  if(!row.chapter)continue;
  const nodes=[];const visit=n=>{nodes.push(n);for(const c of n.childNodes||[])visit(c);};visit(parse(html));
  const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
  const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
  const list=nodes.filter(n=>n.tagName==='details'&&has(n,'learning-chapters'));
  assert.equal(list.length,1,file+': every certification has a mobile chapter list');
  const indexes=nodes.filter(n=>n.tagName==='a'&&has(n,'chapter-mobile-index'));
  assert.equal(indexes.length,1);assert(attr(indexes[0],'href')?.endsWith('/'));
  assert.equal(nodes.filter(n=>n.tagName==='dialog'&&has(n,'learning-image-dialog')).length,1);
  assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
  chapters++;const cert=file.split('/')[1];certs[cert]=(certs[cert]||0)+1;
}
assert.equal(chapters,521);
console.log('[Mobile learning UX] PASS',JSON.stringify({chapters,articles,certs,sourceFiles:Object.keys(baseline.files).length,htmlFiles:Object.keys(baseline.html).length,mutationsRejected:Object.keys(mobileUXReview.files).length}));

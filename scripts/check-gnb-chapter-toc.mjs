import {beforeGNBTOCHeight} from './read-before-gnb-toc-height.mjs';
import fs from './read-before-fire-priority-chapters.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {gnbTOCReview,beforeGNBChapterTOC} from './read-before-gnb-chapter-toc.mjs';
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-gnb-chapter-toc/baseline.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
assert.deepEqual(gnbTOCReview.productFiles.sort(),['src/components/GNB.astro','src/layouts/BaseLayout.astro','src/layouts/ChapterLayout.astro','src/styles/global.css']);
for(const [file,expected]of Object.entries(baseline.files))assert.equal(hash(beforeGNBChapterTOC(file,beforeGNBTOCHeight(file,fs.readFileSync(file)))),expected,file+': exact source preservation');
for(const [file,row]of Object.entries(gnbTOCReview.files)){
 const bytes=beforeGNBTOCHeight(file,fs.readFileSync(file));assert.equal(hash(bytes),row.sha256,file+': native current bytes');
 assert.equal(hash(beforeGNBChapterTOC(file,bytes)),row.beforeSHA256);
 assert.throws(()=>beforeGNBChapterTOC(file,Buffer.concat([bytes,Buffer.from(' mutation')])));
}
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const descendants=n=>{const a=[];const visit=x=>{a.push(x);for(const c of x.childNodes||[])visit(c);};visit(n);return a;};
let chapters=0,ordinary=0,articles=0;const certs={};
for(const [file,row]of Object.entries(baseline.html)){
 const bytes=beforeGNBTOCHeight(file,fs.readFileSync(file)),html=bytes.toString();assert.equal(hash(beforeGNBChapterTOC(file,bytes)),row.sha256,file+': exact allowed HTML changes');
 const article=html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];assert.equal(article?hash(article):null,row.articleSHA256,file+': native lesson/question/formula/image bytes');if(article)articles++;
 const nodes=descendants(parse(html)),gnb=nodes.find(n=>has(n,'gnb-menu'));
 if(!gnb)continue;
 const summary=descendants(gnb).find(n=>n.tagName==='summary');
 if(!row.chapter){assert.equal(text(summary).trim(),'자격증 · 과목',file+': ordinary page menu');ordinary++;continue;}
 assert.equal(text(summary).trim(),'챕터 목차');
 assert(!nodes.some(n=>has(n,'learning-chapters')||has(n,'chapter-mobile-index')),file+': body and bottom TOC removed');
 const menu=nodes.find(n=>has(n,'gnb-chapter-dropdown')),sidebar=nodes.find(n=>has(n,'chapter-side'));
 const links=n=>descendants(n).filter(e=>e.tagName==='a').map(e=>({href:attr(e,'href'),title:text(e).trim(),current:attr(e,'aria-current')}));
 assert.deepEqual(links(menu),links(sidebar),file+': same subject, group sequence, title and current chapter');
 const current=links(menu).filter(n=>n.current==='page');assert.equal(current.length,1);assert.equal(current[0].href,file.slice(4,-10));
 const bottom=nodes.find(n=>has(n,'chapter-mobile-nav-inner'));assert.equal((bottom.childNodes||[]).filter(n=>n.tagName).length,2,file+': original previous/next layout');
 chapters++;const cert=file.split('/')[1];certs[cert]=(certs[cert]||0)+1;
}
assert.equal(chapters,521);
console.log('[GNB chapter TOC] PASS',JSON.stringify({chapters,ordinary,articles,certs,sources:Object.keys(baseline.files).length,html:Object.keys(baseline.html).length,exactDeltaGuards:Object.keys(gnbTOCReview.files).length}));

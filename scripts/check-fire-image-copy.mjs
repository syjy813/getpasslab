// Current native bytes are checked by check-mobile-toc-width.mjs.
import fs from './read-before-mobile-toc-width.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parseFragment} from 'parse5';
import {imageCopyReview as review,beforeFireImageCopy} from './read-before-fire-image-copy.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const files=[...walk('src'),...walk('public'),...walk('dist').filter(f=>f.endsWith('.html'))].sort();
assert.deepEqual(files,Object.keys(review.current).sort());
for(const f of files)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': reviewed current file');
assert.equal(Object.keys(review.changes).length,17);
for(const [f,row]of Object.entries(review.changes)){
 const data=fs.readFileSync(f);
 assert.equal(hash(beforeFireImageCopy(f,data)),row.beforeSHA256);
 assert.notEqual(hash(beforeFireImageCopy(f,Buffer.concat([data,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown changes stay visible');
}
for(const [f,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(f)),sha,f+': question data retained');
const brief=JSON.parse(fs.readFileSync('docs/audits/2026-10-28-fire-image-copy/figure-briefs.json'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const flatten=html=>{const out=[];const visit=n=>{out.push(n);for(const c of n.childNodes||[])visit(c);};visit(parseFragment(html));return out;};
const teaching=s=>s.replace(/<figure>[\s\S]*?<\/figure>/g,'<figure/>').replace(/<dialog[\s\S]*?<\/dialog>/g,'<dialog/>').replace('/styles/fire-panel-lessons.css?v=fire-image-copy-20261028','/styles/fire-panel-lessons.css');
for(const r of brief.figures){
 const f='src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+r.slug+'.md';
 const data=fs.readFileSync(f),s=data.toString(),old=beforeFireImageCopy(f,data).toString();
 assert.equal(teaching(s),teaching(old),f+': teaching, metadata and practice connections unchanged');
 const nodes=flatten(s),oldNodes=flatten(old);
 assert.deepEqual(nodes.filter(n=>n.tagName==='img').map(n=>n.attrs),oldNodes.filter(n=>n.tagName==='img').map(n=>n.attrs),f+': original image attributes retained');
 assert.equal(nodes.filter(n=>n.tagName==='p'&&attr(n,'class')==='fire-panel-note').length,1);
 assert.equal(s.split(brief.notice).length-1,1);
 assert(s.includes('<figcaption><strong>'+r.caption+'</strong></figcaption>'));
 assert(!s.includes('학습용 재구성 ·'));
 const image='public'+r.src;assert(!review.changes[image],image+': original pixels retained');
}
console.log('[Fire image copy] PASS',JSON.stringify({chapters:8,currentFiles:files.length,originalImages:'unchanged',teachingAndQuestions:'unchanged'}));

// Current files are checked by check-footer-left.mjs.
import fs from './read-before-footer-left.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mobileTOCWidthReview as review,beforeMobileTOCWidth} from './read-before-mobile-toc-width.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(f=>f.endsWith('.html'))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort());
for(const f of inventory)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': current native file');
assert.deepEqual(review.productFiles,['src/styles/global.css']);
for(const [f,row]of Object.entries(review.changes)){
 const data=fs.readFileSync(f),before=beforeMobileTOCWidth(f,data);
 assert.equal(hash(before),row.beforeSHA256,f+': exact prior version');
 assert.notEqual(hash(beforeMobileTOCWidth(f,Buffer.concat([data,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown mutation stays visible');
 if(f.endsWith('.html')){
  const normalize=b=>b.toString().replace(/href="\/_astro\/[^" ]+\.css"/g,'href="/_astro/STYLE.css"');
  assert.equal(normalize(data),normalize(before),f+': only stylesheet URL changed');
 }else assert.equal(f,'src/styles/global.css','only global CSS product edit');
}
console.log('[Mobile TOC width native] PASS',inventory.length,'current files; all content, assets, questions and routes retained');

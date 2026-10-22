import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {beforeChapterHierarchy} from './read-before-fire-persona-corrections.mjs';

const audit='docs/audits/2026-10-22-all-chapter-hierarchy/';
const baseline=JSON.parse(fs.readFileSync(audit+'baseline.json'));
const review=JSON.parse(fs.readFileSync(audit+'review.json'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
assert.deepEqual([...walk('src'),...walk('public')].sort(),Object.keys(baseline.files).sort());
assert.deepEqual(review.productFiles,['src/styles/global.css']);
for(const [file,expected]of Object.entries(baseline.files)){
  const bytes=fs.readFileSync(file);
  if(review.productFiles.includes(file)){
    assert.equal(hash(bytes),review.changes[file].sha256,file+': reviewed native stylesheet');
    assert.equal(hash(beforeChapterHierarchy(file,bytes)),expected);
    assert.throws(()=>beforeChapterHierarchy(file,Buffer.concat([bytes,Buffer.from('\n')])));
  }else assert.equal(hash(bytes),expected,file+': original source, content, data or asset');
}
const html=walk('dist').filter(f=>f.endsWith('.html'));
assert.deepEqual(html.sort(),Object.keys(baseline.html).sort());
let chapters=0,articles=0;const counts={};
for(const file of html){
  const bytes=fs.readFileSync(file),row=baseline.html[file];
  const restored=beforeChapterHierarchy(file,bytes);
  assert.equal(hash(restored),row.sha256,file+': only the stylesheet reference changes');
  const article=bytes.toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
  assert.equal(article?hash(article):null,row.articleSHA256,file+': native article unchanged');
  if(article)articles++;
  if(row.chapter){chapters++;const cert=file.split('/')[1];counts[cert]=(counts[cert]||0)+1;}
  if(review.changes[file])assert.throws(()=>beforeChapterHierarchy(file,Buffer.concat([bytes,Buffer.from(' mutation')])));
}
assert.equal(chapters,521);assert.deepEqual(counts,review.chapterCounts);
console.log('[All chapter hierarchy] PASS',JSON.stringify({chapters,articles,counts,sourceFiles:Object.keys(baseline.files).length}));

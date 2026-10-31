import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {parse} from 'parse5';import {imageCopyReview,beforeImageCopy} from './read-before-image-copy.mjs';
import {beforeHomepageTitle,assertCurrentHomepageTitle} from './read-before-homepage-title.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const files=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(files,Object.keys(imageCopyReview.current).sort(),'current inventory');
for(const f of files){const native=fs.readFileSync(f);const b=beforeHomepageTitle(f,native);if(f==='src/pages/index.astro'||f==='dist/index.html')assertCurrentHomepageTitle(f,native);assert.equal(hash(b),imageCopyReview.current[f],f+': exact reviewed file');if(imageCopyReview.changes[f]){assert.equal(hash(beforeImageCopy(f,b)),imageCopyReview.changes[f].beforeSHA256,f+': exact predecessor');assert.notEqual(hash(beforeImageCopy(f,Buffer.concat([b,Buffer.from('mutation')]))),imageCopyReview.changes[f].beforeSHA256,f+': unknown edits detectable');}}
let pages=0;
for(const f of files.filter(x=>x.endsWith('.html'))){let root=parse(fs.readFileSync(f,'utf8'));function walkNode(n,insideArticle=false,hidden=false){insideArticle ||= n.tagName==='article';hidden ||= ['script','style','svg','dialog'].includes(n.tagName);if(insideArticle&&!hidden&&n.nodeName==='#text')assert(!/(학습용 재구성|학습을 위해 재구성된 이미지|재구성임)/.test(n.value),f+': visible generic notice remains');for(const c of n.childNodes||[])walkNode(c,insideArticle,hidden)}walkNode(root);pages++}
const boiler=fs.readFileSync('src/content/chapters/energy-management/thermal-equipment/boiler-types-construction.md','utf8');for(const term of ['관 안을 흐르는 것','관의 배치','동체 방향','관의 수','재료','연소실 위치','반전·배출 경로가 생략','관 밖의 가열 부분'])assert(boiler.includes(term),term);
console.log('[Image copy] PASS',JSON.stringify({files:files.length,changes:Object.keys(imageCopyReview.changes).length,pages}));

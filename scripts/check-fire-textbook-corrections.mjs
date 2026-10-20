import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-18-fire-level2-textbook-corrections';
const baseline=JSON.parse(await readFile(audit+'/baseline.json','utf8'));
const release=JSON.parse(await readFile(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=async d=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]))).flat();
const files=[...await walk('src'),...await walk('public')].sort();
assert.deepEqual(files,Object.keys(baseline.files).sort(),'public source inventory unchanged');
const byPath=new Map(release.files.map(r=>[r.path,r]));
for(const f of files)assert.equal(hash(await readFile(f)),byPath.get(f)?.sha256??baseline.files[f],f);
const article=s=>s.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
const articles={};
for(const f of await walk('dist'))if(f.endsWith('/index.html')){const a=article(await readFile(f,'utf8'));if(a!==undefined)articles[f]=hash(a)}
assert.deepEqual(articles,{...baseline.articles,...release.articleChanges},'only reviewed chapter articles changed');
for(const row of release.files){
 assert.equal(hash(await readFile(row.originalFile)),row.originalSha256,row.originalFile);
 assert.equal(hash(await readFile(row.path)),row.sha256,row.path);
 if(row.path.endsWith('.md')){
  const old=(await readFile(row.originalFile,'utf8')).match(/^---[\s\S]*?\n---/)[0];
  const current=(await readFile(row.path,'utf8')).match(/^---[\s\S]*?\n---/)[0];
  assert.equal(current,old,row.path+': chapter identity, URL and question assignments unchanged');
 }
}
const chapters=await walk('src/content/chapters/fire-safety-manager-level2');assert.equal(chapters.length,74);
assert.equal(release.changedChapterIds.length,17);assert.equal(Object.keys(release.articleChanges).length,17);
const rating=await readFile('src/content/chapters/fire-safety-manager-level2/fire-safety-theory/extinguisher-types-ratings.md','utf8');
assert(rating.includes('(4+6)×0.5 = **5단위**'));assert(!rating.includes('**8단위**'));
const burn=await readFile('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/burns-types-first-aid.md','utf8');
assert(burn.includes('냉각을 시작하면서'));assert(!burn.includes('20분 이상** 환부 식히기 → 붙지 않은'));
console.log(`[Fire textbook corrections] ${files.length} sources/assets, ${Object.keys(articles).length} articles; 17 reviewed chapters and 3 SVGs changed; identities, other content and canonical questions preserved`);

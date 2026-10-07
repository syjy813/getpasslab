import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {readFile,publication} from './read-before-clam-shell.mjs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';
const audit='docs/audits/2026-10-06-industrial-20190804-full-review';
const review=JSON.parse(await readFile(`${audit}/review.json`,'utf8'));
const baseline=JSON.parse(await readFile(`${audit}/baseline.json`,'utf8'));
const edits=JSON.parse(await readFile(`${audit}/canonical-edits.json`,'utf8'));
const source=JSON.parse(await readFile(`${audit}/question-review.json`,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const fields=t=>yaml.load(t.match(/^---\n([\s\S]*?)\n---/)[0].slice(4,-4));
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())result.push(...await walk(p));else result.push(p)}return result}
assert.deepEqual([...await walk('src'),...await walk('public')].sort(),[...Object.keys(baseline.protectedFiles),...review.assets.map(r=>r.path)].sort());
const changed=new Map([...review.chapters,...review.canonicalFiles,...review.assetRegistries,...review.displayFiles].map(r=>[r.path,r]));
for(const [file,before] of Object.entries(baseline.protectedFiles)){const row=changed.get(file);if(row)assert.equal(row.originalSha256,before);assert.equal(hash(await readFile(file)),row?.sha256??before,`${file}: reviewed scope only`)}
let original=await readFile(review.canonicalFiles[0].path,'utf8');assert.equal(edits.length,42);
for(const edit of [...edits].reverse()){assert.equal(original.split(edit.after).length,2);original=original.replace(edit.after,edit.before)}
assert.equal(hash(original),baseline.protectedFiles[review.canonicalFiles[0].path],'all other 1638 records and formatting preserved');
const before=JSON.parse(original),questions=JSON.parse(await readFile(review.canonicalFiles[0].path,'utf8'));
assert.equal(questions.length,1680);assert.equal(new Set(questions.map(q=>q.id)).size,1680);
for(const [index,q] of questions.entries()){for(const key of Object.keys(q).filter(k=>!['body','choices'].includes(k)))assert.deepEqual(q[key],before[index][key],`${q.id}: frozen ${key}`)}
assert.equal(source.records.length,120);assert.equal(source.newlyReviewed,116);
for(const row of source.records){const q=questions.find(q=>q.id===row.id);assert.equal(q.answer,row.sourceAnswer);assert(row.answerMatches&&row.textReviewed)}
assert.deepEqual(edits.filter(e=>e.afterRecord.number>=101&&e.afterRecord.number<=116).map(e=>e.id).sort(),Array.from({length:16},(_,i)=>`20190804_${101+i}`));
const registry=review.assetRegistries[0];assert.deepEqual(JSON.parse(await readFile(registry.path,'utf8')),[...JSON.parse(await readFile(registry.originalFile,'utf8')),...registry.addedEntries]);
for(const row of review.assets){const png=await readFile(row.path);assert.equal(hash(png),row.sha256);assert.equal(png.readUInt32BE(16),row.width);assert.equal(png.readUInt32BE(20),row.height)}
const allocations=new Map(),oldAllocations=new Map();let published=0;
for(const file of await walk('src/content/chapters')){if(!file.endsWith('.md'))continue;const current=fields(await readFile(file,'utf8'));if((current.cert_id??'industrial-safety')!=='industrial-safety'||current.status!=='완료')continue;published++;const row=review.chapters.find(r=>r.path===file);const old=row?fields(await readFile(row.originalFile,'utf8')):current;for(const [map,f] of [[allocations,current],[oldAllocations,old]])for(const id of f.questions??[])map.set(id,[...map.get(id)??[],f.slug]);if(row){for(const key of Object.keys(old).filter(k=>!['questions',...(row.slug==='steel-pipe-scaffold'?['examComment']:[])].includes(k)))assert.deepEqual(current[key],old[key]);assert.deepEqual(current.questions,row.questions)}}
assert.equal(published,258);assert.equal([...oldAllocations.values()].flat().length,1019);assert.equal([...allocations.values()].flat().length,1014);
for(const [id,old] of oldAllocations){const move=review.allocations.find(r=>r.id===id);if(move){assert.deepEqual(old,[move.from]);assert.deepEqual(allocations.get(id)??[],move.to?[move.to]:[])}else assert.deepEqual(allocations.get(id),old,`${id}: assignment preserved`)}
assert.deepEqual([...allocations.keys()].filter(id=>!oldAllocations.has(id)),[]);
const routes=[];for(const file of await walk('dist'))if(file.endsWith('/index.html')&&/<article\b/.test(await readFile(file,'utf8')))routes.push(file);
assert.deepEqual(routes.sort(),[...baseline.pages.map(r=>r.path),publication.chapter.articlePath].sort());
for(const row of baseline.pages){const html=await readFile(row.path,'utf8'),article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1],change=review.articles.find(r=>r.path===row.path);if(change){assert.equal(hash(article),change.articleSha256);assert.equal(hash(await readFile(change.originalFile)),row.articleSha256)}else{let restored=article;for(const edit of review.articleAssetReferenceEdits){assert(restored.split(edit.after).length<=2);restored=restored.replace(edit.after,edit.before)}assert.equal(hash(restored),row.articleSha256,`${row.url}: all other article bytes unchanged`)}}
const loader=review.generatedLoader;let code=await readFile(`dist${loader.path}`,'utf8');assert.equal(hash(code),loader.sha256);for(const edit of loader.edits){assert.equal(code.split(edit.after).length,2);code=code.replace(edit.after,edit.before)}assert.equal(hash(code),loader.originalSha256);
assert.equal(hash(await readFile(`dist${review.questionPayload.path}`)),review.questionPayload.sha256);
console.log('[Historical release: 20190804 source review] 120 original questions / 116 newly reviewed; 42 corrections, 16 mis-imported bodies, 7 restored contexts, 3 original diagrams; all answers/IDs preserved; 258 chapters / 1014 primary references');

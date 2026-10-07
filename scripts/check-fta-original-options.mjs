import { readFile } from './read-before-20190804-review.mjs';
import { publication } from './read-before-clam-shell.mjs';
import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {restoreFTAOriginalAssetAttrs, reviewedAssetAdditions} from './reviewed-chapter-hash.mjs';
const audit='docs/audits/2026-10-06-fta-original-options';
const review=JSON.parse(await readFile(`${audit}/review.json`,'utf8'));
const baseline=JSON.parse(await readFile(`${audit}/source-verification.json`,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p)}return files}
assert.equal(review.assetRegistries.length,1);assert.equal(review.assets.length,1);assert.equal(review.articleEdits.length,1);
const registry=review.assetRegistries[0],asset=review.assets[0],edit=review.articleEdits[0];
assert.equal(registry.path,'src/data/question-assets/industrial-safety.json');
assert.equal(asset.path,'src/assets/questions/industrial-safety/20180304_036.png');
assert.deepEqual([...await walk('src'),...await walk('public')].sort(),[...Object.keys(baseline.protectedFiles),...reviewedAssetAdditions.map(row=>row.path)].sort());
for(const [file,expected] of Object.entries(baseline.protectedFiles))assert.equal(hash(await readFile(file)),file===registry.path?registry.sha256:expected,`${file}: only one reviewed registry addition allowed`);
assert.equal(registry.originalSha256,baseline.protectedFiles[registry.path]);
const original=await readFile(`${audit}/original-registry.json`);
assert.equal(hash(original),registry.originalSha256);
const before=JSON.parse(original),after=JSON.parse(await readFile(registry.path,'utf8'));
assert.deepEqual(after,[...before,registry.addedEntry]);
assert.equal(new Set(after.map(e=>e.id)).size,after.length);
assert.equal(registry.addedEntry.id,'20180304_036');assert.equal(registry.addedEntry.asset_path,asset.path);
assert.equal(hash(await readFile(asset.path)),asset.sha256);
const png=await readFile(asset.path);assert.equal(png.readUInt32BE(16),720);assert.equal(png.readUInt32BE(20),792);
const question=JSON.parse(await readFile('src/data/questions/industrial-safety.json','utf8')).find(q=>q.id==='20180304_036');
assert.equal(question.answer,3);assert.deepEqual(question.choices,[': 전이기호',': 기본사상',': 통상사상',': 결함사상']);
const paths=[];
for(const file of await walk('dist'))if(file.endsWith('/index.html')){const s=await readFile(file,'utf8');if(/<article\b/.test(s))paths.push('https://getpasslab.co.kr/'+file.slice(5,-10))}
assert.deepEqual(paths.sort(),[...baseline.publicPages.map(row=>row.url),publication.chapter.url].sort());
assert.equal(baseline.publicPages.length,445); // 442 public chapters + 3 existing other article pages.
for(const row of baseline.publicPages){
 const html=await readFile(`dist${new URL(row.url).pathname}index.html`,'utf8'),article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
 if(row.url===edit.url){
  assert.equal(hash(article),edit.articleSha256);assert.equal(hash(restoreFTAOriginalAssetAttrs(article)),row.articleSha256);
  assert.equal(edit.originalArticleSha256,row.articleSha256);
  assert.equal(hash(await readFile(`${audit}/original-article.html`)),row.articleSha256);
  assert(edit.after.includes('data-question-image-src=')&&edit.after.includes('data-question-image-width="720"'));
 }else assert.equal(hash(article),row.articleSha256,`${row.url}: unrelated article changed`);
}
console.log('[Historical release: FTA original options] one original-symbol image / one registry addition; canonical questions, all chapter sources, CSS, popup code and 444 unrelated articles preserved');

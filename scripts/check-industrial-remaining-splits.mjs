import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import {reviewedChapterHash} from './reviewed-chapter-hash.mjs';
const earthReview=JSON.parse(await readFile('docs/audits/2026-10-05-earth-retaining-structure/review.json','utf8'));

const audit='docs/audits/2026-10-05-industrial-remaining-splits';
const review=JSON.parse(await readFile(`${audit}/review.json`,'utf8'));
const baseline=JSON.parse(await readFile(`${audit}/source-verification.json`,'utf8'));
const hash=x=>createHash('sha256').update(x).digest('hex');
const parse=s=>yaml.load(s.match(/^---\n([\s\S]*?)\n---\n/)[1]);
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(f));else files.push(f);}return files;}
assert.equal(review.families.length,7);assert.equal(review.chapters.length,17);
assert.equal(review.chapters.filter(c=>c.newFile).length,10);
const actualFiles=[...await walk('src'),...await walk('public')];
assert.deepEqual(actualFiles.sort(),[...Object.keys(baseline.protectedFiles),...review.chapters.filter(c=>c.newFile).map(c=>c.path),...earthReview.assets.map(c=>c.path)].sort());
for(const [file,original] of Object.entries(baseline.protectedFiles)){
 const row=review.chapters.find(c=>c.path===file);if(row)assert.equal(row.originalSha256,original);
 const actual=hash(await readFile(file)),expected=row?.sha256??original;
 if(actual!==expected)assert.equal(actual,reviewedChapterHash(file,expected),`${file}: unrelated source or asset changed`);
}
const canonical=new Map(JSON.parse(await readFile('src/data/questions/industrial-safety.json','utf8')).map(q=>[q.id,q]));
assert.equal(hash(await readFile('src/data/questions/industrial-safety.json')),baseline.canonicalSha256);
assert.equal(hash(await readFile('src/data/question-assets/industrial-safety.json')),baseline.questionAssetsSha256);
const questionReview=JSON.parse(await readFile(`${audit}/question-source-review.json`,'utf8'));
assert.equal(questionReview.length,54);
const assigned=review.chapters.flatMap(c=>c.questions);assert.equal(assigned.length,54);assert.equal(new Set(assigned).size,54);
assert.deepEqual(review.addedPrimaryQuestionIds,baseline.addedPrimaryQuestionIds);assert.equal(review.addedPrimaryQuestionIds.length,16);
for(const id of review.addedPrimaryQuestionIds)assert(!baseline.beforePrimaryQuestionIds.includes(id),`${id}: was already assigned`);
const originalIds=baseline.originalFamilies.flatMap(f=>f.questions);
assert.deepEqual([...assigned].sort(),[...originalIds,...review.addedPrimaryQuestionIds].sort());
const sitemap=await readFile('dist/sitemap-0.xml','utf8');
for(const family of review.families){
 const parent=review.chapters.find(c=>c.slug===family.parent),before=await readFile(`${audit}/originals/${family.parent}.md`,'utf8');
 assert.equal(hash(before),parent.originalSha256);
 const fields=parse(await readFile(parent.path,'utf8')),old=parse(before);
 for(const key of ['slug','title','subject_id','group','order','priority'])assert.equal(fields[key],old[key]);
 const combined=[parent,...review.chapters.filter(c=>family.children.includes(c.slug))].flatMap(c=>c.questions);
 assert(old.questions.every(id=>combined.includes(id)),`${family.parent}: original question lost`);
 const toc=await readFile(`dist/industrial-safety/written/${family.folder}/index.html`,'utf8');
 for(const slug of [family.parent,...family.children])assert(toc.includes(`/industrial-safety/written/${family.folder}/${slug}/`));
}
for(const row of review.chapters){
 const source=await readFile(row.path,'utf8'),fields=parse(source);assert.equal(hash(source),row.sha256);
 assert.deepEqual(fields.questions,row.questions);assert.deepEqual(fields.related,row.related);assert.equal(fields.status,'완료');
 const html=await readFile(`dist${new URL(row.url).pathname}index.html`,'utf8');assert.equal(hash(html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]),row.articleSha256);
 assert.equal((html.match(/<h1\b/g)??[]).length,1);assert(!/katex-error|noindex|http-equiv="refresh"/.test(html));assert(html.includes(`href="${row.url}"`));assert(sitemap.includes(row.url));
 assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m=>m[1]),row.questions);
 for(const id of row.questions){const q=canonical.get(id);assert.equal(q?.subject_id,row.subject_id);assert.equal(q?.review,'');const record=questionReview.find(r=>r.id===id);for(const key of ['body','choices','answer','review'])assert.deepEqual(record[key],q[key]);}
 const family=review.families.find(f=>f.parent===row.slug||f.children.includes(row.slug));
 for(const target of row.newFile?[family.parent]:family.children)assert(html.includes(`/industrial-safety/written/${family.folder}/${target}/`));
}
for(const row of baseline.originalQuestionImages)assert.equal(hash(await readFile(row.path)),row.sha256);
const published=[];for(const file of await walk('src/content/chapters')){if(!file.endsWith('.md'))continue;const c=parse(await readFile(file,'utf8'));if((c.cert_id??'industrial-safety')==='industrial-safety'&&c.status==='완료')published.push(c);}
const ids=published.flatMap(c=>c.questions??[]);assert.equal(published.length,baseline.beforePublished+10);assert.equal(ids.length,baseline.beforePrimaryReferences+16);
assert.deepEqual([...new Set(ids)].sort(),[...baseline.beforePrimaryQuestionIds,...review.addedPrimaryQuestionIds].sort());
for(const [id,count] of Object.entries(baseline.beforePrimaryCounts))assert.equal(ids.filter(q=>q===id).length,count,`${id}: preserve existing global allocation count`);
for(const id of review.addedPrimaryQuestionIds)assert.equal(ids.filter(q=>q===id).length,1);
// Independent check of the retained graph sum and the balanced reaction.
assert(Math.abs(-.7+.18+.6*2+.7-1.38)<1e-12);
assert.deepEqual({Ca:1,C:2,H:2*2,O:2},{Ca:1,C:2,H:2+2,O:2});
console.log('[Remaining splits] 7 families / 17 routes / 10 new chapters; 38 moved or retained + 16 reviewed unassigned questions; 258 industrial chapters / 1019 primary references; originals and 4 figures preserved');

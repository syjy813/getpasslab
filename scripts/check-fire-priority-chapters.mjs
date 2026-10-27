// Native current files only. Archived checks separately reconstruct old releases.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {beforeFirePriorityChapters} from './read-before-fire-priority-chapters.mjs';
import {getPublishedFireQuestions} from '../src/utils/firePractice.ts';
const audit='docs/audits/2026-10-27-fire-priority-chapters';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=json(audit+'/baseline.json');
const review=JSON.parse(gunzipSync(fs.readFileSync(audit+'/review.json.gz')));
const briefs=json(audit+'/figure-briefs.json').figures;
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public')].sort();
const addedSources=Object.keys(review.additions).filter(p=>p.startsWith('src/')||p.startsWith('public/'));
assert.equal(addedSources.length,10,'five chapters and five SVGs only');
assert.deepEqual(inventory,[...Object.keys(baseline.files),...addedSources].sort());
const expectedChanged=[
 'src/components/FirePracticeEntry.astro','src/config/certifications.ts','src/content.config.ts',
 ...['p-receiver-indicators-switches','pump-control-panels-states','pump-performance-tests','preaction-cross-zone-test'].map(s=>'src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+s+'.md'),
 'src/pages/[cert]/[exam]/[subject]/[slug].astro','src/pages/fire-safety-manager-level2/practice/index.astro'
].sort();
assert.deepEqual(Object.keys(review.files).filter(p=>p.startsWith('src/')||p.startsWith('public/')).sort(),expectedChanged);
for(const file of inventory){
 const bytes=fs.readFileSync(file);
 assert.equal(hash(bytes),review.files[file]?.sha256||review.additions[file]||baseline.files[file],file+': exact current source/asset');
}
for(const [file,sha]of Object.entries(baseline.questions))assert.equal(hash(fs.readFileSync(file)),sha,file+': existing questions and approval unchanged');
for(const [file,row]of Object.entries(review.files)){
 const bytes=fs.readFileSync(file);assert.equal(hash(bytes),row.sha256,file+': complete current bytes');
 assert.equal(hash(beforeFirePriorityChapters(file,bytes)),row.beforeSHA256,file+': exact archived inverse');
 assert.notEqual(hash(beforeFirePriorityChapters(file,Buffer.concat([bytes,Buffer.from(' unreviewed')]))),row.beforeSHA256,file+': mutation remains visible');
}
for(const p of expectedChanged.filter(p=>p.endsWith('.md'))){
 const now=fs.readFileSync(p,'utf8'),before=beforeFirePriorityChapters(p,Buffer.from(now)).toString();
 assert.equal(now.replace(/^related: .*$/m,'related: []'),before,'only explicit related links added to existing lesson');
}
const chapterFiles=walk('src/content/chapters/fire-safety-manager-level2');
assert.equal(chapterFiles.length,79);
const chapters=chapterFiles.map(p=>({p,s:fs.readFileSync(p,'utf8')}));
assert.deepEqual(chapters.map(({s})=>s.match(/^chapter_id: ["']?(FSM2-\d+)/m)[1]).sort(),Array.from({length:79},(_,i)=>'FSM2-'+String(i+1).padStart(3,'0')));
for(const subject of [1,2]){
 const orders=chapters.filter(({s})=>s.includes('subject_id: '+subject+'\n')).map(({s})=>Number(s.match(/^order: ([\d.]+)/m)[1]));
 assert.equal(new Set(orders).size,orders.length,'stable unique learning order '+subject);
}
const table=json('docs/drafts/fire-level2-mock-exam/question-table.json'),published=getPublishedFireQuestions(table);
assert.equal(table.length,2480);assert.equal(published.length,2328);
const nodes=html=>{const rows=[];const visit=n=>{rows.push(n);for(const c of n.childNodes||[])visit(c)};visit(parse(html));return rows;};
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const b of briefs){
 const chapter=chapters.find(({s})=>s.includes('chapter_id: "'+b.chapterId+'"'));
 assert(chapter);const s=chapter.s,slug=s.match(/^slug: "([^"]+)"/m)[1];
 const parentSlug=s.match(/^practiceChapter: "([^"]+)"/m)[1];
 const parent=chapters.find(({s})=>s.includes('slug: "'+parentSlug+'"'));assert(parent);
 const parentId=parent.s.match(/^chapter_id: "([^"]+)"/m)[1];
 const count=published.filter(q=>q.chapterId===parentId).length;assert(count>0);
 assert.equal(published.filter(q=>q.chapterId===b.chapterId).length,0,'no invented new question assignment');
 for(const id of b.questionIds)assert(table.some(q=>q.id===id&&q.chapterId===parentId),id+': documented learning basis');
 const file='dist/fire-safety-manager-level2/written/fire-safety-practice/'+slug+'/index.html';
 const html=fs.readFileSync(file,'utf8'),ns=nodes(html);assert.equal(ns.filter(n=>n.tagName==='h1').length,1);
 const entry=html.match(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/)[0];
 assert(entry.includes('연결 챕터 문제 풀기'));assert(entry.includes('chapter='+parentId));assert(entry.includes(count+'문제'));
 assert(!entry.includes('문제 준비 중'));assert(!entry.includes('chapter='+b.chapterId));
 const img=ns.find(n=>n.tagName==='img'&&attr(n,'src')==='/images/fire-safety-manager-level2/'+b.file);assert(img);
 for(const key of ['alt','width','height'])assert(attr(img,key));
 assert(html.includes('그림 확대'));assert(html.includes('학습용 재구성'));
 assert.equal((html.match(/data-mobile-top-ad>/g)||[]).length,1);
 const svg=fs.readFileSync('public/images/fire-safety-manager-level2/'+b.file,'utf8');
 assert(svg.includes('width="380"'));assert(!/<script|<image|foreignObject|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));
 const visible=svg.replace(/<title[\s\S]*?<\/title>|<desc[\s\S]*?<\/desc>/g,'');assert(!visible.includes(b.caption),'no visible title duplication');
}
const htmlFiles=walk('dist').filter(f=>f.endsWith('.html'));
assert.equal(htmlFiles.length,552);
assert.deepEqual(htmlFiles.sort(),[...Object.keys(baseline.html),...Object.keys(review.additions).filter(p=>p.endsWith('.html'))].sort());
let articles=0;
for(const file of htmlFiles){
 const bytes=fs.readFileSync(file),html=bytes.toString();assert.equal(hash(bytes),review.files[file]?.sha256||review.additions[file]||baseline.html[file]?.sha256,file+': current HTML');
 const article=html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];if(article)articles++;
 if(!baseline.html[file]?.articleSHA256)continue;
 const before=beforeFirePriorityChapters(file,bytes).toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
 assert.equal(hash(before),baseline.html[file].articleSHA256);
 // Existing teaching content, questions and figures remain exact; only related links may change.
 assert.equal(article.split('<h2>관련 챕터</h2>')[0],before.split('<h2>관련 챕터</h2>')[0],file+': old learning body unchanged');
}
assert.equal(articles,529);
const practice=fs.readFileSync('dist/fire-safety-manager-level2/practice/index.html','utf8');
const payload=JSON.parse(practice.match(/<script[^>]*data-fire-payload[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(payload.chapters.length,74,'only nonempty existing practice pools');assert.deepEqual(payload.questions,published);
console.log('[Fire priority chapters] PASS',JSON.stringify({fireChapters:79,newChapters:5,newSVGs:5,sourceFiles:inventory.length,html:htmlFiles.length,articles,questions:published.length,questionAssignments:'unchanged',existingLearningBodies:'exact',deployment:'not performed'}));

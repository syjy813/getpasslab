// Validate the current release with native file access, before historical projections.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {followupReview as review,beforeFireFollowup,isFireFollowupAddition} from './read-before-fire-followup-chapters.mjs';
import {getPublishedFireQuestions} from '../src/utils/firePractice.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort());
for(const f of inventory)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': native current file');
assert.equal(Object.keys(review.additions).length,13,'four chapters, four SVGs, one CSS, four HTML');
for(const file of Object.keys(review.additions))assert(isFireFollowupAddition(file));
const productChanges=Object.keys(review.changes).filter(f=>f.startsWith('src/')||f.startsWith('public/')).sort();
const parentFiles=['p-receiver-indicators-switches','false-alarm-confirm-reset','pump-performance-tests'].map(s=>'src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+s+'.md');
assert.deepEqual(productChanges,[...parentFiles,'src/config/certifications.ts'].sort());
const teaching=b=>b.toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0]?.split('<h2>관련 챕터</h2>')[0];
for(const [file,row]of Object.entries(review.changes)){
 const bytes=fs.readFileSync(file),before=beforeFireFollowup(file,bytes);
 assert.equal(hash(before),row.beforeSHA256,file+': exact predecessor');
 assert.notEqual(hash(beforeFireFollowup(file,Buffer.concat([bytes,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown changes remain visible');
 if(parentFiles.includes(file))assert.equal(bytes.toString().replace(/^related: .*$/m,'related: []'),before.toString().replace(/^related: .*$/m,'related: []'),'old lesson retained except related links');
 if(file.endsWith('.html')&&teaching(before))assert.equal(teaching(bytes),teaching(before),file+': old teaching body retained');
}
for(const [file,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(file)),sha,'canonical questions unchanged');
const table=JSON.parse(fs.readFileSync('docs/drafts/fire-level2-mock-exam/question-table.json'));
const published=getPublishedFireQuestions(table);assert.equal(published.length,2328);assert.equal(table.length,2480);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const nodes=html=>{const all=[];const visit=n=>{all.push(n);for(const c of n.childNodes||[])visit(c);};visit(parse(html));return all;};
const briefs=JSON.parse(fs.readFileSync('docs/audits/2026-10-28-fire-followup-chapters/figure-briefs.json')).figures;
const chapters=walk('src/content/chapters/fire-safety-manager-level2').map(f=>fs.readFileSync(f,'utf8'));
assert.equal(chapters.length,83);assert.equal(new Set(chapters.map(s=>s.match(/^chapter_id: ["']?(FSM2-\d+)/m)[1])).size,83);
const orders=chapters.filter(s=>s.includes('subject_id: 2\n')).map(s=>Number(s.match(/^order: ([\d.]+)/m)[1]));assert.equal(new Set(orders).size,orders.length);
for(const r of briefs){
 const md=fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+r.slug+'.md','utf8');
 assert(md.includes('practiceChapter: "'+r.parent+'"'));assert.equal(md.split('※ 학습을 위해 재구성된 이미지').length-1,1);
 assert(!md.includes('학습용 재구성 ·'));assert.equal(published.filter(q=>q.chapterId===r.id).length,0,'no invented question allocation');
 for(const id of r.questionIds)assert(published.some(q=>q.id===id&&q.chapterId===r.parentId),id+': verified learning basis');
 const html=fs.readFileSync('dist/fire-safety-manager-level2/written/fire-safety-practice/'+r.slug+'/index.html','utf8');const all=nodes(html);
 assert.equal(all.filter(n=>n.tagName==='h1').length,1);assert(html.includes('연결 챕터 문제 풀기')&&html.includes('chapter='+r.parentId));assert(!html.includes('chapter='+r.id));
 const img=all.find(n=>n.tagName==='img'&&attr(n,'src')==='/images/fire-safety-manager-level2/'+r.asset);assert(img);assert.equal(attr(img,'width'),'380');assert(attr(img,'alt'));
 assert.equal((html.match(/data-mobile-top-ad>/g)||[]).length,1);assert.equal(all.filter(n=>n.tagName==='section'&&attr(n,'class')==='fire-panel-step').length,3);
 const svg=fs.readFileSync('public/images/fire-safety-manager-level2/'+r.asset,'utf8');
 assert(!/<script|<image|foreignObject/.test(svg));assert(!svg.replace(/<title[\s\S]*?<\/title>/g,'').includes(r.caption),'no repeated visible title');
}
console.log('[Fire followup chapters] PASS',JSON.stringify({chapters:83,newChapters:4,newSVG:4,nativeFiles:inventory.length,published:2328,existingBodies:'unchanged',questionAssignments:'unchanged'}));

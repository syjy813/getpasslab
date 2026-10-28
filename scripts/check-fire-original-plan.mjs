// The original proposal consists of 13 existing lessons and 9 new lessons, not 22 new chapters.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {originalPlanReview as review,beforeFireOriginalPlan,isFireOriginalPlanAddition} from './read-before-fire-original-plan.mjs';
import {getPublishedFireQuestions} from '../src/utils/firePractice.ts';
const audit='docs/audits/2026-10-28-fire-original-plan';
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort());
for(const file of inventory)assert.equal(hash(fs.readFileSync(file)),review.current[file],file+': native current bytes');
assert.equal(Object.keys(review.additions).length,17,'four MDs, eight SVGs, one CSS, four HTMLs');
for(const file of Object.keys(review.additions))assert(isFireOriginalPlanAddition(file));
const ledger=json(audit+'/completion-ledger.json');assert.equal(hash(fs.readFileSync(audit+'/original-proposal-v1.md')),ledger.originalDocumentSHA256,'frozen original proposal');assert(ledger.items.every(r=>r.qa==='PASS'),'all original units have recorded viewport QA');assert.deepEqual(ledger.originalComposition,{existing:13,new:9,totalLearningUnits:22});assert.equal(ledger.items.length,22);
assert.equal(new Set(ledger.items.map(r=>r.id)).size,22);assert.equal(ledger.items.filter(r=>r.work==='new').length,4);assert.equal(ledger.items.filter(r=>r.work==='revise').length,6);
const oldLessons=ledger.items.filter(r=>r.work==='revise').map(r=>r.sourcePath).sort();
const productChanges=Object.keys(review.changes).filter(f=>f.startsWith('src/')||f.startsWith('public/')).sort();assert.deepEqual(productChanges,[...oldLessons,'src/config/certifications.ts'].sort());
const teaching=b=>b.toString().match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0]?.split('<h2>관련 챕터</h2>')[0];
const front=s=>s.split('---',3)[1].replace(/^related: .*$/m,'related: []');
for(const [file,row]of Object.entries(review.changes)){
 const bytes=fs.readFileSync(file),before=beforeFireOriginalPlan(file,bytes);assert.equal(hash(before),row.beforeSHA256,file+': exact predecessor');assert.notEqual(hash(beforeFireOriginalPlan(file,Buffer.concat([bytes,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown mutations remain visible');
 if(file.endsWith('.md'))assert.equal(front(bytes.toString()),front(before.toString()),'existing IDs/order/metadata retained');
 if(file.endsWith('.html')&&teaching(before)&&!ledger.items.some(r=>r.work==='revise'&&file==='dist'+r.route+'index.html'))assert.equal(teaching(bytes),teaching(before),file+': unmodified lesson body');
}
for(const [file,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(file)),sha,'canonical question data retained');
const table=json('docs/drafts/fire-level2-mock-exam/question-table.json'),published=getPublishedFireQuestions(table);assert.equal(table.length,2480);assert.equal(published.length,2328);
const chapterFiles=walk('src/content/chapters/fire-safety-manager-level2').filter(f=>f.endsWith('.md'));assert.equal(chapterFiles.length,83);
const value=(s,k)=>s.match(new RegExp('^'+k+':\\s*["\']?([^"\'\\n]+)','m'))?.[1];
const chapters=chapterFiles.map(f=>{const s=fs.readFileSync(f,'utf8');return {id:value(s,'chapter_id'),slug:value(s,'slug'),subject:Number(value(s,'subject_id')),order:Number(value(s,'order')),s};});
assert.deepEqual(chapters.map(r=>r.id).sort(),Array.from({length:83},(_,i)=>'FSM2-'+String(i+1).padStart(3,'0')));
for(const subject of [1,2]){const rows=chapters.filter(r=>r.subject===subject);assert.equal(new Set(rows.map(r=>r.order)).size,rows.length);}
const nodes=html=>{const all=[];const visit=n=>{all.push(n);for(const c of n.childNodes||[])visit(c);};visit(parse(html));return all;};const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const r of ledger.items){
 const c=chapters.find(c=>c.id===r.id);assert(c);const html=fs.readFileSync('dist'+r.route+'index.html','utf8'),all=nodes(html);assert.equal(all.filter(n=>n.tagName==='h1').length,1);assert(!html.includes('문제 준비 중'));
 if(r.work==='new'){
  const parent=chapters.find(c=>c.slug===r.parent);assert(parent&&parent.subject===c.subject);assert(c.s.includes('practiceChapter: "'+r.parent+'"'));assert.equal(published.filter(q=>q.chapterId===r.id).length,0);assert(published.some(q=>q.chapterId===parent.id));assert(html.includes('연결 챕터 문제 풀기')&&html.includes('chapter='+parent.id));assert(!html.includes('chapter='+r.id));
 }
 if(r.work==='new'||r.work==='revise'){
  const figures=all.filter(n=>n.tagName==='figure').length;assert.equal(c.s.split('※ 학습을 위해 재구성된 이미지').length-1,figures,'one note per figure');assert(!c.s.includes('학습용 재구성 ·'));
 }
}
const briefs=json(audit+'/figure-briefs.json').figures;assert.equal(briefs.length,8);
for(const r of briefs){
 const svg=fs.readFileSync('public/images/fire-safety-manager-level2/'+r.asset,'utf8');assert(svg.includes('width="380"'));assert(!/<script|<image|foreignObject/.test(svg));
 const visible=svg.replace(/<title[\s\S]*?<\/title>|<desc[\s\S]*?<\/desc>/g,'');assert(!visible.includes(r.caption),'caption outside artwork');
 for(const id of r.questionIds)assert(published.some(q=>q.id===id),'documented original question basis '+id);
}
// The tank's useful zone lies between the two intake levels, not the floor and water surface.
const tank=fs.readFileSync('public/images/fire-safety-manager-level2/shared-tank-effective-section-v1.svg','utf8');assert(tank.includes('id="general-intake" d="M246 180H340"'));assert(tank.includes('id="fire-intake" d="M246 420H340"'));assert(180<420);assert.equal(4*1.5,6);
const tankSource=chapters.find(c=>c.id==='FSM2-082').s;assert(tankSource.includes('4 × 1.5 = 6㎥')&&tankSource.includes('5.2㎥'));
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');const newSlugs=ledger.items.filter(r=>r.work==='new').map(r=>r.slug);for(const slug of newSlugs)assert(sitemap.includes('/'+slug+'/'));
const restored=sitemap.replace(/<url>.*?<\/url>/g,m=>newSlugs.some(s=>m.includes('/'+s+'/'))?'':m);assert.equal(hash(Buffer.from(restored)),review.baseline['dist/sitemap-0.xml'],'exactly four new URLs');
console.log('[Fire original plan] PASS',JSON.stringify({originalUnits:22,previouslyComplete:12,newChapters:4,revisedChapters:6,fireChapters:83,publishedQuestions:2328,currentFiles:inventory.length}));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {filterRows,pageRows} from './fire-mock-authoring/question-table-view.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'docs/drafts/fire-level2-mock-exam');
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const rows=read('question-table.json'), meta=read('question-table-manifest.json');
const originals=rows.filter(q=>q.questionType==='source_reconstruction');
const variants=rows.filter(q=>q.questionType==='source_variant');
const lookup=new Map(rows.map(q=>[q.id,q]));
assert.equal(rows.length,2480);assert.equal(lookup.size,2480);
assert.equal(originals.length,500);assert.equal(variants.length,500);
assert.equal(rows.filter(q=>q.isCore).length,500);
assert.equal(rows.filter(q=>q.tags.includes('핵심')).length,500);
assert.deepEqual(rows.filter(q=>q.isCore).map(q=>q.id),originals.map(q=>q.id));
assert.equal(filterRows(rows,{subject:'1'}).length,1488);
assert.equal(filterRows(rows,{subject:'2'}).length,992);
assert.equal(filterRows(rows,{core:'yes',subject:'1'}).length,254);
assert.equal(filterRows(rows,{core:'yes',subject:'2'}).length,246);
assert.equal(filterRows(rows,{core:'no'}).length,1980);
assert.equal(filterRows(rows,{query:'moducbt-27773-q01'}).length,2);
assert.equal(filterRows(rows,{type:'source_variant',core:'yes'}).length,0);
assert.equal(filterRows(rows,{type:'advanced',subject:'2'}).length,250);
assert.equal(filterRows(rows,{review:'approved'}).length,0);
assert.equal(filterRows(rows,{review:'pending'}).length,2480);
assert.equal(pageRows(filterRows(rows,{core:'yes',subject:'2'}),999).rows.length,46);
assert.equal(pageRows([]).page,1);assert.equal(pageRows([]).rows.length,0);
const originalIds=new Set(originals.map(q=>q.id));
assert.equal(new Set(variants.map(q=>q.sourceQuestionId)).size,500);
for(const q of variants){assert(originalIds.has(q.sourceQuestionId));assert.equal(q.isCore,false);assert.deepEqual(q.tags,['핵심 변형']);assert.equal(q.subjectId,lookup.get(q.sourceQuestionId).subjectId);}
for(const q of rows){
  assert([1,2].includes(q.subjectId));assert.equal(q.subjectName,`${q.subjectId}과목`);
  assert.equal(q.reviewStatus,'pending');assert.equal(q.publicationStatus,'unpublished');assert.equal(q.examEligible,false);
  assert.equal(q.sourceIsOfficialExam,false);assert(q.question.length>0);assert([1,2,3,4].includes(q.answerNumber));
  if(q.choices!==null){assert.equal(q.choices.length,4);assert(q.choices.every(c=>c.trim().length));}
  if(q.isCore){assert.equal(q.sourceQuestionId,q.id);assert(q.rawSourceText.length>0);assert(['ocr_review_required','source_visual_review_required'].includes(q.contentStatus));}
  else{assert(q.choices!==null);assert.equal(q.contentStatus,'draft_complete');assert.equal(q.rawSourceText,null);}
}
assert.equal(originals.filter(q=>q.choices===null).length,47);
assert.equal(originals.filter(q=>q.contentStatus==='ocr_review_required').length,50);
// Existing question bodies/choices/keys/explanations are preserved exactly.
for(const f of ['general740.json','hard740.json','core500.json'])for(const q of read(f)){
  const t=lookup.get(q.id);assert(t);assert.equal(t.question,q.question);assert.deepEqual(t.choices,q.choices);
  assert.equal(t.answerNumber,q.answerIndex+1);assert.equal(t.explanation,q.explanation);assert.equal(t.subjectId,q.subjectId);
}
for(const [name,digest] of Object.entries(meta.inputSHA256))assert.equal(hash(fs.readFileSync(path.join(dir,name))),digest);
assert.equal(hash(fs.readFileSync(path.join(dir,'question-table.json'))),meta.tableSHA256);
assert.equal(execFileSync('git',['diff','--name-only','976f905630c1c81ac67f797527fee6794d036a40','--','src','public'],{cwd:root,encoding:'utf8'}).trim(),'');
const html=fs.readFileSync(path.join(dir,'question-table.html'),'utf8');
assert(!/__DATA__|__SCRIPT__|__TOKENS__|__SUMMARY_ROWS__/.test(html));
const embedded=JSON.parse(html.match(/<script id="question-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(embedded,rows);
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
assert(!code.includes('innerHTML'));assert(!code.includes('fetch('));
// Run the actual preview script against a minimal DOM contract. This tests
// event wiring and paging without claiming a real-browser visual inspection.
class Element{
  constructor(id=''){this.id=id;this.value='';this.textContent='';this.children=[];this.handlers={};this.disabled=false;}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];}
  addEventListener(type,fn){this.handlers[type]=fn;}
}
const ids=['question-data','subject','core','type','review','query','rows','result-count','prev','next','reset'];
const elements=Object.fromEntries(ids.map(id=>[id,new Element(id)]));elements['question-data'].textContent=JSON.stringify(rows);
const document={getElementById:id=>elements[id],createElement:tag=>new Element(tag)};
vm.runInNewContext(code,{document,console},{timeout:5000});
assert.equal(elements.rows.children.length,50);assert(elements['result-count'].textContent.includes('2,480'));
elements.subject.value='2';elements.subject.handlers.change();elements.core.value='yes';elements.core.handlers.change();
assert(elements['result-count'].textContent.includes('246'));
for(let k=0;k<4;k++)elements.next.handlers.click();
assert.equal(elements.rows.children.length,46);assert.equal(elements.next.disabled,true);
elements.type.value='advanced';elements.type.handlers.change();assert(elements['result-count'].textContent.includes('0개'));
elements.reset.handlers.click();assert.equal(elements.rows.children.length,50);assert(elements['result-count'].textContent.includes('2,480'));
const summary={managementRows:2480,authoredQuestions:1980,coreOriginals:500,subjectCounts:{'1':1488,'2':992},
  authoredSubjectCounts:{'1':1234,'2':746},originalSubjectCounts:{'1':254,'2':246},
  originalRowsWithFourExtractedChoices:453,originalRowsWithUnparsedChoices:47,
  coreMarker:'original reconstruction rows only',originalVariantLinksUnique:500,
  inputQuestionTextChoicesAnswersExplanations:'UNCHANGED',dataAndFilterChecks:'PASS',
  previewDomContract:'PASS',realBrowserVisualQA:'NOT_RUN',semanticAnswerReview:'PENDING',production:'NOT_DEPLOYED'};
fs.writeFileSync(path.join(dir,'question-table-validation.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary));

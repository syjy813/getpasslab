import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {publication,beforePublication} from './fire-mock-authoring/publication.mjs';
import {getPublishedFireQuestions,getExamPoolCounts,createFireExam} from '../src/utils/firePractice.ts';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
for(const [p,sha] of Object.entries(publication.reviewFilesSHA256))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sha,p);
const audit='docs/audits/2026-10-20-fire-persona-qa/';
const answers=new Map(Object.values(read(audit+'decisions.json')).flatMap(c=>c.attempts.map(a=>[a.id,a.selectedAnswer])));
for(const [id,review] of Object.entries(read(audit+'adjudications.json')))answers.set(id,review.reviewAnswer);
const table=read('docs/drafts/fire-level2-mock-exam/question-table.json');
assert.equal(table.length,2480);assert.equal(answers.size,2480);
const approved=table.filter(q=>answers.get(q.id)!==null).map(q=>q.id);
const held=table.filter(q=>answers.get(q.id)===null).map(q=>q.id);
assert.deepEqual(Object.keys(publication.approved),approved);assert.deepEqual(publication.held,held);
assert.equal(approved.length,2328);assert.equal(held.length,152);
for(const q of table){
  beforePublication(q);
  if(publication.approved[q.id]){
    assert.equal(q.answerNumber,answers.get(q.id),q.id);
    assert.equal(new Set(q.choices.map(c=>c.replace(/\s+/g,' ').trim())).size,4,q.id);
  }
}
const published=getPublishedFireQuestions(table);assert.equal(published.length,2328);
assert.deepEqual([1,2].map(s=>published.filter(q=>q.subjectId===s).length),[1421,907]);
assert(getExamPoolCounts(published).every(n=>n>=25));
assert.equal(new Set(published.map(q=>q.chapterId)).size,74);
for(let i=0;i<100;i++){
  const exam=createFireExam(published);assert.equal(exam.length,50);
  assert.equal(exam.filter(q=>q.subjectId===1).length,25);
  assert.equal(new Set(exam.map(q=>q.sourceQuestionId||q.id)).size,50);
}
const html=fs.readFileSync('dist/fire-safety-manager-level2/practice/index.html','utf8');
const payload=JSON.parse(html.match(/<script[^>]*data-fire-payload[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(payload.questions,published);
assert(!html.includes('rawSourceText'));
for(const chapter of payload.chapters){
  const html=fs.readFileSync('dist'+chapter.href+'index.html','utf8');
  const section=html.match(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/)[0];
  const count=published.filter(q=>q.chapterId===chapter.id).length;
  assert(new RegExp('<small[^>]*>'+count+'문제<\\/small>').test(section),chapter.id+': exact live count');
}
console.log('[Fire publication] exact approved content 2328; held 152 excluded; 74 chapters; subjects 1421/907; real balanced samples and payload PASS');

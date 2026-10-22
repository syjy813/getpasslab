import assert from 'node:assert/strict';
import fs from 'node:fs';
import {hash,revision,standardReview,previousRows,beforeStandardization,beforeStandardizedTable,beforeStandardizedPractice} from './fire-mock-authoring/standardization.mjs';
import {getPublishedFireQuestions} from '../src/utils/firePractice.ts';
import {beforeGradeTableFormatting,beforeGradeHierarchy} from './read-before-fire-persona-corrections.mjs';
const release='docs/releases/2026-10-21-fire-standard-questions/';
const tableBytes=fs.readFileSync('docs/drafts/fire-level2-mock-exam/question-table.json');
const table=JSON.parse(tableBytes);
const baseline=JSON.parse(beforeStandardizedTable(tableBytes));
// Check the new native chapter against the approved reconstruction evidence
// before projecting its older bytes for archived 740-question reviews.
const gradeAudit=JSON.parse(fs.readFileSync('docs/audits/2026-10-22-fire-grade-exam-points/source-review.json','utf8'));
const gradeFiles=JSON.parse(fs.readFileSync('docs/audits/2026-10-22-fire-grade-exam-points/native-files.json','utf8'));
assert.equal(hash(tableBytes),gradeAudit.questionTableSHA256,'question pool remains unchanged');
const sourcePool=table.filter(q=>q.questionType==='source_reconstruction');
assert.equal(sourcePool.length,500);assert.equal(gradeAudit.sourcePoolCount,500);
const direct=sourcePool.filter(q=>q.chapterId==='FSM2-001');assert.equal(direct.length,5);
const approved=direct.filter(q=>q.reviewStatus==='approved');assert.equal(approved.length,4);
assert.deepEqual(gradeAudit.usedSources,approved.map(q=>Object.fromEntries(['id','sourceSet','sourcePDFPage','question','choices','answerNumber','reviewStatus'].map(k=>[k,q[k]]))));
assert.deepEqual(gradeAudit.excludedSources.map(q=>q.id),direct.filter(q=>q.reviewStatus!=='approved').map(q=>q.id));
const gradeChapter=fs.readFileSync(gradeAudit.chapter,'utf8');
assert(!gradeChapter.includes('조건에 붙는 단서'));
assert.equal(gradeAudit.points.length,5);
for(const point of gradeAudit.points){
 assert(gradeChapter.includes('<strong>'+point.title+'</strong><p>'+point.text+'</p>'));
 assert(point.sourceIds.length>0&&point.sourceIds.every(id=>approved.some(q=>q.id===id)),'only approved original reconstruction sources');
}
for(const [file,entry]of Object.entries(gradeFiles))assert.equal(hash(beforeGradeHierarchy(file,fs.readFileSync(file))),entry.sha256,file+': original reviewed grade content with exact layout inverse');

const assertions=JSON.parse(fs.readFileSync(release+'assertions.json','utf8'));
const revised=table.filter(q=>previousRows[q.id]);
assert.equal(revised.length,740);assert.equal(Object.keys(standardReview).length,740);
assert.equal(Object.keys(assertions).length,730);
assert.equal(hash(tableBytes),revision.tableSHA256);
assert.throws(()=>beforeStandardizedTable(Buffer.concat([tableBytes,Buffer.from('\n')])));
const baselineById=new Map(baseline.map(q=>[q.id,q]));
const allowed=new Set(['question','choices','explanation','questionType','difficulty','tags']);
const count=new Map();let ordinary=0,incorrect=0;
const optionSets=new Set();
const normalize=s=>s.replace(/\s+/g,' ').trim();
const signature=q=>JSON.stringify([normalize(q.question),q.choices?.map(normalize).sort()]);
const untouched=table.filter(q=>!previousRows[q.id]);
const existingSignatures=new Set(untouched.map(signature));
for(const q of revised){
  const old=previousRows[q.id],review=standardReview[q.id];
  assert.equal(old.questionType,'advanced');
  assert.equal(q.questionType,'general');assert.equal(q.difficulty,'basic');assert.deepEqual(q.tags,[]);
  for(const key of Object.keys(old))if(!allowed.has(key))assert.deepEqual(q[key],old[key],q.id+': unchanged '+key);
  assert.equal(hash(beforeGradeTableFormatting(review.chapter,fs.readFileSync(review.chapter))),review.chapterSHA256,q.id+': exact chapter basis, with the separately verified source-grounded grade revision');
  assert.equal(q.answerNumber,old.answerNumber,q.id+': stable key');
  assert.equal(q.reviewStatus,'approved');assert.equal(q.publicationStatus,'published');assert.equal(q.examEligible,true);
  assert(!/복합 사례|[가나다]의 (?:기록|검토 의견)|수정해야 하는 기록|몇 개인가/.test(q.question+q.explanation));
  assert(!q.question.startsWith('['));
  assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(normalize)).size,4);
  assert(!existingSignatures.has(signature(q)),q.id+': no exact clone of an existing item');
  assert(!optionSets.has(signature(q)),q.id+': no repeated question/choice set');optionSets.add(signature(q));
  assert.equal(review.answerNumber,q.answerNumber);
  count.set(q.chapterId,(count.get(q.chapterId)||0)+1);
  if(review.format==='single-building-grade'){
    const c=review.context,number=re=>Number(c.match(re)?.[1]?.replace(/,/g,''));
    const floors=number(/지상 ([\d,]+)층/),height=number(/높이 ([\d,]+)m/),area=number(/연면적 ([\d,]+)㎡/),gas=number(/가스를 ([\d,]+)t/);
    const apt=c.includes('아파트');
    const derived=gas?(gas>=1000?'1급':'2급'):apt?(floors>=50||height>=200?'특급':floors>=30||height>=120?'1급':'2급'):(floors>=30||height>=120||area>=100000?'특급':floors>=11||area>=15000?'1급':c.includes('자동화재탐지설비만')?'3급':'2급');
    assert.equal(q.choices[q.answerNumber-1],derived,q.id+': grade derived from conditions');
  }else{
    const positive=review.format==='single-correct';
    positive?ordinary++:incorrect++;
    assert(q.question.endsWith(positive?'옳은 것은?':'옳지 않은 것은?'));
    assert.equal(new Set(review.options.map(o=>o.card)).size,4);
    const possible=[];
    for(const [i,option] of review.options.entries()){
      const fact=assertions[option.card];assert.equal(fact.chapterId,q.chapterId);
      assert.equal(q.choices[i],fact[option.true?'supported':'misconception']);
      assert.equal(q.choices[i],option.text);
      assert(q.explanation.includes(fact.supported),q.id+': every option explained');
      if(option.true===positive)possible.push(i+1);
    }
    assert.deepEqual(possible,[q.answerNumber],q.id+': exactly one answer from option truth values');
    // The previous basic question used a different option set. Reordering
    // alternatives or merely changing a heading cannot satisfy this check.
    const base=baselineById.get(q.id.replace(/-(\d\d)$/,(_,s)=>'-'+String(Number(s)-10).padStart(2,'0')));
    const overlap=q.choices.filter(s=>base.choices.includes(s)).length;
    assert(overlap<=2,q.id+': distinct from base question');
  }
  const changed={...q,question:q.question+' arbitrary mutation'};
  assert.throws(()=>beforeStandardization(changed),q.id+': unknown revision rejected');
}
assert.equal(count.size,74);assert([...count.values()].every(n=>n===10));
for(const q of untouched)assert.deepEqual(q,baselineById.get(q.id),q.id+': untouched full row');
assert.equal(untouched.length,1740);
assert.equal(table.filter(q=>q.questionType==='general').length,1480);
assert.equal(table.filter(q=>q.questionType==='advanced').length,0);
const published=getPublishedFireQuestions(table);
assert.equal(published.length,2328);assert.equal(table.length-published.length,152);
assert(!published.some(q=>q.question.startsWith('[')||/복합 사례|[가나다]의 (?:기록|검토 의견)/.test(q.question)));
const practice=fs.readFileSync('dist/fire-safety-manager-level2/practice/index.html');
beforeStandardizedPractice('dist/fire-safety-manager-level2/practice/index.html',practice);
assert.throws(()=>beforeStandardizedPractice('dist/fire-safety-manager-level2/practice/index.html',Buffer.concat([practice,Buffer.from('\n')])));
const payload=JSON.parse(practice.toString().match(/<script[^>]*data-fire-payload[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(payload.questions,published,'actual built native payload, without any inverse');
const summary={replaced:740,chapters:74,perChapter:10,simpleGradeQuestions:10,singleCorrectQuestions:ordinary,singleIncorrectQuestions:incorrect,untouched:1740,originalReconstructionRowsPreserved:500,currentGeneralCount:1480,currentAdvancedCount:0,published:2328,held:152,sourceKeysAndProvenance:'PASS',fourOptionTruthAndExplanations:'PASS',exactDuplicates:'NONE',historicalEvidenceAndTamperRejection:'PASS',humanDifficulty:'NOT_MEASURED',textbookPageAudit:'NOT_REPEATED'};
console.log('[Fire standardization] '+JSON.stringify(summary));

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FIRE_EXAM, getPublishedFireQuestions, createFireExam, gradeFireQuestions } from '../src/utils/firePractice.ts';
import {publication} from './fire-mock-authoring/publication.mjs';

const table = JSON.parse(await readFile('docs/drafts/fire-level2-mock-exam/question-table.json', 'utf8'));
assert.equal(table.length, 2480);
const published=getPublishedFireQuestions(table);
assert.equal(published.length,publication.approvedCount);
assert(published.every(q=>!publication.held.includes(q.id)));
for(let k=0;k<100;k++) {
  const actual=createFireExam(published);
  assert.equal(actual.length,50);
  assert.equal(actual.filter(q=>q.subjectId===1).length,25);
  assert.equal(new Set(actual.map(q=>q.sourceQuestionId||q.id)).size,50);
}
const template = {
  id: 'test', chapterId: 'FSM2-001', chapterTitle: '테스트 챕터', subjectId: 1,
  question: '테스트 전용 문항', choices: ['가', '나', '다', '라'], answerNumber: 2,
  explanation: '테스트 전용 해설', isCore: false, questionType: 'general', sourceQuestionId: null,
  reviewStatus: 'approved', publicationStatus: 'published', examEligible: true, contentStatus: 'draft_complete',
};
for (const review of ['pending', 'approved']) for (const publication of ['unpublished', 'published']) for (const eligible of [false, true]) {
  assert.equal(getPublishedFireQuestions([{ ...template, reviewStatus: review, publicationStatus: publication, examEligible: eligible }]).length,
    review === 'approved' && publication === 'published' && eligible ? 1 : 0, 'all three publication gates are necessary');
}
for (const patch of [{ choices: null }, { choices: ['가', '나', '다'] }, { choices: ['가', '나', '다', ''] }, { answerNumber: 0 }, { answerNumber: 5 }, { explanation: null }, { contentStatus: 'ocr_review_required' }]) {
  assert.throws(() => getPublishedFireQuestions([{ ...template, ...patch }]));
}
assert.throws(() => getPublishedFireQuestions([template, template]), /Invalid approved/);
assert.throws(() => getPublishedFireQuestions([{ ...template, sourceQuestionId: 'same' }, { ...template, id: 'other', subjectId: 2, sourceQuestionId: 'same' }]), /crosses subjects/);
const source = [];
for (const subjectId of [1, 2]) for (let i = 0; i < 35; i++) {
  const id = `source-${subjectId}-${i}`;
  source.push({ ...template, id, subjectId, sourceQuestionId: id, isCore: true, questionType: 'source_reconstruction' });
  source.push({ ...template, id: 'variant-' + id, subjectId, sourceQuestionId: id, questionType: 'source_variant' });
}
const ready = getPublishedFireQuestions(source);
const originalOrder = ready.map(q => q.id);
let seed = 17;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
for (let i = 0; i < 100; i++) {
  const exam = createFireExam(ready, random);
  assert.equal(exam.length, 50);
  assert(exam.slice(0, 25).every(q => q.subjectId === 1));
  assert(exam.slice(25).every(q => q.subjectId === 2));
  assert.equal(new Set(exam.map(q => q.sourceQuestionId || q.id)).size, 50, 'no original/variant family repeats');
}
assert.deepEqual(ready.map(q => q.id), originalOrder, 'sampling never mutates canonical order');
assert.throws(() => createFireExam(ready.filter(q => q.subjectId === 1)), /2과목/);
assert.throws(() => createFireExam(ready.filter(q => q.subjectId === 2 || Number(q.id.split('-').at(-1)) < 24)), /1과목/);
const exam = createFireExam(ready, random);
const makeAnswers = (one, two) => new Map(exam.flatMap((q, i) => {
  const correct = i < 25 ? i < one : i - 25 < two;
  return correct ? [[q.id, q.answerNumber]] : [];
}));
for (const [one, two, average, passed] of [[10,25,70,true],[25,10,70,true],[17,17,68,false],[9,25,68,false],[25,25,100,true],[0,0,0,false]]) {
  const grade = gradeFireQuestions(exam, makeAnswers(one, two));
  assert.equal(grade.average, average); assert.equal(grade.passed, passed);
  assert.equal(grade.unanswered, 50 - one - two);
}
assert.equal(gradeFireQuestions(exam.slice(0, 1), makeAnswers(25,25)).passed, false, 'partial practice cannot claim exam pass');
assert.equal(FIRE_EXAM.durationSeconds, 3600);
console.log('[Fire practice logic] approval gates, malformed data, 100 subject-balanced samples, family deduplication and score thresholds PASS');

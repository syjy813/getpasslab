import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  INSTANT_PRACTICE_PILOT_SLUG,
  INSTANT_PRACTICE_PILOT_EXPLANATIONS,
} from '../src/config/instantPracticeExplanations.js';

const chapter = readFileSync('src/content/chapters/safety-management/' + INSTANT_PRACTICE_PILOT_SLUG + '.md', 'utf8');
const match = chapter.match(/^questions:\s*\[([^\]]+)\]/m);
assert.ok(match, 'Pilot chapter must retain linked question IDs');
const ids = match[1].split(',').map(id => id.trim());
assert.equal(ids.length, 6, 'Pilot must contain six primary linked questions');
assert.equal(new Set(ids).size, ids.length, 'Pilot IDs must not repeat');
assert.deepEqual(Object.keys(INSTANT_PRACTICE_PILOT_EXPLANATIONS).sort(), [...ids].sort(), 'Explanations must cover exactly the linked questions');

const canonical = JSON.parse(readFileSync('src/data/questions/industrial-safety.json', 'utf8'));
const byId = new Map(canonical.map(question => [question.id, question]));
const approvedAnswerIndices = {
  '20220424_010': 2,
  '20220305_009': 4,
  '20200606_016': 2,
  '20200822_009': 1,
  '20200926_004': 2,
  '20190303_008': 4,
};
ids.forEach(id => {
  const question = byId.get(id);
  assert.ok(question, 'Question missing from canonical data: ' + id);
  assert.equal(question.choices.length, 4, 'Invalid choice count: ' + id);
  assert.equal(question.review, '', 'Question has unresolved review: ' + id);
  assert.equal(question.answer, approvedAnswerIndices[id], 'Answer changed: ' + id);
  assert.ok(INSTANT_PRACTICE_PILOT_EXPLANATIONS[id].trim().length > 15, 'Explanation missing: ' + id);
});

const page = readFileSync('src/pages/[cert]/[exam]/[subject]/[slug].astro', 'utf8');
assert.ok(page.includes("chapter.data.slug === INSTANT_PRACTICE_PILOT_SLUG"), 'Pilot activation must be restricted to one chapter');
assert.ok(page.includes('instantPracticeExplanations='), 'Pilot must be passed into the existing question-history block');
assert.ok(!page.includes('<InstantQuestionPractice'), 'Quiz must not be rendered separately in the article');
const history = readFileSync('src/components/QuestionHistory.astro', 'utf8');
assert.ok(history.includes('<InstantQuestionPractice questions={questions}'), 'Question history must own the pilot entry');
const practice = readFileSync('src/components/InstantQuestionPractice.astro', 'utf8');
assert.ok(practice.includes('data-practice-open') && practice.includes('data-practice-dialog'), 'Practice must use an explicit dialog trigger');
assert.ok(practice.includes('dialog.showModal()') && practice.includes("dialog?.addEventListener('close'"), 'Dialog must open modally and reset on close');
console.log('Instant practice pilot: 6 canonical questions, answer indices, explanations and chapter gating verified');

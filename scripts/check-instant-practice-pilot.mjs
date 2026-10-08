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
assert.ok(page.includes("linked.some(question => !question.review"), 'Practice must be enabled for chapters with eligible canonical questions');
assert.ok(!page.includes('instantPracticeCount='), 'Other chapter question-history HTML must remain unchanged');
assert.ok(page.includes('<InstantQuestionPractice slot="practice-overlay"'), 'Practice overlay must render outside article');
const history = readFileSync('src/components/QuestionHistory.astro', 'utf8');
assert.ok(!history.includes('data-practice-open'), 'Shared question-history component must not be modified for other chapters');
const practice = readFileSync('src/components/InstantQuestionPractice.astro', 'utf8');
assert.ok(practice.includes('data-practice-dialog') && practice.includes('data-practice-entry') && practice.includes('history.append(entry)'), 'Practice must move only its launch control into question history');
assert.ok(practice.includes('dialog.showModal()') && practice.includes("dialog.addEventListener('close'"), 'Dialog must open modally and reset on close');
assert.ok(practice.includes("import('../data/questions/computer-literacy.json')"), 'All certifications must load on demand');
assert.ok(practice.includes('검증된 문항별 해설이 아직 없습니다'), 'Unverified explanations must be clearly marked');
assert.ok(practice.includes('document.body.append(root)'), 'Practice dialog must be isolated from the chapter article CSS');
assert.ok(practice.includes('.practice-modal-header h2::before') && practice.includes('content:none'), 'Practice title must not inherit chapter heading decoration');
console.log('Instant practice pilot: 6 canonical questions, answer indices, explanations and chapter gating verified');

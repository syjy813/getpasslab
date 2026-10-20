import { FIRE_EXAM, createFireExam, getExamPoolCounts, gradeFireQuestions, shuffleQuestions } from './firePractice';
import type { FirePracticeQuestion } from './firePractice';

interface Chapter { id: string; title: string; href: string; subjectId: number; }
interface Payload { questions: FirePracticeQuestion[]; chapters: Chapter[]; }
const root = document.querySelector<HTMLElement>('[data-fire-runner]');
if (root) initPractice(root);

function initPractice(root: HTMLElement) {
  const get = <T extends HTMLElement = HTMLElement>(selector: string): T => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing practice element: ${selector}`);
    return element;
  };
  const payload: Payload = JSON.parse(get('[data-fire-payload]').textContent || '{}');
  const chapterId = new URLSearchParams(window.location.search).get('chapter');
  const chapter = payload.chapters.find(item => item.id === chapterId);
  const isChapter = chapterId !== null;
  const invalidChapter = isChapter && !chapter;
  const pool = isChapter ? payload.questions.filter(q => q.chapterId === chapterId) : payload.questions;
  const counts = getExamPoolCounts(pool);
  const canStart = !invalidChapter && (isChapter ? pool.length > 0 : counts.every(count => count >= FIRE_EXAM.perSubject));
  const setup = get('[data-setup]'), session = get('[data-session]'), results = get('[data-results]');
  const start = get<HTMLButtonElement>('[data-start]');
  const check = get<HTMLButtonElement>('[data-check]');
  const previous = get<HTMLButtonElement>('[data-previous]');
  const next = get<HTMLButtonElement>('[data-next]');
  const submit = get<HTMLButtonElement>('[data-submit]');
  const choices = get<HTMLFieldSetElement>('[data-choices]');
  const feedback = get('[data-feedback]');
  const navigation = get('[data-navigation]');
  const confirm = get<HTMLDialogElement>('[data-confirm]');
  const symbols = ['①', '②', '③', '④'];
  let questions: FirePracticeQuestion[] = [];
  let index = 0;
  let active = false;
  let deadline = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  const answers = new Map<string, number>();
  const checked = new Set<string>();

  if (chapter) {
    get('[data-title]').textContent = '이 챕터 문제 풀기';
    get('[data-description]').textContent = `${chapter.title} · ${pool.length}문제`;
    get('[data-guide]').textContent = '한 문제씩 풀고 정답과 해설을 바로 확인합니다. 시간 제한은 없습니다.';
    start.textContent = '챕터 문제 시작';
    const back = document.querySelector<HTMLAnchorElement>('[data-chapter-back]');
    if (back) { back.href = chapter.href; back.textContent = '← ' + chapter.title; }
    get('[data-session-help]').textContent = '문항별 정답·해설을 확인한 뒤 다음 문제로 이동합니다. 번호를 눌러 다른 문제를 볼 수도 있습니다.';
  }
  get('[data-availability]').textContent = invalidChapter ? '챕터를 찾을 수 없습니다. 학습 목차에서 다시 선택해 주세요.'
    : canStart ? (isChapter ? `이 챕터의 공개 문제 ${pool.length}개를 풀어봅니다.` : '과목별로 무작위 출제합니다. 같은 원본과 그 변형은 한 시험에 함께 출제하지 않습니다.')
    : isChapter ? '이 챕터의 문제를 준비하고 있습니다. 공개되면 여기서 바로 풀 수 있습니다.'
    : `모의고사 문제를 준비하고 있습니다. 현재 공개 문제: 1과목 ${counts[0]}개 · 2과목 ${counts[1]}개. 과목별 25개 이상 준비되면 시작할 수 있습니다.`;
  if (invalidChapter) { get('[data-title]').textContent = '챕터 문제 풀기'; get('[data-description]').hidden = true; get('[data-guide]').hidden = true; }
  start.disabled = !canStart;
  get('[data-clock-wrap]').hidden = isChapter;
  check.hidden = !isChapter;
  if (isChapter) submit.textContent = '풀이 마치기';

  function renderNavigation() {
    navigation.replaceChildren();
    questions.forEach((q, position) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(position + 1);
      button.dataset.answered = String(answers.has(q.id));
      button.setAttribute('aria-label', `${position + 1}번 ${answers.has(q.id) ? '답안 선택함' : '미응답'}`);
      if (position === index) button.setAttribute('aria-current', 'step');
      button.addEventListener('click', () => { if (!expire()) { index = position; render(); } });
      navigation.append(button);
    });
  }
  function answerText(q: FirePracticeQuestion): string {
    return `${symbols[q.answerNumber - 1]} ${q.choices[q.answerNumber - 1]}`;
  }
  function render() {
    const q = questions[index];
    if (!q || !active) return;
    get('[data-progress]').textContent = `${index + 1} / ${questions.length}문제 · ${answers.size}개 답안 선택`;
    get('[data-meta]').textContent = `${q.subjectId}과목 · ${q.chapterTitle}${q.isCore ? ' · 핵심' : q.questionType === 'source_variant' ? ' · 핵심 변형' : q.questionType === 'advanced' ? ' · 심화' : ''}`;
    get('[data-question]').textContent = `${index + 1}. ${q.question}`;
    choices.replaceChildren();
    const legend = document.createElement('legend'); legend.className = 'fire-sr'; legend.textContent = '정답 선택';
    choices.append(legend);
    q.choices.forEach((choice, i) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'fire-answer'; input.value = String(i + 1);
      input.checked = answers.get(q.id) === i + 1;
      input.disabled = isChapter && checked.has(q.id);
      const text = document.createElement('span'); text.textContent = `${symbols[i]} ${choice}`;
      input.addEventListener('change', () => {
        if (!active || expire()) return;
        answers.set(q.id, i + 1); check.disabled = false;
        get('[data-progress]').textContent = `${index + 1} / ${questions.length}문제 · ${answers.size}개 답안 선택`;
        renderNavigation();
      });
      label.append(input, text); choices.append(label);
    });
    feedback.hidden = !(isChapter && checked.has(q.id));
    if (!feedback.hidden) feedback.textContent = `${answers.get(q.id) === q.answerNumber ? '정답입니다.' : '오답입니다.'}\n정답: ${answerText(q)}\n\n${q.explanation}`;
    check.disabled = !answers.has(q.id) || checked.has(q.id);
    previous.disabled = index === 0;
    next.hidden = index === questions.length - 1;
    next.disabled = isChapter && !checked.has(q.id);
    renderNavigation();
    get('[data-question]').focus({ preventScroll: true });
    session.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function tick() {
    if (expire()) return;
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    get('[data-clock]').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  }
  function expire(): boolean {
    if (!active) return true;
    if (!isChapter && Date.now() >= deadline) { finish(true); return true; }
    return false;
  }
  function begin() {
    if (!canStart) return;
    if (timer) clearInterval(timer);
    questions = isChapter ? shuffleQuestions(pool) : createFireExam(pool);
    index = 0; answers.clear(); checked.clear();
    active = true; setup.hidden = true; session.hidden = false; results.hidden = true;
    deadline = Date.now() + FIRE_EXAM.durationSeconds * 1000;
    if (!isChapter) { tick(); timer = setInterval(tick, 1000); }
    render();
  }
  function finish(expired = false) {
    if (!active) return;
    expired = expired || (!isChapter && Date.now() >= deadline);
    active = false;
    if (timer) clearInterval(timer);
    if (confirm.open) confirm.close('expired');
    session.hidden = true; results.hidden = false;
    const grade = gradeFireQuestions(questions, answers);
    get('[data-score]').textContent = isChapter ? `${questions.length}문제 중 ${grade.correct}개 정답` : `평균 ${grade.average}점 · ${grade.correct} / 50개 정답`;
    get('[data-verdict]').textContent = `${expired ? '60분이 지나 자동 제출했습니다. ' : ''}${isChapter ? `미응답 ${grade.unanswered}개 · 문제별 해설을 확인해 보세요.` : `${grade.passed ? '합격 기준 충족' : '합격 기준 미달'} · 미응답 ${grade.unanswered}개`}`;
    const subjectScores = get('[data-subject-scores]'); subjectScores.replaceChildren();
    if (!isChapter) grade.subjects.forEach(item => {
      const p = document.createElement('p'); p.textContent = `${item.subjectId}과목 ${item.score}점 · ${item.correct}/25개 정답${item.score < FIRE_EXAM.minimumSubjectScore ? ' · 과락' : ''}`; subjectScores.append(p);
    });
    const review = get('[data-review]'); review.replaceChildren();
    questions.forEach((q, i) => {
      const selected = answers.get(q.id);
      const detail = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `${i + 1}번 · ${selected === undefined ? '미응답' : selected === q.answerNumber ? '정답' : '오답'} · ${q.question.slice(0, 80)}`;
      const body = document.createElement('p'); body.textContent = q.question;
      const selectedText = document.createElement('p'); selectedText.textContent = `선택한 답: ${selected ? `${symbols[selected - 1]} ${q.choices[selected - 1]}` : '미응답'}\n정답: ${answerText(q)}`;
      const explanation = document.createElement('p'); explanation.textContent = q.explanation;
      detail.append(summary, body, selectedText, explanation);
      const chapter = payload.chapters.find(item => item.id === q.chapterId);
      if (chapter) { const link = document.createElement('a'); link.href = chapter.href; link.textContent = `${chapter.title} 이론 다시 보기 →`; detail.append(link); }
      review.append(detail);
    });
    get('[data-result-title]').focus();
    results.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  start.addEventListener('click', begin);
  get('[data-restart]').addEventListener('click', begin);
  previous.addEventListener('click', () => { if (!expire() && index > 0) { index--; render(); } });
  next.addEventListener('click', () => { if (!expire() && index < questions.length - 1 && (!isChapter || checked.has(questions[index].id))) { index++; render(); } });
  check.addEventListener('click', () => {
    const q = questions[index];
    if (!isChapter || !active || !q || !answers.has(q.id) || checked.has(q.id)) return;
    checked.add(q.id); render();
    if (!next.hidden) next.focus(); else submit.focus();
  });
  submit.addEventListener('click', () => {
    if (expire()) return;
    const unanswered = questions.filter(q => !answers.has(q.id)).length;
    get('[data-confirm-text]').textContent = unanswered ? `미응답 ${unanswered}개는 오답으로 처리합니다. 제출 후에는 답안을 바꿀 수 없습니다.` : '제출 후에는 답안을 바꿀 수 없습니다.';
    confirm.returnValue = ''; confirm.showModal();
  });
  confirm.addEventListener('close', () => {
    if (confirm.returnValue === 'submit') finish();
    else if (active) submit.focus();
  });
  document.addEventListener('visibilitychange', () => { if (active && !isChapter) tick(); });
  window.addEventListener('beforeunload', event => { if (active) { event.preventDefault(); event.returnValue = ''; } });
}

import { FIRE_EXAM, createFireExam, getExamPoolCounts, gradeFireQuestions, shuffleQuestions } from './firePractice';
import type { FirePracticeQuestion } from './firePractice';

interface Chapter { id: string; title: string; href: string; subjectId: number; }
interface Payload { questions: FirePracticeQuestion[]; chapters: Chapter[]; }
type ReviewFilter = 'all' | 'wrong' | 'unanswered';
const root = document.querySelector<HTMLElement>('[data-fire-runner]');
if (root) initPractice(root);

function initPractice(root: HTMLElement) {
  const get = <T extends HTMLElement = HTMLElement>(selector: string): T => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing practice element: ${selector}`);
    return element;
  };
  const payload: Payload = JSON.parse(get('[data-fire-payload]').textContent || '{}');
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get('chapter');
  const chapter = payload.chapters.find(item => item.id === chapterId);
  const isChapter = chapterId !== null;
  const invalidChapter = isChapter && !chapter;
  const pool = isChapter ? payload.questions.filter(q => q.chapterId === chapterId) : payload.questions;
  const counts = getExamPoolCounts(pool);
  const canStart = !invalidChapter && (isChapter ? pool.length > 0 : counts.every(count => count >= FIRE_EXAM.perSubject));
  const setup = get('[data-setup]'), session = get('[data-session]'), results = get('[data-results]');
  const start = get<HTMLButtonElement>('[data-start]');
  const previous = get<HTMLButtonElement>('[data-previous]');
  const next = get<HTMLButtonElement>('[data-next]');
  const submit = get<HTMLButtonElement>('[data-submit]');
  const retry = get<HTMLButtonElement>('[data-retry]');
  const choices = get<HTMLFieldSetElement>('[data-choices]');
  const navigation = get('[data-navigation]');
  const panel = get<HTMLDetailsElement>('[data-answer-panel]');
  const confirm = get<HTMLDialogElement>('[data-confirm]');
  const symbols = ['①', '②', '③', '④'];
  const desktop = window.matchMedia('(min-width: 1024px)');
  panel.open = desktop.matches;
  desktop.addEventListener('change', () => { panel.open = desktop.matches; });
  panel.addEventListener('toggle', () => { if (desktop.matches && !panel.open) panel.open = true; });
  let questions: FirePracticeQuestion[] = [];
  let retryQuestions: FirePracticeQuestion[] = [];
  let index = 0;
  let active = false;
  let retryMode = false;
  let deadline = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  const answers = new Map<string, number>();
  const isExam = () => !isChapter && !retryMode;

  const close = document.querySelector<HTMLButtonElement>('[data-window-close]');
  if (close && params.get('popup') === '1') {
    close.hidden = false;
    close.addEventListener('click', () => window.close());
  }
  if (chapter) {
    get('[data-title]').textContent = '이 챕터 문제 풀기';
    get('[data-description]').textContent = `${chapter.title} · ${pool.length}문제`;
    get('[data-guide]').textContent = '모든 문제를 푼 뒤 한 번에 채점합니다. 제출 전에는 자유롭게 이동하고 답을 바꿀 수 있습니다. 시간 제한은 없습니다.';
    start.textContent = '챕터 문제 시작';
    const back = document.querySelector<HTMLAnchorElement>('[data-chapter-back]');
    if (back) { back.href = chapter.href; back.textContent = '← ' + chapter.title; }
  }
  get('[data-availability]').textContent = invalidChapter ? '챕터를 찾을 수 없습니다. 학습 목차에서 다시 선택해 주세요.'
    : canStart ? (isChapter ? `이 챕터의 공개 문제 ${pool.length}개를 풀어봅니다.` : '과목별로 무작위 출제합니다. 같은 원본과 그 변형은 한 시험에 함께 출제하지 않습니다.')
    : isChapter ? '이 챕터의 문제를 준비하고 있습니다. 공개되면 여기서 바로 풀 수 있습니다.'
    : `모의고사 문제를 준비하고 있습니다. 현재 공개 문제: 1과목 ${counts[0]}개 · 2과목 ${counts[1]}개. 과목별 25개 이상 준비되면 시작할 수 있습니다.`;
  if (invalidChapter) { get('[data-title]').textContent = '챕터 문제 풀기'; get('[data-description]').hidden = true; get('[data-guide]').hidden = true; }
  start.disabled = !canStart;

  function updateProgress() {
    get('[data-progress]').textContent = `${retryMode ? '오답 복습 · ' : ''}${index + 1} / ${questions.length}문제 · ${answers.size}개 답안 선택`;
    get('[data-answer-count]').textContent = `${answers.size} / ${questions.length}`;
  }
  function renderNavigation() {
    navigation.replaceChildren();
    questions.forEach((q, position) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(position + 1);
      const selected = answers.get(q.id);
      const status = document.createElement('span'); status.textContent = selected ? symbols[selected - 1] : '미응답';
      button.append(status);
      button.dataset.answered = String(selected !== undefined);
      button.setAttribute('aria-label', `${position + 1}번 ${selected ? symbols[selected - 1] + ' 선택' : '미응답'}`);
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
    updateProgress();
    get('[data-meta]').textContent = `${q.subjectId}과목 · ${q.chapterTitle}${q.isCore ? ' · 핵심' : q.questionType === 'source_variant' ? ' · 핵심 변형' : q.questionType === 'advanced' ? ' · 심화' : ''}`;
    get('[data-question]').textContent = `${index + 1}. ${q.question}`;
    choices.replaceChildren();
    const legend = document.createElement('legend'); legend.textContent = '정답 선택'; choices.append(legend);
    q.choices.forEach((choice, i) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'fire-answer'; input.value = String(i + 1);
      input.checked = answers.get(q.id) === i + 1;
      const text = document.createElement('span'); text.textContent = `${symbols[i]} ${choice}`;
      input.addEventListener('change', () => {
        if (!active || expire()) return;
        answers.set(q.id, i + 1); updateProgress(); renderNavigation();
      });
      label.append(input, text); choices.append(label);
    });
    previous.disabled = index === 0;
    next.hidden = index === questions.length - 1;
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
    if (isExam() && Date.now() >= deadline) { finish(true); return true; }
    return false;
  }
  function begin(onlyRetry = false) {
    if (!canStart || (onlyRetry && retryQuestions.length === 0)) return;
    if (timer) clearInterval(timer);
    retryMode = onlyRetry;
    questions = onlyRetry ? [...retryQuestions] : isChapter ? shuffleQuestions(pool) : createFireExam(pool);
    index = 0; answers.clear();
    active = true; setup.hidden = true; session.hidden = false; results.hidden = true;
    get('[data-clock-wrap]').hidden = !isExam();
    deadline = Date.now() + FIRE_EXAM.durationSeconds * 1000;
    if (isExam()) { tick(); timer = setInterval(tick, 1000); }
    render();
  }
  function filterReview(filter: ReviewFilter) {
    const cards = get('[data-review]').querySelectorAll<HTMLElement>('details');
    let visible = 0;
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.status !== filter; if (!card.hidden) visible++; });
    root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    get('[data-review-count]').textContent = `${filter === 'all' ? '전체' : filter === 'wrong' ? '오답' : '미응답'} ${visible}문제${visible === 0 ? ' · 해당 문항이 없습니다.' : ''}`;
  }
  function finish(expired = false) {
    if (!active) return;
    expired = expired || (isExam() && Date.now() >= deadline);
    active = false;
    if (timer) clearInterval(timer);
    if (confirm.open) confirm.close('expired');
    session.hidden = true; results.hidden = false;
    const grade = gradeFireQuestions(questions, answers);
    const wrong = questions.length - grade.correct - grade.unanswered;
    get('[data-result-title]').textContent = retryMode ? '오답 복습 결과' : '풀이 결과';
    get('[data-score]').textContent = isExam() ? `평균 ${grade.average}점 · ${grade.correct} / 50개 정답` : `${questions.length}문제 중 ${grade.correct}개 정답`;
    get('[data-verdict]').textContent = `${expired ? '60분이 지나 자동 제출했습니다. ' : ''}${isExam() ? (grade.passed ? '합격 기준 충족 · ' : '합격 기준 미달 · ') : ''}정답 ${grade.correct}개 · 오답 ${wrong}개 · 미응답 ${grade.unanswered}개`;
    const subjectScores = get('[data-subject-scores]'); subjectScores.replaceChildren();
    if (isExam()) grade.subjects.forEach(item => {
      const p = document.createElement('p'); p.textContent = `${item.subjectId}과목 ${item.score}점 · ${item.correct}/25개 정답${item.score < FIRE_EXAM.minimumSubjectScore ? ' · 과락' : ''}`; subjectScores.append(p);
    });
    retryQuestions = questions.filter(q => answers.get(q.id) !== q.answerNumber);
    retry.disabled = retryQuestions.length === 0;
    retry.textContent = `오답·미응답 ${retryQuestions.length}문제 다시 풀기`;
    const totals = { all: questions.length, wrong, unanswered: grade.unanswered };
    root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
      const filter = button.dataset.filter as ReviewFilter;
      button.textContent = `${filter === 'all' ? '전체' : filter === 'wrong' ? '오답' : '미응답'} ${totals[filter]}`;
    });
    const review = get('[data-review]'); review.replaceChildren();
    questions.forEach((q, i) => {
      const selected = answers.get(q.id);
      const status = selected === undefined ? 'unanswered' : selected === q.answerNumber ? 'correct' : 'wrong';
      const detail = document.createElement('details'); detail.dataset.status = status;
      const summary = document.createElement('summary');
      summary.textContent = `${i + 1}번 · ${status === 'unanswered' ? '미응답' : status === 'correct' ? '정답' : '오답'} · ${q.question.slice(0, 80)}`;
      const body = document.createElement('p'); body.textContent = q.question;
      const options = document.createElement('ol');
      q.choices.forEach((text, n) => {
        const option = document.createElement('li');
        option.dataset.correct = String(n + 1 === q.answerNumber);
        option.dataset.wrong = String(n + 1 === selected && selected !== q.answerNumber);
        option.textContent = `${text}${n + 1 === selected ? ' [내 선택]' : ''}${n + 1 === q.answerNumber ? ' [정답]' : ''}`;
        options.append(option);
      });
      const selectedText = document.createElement('p'); selectedText.textContent = `선택한 답: ${selected ? `${symbols[selected - 1]} ${q.choices[selected - 1]}` : '미응답'}\n정답: ${answerText(q)}`;
      const explanation = document.createElement('p'); explanation.textContent = q.explanation;
      detail.append(summary, body, options, selectedText, explanation);
      const related = payload.chapters.find(item => item.id === q.chapterId);
      if (related) {
        const link = document.createElement('a'); link.href = related.href; link.target = '_blank'; link.rel = 'noopener';
        link.textContent = `${related.title} 이론 다시 보기 (새 탭) →`; detail.append(link);
      }
      review.append(detail);
    });
    filterReview('all');
    get('[data-result-title]').focus();
    results.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  start.addEventListener('click', () => begin());
  get('[data-restart]').addEventListener('click', () => begin());
  retry.addEventListener('click', () => begin(true));
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => filterReview(button.dataset.filter as ReviewFilter)));
  previous.addEventListener('click', () => { if (!expire() && index > 0) { index--; render(); } });
  next.addEventListener('click', () => { if (!expire() && index < questions.length - 1) { index++; render(); } });
  get('[data-clear]').addEventListener('click', () => { if (!expire()) { answers.delete(questions[index].id); render(); } });
  submit.addEventListener('click', () => {
    if (expire()) return;
    const unanswered = questions.filter(q => !answers.has(q.id)).length;
    get('[data-confirm-text]').textContent = unanswered ? `미응답 ${unanswered}개는 점수에 반영되지 않습니다. 제출 후에는 답안을 바꿀 수 없습니다.` : '제출 후에는 답안을 바꿀 수 없습니다.';
    confirm.returnValue = ''; confirm.showModal();
  });
  confirm.addEventListener('close', () => {
    if (confirm.returnValue === 'submit') finish();
    else if (active) submit.focus();
  });
  document.addEventListener('visibilitychange', () => { if (active && isExam()) tick(); });
  window.addEventListener('beforeunload', event => { if (active) { event.preventDefault(); event.returnValue = ''; } });
}

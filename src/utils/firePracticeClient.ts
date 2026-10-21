import { FIRE_EXAM, createFireExam, getExamPoolCounts, gradeFireQuestions, shuffleQuestions } from './firePractice';
import type { FirePracticeQuestion } from './firePractice';

interface Chapter { id: string; title: string; href: string; subjectId: number; }
interface Payload { questions: FirePracticeQuestion[]; chapters: Chapter[]; }
type ReviewFilter = 'all' | 'wrong' | 'unanswered';
const root = document.querySelector<HTMLElement>('[data-fire-runner]');
if (root) initPractice(root);

// Preserve source fragments exactly; show the complete question before its list.
// References need an explicit marker/prefix; a final paragraph is not enough.
function renderQuestion(target: HTMLElement, text: string, prefix = '', live = false) {
  const groups: { kind: 'title' | 'condition' | 'reference'; text: string }[] = [];
  let body = false, reference = false;
  const structured = /^(?:[•●▪■◆·▶※]|[ㄱ-ㅎ가-하][.)]|[㉠-㉻①-⑳]|(?:용도|규모|높이|층수|연면적|설치된 소방시설|조건|사례)\s*[:：])/;
  for (const line of text.match(/[^\n]*\n|[^\n]+$/g) || ['']) {
    const value = line.trim();
    if (!value) { if (groups.length) groups[groups.length - 1].text += line; body = true; reference = false; continue; }
    const explicitReference = /^(?:※|참고(?:사항)?\s*[:：]|이 건물은\s)/.test(value);
    if (explicitReference) reference = true;
    else if (structured.test(value) || /[?？]$/.test(value)) reference = false;
    let kind: 'title' | 'condition' | 'reference';
    if (reference) kind = 'reference';
    else if (/^\[[^\]]+\]$/.test(value)) { kind = 'title'; body = true; }
    else if (structured.test(value)) { kind = 'condition'; body = true; }
    else kind = !body || /[?？]$/.test(value) ? 'title' : 'condition';
    const last = groups[groups.length - 1];
    if (last?.kind === kind) last.text += line;
    else groups.push({ kind, text: line });
    if (kind === 'title' && /[?？]$/.test(value)) body = true;
  }
  const ordered = groups.map((group, order) => ({ ...group, order }));
  const conditionIndex = groups.findIndex(group => group.kind === 'condition');
  const promptIndex = groups.findLastIndex(group => group.kind === 'title' && group.text.trim().length >= 12 && /[?？]$/.test(group.text.trim()));
  const listed = groups.some(group => group.kind === 'condition' && group.text.split('\n').some(line => structured.test(line.trim())));
  if (listed && conditionIndex >= 0 && promptIndex > conditionIndex && groups.slice(promptIndex + 1).every(group => group.kind === 'reference')) {
    const [prompt] = ordered.splice(promptIndex, 1);
    ordered.splice(conditionIndex, 0, prompt);
  }
  target.replaceChildren();
  ordered.forEach((group, i) => {
    const part = document.createElement(live && group.kind === 'title' ? 'h2' : 'p');
    part.className = `fire-stem-${group.kind}`;
    part.dataset.stemOrder = String(group.order);
    if (i === 0 && prefix) {
      const number = document.createElement('span'); number.dataset.questionNumber = ''; number.textContent = prefix; part.append(number);
    }
    if (group.kind === 'condition') {
      for (const line of group.text.match(/[^\n]*\n|[^\n]+$/g) || ['']) {
        const item = document.createElement('span'); item.className = 'fire-stem-line'; item.dataset.empty = String(!line.trim()); item.textContent = line; part.append(item);
      }
    } else part.append(document.createTextNode(group.text));
    if (group.kind === 'reference') {
      part.setAttribute('role', 'note');
      part.dataset.marker = String(!group.text.trimStart().startsWith('※'));
    }
    target.append(part);
  });
}

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
  const restart = get<HTMLButtonElement>('[data-restart]');
  restart.hidden = isChapter;
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
  let confirmAction: 'submit' | 'retry' = 'submit';
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
    const guide = get('[data-guide]');
    guide.replaceChildren();
    ['모든 문제를 푼 뒤 한 번에 채점합니다.', '제출 전에는 자유롭게 이동하고 답을 바꿀 수 있습니다.', '시간 제한은 없습니다.'].forEach((sentence, i) => {
      if (i) guide.append(document.createElement('br'));
      guide.append(document.createTextNode(sentence));
    });
    start.textContent = '챕터 문제 시작';
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
  function render() {
    const q = questions[index];
    if (!q || !active) return;
    updateProgress();
    const meta = get('[data-meta]'); meta.replaceChildren();
    const label = document.createElement('span');
    label.textContent = `${q.subjectId}과목 · ${q.chapterTitle}${!q.isCore && q.questionType === 'source_variant' ? ' · 핵심 변형' : !q.isCore && q.questionType === 'advanced' ? ' · 심화' : ''}`;
    meta.append(label);
    if (q.isCore) {
      const badge = document.createElement('span'); badge.dataset.coreBadge = ''; badge.textContent = '출제 유력'; meta.append(badge);
    }
    get('[data-question]').dataset.questionId = q.id;
    renderQuestion(get('[data-question]'), q.question, `${index + 1}. `, true);
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
    const cards = get('[data-review]').querySelectorAll<HTMLElement>('[data-review-item]');
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
    get('[data-verdict]').textContent = `${expired ? '60분이 지나 자동 제출했습니다. ' : ''}${isExam() ? (grade.passed ? '합격 기준 충족 · ' : '합격 기준 미달 · ') : ''}아래에서 문항별 정답과 해설을 확인하세요.`;
    const outcomes = get('[data-outcomes]'); outcomes.replaceChildren();
    for (const [status, label, count] of [['correct', '정답', grade.correct], ['wrong', '오답', wrong], ['unanswered', '미응답', grade.unanswered]] as const) {
      const item = document.createElement('p'); item.dataset.status = status;
      const name = document.createElement('span'); name.textContent = label;
      const number = document.createElement('strong'); number.textContent = `${count}개`;
      item.append(name, number); outcomes.append(item);
    }
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
      const detail = document.createElement('section'); detail.dataset.reviewItem = ''; detail.dataset.status = status;
      const headingId = `fire-review-question-${i + 1}`;
      detail.setAttribute('aria-labelledby', headingId);
      const header = document.createElement('div'); header.className = 'fire-review-header';
      const heading = document.createElement('h4'); heading.id = headingId; heading.textContent = `${i + 1}번 문제`;
      const badge = document.createElement('span'); badge.className = 'fire-review-status';
      badge.textContent = status === 'unanswered' ? '미응답' : status === 'correct' ? '정답' : '오답';
      header.append(heading, badge);
      const body = document.createElement('div'); body.className = 'fire-review-question'; renderQuestion(body, q.question);
      const options = document.createElement('ol');
      q.choices.forEach((text, n) => {
        const option = document.createElement('li');
        option.dataset.correct = String(n + 1 === q.answerNumber);
        option.dataset.wrong = String(n + 1 === selected && selected !== q.answerNumber);
        const number = document.createElement('span'); number.className = 'fire-choice-number'; number.textContent = symbols[n];
        const content = document.createElement('span'); content.className = 'fire-choice-text'; content.textContent = text;
        option.append(number, content);
        if (n + 1 === selected || n + 1 === q.answerNumber) {
          const label = document.createElement('span'); label.className = 'fire-choice-label';
          label.textContent = `${n + 1 === selected ? '내 선택' : ''}${n + 1 === selected && n + 1 === q.answerNumber ? ' · ' : ''}${n + 1 === q.answerNumber ? '정답' : ''}`;
          option.append(label);
        }
        options.append(option);
      });
      const explanation = document.createElement('div'); explanation.className = 'fire-explanation'; explanation.dataset.explanation = '';
      const title = document.createElement('h5'); title.textContent = '해설';
      const text = document.createElement('p'); text.textContent = q.explanation;
      explanation.append(title, text);
      detail.append(header, body, options, explanation);
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
  restart.addEventListener('click', () => begin());
  retry.addEventListener('click', () => {
    if (active || retryQuestions.length === 0) return;
    confirmAction = 'retry';
    get('#fire-confirm-heading').textContent = '오답·미응답 문제를 다시 풀까요?';
    get('[data-confirm-text]').textContent = `오답·미응답 ${retryQuestions.length}문제를 다시 풉니다. 지금 문제풀이로 이동할까요?`;
    get('[data-confirm] [value="cancel"]').textContent = '취소';
    get('[data-confirm] [value="submit"]').textContent = '확인';
    confirm.returnValue = ''; confirm.showModal();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => filterReview(button.dataset.filter as ReviewFilter)));
  previous.addEventListener('click', () => { if (!expire() && index > 0) { index--; render(); } });
  next.addEventListener('click', () => { if (!expire() && index < questions.length - 1) { index++; render(); } });
  submit.addEventListener('click', () => {
    if (expire()) return;
    confirmAction = 'submit';
    get('#fire-confirm-heading').textContent = '답안을 제출할까요?';
    get('[data-confirm] [value="cancel"]').textContent = '계속 풀기';
    get('[data-confirm] [value="submit"]').textContent = '제출하고 채점';
    const unanswered = questions.filter(q => !answers.has(q.id)).length;
    get('[data-confirm-text]').textContent = unanswered ? `미응답 ${unanswered}개는 점수에 반영되지 않습니다. 제출 후에는 답안을 바꿀 수 없습니다.` : '제출 후에는 답안을 바꿀 수 없습니다.';
    confirm.returnValue = ''; confirm.showModal();
  });
  confirm.addEventListener('close', () => {
    if (confirm.returnValue === 'submit') {
      if (confirmAction === 'retry') begin(true);
      else finish();
    }
    else if (confirmAction === 'retry') retry.focus();
    else if (active) submit.focus();
  });
  document.addEventListener('visibilitychange', () => { if (active && isExam()) tick(); });
  window.addEventListener('beforeunload', event => { if (active) { event.preventDefault(); event.returnValue = ''; } });
}

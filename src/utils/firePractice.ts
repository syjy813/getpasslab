export interface FirePracticeQuestion {
  id: string;
  chapterId: string;
  chapterTitle: string;
  subjectId: 1 | 2;
  question: string;
  choices: string[];
  answerNumber: number;
  explanation: string;
  isCore: boolean;
  questionType: string;
  sourceQuestionId: string | null;
}

export const FIRE_EXAM = {
  perSubject: 25,
  durationSeconds: 60 * 60,
  pointsPerQuestion: 4,
  minimumSubjectScore: 40,
  minimumAverageScore: 70,
} as const;

// Explicit approval is required; a usable-looking draft must never publish itself.
export function getPublishedFireQuestions(rows: unknown[]): FirePracticeQuestion[] {
  const result: FirePracticeQuestion[] = [];
  const ids = new Set<string>();
  const familySubjects = new Map<string, number>();
  for (const candidate of rows) {
    if (!candidate || typeof candidate !== 'object') continue;
    const row = candidate as Record<string, unknown>;
    if (row.reviewStatus !== 'approved' || row.publicationStatus !== 'published' || row.examEligible !== true) continue;
    const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
    if (!text(row.id) || ids.has(row.id) || !text(row.chapterId) || !text(row.chapterTitle)
      || ![1, 2].includes(Number(row.subjectId)) || typeof row.subjectId !== 'number'
      || row.contentStatus !== 'draft_complete' || !text(row.question)
      || !Array.isArray(row.choices) || row.choices.length !== 4 || !row.choices.every(text)
      || !Number.isInteger(row.answerNumber) || Number(row.answerNumber) < 1 || Number(row.answerNumber) > 4
      || !text(row.explanation) || typeof row.isCore !== 'boolean' || !text(row.questionType)
      || !(row.sourceQuestionId === null || text(row.sourceQuestionId))) {
      throw new Error(`Invalid approved fire question: ${String(row.id)}`);
    }
    ids.add(row.id);
    const sourceId = row.sourceQuestionId || row.id;
    if (typeof sourceId !== 'string' || (familySubjects.has(sourceId) && familySubjects.get(sourceId) !== row.subjectId)) {
      throw new Error(`Fire question family crosses subjects: ${String(row.id)}`);
    }
    familySubjects.set(sourceId, row.subjectId);
    result.push({
      id: row.id, chapterId: row.chapterId, chapterTitle: row.chapterTitle,
      subjectId: row.subjectId as 1 | 2, question: row.question, choices: row.choices,
      answerNumber: Number(row.answerNumber), explanation: row.explanation,
      isCore: row.isCore, questionType: row.questionType, sourceQuestionId: row.sourceQuestionId as string | null,
    });
  }
  return result;
}

export function shuffleQuestions<T>(rows: readonly T[], random: () => number = Math.random): T[] {
  const result = [...rows];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const family = (q: FirePracticeQuestion): string => q.sourceQuestionId || q.id;

export function getExamPoolCounts(rows: readonly FirePracticeQuestion[]): number[] {
  return [1, 2].map(subjectId => new Set(rows.filter(q => q.subjectId === subjectId).map(family)).size);
}

export function createFireExam(rows: readonly FirePracticeQuestion[], random: () => number = Math.random): FirePracticeQuestion[] {
  const used = new Set<string>();
  const exam: FirePracticeQuestion[] = [];
  for (const subjectId of [1, 2]) {
    const picked: FirePracticeQuestion[] = [];
    for (const q of shuffleQuestions(rows.filter(q => q.subjectId === subjectId), random)) {
      if (used.has(family(q))) continue;
      used.add(family(q));
      picked.push(q);
      if (picked.length === FIRE_EXAM.perSubject) break;
    }
    if (picked.length < FIRE_EXAM.perSubject) throw new Error(`${subjectId}과목의 공개 문항이 부족합니다.`);
    exam.push(...picked);
  }
  return exam;
}

export function gradeFireQuestions(rows: readonly FirePracticeQuestion[], answers: ReadonlyMap<string, number>) {
  const subjects = [1, 2].map(subjectId => {
    const pool = rows.filter(q => q.subjectId === subjectId);
    const correct = pool.filter(q => answers.get(q.id) === q.answerNumber).length;
    return { subjectId, total: pool.length, correct, score: correct * FIRE_EXAM.pointsPerQuestion };
  });
  const correct = subjects.reduce((sum, item) => sum + item.correct, 0);
  const average = (subjects[0].score + subjects[1].score) / 2;
  const isFullExam = subjects.every(item => item.total === FIRE_EXAM.perSubject);
  return {
    correct, unanswered: rows.filter(q => !answers.has(q.id)).length,
    subjects, average,
    passed: isFullExam && subjects.every(item => item.score >= FIRE_EXAM.minimumSubjectScore) && average >= FIRE_EXAM.minimumAverageScore,
  };
}

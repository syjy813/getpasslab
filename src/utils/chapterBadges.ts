export const CHAPTER_TYPE_TAGS = ['개념', '계산', '절차'] as const;

export type ChapterTypeTag = (typeof CHAPTER_TYPE_TAGS)[number];
export type ChapterTag = ChapterTypeTag | '법령';
export type BadgeTone = 'type' | 'legal' | 'frequent' | 'top-frequent';

export interface ChapterBadge {
  label: ChapterTag | '빈출' | '최빈출';
  tone: BadgeTone;
}

interface QuestionForBadge {
  id: string;
  date: string;
}

export interface ChapterBadgeContext {
  questionsById: Map<string, QuestionForBadge>;
  totalSessionCount: number;
}

export interface ChapterBadgeSummary {
  badges: ChapterBadge[];
  sessionCount: number;
  totalSessionCount: number;
  frequency: '빈출' | '최빈출' | null;
}

export function createChapterBadgeContext(
  questions: QuestionForBadge[],
): ChapterBadgeContext {
  return {
    questionsById: new Map(questions.map((question) => [question.id, question])),
    totalSessionCount: new Set(questions.map((question) => question.date)).size,
  };
}

export function getChapterBadgeSummary(
  tags: readonly ChapterTag[],
  questionIds: readonly string[],
  context: ChapterBadgeContext,
): ChapterBadgeSummary {
  const typeTag = tags.find((tag): tag is ChapterTypeTag =>
    CHAPTER_TYPE_TAGS.includes(tag as ChapterTypeTag),
  );

  if (!typeTag) {
    throw new Error('Chapter badge metadata must include exactly one type tag.');
  }

  const sessionCount = new Set(
    questionIds
      .map((questionId) => context.questionsById.get(questionId)?.date)
      .filter((date): date is string => Boolean(date)),
  ).size;

  let frequency: ChapterBadgeSummary['frequency'] = null;
  if (
    context.totalSessionCount > 0
    && sessionCount * 100 >= context.totalSessionCount * 70
  ) {
    frequency = '최빈출';
  } else if (
    context.totalSessionCount > 0
    && sessionCount * 100 >= context.totalSessionCount * 40
  ) {
    frequency = '빈출';
  }

  const badges: ChapterBadge[] = [{ label: typeTag, tone: 'type' }];

  if (tags.includes('법령')) {
    badges.push({ label: '법령', tone: 'legal' });
  }

  if (frequency) {
    badges.push({
      label: frequency,
      tone: frequency === '최빈출' ? 'top-frequent' : 'frequent',
    });
  }

  return {
    badges,
    sessionCount,
    totalSessionCount: context.totalSessionCount,
    frequency,
  };
}

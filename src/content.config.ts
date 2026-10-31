import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { facilityCategorySlugs } from './config/facility';
import { CERTIFICATIONS } from './config/certifications';
import { questionFiles } from './loaders/questions';

const chapterTypeTag = z.enum(['개념', '계산', '절차']);

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    chapter_id: z.string().optional(), // 통합 집필 목차의 감사용 식별자
    title: z.string(),
    slug: z.string(),               // 동결 키
    cert_id: z.string().default('industrial-safety'),
    exam: z.string().default('written'),
    subject_id: z.number().min(1).max(6),
    group: z.string(),
    tags: z.union([
      z.tuple([chapterTypeTag]),
      z.tuple([chapterTypeTag, z.literal('법령')]),
    ]),
    summary: z.string(),            // 한 줄 요약 = 목록 미리보기 + meta description 핵심 원본
    questions: z.array(z.string()).default([]),  // 기출 문제 ID 참조 (섹션 4 자동 렌더)
    supportingQuestions: z.array(z.object({
      id: z.string(),
      note: z.string(),
      chapter: z.string().optional(), // 연결 설명이 구현된 경우에만 slug 지정
    })).default([]), // 기초 개념 적용용. 주 기출·빈도 집계에서 제외
    related: z.array(z.string()).default([]),    // 관련 챕터 slug (섹션 5 수동 지정분)
    practiceChapter: z.string().optional(), // 세분화 챕터에서 연결할 기존 소방 문제 챕터 slug
    examComment: z.string().optional(),          // 섹션 4 출제 경향 코멘트 (챕터당 1줄)
    order: z.number().default(0),                 // 그룹 내 정렬 순서 (노션 매핑 DB 이관)
    priority: z.enum(['출시 필수', '1차', '2차']).default('1차'), // 작성 우선순위
    status: z.enum(['미시작', '완료', '통합']).default('미시작'),  // 작성·공개 상태
  }),
});

const questions = defineCollection({
  loader: questionFiles(),
  schema: z.object({
    id: z.string(),                 // 동결 키: question_id (예: 20220424_061)
    cert_id: z.string().default('industrial-safety'),
    exam: z.string().default('written'),
    subject_id: z.number(),
    date: z.string(),               // YYYY-MM-DD
    label: z.string(),              // 표기용: "2022년 4월 시행"
    number: z.number(),
    body: z.string(),
    choices: z.array(z.string()).length(4),
    answer: z.number().min(1).max(4),
    review: z.string().default(''),  // 검수 상태 (노션 이관: 미검수 / jpg 확필). '' = 검수완료
  }),
});

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, 'Use a valid YYYY-MM-DD date');
const facilityArticles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/facility' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().refine(value => facilityCategorySlugs.includes(value as typeof facilityCategorySlugs[number])),
    status: z.enum(['draft', 'published']).default('draft'),
    publishedAt: dateString,
    updatedAt: dateString,
    reviewedAt: dateString,
    featured: z.boolean().default(false),
    summary: z.array(z.string()).min(1),
    sources: z.array(z.object({ title: z.string(), url: z.string().url(), note: z.string() })),
    related: z.array(z.string()).default([]),
    certifications: z.array(z.string().refine(value => value in CERTIFICATIONS)).default([]),
    legalReview: z.boolean().default(false),
  }).refine(data => data.status !== 'published' || data.sources.length > 0, 'Published articles require sources').refine(data => data.updatedAt >= data.publishedAt, 'updatedAt must not precede publishedAt'),
});
export const collections = { chapters, questions, facilityArticles };

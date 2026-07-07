import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),               // 동결 키
    subject_id: z.number().min(1).max(6),
    group: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),            // 한 줄 요약 = 목록 미리보기 + meta description
    questions: z.array(z.string()).default([]),  // 기출 문제 ID 참조 (섹션 4 자동 렌더)
    related: z.array(z.string()).default([]),    // 관련 챕터 slug (섹션 5 수동 지정분)
    examComment: z.string().optional(),          // 섹션 4 출제 경향 코멘트 (챕터당 1줄)
  }),
});

const questions = defineCollection({
  loader: file('./src/data/questions.json'),
  schema: z.object({
    id: z.string(),                 // 동결 키: question_id (예: 20220424_061)
    subject_id: z.number(),
    date: z.string(),               // YYYY-MM-DD
    label: z.string(),              // 표기용: "2022년 4월 시행"
    number: z.number(),
    body: z.string(),
    choices: z.array(z.string()).length(4),
    answer: z.number().min(1).max(4),
  }),
});

export const collections = { chapters, questions };

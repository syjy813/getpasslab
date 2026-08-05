import type { ImageMetadata } from 'astro';

export interface QuestionImage {
  src: ImageMetadata;
  alt: string;
}

type QuestionImageEntry = readonly [key: string, image: QuestionImage];

// Keep this list explicit. Only questions approved for public rendering may import
// an asset and add a `${cert_id}:${question_id}` entry here.
const questionImageEntries: readonly QuestionImageEntry[] = [];

const questionImages = new Map<string, QuestionImage>();

for (const [key, image] of questionImageEntries) {
  if (questionImages.has(key)) {
    throw new Error(`Duplicate question image key: ${key}`);
  }
  if (!image.alt.trim()) {
    throw new Error(`Question image alt text is required: ${key}`);
  }
  questionImages.set(key, image);
}

export function getQuestionImage(certId: string, questionId: string) {
  return questionImages.get(`${certId}:${questionId}`);
}

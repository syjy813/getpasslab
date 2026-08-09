import type { ImageMetadata } from 'astro';
import industrialSafetyRegistry from '../data/question-assets/industrial-safety.json';

export interface QuestionImage {
  src: ImageMetadata;
  alt: string;
}

type QuestionImageEntry = readonly [key: string, image: QuestionImage];

const industrialSafetyAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/questions/industrial-safety/*.png',
  { eager: true },
);

// Keep registration explicit through the reviewed manifest. Files that exist in
// the asset directory but are absent from the manifest are never public.
const questionImageEntries: readonly QuestionImageEntry[] = industrialSafetyRegistry.map((entry) => {
  const modulePath = `../assets/questions/industrial-safety/${entry.id}.png`;
  const imageModule = industrialSafetyAssetModules[modulePath];
  if (!imageModule) {
    throw new Error(`Question image asset is missing: ${modulePath}`);
  }
  return [
    `industrial-safety:${entry.id}`,
    { src: imageModule.default, alt: entry.alt },
  ] as const;
});

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

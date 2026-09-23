import type { ImageMetadata } from 'astro';
import computerLiteracyRegistry from '../data/question-assets/computer-literacy.json';
import computerImage0 from '../assets/questions/computer-literacy/20150307_037.png';
import computerImage1 from '../assets/questions/computer-literacy/20170902_021.png';
import computerImage2 from '../assets/questions/computer-literacy/20180303_019.png';
import computerImage3 from '../assets/questions/computer-literacy/20180303_023.png';
import computerImage4 from '../assets/questions/computer-literacy/20180901_040.png';
import computerImage5 from '../assets/questions/computer-literacy/20200704_023.png';
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

const computerLiteracyImages: readonly QuestionImageEntry[] = [
  ['computer-literacy:20150307_037', { src: computerImage0, alt: computerLiteracyRegistry.find(entry => entry.id === '20150307_037')!.alt }],
  ['computer-literacy:20170902_021', { src: computerImage1, alt: computerLiteracyRegistry.find(entry => entry.id === '20170902_021')!.alt }],
  ['computer-literacy:20180303_019', { src: computerImage2, alt: computerLiteracyRegistry.find(entry => entry.id === '20180303_019')!.alt }],
  ['computer-literacy:20180303_023', { src: computerImage3, alt: computerLiteracyRegistry.find(entry => entry.id === '20180303_023')!.alt }],
  ['computer-literacy:20180901_040', { src: computerImage4, alt: computerLiteracyRegistry.find(entry => entry.id === '20180901_040')!.alt }],
  ['computer-literacy:20200704_023', { src: computerImage5, alt: computerLiteracyRegistry.find(entry => entry.id === '20200704_023')!.alt }],
];

const questionImages = new Map<string, QuestionImage>();

for (const [key, image] of [...questionImageEntries, ...computerLiteracyImages]) {
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

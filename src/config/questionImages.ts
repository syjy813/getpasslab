import type { ImageMetadata } from 'astro';
import computerLiteracyRegistry from '../data/question-assets/computer-literacy.json';
import computerImage0 from '../assets/questions/computer-literacy/20150307_037.png';
import computerImage1 from '../assets/questions/computer-literacy/20170902_021.png';
import computerImage2 from '../assets/questions/computer-literacy/20180303_019.png';
import computerImage3 from '../assets/questions/computer-literacy/20180303_023.png';
import computerImage4 from '../assets/questions/computer-literacy/20180901_040.png';
import computerImage5 from '../assets/questions/computer-literacy/20200704_023.png';
import computerImage6 from '../assets/questions/computer-literacy/20151017_012.png';
import computerImage7 from '../assets/questions/computer-literacy/20200704_018.png';
import computerImage8 from '../assets/questions/computer-literacy/20151017_009.png';
import computerImage9 from '../assets/questions/computer-literacy/20151017_010.png';
import computerImage10 from '../assets/questions/computer-literacy/20180901_003.png';
import computerImage11 from '../assets/questions/computer-literacy/20180901_012.png';
import computerImage12 from '../assets/questions/computer-literacy/20150307_001.png';
import computerImage13 from '../assets/questions/computer-literacy/20150627_028.png';
import computerImage14 from '../assets/questions/computer-literacy/20161022_008.png';
import computerImage15 from '../assets/questions/computer-literacy/20190831_028.png';
import computerImage16 from '../assets/questions/computer-literacy/20200229_012.png';
import computerImage17 from '../assets/questions/computer-literacy/20200704_001.png';
import computerImage18 from '../assets/questions/computer-literacy/20200704_021.png';
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
  ['computer-literacy:20150307_001', { src: computerImage12, alt: computerLiteracyRegistry.find(entry => entry.id === '20150307_001')!.alt }],
  ['computer-literacy:20150627_028', { src: computerImage13, alt: computerLiteracyRegistry.find(entry => entry.id === '20150627_028')!.alt }],
  ['computer-literacy:20161022_008', { src: computerImage14, alt: computerLiteracyRegistry.find(entry => entry.id === '20161022_008')!.alt }],
  ['computer-literacy:20190831_028', { src: computerImage15, alt: computerLiteracyRegistry.find(entry => entry.id === '20190831_028')!.alt }],
  ['computer-literacy:20200229_012', { src: computerImage16, alt: computerLiteracyRegistry.find(entry => entry.id === '20200229_012')!.alt }],
  ['computer-literacy:20200704_001', { src: computerImage17, alt: computerLiteracyRegistry.find(entry => entry.id === '20200704_001')!.alt }],
  ['computer-literacy:20200704_021', { src: computerImage18, alt: computerLiteracyRegistry.find(entry => entry.id === '20200704_021')!.alt }],
  ['computer-literacy:20151017_009', { src: computerImage8, alt: computerLiteracyRegistry.find(entry => entry.id === '20151017_009')!.alt }],
  ['computer-literacy:20151017_010', { src: computerImage9, alt: computerLiteracyRegistry.find(entry => entry.id === '20151017_010')!.alt }],
  ['computer-literacy:20180901_003', { src: computerImage10, alt: computerLiteracyRegistry.find(entry => entry.id === '20180901_003')!.alt }],
  ['computer-literacy:20180901_012', { src: computerImage11, alt: computerLiteracyRegistry.find(entry => entry.id === '20180901_012')!.alt }],

  ['computer-literacy:20151017_012', { src: computerImage6, alt: computerLiteracyRegistry.find(entry => entry.id === '20151017_012')!.alt }],
  ['computer-literacy:20200704_018', { src: computerImage7, alt: computerLiteracyRegistry.find(entry => entry.id === '20200704_018')!.alt }],
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

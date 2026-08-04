import {
  INDUSTRIAL_SAFETY_SUBJECTS,
  type SubjectDefinition,
} from './subjects';

export interface ExamDefinition {
  slug: string;
  name: string;
  title: string;
  description: string;
  format: string;
  subjects: Record<number, SubjectDefinition>;
}

export interface CertificationDefinition {
  slug: string;
  name: string;
  englishName: string;
  category: string;
  summary: string;
  description: string;
  exams: Record<string, ExamDefinition>;
}

export const CERTIFICATIONS = {
  'industrial-safety': {
    slug: 'industrial-safety',
    name: '산업안전기사',
    englishName: 'Engineer Industrial Safety',
    category: '국가기술자격 · 기사',
    summary: '산업 현장의 재해 예방과 안전 관리를 위한 국가기술자격',
    description: '산업안전기사 자격증의 필기 6과목 구성과 챕터별 핵심 개념, 계산 공식, 기출 학습 콘텐츠를 안내합니다.',
    exams: {
      written: {
        slug: 'written',
        name: '필기',
        title: '필기 6과목',
        description: '산업안전기사 필기 6과목의 공개 챕터를 과목별로 탐색하고 핵심 개념, 계산 공식, 기출 포인트를 학습할 수 있습니다.',
        format: '과목당 20문항 · 총 120문항 · 과목별 40점 이상, 평균 60점 이상 합격',
        subjects: INDUSTRIAL_SAFETY_SUBJECTS,
      },
    },
  },
} as const satisfies Record<string, CertificationDefinition>;

export type CertificationId = keyof typeof CERTIFICATIONS;

export const DEFAULT_CERTIFICATION_ID: CertificationId = 'industrial-safety';
export const DEFAULT_EXAM_SLUG = 'written';

export function getCertification(certId: string): CertificationDefinition | undefined {
  return CERTIFICATIONS[certId as CertificationId];
}

export function getExam(certId: string, examSlug: string): ExamDefinition | undefined {
  return getCertification(certId)?.exams[examSlug];
}

export function getSubject(
  certId: string,
  examSlug: string,
  subjectId: number,
): SubjectDefinition | undefined {
  return getExam(certId, examSlug)?.subjects[subjectId];
}

export function getSubjectLabel(subjectId: number, subject: SubjectDefinition): string {
  return subject.label ?? `${subjectId}과목`;
}

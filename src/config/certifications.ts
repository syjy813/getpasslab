import {
  ENERGY_MANAGEMENT_SUBJECTS,
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
  'energy-management': {
    slug: 'energy-management',
    name: '에너지관리기능사',
    englishName: 'Craftsman Energy Management',
    category: '국가기술자격 · 기능사',
    summary: '보일러와 열설비의 설치·운전·정비를 다루는 국가기술자격',
    description: '에너지관리기능사 필기 출제기준에 맞춰 보일러 설비, 연소·효율, 배관·제어, 수질·안전, 관계 법규의 핵심을 정리합니다.',
    exams: {
      written: {
        slug: 'written',
        name: '필기',
        title: '필기 핵심요약',
        description: '에너지관리기능사 필기 과목의 12개 주요 항목을 개념, 공식, 운전 절차와 안전 기준 중심으로 학습할 수 있습니다.',
        format: '객관식 4지 택일형 · 60문항 · 60분 · 100점 만점에 60점 이상 합격',
        subjects: ENERGY_MANAGEMENT_SUBJECTS,
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

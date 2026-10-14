export interface SubjectDefinition {
  slug: string;
  name: string;
  label?: string;
}

// ⚠️ 동결 키: 배포 후 변경 불가. 출시 전 최종 확정할 것.
export const INDUSTRIAL_SAFETY_SUBJECTS = {
  1: { slug: 'safety-management', name: '산업재해 예방 및 안전보건교육' },
  2: { slug: 'ergonomics', name: '인간공학 및 위험성평가·관리' },
  3: { slug: 'mechanical', name: '기계·기구 및 설비 안전관리' },
  4: { slug: 'electrical', name: '전기설비 안전관리' },
  5: { slug: 'chemical', name: '화학설비 안전관리' },
  6: { slug: 'construction', name: '건설공사 안전관리' },
} as const satisfies Record<number, SubjectDefinition>;

export const ENERGY_MANAGEMENT_SUBJECTS = {
  1: {
    slug: 'thermal-equipment',
    name: '열설비 설치·운전 및 관리',
    label: '필기과목',
  },
} as const satisfies Record<number, SubjectDefinition>;

export const COMPUTER_LITERACY_SUBJECTS = {
  1: { slug: 'computer-basics', name: '컴퓨터일반' },
  2: { slug: 'spreadsheets', name: '스프레드시트 일반' },
} as const satisfies Record<number, SubjectDefinition>;

// Display names summarize the official two-subject scope (KFSI Ver 26.1).
export const FIRE_SAFETY_LEVEL2_SUBJECTS = {
  1: { slug: 'fire-safety-theory', name: '소방안전관리 이론·소방시설 구조' },
  2: { slug: 'fire-safety-practice', name: '소방시설 점검·계획·대응' },
} as const satisfies Record<number, SubjectDefinition>;

// 기존 import 호환용. 산업안전기사 전용 코드는 단계적으로 자격증 스코프를 사용한다.
export const SUBJECTS = INDUSTRIAL_SAFETY_SUBJECTS;
export type SubjectId = keyof typeof SUBJECTS;

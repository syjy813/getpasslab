// ⚠️ 동결 키: 배포 후 변경 불가. 출시 전 최종 확정할 것.
export const SUBJECTS = {
  1: { slug: 'safety-management', name: '산업재해 예방 및 안전보건교육' },
  2: { slug: 'ergonomics', name: '인간공학 및 위험성평가·관리' },
  3: { slug: 'mechanical', name: '기계·기구 및 설비 안전관리' },
  4: { slug: 'electrical', name: '전기설비 안전관리' },
  5: { slug: 'chemical', name: '화학설비 안전관리' },
  6: { slug: 'construction', name: '건설공사 안전관리' },
} as const;
export type SubjectId = keyof typeof SUBJECTS;

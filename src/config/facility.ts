export const FACILITY_CATEGORIES = [
  { slug: 'start', name: '시설관리 입문', description: '시설관리 일을 알아보고 첫 지원을 준비하는 기초 안내', icon: 'start' },
  { slug: 'career', name: '취업·이직', description: '채용공고, 근무 조건과 경력 방향을 살펴보는 정보', icon: 'career' },
  { slug: 'qualifications', name: '자격증·법정선임', description: '자격증의 쓰임과 선임 요건을 확인하는 정보', icon: 'qualifications' },
  { slug: 'practice', name: '시설관리 실무', description: '설비의 구조와 점검·기록 업무를 이해하는 기초', icon: 'practice' },
] as const;
export const facilityCategorySlugs = FACILITY_CATEGORIES.map(category => category.slug);
export const facilityCategory = (slug: string) => FACILITY_CATEGORIES.find(category => category.slug === slug)!;
export const facilityCategoryPath = (slug: string) => `/facility-management/${slug}/`;
export const facilityArticlePath = (article: { id: string; data: { category: string } }) =>
  `${facilityCategoryPath(article.data.category)}${article.id}/`;
export const sortFacilityArticles = <T extends { data: { publishedAt: string } }>(articles: T[]) =>
  [...articles].sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));

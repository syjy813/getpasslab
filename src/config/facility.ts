export const FACILITY_CATEGORIES = [
  { slug: 'intro', name: '시설 사전', description: '시설관리의 기본 개념부터 현장에서 사용하는 용어까지, 알아두면 유용한 정보를 쉽게 정리했습니다', icon: 'start' },
  { slug: 'career', name: '취업·커리어', description: '취업 준비와 근무 조건, 기관별 채용공고를 살펴보는 정보', icon: 'career' },
  { slug: 'stories', name: '시설 이야기', description: '시설별 실제 업무와 근무환경을 다양한 관점에서 살펴보는 이야기', icon: 'stories' },
  { slug: 'qualifications', name: '법정선임·자격 활용', description: '자격증의 쓰임과 선임 요건을 확인하는 정보', icon: 'qualifications' },
  { slug: 'practice', name: '시설관리 실무', description: '설비의 구조와 점검·기록 업무를 이해하는 기초', icon: 'practice' },
] as const;
export const facilityCategorySlugs = FACILITY_CATEGORIES.map(category => category.slug);
// Published article paths remain pinned to their original route category.
// In particular, /jobs/ is retained for existing posts and the legacy listing.
export const facilityRouteCategorySlugs = [...facilityCategorySlugs, 'jobs'];
export const facilityCategory = (slug: string) => FACILITY_CATEGORIES.find(category => category.slug === slug)!;
// Legacy article frontmatter is content-frozen by approved publication checks.
// New articles can set navigationCategory explicitly without moving their URLs.
export const facilityNavigationCategorySlug = (article: { id: string; data: { category: string; navigationCategory?: string } }) =>
  article.data.navigationCategory
  ?? (article.id === 'what-is-facility-management' ? 'intro'
    : article.id.startsWith('hobyeongbaekma') || article.id.startsWith('sasugoldae') ? 'stories'
      : article.data.category === 'jobs' ? 'career' : article.data.category);
export const facilityNavigationCategory = (article: { id: string; data: { category: string; navigationCategory?: string } }) =>
  facilityCategory(facilityNavigationCategorySlug(article));
export const facilityCategoryPath = (slug: string) => `/facility-management/${slug}/`;
export const facilityArticlePath = (article: { id: string; data: { category: string } }) =>
  `${facilityCategoryPath(article.data.category)}${article.id}/`;
export const sortFacilityArticles = <T extends { data: { publishedAt: string } }>(articles: T[]) =>
  [...articles].sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));

# 시설관리 커뮤니티 5개 카테고리 IA 개편

- 기준 저장소: `main@cfeeeb8a87ce494630e7e69fd9a50190318ceb8b` (PR #281 포함)
- 작업 브랜치: `feat/facility-ia-five-categories-20261116`
- 사용자 확정: 2026-11-16 KST. 개편 구현 후 후속 요청에서 **Production 배포 승인**. PR #282의 필수 검증 통과 후 병합·배포한다.
- 기준 가이드: [`facility-content-guide-v1.4.md` §4](../../standards/facility-content-guide-v1.4.md)

## IA 및 콘텐츠 매핑

| 1차 카테고리 | 새 목록 URL | 공개 글 | 세부 탐색 |
| --- | --- | ---: | --- |
| 시설관리 입문·용어 | `/facility-management/intro/` | 1 | 입문·용어 해설 |
| 취업·커리어 | `/facility-management/career/` | 8 | 취업 가이드 4 / 기업·채용 분석 4 |
| 시설 이야기 | `/facility-management/stories/` | 11 | 호병백마 10 / 사수골대 1 |
| 법정선임·자격 활용 | `/facility-management/qualifications/` | 4 | 선임·자격·경력 활용 |
| 시설관리 실무 | `/facility-management/practice/` | 0 | 준비 중, 주요 탐색에서 숨김 |

## 호환성과 구현 범위

- 기존 공개 글 24개 **원문·이미지·출처·URL을 수정하지 않음**. URL 생성은 종전 `category` 값에 연결하며, 목록과 브레드크럼의 화면 분류만 바꾼다.
- 기존 `/facility-management/jobs/` 목록 URL과 하위 글 URL도 유지한다. 이 목록은 독립 1차 메뉴 대신 취업·커리어에 속하는 과거 접근 경로로 취급한다.
- 기존 콘텐츠 감사 해시를 보호하기 위해 신규 화면 분류는 `facilityNavigationCategorySlug`에서 이전 글의 ID·경로로 해석한다. 이후 신규 글에는 필요 시 `navigationCategory`를 명시한다.
- 카테고리 홈·GNB·푸터·상세 브레드크럼·목록 페이지와 가이드 §4를 함께 변경한다.
- 이전 시리즈·콘텐츠 검증기가 변경된 공통 소스와 새 목록 두 경로를 의도된 IA 변경으로 구분하도록 조정한다. 기존 콘텐츠·이미지 해시 검증은 계속 유지한다.

## 검증 기준

- `npm run build -- --silent`
- `npm run check:facility-ia` — 카테고리 수와 24개 글의 정확한 단일 분류, canonical·URL, 기존 jobs 목록 보존
- `node scripts/check-facility-related-links.mjs`
- `node scripts/check-facility-publication.mjs`
- `node scripts/check-facility-launch.mjs`
- `npm run check:public-content` 및 `npm run check:seo`
- `FACILITY_DRAFT_PREVIEW=1` 모드에서도 위 관련 검증 재수행

## 로컬 검증 결과

- 공개/`FACILITY_DRAFT_PREVIEW=1` 빌드 모두 PASS.
- 공개 HTML 588개와 sitemap 585개 URL: SEO 오류 0, 기존 길이 경고 5. 공개 콘텐츠 검사 오류 0.
- 양 모드 IA/관련 링크/시설 발행 검사 PASS. 공개 기존 시설 UI 소스·이미지 보호 검사와 호병백마 호텔·병원·백화점·마트 회귀 검사 PASS.
- 로컬 Playwright 화면 QA는 Chromium 실행 시 소켓 권한 제한(`Operation not permitted`)으로 중단. UI 캡처·육안 QA는 통과로 주장하지 않고 PR CI의 320/390/768/1440px 검사에서 확인한다.
- PR #282 최초 CI에서 호병백마 목록 검증, 사수골대 반응형 QA, 공공부문 카드 검증이 과거 카테고리/홈 배치를 기대해 실패했다. `check-hobyeongbaekma-publication.mjs`, `qa-sasugoldae.cjs`, `check-public-sector-visuals.mjs`, `qa-facility-launch.cjs`의 검사 대상만 새 IA에 맞게 수정했다. 게시글 URL과 원고·이미지는 수정하지 않았다.
- 수정 후 공개 빌드 및 시설 시각 자료·시리즈·링크·IA·SEO·공개 콘텐츠의 로컬 정적 검사가 PASS. CI 브라우저 QA 재검증은 남아 있다.

검증과 배포 결과는 PR 및 GitHub Actions 증거를 기준으로 확정한다. 이 문서 자체는 Production 배포 완료 증거가 아니다.

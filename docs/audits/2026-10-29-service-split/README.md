# 시설의 모든 것 / 자격증의 모든 것 — 1차 구조·GNB 검토본

기준 main: `6c70b14d1b94f1bcb0ca8035e1d7cf1866ac7631` · 작업 브랜치: `codex/service-split-gnb-20261029`

## 구현

- 링크 기반 segmented navigation, URL 기반 서버 렌더링 활성 상태. 브라우저 저장소나 새 클라이언트 라우터 없음. 767px 이하에서는 로고·기존 메뉴 아래 별도 행. 각 전환 링크 최소44px, `aria-current`, 키보드 포커스 지원.
- 기존 GNB 자격증·과목 메뉴와 챕터 목차/외부 클릭·Escape 닫기 유지. 시설에서만 카테고리 메뉴 표시. 기존 GNB에 검색은 없으며 새 검색 기능은 추가하지 않음.
- 시설 body에서만 디자인 토큰 분기: primary `#18794E`, dark `#145C3E`, soft `#EAF5EE`. 기존 global.css 및 학습 CSS 무수정. 기존 자격증 본문·정답·문제 ID·공개 URL·SEO 메타 보존.
- 신규 facilityArticles collection과 별도 카테고리 설정. `draft` 기본값, published만 공개. 작성·수정·자료확인일, 요약, 출처·출처의 적용 범위, 관련글, 관련 자격증 연결 지원. Article/BreadcrumbList JSON-LD. 법령 글은 legalReview 확인일 표시 지원하며 이번 글은 개별 선임 가능 여부나 법령 수치를 판정하지 않음.
- 상세 템플릿은 H1/H2/H3, 표 caption·scope·키보드 스크롤 영역, 정보 박스, 반응형 이미지/캡션 스타일 제공. 초기 실제 입문 글1개에는 이미지가 필요하지 않아 추가하지 않음. 관련글이 없으면 섹션 미표시.
- 메인은 추천/최신/카테고리별 목록을 공개 데이터에서 생성. 추천글은 최신 목록에 중복하지 않으며 현재 별도 최신 목록은 숨김. 빈 카테고리에는 준비 중 상태와 실제 입문/학습 링크 표시.
- 빈 카테고리는 `noindex, follow`. sitemap은 생성된 시설 HTML의 robots를 읽어 자동 제외하므로 향후 글을 공개하면 해당 카테고리도 자동 색인 허용·sitemap 포함. 기존 sitemap URL/리다이렉트 유지.

## 신규 경로 (아직 Production 미배포)

| 경로 | 용도 | 색인 |
| --- | --- | --- |
| `/facility-management/` | 시설 서비스 메인 | 허용 |
| `/facility-management/start/` | 시설관리 입문 | 허용 |
| `/facility-management/career/` | 취업·이직 | 비허용: 글 없음 |
| `/facility-management/qualifications/` | 자격증·법정선임 | 비허용: 글 없음 |
| `/facility-management/practice/` | 시설관리 실무 | 비허용: 글 없음 |
| `/facility-management/start/reading-job-postings/` | 근거 기반 최소 입문 글 | 허용 |
| `/certifications/` | 기존 4자격증 연결 허브 | 허용 |

## 내용 근거

2026-10-29 고용24 공식 채용정보 API 안내와 채용정보 상세의 항목 구조를 검색·열람. 상세 화면은 일반적인 표시 항목 확인용이며 시설관리 공고 추천이나 해당 공고의 모집 상태로 일반화하지 않음. 본문의 질문/비교 순서는 편집 가이드임을 명시. 실제 법정선임 기준/임금/사업장 사례를 새로 생성하지 않음. 두 정확한 공식 URL과 적용 범위는 article frontmatter에 보존.

## 보존 검증

`review.json.gz`는 현재 소스·공개 자산·빌드 산출물1741개(임시 `.prerender` 제외)의 실제 해시와 추가23파일, 변경559파일 기록. 기존554HTML에서 정확히 다음 삽입만 제거하면 변경 전 바이트와 동일함:

1. 서비스 전환 CSS
2. URL 기반 body data-service 속성
3. GNB 내비게이션 접근성명
4. 전환 링크 두 개

기존 학습 article과 문제 payload, 이미지, 공식, 메타 title/description/canonical은 동일. source 변경은 GNB/BaseLayout/content.config 및 sitemap 설정. 과거 골든해시는 덮어쓰지 않고 정확히 일치하는 현재 파일만 역사 검사에서 복원하며, 알려지지 않은 변경/추가/삭제는 숨기지 않음. 역사 fixture에는 새 reader와 review만 전달. 새 네이티브 검사는 복원된 FS를 사용하지 않고 실제 파일 전부 검사.

## 검증 상태

- WEB clean Astro Build: 561페이지 성공(기존554+신규7).
- 네이티브 보호/신규 내부 링크·H1·JSON-LD·색인 정책 검사 PASS.
- 주요 시설 텍스트 대비: green/white 5.41, dark/white 7.98, green/soft 4.84, dark/soft 7.15:1.
- 최종 전체 정적 검사 및 CI 브라우저 결과는 PR 최종 HEAD의 Checks 확인. 로컬 Chromium 설치는 하지 않고 WEB 정적 미리보기에서 시설 메인·상세를 육안 검수.
- Service split and GNB QA: 12페이지×4폭(320/390/768/1440)=48조건, 직접 진입/새로고침/키보드·클릭 전환/앞뒤 이동/메뉴·목차/표 키보드 스크롤/overflow 확인 및 화면캡처.
- 같은 CI에서 기존 문제풀이 참조 비교12조건과 기존 목차40조건 수행. 결과 JSON/PNG는 `service-split-qa` artifact.
- 실물 모바일·Safari·수정본 Production 검증 없음. main merge/push 및 Production 배포 미실행. 별도 사용자 배포 승인 필요.

## 주요 변경 파일

- 공통: `src/components/GNB.astro`, `src/layouts/BaseLayout.astro`, `src/styles/serviceNavigation.css`, `src/config/services.ts`
- 콘텐츠: `src/content.config.ts`, `src/config/facility.ts`, `src/content/facility/reading-job-postings.md`
- 템플릿: `src/layouts/FacilityLayout.astro`, `src/layouts/FacilityArticleLayout.astro`, `src/styles/facility.css`, `src/components/Facility*.astro`
- 라우팅: `src/pages/facility-management/**`, `src/pages/certifications/index.astro`, `astro.config.mjs`
- QA: `scripts/*service-split*`, `.github/workflows/service-split-qa.yml`, 이전 검사의 reader·fixture 의존성 연결

## 후속 작성

`src/content/facility/<stable-id>.md`에 schema에 맞는 실제 근거 기반 글을 추가. ID/카테고리를 바꾸면 URL이 바뀌므로 공개 이후 보호. draft 상태에서 검수하고 published로 공개. 관련글은 공개된 글 ID만 지정. 현재 경로 추가 외 기존 ID/URL 이전 없음. 신규 글 공개 시 clean build 후 새 네이티브 review를 변경 범위에 맞게 갱신하고 과거 기록은 보존.

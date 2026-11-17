# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-17 KST**. 제품 기준 `main@6164767e9f5aec4a6567e1e12f93a8192dc243ed` ([PR #288](https://github.com/syjy813/getpasslab/pull/288) squash 병합). 후속 완료 기록은 문서만 변경한다.
- 최근 제품: **병원편 목록 전용 썸네일 3종 교체·Production 확인 완료**. 절망편 체크리스트, 희망편 A안 정밀 진단, 대학병원 정문 확정본을 적용했다. 기존 5개 IA·본문·대표·OG·URL은 유지한다.
- 배포 근거: [Pages run 43989905658](https://github.com/syjy813/getpasslab/actions/runs/43989905658) **build/deploy success**. [검증 기록](docs/audits/2026-11-17-hospital-list-thumbnails/deployment.json).

## 현재 작업 — 백화점 목록 썸네일 2종 적용

- 사용자 `ㄱㄱㄱㄱㄱ`에 따라 확정된 절망/희망 2종의 목록 카드 적용과 실서버 배포까지 승인된 상태다.
- 기준 `main@b71e0a209eaa56eb59029baa0c3f907a993c8be0`, 브랜치 `feat/department-store-list-thumbnails-20261117`.
- 원본 PNG 바이트·1448×1086 비율을 유지하고 WebP 2종으로 최적화했다. 제품 변경은 `FacilityCard.astro` 목록 전용 매핑 2행이다.
- 상세 원고·본문 대표 이미지·OG·URL·공통 레이아웃·의존성은 유지한다. 기존 불변 검사에는 승인된 2행·이미지만 연결하고, 홈/목록·4폭·본문/OG 회귀 검사를 수행한다.
- 원본/파생 해시·범위는 [manifest](docs/audits/2026-11-17-department-store-list-thumbnails/manifest.json). 제품 Commit `16770074dc9831292cdb2523be4e94ce8596ad83` 완료, Push/PR/Deploy는 대기.
- 로컬 `astro build` 586페이지 PASS, 백화점 발행·목록 이미지 총 8종 해시/연결·`check:public-content` PASS, `check:seo` 오류 0/기존 경고 5. 코드·의존성 불변이면 이 검증 결과를 재사용한다. 배포는 `AGENTS.md`의 **배포 재개 최소 조회 순서**를 적용한다.

## 최근 완료 — 병원편 목록 썸네일 배포 완료

- 사용자 업로드 `893e9772`의 PNG 3종을 같은 바이트의 영문 파일명으로 정리하고, 1448×1086 WebP 129,322 / 116,506 / 294,802바이트로 제공한다. 품질 82·effort 6, 리사이즈·크롭 없음. [원본·해시 기록](docs/audits/2026-11-17-hospital-list-thumbnails/manifest.json).
- 제품 코드는 `FacilityCard.astro`의 목록 전용 매핑 3행만 추가했다. 본문 Markdown 3편·기존 대표 WebP·레이아웃·OG·canonical·의존성은 변경하지 않았다. 기존 승인 3종을 포함한 총 6종의 파일 해시·기존 소스 불변 검사를 유지한다.
- 최종 검증 HEAD `7d1e3ad39a02a4f3fa3f9e30b51f494a24377191`와 병합 결과의 Git tree `9230de767d46aeb8d9eb1a03ec4f5ea72180f5c5`가 동일하다. 6개 CI 모두 success: 시설 [43988540489](https://github.com/syjy813/getpasslab/actions/runs/43988540489), 호병백마 [43988540507](https://github.com/syjy813/getpasslab/actions/runs/43988540507), SEO [43988540470](https://github.com/syjy813/getpasslab/actions/runs/43988540470), 사수골대 [43988540487](https://github.com/syjy813/getpasslab/actions/runs/43988540487), 자격증 탐색 [43988540476](https://github.com/syjy813/getpasslab/actions/runs/43988540476), 소방 [43988540481](https://github.com/syjy813/getpasslab/actions/runs/43988540481).
- 공개·비공개 모드 각각 72개 화면 조합 PASS. 병원 목록·홈·클릭 이동·본문/OG 보존을 320·390·768·1440px CI에서 확인했다. 기존 공통 브라우저 검사의 썸네일 3종 고정값만 정본의 6종 목록으로 연결했다. SEO 오류 0 / 기존 경고 5.
- Production: 목록 11개 중 병원 3개 이미지 경로만 변경, 제목·나머지 8개 카드 이미지 동일. 병원 상세 3편의 **본문 HTML 전체·OG·canonical이 배포 전과 동일**하다. 새 이미지 3종 실제 로드(1448×1086), 홈 대학병원 카드 로드·연결·데스크톱 화면 확인. Production 브라우저 실측 폭은 1905px이며 모바일 확인은 위 CI 결과로 구분한다.
- **이번 승인 범위 미완료 없음.** 다른 시설 썸네일 확대·본문/OG 교체는 이번 작업에 포함하지 않는다. 이전 작업 근거는 아래 기존 완료 기록 및 각 PR에 보존한다.

## 최근 완료 — 커뮤니티 운영 가이드

- 사용자 `main 병합 및 실서버 배포` 승인에 따라 [PR #283](https://github.com/syjy813/getpasslab/pull/283) 병합 완료. 검증 HEAD `a523763ff207cdd4ffbf20cc9820c1d70eed57c6`와 병합 Commit `4c83ee50`의 Git tree가 동일(`548e5ce5eb27e6d2451b660e0bb8d5e441130848`).
- [운영 가이드 v1](docs/standards/community-operation-guide-v1.md): 6개 이론·11개 출처, 연구/추론/실측 분리, A/B/C 원칙·기능 판단·지표·미실행 실험 후보. `AGENTS.md` 라우터 및 시설 가이드 §12와 연결. 현행 5개 IA와 미병합 조회수 PR #278 구분.
- [SEO CI 43782037314](https://github.com/syjy813/getpasslab/actions/runs/43782037314), 대상 `a523763f`: Build·SEO·공개 콘텐츠·컴활·C1·문제 전달·즉시풀이 success. GitHub 병합 상태 clean 확인 후 병합.
- [Pages run 43782452839](https://github.com/syjy813/getpasslab/actions/runs/43782452839), 대상 `4c83ee50`: Build/Deploy success. 변경은 문서이며 제품 소스·원고·이미지·IA·URL·의존성·CI 구조는 기존 main 대비 동일.
- Production 8경로 HTTP 200·canonical PASS. 주요 목록 1/8/11/4편, 기존 jobs 5편, 기존 호병백마 URL·자격증 진입 확인. 사전 비교한 6경로 HTML SHA-256 동일. [검증 기록](docs/audits/2026-11-16-community-operation-guide/deployment.json). 확인 범위는 HTTP/HTML이며 브라우저 육안 QA를 수행한 것으로 확대하지 않는다.
- **이번 승인 범위 미완료 없음.** 총 지침 복사용 문구는 운영 가이드 §9.1(프로젝트 설정 직접 수정은 미실행). 회원 기능·운영 정책의 실제 적용·실험은 별도 작업이다.

## 현행 IA·변경 범위

- 새 IA: **시설관리 입문·용어 (1) / 취업·커리어 (8) / 시설 이야기 (11) / 법정선임·자격 활용 (4) / 시설관리 실무 (0, 준비 중)**.
- 취업·커리어는 취업 가이드 4 / 기업·채용 분석 4, 시설 이야기는 호병백마 10 / 사수골대 1로 2차 탐색을 제공한다.
- 새 목록 `/facility-management/intro/`, `/facility-management/stories/` 추가. 기존 `/jobs/` 목록과 **공개 24개 글의 URL·원고·이미지·canonical** 보존. 상세 브레드크럼·상단 메뉴·푸터·홈 카테고리와 통합 가이드 §4를 일치시켰다.
- 작업·검증 범위: [IA audit](docs/audits/2026-11-16-facility-ia/README.md). 이전 모바일 피드의 레이아웃과 이미지·기술 설명은 그대로 유지한다.

## 검증 및 남은 단계

- 공개/비공개 미리보기 `astro build` PASS. 새 IA 검사 각각 **4개 운영 카테고리, 24개 글 단일 매핑, 기존 URL/canonical 및 /jobs/ 보존 PASS**.
- 양 모드 시설 발행 검증·관련 링크 검증 PASS. 공개 `check-facility-launch` 소스/이미지 보호 PASS. `check:public-content` 오류 0, `check:seo` 오류 0/기존 경고 5.
- 원고 해시를 보존하기 위해 `category`를 URL 경로로 유지하고, 표시 분류는 중앙 매핑/선택적 `navigationCategory` 필드로 분리했다. 기존 회귀검사는 이 허용된 IA 변경만 예외로 처리하고 새 IA 검사를 CI에 추가했다.
- 원격 CI: 시설 발행 QA의 공개/비공개 미리보기, 호병백마·사수골대 브라우저 QA, SEO 검사 **PASS**. 브라우저 검사에는 320·390·768·1440px 검증이 포함된다.
- **남은 사항:** `시설관리 실무` 카테고리는 공개 글 0편으로 메뉴에서 숨김. 향후 용어·실무 콘텐츠를 작성하면 콘텐츠 분류를 검수한다. 현재 IA 개편의 미완료 배포 단계는 없다.

## 기존 후속 사항

- 이전 모바일 피드의 상세 검증/Production 기록은 [2026-11-15 audit](docs/audits/2026-11-15-facility-feed/README.md) 및 병합 기준 `398923fd`에서 확인한다.
- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-16 KST**. 커뮤니티 운영 가이드 반영 기준 `main@4c83ee50a08311c12e8be365b9e7584e8519d2a6` ([PR #283](https://github.com/syjy813/getpasslab/pull/283) 병합). 후속 완료 기록은 문서만 변경한다. 시설관리 IA 기능 배포 Commit은 `9a791640720c75410b4d30fa4ee09256542bfcd3` ([PR #282](https://github.com/syjy813/getpasslab/pull/282) 병합).
- 최근 제품: 시설관리 **5개 1차 카테고리 개편 완료, Production 배포·확인 완료**. 최초 PR CI에서 기존 카테고리 위치를 가정한 회귀검사 3종을 보완했고, 수정 CI를 확인한 뒤 병합했다.
- 배포 근거: [Pages run 43780562659](https://github.com/syjy813/getpasslab/actions/runs/43780562659) **Success** (build+deploy). 실서버 목록 4곳·기존 `/jobs/` 목록·호병백마 기존 게시글 URL 및 새 카테고리 링크 확인 PASS.

## 현재 작업 — 커뮤니티 운영 가이드 완료

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

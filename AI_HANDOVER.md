# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-16 KST**. 시설관리 IA 기능 배포 기준 `main@9a791640720c75410b4d30fa4ee09256542bfcd3` ([PR #282](https://github.com/syjy813/getpasslab/pull/282) 병합).
- 현재 작업: 시설관리 **5개 1차 카테고리 개편 완료, Production 배포·확인 완료**. 최초 PR CI에서 기존 카테고리 위치를 가정한 회귀검사 3종을 보완했고, 수정 CI를 확인한 뒤 병합했다.
- 배포 근거: [Pages run 43780562659](https://github.com/syjy813/getpasslab/actions/runs/43780562659) **Success** (build+deploy). 실서버 목록 4곳·기존 `/jobs/` 목록·호병백마 기존 게시글 URL 및 새 카테고리 링크 확인 PASS.

## 현행 목표·변경 범위

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

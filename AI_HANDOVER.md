# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-16 KST**. 확인한 원격 기준 `main@cfeeeb8a87ce494630e7e69fd9a50190318ceb8b` (PR #281 포함).
- 현재 작업: `feat/facility-ia-five-categories-20261116`에서 시설관리 **5개 1차 카테고리 개편** 구현 및 로컬 검증 완료. **main 병합·Production 배포 미실행**. PR/CI 확인 후 명시 배포 요청이 필요하다.
- 최근 검증된 실서버 변경은 모바일 피드 [PR #280](https://github.com/syjy813/getpasslab/pull/280), [Pages run 43726251784](https://github.com/syjy813/getpasslab/actions/runs/43726251784). 이후 PR #281의 파비콘 변경은 `main`에 있으나 이 Snapshot에서는 별도 Production QA를 주장하지 않는다.

## 현행 목표·변경 범위

- 새 IA: **시설관리 입문·용어 (1) / 취업·커리어 (8) / 시설 이야기 (11) / 법정선임·자격 활용 (4) / 시설관리 실무 (0, 준비 중)**.
- 취업·커리어는 취업 가이드 4 / 기업·채용 분석 4, 시설 이야기는 호병백마 10 / 사수골대 1로 2차 탐색을 제공한다.
- 새 목록 `/facility-management/intro/`, `/facility-management/stories/` 추가. 기존 `/jobs/` 목록과 **공개 24개 글의 URL·원고·이미지·canonical** 보존. 상세 브레드크럼·상단 메뉴·푸터·홈 카테고리와 통합 가이드 §4를 일치시켰다.
- 작업·검증 범위: [IA audit](docs/audits/2026-11-16-facility-ia/README.md). 이전 모바일 피드의 레이아웃과 이미지·기술 설명은 그대로 유지한다.

## 검증 및 남은 단계

- 공개/비공개 미리보기 `astro build` PASS. 새 IA 검사 각각 **4개 운영 카테고리, 24개 글 단일 매핑, 기존 URL/canonical 및 /jobs/ 보존 PASS**.
- 양 모드 시설 발행 검증·관련 링크 검증 PASS. 공개 `check-facility-launch` 소스/이미지 보호 PASS. `check:public-content` 오류 0, `check:seo` 오류 0/기존 경고 5.
- 원고 해시를 보존하기 위해 `category`를 URL 경로로 유지하고, 표시 분류는 중앙 매핑/선택적 `navigationCategory` 필드로 분리했다. 기존 회귀검사는 이 허용된 IA 변경만 예외로 처리하고 새 IA 검사를 CI에 추가했다.
- **미완료:** PR 생성/원격 CI, 새 화면의 320·390·768·1440px 브라우저 QA, main 병합/배포/Production 확인. 사용자 배포 승인 전에는 진행하지 않는다.

## 기존 후속 사항

- 이전 모바일 피드의 상세 검증/Production 기록은 [2026-11-15 audit](docs/audits/2026-11-15-facility-feed/README.md) 및 병합 기준 `398923fd`에서 확인한다.
- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

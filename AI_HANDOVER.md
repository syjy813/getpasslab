# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-16 KST**. 통합 기준 `main@2f3882b4bbbef7fb3e977d7e18d0c44beb8ae0ce` ([PR #284](https://github.com/syjy813/getpasslab/pull/284) 포함). 시설관리 IA 기능 배포 Commit은 `9a791640720c75410b4d30fa4ee09256542bfcd3` ([PR #282](https://github.com/syjy813/getpasslab/pull/282) 병합).
- 최근 제품: 시설관리 **5개 1차 카테고리 개편 완료, Production 배포·확인 완료**. 최초 PR CI에서 기존 카테고리 위치를 가정한 회귀검사 3종을 보완했고, 수정 CI를 확인한 뒤 병합했다.
- 배포 근거: [Pages run 43780562659](https://github.com/syjy813/getpasslab/actions/runs/43780562659) **Success** (build+deploy). 실서버 목록 4곳·기존 `/jobs/` 목록·호병백마 기존 게시글 URL 및 새 카테고리 링크 확인 PASS.

## 현재 작업 — 커뮤니티 운영 가이드 PR 검토 준비

- [PR #283](https://github.com/syjy813/getpasslab/pull/283), 브랜치 `docs/community-operation-guide-v1-20261116`. 이전 문서 HEAD `030b1496` 이후 최신 main을 통합하며 양쪽 이력을 보존한다. main 병합·배포 승인은 이번 문서 작업에 없음.
- [운영 가이드 v1](docs/standards/community-operation-guide-v1.md): 6개 이론·11개 출처, 연구/추론/실측 분리, A/B/C 원칙·기능 판단·지표·미실행 실험 후보. §1.1·§6.2·§9를 배포된 5개 IA와 미병합 GA4 #278 상태에 맞춰 보완했다.
- `AGENTS.md` 정본 라우터 1행, 시설 콘텐츠 가이드 §12 상호 링크 및 현행 분류 수 정합성 보완. 기존 집필·이미지·SEO·승인 규칙 유지.
- 검증 대상은 이 Snapshot을 포함한 PR 최신 HEAD. 문서 diff·내부 링크·인용 대응과 최신 main 대비 실행 소스/설정/의존성 무변경을 확인한다. 최종 CI는 PR HEAD와 실행 SHA를 대조한다. 이전 `971f2e11`의 CI는 구제품 대상이므로 최신 통합 HEAD의 제품 검증을 대신하지 않는다.
- 다음: 최신 PR CI·검토 상태 확인 후 사용자에게 보고. **별도 승인 전 main 병합·Production 배포 금지**. 총 지침 복사용 최소 문구는 운영 가이드 §9.1. 기능·운영 정책·추가 추적은 적용하지 않았다.

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

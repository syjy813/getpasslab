# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-17 KST**. 제품 기준 `main@4bd413481e5821dd89aa351aa30526d0bb3def73` ([PR #291](https://github.com/syjy813/getpasslab/pull/291) squash 병합). 후속 완료 기록은 문서만 변경한다.
- 최근 제품: **호병백 본문 상단 대표 이미지 8종 제거·Production 확인 완료**. ep.0·호텔 2편·병원 3편·백화점 2편 대상이며 본문 설명 이미지·목록 썸네일·OG·URL·마트편은 유지한다.
- 배포 근거: [Pages run 44095107320](https://github.com/syjy813/getpasslab/actions/runs/44095107320) **build/deploy success**. [실서버 HTML 검증](docs/audits/2026-11-17-hobyeongbaekma-body-heroes/deployment.json).

## 최근 완료 — 호병백 본문 상단 대표 이미지 제거

- 사용자 승인: 이번 교체한 호병백 썸네일 대상 글의 본문 상단 대표 이미지를 제거하고 최소 QA 후 Production 배포.
- 기준 `main@794d4c616159970a3a21bf96ef86908aef58ec53`, 브랜치 `fix/hobyeongbaekma-remove-leading-images-20261117`.
- ep.0·호텔 2편·병원 3편·백화점 2편 총 8편의 첫 `<figure>`만 제거. 본문 문구·frontmatter·설명 이미지·목록 썸네일·OG·URL·레이아웃·의존성은 그대로다. 마트는 대상 밖.
- 기존 검사는 대표 이미지 존재 기대값만 변경하고, 과거 불변 소스 검사는 [삭제 전후 해시·정확한 삭제 범위](docs/audits/2026-11-17-hobyeongbaekma-body-heroes/manifest.json)로 원본을 복원해 유지한다.
- 구현·586페이지 Build·통합 이미지 6검사·대상 발행/링크/메타 검사 PASS. SEO 오류 0(기존 경고 5)·공개 콘텐츠 오류 0. 마트 대표 이미지 유지 PASS. 광범위 로컬 브라우저 QA는 생략한다. PR #291 병합과 Pages build/deploy success. 병합 tree `a5e592333a13f3388bce3913fff4d8bb587078e9`가 로컬 검증 tree와 동일하다. Production 11경로 HTTP/HTML 대조 PASS: 8편 상단 이미지 제거·ep.0 설명 이미지 3개 유지·목록 11개 썸네일 유지·마트 2편 대표 이미지 유지·OG/canonical 유지. 육안 브라우저 QA 완료로 확대하지 않는다. 이번 범위 미완료 없음.

## 백화점 목록 썸네일 이전 작업

- 백화점 목록 썸네일 2종은 현재 main과 Production에서 적용된 상태다. 이번 변경에서도 해당 목록 이미지는 유지했다. 이전 상세 작업 상태와 검증 기록은 [기존 audit](docs/audits/2026-11-17-department-store-list-thumbnails/)와 Git history를 참조한다.

## 최근 완료 — 조회수 분석실 일일 수집 활성화

- 사용자 요청에 따라 매일 **오전 10:00 KST**(`0 1 * * *` UTC)에 전날까지의 GA4 누적 조회수를 수집한다. [PR #290](https://github.com/syjy813/getpasslab/pull/290) 병합 `7f87af5e9ea186df9d331c0450ba9da76b6e1318`. 기존 #278의 운영 사이트 정렬 UI는 병합하지 않았다.
- 실제 첫 수집 [run 44084504550](https://github.com/syjy813/getpasslab/actions/runs/44084504550) **validate/authenticate-and-query 모두 success**. GitHub 단일 JSON 저장 성공: 수집 `2026-11-17T12:35:25.124Z`, 집계 `2026-07-30~2026-11-16`, 공개글 24개·기록 10개·누적 51회. 제목·발행일·현행 표시 분류도 같은 JSON에 포함한다.
- 인증은 기존 WIF/300초 analytics.readonly를 재사용한다. 최대 3회 재시도, 불완전 응답·실패 시 기존 파일 유지, main의 승인된 JSON만 갱신. 일일 데이터 갱신은 Pages 배포를 호출하지 않는다. 최초 코드 병합의 [Pages run 44084504647](https://github.com/syjy813/getpasslab/actions/runs/44084504647) success; 공개 화면 소스는 변경하지 않았다.
- 소유자 전용 [분석실](https://getpasslab-view-insights-2026.resolutebough2.chatgpt.site) **수정·배포 success**, Site 소스 `ad23ae4e3ba03ed4ed1a89e700a601ec05ebbc21`, 배포 `appgdep_6afc4af4c008819196909d56c9946395`. main 데이터만 읽으며 접속·수동 갱신·화면 복귀·표시 중 5분마다 재확인. 집계 종료일·수집/확인 시각·다음 수집 예정·갱신 지연을 구분한다.
- 검증: GA4 fixture·신규 메타/초안 제외·원자적 실패 보존·전날 경계·main 쓰기 제한 PASS, PR GA4/SEO CI success. 분석실 Node 회귀 PASS. 브라우저 preview에서 실제 원격 JSON 반영(51회, 11-16 종료), 새로고침, 시설 이야기 11개 필터·최신순 정렬 확인. 배포는 Sites native 성공 결과로 확인; 모바일 시각 QA는 미수행.
- 다음 예약 목표 **2026-11-18 10:00 KST**. 해당 예약 실행 자체는 아직 도래하지 않았다. GitHub 시작 지연·GA4 전날 수치 보정 가능. [운영 경로·검증](docs/audits/2026-11-17-ga4-daily-dashboard/README.md).

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

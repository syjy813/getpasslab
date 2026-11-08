# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-08 10:54 KST
- 작업 Branch: `codex/operations-docs-v22-20261108`
- 기준 `main` / 마지막 확인된 Production 소스: [`68708f825ba58795a189b900d40fe0d913e5c83d`](https://github.com/syjy813/getpasslab/commit/68708f825ba58795a189b900d40fe0d913e5c83d) (PR #260)
- 문서 변경의 실제 HEAD는 `git rev-parse HEAD`, 포함 커밋은 `git log -1 -- AGENTS.md AI_HANDOVER.md`로 확인한다. 위 기준 커밋을 현재 작업 HEAD로 혼동하지 않는다.
- 시작 시 작업 트리는 clean이었다. 현재 세션은 새 체크아웃이며 다른 작업 공간의 미커밋 상태를 확인한 것으로 보지 않는다.

## 현재 목표

`AGENTS.md`를 공통 실행 규칙·가이드 라우터로, `AI_HANDOVER.md`를 현재 상태 Snapshot으로 정리해 프로젝트 총 지침 v2.2와 맞춘다. 제품 코드·CI 구조 변경은 이번 범위 밖이다.

## 현재 진행 상태

| 단계 | 이번 운영 문서 작업 | 서비스 기준 상태 |
|---|---|---|
| 구현 | 문서 역할 분리·재사용·제한 조회·체크포인트 규칙 반영 | PR #260의 0화 문구·자료 섹션·썸네일 개정 병합 완료 |
| Test / QA | 문서 링크·보호 규칙·완료 기준·diff 검토 | PR #260 HEAD `c5998e8`의 시설·0화·자격증 탐색·소방 QA 성공. 아래 Actions 증거 참조 |
| Build | 제품 소스·의존성·설정 동일성에 근거해 기존 Build 증거 재사용. 문서 변경 PR의 필수 CI는 별도 확인 | `68708f8`의 Pages build 성공. SEO는 PR HEAD `c5998e8`의 실행 성공 |
| Commit / Push | 작업 브랜치의 실제 Git / PR 기록으로 확인 | `68708f8`이 원격 `main`에 반영됨 |
| Deploy | 이번 문서 작업은 미실행. 이번 요청에 Production 배포 승인 없음 | Pages [42382274155](https://github.com/syjy813/getpasslab/actions/runs/42382274155) build / deploy 성공 |
| Production | 신규 배포 없음. 현재 서비스의 제한된 HTTP 검증만 수행 | 2026-11-08 10:54 KST: 0화·목록·사이트맵 HTTP 200, 메타데이터·개정 문구·이미지 7장 해시 일치. 소방 Production QA [42382350616](https://github.com/syjy813/getpasslab/actions/runs/42382350616) 성공 |

Production의 이번 확인은 HTTP·HTML·자산 해시 범위다. 새 수동 브라우저 QA나 전체 사이트 QA PASS를 뜻하지 않는다. PR #260 이전 발행본의 브라우저 기록은 당시 증거로만 보존한다.

## 최근 완료 핵심

- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- 이번 문서 작업의 main 병합·Production 배포는 요청 범위에 없다. PR의 Commit / Push / 필수 CI 상태를 확인하고 인계한다.
- 다음 콘텐츠 후보는 호병백마 1화 호텔이다. `main`에는 0화와 시리즈 계획만 확인됐으며 1~4화를 공개 완료로 보지 않는다. 이전 인계가 언급한 `codex/hobyeongbaekma-hotel-draft-20261107`은 현재 원격 브랜치 목록에서 확인되지 않았다. 재개 시 보존 위치부터 확인한다.
- 열린 기존 PR 10건은 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. 이번 작업 브랜치의 PR / 필수 CI 결과를 확인하고, 실패하면 관련 Step부터 보완한다. 문서 수정만으로 실서버 배포를 시작하지 않는다.
2. 다음 사용자 요청이 콘텐츠라면 위 호텔 초안의 보존 위치와 최신 정본 가이드부터 확인한다. 이전 제작·QA 전부를 반복하지 않고 유효한 체크포인트부터 재개한다.
3. 새 상태가 확정되면 이 Snapshot의 해당 항목을 교체한다. 상세 과정·과거 현재 상태를 아래에 누적하지 않는다.

## 근거와 과거 기록 보존

- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 추가 사본은 만들지 않았다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-08 17:47 KST
- 작업 Branch: `main` · [PR #261](https://github.com/syjy813/getpasslab/pull/261) 병합 완료
- 병합·검증된 배포 소스: [`d289a9a48f35fe9bdadfa57702d974a6d2c30773`](https://github.com/syjy813/getpasslab/commit/d289a9a48f35fe9bdadfa57702d974a6d2c30773) (PR #261). 이후 종료 상태만 기록한 문서 커밋과 구분한다.
- 문서 변경의 실제 HEAD는 `git rev-parse HEAD`, 포함 커밋은 `git log -1 -- AGENTS.md AI_HANDOVER.md`로 확인한다. 배포 소스와 종료 문서 갱신을 포함한 현재 HEAD를 구분한다.
- 병합 전 작업 트리는 clean이었고 `main`을 원격과 fast-forward로 동기화했다. 다른 작업 공간의 미커밋 상태까지 확인한 것으로 보지 않는다.

## 현재 목표

운영 문서의 프로젝트 총 지침 v2.2 정합성 개선·원문 레거시 보존·PR #261 병합·배포·확인을 완료했다. 제품 코드·CI 구조는 변경하지 않았다. 현재 작업의 잔여 사항은 없다.

## 현재 진행 상태

| 단계 | 현재 상태·근거 |
|---|---|
| 구현 | AGENTS 공통 규칙·정본 라우터, 현재 Snapshot, 원문 레거시 및 보존 안내 반영 완료 |
| Test / QA | PR 최종 HEAD `c6b53e3`의 [필수 SEO CI 42463564076](https://github.com/syjy813/getpasslab/actions/runs/42463564076) 성공. 병합 커밋의 자동 후속 QA 10개 전부 성공. 문서 링크·diff·레거시 원문 동일성 확인 |
| Build | 병합 소스 `d289a9a`의 Pages build 성공. 제품·의존성·설정·workflow는 직전 Production 소스와 동일 |
| Commit / Push | PR #261을 `d289a9a`로 원격 `main`에 병합 완료. 최종 상태 기록 커밋은 제품 변경 없이 추가하며 실제 HEAD는 위 Git 명령으로 확인 |
| Deploy | [Pages 42463837414](https://github.com/syjy813/getpasslab/actions/runs/42463837414) build / deploy 성공. 검증된 배포 소스는 `d289a9a` |
| Production | 배포 후 홈·0화·시설 홈·취업 목록·사이트맵과 이미지 7장, 총 HTTP 응답 12건 정상. 개정 문구·메타데이터·목록 연결·이미지 해시 일치. 소방·산업안전·챕터 등 자동 후속 QA도 성공 |

상세 대상·실행 ID·시점·검사 범위는 [종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json)에 보존한다. 이번 직접 Production 검증은 HTTP·HTML·자산 해시 범위이며, 자동 QA의 범위는 각 workflow를 따른다. 실휴대폰·Safari·실광고·검색 색인 전수 검증을 뜻하지 않는다.

병합 후 상태 기록만 갱신하는 커밋은 `[skip ci]`로 동일 제품의 중복 배포를 피한다. PR 필수 CI·병합 배포·후속 QA의 성공과 제품 Git 객체 동일성을 확인한 범위에 한정하며, 다음 제품·설정 변경의 필수 검증을 생략하는 규칙이 아니다.

## 최근 완료 핵심

- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- 다음 콘텐츠 후보는 호병백마 1화 호텔이다. `main`에는 0화와 시리즈 계획만 확인됐으며 1~4화를 공개 완료로 보지 않는다. 이전 인계가 언급한 `codex/hobyeongbaekma-hotel-draft-20261107`은 현재 원격 브랜치 목록에서 확인되지 않았다. 재개 시 보존 위치부터 확인한다.
- 최초 상태 조회에서 열린 기존 PR 10건은 이번에 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. 운영 문서 정리·병합·배포 작업은 종료됐다. 다음 사용자 요청에 맞춰 현재 HEAD와 해당 영역의 유효한 체크포인트만 확인한다. 이미 성공한 동일 대상 검증은 재사용한다.
2. 다음 사용자 요청이 콘텐츠라면 위 호텔 초안의 보존 위치와 최신 정본 가이드부터 확인한다. 이전 제작·QA 전부를 반복하지 않고 유효한 체크포인트부터 재개한다.
3. 새 상태가 확정되면 이 Snapshot의 해당 항목을 교체한다. 상세 과정·과거 현재 상태를 아래에 누적하지 않는다.

## 근거와 과거 기록 보존

- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

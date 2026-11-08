# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-08 KST · 호병백마 1화 집필
- 작업 Branch: `codex/hobyeongbaekma-episode01-writing-20261108`
- 기준 원격 main: `9eca8430c03682a2b027e00a825fe5ed54b0c471` · 제품 배포 소스는 PR #261의 `d289a9a48f35fe9bdadfa57702d974a6d2c30773`. 이후 main 커밋은 종료 문서 기록이다.
- 이번 집필 결과의 정확한 HEAD는 해당 브랜치/PR에서 확인한다. 본 Snapshot은 아래 원고·검수 기록과 같은 커밋에 보존한다.
- 작업 공간에는 기존 전체 체크아웃이 없었다. 연결된 GitHub의 main·대상 파일·브랜치 목록을 확인하고 별도 브랜치에서 편집했다. 다른 작업 공간의 미커밋 상태를 확인한 것으로 보지 않는다.

## 현재 목표

호병백마 0화에 이어 1화 호텔 편의 원고를 집필했다. 객실 대응·시설 외 지원·야간 지원체계·신입 교육과 업무 경험을 다룬다. 원고와 텍스트 검토본은 완료됐고, 이미지 제작·실제 사이트 preview QA·발행은 남아 있다.

## 현재 진행 상태

| 단계 | 현재 상태·근거 |
|---|---|
| 집필 | [1화 원고](docs/drafts/facility/hobyeongbaekma/episode01.md), [텍스트 검토본](docs/drafts/facility/hobyeongbaekma/episode01-review.html), [교정·근거 기록](docs/drafts/facility/hobyeongbaekma/episode01-editor-notes.md) 완료 |
| 검증 | 공식 직무 설명 1건·과거 후기 3건의 원문 재확인. YAML·제목/요약·출처·HTML H1·표·링크·초안 격리 등 [검사 결과](docs/drafts/facility/hobyeongbaekma/episode01-validation.json) 참조 |
| Build / 사이트 QA | 로컬 전체 Build와 실제 Astro·브라우저 QA 미실행. PR 필수 CI의 실행 상태와 구분하며 성공 여부는 해당 실행에서 확인 |
| 이미지 | 대표 1장·설명 카드 2장 브리프만 작성. 파일 생성·채택·이미지 QA는 미완료 |
| Git | 별도 작업 브랜치/PR로 보존. 이번 변경은 `docs/drafts/`와 상태 문서뿐이며 공개 소스·설정·이미지 변경 없음 |
| Deploy / Production | 이번 1화의 배포 요청 없음, main 병합·배포 미수행. 0화의 기존 공개 정본과 URL 유지 |

## 최근 완료 핵심

- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- 호병백마 1화 호텔은 이번 브랜치의 `episode01.md`에 집필했다. 이전 인계가 언급한 `codex/hobyeongbaekma-hotel-draft-20261107`은 원격 검색에서 확인되지 않았으며, 0화 제작·개정 브랜치만 확인했다. 1화는 이미지/사이트 QA 전 초안, 2~4화는 계획이며 공개 완료로 보지 않는다.
- 최초 상태 조회에서 열린 기존 PR 10건은 이번에 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. 1화 원고를 검토하고 위 브리프 기준으로 이미지를 제작·검수한다. 편집용 frontmatter는 실제 발행일을 포함하지 않으므로 공개 전환 때 현행 스키마와 실제 날짜에 맞춘다.
2. 기존 Astro 시설 레이아웃에서 원고·이미지 preview와 모바일/PC QA를 진행한다. 사용자 발행 승인 전 main 병합·Production 배포는 하지 않는다.
3. 다음 집필은 2화 병원: 기계·전기 파트, 특수설비 담당 경계, 비상 대응과 교육. 1화 제작·검증을 처음부터 반복하지 않고 유효한 원고/PR 체크포인트를 재사용한다.

## 근거와 과거 기록 보존

- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

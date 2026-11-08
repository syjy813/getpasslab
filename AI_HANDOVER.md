# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-08 KST · 호병백마 0화 이미지 통합
- 작업 Branch: `codex/facility-card-4-6-20261108`
- 기준 main: `9eca8430c03682a2b027e00a825fe5ed54b0c471`; 제품 배포 소스는 PR #261의 `d289a9a48f35fe9bdadfa57702d974a6d2c30773`.
- 이번 템플릿의 정확한 HEAD·CI는 해당 브랜치/PR을 확인한다. 로컬에는 관련 원격 파일만 가져온 별도 Git 작업 공간을 사용하며 전체 저장소 체크아웃으로 보지 않는다.

## 현재 목표

4·5·6개 통합 템플릿에 이어, 사용자의 후속 요청에 따라 호병백마 0화의 분할 이미지 세 묶음을 각각 한 장으로 합쳤다. 대표는 유지하고 본문 6장을 3개 picture로 교체했다. 현재는 PR 브랜치 적용 상태이며 Production 배포 전이다.

## 현재 진행 상태

| 단계 | 상태·근거 |
|---|---|
| 구현 | 4개 시설·업무 부담 4조건·지원 전 6개 확인사항을 각각 한 장으로 통합. PC 2열/모바일 전체 항목 1열, 이미지 로딩 전 비율 예약 |
| 보존 | 본문·표·출처·대표·URL 보존. 직전 원고/CSS 사본과 SVG/PNG/WebP·해시는 [0화 통합 audit](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/README.md) 참조. 기존 분할본/이전 manifest는 유지 |
| 검증 | 전용 로컬 테스트 5개 PASS. 원고의 세 figure 쌍+수정일 외 내용 보존, 카드 필드·순서·자산 해시·CSS 범위 검사 |
| Build / 화면 QA | 템플릿 체크포인트 `ca30d38975eec8ca0b8ec18e852f27386ef43050`의 Build/SEO·템플릿 4폭·시설 회귀는 성공. 실제 적용 d3bfd405의 Build·SEO·0화 4폭 QA도 성공. 고정된 과거 CSS 산출물 경로로 실패한 기존 시설 회귀는 새 스타일 3규칙만 제거한 기존 bundle 해시 대조로 보완했으며 최종 CI를 확인 |
| Git | 기존 PR #263의 같은 브랜치에서 0화 적용을 추가. 원고 PR #262는 별도 보존 |
| Deploy / Production | 이번 변경의 main 병합·배포 미수행. 현재 실서버와 브랜치 적용 상태를 구분 |

## 최근 완료 핵심

- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- 호병백마 1화 원고는 별도 PR #262에 보존돼 있으며 이 템플릿 브랜치에는 포함하지 않았다. 1화 이미지 제작/화면 QA, 2~4화 집필·공개는 미완료다.
- 최초 상태 조회에서 열린 기존 PR 10건은 이번에 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. PR #263 최종 HEAD에서 실제 0화의 320/390/768/1440px 이미지 선택·예약 높이·목차·표·SEO·기존 기능을 확인한다.
2. 실서버 배포 요청 후 해당 PR을 병합·배포하고 Production에서 대표+통합3장 및 모바일/PC 자산 선택을 확인한다.
3. 호병백마 1화 호텔 원고는 별도 [PR #262](https://github.com/syjy813/getpasslab/pull/262)에 보존돼 있다. 이후 이미지 제작 시 확정한 통합 템플릿을 재사용한다.

## 근거와 과거 기록 보존

- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-08 KST · 호병백마 0화 통합 이미지 배포 완료
- 현재 Branch: `main` · [PR #263](https://github.com/syjy813/getpasslab/pull/263) 병합 완료
- 검증·배포 제품 소스: `dcfcf34adb4772996381ff5c98213851c88dcbf3`. 승인 PR HEAD `f3a24198e41af8f4177db17a23fcf25af1a57522`와 Git tree가 동일하다.
- 이 Snapshot과 완료 증거를 기록하는 종료 커밋은 문서만 변경한다. 실제 원격 HEAD와 제품 배포 소스는 구분한다. 동일 제품의 중복 배포를 피하도록 종료 기록 커밋에 `[skip ci]`를 적용하며 다음 제품 변경의 필수 검사를 생략하지 않는다.
- 로컬 작업 공간은 관련 파일만 가져온 부분 체크아웃이다. 원격 merge/배포 상태와 다른 공간의 미커밋 상태를 혼동하지 않는다.

## 현재 목표

호병백마 0화의 세 분할 이미지 묶음을 각 한 장으로 통합하고 사용자 배포 승인에 따라 실서버 교체·Production 확인을 완료했다. 본문 6→3장, 대표 포함 7→4개 img이며 해당 요청의 남은 구현·배포 작업은 없다.

## 현재 진행 상태

| 단계 | 상태·근거 |
|---|---|
| 구현 | 4개 시설·업무 부담 4조건·지원 전 6개 확인을 통합. PC 2열/모바일 전체 항목 1열, 로딩 전 비율 예약 |
| 보존 | 본문·표·출처·대표·URL 및 이전 분할 자산 보존. [적용 audit](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/README.md)와 이전 원고/CSS·마스터·해시 참조 |
| Test / QA | PR 최종 HEAD의 필수 SEO·템플릿·0화·시설 공개/비공개·자격증 탐색·소방 launch CI 6개 모두 성공. 로컬 통합 전용 6개 테스트 PASS. [최종 근거](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json) |
| Build / Deploy | merge 소스의 [Pages 42479587679](https://github.com/syjy813/getpasslab/actions/runs/42479587679) build/deploy 모두 성공 |
| Git | PR #263을 main `dcfcf34a`로 병합. PR 검증 tree와 merge tree 동일성 확인. 종료 문서 커밋은 제품 코드·설정·자산을 변경하지 않음 |
| Production | 공개 URL HTTP 200, img 4/picture 3, 대표+새 PC/모바일 7파일의 SHA 일치. 실제 브라우저 PC 1600/모바일 390px에서 전체 파일 선택·로드·가로 넘침 없음 확인, viewport 원복. 홈/취업 목록의 0화 카드·대표 유지 |
| 추가 자동 QA | Pages 후속 전역 자동 QA 10건 모두 성공. 대상 실행은 closeout의 afterDeployChecks 참조 |

## 최근 완료 핵심

- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 4·5·6개 통합 템플릿과 0화 본문 이미지 6→3장 통합, main 병합·Pages 배포·실서버 PC/모바일 및 7파일 해시 확인 완료.
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

1. 이번 0화 이미지 통합·배포 요청은 종료했다. 새 요청이 없으면 재빌드·재배포하지 않는다.
2. 다음 콘텐츠는 별도 PR #262의 호병백마 1화 호텔 원고다. 기존 원고·조사·체크포인트를 재사용해 이미지 제작과 실제 글 QA부터 이어간다.
3. 추가 전역 자동 QA의 최신 결과가 필요하면 closeout에 연결된 실행만 확인하며 같은 제품의 성공한 검증을 반복하지 않는다.

## 근거와 과거 기록 보존

- PR #263 완료: [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), [실서버 HTTP·자산·목록](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-http.json), [실제 PC·모바일 브라우저](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-browser.json).
- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

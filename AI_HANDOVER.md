# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세는 연결 문서에서 필요한 부분만 확인한다.

## 기준 상태

- 갱신: 2026-11-10 KST. 기준 main `98be89d2b093f2d39d383480cf92310a01986e80`.
- 작업 브랜치: `codex/hobyeongbaekma-hotel-two-parter-20261109`, [PR #264](https://github.com/syjy813/getpasslab/pull/264).
- 중단 전 원고 HEAD `4b9b3675968b93b4582fbcb5eadd02ec19e81991`와 최신 main을 결합해 호텔편 2부작의 기존 배포 승인 범위를 재개한다.

## 현재 목표와 진행

호병백마 ep.1-1 절망편·ep.1-2 희망편을 확정 썸네일과 함께 공개한다. 단일 호텔편 PR #262는 이번에 병합하지 않는다.

| 단계 | 상태 |
|---|---|
| 구현 | 두 공개 원고·자기 canonical 경로·대표 figure·상대편 링크·관련 카드·2026-11-10 날짜 적용 |
| 이미지 | 승인 WebP 2개 저장소 등록 준비 완료. 1440×1080. 배포 패키지 해시와 일치 |
| 출처 | 공식 Marriott 개별 주임급 설명 재확인, 내부 메타데이터 유지. 두 글의 본문 외부 링크·자료 섹션 없음. 타 일반 글 출처 표시는 유지 |
| 보호 | 별도 manifest로 소스 2개·이미지 2개·출력 4개만 추가 허용. 공용 컴포넌트 전후 해시 보존. 과거 baseline·0화·기존 자산 유지 |
| 로컬 검증 | Build·SEO·public-content·호텔 공개 검사·시설 공개/링크/소스 보호·0화·카드 여백·픽토그램 PASS. Private preview 검사 및 원격 CI는 최종 실행 결과로 갱신 |
| 실제 화면 | 로컬 Chromium은 socket 제한으로 실행 불가. CI에서 320/390/768/1440px 2편 및 기존 화면 검사 필수 |
| Git / Deploy | 구현 단계. 원격 최종 CI 성공 후 승인 범위 내 병합·Pages·Production 확인 예정. **현재 배포 완료로 보고하지 않음** |

## 다음 행동

1. PR #264의 최신 Commit에서 필수 CI와 4폭 실제 페이지 QA 성공 확인.
2. 승인 범위에 따라 병합·Pages build/deploy 성공 확인.
3. 두 공개 URL·이미지 바이트 SHA·목록·PC/모바일 확인 후 종료 근거와 이 Snapshot 갱신.
4. 다음 집필은 병원편이며 호텔 2부작 공개가 우선이다.

## 최근 완료·보류

- PR #263: 0화 본문 이미지 6→3장 통합과 4·5·6개 템플릿, Pages 및 Production 검증 완료.
- PR #266: 직영·자회사·용역 무테두리 대표 이미지 배포 완료. 해당 이미지의 직접 공개 바이트 SHA·화면 검증 미확인 상태는 별도 유지.
- PR #261: 운영 문서 경량화 및 레거시 원문 보존 완료.
- PR #262·#255·#246 등 다른 열린 PR은 자동 병합·폐기하지 않는다.
- Search Console 선택 canonical, 광고 승인·수익, 실제 휴대폰/Safari, 이전 자격증 원문·권리·Excel 검수와 dependency 경고는 이번 확인 범위 밖이다. 과거 기록은 해당 작업 재개 때 최신 소스로 확인한다.

## 이번 근거

- [공개 manifest·전후 소스](docs/audits/2026-11-10-hotel-two-parter/manifest.json), [작업·검증 범위](docs/audits/2026-11-10-hotel-two-parter/README.md).
- 공개 정본: `src/content/facility/hobyeongbaekma-hotel-despair.md`, `hobyeongbaekma-hotel-hope.md`. docs/drafts의 2026-11-09 원고는 과거 편집본이다.

## 근거와 과거 기록 보존

- 최종 외곽 여백·테두리 제거 배포: [PR #266](https://github.com/syjy813/getpasslab/pull/266), [시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42736850031), [SEO](https://github.com/syjy813/getpasslab/actions/runs/42736850025), [Pages build/deploy success](https://github.com/syjy813/getpasslab/actions/runs/42739563616), deploy source `4d45d7a5be979ba04c170f2f2f2cad7e79f01106`.
- 직전 상단 여백 수정 이력: [PR #265](https://github.com/syjy813/getpasslab/pull/265), Pages 42729771418. 이후 PR #266에서 최종 무테두리 버전으로 교체됨.
- PR #263 완료: [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), [실서버 HTTP·자산·목록](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-http.json), [실제 PC·모바일 브라우저](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-browser.json).
- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

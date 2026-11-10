# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-10 KST · 직영/자회사/용역 대표 썸네일 교체 후 Pages 배포 복구 중
- 제품 기준: `main` · [PR #265](https://github.com/syjy813/getpasslab/pull/265) squash 병합 커밋 `54553a760cf7e8b1e9ab5c0d8d8dad5f46040bb7`
- 이번 변경 제품 범위: `facility-image-refresh/03/01-employment-types-hero.webp`, `docs/audits/2026-11-06-facility-image-bulk/hero-masters/03.png`, 관련 manifest 해시 및 승인 이미지 예외 검수 2개
- 로컬 작업 공간의 Git 상태는 확인하지 못했으며 원격 PR/CI/Pages 상태를 근거로 한다. 후속 문서 커밋은 제품 이미지/코드 변경을 포함하지 않는다.

## 현재 목표

사용자가 승인한 「시설관리 직영·자회사·용역 차이」 대표 썸네일의 상단 여백을 확대한 4:3 최종 이미지를 동일 공개 URL로 교체한다. 코드 및 이미지의 `main` 병합·CI PASS는 완료했으나, Pages 게시가 파일 동기화 중 시간 초과되어 Production 최종 반영은 미확인이다. 빌드 아티팩트를 유지한 채 새로운 Pages 배포 시도로 복구한다.

## 현재 진행 상태

| 단계 | 상태·근거 |
|---|---|
| 구현 | 완료. WebP·PNG 마스터 1440×1080 교체. 기존 대표 이미지 URL·본문·alt·다른 이미지 불변 |
| 보존 | 개별 대표 이미지 SHA-256 2개를 기존 bulk manifest에 반영. 승인 대상 1개만 역사적 이미지 불변성 검사의 명시 예외로 처리하고 다른 자산 보호 유지 |
| Test / QA | [PR #265](https://github.com/syjy813/getpasslab/pull/265) 최종 HEAD `3415d995959e1be58bc2ddf9537ac9728b5a29d9`: [시설 publication/public-private QA](https://github.com/syjy813/getpasslab/actions/runs/42727560555) PASS 및 [SEO](https://github.com/syjy813/getpasslab/actions/runs/42727560883) PASS |
| Build | 제품 커밋 `54553a7`의 [Pages 42727982153](https://github.com/syjy813/getpasslab/actions/runs/42727982153) build PASS, 아티팩트 `github-pages` 생성 |
| Commit / Push | PR #265 병합 완료. 후속 상태 문서 커밋은 새 Pages 배포를 다시 시작하는 목적 |
| Deploy | **미완료**. 42727982153 첫 시도 `syncing_files` 10분 시간 초과로 취소됨. 실패 job만 재실행했으나 이전 취소 상태로 즉시 종료. 새 commit 기반 재배포 필요 |
| Production | **미확인**. 현재 공개 이미지의 최종 SHA 및 PC/모바일 반영 미확인. 배포 성공 전 PASS로 표시하지 않음 |

## 최근 완료 핵심

- [PR #265](https://github.com/syjy813/getpasslab/pull/265): 직영·자회사·용역 대표 이미지 상단 여백 수정본, PNG 마스터, WebP, manifest·QA 보호 조건 수정. 원격 병합/CI PASS; Pages 배포 복구 중.
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 4·5·6개 통합 템플릿과 0화 본문 이미지 6→3장 통합, main 병합·Pages 배포·실서버 PC/모바일 및 7파일 해시 확인 완료.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- **현재 최우선 미완료:** 직영·자회사·용역 대표 이미지의 Pages 재배포 및 공개 WebP/화면 검증. 기존 제품 commit의 첫 Pages deploy가 `syncing_files` 시간 초과, 같은 SHA 재시도는 취소됨.
- 호병백마 1화 원고는 별도 PR #262에 보존돼 있으며 이 템플릿 브랜치에는 포함하지 않았다. 1화 이미지 제작/화면 QA, 2~4화 집필·공개는 미완료다.
- 최초 상태 조회에서 열린 기존 PR 10건은 이번에 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. 현 상태 문서 커밋으로 새 Pages build/deploy가 시작되는지 확인하고 해당 실행의 `build`/`deploy` 결과를 제품 커밋과 연결한다.
2. Pages 성공 시 공개 글과 대표 이미지의 HTTP·파일 SHA 및 PC/모바일 반영 상태를 확인한다.
3. 확정된 결과로 이 Snapshot을 교체한다. 완료라면 후속 문서 전용 `[skip ci]` 커밋으로 불필요한 재배포를 피한다.
4. 별도 콘텐츠 작업(호병백마 1화 이미지 및 2~4화 등)은 이 요청에 포함하지 않는다.

## 근거와 과거 기록 보존

- 직영·자회사·용역 대표 이미지 교체: [PR #265](https://github.com/syjy813/getpasslab/pull/265), [PASS한 시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42727560555), [PASS한 SEO](https://github.com/syjy813/getpasslab/actions/runs/42727560883), [첫 Pages 배포 실패 및 재시도](https://github.com/syjy813/getpasslab/actions/runs/42727982153).
- PR #263 완료: [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), [실서버 HTTP·자산·목록](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-http.json), [실제 PC·모바일 브라우저](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-browser.json).
- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

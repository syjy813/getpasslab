# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-10 KST · 직영/자회사/용역 대표 이미지 수정 및 Pages 재배포 성공
- 제품 기준: `main` · [PR #265](https://github.com/syjy813/getpasslab/pull/265) squash 병합 제품 커밋 `54553a760cf7e8b1e9ab5c0d8d8dad5f46040bb7`
- 재배포·상태 문서 기준: `6ae93ed1be68a855ee27687e945c84ef524dfede`; 이후 본 종료 문서 커밋은 제품 코드·이미지·설정을 바꾸지 않으며 `[skip ci]`를 적용한다.
- 로컬 작업 공간 Git 상태는 조회하지 못했고 원격 PR/CI/Pages 증거를 기준으로 했다.

## 현재 목표

사용자가 승인한 「시설관리 직영·자회사·용역 차이」 대표 썸네일의 제목·부제 상단 여백 확대한 4:3 이미지를 동일 URL로 교체했다. PR 병합·Test·Build·Pages Deploy는 완료했다. 실서버에서 변경 이미지의 HTTP/SHA 및 PC·모바일 시각 검증은 도구 접근 제한으로 미확인이므로 완료 QA로 확대하지 않는다.

## 현재 진행 상태

| 단계 | 상태·근거 |
|---|---|
| 구현 | 완료. WebP·PNG 마스터 1440×1080 교체. 본문·대표 공개 URL·alt 및 다른 자산 불변 |
| 보존 | 해당 대표 이미지 SHA-256 2개를 bulk manifest에 반영. 승인 대상 1개만 과거 불변성 검사의 명시 예외로 허용, 나머지 이미지 보호 |
| Test / QA | [PR #265](https://github.com/syjy813/getpasslab/pull/265) 최종 HEAD `3415d995959e1be58bc2ddf9537ac9728b5a29d9`의 [시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42727560555) PASS, [SEO](https://github.com/syjy813/getpasslab/actions/runs/42727560883) PASS |
| Git | PR #265 squash 병합 제품 커밋 `54553a7`. 배포 복구를 위한 문서 커밋 `6ae93ed` 이후 별도 종료 문서 `[skip ci]` |
| Build / Deploy | [Pages run 42729771418](https://github.com/syjy813/getpasslab/actions/runs/42729771418): commit `6ae93ed`, build/deploy 모두 **success**, https://getpasslab.co.kr/ 환경 URL 확인 |
| 복구 이력 | 이전 [Pages 42727982153](https://github.com/syjy813/getpasslab/actions/runs/42727982153)은 `syncing_files` 10분 timeout, 같은 SHA의 deploy job 재실행은 canceled. 새 문서 commit 기반 신규 실행으로 성공 |
| Production | Pages 배포 서비스 성공 보고 확인. 사이트 기존 탭의 URL·목록 구조 확인. **변경 후 공개 WebP HTTP/SHA 및 PC·모바일 브라우저 화면은 별도 검증 미실행** |

## 최근 완료 핵심

- [PR #265](https://github.com/syjy813/getpasslab/pull/265): 직영·자회사·용역 대표 이미지 상단 여백 수정본, PNG 마스터, WebP, manifest·QA 보호 조건 수정. 원격 병합/CI PASS, Pages 재배포 성공(42729771418).
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 4·5·6개 통합 템플릿과 0화 본문 이미지 6→3장 통합, main 병합·Pages 배포·실서버 PC/모바일 및 7파일 해시 확인 완료.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- **추가 검증 필요:** 직영·자회사·용역 변경 대표 이미지의 공개 URL HTTP/SHA, PC 1440px·모바일 390px 화면 로드·글자 잘림·대표 카드 표시를 배포 후 실제 브라우저에서 직접 검증하지 못했다. Pages 배포 성공과 별도 상태다.
- 호병백마 1화 원고는 별도 PR #262에 보존돼 있으며 이 템플릿 브랜치에는 포함하지 않았다. 1화 이미지 제작/화면 QA, 2~4화 집필·공개는 미완료다.
- 최초 상태 조회에서 열린 기존 PR 10건은 이번에 자동으로 병합·폐기하지 않았다. #255(자연스러운 집필 기준), #246(이전 이미지 템플릿) 등은 미병합 상태이며 현재 정본으로 간주하지 않는다. 나머지 목록은 [이번 상태 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json)의 `openPullRequests` 참조. 최신 정합성 검토는 별도 작업이다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, 기출·이미지 이용 권리 문제는 이번에 해결 여부를 재검증하지 않았다. 관련 작업 재개 시 해당 audit와 현재 소스를 대조한다. 과거 수치·보류 목록을 최신 전수 상태로 사용하지 않는다.
- Search Console 색인·Google 선택 canonical, AdSense 계정 승인·실제 광고 노출·수익은 이번에 확인하지 않았다. 과거 ‘미승인’ 기록을 현재 계정 상태로 단정하지 않는다. 실제 휴대폰·Safari·학습자 효과도 이번 검증 범위 밖이다.
- 과거 dependency 보안·번들 크기 경고는 현재 재검증하지 않았다. 자동 `npm audit fix` 없이 별도 dependency / 성능 검토 대상으로 유지한다.
- CI 중복 Build·브라우저 설치·광범위한 path filter는 후속 후보이며 이번에 수정하지 않았다. [검토 근거](docs/audits/2026-11-08-operations-docs-v22/README.md) 참조.

## 다음 행동

1. Pages build/deploy까지는 완료했으며 동일 이미지의 중복 배포는 하지 않는다.
2. 실서버에서 대상 URL `/facility-management/career/employment-types/`와 대표 WebP `/images/facility-drafts/03/01-employment-types-hero.webp`를 PC/모바일로 직접 확인할 때 이미지 SHA-256 `514a86e545e147cb90468715e1e111393c0741054410022fcf134473fa6fca21`를 대조하면 마지막 검증을 종료할 수 있다.
3. 호병백마 1화 등 다른 콘텐츠 작업은 별도 승인 범위로 유지한다.

## 근거와 과거 기록 보존

- 실제 재배포 완료: [Pages build/deploy success](https://github.com/syjy813/getpasslab/actions/runs/42729771418), commit `6ae93ed1be68a855ee27687e945c84ef524dfede`. 공개 이미지의 HTTP/파일 SHA는 직접 미검증.
- 직영·자회사·용역 대표 이미지 교체: [PR #265](https://github.com/syjy813/getpasslab/pull/265), [PASS한 시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42727560555), [PASS한 SEO](https://github.com/syjy813/getpasslab/actions/runs/42727560883), [첫 Pages 배포 실패 및 재시도](https://github.com/syjy813/getpasslab/actions/runs/42727982153).
- PR #263 완료: [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), [실서버 HTTP·자산·목록](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-http.json), [실제 PC·모바일 브라우저](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-browser.json).
- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

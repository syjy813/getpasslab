# GetPassLab — 현재 상태 Snapshot

작업 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 기록은 아래 보존 위치에서 필요한 항목만 확인한다.

## 기준 상태

- 마지막 갱신: 2026-11-10 KST · 시설 대표 이미지 타이틀·부제 1차 통일 6장 병합·Pages 배포 성공
- 제품 기준: `main` · [PR #267](https://github.com/syjy813/getpasslab/pull/267) squash 병합 제품 커밋 `1cf43d51eb687d968c764e7e2ca036d88dc2351b`
- 배포 기준: `1cf43d51eb687d968c764e7e2ca036d88dc2351b`; Pages run 42747258907에서 build/deploy 모두 성공. 이후 종료 문서 커밋은 `[skip ci]`를 적용한다.
- 로컬 작업 공간 Git 상태는 조회하지 못했고 원격 PR/CI/Pages 증거를 기준으로 했다.

## 현재 목표

게시 중 시설 대표 이미지 14장을 전수 비교한 뒤 편차가 큰 6장(01 시설관리란, 06 한전FMS, 08 코레일테크, 10 법정선임, 11 기계설비유지관리자 등급, 13 보일러 선임)의 타이틀·부제를 03 「같은 건물, 다른 회사」 정본 구조에 맞춰 1차 통일했다. 1440×1080(4:3), 중앙 정렬, 타이틀 y≈50~178px, 부제 y≈197~257px 기준을 §5.13.11에 추가했다. PR 병합·자동 QA·Pages Build/Deploy를 완료했고, 배포 Artifact의 공개 WebP 6개가 manifest 승인 SHA와 모두 일치함을 확인했다.

## 현재 진행 상태

| 단계 | 상태·근거 |
|---|---|
| 구현 | 완료. 01·06·08·10·11·13 대표 WebP와 PNG 마스터 교체. 캡슐형 부제·불필요한 3번째 설명문 정리. 공개 URL·본문·alt 유지 |
| 규격 | 6장 모두 1440×1080(4:3). 대표 타이틀/부제 정본을 `docs/standards/facility-content-guide-v1.4.md` §5.13.11에 반영 |
| Test / QA | [PR #267](https://github.com/syjy813/getpasslab/pull/267) HEAD `da76e0d655010f45128346efd6da0baa39116c50`의 [시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42743817435) PASS, [SEO](https://github.com/syjy813/getpasslab/actions/runs/42743817780) PASS |
| Git | PR #267 squash 병합 제품 커밋 `1cf43d51eb687d968c764e7e2ca036d88dc2351b` |
| Build / Deploy | [Pages run 42747258907](https://github.com/syjy813/getpasslab/actions/runs/42747258907): commit `1cf43d51`, build/deploy 모두 **success** |
| 배포 Artifact | run 42747258907의 `github-pages` Artifact를 직접 풀어 6개 WebP SHA-256을 manifest와 대조: **6/6 일치**, 실제 치수 **6/6 1440×1080** |
| Production | GitHub Pages 배포 서비스 성공. 공개 CDN WebP 바이트 직접 다운로드와 PC 1440px·모바일 390px 화면 캡처 기반 육안 QA는 현재 도구 제한으로 별도 미실행 |
## 최근 완료 핵심

- [PR #267](https://github.com/syjy813/getpasslab/pull/267): 시설 대표 이미지 14장 전수조사 후 01·06·08·10·11·13 6장의 타이틀·부제 1차 통일. 4:3 규격 유지, §5.13.11 정본 추가, QA PASS, Pages 42747258907 배포 성공. 배포 Artifact 6개 WebP SHA/치수 전부 일치 확인.
- [PR #266](https://github.com/syjy813/getpasslab/pull/266): 직영·자회사·용역 대표 이미지 외곽 흰 여백·라운드 테두리 제거. 동일 공개 URL 유지, 관련 CSS는 해당 대표 이미지에만 예외 적용. 자동 QA PASS, Pages run 42739563616 build/deploy 성공.
- [PR #265](https://github.com/syjy813/getpasslab/pull/265): 직영·자회사·용역 대표 이미지 상단 여백 수정본, PNG 마스터, WebP, manifest·QA 보호 조건 수정. 원격 병합/CI PASS, Pages 재배포 성공(42729771418).
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 4·5·6개 통합 템플릿과 0화 본문 이미지 6→3장 통합, main 병합·Pages 배포·실서버 PC/모바일 및 7파일 해시 확인 완료.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 정리·레거시 원문 보존을 main에 병합하고 Pages 및 후속 QA 확인 완료.
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 설명글 연결 제거, ‘4개의 시설’ 문구, 자료 섹션 비노출, 대표 부제 ‘호병백마는 왜 기피시설로 유명할까?’ 반영. 공개 정본 `src/content/facility/hobyeongbaekma.md`, URL `/facility-management/career/hobyeongbaekma/` 유지.
- 시설 13편 이미지 교체와 Pages 복구는 이전 완료 작업이다. 상세는 [배포 복구 audit](docs/audits/2026-11-06-pages-deploy-recovery/README.md), 현재 개정은 [0화 개정 manifest](docs/audits/2026-11-07-hobyeongbaekma-editorial-revision/manifest.json)에서 추적한다.
- 기존 원고·대표 마스터·발행 manifest·조사 자료는 보존돼 있다. [0화 제작 폴더](docs/drafts/facility/hobyeongbaekma/README.md)의 과거 초안·미배포 설명을 현재 승인·배포 상태로 해석하지 않는다.

## 미완료 / 알려진 문제

- 대표 이미지 14장 중 1차 우선 대상 6장은 통일 완료. **2차 미세 통일 후보는 02·04·05·07·09·12**이며, 14 호병백마 ep.0은 시리즈 전용 톤으로 별도 예외 유지 여부를 판단한다.
- 1차 6장에 대해 Pages 배포 Artifact의 SHA·치수는 검증했지만, 실서버 CDN에서 직접 내려받은 파일 SHA 및 PC 1440px·모바일 390px 화면 캡처 기반 시각 검증은 현재 도구 제한으로 미확인이다.
- 호병백마 1화 원고는 별도 PR #262에 보존돼 있으며 1화 이미지 제작/화면 QA, 2~4화 집필·공개는 미완료다.
- 기존 기록의 컴활 실제 Excel / 과거 Windows 환경 검증, 산업안전 Q-Net 공식 원문·정오표 대조, Search Console·AdSense 계정 상태 등은 이번 작업 범위에서 재검증하지 않았다.
## 다음 행동

1. 1차 6장 병합·배포는 완료했으므로 동일 이미지의 중복 배포는 하지 않는다.
2. 다음 대표 이미지 작업은 2차 후보 02·04·05·07·09·12의 타이틀 크기·부제 형태·상단 위치를 §5.13.11 기준으로 미세 통일한다.
3. 14 호병백마 ep.0은 일반 대표 이미지와 동일화하지 않고 시리즈 고유 톤을 유지하되, 타이틀 블록 위치만 별도 검토한다.
4. 브라우저/HTTP 도구가 허용되는 세션에서는 1차 6장의 공개 CDN SHA와 PC·모바일 육안 QA를 추가로 닫을 수 있다.
## 근거와 과거 기록 보존

- 시설 대표 이미지 1차 통일: [PR #267](https://github.com/syjy813/getpasslab/pull/267), [시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42743817435), [SEO](https://github.com/syjy813/getpasslab/actions/runs/42743817780), [Pages build/deploy success](https://github.com/syjy813/getpasslab/actions/runs/42747258907), 제품 commit `1cf43d51eb687d968c764e7e2ca036d88dc2351b`.
- 최종 외곽 여백·테두리 제거 배포: [PR #266](https://github.com/syjy813/getpasslab/pull/266), [시설 QA](https://github.com/syjy813/getpasslab/actions/runs/42736850031), [SEO](https://github.com/syjy813/getpasslab/actions/runs/42736850025), [Pages build/deploy success](https://github.com/syjy813/getpasslab/actions/runs/42739563616), deploy source `4d45d7a5be979ba04c170f2f2f2cad7e79f01106`.
- 직전 상단 여백 수정 이력: [PR #265](https://github.com/syjy813/getpasslab/pull/265), Pages 42729771418. 이후 PR #266에서 최종 무테두리 버전으로 교체됨.
- PR #263 완료: [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), [실서버 HTTP·자산·목록](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-http.json), [실제 PC·모바일 브라우저](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/production-browser.json).
- 병합·배포·후속 QA 10개·Production 확인: [최종 종료 증거](docs/audits/2026-11-08-operations-docs-v22/closeout.json).
- 이번 정리의 보존 확인·완료 기준·CI 후속 후보: [운영 문서 audit](docs/audits/2026-11-08-operations-docs-v22/README.md), [실행·HTTP·이미지 해시 증거](docs/audits/2026-11-08-operations-docs-v22/evidence.json).
- 정리 전 인계 전체 3,958줄은 [별도 레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 원문 그대로 보존했다. [보존·조회 기준](docs/archives/README.md)을 따르며 현재 작업 시작 시 전체를 자동으로 읽지 않는다. 과거 지시·상태를 현재 사실로 적용하지 않는다.
- 원본 확인: [기준 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md). Git blob `fd8511580a92cf39143f91d31df1f3c3c82febfd`, SHA-256 `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`. 레거시 파일과 원본의 바이트·해시가 일치한다.
- 과거 작업·QA 상세: [docs/audits](docs/audits/), [PR 목록](https://github.com/syjy813/getpasslab/pulls), [Actions](https://github.com/syjy813/getpasslab/actions). Artifact는 보존 기한을 확인하고, 없으면 Git에 남은 근거와 구분한다.
- PR #260 검증 대상 `c5998e863d8bba7fa1c96a97371579708bf0c9d5`: [SEO 42381904454](https://github.com/syjy813/getpasslab/actions/runs/42381904454), [0화 4폭 QA 42381904112](https://github.com/syjy813/getpasslab/actions/runs/42381904112), [시설 QA 42381903841](https://github.com/syjy813/getpasslab/actions/runs/42381903841). 최신 main의 Deploy / Production QA는 위 상태표 참조.

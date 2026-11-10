# GetPassLab — 현재 상태 Snapshot

운영 규칙과 정본 연결은 [AGENTS.md](AGENTS.md). 상세 이력은 관련 PR·Actions·[audit](docs/audits/) 및 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 마지막 갱신: **2026-11-10 KST** · 호병백마 호텔 절망편/희망편 코드 병합 완료, **GitHub Pages 배포 2회 실패 / Production 반영 미확인**
- Branch: `main`
- 최신 제품 변경: [PR #264](https://github.com/syjy813/getpasslab/pull/264) squash 병합, 제품 커밋 `ca7fd0f68533340de0d0aedd6c8489c5eeed51bb`
- 가장 최근 **성공이 증명된** Pages 배포: [run 42806450308](https://github.com/syjy813/getpasslab/actions/runs/42806450308), 제품 커밋 `8c61529b9a2b3e08363667c11cbb3bfdbc9e1d91` (PR #269). 이후 변경된 호텔편은 **배포 성공이 증명되지 않음**.
- 현재 로컬 작업 공간의 Git 상태는 미조회. 원격 GitHub PR·CI·Pages 증거 기준으로 기록함.

## 현재 목표와 범위

기존 사용자 승인 범위는 **호병백마 호텔 ep.1-1 절망편과 ep.1-2 희망편, 승인 썸네일 2장 동시 공개**. 0화 공개 URL·이미지와 일반 시설 대표 이미지 및 기존 자격증 영역을 보호한다.

| 단계 | 현재 상태 / 증거 |
|---|---|
| 구현 | 완료 · 공개 정본 `src/content/facility/hobyeongbaekma-hotel-despair.md`, `hobyeongbaekma-hotel-hope.md`; `status: published`, 발행일 2026-11-10. 두 공개 글은 서로 연결하며 기존 0화도 연결 |
| 이미지 | 완료 · `public/images/facility-series/ep1-1-despair/01-hero.webp` 및 `ep1-2-hope/01-hero.webp`; 승인 1440×1080 WebP 보존 |
| 검증 | PR #264 최종 HEAD `f138f99d116702bb05982197bc58cd390a1af32f`: [호병백마 QA](https://github.com/syjy813/getpasslab/actions/runs/42809365414), [시설 공개/비공개·반응형 QA](https://github.com/syjy813/getpasslab/actions/runs/42809365512), [SEO](https://github.com/syjy813/getpasslab/actions/runs/42809365401), [자격증 탐색](https://github.com/syjy813/getpasslab/actions/runs/42809365411), [소방 회귀](https://github.com/syjy813/getpasslab/actions/runs/42809365404) **모두 PASS** |
| Git | 완료 · PR #264 squash 병합 성공, 제품 커밋 `ca7fd0f6`; 최신 일반 시설 이미지 변경 보존. 예전 단일 호텔편 [PR #262](https://github.com/syjy813/getpasslab/pull/262)는 Draft로 보존하고 병합하지 않음 |
| Pages Build | 성공 · [run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395), 제품 커밋 `ca7fd0f6`, `github-pages` Artifact 생성 |
| Pages Deploy | **실패 · 동일 run 1·2차 시도 모두 600초 타임아웃**. 1차는 `syncing_files` 지속 후 취소. 2차는 `finished_file_sync` 이후 최종 성공 응답 없이 타임아웃·취소. 추가 3차 시도는 실행하지 않음 |
| Production | **미확인** · 신규 두 URL의 실서버 응답/이미지·PC/모바일 육안 QA 미완료. 배포 성공/실서버 공개라고 표현 금지 |

## 대상 URL

- 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-despair/
- 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-hope/
- 기존 0화(보호): https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 최근 완료된 이전 작업

- [PR #269](https://github.com/syjy813/getpasslab/pull/269): 일반 시설 대표 이미지 03 `employment-types` 폰트를 02 `first-job` 정본과 재통일. Pages 배포 성공 [42806450308](https://github.com/syjy813/getpasslab/actions/runs/42806450308). **호병백마 시리즈 대표 이미지에는 별도 톤 적용**.
- [PR #267](https://github.com/syjy813/getpasslab/pull/267), [PR #268](https://github.com/syjy813/getpasslab/pull/268): 일반 시설 대표 이미지 1·2차 타이틀·부제 통일, 각각 CI/Pages/Artifact 검증 완료. [PR #265](https://github.com/syjy813/getpasslab/pull/265)·[PR #266](https://github.com/syjy813/getpasslab/pull/266): 외곽 여백 및 테두리 정리 완료.
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 호병백마 ep.0 본문 이미지 6→3장 통합, Pages 성공 [42479587679](https://github.com/syjy813/getpasslab/actions/runs/42479587679), 당시 실서버 PC/모바일·자산 확인 완료. [종료 증거](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json).
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): ep.0 외부 설명 링크·자료 섹션 제거, '4개의 시설' 문구와 대표 이미지 부제 수정 완료.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 경량화, 이전 인계 원문 별도 보존 완료.

## 미완료 / 알려진 문제

1. **최우선: Pages 배포 문제**. 현재 제품 빌드/CI는 성공했지만 GitHub Pages 게시 서비스 응답이 2회 타임아웃. Pages 런 로그 및 최근 유사 사례를 고려해 무분별한 재시도·소스 변경을 피하고 서비스 상태/배포 대기 상태를 확인한 후 동일 제품 커밋으로 재배포할 것.
2. 신규 2개 공개 URL의 HTTP·본문·메타·이미지 로딩, 관련 카드, ep.0 회귀 및 PC/모바일 실서버 QA 미완료.
3. 호병백마 병원·백화점·마트 등 후속 편 집필·발행 미완료. 기존 호텔 단일편 PR #262를 현재 발행 정본으로 혼동하지 말 것.
4. 일반 시설 대표 이미지 일부의 CDN 직접 SHA·실기기/Safari 캡처 기반 육안 QA, 기존 다른 자격증 검증 과제는 현재 범위 밖이며 이전 기록 참조.

## 다음 행동

1. [Pages run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395) 실패 로그와 GitHub Pages 상태 확인. 동기화 문제 회복 시 **동일 제품 `ca7fd0f6`** 재배포; 이미 통과한 PR CI·산출물은 동일성 검토 후 재사용. 반복 실패 중 무리한 리트라이/미요청 소스 변경 금지.
2. Pages `build/deploy success` 확인 후 신규 두 URL의 실서버 HTML·이미지/대표 카드·내부 연결·canonical·Article·사이트맵 및 ep.0 회귀를 확인, 가능한 PC/모바일 QA 수행.
3. 성공한 배포 커밋·실서버 검증 증거로 이 Snapshot을 교체 갱신.

## 근거

- 호텔편 [PR #264](https://github.com/syjy813/getpasslab/pull/264), [개별 audit](docs/audits/2026-11-10-hotel-two-parter/README.md), [manifest](docs/audits/2026-11-10-hotel-two-parter/manifest.json).
- [Pages Build 성공 / Deploy 2회 실패 run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395), 제품 `ca7fd0f6`. 실패 Job 로그: 1차 `syncing_files`→600초 timeout; 2차 `finished_file_sync`→600초 timeout.
- 이전 성공 배포 [42806450308](https://github.com/syjy813/getpasslab/actions/runs/42806450308), 이전 이미지 통합 [closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json).
- 2026-11-08 이전 전체 인계 기록 [레거시 파일](docs/archives/AI_HANDOVER.legacy-2026-11-08.md). 상세 이력·승인·기준은 Git PR, audit, 원본 파일을 정본으로 활용한다.

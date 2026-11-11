# GetPassLab — 현재 상태 Snapshot

실행 규칙·정본 라우터는 [AGENTS.md](AGENTS.md). 과거 상세 작업과 검증은 관련 PR·GitHub Actions·[audit](docs/audits/)에 보존하며, 전체 과거 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에서 필요한 부분만 확인한다.

## 기준 상태

- 마지막 갱신: **2026-11-11 KST** · 호병백마 ep.1-1 호텔 절망편·ep.1-2 희망편 **GitHub Pages 배포 성공**. 외부 실서버 직접 HTTP/브라우저 QA는 도구 접근 제한으로 아직 미확인.
- 제품 정본: `main`, [PR #264](https://github.com/syjy813/getpasslab/pull/264) squash 병합 커밋 **`ca7fd0f68533340de0d0aedd6c8489c5eeed51bb`**.
- 배포 정본: [GitHub Pages run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395) **Attempt 4**, 배포 제품 커밋 `ca7fd0f6`. Build / Deploy 모두 `completed/success`. Deploy job `130217773585`의 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인. 기존 Attempt 1~3는 시간 초과 실패 기록으로 남는다.
- 운영 문서 갱신은 `[skip ci]`로 별도 반영하고 제품 배포 실행을 다시 발생시키지 않는다. 로컬 작업 공간의 미커밋 파일은 조회하지 않았으며 원격 GitHub 증거 기준이다.

## 현재 목표와 배포 상태

사용자 승인 범위: **호텔 시설관리 2부작(절망편·희망편)과 승인 썸네일 2장 동시 공개**. ep.0, 일반 시설 이미지 및 기존 자격증 영역 보존.

| 단계 | 상태와 기준 |
|---|---|
| 구현·원고 | 완료 · `src/content/facility/hobyeongbaekma-hotel-{despair,hope}.md`, `status: published`, `publishedAt: 2026-11-10`. 양쪽 본문·관련 카드 간 상호 링크 |
| 이미지 | 완료 · `public/images/facility-series/ep1-1-despair/01-hero.webp`, `ep1-2-hope/01-hero.webp` 1440×1080 승인 파일 |
| PR/CI | [호병백마 QA 42809365414](https://github.com/syjy813/getpasslab/actions/runs/42809365414), [시설 공개·비공개 반응형 42809365512](https://github.com/syjy813/getpasslab/actions/runs/42809365512), [SEO 42809365401](https://github.com/syjy813/getpasslab/actions/runs/42809365401), [자격증 탐색 42809365411](https://github.com/syjy813/getpasslab/actions/runs/42809365411), [소방 회귀 42809365404](https://github.com/syjy813/getpasslab/actions/runs/42809365404) **모두 PASS** · 검증 HEAD `f138f99d` |
| Git | [PR #264](https://github.com/syjy813/getpasslab/pull/264) 병합 완료. 이전 단일 호텔 원고 [PR #262](https://github.com/syjy813/getpasslab/pull/262)는 Draft 보존·미병합 |
| Build / Deploy | **성공** · [run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395), Attempt 4, 빌드 Artifact `github-pages` ID `13761658524`, 제품 커밋 `ca7fd0f6`. GitHub Pages `Reported success!` |
| 배포 Artifact 점검 | **PASS** · 실제 ZIP 내부 `artifact.tar` 검사: 두 HTML·대표 WebP·기존 0화·취업 목록·사이트맵 존재. 두 글의 자기 canonical·Article JSON-LD·상호 링크 및 목록 링크·사이트맵 등록 확인. WebP SHA-256: 절망편 `a24b84158073819980e10e16a9ea2a752f049374803e1b80099d20b3983795a2`, 희망편 `8d967c8ded87d05b689481d822752d9a490162efe30d655fd874b7e2ad356a09`, 승인 해시 일치 |
| Production | **배포 서비스 성공 확인 / 직접 실서버 콘텐츠 QA 미확인** · 외부 HTTP 도구에서 GetPassLab URL을 직접 열 수 없어 200/이미지 CDN 파일 SHA·PC/모바일 실제 화면·캐시 제거 검증은 수행하지 못함. Artifact 검증을 실서버 브라우저 확인으로 대체하여 PASS 선언하지 않음 |

## 대상 공개 URL

- 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-despair/
- 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-hope/
- 기존 0화: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 최근 완료 핵심

- [PR #264](https://github.com/syjy813/getpasslab/pull/264): 호텔 절망편·희망편 원고·대표 이미지·상호 링크·공개 검사 추가, 기존 일반 시설 이미지 보호. 이전 Pages 1~3차는 600초 타임아웃(1차 `syncing_files`, 2차 `finished_file_sync`, 3차 빈 상태 응답), **2026-11-11 KST 4차 배포 성공**. 제품 파일은 재수정하지 않음.
- [PR #269](https://github.com/syjy813/getpasslab/pull/269): 일반 시설 대표 03 `employment-types`를 02 `first-job` 폰트 정본에 맞춰 통일. 직전 성공 Pages [42806450308](https://github.com/syjy813/getpasslab/actions/runs/42806450308). 호병백마는 별도 시리즈 톤 예외 유지.
- [PR #267](https://github.com/syjy813/getpasslab/pull/267)·[PR #268](https://github.com/syjy813/getpasslab/pull/268): 일반 시설 대표 이미지 1·2차 통일. [PR #265](https://github.com/syjy813/getpasslab/pull/265)·[PR #266](https://github.com/syjy813/getpasslab/pull/266): 외곽 여백·테두리 개선.
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): 호병백마 0화 본문 이미지 6→3장 통합, 배포 및 당시 PC·모바일 Production 점검 완료([closeout](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json)).
- [PR #260](https://github.com/syjy813/getpasslab/pull/260): 0화 외부 설명 링크·자료 섹션 제거, '4개의 시설' 문구와 대표 부제 확정.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 경량화·레거시 보존.

## 미완료 / 알려진 문제

1. **새로 배포된 호텔 2개 URL의 실서버 HTTP·본문·이미지 CDN SHA·관련 목록 카드·ep.0 회귀·PC/모바일 육안 QA 미확인**. 현재 도구는 해당 사이트 직접 접근이 제한됨. GitHub Pages 배포 성공과 별개로 검증 필요.
2. 호병백마 병원·백화점·마트 등 후속 편 집필·발행 미완료. 예전 단일 호텔편 PR #262는 현재 공개 원고가 아님.
3. 일반 시설 대표 이미지 일부의 실제 CDN SHA 및 실기기/Safari 캡처 기반 QA는 현재 범위에서 미검증. 과거 자격증·SEO/AdSense 계정 관련 과제도 이번 배포로 재검증한 것은 아님.

## 다음 행동

1. 직접 HTTP·브라우저 접근 가능한 실행 환경에서 위 호텔 2개 URL과 ep.0 및 목록을 요청하여 응답 200, 제목·대표 이미지·경로·상호 링크, canonical/Article, 사이트맵, 실제 390px/PC 화면·가로넘침·이미지 표기를 확인한다. CDN WebP SHA가 승인 파일과 일치하는지도 확인한다.
2. Production 추가 QA 결과가 확인되면 동일 제품 커밋 및 해당 증거와 연결해 이 Snapshot을 교체 갱신한다.
3. 그다음 호병백마 병원편 등 후속 시리즈 작업으로 진행한다.

## 근거

- 호텔 2부작 [PR #264](https://github.com/syjy813/getpasslab/pull/264), [작업 audit](docs/audits/2026-11-10-hotel-two-parter/README.md), [manifest](docs/audits/2026-11-10-hotel-two-parter/manifest.json).
- [Pages 42810573395 Attempt 4 성공](https://github.com/syjy813/getpasslab/actions/runs/42810573395), Deploy job `130217773585`, `Reported success!` 및 `getpasslab.co.kr` URL 확인. 배포 Artifact 실물 HTML/자산 해시 검사 결과 위 상태표에 기록.
- 과거 ep.0 [배포 검증](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/closeout.json), 운영 문서 [레거시](docs/archives/AI_HANDOVER.legacy-2026-11-08.md).

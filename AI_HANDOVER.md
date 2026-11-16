# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 현재 작업 — GA4 시설관리 게시글 조회수 적재·정렬

- 갱신: **2026-11-15 KST**. 작업 브랜치 `chore/ga4-auth-connection`, [PR #278](https://github.com/syjy813/getpasslab/pull/278). 인증 완료 체크포인트부터 누적 조회수 적재와 카테고리 목록 정렬까지 이어서 구현했다.
- 인증: Google Cloud **결제 계정 미연결**, 키 없는 WIF 인증, 300초 `analytics.readonly` 토큰, GA4 Viewer 권한 제한 유지. [run 43697865632](https://github.com/syjy813/getpasslab/actions/runs/43697865632) 인증 성공을 재사용.
- 적재: [run 43705923328](https://github.com/syjy813/getpasslab/actions/runs/43705923328) **completed/success**. 공개 글 **24개 중 9개 기록 확인, 누적 48회**, 나머지 15개는 조회 기록 없음. 기간 **2026-07-30~2026-11-14**, 속성 시간대 `Asia/Seoul`. 전체 사이트 5,441회와 구분.
- 데이터: `src/data/facility-page-views.json`. 전체 페이지네이션, 발행글 canonical 경로 매칭, 누적값 교체, 불완전한 API 응답 차단, 실패 시 이전 JSON 유지. GitHub API는 해당 JSON 1개만 커밋. [데이터 커밋 8ab1e2b](https://github.com/syjy813/getpasslab/commit/8ab1e2b586303adb19959c51722a7a529d6b3de4).
- 화면: 카테고리 목록에 `최신순`/`조회수순`, 조회 기록 및 기준일 표시 적용. 기존 공개 URL·공통 카드 소스·이미지·본문 보호. 구현 [커밋 e7aded6](https://github.com/syjy813/getpasslab/commit/e7aded63a2528954b07785b7d6a4cb5e7f72978c).
- 검증: 로컬 584페이지 Build PASS, 시설관리 기존 소스/게시 가드 PASS, SEO 오류0·기존 경고5, 공개 콘텐츠 오류0. GitHub Actions [run 43707356332](https://github.com/syjy813/getpasslab/actions/runs/43707356332) **정렬 UI 4폭(320/390/768/1440px)×4카테고리 Chromium PASS**, GA4 인증·API·적재 PASS. [시설 발행 QA](https://github.com/syjy813/getpasslab/actions/runs/43707361018), [자격증 탐색 QA](https://github.com/syjy813/getpasslab/actions/runs/43707361014), [모바일 광고 QA](https://github.com/syjy813/getpasslab/actions/runs/43707360986) 전부 PASS. main 변경과 병합해 PR 충돌 해결.
- 자동화: main 병합 후 매일 02:13 UTC(11:13 KST) 갱신 예정. 스냅샷이 변경된 경우 기존 `deploy.yml`에 `workflow_dispatch`하여 GitHub Token 커밋으로는 실행되지 않는 Pages `push` 배포를 보완. PR `push` 시 적재 검증만 하고 자동 데이터 커밋으로 PR HEAD를 이동시키지 않음. **main 병합·Pages 배포·Production QA 미수행**, 별도 사용자 배포 승인 필요.
- 다음: 자동 배포 연결 변경에 대한 최종 CI 확인 후 사용자 배포 승인 시 main 병합/Pages/Production 확인. 인증/IAM 재설정 불필요. [기존 인증 상세 Audit](docs/audits/2026-11-15-ga4-auth/README.md).

## 기준 상태

- 갱신: **2026-11-15 KST**. 승인한 모바일 피드 수정·실서버 배포·Production 확인 **완료**.
- 제품 `main@398923fdc04920181a96dc67f9e7a0f7185b9566`, [PR #280](https://github.com/syjy813/getpasslab/pull/280) squash 병합.
- 검증 HEAD `1e68b02affc6aa4b5ddae222b673f40ce29cfc0e`와 병합 제품의 Git tree 동일 (`e86c4818260d160b8c6637ce421c60383ffd0ccf`). 후속 `[skip ci]` 기록 커밋은 제품·설정을 바꾸지 않는다.
- [Pages run 43726251784](https://github.com/syjy813/getpasslab/actions/runs/43726251784) Build/Deploy success, artifact `14165824327`, digest `sha256:a62b0f0c7afd128b3503eb97ddce748bc8a8b8b56d7288aa544ffd51782e84e0`.

## 현행 목록

- 홈·카테고리·관련 글의 모바일 일반 목록: **왼쪽 원본 비율 썸네일·오른쪽 전체 제목**, 요약 숨김. 뱃지·작성 날짜 제거 유지.
- 360px 미만 썸네일 88px/간격 16px, 그 이상 96px/20px. 제목 16px/600/1.5. 상하 28px·최소 높이 128px·항목 구분선·목록 행 간격 0.
- PC·홈 대표 카드, 상세 원고/날짜/분류·URL·원본 이미지·SEO 메타는 보존. [시설 가이드](docs/standards/facility-content-guide-v1.4.md) §4.4 정합성 갱신.
- 최초 390px 검사에서 미정의 간격 변수를 발견해 20px로 수정. PC 요약 검사는 Chromium의 display 정규화 차이를 반영해 실제 표시 크기를 확인한다.

## 검증·배포

- Build 584페이지 PASS. SEO 오류 0/기존 경고 5, 공개 콘텐츠 오류 0, 시설 발행/내부 링크 163개/통합 이미지 보호 PASS.
- 생성 HTML 586개는 시설 CSS 파일명만 정규화하면 기준 `ea67d199` 빌드와 동일. 목록 28페이지·134카드 내용/링크/이미지 보존.
- [시설 CI 43725736766](https://github.com/syjy813/getpasslab/actions/runs/43725736766): 공개/비공개 각 64케이스·본문 각 32케이스 PASS, 320·390·768·1440px. 390px 목록과 1440px PC 캡처 시각 검토 완료. Artifact `14166995205`.
- SEO `43725736773`·자격증 탐색 `43725736822` PASS. 소방은 성공한 이번 작업 run `43724972188` (`ebf69e53`) 결과 재사용: 이후에는 시설 QA 스크립트와 시설 모바일 CSS 간격만 달라졌고 소방 소스/설정/의존성/생성 HTML은 같다. 중복 최신 소방 run `43725736888`은 배포 시 진행 중으로 별도 구분한다.
- Production 7경로·48카드 내용/링크/메타, CSS 3개·썸네일 2개 바이트 일치. 실서버 확인은 HTTP/HTML/CSS/이미지 대조이며 Production 브라우저 캡처를 수행한 것으로 확대하지 않는다.
- [작업·검증 정본](docs/audits/2026-11-15-facility-feed/README.md), [최종 검증](docs/audits/2026-11-15-facility-feed/validation.json), [Production](docs/audits/2026-11-15-facility-feed/production-validation.json). 이전 목록 배포 근거는 [이전 기록](docs/audits/2026-11-15-facility-list-layout/README.md)에 보존.
- **이번 요청 범위 미완료 없음.** 재개 시 제품 변경이 없다면 위 증거를 재사용한다.

## 기존 후속 사항

- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

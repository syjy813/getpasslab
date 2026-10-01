# [WEB 전달용 작업 결과서] 컴활 1~81 Production 반영

- 2026-10-01 사용자 승인: 실서버 배포 후 PC·모바일 QA 진행. 이전 배포 금지 조건은 이 요청으로 변경됨.
- 배포 전 main / 복구 기준: `6b65cdf1b60b6de5e86671426e493912865555ab`
- 작업 branch: `codex/computer-literacy-001-081-local`
- 최신 main의 모바일 GNB 여백 수정 보존. 기존 에너지 작업의 미커밋 2파일은 별도 원본 worktree에 그대로 유지.
- 범위: 컴퓨터일반 81개, 신규 파일 50개, 기존 공개 31개 보존. 정본 문제 70개 및 원본 PNG 4개 추가.
- 원본 이미지 유지형 적용: 학습 이미지 디자인 시스템 v1.2의 원본 우선·비율·alt·모바일 표시 확인 기준 적용. 원본 이미지 재제작/변형 없음.
- PC 및 390px 실화면 QA: 배포 전 미완료. 배포 후 관찰한 결과만 기록할 것.
- 최신 main 통합 후 Build 345페이지 성공. 검증 스크립트 7종 전부 PASS (`release-tests.json`).
- 기존 에너지 미커밋 2파일 상태 및 SHA-256 보존 확인.
- 진행 중: Commit/Push/PR CI/Deploy. Production 실화면 QA 결과는 배포 후 별도 갱신.

## 2026-10-01 배포 승인 검토 차단

- 로컬 commit: `7182569` (85 files, 17138 insertions, 16 deletions)
- `git push -u origin codex/computer-literacy-001-081-local` 자동 승인 검토 거절: 이전 명시적 Push 금지와 비교해 최신 메시지가 배포 순서에 대한 모호한 동의이며, 해당 브랜치 Push의 구체적 승인이 아니라고 판정함.
- 우회 실행하지 않음. Push / PR 생성 / main 병합 / Deploy 미실행. 실서버 변경 없음.
- 공개 과목 URL 접근 성공: https://getpasslab.co.kr/computer-literacy/written/computer-basics/ — 기존 31개 표시. 이번 81개 배포 결과가 아님.
- 신규 콘텐츠 PC 실화면·390px 모바일 QA 미실행. 제공 브라우저 API에 viewport 설정 기능이 없어 390px 검증 가능 여부도 아직 해소되지 않음.
- 최종 diff: 콘텐츠 커밋 후 작업 트리의 결과서 1파일만 후속 수정. 기존 원본 worktree의 에너지 2파일 보존.
- 커밋 diff의 공백 경고는 원본 초안/로그 및 Markdown 강제 줄바꿈(2칸) 4곳. 본문·원본 해시 보존을 위해 임의 삭제하지 않음.
- 다음 필요 승인: `syjy813/getpasslab`의 작업 브랜치 Push, PR 검증 후 main 병합 및 GitHub Pages Production 배포.

## 2026-10-01 10:44 KST 명시 승인 후 재개

- 사용자가 작업 브랜치 Push → PR 검증 → main 병합·실서버 배포 요청에 “승인, 작업 진행해줘”로 명시 승인함.
- origin/main 재확인: `6b65cdf1b60b6de5e86671426e493912865555ab`, 추가 변경 없음. 기존 Build/7종 Test 검증 대상 코드 유지.

# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 사용자 승인: 모바일 목록을 왼쪽 썸네일·오른쪽 제목으로 수정 후 **실서버 배포**.
- 작업 브랜치: `feat/facility-feed-list`. 기준 제품 `main@ea67d199ab0839a2fb569a66aff2df172da4194e` (PR #279).
- 직전 배포 완료·Production 증거는 [목록 변경 기록](docs/audits/2026-11-15-facility-list-layout/README.md)에 보존. 직전 배포의 미커밋 상태 기록도 이번 PR에 함께 보존한다.

## 현재 작업: 모바일 피드

- 구현 완료: 공통 목록 모바일 일반 카드의 좌측 원본 비율 썸네일·우측 전체 제목, 요약 숨김, 상하 28px·최소 높이 128px·항목 구분선. 목록 뱃지·날짜 제거 유지.
- PC·홈 대표 카드와 본문·식별자·URL·이미지·SEO 메타는 보존. [현행 기준](docs/standards/facility-content-guide-v1.4.md) §4.4 갱신.
- Build PASS (584페이지), SEO 오류 0/기존 경고 5, 공개 콘텐츠 오류 0, 시설 발행/기존 링크 163개/통합 이미지 보호 PASS.
- 생성 HTML 586개는 CSS 파일명만 정규화하면 기준 빌드와 동일. 28페이지·134카드의 내용/링크/이미지 보존. [내용 비교](docs/audits/2026-11-15-facility-feed/content-validation.json).
- 화면 CI·Commit/Push·PR·Deploy·Production은 **진행 전**. 다음: 커밋·PR → 공개/비공개 320·390·768·1440px CI 확인 → 병합·Pages 배포 → Production 대조.
- [작업·검증 기록](docs/audits/2026-11-15-facility-feed/README.md). 이전 불변 검사에는 이번 승인 CSS 델타만 복원해 연결한다.

## 기존 후속 사항

- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

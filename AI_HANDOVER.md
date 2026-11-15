# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-15 KST**. 승인된 모바일 커뮤니티 목록 배치 일괄 적용·해당 범위 검증 완료, 배포 대기.
- 작업 브랜치: `feat/facility-mobile-list-layout`, 검증 HEAD `871c51d8ba3f1f8d651c4bb3a3244bf9c632e059`. [PR #279](https://github.com/syjy813/getpasslab/pull/279), 기준 `main@5bca56b9370683b13b58503cb1f20fcb1bb350a8`.
- Production은 사수골대 ep.0 제품 `40a4b722`의 기존 배포 상태다. 이번 목록 변경은 **배포하지 않음**. main 병합·Production 배포는 별도 배포 요청 후 진행한다.

## 목록 레이아웃 변경

- 구현 **완료**: 홈·카테고리·관련 글의 공통 `FacilityCard`에서 카테고리 뱃지와 작성 날짜 제거. 상세 글의 날짜·분류·JSON-LD·공개 URL·원고·이미지는 보존.
- 모바일 일반 이미지 카드: 제목 전체 너비 → 썸네일 약 34%·요약 나란히 중앙 정렬. 제목 전문, 원본 이미지 비율, 최대 3줄 요약.
- 640px 이상과 홈 대표 카드·이미지 없는 카드의 별도 배치는 유지. 비공개 미리보기의 초안 표시는 보존.
- `docs/standards/facility-content-guide-v1.4.md` §4.4에 현행 목록 기준 반영.
- 과거 불변 소스·이미지 검사를 해제하지 않고, [정확한 소스/CSS 델타](docs/audits/2026-11-15-facility-list-layout/delta.json)를 복원해 기존 검증에 연결.

## 검증·Git 상태

| 단계 | 상태 |
|---|---|
| Build | **PASS** · Node 24, `npm ci` 후 584페이지 |
| SEO / 공개 콘텐츠 | **PASS** · SEO 오류 0·기존 경고 5, 공개 콘텐츠 오류 0 |
| 기존 보호·발행 검사 | **PASS** · 시설 source/asset 보호, 기존 시설 발행, 호병백마·호텔·병원·백화점·마트, 관련 링크 163개·상세 날짜/canonical |
| 화면 검사 | **PASS** · 320·390·768·1440px, 시설 공개/비공개 각 64케이스. 목록 배지/날짜 제거·제목 전체 폭·이미지/요약 정렬·원본 비율·기존 탐색 검사. [시설 QA run](https://github.com/syjy813/getpasslab/actions/runs/43722550514) |
| Commit / Push / PR | **완료** · PR #279, 검증 HEAD `871c51d8`. 이후 문서 전용 상태 기록은 `[skip ci]`로 저장하며 제품 소스·설정은 동일 |
| Deploy / Production | 이번 변경 미실행 |

## 다음 행동·기존 후속 사항

- **요청한 목록 변경 범위 미완료 없음.** 시설 공개/비공개·SEO·사수골대·호병백마·자격증 탐색 CI 성공(5 workflow·6 job). 추가 소방 공통 회귀 run `43722550533`은 기록 시 진행 중이며 성공으로 간주하지 않는다. 배포 요청 시 해당 실행의 최종 상태를 먼저 확인한다.
- [검증 근거](docs/audits/2026-11-15-facility-list-layout/validation.json). 28페이지·134카드의 제목/이미지/목적지 일치. 실제 390px 목록·1440px 홈 캡처 시각 검토 완료. 캡처 HEAD `fc817719`와 검증 HEAD는 제품·설정이 같고 과거 이미지 CSS 검사 파일만 다름.
- 사용자가 배포를 요청하면 PR #279의 최신 상태·충돌 여부 확인 후 병합·배포·Production 확인부터 재개한다.
- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

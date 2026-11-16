# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업은 Git·PR·[audits](docs/audits/), 이전 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 기준 상태

- 갱신: **2026-11-16 KST**. 현재 목표는 커뮤니티 운영 이론 조사·가이드 구축·지침 연결. 문서 제안이며 기능·IA·Production 변경 없음.
- 기준 `main@cfeeeb8a87ce494630e7e69fd9a50190318ceb8b` ([PR #281](https://github.com/syjy813/getpasslab/pull/281) 포함). 이전 Snapshot의 #280 제품·QA 결과와 구분한다.
- 작업 브랜치: `docs/community-operation-guide-v1-20261116`. 이 Snapshot을 포함한 문서 Commit이 대상이며 정확한 HEAD·Push·PR·CI 상태는 실제 Git·PR 증거로 확인한다.

## 현재 작업 — 커뮤니티 운영 가이드

- [운영 가이드 v1](docs/standards/community-operation-guide-v1.md) 작성: 기존 구조·관련 정본 조사, 6개 이론·11개 출처, 연구/추론/현지 데이터 분리, A/B/C 원칙·의사결정·지표·실험 후보.
- `AGENTS.md` 라우터 1행 및 시설 가이드 §12 상호 연결. 기존 집필·이미지·SEO·URL·승인 규칙 유지.
- main의 운영자 발행형 구조: 공개 24편/초안 1편, 카테고리 4개. 5개 IA [PR #282](https://github.com/syjy813/getpasslab/pull/282)와 GA4 조회수·정렬 [PR #278](https://github.com/syjy813/getpasslab/pull/278)는 조사 시 미병합. 이번 문서에서 구현·배포 완료로 취급하지 않는다.
- 문서 검증: 출처·수치·비지지 결과·한계 대조, Markdown 링크·참고문헌 대응·변경 범위 확인. 제품 소스·의존성·CI 변경 없음. 로컬 Build·브라우저 QA는 문서 변경 범위상 미실행. PR의 기존 SEO CI가 실행되면 그 결과를 별도로 확인한다.
- 다음 행동: PR에서 문서 검토. 사용자 별도 승인 전 **main 병합·Production 배포 금지**. 총 지침 추가 문구는 운영 가이드 §9.1에 제공하며 프로젝트 설정을 직접 수정한 것으로 보고하지 않는다.
- 재개 시 이 브랜치의 최신 HEAD·diff·PR CI부터 확인한다. 현행/미병합 상태가 달라지면 운영 가이드 §1.1과 관련 부분만 갱신한다.

## 직전 제품 상태 — 모바일 피드

- 홈·카테고리·관련 글의 모바일 일반 목록: **왼쪽 원본 비율 썸네일·오른쪽 전체 제목**, 요약 숨김. 뱃지·작성 날짜 제거 유지.
- 360px 미만 썸네일 88px/간격 16px, 그 이상 96px/20px. 제목 16px/600/1.5. 상하 28px·최소 높이 128px·항목 구분선·목록 행 간격 0.
- PC·홈 대표 카드, 상세 원고/날짜/분류·URL·원본 이미지·SEO 메타는 보존. [시설 가이드](docs/standards/facility-content-guide-v1.4.md) §4.4 정합성 갱신.
- 최초 390px 검사에서 미정의 간격 변수를 발견해 20px로 수정. PC 요약 검사는 Chromium의 display 정규화 차이를 반영해 실제 표시 크기를 확인한다.

## 직전 모바일 피드 검증·배포 — 과거 증거

- 아래는 이번 문서 변경의 신규 검증이 아니다. 제품 `398923fd` ([PR #280](https://github.com/syjy813/getpasslab/pull/280))와 검증 HEAD `1e68b02a`의 제품 tree 동일성은 당시 기록이다. 이후 main 전체에 동일하다고 확대하지 않는다.
- [Pages run 43726251784](https://github.com/syjy813/getpasslab/actions/runs/43726251784) 당시 Build/Deploy success, artifact `14165824327`, digest `sha256:a62b0f0c7afd128b3503eb97ddce748bc8a8b8b56d7288aa544ffd51782e84e0`.

- Build 584페이지 PASS. SEO 오류 0/기존 경고 5, 공개 콘텐츠 오류 0, 시설 발행/내부 링크 163개/통합 이미지 보호 PASS.
- 생성 HTML 586개는 시설 CSS 파일명만 정규화하면 기준 `ea67d199` 빌드와 동일. 목록 28페이지·134카드 내용/링크/이미지 보존.
- [시설 CI 43725736766](https://github.com/syjy813/getpasslab/actions/runs/43725736766): 공개/비공개 각 64케이스·본문 각 32케이스 PASS, 320·390·768·1440px. 390px 목록과 1440px PC 캡처 시각 검토 완료. Artifact `14166995205`.
- SEO `43725736773`·자격증 탐색 `43725736822` PASS. 소방은 성공한 이번 작업 run `43724972188` (`ebf69e53`) 결과 재사용: 이후에는 시설 QA 스크립트와 시설 모바일 CSS 간격만 달라졌고 소방 소스/설정/의존성/생성 HTML은 같다. 중복 최신 소방 run `43725736888`은 배포 시 진행 중으로 별도 구분한다.
- Production 7경로·48카드 내용/링크/메타, CSS 3개·썸네일 2개 바이트 일치. 실서버 확인은 HTTP/HTML/CSS/이미지 대조이며 Production 브라우저 캡처를 수행한 것으로 확대하지 않는다.
- [작업·검증 정본](docs/audits/2026-11-15-facility-feed/README.md), [최종 검증](docs/audits/2026-11-15-facility-feed/validation.json), [Production](docs/audits/2026-11-15-facility-feed/production-validation.json). 이전 목록 배포 근거는 [이전 기록](docs/audits/2026-11-15-facility-list-layout/README.md)에 보존.
- 직전 모바일 피드 요청은 완료 기록을 유지한다. 이번 문서 변경의 Build·CI·Production 확인 결과로 재사용하지 않는다.

## 기존 후속 사항

- 사수골대 ep.0 원고·배포는 이전 완료 상태를 유지한다. [이전 완료 기록](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [PR #277](https://github.com/syjy813/getpasslab/pull/277), [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589). 이전 상세 Snapshot은 기준 커밋 `5bca56b9`에 보존.
- 사수골대 사전 자료 수집은 **부분 완료**. 핵심 후보 71건은 독립 근무후기 71건이 아니다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본.
- 사우나 후속편 집필·배포는 이번 목록 UI 작업 범위에 포함하지 않는다.

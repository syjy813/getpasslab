# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 이 Snapshot 이전의 상세 제품/배포 기록은 [이전 인계 보존본](docs/audits/2026-11-15-ga4-auth/previous-handover.md)에 보존한다.

## 기준과 목표

- 갱신: **2026-11-15 KST** · GA4 GitHub 인증 연결 준비.
- 작업 기준 원격 `main`: `281264eefaa894de4f71392107765cef27e5044f`.
- 작업 브랜치: `chore/ga4-auth-connection`. 기존 제품/공개 URL·콘텐츠·배포 설정은 변경하지 않음.
- 목표: GA4 누적 게시글 조회수의 GitHub 적재·정렬에 앞서, GitHub Actions 인증과 읽기 전용 API 호출 검증.
- 이번 범위: 인증/호출 테스트 준비. 실제 조회수 적재·목록 정렬·정기 실행·Production 배포는 아직 수행하지 않음.

## 현재 상태

| 단계 | 상태 |
|---|---|
| GA4 데이터 확인 | 완료 · 속성 `547805075`, 가장 이른 기록 2026-07-30. 2026-11-14까지 전체 속성 5,886회·428개 페이지 경로를 UI에서 확인. 홈/목록 포함이며 게시글 전용 합계가 아님 |
| Cloud 프로젝트 | 완료 · `level-array-514808-v0`, 번호 `528916134663`. 결제 계정 미연결 확인 |
| Analytics Data API | 활성화 완료 |
| 조회 전용 서비스 계정 | 생성 완료 · `getpasslab-ga4-reader@level-array-514808-v0.iam.gserviceaccount.com`. 키 생성 없음 |
| GA4 권한 | 사용자 확인 후 적용 완료 · Viewer, 비용·수익 측정항목 접근 제한 |
| GitHub 인증 코드 | 구현 완료 · WIF 단기 토큰, analytics.readonly, 실제 호출은 `GA4_WIF_ENABLED=true`일 때만 실행 |
| Google WIF/IAM 연결 | **대기** · 전용 저장소·소유자 숫자 ID, 지정 브랜치·워크플로 조건을 준비. 외부 실행기에 인증 접근을 부여하는 최종 적용 전 사용자 확인 필요 |
| 로컬 검사 | PASS · 스크립트 문법, 7개 fixture 검사, YAML/권한 경계 검증. 실제 API 결과와 구분 |
| 실제 API 호출 | 미실행 · WIF/IAM 연결과 GitHub 변수 활성화 후 실행 필요 |
| Push / CI | 작업 브랜치 반영/검증 상태는 PR·Actions 및 [체크포인트](docs/audits/2026-11-15-ga4-auth/README.md)로 확인 |
| Merge / Deploy / Production | 미수행 · 기존 사이트 제품 소스 변경 없음. 기존 Production 최신 배포는 이번 작업에서 재검증하지 않음 |

## 다음 행동

1. 결제 계정 없이 필수 인증 API 활성화를 확인한다. 결제 연결이 요구되면 중단·보고한다.
2. 준비된 WIF와 서비스 계정 impersonation 적용을 사용자에게 구체적으로 확인받는다. 전체 Cloud/관리자 권한이나 서비스 계정 키는 부여하지 않는다.
3. 승인 후 적용·정책 확인 → `GA4_WIF_ENABLED=true` → 작업 브랜치 인증 테스트 실행 및 실제 run 증거 기록.
4. 인증이 성공하면 URL별 누적 조회수 전체 수집·매칭·적재를 다음 단계로 구현한다. 현재 테스트는 페이지 경로 1개만 요청하는 인증 확인용이다.

## 근거

- [이번 인증 구성·검증 체크포인트](docs/audits/2026-11-15-ga4-auth/README.md)
- [이전 제품/배포 인계 보존본](docs/audits/2026-11-15-ga4-auth/previous-handover.md)
- GA4 권한은 속성 액세스 관리 목록에서 서비스 계정 Viewer 및 비용·수익 제한을 직접 확인.

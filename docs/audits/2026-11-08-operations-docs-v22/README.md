# 운영 문서 v2.2 정합성 정리

## 대상과 기준

- 사용자 요청: CHAT / WORK 운영에 맞춘 공통 실행 규칙·현재 Snapshot 분리. CI 구조·제품 코드는 제외.
- 기준 `main` / HEAD: `68708f825ba58795a189b900d40fe0d913e5c83d` (PR #260). 시작 `git status --porcelain=v1` 출력 없음. 새 작업 브랜치 `codex/operations-docs-v22-20261108` 사용.
- 변경: `AGENTS.md`, `AI_HANDOVER.md`, 이 audit의 README와 `evidence.json`만 해당한다.
- 문서 계층의 실행 기준은 사용자 제공 프로젝트 총 지침 v2.2다. 오래된 다른 문서의 전부 읽기·과거 운영 환경 지시는 현재 AGENTS의 범위별 조회·재사용 규칙을 우선 적용한다. 다른 정본 가이드의 세부 내용은 이번에 수정하지 않았다.

## 과거 정보 보존 확인

정리 전에 기준 커밋의 인계 blob과 로컬 파일이 일치함을 확인했다. 원문 전체는 [고정 커밋의 AI_HANDOVER.md](https://github.com/syjy813/getpasslab/blob/68708f825ba58795a189b900d40fe0d913e5c83d/AI_HANDOVER.md)에 남는다. 복원 명령:

```sh
git show 68708f825ba58795a189b900d40fe0d913e5c83d:AI_HANDOVER.md
```

- Git blob: `fd8511580a92cf39143f91d31df1f3c3c82febfd`
- SHA-256: `9387596aa1892819bbac60ba94910d0dbfe0443224767bc2dc31e1ed5b746f0a`
- 원문 3,958줄·285,528 bytes. 종료된 챕터·이미지·QA·PR 상세와 예전 규칙·상태를 통째로 폐기하거나 중복 사본으로 옮기지 않았다.
- 관련 audit는 기존 `docs/audits/`의 추적 파일 1,160개에 보존돼 있으며 이번에 변경하지 않는다. 0화의 [원본 발행 manifest](../2026-11-07-hobyeongbaekma-publication/manifest.json), [개정 manifest](../2026-11-07-hobyeongbaekma-editorial-revision/manifest.json), 이미지 교체·Pages 복구 기록을 확인했다.
- 미해결 가능 항목은 현재 Snapshot에 재확인 대상으로 남겼다. 과거 환경의 실제 Excel·공식 원문·외부 계정·보안 경고를 현재 PASS나 현재 미승인 상태로 바꾸지 않았다.

## 완료 기준 검토

| # | 요청 기준 | 반영·확인 |
|---|---|---|
| 1–2 | 이전 환경 분리 표현 제거·CHAT / WORK | 두 운영 문서에 CHAT / WORK 역할 적용 |
| 3 | 공통 규칙 + 라우터 | 상세 학습 이미지 절차 중복을 정본 링크로 통합, 작업별 가이드 표 제공 |
| 4 | 동일 버전 가이드 재사용 | 동일 세션·동일 버전 조건과 재조회 5가지 계기 명시 |
| 5 | 제한 조회 | 파일·구간·diff·실패 Step 우선, 전체 결과는 파일 / Artifact 보존 |
| 6 | 검증 재사용 | 대상·Source·Dependency·설정·환경·성공·범위 조건 및 재검증 사유 명시 |
| 7 | 체크포인트 재개 | Branch / Commit·변경·검증·CI / Deploy·잔여와 다음 미완료 단계 연결 |
| 8–10 | Snapshot·보존·오래된 상태 제거 | 최신 서비스 배포와 이번 문서 작업을 구분하고, 과거 미승인 / 배포 전 문구를 현재 상태에서 제거 |
| 11 | v2.2 정합성 | 우선순위·현재 증거·조건부 재사용·동일 범위 배포 승인 유지·간결 보고 대조 |
| 12 | 보호 규칙 | 기능·공개 URL·동결 ID·관계·미커밋 / 미추적 파일·필수 검증·배포 경계·Force Push / History Rewrite 금지·외부 명령 경계 유지 |
| 13 | diff 검토 | 문서 4개만 변경, 상대 링크·문구·과거 원문 보존·제품 / CI 동일성·공백 오류 확인 |

## 검증 근거와 한계

- [evidence.json](evidence.json): 조회 시점, 기준 커밋, PR #260 검증·Pages·후속 Production QA의 실제 실행 상태와 HEAD, 열린 PR 목록, 실서버 응답·검사·이미지 7장 해시를 저장했다. 전체 HTML·API 응답은 대화나 인계에 복제하지 않았다.
- `68708f8` Pages run 42382274155의 build / deploy job 모두 success. PR HEAD `c5998e8`의 SEO·시설·0화·자격증 탐색·소방 QA와 `68708f8`의 후속 Production QA도 실제 API에서 success 확인.
- 이번 문서 작업은 제품 소스·자산·dependency·빌드 설정·workflow를 변경하지 않는다. Git diff / tree 동일성에 근거해 제품 Build·관련 QA 증거를 재사용하며 로컬 전체 Build·브라우저 QA를 중복 실행하지 않는다. 문서 내용의 정확성은 별도의 링크·정책·상태·diff 검토로 확인한다. PR 필수 CI는 기존 설정대로 수행하고 결과는 PR의 실제 HEAD에 연결한다.
- 실서버 0화·시설 홈·취업 목록·사이트맵 HTTP 200, 개정 문구·설명 링크 / 자료 섹션 제거·canonical / Article·목록 / 사이트맵 연결·이미지 7장의 승인 해시 일치 확인. 새 수동 브라우저 세션·실휴대폰·Safari·실광고·색인·전체 사이트 검증을 수행한 것으로 해석하지 않는다.
- 이번 변경은 작업 브랜치 / PR 범위다. `main` 병합·신규 Production 배포는 수행하지 않는다.

## 후속 CI 개선 후보 — 이번에는 변경하지 않음

| 후보 | 현재 확인한 근거 | 후속 검토 |
|---|---|---|
| 시설·SEO·0화 중복 Build | `facility-launch-qa.yml`, `seo-check.yml`, `hobyeongbaekma-review-qa.yml`에서 각자 `npm ci` / Build 수행 | 동일 소스·빌드 모드·환경·검증 대상이 같은지 먼저 대조하고 Artifact 공유 가능성 검토 |
| 공통 검사 중복 | 0화 workflow가 SEO·공개문구·시설 이미지·링크 검사를 다시 수행 | 필수 검사 누락 없이 소유 workflow와 증거 연결 정리 |
| 소방 PR 실행 범위 | `fire-safety-level2-launch-qa.yml`의 PR paths에 `src/**`, `public/**` 포함 | 실제 의존성 분석 후 path filter 최적화. 단순 축소 금지 |
| 브라우저·의존성 설치 반복 | 시설·0화·소방 workflow의 개별 npm / Playwright / Chromium 준비 | 버전·OS·폰트·모드 차이를 보존하면서 재사용·캐시 검토 |
| 배포 후 연쇄 QA 비용 | `deploy.yml`은 main push마다 배포, 여러 QA가 workflow_run으로 실행 | 문서만 변경한 경우까지 포함해 트리거·배포 정책을 별도 제안. 이번에 수정하지 않음 |

후속 후보는 구현 계획·승인·효과 측정이 끝난 변경이 아니다. 본 작업을 CI 최적화 완료로 보고하지 않는다.

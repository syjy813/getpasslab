# 산업안전기사 건설 기준 챕터 production 반영·Pages 상태 감사

- 감사일: 2026-08-07
- 기준 `main`: `e36e104c62144dbebc07904b24b0eabebbddd95c`
- 대상: `construction-illuminance`, `ladder-cage-standard`, GitHub Pages 배포 상태
- 신규 slug·동결 키·스키마·의존성·URL 규칙 변경: 없음

## 결론

두 건설 기준 챕터의 **production 콘텐츠 반영은 PASS**다. 대표 페이지 두 개가 HTTP 200으로 열리고, 신규 본문·기출 관계와 sitemap 등재를 실제 공개 사이트에서 확인했다.

다만 GitHub Actions의 Pages 배포 상태는 **UNRESOLVED**다. `main`의 Pages 빌드는 모두 성공했지만 `actions/deploy-pages@v5`가 `deployment_in_progress`를 10분간 반환받은 뒤 시간 초과로 실패했다. 공개 사이트 반영 결과와 Actions 결론이 일치하지 않으므로, 배포 파이프라인 전체를 성공 또는 정상화 완료로 기록하지 않는다.

## 1. 콘텐츠 구현·병합

PR #61 `content: complete construction standards chapters`:

- PR HEAD: `1a65faa391d4c6c1e86b978cf8f08436434e046c`.
- Squash merge: `4882f8c4341abe50d2578b6dd9ee15da16808096`.
- 변경 파일 3개, 추가 116줄, 삭제 14줄.
- `construction-illuminance`를 완료 상태로 전환하고 PDF 검증 기출 2건을 연결.
- `ladder-cage-standard`를 완료 상태로 전환하고 PDF 검증 기출 8건을 연결.
- PDF 원문 대조 결과에 따라 5개 문항의 `body`만 정정.
- `id`, `subject_id`, 날짜·번호, 선택지, 정답은 변경하지 않음.
- ChatGPT 최종 기술 리뷰 PASS.
- SEO validation run `31099919308`, validate job `92610714084`: 성공.

PR #62 `Stabilize GitHub Pages deployment concurrency`:

- PR HEAD: `d4ebe7e4610a381ae3abf596975dfa0282095b1e`.
- Squash merge: `e36e104c62144dbebc07904b24b0eabebbddd95c`.
- `.github/workflows/deploy.yml`에 저장소 단위 `pages` 동시성 그룹과 `cancel-in-progress: false`를 추가.
- 애플리케이션 코드·콘텐츠·문제·관계·의존성·스키마·URL·Pages 설정은 변경하지 않음.
- ChatGPT 최종 기술 리뷰 PASS.
- SEO validation run `31106377564`, validate job `92632505472`: 성공.

## 2. Pages 실행 결과

PR #62 병합 SHA에 대해 확인한 실행은 다음과 같다.

| 구분 | run ID | build | deploy | 최종 결론 |
|---|---:|---|---|---|
| 자동 실행 | `31106511043` | job `92632957566` 성공 | job `92633121454` 실패 | failure |
| 수동 실행 1 | `31108142502` | job `92638576269` 성공 | job `92638739937` 실패 | failure |
| 수동 실행 2 | `31110949492` | job `92648308557` 성공 | job `92648491775` 실패 | failure |

마지막 수동 실행의 배포 로그:

- `github-pages` artifact ID `8971651513` 확인.
- Pages build version `e36e104c62144dbebc07904b24b0eabebbddd95c`로 배포 생성.
- 배포 상태를 약 5초 간격으로 조회했으나 계속 `deployment_in_progress`.
- 기본 제한 600,000ms 도달 후 `Timeout reached, aborting!`으로 종료.
- action은 시간 초과 후 해당 Pages deployment 취소를 요청.

세 실행 모두 빌드 산출물 생성에는 성공했다. 실패 지점은 애플리케이션 빌드가 아니라 GitHub Pages 백엔드 상태 대기 단계다.

## 3. production runtime 검증

2026-08-07 실제 공개 사이트를 다시 확인했다.

| URL | 결과 | 확인 항목 |
|---|---|---|
| `/industrial-safety/written/construction/construction-illuminance/` | HTTP 200 | 페이지 제목, `20220305_107`, 750럭스, 감광재료 예외 |
| `/industrial-safety/written/construction/ladder-cage-standard/` | HTTP 200 | 페이지 제목, `20220424_114`, 10m, 60cm 기준 |
| `/sitemap-0.xml` | HTTP 200 | 두 챕터 URL 모두 등재 |

공개 사이트에는 PR #61의 신규 콘텐츠가 반영돼 있다. 다만 Actions가 실패로 종료됐으므로 어떤 비동기 Pages 처리 단계가 최종 공개 반영을 완료했는지는 현재 증거만으로 특정하지 않는다.

## 4. 판정과 운영 조치

- 콘텐츠 구현·PR CI: **PASS**.
- production 페이지·본문·sitemap: **PASS**.
- GitHub Pages Actions 상태: **UNRESOLVED**.
- 반복 수동 재실행: 중단. 같은 실패를 늘리지 않는다.
- workflow timeout 연장: 미실행. 백엔드 정체를 숨길 수 있어 별도 승인·검토 전에는 적용하지 않는다.
- 수동 Pages 설정 변경: 미실행.
- GitHub Support 문의·공개 이슈 등록: 미실행.

## 5. 문서 게이트 처리

이 감사 문서는 확인된 사실과 서로 충돌하는 신호를 함께 보존한다. Pages 파이프라인이 정상화됐다고 확정할 수 없으므로 `AI_HANDOVER.md`는 이번 단계에서 갱신하지 않는다. 문서 PR도 새 `main` 병합이 또 다른 Pages 배포를 자동 생성하므로, 현재 배포 상태 불일치가 해소되거나 Owner가 위험을 수용하기 전에는 병합하지 않는다.

다음 판단 지점은 GitHub Pages 배포 상태가 명시적으로 성공·실패로 정리되는지 확인하는 것이다. 상태가 장기 고착되면 저장소 변경 대신 GitHub Support 문의를 우선한다.

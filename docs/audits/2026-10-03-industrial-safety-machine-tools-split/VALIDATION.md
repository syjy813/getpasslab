# 공작기계 시범 분리 검증 결과

[Draft PR #120](https://github.com/syjy813/getpasslab/pull/120) · 검증된 콘텐츠/QA 커밋 `c1f26f451ac7195ca755f74d50887e335cb7fa3f` · 기준 main `f7247f69d49379f7649070df3378fe99d52d32b7` · Production 미배포

## Test / Build / CI

| 검사 | 결과 | 확인한 내용 |
|---|---|---|
| `npm run build` | 로컬·CI PASS | 427개 Astro 페이지 생성, 새 4개 경로와 기존 비교 경로 공개 빌드 |
| `node scripts/check-industrial-safety-machine-tools-split.mjs` | 로컬·CI PASS | 24문항 합집합 동일·중복/누락 0, 정본 1,680문항·580개 보호 파일 불변, 224개 기존/신규 산업안전 챕터 경로 존재 |
| `npm run check:seo` | 로컬·CI PASS | HTML 429개·sitemap URL 428개, 경고/오류 0 |
| `npm run check:public-content` | 로컬·CI PASS | 내부 메모·식별자·비공개 자료 노출 없음 |
| `npm run check:deferred-question-content` | 로컬·CI PASS | 산업안전 주 기출 버튼 1,004개 유지, deferred 팝업과 기존 이미지 메타데이터 정상 |
| `npm run check:contrast` | 로컬·CI PASS | 기존 색상 대비 기준 충족 |
| `check:computer-literacy`, `check:computer-literacy-c1` | 로컬·CI PASS | 기존 컴활 공개·문항·답안·이미지 회귀 검사 |
| `check:computer-literacy-001-081`, `check:computer-literacy-082-159` | 로컬·CI PASS | 1~159 본문·기출·이미지·목차·이전/다음 보존 |
| `node --check` / `git diff --check` | 로컬 PASS | QA 스크립트 문법 및 패치 공백 확인 |

- [분리 전용 CI 37112200473](https://github.com/syjy813/getpasslab/actions/runs/37112200473): Build·전체 위 검사·브라우저 QA success
- [SEO CI 37112200440](https://github.com/syjy813/getpasslab/actions/runs/37112200440): success
- 로컬에서 브라우저 다운로드가 잘못된 ZIP으로 실패하여 화면 QA는 GitHub Actions의 **배포 없는 로컬 preview**에서 수행함
- 최초 CI 37112009579는 다섯 챕터·24문항의 390px 검사가 통과한 뒤 목차 페이지의 `main h1` 선택자에서 중단됨 · 기존 목차에는 `main` 래퍼가 없음을 확인해 QA를 문서의 `h1` 및 `.chapter-group` 카드로 수정함 · UI·레이아웃 구현 변경 없이 재실행 성공

## 390px / 1440px / 320px 브라우저 QA

| 화면 | 분리 페이지 | 전수 기출 팝업 | 과목 목차 카드 클릭 | 기존 페이지 회귀 | 결과 |
|---|---:|---:|---:|---:|---|
| 390 × 844 모바일 | 5 | 24 | 5 | 4 | PASS |
| 1440 × 844 PC | 5 | 24 | 5 | 4 | PASS |
| 320 × 844 좁은 모바일 | 5 | 24 | 5 | 4 | PASS |

- 전체 30개 페이지 조합(분리 15·목차 3·회귀 12) 검사 · 정본과 팝업 본문·네 선택지·정답을 72회 대조
- 각 팝업 열기 → 정답 초기 숨김 → 정답 공개 → 닫기 → 재열기 시 숨김 초기화 → Esc 닫기 확인
- 비교 페이지에서 개별 기계로 4개 링크, 개별 기계에서 비교 페이지로 4개 링크를 화면별 실제 클릭함 · 자동 관련 링크의 대상은 빌드 검사에서 전체 확인
- 모바일 390/320px에서 다섯 챕터의 이전/다음 총 20개 실제 클릭 · 목적지 HTTP와 레이아웃 확인
- 가로 페이지 넘침·표 잘림·뷰포트 밖 본문·기출 선택지 없음 · PC 사이드바 표시 확인 · 로컬 자산 HTTP 오류 및 JavaScript 실행 오류 0
- 기존 회귀 대상: 홈, 산업안전 허브, 형삭기 구조와 램, 컴활 컴퓨터일반 목차 · 원래 산업안전의 모든 완료 챕터 URL은 빌드 파일 존재 확인
- Chromium 뷰포트 에뮬레이션임 · 실물 스마트폰 미검증 · 외부 광고/추적은 차단하고 광고 예약 영역을 확인함 · Production URL에서 새 분리본 검증/배포는 미실행

상세 구조화 결과: [browser-results.json](./browser-results.json)

## 직접 화면 검수와 보존

PNG 33장 및 JSON 다운로드 후 ZIP SHA-256 대조 완료 · 초기 390px 5개 본문/1개 팝업과 최종 PC 5개 본문·320px 3개 본문/1개 팝업·PC 공통 팝업·390px 목차, 총 17개 캡처를 직접 확인함 · 초기/최종 실행 사이 학습 콘텐츠 변경 없음

확인 항목: 한국어 줄바꿈·표의 열 구분·강조·본문과 기출 묶음 일치·기출 정답 표시·비교 및 개별 챕터 이동·좁은 화면의 버튼 표시 · 시각 검수에서 추가 수정 필요 사항 없음

33개 원본 PNG 지문·직접 확인 기록·보존 목록: [screenshots.json](./screenshots.json) · [전체 CI 캡처](https://github.com/syjy813/getpasslab/actions/runs/37112200473/artifacts/11270143750)는 2026-10-17 만료 예정 · 아래 대표 4장은 저장소에 영구 보존함

- [PC 비교 챕터](./screenshots/1440-machine-tools-safety.png)
- [PC 선반 챕터](./screenshots/1440-lathe-safety.png)
- [320px 드릴 챕터](./screenshots/320-drill-safety.png)
- [320px 드릴 정답 팝업](./screenshots/320-drill-safety-answer.png)

## Git / 배포 상태

- 연결 GitHub 계정과 저장소 소유자 `syjy813` 일치·공개 저장소·관리/쓰기 권한 확인 후 GitHub 앱으로 검토 브랜치와 Draft PR 생성
- Git CLI로 원격 전송은 인증 정보 부재로 실패함 · 앱으로 만든 최초/수정 코드 tree가 로컬 코드 tree와 각각 `421365cec7c39efc1b1552a66fcadbe8f9c3f1b1` / `3a36b71fdc967a1bf074608c1e98b8e5750a695e`로 일치함
- 마지막 결과·인수인계 문서/QA 자료 추가는 검증된 학습 콘텐츠 및 실행 코드 변경 없이 반영함 · main merge/push·Production Deploy 미실행

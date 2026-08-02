# 관계·구조 정리 Gate A production 검증

- 검증일: 2026-08-02
- 대상 PR: #13 `fix: reconcile relation structure gate A`
- `main` 병합 커밋: `571a4aec906a4127e99f474b3a0e57d8c239598b`
- 병합 방식: Squash and merge
- 최종 결과: **PASS**

## 1. 구현 범위

관계·구조 T0 감사에서 신규 공개 식별자나 법령 원문 확인 없이 확정할 수 있었던 Gate A 범위만 반영했다.

### 관계 정리

- `swain-human-error`
  - Reason 계열 2문항 제거
  - Swain 분류 5문항만 관계 유지
- `ventricular-fibrillation-current`
  - 위험한계 에너지 계산 1문항 제거
- `vf-danger-energy`
  - 의미가 일치하지만 원문 복원 대기 중인 2018년 기출 3문항을 내부 관계에 추가
  - 추가 문항은 공개 필터로 계속 제외
- `grinder-rotation-speed`
  - 원주속도 계산 3문항만 유지
  - 평형플랜지·숫돌 3요소·작업수칙 관계 분리
- `balance-flange-diameter`
  - 평형플랜지 1문항 이동
- `grinder-exposure-angle`
  - 이미지 보류 1문항 내부 관계 추가
- `five-pinch-points`
  - 연삭숫돌과 작업받침대 사이의 끼임점 2문항 추가
- `leakage-breaker-exception`
  - 설치 필요 전압 기준 1문항 제거

관계 변경은 제거 8건, 추가 7건으로 전체 관계가 887건에서 886건으로 변경됐다.

### 공개 차단

원문 누락 또는 OCR 훼손이 확인된 다음 3문항의 `review`만 `jpg 확필`로 변경했다.

- `20220305_040`
- `20210814_021`
- `20180428_065`

문제 본문·선택지·정답·`question_id`는 변경하지 않았다.

### 사용자 문구 보정

- `연삭숙돌 회전속도` → `연삭숫돌 회전속도`
- 평형플랜지 요약의 `숙돌` → `숫돌`
- Swain과 Reason 분류 체계를 구분하는 설명 보강
- 기계의 5대 위험점에 연삭숫돌·작업받침대 끼임점 설명 보강
- 누전차단기 설치 대상과 설치 예외를 구분하는 설명 보강

## 2. 병합 전 검증

- PR 최종 HEAD: `e488fbcbf2aa8ca176f63d4e433f80432b5e5955`
- workflow: `SEO validation`
- run: `30752644850` (#113)
- 결과: `completed / success`
- Astro build: 209페이지
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개

일회성 관계 검증 결과:

- 전체 관계: 886건
- 존재하지 않는 문항 참조: 0건
- 챕터 내부 중복 관계: 0건
- `subject_id` 불일치: 0건
- 지정 8개 챕터의 관계 배열: 예상값과 일치
- 공개 차단 3문항: 비노출 확인
- `vf-danger-energy` 공개 문항 수: 기존 8개 유지

## 3. GitHub Pages 배포

- workflow: `Deploy to GitHub Pages`
- run: `30752925033`
- 기준 SHA: `571a4aec906a4127e99f474b3a0e57d8c239598b`
- 상태: `completed / success`
- 생성 시각: `2026-08-02T14:48:31Z`
- 완료 시각: `2026-08-02T14:49:11Z`

## 4. production runtime 검증

- 임시 검증 PR: #14
- 검증 workflow: `Verify relation structure Gate A production`
- 검증 run: `30752971120`
- 검증 job: `91510170926`
- 결과: `completed / success`

| 페이지 | HTTP | 확인 내용 | 결과 |
|---|---:|---|---|
| Swain 인간 실수 분류 | 200 | 공개 4문항·3개 연도, Reason 문항과 손상 문항 비노출 | PASS |
| 심실세동 전류 | 200 | 공개 3문항·2개 연도, 에너지 문항과 OCR 손상 문항 비노출 | PASS |
| 심실세동 위험한계 에너지 | 200 | 공개 8문항 유지, 2018년 내부 추가 관계 비노출 | PASS |
| 연삭숫돌 회전속도 | 200 | 제목 오타 교정, 계산형 3문항 관계 반영 | PASS |
| 기계의 5대 위험점 | 200 | 연삭숫돌·작업받침대 끼임점 관계·설명 반영 | PASS |
| 누전차단기 설치 불필요 조건 | 200 | 설치 전압 기준 문항 제거 | PASS |

동일 임시 PR의 `SEO validation` run `30752971117`도 성공했다.

## 5. 임시 검증 자산 정리

- 임시 workflow는 검증 후 브랜치에서 삭제
- PR #14는 `main`에 병합하지 않고 종료
- 최종 `main`에는 임시 workflow나 검증 스크립트가 남지 않음

## 6. 무결성

- 기존 `slug`, `subject_id`, `question_id` 변경 없음
- 신규 공개 `slug` 생성 없음
- 문제 본문·선택지·정답 변경 없음
- 스키마·의존성·URL 규칙·핵심 UX·production 설정 변경 없음
- `questions.json` 변경은 손상 문항 3건의 `review` 필드로 제한

## 7. 남은 위험과 다음 작업

다음 항목은 Gate A에서 의도적으로 제외했다.

- Reason 인간오류 분류 신규 챕터: 신규 공개 식별자 Owner 결정 필요
- 일반 연삭기 안전 신규 챕터: 신규 공개 식별자 Owner 결정 필요
- 심실세동 전류 챕터의 전격사 위험 범위 확대
- 건설공사 유해·위험방지계획서의 제목·본문 구조 보정
- 누전차단기 구조·정격·시설기준 챕터 범위 확대
- 법령·고시 공식 원문 재대조
- 원문 누락·OCR·이미지 의존 문항 복원
- `examComment` 미작성 공개 챕터 후속 배치

다음 권장 작업은 신규 공개 식별자 없이 가능한 기존 챕터 범위 보정과, 신규 `slug` 2개에 대한 Owner 명명·생성 승인 결정을 분리하는 것이다.

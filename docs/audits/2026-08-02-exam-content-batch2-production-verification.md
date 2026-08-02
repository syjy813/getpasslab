# 시험 포인트 두 번째 개선 배치 production 검증

- 검증일: 2026-08-02
- 대상 PR: #10 `content: add second exam trend batch`
- `main` 병합 커밋: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`
- 병합 방식: Squash and merge
- 최종 결과: **PASS**

## 1. 구현 범위

다음 12개 공개 챕터에 `examComment`를 각 1줄 추가했다.

- 화학설비위험방지: `dust-explosion-factors`, `acetylene-properties`
- 전기위험방지: `shock-prevention`, `vf-danger-energy`
- 기계위험방지: `safety-factor`, `press-safety-distance`
- 안전관리론: `accident-prevention-principles`, `severity-rate`, `hazard-prediction-training`, `safety-inspection-types`
- 인간공학·시스템안전: `anthropometry-design`, `information-entropy`

변경 규모는 12개 파일, 12줄 추가, 삭제 0줄이다. 챕터 제목·본문·요약·관계와 기출 DB는 변경하지 않았다.

## 2. 병합 전 CI

- PR 최종 HEAD: `973bc20020846515b461082e35588df454b0bb62`
- workflow: `SEO validation`
- run: `30744643862` (#101)
- 결과: `completed / success`
- Astro build: 209페이지
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개

## 3. GitHub Pages 배포

- workflow: `Deploy to GitHub Pages`
- run: `30747175723`
- 기준 SHA: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`
- 상태: `completed / success`
- 생성 시각: `2026-08-02T12:07:47Z`
- 완료 시각: `2026-08-02T12:08:38Z`

## 4. production runtime 검증

- 검증 workflow: `Verify batch2 production evidence`
- 검증 run: `30748804989`
- 검증 job: `91499024608`
- 결과: `completed / success`

| 페이지 | HTTP | 확인 내용 | 결과 |
|---|---:|---|---|
| 홈 | 200 | 산업안전기사 사이트 문구 | PASS |
| 분진폭발 요인 | 200 | `13문항 / 11회차` 출제 경향 | PASS |
| 심실세동 위험한계 에너지 | 200 | `8문항 / 8회차` 출제 경향 | PASS |
| 강도율 | 200 | 공개 기준 `6문항 / 6회차` 출제 경향 | PASS |
| 정보량·엔트로피 | 200 | `3문항 / 3회차` 출제 경향 | PASS |

강도율은 관계 데이터에 7문항이 연결되어 있으나, 이미지 검수 미완료 문항 1개가 공개 필터에서 제외된다. 따라서 사용자 화면의 출제 경향은 실제 공개되는 6문항·6회차를 기준으로 작성하고 검증했다.

## 5. 임시 검증 자산 정리

- 임시 검증 PR: #11
- 임시 workflow는 검증 후 브랜치에서 삭제
- PR #11은 `main`에 병합하지 않고 종료
- 최종 `main`에는 임시 workflow·검증 스크립트가 남지 않음

## 6. 무결성

- `slug`, `subject_id`, `question_id` 변경 없음
- 챕터 `questions` 관계 변경 없음
- 기출 DB 본문·선택지·정답 변경 없음
- 스키마·의존성·URL·핵심 UX·production 설정 변경 없음

## 7. 남은 위험과 다음 작업

- T0 감사 기준 `examComment` 미작성 공개 챕터 121개 중 12개를 보강했으며, 잔여 109개는 후속 배치로 유지한다.
- 관계 불일치 의심 항목과 챕터 범위가 넓거나 좁은 구조 후보는 `examComment` 작성과 분리해 검토한다.
- 법령·고시 의존 챕터는 현행 공식 원문을 대조한 뒤 작성한다.
- 기존 npm 취약점 5건과 GitHub Actions deprecation 경고는 별도 의존성·CI 작업으로 분리한다.
- Search Console 노출 데이터가 확보되면 다음 배치 우선순위에 반영한다.

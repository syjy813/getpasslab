# PR #6 공개 콘텐츠 정리 production 검증

- 검증일: 2026-08-01
- 대상 PR: #6 `content: clean public exam notes and block internal IDs`
- PR 최종 HEAD: `09a81b4eaedc7f4768cba5910a450bdab500c606`
- `main` 병합 커밋: `ac2a610d68958c7a3193c8fbf75334c310aedf87`
- 병합 방식: Squash and merge
- 최종 결과: **PASS**

## 1. 변경 범위

- 전체 변경 파일: 132개
- 공개 챕터: 129개
- 영구 검증 workflow: 1개
- `package.json`: 1개
- 공개 콘텐츠 검사 스크립트: 1개

주요 변경:

- `YYYYMMDD_NNN`, `qYYYYMMDD` 형태의 내부 문항 식별자 제거
- PDF·JSON·DB·검수·매핑·렌더링 관련 내부 운영 문구 제거
- 선택지 전체를 반복하던 문장을 출제 유형·정답 판단 조건·함정 중심으로 교정
- 렌더링되지 않은 Markdown 강조 표기를 실제 strong 요소로 보정
- 내부 chapter slug의 코드 표기 노출 제거
- 손상된 LaTeX `\rho` 표기 복구
- 공개 콘텐츠와 챕터 원문 무결성 CI 가드 추가

## 2. 데이터 무결성

변경하지 않은 항목:

- `slug`
- `subject_id`
- chapter `questions` 관계
- 기출 DB의 `question_id`
- 기출 문제 본문·선택지·정답
- URL 구조
- 데이터 스키마
- 신규 의존성
- 광고·결제·production 설정

## 3. 병합 전 검증

GitHub Actions `SEO validation` run #68:

- `npm ci`: 성공
- Astro build: 성공
- 생성 페이지: 209개
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개
- 공개 콘텐츠·원문 무결성 검사: 오류 0개
- PR mergeable: `true`

영구 CI 차단 기준:

- 사용자 노출 텍스트의 내부 문항 ID 및 별칭
- 렌더링되지 않은 Markdown 강조 표기
- PDF·JSON·DB·검수·매핑·공개 렌더링 등 내부 제작 문구
- 내부 chapter slug의 코드 표기
- 챕터 원문의 비정상 제어문자
- `\rho`가 손상되어 `ho=`로 남은 흔적

## 4. GitHub Pages 배포 검증

- workflow: `Deploy to GitHub Pages`
- run: `30697893844`
- 기준 SHA: `ac2a610d68958c7a3193c8fbf75334c310aedf87`
- 상태: `completed / success`
- 실행 시간: `2026-08-01T11:32:38Z → 2026-08-01T11:33:28Z`

## 5. production runtime smoke test

| 페이지 | HTTP | 확인 항목 | 결과 |
|---|---:|---|---|
| 홈 | 200 | 사이트 제목 | PASS |
| 위험물 반응 가스 발생 | 200 | 자연어 회차 표기, 사용자 노출 텍스트의 내부 ID·PDF·JSON 문구 미노출 | PASS |
| VDT 화면 대비 | 200 | strong 렌더링, `\rho=0.85` 수식, 사용자 노출 내부 ID 미노출 | PASS |
| 재해 원인 분류 | 200 | strong 렌더링, Markdown 기호 미노출 | PASS |

### 사용자 노출 판단 기준

내부 `question_id`는 애플리케이션의 비가시 script 데이터에서 사용될 수 있다. 따라서 이번 런타임 노출 검사는 영구 CI 가드와 동일하게 `script`, `style`, `noscript`, `template` 요소를 제외한 visible text를 기준으로 수행했다.

## 6. 남은 경고와 범위 밖 항목

- npm 취약점 5건: 낮음 1건, 높음 4건
- `esbuild`, `sharp` install script 승인 경고
- GitHub Actions 내부 Node 20 deprecation 경고
- 법령 의존 문구의 현행 기준 전체 대조
- AdSense 승인과 실제 광고 송출 상태
- Search Console 색인 상태

위 항목은 이번 공개 콘텐츠 정리 범위의 출시 차단 이슈로 판정하지 않았으며, 별도 작업에서 검토한다.

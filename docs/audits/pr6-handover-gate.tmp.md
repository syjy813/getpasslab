## 공개 챕터 내부 식별자·운영 문구 정리·production 검증 게이트 완료 (2026-08-01)

이 절은 공개 챕터의 내부 식별자·제작 문구 노출과 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소, CI, GitHub Pages 배포, runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #6 `content: clean public exam notes and block internal IDs` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `ac2a610d68958c7a3193c8fbf75334c310aedf87`.
- 공개 챕터: 198개.
- 생성 페이지: 209개.
- PR #6 범위의 GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 이번 범위의 Production 상태: **VERIFIED**.
- 완료된 내부 식별자·운영 문구 정리 배치를 다시 수행하지 않는다.

### 2. 구현 범위

- 전체 변경 파일: 132개.
  - 공개 챕터: 129개.
  - 영구 검증 workflow: 1개.
  - `package.json`: 1개.
  - 공개 콘텐츠 검사 스크립트: 1개.
- 제거·교정한 사용자 노출 요소:
  - `YYYYMMDD_NNN`, `qYYYYMMDD` 형태의 내부 문항 식별자.
  - PDF·JSON·DB·검수·매핑·렌더링 관련 내부 운영 문구.
  - 선택지 전체를 반복하는 제작 관점 문장.
  - 렌더링되지 않은 Markdown 강조 표기.
  - 내부 chapter slug의 코드 표기.
  - 손상된 LaTeX `\rho` 표기.
- 시험 포인트는 출제 유형·정답 판단 조건·함정 중심의 사용자용 문장으로 교정했다.

### 3. 데이터 무결성과 CI 가드

변경하지 않은 항목:

- `slug`.
- `subject_id`.
- chapter `questions` 관계.
- 기출 DB의 `question_id`.
- 기출 문제 본문·선택지·정답.
- URL 구조와 데이터 스키마.
- 신규 의존성, 광고·결제·production 설정.

영구 CI 차단 기준:

- 사용자 노출 텍스트의 내부 문항 ID 및 별칭.
- 렌더링되지 않은 Markdown 강조 표기.
- PDF·JSON·DB·검수·매핑·공개 렌더링 등 내부 제작 문구.
- 내부 chapter slug의 코드 표기.
- 챕터 원문의 비정상 제어문자.
- `\rho`가 손상되어 `ho=`로 남은 흔적.

### 4. 병합 전 검증

- PR 최종 HEAD: `09a81b4eaedc7f4768cba5910a450bdab500c606`.
- GitHub Actions `SEO validation` run #68: 성공.
- `npm ci`: 성공.
- Astro build: 성공, `209 page(s) built`.
- SEO 검사:
  - HTML 209개.
  - sitemap URL 210개.
  - 경고 0개.
  - 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: 오류 0개.

### 5. production 배포·runtime 검증

- GitHub Pages workflow: `Deploy to GitHub Pages`.
- run: `30697893844`.
- 기준 SHA: `ac2a610d68958c7a3193c8fbf75334c310aedf87`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-01T11:32:38Z → 2026-08-01T11:33:28Z`.
- runtime smoke test:
  - 홈: HTTP 200, 사이트 제목 정상.
  - 위험물 반응 가스 발생: HTTP 200, 사용자 노출 텍스트에서 내부 ID·PDF·JSON 문구 미노출.
  - VDT 화면 대비: HTTP 200, strong 렌더링과 `\rho=0.85` 수식 정상, 사용자 노출 내부 ID 미노출.
  - 재해 원인 분류: HTTP 200, strong 렌더링 정상, Markdown 기호 미노출.
- 사용자 노출 검사는 영구 CI와 동일하게 `script`, `style`, `noscript`, `template` 요소를 제외한 visible text 기준으로 수행했다.
- 상세 검증 문서: `docs/audits/2026-08-01-pr6-production-verification.md`.

### 6. 남은 위험과 범위 밖 항목

- npm 취약점 5건: 낮음 1건, 높음 4건.
- `esbuild`, `sharp` install script 승인 경고.
- GitHub Actions 내부 Node 20 deprecation 경고.
- 법령 의존 문구의 현행 기준 전체 대조.
- AdSense 승인과 실제 광고 송출 상태.
- Search Console 색인 상태.
- 공개 챕터 전체의 `시험 포인트`·`출제 경향` 의미 품질 전수 감사는 이번 패턴 정리 범위만으로 완료로 확정하지 않는다.

### 7. 다음 권장 작업

1. 공개 챕터 198개의 `시험 포인트`·`출제 경향` 의미 품질을 위험 기반으로 진단한다.
2. Search Console 노출 데이터가 확보된 페이지를 우선 배치로 선정한다.
3. 숫자·수식·부정문·법령·조건·예외가 포함된 후보를 고강도로 검토한다.
4. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 각 외부 서비스 증거로 별도 확정한다.
5. npm 취약점과 Actions 경고는 콘텐츠 작업과 분리된 의존성·CI 감사에서 처리한다.

위 순서는 추천안이며, 다음 구현 범위는 Owner 승인 후 확정한다.

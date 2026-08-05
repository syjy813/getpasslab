# 에너지관리기능사 기출·챕터 production 검증

- 검증일: 2026-08-05
- 저장소: `syjy813/getpasslab`
- 구현 PR: `#52`
- 구현 브랜치 커밋: `02fc6c0ea65dcf00d4bf87f89cf36fbf39fd938c`
- Squash merge: `5cf709bd5a605bad249376203f4d962431766412`
- 결과: **VERIFIED**

## 1. 반영 범위

- 기출문제 정본을 `src/data/questions/{cert_id}.json`으로 분리했다.
  - 산업안전기사: 1,680문항
  - 에너지관리기능사: 1,620문항
  - 합계: 3,300문항
- 에너지관리기능사 필기 핵심요약을 기존 12개에서 21개 챕터로 재편했다.
- 이미지 확인이 필요한 32문항을 제외한 텍스트 문항 1,588개를 챕터에 고유하게 연결했다.
- 32개 문제 이미지는 저장소에 포함하고 렌더러 매핑을 추가했지만, 해당 32문항은 공개 챕터 관계에서 제외했다.
- 기존 산업안전기사 1,680문항은 자격증별 파일로 이동한 뒤 기존 데이터와 바이트 동일함을 확인했다.
- 신규 의존성, 데이터 스키마, URL 규칙, production 설정 변경은 없다.

## 2. 로컬 검증

- `git diff --check`: PASS
- JSON 파싱, 전체 문항 수, ID 중복, 관계 ID 존재 여부: PASS
- 자격증·시험·과목 관계, 챕터 내부·후보 전체 중복: PASS
- `node scripts/audit-energy-chapter-coverage.mjs`: PASS
  - 에너지관리기능사 1,620문항
  - 미분류 0건
  - 원본 PDF 직접 검수 86건
  - 최종 주제 교정 22건
  - 관계 1,588건
  - 이미지 제외 32건
- `npm ci`: PASS
- `npm run build`: PASS, 정적 HTML 251개
- `npm run check:seo`: PASS, 경고 0건, 오류 0건
- `npm run check:public-content`: PASS, 오류 0건
- 에너지관리기능사 목록·사이드바 1~21 순서: PASS
- 산업안전기사 6과목의 기존 목록·그룹·사이드바 순서 production 대조: 불일치 0건

## 3. PR·CI·병합

- PR `#52`는 기술 재검토 PASS와 Owner 승인 후 Ready로 전환했다.
- PR CI `SEO validation` run `31005146577`: `completed / success`
  - validate job `92303130706`
  - 의존성 설치, build, SEO, public-content 단계 모두 성공
- 예상 head SHA `02fc6c0ea65dcf00d4bf87f89cf36fbf39fd938c`를 고정해 Squash merge했다.
- main 병합 커밋: `5cf709bd5a605bad249376203f4d962431766412`

## 4. GitHub Pages

- Pages run `31005356290`: `completed / success`
- build job `92303817892`: success
- deploy job `92303947296`: success
- Actions가 Node.js 20 기반 action을 Node.js 24로 강제 실행한다는 deprecation 경고가 있었지만 build·deploy 실패는 없었다.

## 5. Production runtime

`https://getpasslab.co.kr`에서 다음을 직접 확인했다.

- 에너지관리기능사 과목 목록: HTTP 200, 챕터 링크 21개
- 에너지관리기능사 챕터 21개: 전부 HTTP 200
- 21개 챕터: 전부 기출 이력 UI 렌더링
- 신규 `boiler-types-construction`: HTTP 200, 과목 목록 링크 확인
- 산업안전기사 `safety-management` 과목 및 `accident-analysis-tools`: HTTP 200
- `sitemap-index.xml`: HTTP 200
- `sitemap-0.xml`: HTTP 200, 콘텐츠 URL 251개, 신규 챕터 URL 포함

## 6. 남은 위험

- CBT 기반 문제 텍스트와 이미지의 이용 권리 위험은 해소된 것으로 판단하지 않는다.
- 이미지 문항 32개는 공개 챕터 관계 제외 상태를 유지한다.
- `esbuild` 설치 스크립트 allowlist 안내는 남아 있으나 clean install·로컬 build·PR CI·Pages 배포는 성공했다.
- Actions의 Node.js 20 runtime deprecation 경고는 별도 CI 현대화 감사 대상으로 유지한다.
- AdSense 승인·실제 광고 송출, Search Console 처리, GA4 실시간 이벤트는 외부 계정 증거로 별도 확인한다.

## 7. 최종 판정

에너지관리기능사 기출 내재화, 21개 챕터 재편, 1,588개 공개 관계, PR CI, GitHub Pages 배포 및 production runtime 검증을 완료했다. 이 게이트의 최종 상태는 **VERIFIED**다.

완료 범위를 다시 수행하지 않는다. 후속 작업은 이미지 문항 공개 여부와 기출 이용 권리 결정, 또는 다음 제품 우선순위에 따라 별도 승인 범위로 진행한다.

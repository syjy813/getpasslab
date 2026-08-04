# 미시작 챕터 관계·콘텐츠 정리 production 검증

- 검증일: 2026-08-04
- 작업 시작 `main`: `1da745fd0210a008d4c8cef5f23e41694702ce33`
- 콘텐츠 게이트 최종 `main`: `caa7f9b10989ae788adcce2e9ff21a443354359c`
- 대상: 기출 관계가 있던 기존 미시작 후보 21개
- 결과: 기존 URL 18개 공개, 중복 역할 3개 비공개 유지·기존 완료 챕터로 흡수
- 신규 `slug`, 의존성, 스키마, URL 규칙, production 설정 변경: 없음

## 1. 관계 정리

PR #42 `content: clean up pending chapter relations`에서 후보 21개의 관계를 먼저 정리했다.

### 잘못된 관계 9건

- `chemical-classification`: 이미지 의존 `20220424_084` 제거
- `water-prohibited-extinguishers`: 주제가 다른 `20210814_083`, `20210814_096` 제거. 후자는 `chemical-classification`으로 이동
- `fall-prevention-equipment`: 주제가 다른 `20220424_102`, `20220424_114` 제거
- `hazard-index`: 이미지 원본이 없는 `20220424_097` 제거
- `lightning-protection-standard`: 피뢰기 문항 `20220424_069`를 `lightning-arrester-conditions`로 이동
- `series-parallel-reliability`: 이미지 원본이 없는 `20220305_022` 제거
- `grinder-exposure-angle`: 이미지 원본이 없는 `20180819_048` 제거

### 흡수·보완

- `hazard-index`의 계산식 `H=(U-L)/L`을 기존 완료 챕터 `combustion-range-risk`에 반영하고 관계를 비움
- `insulation-calculation`의 문항을 `max-leakage-current`와 `low-voltage-insulation`으로 분산하고 관계를 비움
- `parallel-mesh-opening`의 문항을 `ilo-guard-opening`으로 이동하고 관계를 비움
- 화학물질 분류, 금수성 소화기, 추락방지, 항타기·항발기, 피뢰, 절연, 신뢰도, 연삭기, 안전교육에 검증된 미연결 텍스트 기출을 보완
- 이미지 원본이 없는 `20220424_097`, `20220305_022`, `20180819_048`은 공개 관계에서 제외

관계 정리 뒤 존재하지 않는 문항 ID, 후보 내부 중복, 과목 불일치, 존재하지 않는 related slug는 모두 0건이었다.

## 2. 기존 스텁 18개 공개

### PR #43: 일반 챕터 4개

- `insulation-temperature`
- `mil-std-882b-frequency`
- `series-parallel-reliability`
- `ilo-guard-opening`

### PR #47: 법령·KEC·안전기준 챕터 14개

- 화학: `chemical-classification`, `water-prohibited-extinguishers`
- 건설: `fall-prevention-equipment`, `gangway-ladder-standard`, `pile-driver-stability`, `tower-crane-wind-limits`, `walkway-board-standard`
- 전기: `lightning-protection-standard`, `low-voltage-insulation`
- 기계: `balance-flange-diameter`, `grinder-exposure-angle`, `roller-stop-rope-standard`, `safety-certification-8`
- 안전관리: `safety-education-hours`

각 페이지에 제목, summary, 본문, 출제 코멘트와 완료 상태를 반영했다. 기출 당시 조문·교육 주기·품목 수와 현행 기준이 다른 경우에는 별도 절로 구분했다.

## 3. 공식 기준 대조

숫자, 단위, `이상`·`초과`, 적용 범위와 예외는 다음 공식 원문을 기준으로 확인했다.

- [산업안전보건기준에 관한 규칙](https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=273603): 추락방지, 타워크레인 풍속, 항타기·항발기, 현문 사다리와 위험물질 분류
- [가설공사 표준안전 작업지침](https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000186031&chrClsCd=010201): 통로발판 20cm 이상·1.6m 이내와 지침의 지도·권고 성격
- [한국전기설비규정 공식 공고](https://kec.kea.kr/sub_tech/regulation_all.php?b_name=report2&mode=view&number=2454&page=1) 및 [전기설비 검사·점검기준](https://www.law.go.kr/LSW/flDownload.do?flSeq=143527963): KEC 피뢰시스템과 20·30·45·60m 회전구체 반지름
- [저압전로 절연저항 공식 기준](https://www.law.go.kr/LSW/flDownload.do?bylClsCd=200201&flNm=%5B%EB%B3%84%ED%91%9C+3%5D+%EC%A0%95%EA%B8%B0%EC%A0%90%EA%B2%80+%EB%B6%80%EC%A0%81%ED%95%A9+%EC%A0%84%EA%B8%B0%EC%84%A4%EB%B9%84+%EC%B2%98%EB%A6%AC%EB%B0%A9%EB%B2%95&flSeq=158119685): SELV·PELV 0.5MΩ, 그 밖의 저압전로 1.0MΩ
- [산업안전보건법 시행규칙 별표 4](https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=156407811&gubun=): 현행 반기·계약기간별 안전보건교육 시간
- [산업안전보건법 시행령 제74조](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029274905): 현행 안전인증대상 방호장치 9개 항목
- [위험물안전관리법 시행규칙 제41조](https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016747003) 및 [소방청 위험물정보](https://hazmat.nfa.go.kr/contents.do?contentsNo=35): 제3류 금수성 물질 소화설비의 적응성

기출 계산값이나 과거 조문을 현행 현장 기준으로 단정하지 않도록 적용 주의를 함께 표시했다.

## 4. 검증 결과

- `git diff --check`: 성공
- `questions.json` JSON parse: 성공
- 전체 문제: 1,680개
- 문제 ID 중복: 0건
- 전체 챕터: 250개
- 완료 챕터: 216개
- 미시작 챕터: 34개
- 존재하지 않는 관계 ID: 0건
- 챕터 내부 문항 중복: 0건
- 과목·문항 관계 불일치: 0건
- 존재하지 않는 related slug: 0건
- 인접 문항 및 `questions.json`: 변경 없음
- `npm ci`: 성공
- `npm run build`: 227페이지 성공
- `npm run check:seo`: HTML 227개, sitemap URL 228개, 경고 0개, 오류 0개
- `npm run check:public-content`: HTML 227개, 오류 0개

첫 공개 콘텐츠 검사에서 본문에 내부 식별자 `20180819_048`이 노출된 1건을 발견했다. 공개 문장에서는 `2018년 8월 시행 48번 문항`으로 바꾸고 재빌드·재검사해 오류 0건을 확인했다.

## 5. PR·리뷰·CI·병합

| 작업 | PR | 작업 커밋 | 기술 리뷰 | SEO validation | Squash merge |
|---|---:|---|---:|---:|---|
| 관계 정리·흡수 | #42 | `1b326c395f3bde4826e24927a49e00e890c056ae` | PASS `4846065904` | `30829607268` (#172) 성공 | `fcfd438636b376f7f65999792d5e7e73e420769e` |
| 일반 챕터 4개 | #43 | `b5952980cb72625fbd681ce86d4b4397987f5f51` | PASS `4846141495` | `30830285805` (#173) 성공 | `2f36b3e8d6c0b22ab6cfec716afa22ac033cc083` |
| 법령·안전 챕터 14개 | #47 | `c67f3062f338d60ce61355180318f2d762d39dbf` | PASS `4853784213` | `30905544812` (#177) 성공 | `caa7f9b10989ae788adcce2e9ff21a443354359c` |

PR #47 준비 중 `main`은 favicon 관련 PR #44~#46으로 `486e57a5356de3b8b87609f9472d44e16b301f3a`까지 이동했다. 변경 파일은 favicon 자산과 `BaseLayout.astro`였고 콘텐츠 범위와 겹치지 않았다. GitHub의 `mergeable=true`와 pull-request 병합 컨텍스트 CI 성공을 확인한 뒤 병합했다.

## 6. GitHub Pages·production

- Pages run #121: `30905652054`, `completed / success`
- build job `91979990108`: 성공
- deploy job `91980099330`: 성공
- 공식 production 도메인 `https://getpasslab.co.kr`에서 신규 공개 18개 URL 모두 HTTP 200
- 18개 페이지 모두 페이지별 제목·핵심 수치 또는 기준 문구 확인
- `sitemap-index.xml`, `sitemap-0.xml` 모두 HTTP 200
- 신규 공개 18개 URL 모두 sitemap 등재 확인

## 7. 남은 위험

- 기존과 동일한 텍스트 기출 공개 범위로 배포했으며 기출문제·이미지의 상용 이용 권리 위험이 해소된 것으로 기록하지 않는다.
- 이미지 원본이 없는 세 문항과 다른 이미지·OCR 의존 문항은 복원 전 비공개 원칙을 유지한다.
- `npm ci`의 `esbuild` 설치 스크립트 allowlist 안내는 남아 있으나 clean install, build, PR CI와 Pages 배포는 성공했다.
- 법령·KEC 콘텐츠는 확인일 기준 학습 자료다. 실제 현장 적용에는 최신 원문, 설비 조건, 예외와 제품 기준을 다시 확인해야 한다.

이번 게이트는 **VERIFIED**다. 남은 미시작 34개는 이번 21개 후보 게이트와 별개이며, 그중 흡수된 중복 역할 3개는 공개하지 않은 상태를 유지한다.

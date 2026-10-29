# 토스피드 vs GetPassLab — Cloud Browser 실측·조작 QA 후속 보고서

> **최신 후속:** [연결된 사용자 PC Chrome QA](2026-10-29-tossfeed-connected-pc-qa.md)에서 지정 4크기의 실측·캡처를 수행했다. 아래 ‘지정 크기 미확인’은 Cloud 검증 당시 상태다. native popup 등 남은 제약은 최신 보고서를 참조한다.

- 점검일: **2026-10-29 (KST)**
- 결론: **부분 완료 / 지정 PC·모바일 크기 추가 검증 필요**
- 이번에 완료한 범위: 실제 Cloud Browser의 데스크톱 화면 관찰·DOM 실측·탐색·기출·이미지·키보드 조작, 개선안 및 v1.3 보완
- 금지 범위 준수: 사이트 UI·GNB·콘텐츠·문제 데이터 변경 없음. main Merge 및 Production 배포 없음
- 선행 기록: [재검증](2026-10-29-tossfeed-reference-revalidation.md), [기존 부분 보고서](2026-10-29-tossfeed-pc-mobile-qa-partial.md)
- 후속 구현안: [UX/UI 개선 제안서](2026-10-29-tossfeed-ui-implementation-proposal.md)

## 1. 현재 상태와 자료 인수

| 조회 대상 | 이번에 실제 확인한 상태 |
| --- | --- |
| main HEAD | `6c70b14d1b94f1bcb0ca8035e1d7cf1866ac7631` |
| PR #208 | Open / Draft / 미병합 |
| 문서 브랜치 시작 HEAD | `codex/guide-refresh-20261029` / `4eda70ac05b7d0744cc26f556d4ae3363f01fc54` |
| 기존 PR 변경 | 9개 파일. AGENTS, CHAPTER_WRITING_GUIDE, standards 5개, audits 2개 |
| 지침 | main 및 문서 브랜치의 AGENTS.md 확인. 중첩 AGENTS.md 없음 |
| 인계 | main AI_HANDOVER.md의 최신 상단 기록과 이번 변경 관련 2026-10-26~28 목차·광고·그림 기록 확인. 문서의 배포 완료 표현 대신 현재 Production을 별도 확인 |
| 가이드 | README, site-design, ux-ui, content, copywriting v1.3 확인 |
| 대표 소스 | main의 global.css, GNB.astro, index.astro, BaseLayout.astro, ChapterLayout.astro 확인 |
| Git 상태 한계 | 이 Work 공간에는 시작 시 기존 Git 체크아웃이 없었음. GitHub의 원격 HEAD·PR 상태를 조회함. 사용자의 개인 PC 미커밋·미추적 파일을 조회한 것이 아님 |

기존 보고서의 정보구조·코드 정의 분석을 재사용했다. 이번 기록은 당시 불가능했던 실제 브라우저 조작을 보완한다. 이전의 “브라우저 기능 없음”은 당시 환경의 기록이며 이번 환경에는 적용되지 않는다.

## 2. 환경·뷰포트·측정 방식

**브라우저:** Work Cloud Browser / Chrome CDP. 사용자 PC Chrome 및 실물 Android/iOS 테스트가 아니다.

| 요청 조건 | 결과 | 사유 |
| --- | --- | --- |
| 1440×900 | 미확인 | 문서화된 제어 API에 뷰포트 변경·기기 에뮬레이션 기능이 없음 |
| 390×844 | 미확인 | 동일. 모바일 화면을 만들거나 크롭해 검증으로 대체하지 않음 |
| 320×700 | 미확인 | 동일 |
| 768×1024 | 미확인 | 동일 |
| 실제 사용한 기본 탭 | **1363×936, DPR 1** | 페이지의 innerWidth/innerHeight/devicePixelRatio 직접 조회 |
| 소방 문제풀이 새 창 | 조작 확인 / 정확한 viewport 미측정 | 별도 창으로 열림. 결과 캡처 파일은 1348×977px. 이 파일 치수를 viewport로 간주하지 않음 |

- **실제 렌더 측정:** DOM의 getBoundingClientRect 및 getComputedStyle. 표의 소수는 가독성을 위해 두 자리로 반올림했다.
- **코드 정의:** main CSS·컴포넌트의 선언. 브라우저 측정과 구별한다.
- **화면 관찰:** 캡처에서 읽기 순서·배치·현재 상태 확인.
- **추정값:** 사용하지 않았다. 반응형 전환점은 코드에서 확인한 값만 기록한다.
- 캡처 API의 이미지 파일 크기는 기본 탭에서 1348×926 또는 1353×929, 모달에서는 1363×936 등으로 반환됐다. 원본 바이트를 저장했다. **파일의 픽셀 크기를 CSS viewport로 역산하지 않는다.**
- 스크롤·SPA 이동 직후 관찰에는 이전 상태가 잠시 남았다. 최종 URL·DOM·새 캡처로 전환 결과를 확인했으며, 첫 즉시 응답만으로 실패 판정하지 않았다.
- [실측 원자료](2026-10-29-tossfeed-cloud-measurements.json)는 선택한 요소의 읽기 전용 측정 기록이다. 모든 조작의 전체 DOM 덤프나 전수 성능 기록은 아니다.

## 3. 실제 점검 URL

모든 아래 URL은 실제 브라우저로 열거나 조작 중 도착했다. 단순 코드 참조 URL과 구분한다.

| 대상 | URL | 확인 범위 |
| --- | --- | --- |
| 토스피드 메인 | https://toss.im/tossfeed | 첫 화면·상단 탐색·대표 콘텐츠 캡처 |
| 금융 카테고리 | https://toss.im/tossfeed/category/everyfinance | 추천 카드·제목·날짜·재진입 |
| 뉴스 필터 | https://toss.im/tossfeed/category/everyfinance/news?page=1 | 실제 선택 후 URL·목록 변경 |
| 정보형 아티클 | https://toss.im/tossfeed/article/money-policies-64 | 추천 카드 클릭·본문 실측·목차 클릭·스크롤·검색 패널 |
| GetPassLab 홈 | https://getpasslab.co.kr/ | 4개 자격증 카드·GNB·히어로 |
| 산업안전 목록 | https://getpasslab.co.kr/industrial-safety/written/ | GNB 키보드 진입·빈출 카드 |
| 산업안전 대표 | https://getpasslab.co.kr/industrial-safety/written/mechanical/boiler-safety-devices/ | 본문·표·기출·목차 |
| 산업안전 이동 | https://getpasslab.co.kr/industrial-safety/written/mechanical/drill-safety/ | GNB 목차 이동·뒤로가기 |
| 에너지 목록 | https://getpasslab.co.kr/energy-management/written/thermal-equipment/ | 그룹·챕터 카드 |
| 에너지 대표 | https://getpasslab.co.kr/energy-management/written/thermal-equipment/draft-flue-gas/ | 표·도식·확대·기출 |
| 컴활 목록 | https://getpasslab.co.kr/computer-literacy/written/ | 과목 선택 |
| 컴활 과목 | https://getpasslab.co.kr/computer-literacy/written/computer-basics/ | 챕터 선택 |
| 컴활 대표 | https://getpasslab.co.kr/computer-literacy/written/computer-basics/computer-classification/ | 표·본문·기출 키보드 조작 |
| 소방 목록 | https://getpasslab.co.kr/fire-safety-manager-level2/written/ | 과목 선택 |
| 소방 과목 | https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/ | 실무 챕터 선택 |
| 소방 대표 | https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/pump-test-piping-valves/ | 배관 그림·확대·표·연결 연습 |
| 소방 측면 이동 | https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/pump-performance-tests/ | PC 측면 목차 선택·뒤로가기 |
| 소방 연습 새 창 | https://getpasslab.co.kr/fire-safety-manager-level2/practice/?chapter=FSM2-035&popup=1 | 시작·1문항 응답·제출·정답/해설·창 닫기 |

Production은 현행 4자격증과 현행 공통 메뉴를 실제 렌더했다. “시설의 모든 것 / 자격증의 모든 것” 전환은 관찰되지 않았다. Production 빌드가 어떤 커밋에서 생성됐는지까지 이 화면만으로 증명하지 않으며, main 소스와 Production 관찰은 별도 근거로 취급한다.

## 4. 디자인 비교 — 실제 렌더 값

아래 값은 **기본 탭 1363×936에서 측정한 값**이다. 토스피드 전체 화면의 공통 규격이나 GetPassLab의 신규 디자인 토큰으로 확정한 값이 아니다.

| 지표·측정 요소 | 토스피드 | GetPassLab | 적용 판단 |
| --- | --- | --- | --- |
| 상단 탐색 | nav 높이 60px | nav.gnb-inner 64px, 바깥 header 65px | 코드 --gnb-h 64px과 border 포함 외곽 65px을 구별 |
| 넓은 화면의 콘텐츠 | 카테고리 H1/목록 폭 1048.80px, 왼쪽 x=152.09 | .container 폭 1200px, x=74; 내부 카드 시작 x=98 | 실제 폭. 토스피드의 최대 폭 선언은 확인하지 않음 |
| 카드 | 최초 지정 아티클 추천 카드 322.92×367.16px; 3열 x 간격에서 열 사이 40px 확인 | 홈 카드 373.33×204.38px; 간격 16px, padding 24px | 기사 추천 카드와 자격증 진입 카드의 역할이 다름 |
| 모서리 | 추천 썸네일을 감싼 overflow:hidden 프레임 16px. img 자체 0px | 카드 바깥 16px | 무엇을 측정한 radius인지 명시 |
| 썸네일 | 최초 추천 322.92×217.97px | 홈 카드에는 썸네일 없음 | 모든 자격증 카드에 이미지를 강제할 근거가 아님 |
| 카테고리/홈 제목 | 카테고리 H1 44px/61.6px, 600 | 홈 H1 40px/52px, 700 | 역할별 비교 |
| 추천 카드 제목·날짜 | 24px/33.6px, 600 / 날짜 15px/21px | 홈 카드의 실제 구성은 제목·설명·문항수 | 카드 메타 모두를 강한 스타일로 만들 필요 없음 |
| 아티클/챕터 H1 | 정보형 예시의 이미지 위 제목 56px/78.4px, 600 | 대표 4챕터 제목 40px/52px, 700 | 이미지가 큰 표지형 진입은 학습 상세에 그대로 적용하지 않음 |
| 읽기 폭 | 실제 본문 p 700px | article 880px; 산업안전·에너지·컴활의 일반 p 800px | 시설정보 본문과 학습 표·그림의 폭을 별도로 설계 |
| 본문·행간 | 일반 p 17px/27.2px, 400 | 산업안전·에너지·컴활 일반 p 16px/27.2px; 소방 첫 p 16px/25.6px, 절차 p 일부 14px/25.2px | 전역 토큰만으로 모든 본문을 대표할 수 없음 |
| 본문 소제목 | h3 24px/38.4px, 700, margin 24px 0 4px | 대표 H2 20px/26px, 600, 파란 배경 띠 높이 50px | 의미상 H레벨과 시각 스타일을 분리 |
| 문단 간격 | p margin 24px 0 8px | 소방 일반 p margin 16px 0 | 토스 수치를 일괄 복사하지 않음 |
| 색 | 본문 #333D4B, 소제목 #191F28, 날짜 #8B95A1, 목차 활성 #3182F6 | 본문 #333D4B, 제목 #191F28, 안내 #626D7A, H2 배경 #EFF6FF | 색이 비슷해도 위계·폭·콘텐츠 목적은 별도 |
| 표 | 해당 정보형 표는 이미지로 제공된 부분이 있어 HTML 표 수치 비교 안 함 | 산업안전·컴활·에너지 표 880px, 14px/23.8px | 이미지 표를 HTML 표 측정값으로 작성하지 않음 |
| 학습 그림 | 원본 일러스트와 본문 그림을 관찰 | 에너지 기본 도식 430×319.73px; 소방 대표 img 878×585.33px | 학습 도식의 의미·종횡비·확대 보호 |

### 코드에서만 확인한 반응형 값

| 항목 | main 코드 정의 | 실제 폭별 검증 |
| --- | --- | --- |
| GNB | 기본 56px / 768px 이상 64px | 1363px에서 64px만 확인 |
| 홈 카드 | 640px 미만 1열 / 640px부터 2열 / 1024px부터 3열 | 1363px의 3열만 확인 |
| 챕터 탐색 | 1024px부터 240px 측면 열; 1023px 이하 하단 바 | 데스크톱 측면만 조작 확인 |
| 상단 모바일 광고 | 320~767px에서 82px 예약, 내부 320×50 슬롯 | 해당 폭 미실행 |
| 모바일 목차 | 높이에서 하단 바·safe-area 공간 차감, 767px 이하 폭 제한 | 코드 정의만 확인 |

## 5. 실제 조작 QA

PASS는 아래에 적은 동작·조건에만 유효하다. “전체 사이트 PASS”나 “모바일 PASS”가 아니다.

| ID | 실제 시나리오 | 판정 | 확인 근거 |
| --- | --- | --- | --- |
| T01 | 메인 GNB에서 금융 카테고리 클릭 | PASS | 도착 URL·추천 목록·캡처 |
| T02 | 추천 카드에서 지정 정보형 아티클 클릭 | PASS | 도착 URL·제목·본문 |
| T03 | 아티클에서 브라우저 뒤로가기 | PASS | 금융 카테고리 복귀. 별도 F01 시각 문제는 아래 기록 |
| T04 | 뉴스 분류 클릭 | PASS | /everyfinance/news?page=1 및 목록 변경 |
| T05 | 검색 버튼으로 패널 열고 Escape 닫기 | PASS | 검색 입력·추천 패널 나타남/사라짐. 초점은 검색 트리거 내부 DIV로 관찰; 네이티브 button 자체 복귀라고 단정하지 않음 |
| T06 | 본문 PageDown 및 오른쪽 소제목 선택 | PASS | 스크롤 변화·선택 소제목 y=83.38; 본문 캡처 |
| G01 | 홈 GNB 클릭 열기 → Escape 닫기 | PASS | details.open=false, summary 초점 |
| G02 | summary Enter → Tab → Enter | PASS | 메뉴 열림·산업안전 링크 초점·필기 목록 도착 |
| G03 | 대표 챕터 GNB 목차 열기 | PASS | 현재 항목 aria-current와 목록 표시 |
| G04 | GNB 목차 드릴 안전 선택 → 뒤로가기 | PASS | drill-safety 도착 후 boiler-safety-devices 복귀 |
| G05 | 소방 목차 밖 H1 클릭 | PASS | details.open=false |
| G06 | PC 측면 목차 성능시험 선택 → 뒤로가기 | PASS | pump-performance-tests 제목·URL 도착 후 배관 챕터 복귀 |
| G07 | 산업안전 2022년 4월 45번 열기 → 정답 → Escape | PASS | 정답 라벨·레이어 닫힘·원래 문항 버튼 초점 |
| G08 | 에너지 2010년 3월 11번 열기 → 정답 → 닫기 버튼 | PASS | 정답 공개·dialog 닫힘·원래 문항 버튼 초점 |
| G09 | 컴활 2015년 3월 14번 Enter → Tab → Enter → Escape | PASS | 정답 버튼으로 초점·정답 라벨·문항 버튼 복귀 |
| G10 | 에너지 압입통풍 그림 열기 → Escape 및 닫기 버튼 | PASS | 이미지 dialog 열림·닫힘·원래 확대 버튼 초점. 확대 정도/안내는 F02·F03 |
| G11 | 소방 전체 판 열기 → 가로 이동 → Escape | PASS | 스크롤 영역 clientWidth=720, scrollWidth=1304; ArrowRight 후 scrollLeft=5; 원래 버튼 복귀 |
| G12 | 소방 연결 문제 링크 → 새 창 → 시작 | PASS | ?chapter=FSM2-035&popup=1, 36문항 연습 |
| G13 | 소방 1번 ④ 선택 → 제출 확인 → 채점 | PASS | 1정답·0오답·35미응답 및 정답/해설 표시. 전 문항 채점 정확성 전수 검증은 아님 |
| G14 | 소방 창 닫기 | PASS | 새 창 소멸·원래 챕터 링크 초점 유지 |
| F01 | 토스피드 카테고리 재진입 카드 배치 | **FAIL (해당 세션)** | 최초 약323px 균등 카드 → 뒤로가기/필터/재진입 후 첫 추천 카드124.59px·둘째 제목106.92px 등, 세 번째 카드 과확장; 재로드 시 균등 3열 회복 |
| F02 | 에너지 “확대” 전후 이미지 표시 크기 | **FAIL (확대 효용)** | 본문 430px → dialog 390px; 창은 열리지만 이 PC 조건에서 실제 그림은 작아짐 |
| F03 | 에너지 스크롤 안내와 실제 넘침 일치 | **FAIL (안내 정확성)** | clientWidth=scrollWidth=958, clientHeight=scrollHeight=314인데 좌우로 밀라는 안내가 계속 표시 |
| U01 | 지정 1440/390/320/768px 및 모바일 메뉴·하단 바·터치 | 미확인 | 뷰포트 변경/기기 에뮬레이션 API 없음 |
| U02 | 네 자격증 모든 이미지·팝업·문항 전수 | 미확인 | 대표 시나리오 표본 검사. 산업안전/컴활 선정 챕터에는 학습 그림 없음 |
| U03 | 소방 50문항 전체 모의고사·시간 만료·재응시 | 미확인 | 이번에는 연결 챕터 36문항 중 1개 응답 흐름만 실행 |
| U04 | 모든 모달의 Tab 순환·Shift+Tab·Space·보조기술 | 미확인 | 명시된 Tab/Enter/Escape 외 전수 접근성 검사 미실행 |
| U05 | 광고 CLS·모바일 가림·실제 수익 | 미확인 | 데스크톱의 본문 광고 표시만 관찰. 측정 구간 전반의 레이아웃 이동 계측 없음 |

### 결함 재현·해석

**F01 — 참고 사이트 카드 상태 변동**

메인 → 금융 카테고리 → 추천 아티클 → 뒤로가기 → 뉴스 필터 → 지정 아티클 → 뒤로가기 → 상단 금융 카테고리 재진입 중 관찰했다. 동일 기본 viewport에서 이미지와 카드가 비균등 폭으로 나타났다. 정확히 어느 이동 단계가 원인인지·전체 사용자에게 재현되는지는 확인하지 않았다. 새로고침 후 정상 3열로 돌아왔으므로 영구적인 디자인 규칙으로 해석하지 않는다. GetPassLab의 결함으로도 기록하지 않는다.

**F02·F03 — GetPassLab 이미지 viewer**

URL: 에너지 통풍 챕터. ② 압입통풍의 확대 버튼을 누른다. native 390×290 도식이 본문에서는 430px로 표시되지만 viewer는 390px다. viewer region은 가로 넘침이 없는데도 스크롤 안내를 보여 준다. 기능을 없애거나 이번에 수정하지 않는다. 후속 제한적 학습 UI 개선에서 “원본 크기 보기” 문구 또는 실제 확대 동작, 넘침 조건부 안내를 검토한다. 소방의 큰 그림 viewer는 실제 가로 스크롤을 확인했으므로 같은 문제라고 일반화하지 않는다.

## 6. 주요 시각 차이와 적용 결정

1. 토스피드의 첫 화면은 대표 기사·추천·랭킹 등 콘텐츠 탐색이고 GetPassLab은 자격증 선택이다. 시설관리 홈은 기사 탐색 구조를 참고하되 자격증 홈의 선택 경로를 보존한다.
2. 기사형 본문은 700px 읽기 열, GetPassLab은 240px 챕터 측면 열과 880px 학습 영역이다. 표·공식·도식을 함께 읽는 학습 상세를 무조건 700px로 축소하지 않는다.
3. 토스피드에서는 본문 목차와 관련 시리즈가 읽기 연속성을 돕는다. 시설정보에는 글 안 소제목 목차를 검토하고, 학습 화면의 “다른 챕터 목록”과 구분한다.
4. GetPassLab의 파란 H2 띠·구분선·표·배지는 여러 역할을 가진다. 색을 없애기보다 섹션·주의·상태·분류의 역할을 정리한다.
5. 현행 홈은 자격증 첫 카드가 y=578.75에서 시작하고 히어로 소개·목록 소개·학습 방식에 메시지가 분산돼 있다. 소개 축약은 탐색 접근성을 높일 가설이며 클릭률 향상이 검증된 결과는 아니다.
6. 소방의 첫 본문과 절차 설명에 다른 글자 크기가 존재한다. 전역 body 토큰만 바꿔 모든 본문이 같아졌다고 판정하지 않는다.

## 7. 가이드 v1.3 충돌 검수

| 문서·항목 | 기존 내용 | 변경 이유 | 보완 후 기준 |
| --- | --- | --- | --- |
| 디자인 §2·§9 | 토큰 기준 및 화면 실측 미실행 | 실제 nav/header 및 과목별 p 스타일이 다름 | 코드값·실측값·역할별 override를 분리. 모든 본문 16px이라는 일반화 금지 |
| 디자인 §8·§9 | 추천·제목·여백 참고 | 동일 사이트에서도 재진입 카드 배치가 달라짐 | 정상·필터·뒤로가기·재로드 상태를 함께 확인. 고정 폭은 실제 카드 영역 기준 |
| UX §10 | 브라우저 조작 불가·모든 실측 미실행 | 이번 Cloud 환경에서는 실제 조작 가능 | 당시 이력은 보존하고 이번 고정 viewport의 PASS/FAIL을 연결. 지정 폭·모바일은 계속 미확인 |
| UX §5·§6 | 확대·스크롤 확인 | 기능은 열리지만 작은 도식이 더 작아짐 | 열림/닫힘과 실제 확대 효용·필요한 스크롤을 별도 검사 |
| 카피 §6·§8 | 문구가 실제 동작과 일치 | 넘침 없는 이미지에 좌우 이동 지시 | 안내는 실제 상태에서 필요할 때만. 서비스 전환/목차/기출 명칭 분리 |
| 콘텐츠 §8·§9 | 결론·조건·예외·근거, 학습 구조 보호 | 실제 기사도 표지형·긴 본문·시리즈 구성임 | 기존 원칙 유지. 시설정보용 결론/근거 우선 구성은 자체 선택이며 토스 전체의 공통 규칙이라고 하지 않음 |
| README | 전부 미실행인 v1.3 상태 | 최신 근거 진입점 필요 | 본 보고서 및 후속 구현 제안 연결 |

**규범 유지:** 기술 도식 의미색, 기출·정답·모의고사, Astro·URL·canonical 보호는 변경하지 않는다. 네 가이드에 날짜가 있는 후속 보완을 추가하며, 과거 감사 기록은 당시 결과로 남긴다.

## 8. 스크린샷·증거

요청한 모바일 캡처는 **미확보**다. 아래는 실제 Cloud 데스크톱 화면이며 모바일로 재분류하지 않는다. 새 문제풀이 창은 위 환경표의 별도 조건이다. 모든 이미지는 원본 JPEG이며 새로 제작한 목업이 아니다.

전체 14개 캡처의 파일명·이미지 치수·영구 접근 링크는 [캡처 목록](2026-10-29-tossfeed-cloud-screenshots.json)에 있다. 링크는 소유 계정에서 열람하는 증거이며 공개 GitHub 이미지 호스팅 링크가 아니다.

| 화면 | 실제 캡처 | 파일 픽셀 크기 |
| --- | --- | --- |
| 토스피드 메인 | [getpasslab-qa-toss-home.jpg](https://chatgpt.com/library?file_id=libfile_60845917e5c481918f938d28552bfca4&account_id=personal) | 1353×929 |
| 금융 카테고리 최초 | [getpasslab-qa-toss-category.jpg](https://chatgpt.com/library?file_id=libfile_0e3e7c1c57ec8191a4c26a0fb822e11b&account_id=personal) | 1353×929 |
| 정보형 아티클 표지 | [getpasslab-qa-toss-article.jpg](https://chatgpt.com/library?file_id=libfile_5ed21eb0ee348191b4e21a05b6177a48&account_id=personal) | 1353×929 |
| 정보형 본문·오른쪽 목차 | [getpasslab-qa-toss-body-visible.jpg](https://chatgpt.com/library?file_id=libfile_6f11bae9cdac81919d9c1768117430d6&account_id=personal) | 1353×929 |
| 카테고리 재진입 비균등 폭 | [getpasslab-qa-toss-category-return.jpg](https://chatgpt.com/library?file_id=libfile_0c1e08ee62a08191a584d411ba69b14c&account_id=personal) | 1353×929 |
| 카테고리 새로고침 회복 | [getpasslab-qa-toss-category-reload.jpg](https://chatgpt.com/library?file_id=libfile_e27768ebfab881918b5e1ad1f0a5d84a&account_id=personal) | 1353×929 |
| GetPassLab 홈 | [getpasslab-qa-gp-home.jpg](https://chatgpt.com/library?file_id=libfile_ee0babc7efe88191ba3805295d7b8cf7&account_id=personal) | 1348×926 |
| 산업안전 대표 | [getpasslab-qa-gp-industrial.jpg](https://chatgpt.com/library?file_id=libfile_0464305bf5d0819191ef31bc87224c64&account_id=personal) | 1348×926 |
| 컴활 대표 | [getpasslab-qa-gp-computer.jpg](https://chatgpt.com/library?file_id=libfile_dc8f668107d48191976ff37e623c4ced&account_id=personal) | 1348×926 |
| 소방 대표 | [getpasslab-qa-gp-fire.jpg](https://chatgpt.com/library?file_id=libfile_e2866c66ae88819182e493dc5400a71b&account_id=personal) | 1348×926 |
| 산업안전 정답 확인 | [getpasslab-qa-gp-question.jpg](https://chatgpt.com/library?file_id=libfile_1d59c21f01308191adbd62e0d1f47919&account_id=personal) | 1348×926 |
| 에너지 그림 viewer | [getpasslab-qa-gp-image-open.jpg](https://chatgpt.com/library?file_id=libfile_12e3806cfb2c8191abcee5939da8bd00&account_id=personal) | 1363×936 |
| 소방 그림 viewer | [getpasslab-qa-gp-fire-zoom.jpg](https://chatgpt.com/library?file_id=libfile_97f429f4e154819193318cfee8dbb2d1&account_id=personal) | 1363×936 |
| 소방 연습 결과 | [getpasslab-qa-gp-fire-result.jpg](https://chatgpt.com/library?file_id=libfile_52f091a3c1e881919b86ff7819a996be&account_id=personal) | 1348×977 |


## 9. 검증·다음 시작점

- 이번 검증은 **Production 대표 화면 조작**이다. 전체 회귀 QA 완료로 주장하지 않는다.
- 제품 코드가 바뀌지 않아 Astro Test/Build는 수행하지 않았다. 문서 링크·JSON 구문·변경 경로 및 원격 commit/PR 상태를 별도로 확인한다.
- 토스피드 좋아요·댓글 제출은 하지 않았다. 광고를 클릭하지 않았다.
- 학습 이미지 정본 v1.3 §5·§6·§9를 적용해 캡션 역할·표시 크기·확대 동작을 확인했다. 도식 기술 정확성 재감수·기출 정답 재검증은 이번 범위가 아니다.
- **실제 구현 시작점:** GNB 한정 시범. 두 서비스 표시와 자격증/챕터 하위 탐색을 함께 설계하고 기존 URL을 유지한다. 필수 1440×900·390×844·320×700 검증은 해당 크기를 제어할 수 있는 환경에서 통과한 뒤 구현 완료를 판정한다.
- 디자인 수치 전체 확정·모바일 QA 완료는 보류. 구현 가능한 기능·보호·완료 기준은 [제안서](2026-10-29-tossfeed-ui-implementation-proposal.md)에 정리했다.


### 문서 검증 기록

- 이번 커밋 대상: docs/ 아래 Markdown 8개 및 JSON 2개, 총 10개. 새 보고서·제안서·실측 JSON·캡처 목록 4개와 기존 가이드/부분 보고서 6개 보완.
- 원격 브랜치 파일 목록과 대조한 상대 링크: 깨진 경로 0개. 실측/캡처 JSON 구문 정상.
- 제품 src/public/config 및 문제 데이터 파일은 이번 커밋 대상에 없음. 원격 변경 파일 비교로 재확인한다.
- Astro Test/Build 및 전체 CI를 실행한 것으로 표기하지 않는다.

# 토스피드 vs GetPassLab — 연결된 PC Chrome 실측·조작 QA

- 점검일: **2026-10-29**
- 결론: **조사·실측·QA 기록·개선안 문서 완료 / PC 별도 창 입력 등 환경 제약은 미확인 유지**
- 최신 범위 대조: [남은 조작 후속 검증·완료 범위](2026-10-29-tossfeed-qa-scope-closure.md). 결함 수정이나 실제 UI 구현 완료를 뜻하지 않는다.
- 환경: 사용자 PC에 연결된 **Chrome 확장 브라우저**. Cloud Browser 검증과 별도다. 1440×900, 390×844, 320×700, 768×1024를 viewport override로 적용하고 `innerWidth/innerHeight`로 확인했다. DPR 1.
- 모바일 크기는 **PC 브라우저의 반응형 뷰포트 검사**다. 실물 모바일·터치·Safari 검증이 아니다. Chrome 정확한 버전·OS 버전은 수집하지 않았다.
- 범위: 8화면 × 4크기 = **32개 화면 조건**, 기준 캡처 32개 + 조작 캡처 7개(후속 키보드 초점 캡처1개 포함). 이 수치는 조작 전체를 32조건에서 반복했다는 뜻이 아니다.
- 이전 [Cloud QA](2026-10-29-tossfeed-cloud-browser-qa.md)의 1363×936 기록을 유지한다. 이 문서가 지정 크기 미실행 상태를 갱신한다.

## 1. 인수인계·Git 기준 및 변경 경계

원격 main은 시작·문서 반영 전 재조회에서 `6c70b14d1b94f1bcb0ca8035e1d7cf1866ac7631`로 유지됐다. PR #208은 Open / Draft / 미병합, 작업 시작 head는 `cb7897715ee8cd90237e6b5d88446cf6d90ca04f`다. 직전 문서 커밋 `4eda70ac` 뒤에 Cloud QA 문서 커밋이 추가돼 있었다.

AGENTS.md, main의 AI_HANDOVER.md, PR 상태·변경 파일, v1.3 운영 가이드 4종과 README, 재검증·부분 검증·Cloud 후속 보고서·구현 제안을 확인했다. main의 global.css, GNB.astro, index.astro, BaseLayout.astro, ChapterLayout.astro에 대한 직전 소스 검토는 main이 같아 재사용했다. 학습 이미지 정본 learning-image-design-system-v1.md v1.3의 §5·6·9를 확인하고 최종 표시 폭·캡션·확대·반응형 검수 기준을 적용했다. 도식의 기술적 정확성이나 정답을 이번 화면 QA로 재인증하지 않는다.

**원격 Git 상태 확인**이며 사용자 PC의 로컬 checkout/미커밋 파일을 검사한 것이 아니다. Production 렌더링과 main 소스 정의를 구분한다. 이번 후속 변경은 docs/ 문서·JSON뿐이다. UI·GNB·콘텐츠·문항·이미지 원본 수정, main Merge, Production 배포는 하지 않는다.

## 2. 실제 점검 URL

아래 기본 8개 URL은 모두 1440×900·390×844·320×700·768×1024에서 렌더링/DOM을 확인했다.

| 화면 ID | 실제 URL |
| --- | --- |
| toss-home | https://toss.im/tossfeed |
| toss-category | https://toss.im/tossfeed/category/everyfinance |
| toss-article | https://toss.im/tossfeed/article/money-policies-64 |
| gp-home | https://getpasslab.co.kr/ |
| gp-industrial / 산업안전기사 | https://getpasslab.co.kr/industrial-safety/written/mechanical/boiler-safety-devices/ |
| gp-energy / 에너지관리기능사 | https://getpasslab.co.kr/energy-management/written/thermal-equipment/draft-flue-gas/ |
| gp-computer / 컴퓨터활용능력 2급 | https://getpasslab.co.kr/computer-literacy/written/computer-basics/computer-classification/ |
| gp-fire / 소방안전관리자 2급 | https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/pump-test-piping-valves/ |

조작으로 추가 방문한 URL은 다음과 같다.

| 경로 | 조건·목적 |
| --- | --- |
| https://getpasslab.co.kr/industrial-safety/written/ | 390×844, 홈 자격증 카드 클릭 목적지 |
| https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/pump-performance-tests/ | 1440×900, PC 측면 목차 클릭→뒤로가기 |
| https://getpasslab.co.kr/fire-safety-manager-level2/written/fire-safety-practice/pitot-nozzle-pressure-test/ | 320×700, 하단 다음 챕터→뒤로가기 |
| https://getpasslab.co.kr/fire-safety-manager-level2/practice/?chapter=FSM2-035&popup=1 | 390×844, 별도 창 진입 및 동일 URL의 일반 탭 답안·채점 검사 |

토스 추천 콘텐츠는 재로드 시 바뀌었다. 카드 수치는 해당 시점의 표본이며 고정 추천 글 목록을 보장하지 않는다.

## 3. 캡처와 원자료

- [39개 원본 캡처·실측 JSON ZIP](https://chatgpt.com/library?file_id=libfile_9ef7c097654481918136dcc158952699&account_id=personal)
- [PC 토스 카테고리 1440×900](https://chatgpt.com/library?file_id=libfile_d72ead67d1988191af2cca757425e51b&account_id=personal)
- [모바일 크기 토스 카테고리 390×844](https://chatgpt.com/library?file_id=libfile_83756188f5d08191a0e89082a71f4a14&account_id=personal)
- [PC GetPassLab 소방 1440×900](https://chatgpt.com/library?file_id=libfile_f940c8dace548191923d4009a55bb0ad&account_id=personal)
- [모바일 크기 GetPassLab 소방 390×844](https://chatgpt.com/library?file_id=libfile_f0dec6ff503081918bd1ccca82476401&account_id=personal)
- [추가 키보드·native popup 재시도 원자료](2026-10-29-tossfeed-remaining-interactions.json)
- [렌더 실측·조작 원자료](2026-10-29-tossfeed-connected-pc-evidence.json)
- [캡처 파일 목록·실제 이미지 크기·제약](2026-10-29-tossfeed-connected-pc-screenshots.json)

파일명은 화면·실제 viewport를 포함한다. 확장자는 이미지 바이트 형식을 확인해 지정했다. 캡처를 편집/합성하지 않았다. 스크롤된 모달은 문서 좌표의 현재 viewport 영역으로 캡처했다. 초기 잘못된 clip·스크롤 전환 중 캡처는 기준 세트에서 제외했다.

768×1024의 일부 캡처는 하단에 브라우저 캡처의 미도장 회색 영역이 있어 완전한 화면 증거로 쓰지 않는다. DOM 실측은 별도로 확보했다. gp-fire-menu-390 캡처의 배경 도식은 첫 로드 실패 상태이므로 메뉴 경계 증거로만 사용한다. 정상 소방 기준 화면은 이미지가 로드된 뒤 다시 캡처했다.

## 4. 실측 비교

아래 값은 **실제 렌더링 DOM**의 getBoundingClientRect / getComputedStyle 값이다. 단위는 CSS px이며 표에서는 소수 둘째 자리까지 반올림한다. viewport와 문서 clientWidth는 일반 스크롤바 때문에 다르다. 토스는 대체로 10px, GetPassLab은 15px 차이가 있었다. 서로 다른 clientWidth를 콘텐츠 여백으로 오인하지 않는다.

### 4-1. 핵심 비교값

| 항목 | 토스피드 | GetPassLab | 해석 |
| --- | --- | --- | --- |
| PC GNB | 60 | 내부64 / 바깥 header65(경계 포함) | 단순 높이 복제보다 서비스/학습 탐색의 공존 우선 |
| 모바일 GNB | 60 | 내부56 / 바깥57 | 실제 콘텐츠 시작과 광고 공간을 함께 검수 |
| PC 목록 카드 | 약322.92×367.16, 인접 간격40 | 홈373.33×204.38, 간격16, radius16 | 기사형/학습 진입형 카드 목적이 다름 |
| 390 목록 | 본문 목록332폭, 이미지100×67.5, 제목16/22.4, 날짜13 | 홈327×197.08 | 토스는 좁은 화면에서 압축된 목록 형태 |
| 320 목록 | 본문 목록262폭, 이미지100×67.5 | 홈257×197.08 | 긴 제목·줄 수·요약 길이를 별도로 설계 |
| 제목 | 카테고리 PC44/61.6, 모바일28/39.2; 기사 PC56/78.4, 모바일32/43 | 홈·챕터 PC40/52, 모바일28/36.4 | 제목 역할을 구분, 수치를 공통 강제하지 않음 |
| PC 본문 | 지정 기사 일반 문단700폭,17/27.2 | 일반 학습3종800폭,16/27.2; 소방880폭,16/25.6 | 과목별 특수 스타일과 표/도식 폭을 보호 |
| 390 본문 | 지정 기사 일반 문단380폭,17/27.2 | 일반3종327폭,15/25.5; 소방327폭,15/24 | 토스 문단 박스의 x=0; 실제 글리프 여백과 동일하다고 단정하지 않음 |
| 320 본문 | 일반 문단310폭,17/27.2 | 일반3종257폭,15/25.5; 소방257폭,15/24 | PC viewport의 전통적 스크롤바 환경 |
| 에너지 그림 | 기사 이미지와 학습 도식은 역할이 다름 | PC 본문430→viewer390; 320 본문255→viewer390 | 확대 효용은 그림/화면별로 판정 |
| 소방 그림 | 해당 없음 | 본문 PC878, 390에서325, 320에서255 | 작은 화면은 확대 진입과 내부 스크롤 필요 |

소방의 그림 주변 안내 문단 표본은 13/20.8이었다. 그림 카드 제목과 안내 문단의 역할을 구분한다. 카드 높이는 해당 텍스트 내용에 의존한다. 토스 모바일 목록 첫 표본 높이는 97.16, 긴 제목은 119.55 이상이었다. 카드 높이를 고정 디자인 토큰으로 채택하지 않는다.

### 4-2. 문서 너비·가로 넘침 전수 표본

표 값은 **clientWidth / scrollWidth**다. 32조건의 세부 요소는 원자료 rows에 있다.

| 화면 | 1440×900 | 390×844 | 320×700 | 768×1024 |
| --- | --- | --- | --- | --- |
| Toss 홈 | 1430 / 1430 | 380 / 380 | 310 / 310 | 758 / 758 |
| Toss 카테고리 | 1430 / 1430 | 380 / 380 | 310 / 310 | 758 / 758(안정 후 재검) |
| Toss 기사 | 1430 / 1435 | 380 / 380 | 310 / 310 | **758 / 980** |
| GP 홈 | 1425 / 1425 | 375 / 375 | 305 / 305 | 753 / 753 |
| GP 산업안전 | 1425 / 1425 | 375 / 375 | **305 / 320** | 753 / 753 |
| GP 에너지 | 1425 / 1425 | 375 / 375 | **305 / 320** | 753 / 753 |
| GP 컴활 | 1425 / 1425 | 375 / 375 | **305 / 320** | 753 / 753 |
| GP 소방 | 1425 / 1425 | 375 / 375 | **305 / 320** | 753 / 753 |

토스 카테고리768의 첫 측정은 scrollWidth939였으나 안정 후 재로드에서758로 회복됐다. 지속 결함으로 확정하지 않는다. 토스 기사768은 재검에서도980이었고, article 내 목차 박스 x790.44·폭190이 관찰됐다. PC1440 기사에는5px 차이도 남았다. 참조 사이트의 가로 넘침까지 도입 기준으로 가져오지 않는다.

### 4-3. 코드 정의값·관찰값·미측정 구분

| 증거 종류 | 내용 |
| --- | --- |
| 코드 정의값 / main | container max1200, 좌우 padding24; GNB56→768이상64; 홈 grid640에서2열/1024에서3열; 측면 챕터 탐색1024이상; 하단 학습 nav1023이하 |
| 코드 정의값 / main | 모바일 상단 광고 표시320~767, mount width min(320px,100%); 하단 nav 예약72+safe-area 및 목차 max-height 계산 |
| 실제 렌더 / Production | 광고 내부 INS/iframe 고정320px와 문서 client305px가 함께 관찰됨. 소스의 바깥 mount 제한만으로 내부 iframe을 제한한다고 볼 수 없음 |
| 색 / 실제 렌더 | 토스 이번 세션은 dark/system 상태, 기사 문단 rgb(228,228,229). GP 문단 rgb(51,61,75), 홈 카드 rgb(255,255,255) |
| 색 / 코드 정의 | GP body 배경 #F9FAFB, 일반 text #333D4B, primary 등은 기존 가이드의 main 토큰 표 유지 |
| 화면 관찰 | 토스 로고·주제 영역·검색, 모바일 메뉴와 분류 칩, PC 추천·목록 위계. GP 파란 H2 띠·정보 박스·표·기출·학습 도식이 한 읽기 흐름에 혼재 |
| 미측정 | Toss의 정확한 breakpoint 경계, 모든 섹션 간격·카드 radius·전 색상 토큰, 실제 글리프 폭·폰트 로드 검증, 모든 표/이미지·모바일 safe-area |
| 추정값 | 임의 픽셀값 없음. 원인 해석이나 신규 설계 후보는 실측값과 구분 |

4개 뷰포트의 차이로 Toss 전환 구간을 볼 수는 있으나 정확한 breakpoint를 역산하지 않는다. GP 768에서 desktop형 GNB·40px 제목이 실제 적용됐고 이는 main의768 정의와 일치한다. Production이 해당 commit으로 배포됐다는 동일성 증명과는 다르다.

## 5. 조작 QA

PASS는 아래 명시한 동작·조건에만 해당한다. 전 페이지/전 문항/모든 크기의 전수 통과가 아니다.

| 대상·조건 | 실제 조작 | 결과 | 근거·한계 |
| --- | --- | --- | --- |
| Toss390 | 모바일 메뉴 클릭 열기·닫기, 금융 카테고리 이동 | PASS | 실제 URL·목록 변화 확인 |
| Toss390 | 열린 모바일 메뉴 Escape | **FAIL** | 메뉴가 유지됨. 토글 클릭으로 닫음 |
| Toss1440 | 카테고리 카드→지정 기사→브라우저 뒤로가기 | PASS | 목적 URL/제목·원래 카테고리 확인 |
| Toss1440 | 위 왕복 전후 추천 카드 폭 | PASS(이번 경로) | 322.92/322.94로 유지. 이전 Cloud의 복합 재진입 불균등은 이번 단순 경로에서 미재현 |
| Toss1440 | 검색 열기·Escape 닫기 | PASS | 검색 입력 사라짐 |
| Toss1440 | 검색 닫은 뒤 초점 복귀 | **FAIL** | activeElement BODY, 검색 trigger로 복귀하지 않음 |
| GP 홈390 | GNB Enter 열기·Escape 닫기, 산업안전 카드 클릭 | PASS | 실제 필기 목록 URL 진입 |
| GP 산업안전·에너지·컴활390/320 | 챕터 메뉴 Enter/Escape; 기출 버튼 Enter/클릭→정답 공개→Escape | PASS | 열린 상태·정답 표시·닫힘·정확한 opener 초점 복귀 확인 |
| GP 컴활390 | 정답 Enter, 닫기 Enter | PASS | 정답 표기·닫힘·기출 버튼 복귀 확인 |
| GP 컴활390 | 마지막 닫기에서 Tab·Shift+Tab 순환 | PASS | [후속 K01·K02](2026-10-29-tossfeed-qa-scope-closure.md)에서 순·역방향 반복 관찰. BODY를 경유해 레이어 내부로 돌아왔고 배경 컨트롤 접근 없음. 브라우저 UI 초점은 미확인 |
| GP 컴활390 | 정답에서 Shift+Tab | PASS | 모달 안 닫기로 이동. 전체 포커스 트랩 통과와 구분 |
| GP 소방1440 | 측면 목차 다른 챕터 선택→뒤로가기 | PASS | pump-performance-tests와 원래 챕터 확인 |
| GP 소방320 | 하단 다음 챕터→뒤로가기 | PASS | pitot-nozzle-pressure-test와 원래 챕터 확인 |
| GP 에너지1440 | ② 압입통풍 그림 확대 | **FAIL(확대 효용)** | 본문430→viewer390으로 줄어듦. 열림 자체와 구분 |
| GP 에너지320 | 그림 확대→가로 키보드 스크롤→Escape | PASS | 본문255→390; region302/414, ArrowRight 후 scrollLeft40; opener 초점 복귀 |
| GP 소방320 | 그림 확대→가로·세로 스크롤→Escape | PASS | region267/1304·557/631; 이동값40/74. 닫힘·opener 복귀 |
| GP 소방390 별도 창 | 연결 기출 창 열기 | PASS | FSM2-035 popup URL의 새 창/탭 생성 |
| GP 소방390 별도 창 | 시작·사이트 닫기 제어 | **미확인** | Input.dispatchMouseEvent 타임아웃, Enter 후 가시 전환 없음. 브라우저 API로 창을 정리했으므로 사이트 닫기 PASS 아님 |
| GP 소방390 일반 탭 | 같은 popup URL 시작→답1개 선택→다음/이전 | PASS | checked1 유지 |
| GP 소방390 일반 탭 | 제출→미응답 안내→계속 풀기→재제출·채점 | PASS | 취소 후 답 유지, 결과 정답1·오답0·미응답35 및 해설 표시 |

기출 표본 opener는 산업안전 ‘2022년 4월 시험 45번’, 에너지 ‘2010년 3월 시험 11번’, 컴활 ‘2015년 3월 시험 14번’이었다. 소방 일반 탭 검사에서36문항 중1문항만 선택했다. 모의고사 전체·시간 종료·50문항 완주를 검증한 것이 아니다. 토스 좋아요·댓글 제출·광고 클릭은 하지 않았다.

## 6. 결함·관찰 및 재현 기준

| ID | 판정·우선순위 | 관찰·재현 | 후속 완료 기준 |
| --- | --- | --- | --- |
| PC-F01 | FAIL / P1 | GP 4챕터320에서 client305·scroll320. 광고 iframe/INS320, 본문 광고 mount320이 함께 관찰됨 | 광고 영역을 유지하면서 문서 가로 넘침0. 고정폭 광고 수용 방식은 광고 정책/기능 확인 후 결정. 전통적/오버레이 스크롤바 양쪽 검사 |
| PC-F02 | FAIL / P1, F01 연관 가능 | 320 목차 bottom620, 하단 nav top619.36: 약0.64 겹침. 390은 bottom764→nav778.36으로14.36 간격 | 긴 목차 끝 항목 접근, 하단바와 최소8px의 설계 여백. 실제 clientHeight·가로 스크롤바·safe-area 반영 검수 |
| PC-F03 | FAIL / P2, 기존 F02 재현 | PC 에너지 도식430→viewer390. 모바일320은255→390으로 실제 확대 | ‘확대’면 작아지지 않고 상세 확인 가능. 기존 큰 소방 도식 스크롤·닫기·초점 보호 |
| PC-O01 | 개선 / P2, 기존 F03 재현 | 에너지1440 viewer region958/958,314/314로 넘침 없는데 좌우 이동 안내 | 실제 가로/세로 넘침에 맞는 안내. 넘침 없으면 이동 안내 생략 |
| PC-O02 | 일시적 로딩 실패 / 재현 미확정 | 소방390 첫 이미지 complete true·naturalWidth0. reload 후1536으로 회복, 후속 정상 캡처 | 후속 재진입·느린 연결 재검. 이번 증거만으로404나 영구 파일 손상 주장 금지 |
| PC-O03 | 콘텐츠·카피 개선 / P1 | GP 홈320에서 긴 H1 마지막 ‘터’가 한 글자 줄로 분리. 첫 카드 y659.92,390은597.94 | 사용자 행동이 빠르게 드러나는 짧은 제목·설명,320에서 불필요한 한 글자 고립 줄 완화. 자격증 범위/SEO 보호 |
| REF-F01 | 참조 사이트 결함 | Toss390 메뉴 Escape 미닫힘,1440 검색 초점 미복귀 | GetPassLab 새 GNB는 닫힘과 opener 복귀를 별도 통과. 참조 UI의 결함은 복제하지 않음 |
| REF-O02 | 참조 사이트 폭 문제 | Toss 기사768 scroll980/client758,1440도5 차이. 카테고리768 초기 넘침은 재로드로 해소 | 신규 상세 목차는 본문을 가로 밀지 않음. 동적 로드·뒤로가기·재로드 후 검사 |

F01의 광고는 **원인 후보와 관찰된 기하 관계**다. 광고 차단·CSS 임시 변경으로 인과를 분리하지 않았으므로 유일한 원인이라고 확정하지 않는다.320 PC 스크롤바 환경의 결과를 실물 모바일 발생률로 확대하지 않는다. 표 자체의 내부 가로 스크롤과 문서 전체 넘침도 구분한다.

## 7. UX/UI 개편 기준과 v1.3 검수

구현 상세·보호 기능·난이도·완료 기준은 [개편 제안](2026-10-29-tossfeed-ui-implementation-proposal.md)을 갱신했다.

| 영역·가이드 항목 | 기존 내용·검수 결과 | 수정 이유 | 수정 후 기준 |
| --- | --- | --- | --- |
| 운영 README·각 가이드 후속 상태 | ‘지정 PC·모바일 미확인’ | 이번32조건 확보 | PC Chrome viewport 검사 완료·남은 실물 기기/별도 창 제약을 구분 |
| 디자인 §6·v1.3 시각 QA | 숫자 임의 복제 금지, 지정 폭 전 확정 금지 | 원칙 유효. 모바일 목록·서로 다른 본문 폭을 실제 확인 | 표본값을 역할별 후보로 사용. GP 고유 토큰·학습 특수 스타일 보호 |
| UX §4·6 및 모바일 완료 기준 | 모바일 필수 행동 가능, 기존 목차 보호 |320 광고/하단바 경계 문제, 참조 Escape/초점 문제 | 문서 넘침·목차 끝 항목·메뉴 닫힘·opener 복귀를 따로 검수 |
| 콘텐츠 §화면별 목적·중복 안내 | 홈에서 선택 목표 우선 |390/320 첫 카드 위치·320 제목 줄바꿈 확인 | 짧은 설명 뒤 실제 자격증 선택. 세부 학습 방식은 후반으로 |
| 카피 §CTA·상태 안내 | 실제 기능에 맞는 문구 | desktop ‘확대’ 축소, 넘침 없는 이동 안내 | 화면별 확대 효용과 실제 scroll 상태에 맞게 이름/안내 결정 |
| 학습 이미지 정본 v1.3 §5·6·9 | 최종 표시 크기·390/320 검수 | 확대 기준과 충돌 없음 | **정본 개정 없음**. 기존 기준 미충족 사례를 QA/개편 제안에 기록 |

가이드 버전 v1.3은 유지하고 PC 후속 근거를 보완한다. 토스 원본 디자인 자산·문구는 복제하지 않는다. 700~760px 본문·17px 등 제안값은 GetPassLab 설계 후보이며 이번 실측이 모든 화면의 정답값을 확정하지 않는다.

## 8. 후속 구현 순서·미확인

1. **1차 GNB**: ‘시설의 모든 것 / 자격증의 모든 것’, 현재 서비스 표시, 모바일 메뉴와 학습 챕터 목차의 공존. P0, 난이도 중~상. 광고/하단바/초점 회귀 포함.
2. **2차 홈·목록**: 서비스 목적별 첫 화면, 대표 글·분류·제목·요약·날짜, 좁은 화면 압축 목록. P1, 중. 자격증 카드는 학습 진입 역할 유지.
3. **3차 시설 상세**: 조건부 결론·기준일·공식 근거·예외·표·이미지·관련 글/학습 연결. P1, 중. 법령/수치의 사실 검증은 별도.
4. **4차 학습 읽기 제한 개선**: 글자·여백·박스·표·viewer 효용/안내. P2, 중. 문제풀이·채점·모의고사 구조 제외.

아직 미확인인 항목은 실물 모바일/터치/Safari·Android/iOS, 모든 safe-area, native popup 시작·사이트 닫기 제어(PC 자동화 오류), 전 문항·전체 시험, 브라우저 UI 초점/스크린리더(문서 내 순환은 후속 표본 확인), 광고 노출 안정성·수익,768 캡처 하단의 완전한 페인트다. 모든 기능을 모든 viewport에서 전수 조작한 것도 아니다.

브라우저 viewport override는 종료 시 reset했고 이번에 만든 테스트 탭·팝업만 정리했다. 문서 상대 링크·JSON 구문을 확인한 뒤 기존 브랜치에 문서만 commit/push한다. Astro Test/Build는 제품 변경이 없어 미실행이며 CI·Merge·Deploy 성공을 주장하지 않는다.

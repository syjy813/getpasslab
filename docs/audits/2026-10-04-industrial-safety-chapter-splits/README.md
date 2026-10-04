# 산업안전기사 12개 챕터 분리 검토

- 사용자 승인 범위: 표의 12개 후보를 순차 분리. 기존 공개 식별자·문제 정본·이미지를 보호하며, 기존 재배포 요청 범위로 검증 후 Production 반영
- 기준 main: `a0727bf3c20c3e163be8c34948defb168b3b7587` / tree `3a18c79ee3bd79320346a695fe1ca3659ed419cc`
- 신규 공개 22개: 신규 파일 18개 + 기존 미시작 HAZOP·NDT·위험도·좌굴하중 4개
- 기존 12개 URL·제목·과목·그룹·order·priority 보존. THERP 기존 본문 보존, 개요로 돌아가는 관련 링크 추가
- 35개 검토 페이지·133개 서로 다른 기출 주 연결. 전체 산업안전 224→246개 공개, 주 연결 1004→1003개
- `20200822_031`이 비교와 THERP에 중복 배정되어 있던 주 연결 하나만 비교에서 제거. 기존 전역 고유 994문항 범위 보존; 정본 1680문항·답안·원본 이미지 불변

| 기존 챕터 | 세부 챕터 |
|---|---|
| [시스템 분석 기법 비교](https://getpasslab.co.kr/industrial-safety/written/ergonomics/system-analysis-techniques/) | [HAZOP·가이드워드](https://getpasslab.co.kr/industrial-safety/written/ergonomics/hazop-guidewords/) / [예비위험분석 (PHA)](https://getpasslab.co.kr/industrial-safety/written/ergonomics/pha-preliminary-analysis/) / [사건수 분석 (ETA)](https://getpasslab.co.kr/industrial-safety/written/ergonomics/eta-event-tree/) / [THERP·휴먼에러 정량화](https://getpasslab.co.kr/industrial-safety/written/ergonomics/therp-human-error/) |
| [터널·발파 안전](https://getpasslab.co.kr/industrial-safety/written/construction/tunnel-blasting/) | [발파 작업 안전](https://getpasslab.co.kr/industrial-safety/written/construction/blasting-safety/) / [터널 지보공 조립·점검](https://getpasslab.co.kr/industrial-safety/written/construction/tunnel-support-safety/) / [터널 조사·작업계획·계측](https://getpasslab.co.kr/industrial-safety/written/construction/tunnel-survey-monitoring/) |
| [동기부여 이론 (매슬로·맥그리거·허즈버그)](https://getpasslab.co.kr/industrial-safety/written/safety-management/motivation-theories/) | [매슬로 욕구 5단계](https://getpasslab.co.kr/industrial-safety/written/safety-management/maslow-needs/) / [허즈버그 위생·동기요인](https://getpasslab.co.kr/industrial-safety/written/safety-management/herzberg-two-factor/) / [맥그리거 X·Y 이론](https://getpasslab.co.kr/industrial-safety/written/safety-management/mcgregor-xy/) / [데이비스 동기부여 관계식](https://getpasslab.co.kr/industrial-safety/written/safety-management/davis-motivation/) |
| [반응기·증류탑·열교환기](https://getpasslab.co.kr/industrial-safety/written/chemical/reactor-distillation-equipment/) | [반응기 분류·설계 요인](https://getpasslab.co.kr/industrial-safety/written/chemical/reactor-classification/) / [열교환기 점검·열교환 능률](https://getpasslab.co.kr/industrial-safety/written/chemical/heat-exchanger-inspection/) |
| [재료 시험 종류](https://getpasslab.co.kr/industrial-safety/written/mechanical/test-types/) | [비파괴검사 종류](https://getpasslab.co.kr/industrial-safety/written/mechanical/ndt-types/) |
| [부주의 발생 원인·사고방지대책](https://getpasslab.co.kr/industrial-safety/written/safety-management/carelessness-misjudgment/) | [주의의 특성·의식 단계](https://getpasslab.co.kr/industrial-safety/written/safety-management/attention-consciousness/) |
| [누전차단기 구조·정격·시설기준](https://getpasslab.co.kr/industrial-safety/written/electrical/leakage-breaker-types/) | [누전차단기 구조·동작](https://getpasslab.co.kr/industrial-safety/written/electrical/leakage-breaker-operation/) / [누전차단기 정격·설치 기준](https://getpasslab.co.kr/industrial-safety/written/electrical/leakage-breaker-ratings/) |
| [가설통로·계단 기준](https://getpasslab.co.kr/industrial-safety/written/construction/temporary-passage-stairs/) | [계단·계단참 강도 기준](https://getpasslab.co.kr/industrial-safety/written/construction/stairs-landings/) |
| [리더십·헤드십](https://getpasslab.co.kr/industrial-safety/written/safety-management/leadership-headship/) | [관리격자 리더십 5유형](https://getpasslab.co.kr/industrial-safety/written/safety-management/managerial-grid/) |
| [해체 작업 안전 조치](https://getpasslab.co.kr/industrial-safety/written/construction/demolition-safety-measures/) | [거푸집 해체 작업](https://getpasslab.co.kr/industrial-safety/written/construction/formwork-removal/) |
| [동바리 안전기준](https://getpasslab.co.kr/industrial-safety/written/construction/shore-safety-standard/) | [오일러 좌굴하중 (Pcr)](https://getpasslab.co.kr/industrial-safety/written/construction/euler-buckling-load/) |
| [연소 범위와 위험성](https://getpasslab.co.kr/industrial-safety/written/chemical/combustion-range-risk/) | [위험도 (H)](https://getpasslab.co.kr/industrial-safety/written/chemical/hazard-index/) / [혼합가스 폭발하한·상한 계산](https://getpasslab.co.kr/industrial-safety/written/chemical/mixed-gas-explosion-limits/) |

## 집필·축약 판단

- 정본의 문제·선택지·답안을 12개 본문과 대조. 문항별 새 배정 및 학습 절은 `question-coverage.json`
- 비교가 필요한 최소 단서는 개요에 유지하고 세부 판단은 개별 챕터에서 설명. 반복 시험 포인트 표·정답 번호 나열·실무 배경 제거
- 시스템 분석의 인간신뢰도 세부 설명은 기존 THERP에 맡김. PHA 4범주·ETA 초기 사건·HAZOP 6가이드워드는 독립 주제
- 터널의 수직구명줄·다이너마이트 융해 등 해당 16문항의 판단에 없는 별도 내용을 제거
- 반응기 개요의 분리장치·집진·건조설비 분류는 해당 9문항의 판단에 없어 제외
- 부주의의 재해누발자·외적/내적 요인 전체 목록은 해당 8문항의 판단에 없어 제외. 주의 특성·Phase를 분리
- 동바리 설치와 양단 힌지 좌굴 계산을 분리. 기존 빈 Euler 페이지의 미배정 K값 4종은 이번 1문항에 필요 없어 확장하지 않음
- 연소범위의 누설/환기/경보 실무 목록은 해당 21문항의 판단에 없어 제외. 위험도와 혼합가스 식은 독립 계산 챕터
- 미공개 `flameproof-flange-distance` 관련 항목은 제거. 공개되지 않은 챕터로 새 링크를 노출하지 않음

## 근거·조건과 한계

- 주 근거: 위 main의 기존 본문 및 `src/data/questions/industrial-safety.json`. 기출 원문·선택지의 기존 오기와 결손은 이번 분리에서 수정하지 않음
- 법령 수치는 2018~2022년 연결 기출의 조건으로 구분. 현행 법령 전체 개정 검수나 실제 현장 시공 지침을 새로 작성한 작업이 아님
- 법제처 연혁 대조: https://www.law.go.kr/LSW/lsInfoP.do?efYd=20200420&lsiSeq=208417 및 https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20221018&lsId=&lsiSeq=245059&urlMode=lsEfInfoR&viewCls=lsRvsDocInfoR
- 안전보건공단 규칙 자료: https://www.kosha.or.kr/ebook/fcatalog/access/ecatalogt.jsp?Dir=633&callmode=normal&catimage=&eclang=ko&start=18&um=s
- 벤젠 하한의 기존 본문 1.2vol%와 정본 기출의 정답 1.5vol% 사이 조건 차이를 임의 보정하지 않음. 본문은 해당 기출 선택지가 1.5vol%임을 구분하며, 물성 원값 일반화/원본 PDF 원인 확인은 미실행
- 기존 이미지·자료 누락이나 OCR 오류를 새 도판으로 추정 복원하지 않음. 등록된 기출 도판만 동일하게 제공
- 신규/편집 학습 이미지 작업 없음. 기존 학습 이미지·렌더링 CSS·스키마·공개 컴포넌트·의존성 불변
- Euler 및 혼합가스 예시는 독립 수치 검산. 실물 스마트폰·원본 PDF 대조·학습자 정답률 검증 미실행

## 검증 상태

- 로컬 Build 449페이지 성공, SEO HTML451/sitemap450 오류0
- 새 분리 검사: 35개 URL·목차·sitemap·관련 링크·기출·684개 보호 파일 통과
- 기존 machine-tools, 재해분석 표, 컴활 publication/C1/001~081/082~159, 공개본문/deferred/대비 검사 통과
- 로컬 Chromium 실행 파일 부재로 브라우저 QA는 PR의 Actions 검증 환경에서 수행. 미실행을 로컬 QA 완료로 표시하지 않음
- PR CI 및 Production 결과는 PR 본문과 `VALIDATION.md`에 확정 기록 예정. 현재 Merge/Deploy 미실행

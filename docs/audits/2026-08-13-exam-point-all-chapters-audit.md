# 전체 공개 챕터 시험 포인트 QA 감사

- 기준일: 2026-08-13
- 공개 챕터: 239개
- 연결 기출 참조: 2507개
- 정답 선택지 완전 일치: 480개
- 정답 키워드 대조: 1283개
- 시험 포인트 표·정답 강조 누락: 0개
- 존재하지 않는 기출 ID 참조: 0개 챕터
- 키워드 대조율 25% 미만: 1개 챕터
- 본문 정답 근거 대조율 50% 미만: 12개 챕터
- 계산·법령 직접 검토 대상: 104개 챕터

## 판정 기준

- 완전 일치는 정답 선택지 전체가 시험 포인트 영역에 그대로 포함되는지를 보는 보수적 지표임
- 키워드 대조는 정답 선택지의 유효 토큰이 시험 포인트 영역에 존재하는지를 보는 후보 추출용 지표임
- 두 지표는 의미 일치나 정답의 정확성을 자동 확정하지 않으며, 계산·법령·부정형은 직접 검토가 필요함

## 확인된 질문 데이터 예외

| 문제 ID | 상태 |
|---|---|
| 20180304_036 | FTA 문제의 원본 도형 이미지가 질문 데이터에 없어 지문만으로 완전 복원이 불가능함 |
| 20220424_003 | 보호구 문제의 ㄱ·ㄴ·ㄷ·ㄹ 항목 내용이 질문 데이터에 누락됨 |
| 20180428_116 | 해체 순서 문제의 A·B·C·D 작업 정의 또는 이미지가 질문 데이터에 누락됨 |
| 20190804_105 | 타워크레인 지지 문제의 저장 정답 번호와 선택지 의미가 충돌할 가능성이 있어 원본 대조가 필요함 |
| 20200822_015 | 동기요인 문제의 저장 정답 선택지에 `쇼임감` 오탈자가 있으며 문맥상 책임감을 뜻하는 것으로 판단됨 |

## 대조율 해석 주의

- `boiler-water-treatment`는 수질 외에 수리·배관·난방 항목이 섞인 96개 과거 기출을 연결하고 있어 단일 시험 포인트 표와의 자동 키워드 대조율이 낮게 나타남
- 관계 데이터는 이번 작업의 동결 범위이므로 변경하지 않았으며, 수질 핵심과 반복 출제된 수리 안전 단서만 본문 목적을 해치지 않는 범위에서 보강함

## 우선 직접 검토 후보

| 챕터 | 기출 | 대조 | 플래그 |
|---|---:|---:|---|
| [보일러 수질관리](/energy-management/written/thermal-equipment/boiler-water-treatment/) | 96 | 22.9% | 정답 키워드 대조 낮음 · 본문 정답 근거 대조 낮음 · 부정형 49 |
| [보일러 기동·운전·정지](/energy-management/written/thermal-equipment/boiler-operation-maintenance/) | 60 | 25.0% | 부정형 42 |
| [전기화재 원인](/industrial-safety/written/electrical/electrical-fire-causes/) | 8 | 25.0% | 부정형 4 |
| [Jones 식 (폭발범위 추정)](/industrial-safety/written/chemical/jones-formula/) | 4 | 25.0% | 계산 직접 검토 |
| [항타기·항발기 무너짐·권상 기준](/industrial-safety/written/construction/pile-driver-stability/) | 4 | 25.0% | 법령 직접 검토 · 부정형 2 |
| [누전차단기 설치 불필요 조건](/industrial-safety/written/electrical/leakage-breaker-exception/) | 4 | 25.0% | 법령 직접 검토 · 부정형 1 |
| [증기·온수·복사난방](/energy-management/written/thermal-equipment/heating-systems/) | 114 | 27.2% | 부정형 50 |
| [보일러 부대설비](/energy-management/written/thermal-equipment/boiler-auxiliary-equipment/) | 74 | 29.7% | 본문 정답 근거 대조 낮음 · 부정형 39 |
| [열·증기·열역학 기초](/energy-management/written/thermal-equipment/boiler-operation-basics/) | 92 | 31.5% | 본문 정답 근거 대조 낮음 · 부정형 14 |
| [인화점 vs 발화점](/industrial-safety/written/chemical/flash-vs-ignition-point/) | 9 | 33.3% | 부정형 2 |
| [흙막이 지보공 구성요소](/industrial-safety/written/construction/earth-retaining-components/) | 6 | 33.3% | 부정형 5 |
| [FTA 수행 절차](/industrial-safety/written/ergonomics/fta-procedure/) | 6 | 33.3% | 부정형 2 |
| [농도 환산 (vol% → mg/L)](/industrial-safety/written/chemical/concentration-conversion/) | 3 | 33.3% | 계산 직접 검토 |
| [폭발 종류 (물리·화학)](/industrial-safety/written/chemical/explosion-types/) | 3 | 33.3% | 부정형 3 |
| [피뢰설비 설치 기준](/industrial-safety/written/electrical/lightning-protection-standard/) | 3 | 33.3% | 법령 직접 검토 · 부정형 3 |
| [안전관리자·보건관리자 선임 기준](/industrial-safety/written/safety-management/safety-manager-appointment/) | 3 | 33.3% | 부정형 1 |
| [보일러 계측·부속장치](/energy-management/written/thermal-equipment/boiler-accessory-equipment/) | 86 | 34.9% | 본문 정답 근거 대조 낮음 · 부정형 52 |
| [난방부하·방열기 계산](/energy-management/written/thermal-equipment/heating-load-radiators/) | 45 | 35.6% | 본문 정답 근거 대조 낮음 · 계산 직접 검토 · 부정형 12 |
| [보온·단열재](/energy-management/written/thermal-equipment/insulation-materials/) | 41 | 36.6% | 부정형 13 |
| [보일러 형식·구조·재료](/energy-management/written/thermal-equipment/boiler-types-construction/) | 142 | 37.3% | 본문 정답 근거 대조 낮음 · 부정형 50 |
| [연소 범위와 위험성](/industrial-safety/written/chemical/combustion-range-risk/) | 21 | 38.1% | 부정형 2 |
| [연료 특성·발열량](/energy-management/written/thermal-equipment/fuel-properties/) | 83 | 38.6% | 본문 정답 근거 대조 낮음 · 부정형 37 |
| [에너지 관계법규와 검사 체계](/energy-management/written/thermal-equipment/energy-laws-and-inspection/) | 167 | 38.9% | 법령 직접 검토 · 부정형 45 |
| [배관·이음쇠·밸브](/energy-management/written/thermal-equipment/boiler-piping-insulation/) | 100 | 39.0% | 본문 정답 근거 대조 낮음 · 부정형 24 |
| [시스템 수명주기 5단계](/industrial-safety/written/ergonomics/system-lifecycle/) | 5 | 40.0% | - |
| [통풍·연도·굴뚝](/energy-management/written/thermal-equipment/draft-flue-gas/) | 47 | 42.6% | 계산 직접 검토 · 부정형 20 |
| [버너·화격자·연소장치](/energy-management/written/thermal-equipment/burners-furnaces-atomization/) | 62 | 43.5% | 부정형 29 |
| [반응기·증류탑·열교환기](/industrial-safety/written/chemical/reactor-distillation-equipment/) | 9 | 44.4% | 부정형 7 |
| [공작기계 안전 (선반·밀링·드릴)](/industrial-safety/written/mechanical/machine-tools-safety/) | 22 | 45.5% | 부정형 11 |
| [동바리 안전기준](/industrial-safety/written/construction/shore-safety-standard/) | 11 | 45.5% | 법령 직접 검토 · 부정형 8 |
| [심실세동 위험한계 에너지](/industrial-safety/written/electrical/vf-danger-energy/) | 11 | 45.5% | 본문 정답 근거 대조 낮음 · 계산 직접 검토 |
| [분진폭발 요인 (화학·물리적)](/industrial-safety/written/chemical/dust-explosion-factors/) | 13 | 46.2% | 부정형 4 |
| [보일러 자동제어와 인터록](/energy-management/written/thermal-equipment/boiler-control-systems/) | 69 | 46.4% | 부정형 19 |
| [보일러 작업안전과 사고예방](/energy-management/written/thermal-equipment/boiler-work-safety/) | 34 | 47.1% | 부정형 26 |
| [재료 시험 종류](/industrial-safety/written/mechanical/test-types/) | 14 | 50.0% | 부정형 7 |
| [완전연소 조성 농도 (Cst)](/industrial-safety/written/chemical/complete-combustion-cst/) | 8 | 50.0% | 계산 직접 검토 |
| [양중기 과부하방지장치 기준](/industrial-safety/written/mechanical/overload-prevention-device/) | 4 | 50.0% | 법령 직접 검토 · 부정형 1 |
| [인간관계 메커니즘](/industrial-safety/written/safety-management/human-relations-mechanism/) | 4 | 50.0% | 부정형 2 |
| [CO₂ 소화약제 특성](/industrial-safety/written/chemical/co2-extinguisher/) | 2 | 50.0% | 부정형 2 |
| [위험물 반응 가스 발생](/industrial-safety/written/chemical/reactive-dangerous-gases/) | 2 | 50.0% | - |

상세 결과는 같은 날짜의 CSV에 기록함

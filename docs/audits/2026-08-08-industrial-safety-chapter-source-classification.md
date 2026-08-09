# 산업안전기사 챕터 출처·시각자료 보강 분류

- 감사일: 2026-08-08
- 기준 커밋: `e36e104c62144dbebc07904b24b0eabebbddd95c`
- 대상: 산업안전기사 챕터 250개(완료 220개, 미시작 30개)
- 작업 성격: 읽기 전용 분류 감사. 챕터 본문·이미지·기출 관계·공개 상태는 변경하지 않음

## 결론

완료 220개 중 본문·출처 기준으로 **현재 충분 65개**, **보강 권장 129개**, **보강 우선 26개**로 분류했다.

- KOSHA 해설·사례 보강 후보: 92개
- 법령·고시·KEC 등 공식 근거 보강 후보: 55개
- 시각자료 필수 후보: 46개
- 시각자료 권장 후보: 70개
- 현재 챕터 본문에 KOSHA 명칭 또는 주소가 존재하는 파일: 2개

이 분류에서 KOSHA는 **복제 원본이 아니라 공식 참고 출처**다. 실제 보강 시 법령 수치·조건은 국가법령정보센터 또는 해당 공식 기준에서 다시 확인하고, GetPassLab 문장으로 작성한다. KOSHA 만화·교재 페이지는 별도 이용허락 없이 복사하지 않는다.

## 분류 기준

- `현재 충분`: 본문 분량과 기출 중심 설명에 즉시 보강이 필요한 출처 결함을 발견하지 못함. 시각자료는 별도 선택 사항일 수 있음.
- `보강 권장`: KOSHA 현장 해설, 공식 근거 또는 본문 깊이 중 하나 이상을 보완하면 학습 가치가 커짐.
- `보강 우선`: 본문 500자 미만, 얇은 법령 챕터 또는 기출 수 대비 설명이 부족한 챕터.
- `시각자료 필수`: 표지·기호·기계 구조·설치 치수처럼 텍스트만으로 핵심 구분이 어려운 범위.
- `시각자료 권장`: 도식이 학습 효율을 높이지만 텍스트만으로도 핵심 정답 판단은 가능한 범위.
- 여러 분류는 중복될 수 있다. `현재 충분`은 시각자료 권장 여부와 독립적으로 판정했다.

## 과목별 집계

| 과목 | 완료 | 현재 충분 | 보강 권장 | 보강 우선 | KOSHA | 법령 | 시각 필수 | 시각 권장 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 36 | 17 | 19 | 0 | 8 | 6 | 1 | 9 |
| 2 | 42 | 20 | 21 | 1 | 7 | 2 | 3 | 10 |
| 3 | 34 | 4 | 24 | 6 | 21 | 14 | 17 | 15 |
| 4 | 44 | 12 | 24 | 8 | 12 | 14 | 9 | 15 |
| 5 | 34 | 9 | 20 | 5 | 20 | 2 | 1 | 12 |
| 6 | 30 | 3 | 21 | 6 | 24 | 17 | 15 | 9 |

## 보강 우선 챕터

| 과목 | slug | 제목 | KOSHA | 법령 | 시각자료 | 근거 |
|---:|---|---|---|---|---|---|
| 2 | `thermal-conditions-wbgt` | 온열조건 (WBGT·실효온도) | 필요 | 아님 | 낮음 | 본문 483자; KOSHA 현장 해설·사례 보강 후보 |
| 3 | `circular-saw-devices` | 둥근톱기계 방호장치 분류 | 필요 | 필요 | 필수 | 본문 570자로 얇음; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 3 | `crane-passenger-safety` | 크레인 전용탑승설비 추락방지 | 필요 | 필요 | 필수 | 본문 490자; 법령 태그이나 전용 근거 영역 없음; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 3 | `crane-safety-devices` | 크레인 안전장치 | 필요 | 필요 | 필수 | 본문 646자로 얇음; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 3 | `overload-prevention-device` | 양중기 과부하방지장치 기준 | 필요 | 필요 | 필수 | 본문 467자; 법령 태그이나 전용 근거 영역 없음; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 3 | `roller-stopping-distance` | 롤러기 급정지거리 | 아님 | 아님 | 권장 | 본문 477자; 시각자료 권장 |
| 3 | `roller-surface-speed` | 롤러기 표면속도 | 아님 | 아님 | 권장 | 본문 434자; 시각자료 권장 |
| 4 | `grounding-exemption` | 접지공사 면제·생략 조건 | 아님 | 필요 | 낮음 | 본문 496자; 법령 태그이나 전용 근거 영역 없음 |
| 4 | `grounding-targets` | 전기기기 접지 대상 | 아님 | 필요 | 권장 | 본문 464자; 법령 태그이나 전용 근거 영역 없음; 시각자료 권장 |
| 4 | `grounding-types` | 접지공사 종류별 기준 | 아님 | 필요 | 필수 | 본문 532자로 얇음; 법령 태그이나 전용 근거 영역 없음; 시각자료 필수 |
| 4 | `insulation-temperature` | 절연물 등급별 허용온도 | 아님 | 필요 | 낮음 | 본문 642자로 얇음; 법령 태그이나 전용 근거 영역 없음 |
| 4 | `leakage-breaker-exception` | 누전차단기 설치 불필요 조건 | 아님 | 필요 | 권장 | 본문 504자로 얇음; 법령 태그이나 전용 근거 영역 없음; 시각자료 권장 |
| 4 | `max-leakage-current` | 저압전선로 허용 누설전류 | 아님 | 필요 | 낮음 | 본문 534자로 얇음; 법령 태그이나 전용 근거 영역 없음 |
| 4 | `power-off-procedure` | 정전작업 절차 6단계 | 필요 | 필요 | 권장 | 본문 578자로 얇음; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |
| 4 | `shock-prevention` | 감전사고 방지 대책 | 필요 | 필요 | 낮음 | 본문 449자; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보 |
| 5 | `dust-explosion-factors` | 분진폭발 요인 (화학·물리적) | 필요 | 아님 | 권장 | 본문 503자로 얇음; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |
| 5 | `fire-classification` | 화재 분류 A·B·C·D급 | 필요 | 아님 | 필수 | 본문 390자; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 5 | `fire-suppression-principles` | 소화 원리 4가지 | 필요 | 아님 | 권장 | 본문 479자; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |
| 5 | `flameproof-flange-distance` | 내압방폭 플랜지 이격거리 | 아님 | 필요 | 낮음 | 본문 656자로 얇음; 법령 태그이나 전용 근거 영역 없음 |
| 5 | `flash-vs-ignition-point` | 인화점 vs 발화점 | 필요 | 아님 | 권장 | 본문 509자로 얇음; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |
| 6 | `demolition-safety-measures` | 해체 작업 안전 조치 | 필요 | 필요 | 권장 | 본문 455자; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |
| 6 | `hanging-scaffold-safety-factor` | 달비계 안전계수 기준 | 필요 | 필요 | 낮음 | 본문 555자로 얇음; 법령 태그이나 전용 근거 영역 없음; KOSHA 현장 해설·사례 보강 후보 |
| 6 | `safety-net-standards` | 추락방호망 설치기준 | 필요 | 필요 | 필수 | 본문 478자; 현행 법령·고시 직접 확인이 필요한 주제; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 6 | `shore-safety-standard` | 동바리 안전기준 | 필요 | 필요 | 필수 | 본문 531자로 얇음; 법령 태그이나 전용 근거 영역 없음; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 6 | `tower-crane-rope-support` | 타워크레인 와이어로프 지지 | 필요 | 필요 | 필수 | 본문 497자; 법령 태그이나 전용 근거 영역 없음; KOSHA 현장 해설·사례 보강 후보; 시각자료 필수 |
| 6 | `tower-crane-wind-limits` | 타워크레인 강풍 작업중지 기준 | 필요 | 아님 | 권장 | 본문 451자; KOSHA 현장 해설·사례 보강 후보; 시각자료 권장 |

## KOSHA·공식 근거 보강 후보

| 과목 | slug | 제목 | 현재 판정 | KOSHA | 법령 | 시각자료 |
|---:|---|---|---|---|---|---|
| 1 | `hazard-prediction-training` | 위험예지훈련 | 보강 권장 | 필요 | 아님 | 권장 |
| 1 | `industrial-accident-insurance` | 산재보험 보험급여 8종 | 보강 권장 | 아님 | 필요 | 낮음 |
| 1 | `product-liability-defects` | 제조물책임법 결함 유형 | 보강 권장 | 아님 | 필요 | 낮음 |
| 1 | `protective-equipment-types` | 보호구 종류 및 적용 | 보강 권장 | 필요 | 필요 | 권장 |
| 1 | `risk-reduction-priority` | 위험성 감소 대책 우선순위 | 보강 권장 | 필요 | 아님 | 낮음 |
| 1 | `safety-inspection-types` | 안전점검 종류 | 보강 권장 | 필요 | 아님 | 낮음 |
| 1 | `safety-management-organization` | 안전관리 조직 (라인·스태프) | 보강 권장 | 필요 | 아님 | 권장 |
| 1 | `safety-manager-appointment` | 안전관리자·보건관리자 선임 기준 | 보강 권장 | 필요 | 필요 | 낮음 |
| 1 | `safety-signs` | 안전표지 종류 | 보강 권장 | 필요 | 필요 | 필수 |
| 1 | `serious-accident-criteria` | 중대재해 범위 | 보강 권장 | 아님 | 필요 | 낮음 |
| 1 | `zero-accident-movement` | 무재해운동 3요소·3원칙 | 보강 권장 | 필요 | 아님 | 낮음 |
| 2 | `hazard-prevention-plan-qualification` | 유해·위험 방지계획서 작성 자격 | 보강 권장 | 필요 | 필요 | 낮음 |
| 2 | `msd-risk-factors` | 근골격계 유해요인 5종 | 보강 권장 | 필요 | 아님 | 권장 |
| 2 | `qualitative-assessment-items` | 정성적 평가 항목 | 보강 권장 | 필요 | 아님 | 낮음 |
| 2 | `quantitative-assessment-items` | 정량적 평가 항목 | 보강 권장 | 필요 | 아님 | 낮음 |
| 2 | `safety-assessment-basic-principles` | 안전성 평가 기본원칙 6단계 | 보강 권장 | 필요 | 아님 | 낮음 |
| 2 | `safety-improvement-plan-items` | 안전보건개선계획서 항목 | 보강 권장 | 아님 | 필요 | 낮음 |
| 2 | `thermal-conditions-wbgt` | 온열조건 (WBGT·실효온도) | 보강 우선 | 필요 | 아님 | 낮음 |
| 2 | `workplace-layout-principles` | 작업장 배치 원칙 | 보강 권장 | 필요 | 아님 | 권장 |
| 3 | `boiler-safety-devices` | 보일러 안전장치 | 보강 권장 | 필요 | 필요 | 권장 |
| 3 | `circular-saw-devices` | 둥근톱기계 방호장치 분류 | 보강 우선 | 필요 | 필요 | 필수 |
| 3 | `conveyor-safety` | 콘베이어 안전 | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `crane-passenger-safety` | 크레인 전용탑승설비 추락방지 | 보강 우선 | 필요 | 필요 | 필수 |
| 3 | `crane-safety-devices` | 크레인 안전장치 | 보강 우선 | 필요 | 필요 | 필수 |
| 3 | `equipment-safety-three` | 설비 안전화 3가지 분류 | 보강 권장 | 필요 | 아님 | 권장 |
| 3 | `five-pinch-points` | 기계의 5대 위험점 | 보강 권장 | 필요 | 아님 | 필수 |
| 3 | `forklift-safety` | 지게차 안전 | 보강 권장 | 필요 | 필요 | 권장 |
| 3 | `hand-pull-device-structure` | 수인식 방호장치 일반구조 기준 | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `industrial-robot-safety` | 산업용 로봇 안전 조치 | 보강 권장 | 필요 | 필요 | 권장 |
| 3 | `machine-tools-safety` | 공작기계 안전 (선반·밀링·드릴) | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `mold-safety` | 금형 설치·해체 안전조치와 안전블록 | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `overload-prevention-device` | 양중기 과부하방지장치 기준 | 보강 우선 | 필요 | 필요 | 필수 |
| 3 | `press-device-conditions` | 프레스 방호장치 적용 조건과 SPM 기준 | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `press-pre-work-checklist` | 프레스 작업시작 전 점검사항 7가지 | 보강 권장 | 필요 | 필요 | 권장 |
| 3 | `press-safety-devices` | 프레스 방호장치 종류 | 보강 권장 | 필요 | 필요 | 필수 |
| 3 | `roller-stop-rope-standard` | 롤러기 급정지장치 조작부 로프 기준 | 보강 권장 | 필요 | 아님 | 필수 |
| 3 | `safety-certification-8` | 안전인증대상 방호장치 판별 | 보강 권장 | 필요 | 아님 | 권장 |
| 3 | `shaper-structure` | 형삭기 구조와 램 | 보강 권장 | 필요 | 아님 | 필수 |
| 3 | `welding-defects` | 주요 용접 결함 종류 | 보강 권장 | 필요 | 아님 | 권장 |
| 3 | `wire-rope-twist-types` | 와이어 로프 꼬임 종류 | 보강 권장 | 필요 | 아님 | 필수 |
| 4 | `electrical-fire-causes` | 전기화재 원인 | 보강 권장 | 필요 | 아님 | 권장 |
| 4 | `explosion-grade-vessel` | 폭발등급 측정 표준용기 | 보강 권장 | 아님 | 필요 | 권장 |
| 4 | `explosion-proof-basics` | 방폭 3대 기본 개념 | 보강 권장 | 필요 | 아님 | 권장 |
| 4 | `explosion-proof-code` | 방폭전기기기 표시코드 | 보강 권장 | 필요 | 아님 | 필수 |
| 4 | `explosion-proof-fittings` | 금속관 방폭형 부속품 | 보강 권장 | 필요 | 아님 | 필수 |
| 4 | `explosion-proof-types` | 방폭구조 대표 6가지 | 보강 권장 | 필요 | 아님 | 필수 |
| 4 | `explosion-temperature-class` | 방폭기기 온도등급 (T1~T6) | 보강 권장 | 아님 | 필요 | 낮음 |
| 4 | `explosion-zones` | 폭발 위험 장소 0·1·2종 | 보강 권장 | 필요 | 필요 | 권장 |
| 4 | `gas-group-distance` | 가스 그룹별 최소 이격거리 | 보강 권장 | 아님 | 필요 | 낮음 |
| 4 | `grounding-exemption` | 접지공사 면제·생략 조건 | 보강 우선 | 아님 | 필요 | 낮음 |
| 4 | `grounding-targets` | 전기기기 접지 대상 | 보강 우선 | 아님 | 필요 | 권장 |
| 4 | `grounding-types` | 접지공사 종류별 기준 | 보강 우선 | 아님 | 필요 | 필수 |
| 4 | `insulation-temperature` | 절연물 등급별 허용온도 | 보강 우선 | 아님 | 필요 | 낮음 |
| 4 | `leakage-breaker-exception` | 누전차단기 설치 불필요 조건 | 보강 우선 | 아님 | 필요 | 권장 |
| 4 | `leakage-vulnerable-points` | 누전 사고 취약 개소 | 보강 권장 | 필요 | 아님 | 낮음 |
| 4 | `max-leakage-current` | 저압전선로 허용 누설전류 | 보강 우선 | 아님 | 필요 | 낮음 |
| 4 | `pipe-flow-limit` | 정전기 방지 배관 유속 제한 | 보강 권장 | 아님 | 필요 | 낮음 |
| 4 | `power-off-procedure` | 정전작업 절차 6단계 | 보강 우선 | 필요 | 필요 | 권장 |
| 4 | `shock-prevention` | 감전사고 방지 대책 | 보강 우선 | 필요 | 필요 | 낮음 |
| 4 | `static-prevention` | 정전기 재해 방지 대책 | 보강 권장 | 필요 | 아님 | 권장 |
| 4 | `welder-shock-protector` | 교류 아크 용접기 전격 방지기 설치 | 보강 권장 | 필요 | 필요 | 필수 |
| 4 | `wire-ignition-stages` | 과전류 전선 발화 단계 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `acetylene-properties` | 아세틸렌 특성 (희석제·제조) | 보강 권장 | 필요 | 아님 | 낮음 |
| 5 | `bleve` | BLEVE (비등액체증기폭발) | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `cavitation` | 공동현상 (Cavitation) | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `chemical-classification` | 산업안전보건규칙 위험물질 분류 | 보강 권장 | 필요 | 아님 | 낮음 |
| 5 | `co2-extinguisher` | CO₂ 소화약제 특성 | 보강 권장 | 필요 | 아님 | 낮음 |
| 5 | `combustion-range-risk` | 연소 범위와 위험성 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `dust-explosion-factors` | 분진폭발 요인 (화학·물리적) | 보강 우선 | 필요 | 아님 | 권장 |
| 5 | `explosion-types` | 폭발 종류 (물리·화학) | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `extinguisher-effects` | 소화약제별 주 소화효과 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `fire-classification` | 화재 분류 A·B·C·D급 | 보강 우선 | 필요 | 아님 | 필수 |
| 5 | `fire-suppression-principles` | 소화 원리 4가지 | 보강 우선 | 필요 | 아님 | 권장 |
| 5 | `flameproof-flange-distance` | 내압방폭 플랜지 이격거리 | 보강 우선 | 아님 | 필요 | 낮음 |
| 5 | `flash-vs-ignition-point` | 인화점 vs 발화점 | 보강 우선 | 필요 | 아님 | 권장 |
| 5 | `purge-inerting` | 퍼지 (불활성화) | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `reactive-dangerous-gases` | 위험물 반응 가스 발생 | 보강 권장 | 필요 | 아님 | 낮음 |
| 5 | `reactor-distillation-equipment` | 반응기·증류탑·열교환기 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `safe-explosion-combinations` | 폭발 위험 낮은 조합 | 보강 권장 | 필요 | 아님 | 낮음 |
| 5 | `safety-valve-shutoff-exception` | 안전밸브 전단·후단 차단밸브 금지 예외 | 보강 권장 | 필요 | 필요 | 낮음 |
| 5 | `spontaneous-combustion` | 자연발화 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `surging-phenomenon` | 서징(Surging) 현상 | 보강 권장 | 필요 | 아님 | 권장 |
| 5 | `water-prohibited-extinguishers` | 금수성 물질 소화기 | 보강 권장 | 필요 | 아님 | 낮음 |
| 6 | `demolition-safety-measures` | 해체 작업 안전 조치 | 보강 우선 | 필요 | 필요 | 권장 |
| 6 | `earth-retaining-components` | 흙막이 지보공 구성요소 | 보강 권장 | 필요 | 아님 | 필수 |
| 6 | `excavation-slope-standard` | 굴착면 기울기 기준표 | 보강 권장 | 필요 | 필요 | 필수 |
| 6 | `fall-prevention-equipment` | 안전대·추락방지 설비 | 보강 권장 | 필요 | 아님 | 필수 |
| 6 | `gangway-ladder-standard` | 현문 사다리 설치기준 | 보강 권장 | 필요 | 아님 | 필수 |
| 6 | `hanging-scaffold-safety-factor` | 달비계 안전계수 기준 | 보강 우선 | 필요 | 필요 | 낮음 |
| 6 | `pile-driver-stability` | 항타기·항발기 무너짐·권상 기준 | 보강 권장 | 필요 | 아님 | 필수 |
| 6 | `safety-handrail-structure` | 안전난간 구조 및 설치요건 | 보강 권장 | 필요 | 필요 | 필수 |
| 6 | `safety-management-cost` | 산업안전보건관리비 | 보강 권장 | 아님 | 필요 | 낮음 |
| 6 | `safety-net-standards` | 추락방호망 설치기준 | 보강 우선 | 필요 | 필요 | 필수 |
| 6 | `shore-safety-standard` | 동바리 안전기준 | 보강 우선 | 필요 | 필요 | 필수 |
| 6 | `slope-collapse-prevention` | 법면 붕괴 예방조치 3대 핵심 | 보강 권장 | 필요 | 필요 | 권장 |
| 6 | `slope-stabilization-methods` | 사면 안정 공법 분류 | 보강 권장 | 필요 | 아님 | 권장 |
| 6 | `soil-collapse-prevention` | 토사붕괴 원인·예방 | 보강 권장 | 필요 | 필요 | 권장 |
| 6 | `steel-frame-scaffold` | 강관틀비계 조립 준수사항 | 보강 권장 | 필요 | 필요 | 필수 |
| 6 | `steel-frame-work` | 철골작업 안전 | 보강 권장 | 필요 | 필요 | 권장 |
| 6 | `steel-pipe-scaffold` | 강관비계·강관틀비계 설치 기준 | 보강 권장 | 필요 | 필요 | 필수 |
| 6 | `temporary-passage-stairs` | 가설통로·계단 기준 | 보강 권장 | 필요 | 필요 | 필수 |
| 6 | `temporary-structure-defects` | 가설구조물 4대 특징 | 보강 권장 | 필요 | 아님 | 권장 |
| 6 | `tower-crane-rope-support` | 타워크레인 와이어로프 지지 | 보강 우선 | 필요 | 필요 | 필수 |
| 6 | `tower-crane-wind-limits` | 타워크레인 강풍 작업중지 기준 | 보강 우선 | 필요 | 아님 | 권장 |
| 6 | `tunnel-blasting` | 터널·발파 안전 | 보강 권장 | 필요 | 필요 | 권장 |
| 6 | `vehicle-overturn-prevention` | 차량계 하역운반기계 전도 방지 | 보강 권장 | 필요 | 필요 | 권장 |
| 6 | `walkway-board-standard` | 통로발판 구조 기준 | 보강 권장 | 필요 | 아님 | 필수 |
| 6 | `work-platform-standards` | 작업발판 기준 | 보강 권장 | 필요 | 필요 | 필수 |

## 시각자료 후보

| 우선도 | 과목 | slug | 제목 |
|---|---:|---|---|
| 필수 | 1 | `safety-signs` | 안전표지 종류 |
| 필수 | 2 | `cutset-pathset` | 컷셋·패스셋·미니멀 |
| 필수 | 2 | `exclusive-or-gate` | 배타적 OR 게이트 |
| 필수 | 2 | `fta-symbols` | FTA 사상기호와 게이트 기호 |
| 필수 | 3 | `circular-saw-devices` | 둥근톱기계 방호장치 분류 |
| 필수 | 3 | `conveyor-safety` | 콘베이어 안전 |
| 필수 | 3 | `crane-passenger-safety` | 크레인 전용탑승설비 추락방지 |
| 필수 | 3 | `crane-safety-devices` | 크레인 안전장치 |
| 필수 | 3 | `five-pinch-points` | 기계의 5대 위험점 |
| 필수 | 3 | `grinder-exposure-angle` | 연삭기 노출각도 기준 |
| 필수 | 3 | `hand-pull-device-structure` | 수인식 방호장치 일반구조 기준 |
| 필수 | 3 | `ilo-guard-opening` | 보호망·가드 개구부 안전간격 |
| 필수 | 3 | `machine-tools-safety` | 공작기계 안전 (선반·밀링·드릴) |
| 필수 | 3 | `mold-safety` | 금형 설치·해체 안전조치와 안전블록 |
| 필수 | 3 | `overload-prevention-device` | 양중기 과부하방지장치 기준 |
| 필수 | 3 | `press-device-conditions` | 프레스 방호장치 적용 조건과 SPM 기준 |
| 필수 | 3 | `press-safety-devices` | 프레스 방호장치 종류 |
| 필수 | 3 | `press-safety-distance` | 프레스 방호장치 안전거리 |
| 필수 | 3 | `roller-stop-rope-standard` | 롤러기 급정지장치 조작부 로프 기준 |
| 필수 | 3 | `shaper-structure` | 형삭기 구조와 램 |
| 필수 | 3 | `wire-rope-twist-types` | 와이어 로프 꼬임 종류 |
| 필수 | 4 | `breaker-types` | 차단기 종류 비교 |
| 필수 | 4 | `explosion-proof-code` | 방폭전기기기 표시코드 |
| 필수 | 4 | `explosion-proof-fittings` | 금속관 방폭형 부속품 |
| 필수 | 4 | `explosion-proof-types` | 방폭구조 대표 6가지 |
| 필수 | 4 | `grounding-types` | 접지공사 종류별 기준 |
| 필수 | 4 | `leakage-breaker-types` | 누전차단기 구조·정격·시설기준 |
| 필수 | 4 | `lightning-protection-standard` | 피뢰설비 설치 기준 |
| 필수 | 4 | `step-touch-voltage` | 허용보폭전압·접촉전압 |
| 필수 | 4 | `welder-shock-protector` | 교류 아크 용접기 전격 방지기 설치 |
| 필수 | 5 | `fire-classification` | 화재 분류 A·B·C·D급 |
| 필수 | 6 | `earth-retaining-components` | 흙막이 지보공 구성요소 |
| 필수 | 6 | `excavation-slope-standard` | 굴착면 기울기 기준표 |
| 필수 | 6 | `fall-prevention-equipment` | 안전대·추락방지 설비 |
| 필수 | 6 | `gangway-ladder-standard` | 현문 사다리 설치기준 |
| 필수 | 6 | `ladder-cage-standard` | 사다리식 통로·고정식 사다리 기준 |
| 필수 | 6 | `pile-driver-stability` | 항타기·항발기 무너짐·권상 기준 |
| 필수 | 6 | `safety-handrail-structure` | 안전난간 구조 및 설치요건 |
| 필수 | 6 | `safety-net-standards` | 추락방호망 설치기준 |
| 필수 | 6 | `shore-safety-standard` | 동바리 안전기준 |
| 필수 | 6 | `steel-frame-scaffold` | 강관틀비계 조립 준수사항 |
| 필수 | 6 | `steel-pipe-scaffold` | 강관비계·강관틀비계 설치 기준 |
| 필수 | 6 | `temporary-passage-stairs` | 가설통로·계단 기준 |
| 필수 | 6 | `tower-crane-rope-support` | 타워크레인 와이어로프 지지 |
| 필수 | 6 | `walkway-board-standard` | 통로발판 구조 기준 |
| 필수 | 6 | `work-platform-standards` | 작업발판 기준 |
| 권장 | 1 | `accident-analysis-tools` | 재해분석 도구 4종 |
| 권장 | 1 | `accident-occurrence-theories` | 재해 발생 학설 4가지 |
| 권장 | 1 | `accident-ratio-law` | 재해 비율 법칙 |
| 권장 | 1 | `bird-domino-theory` | 버드의 수정 도미노 이론 |
| 권장 | 1 | `hazard-prediction-training` | 위험예지훈련 |
| 권장 | 1 | `heinrich-domino-theory` | 하인리히 도미노 이론 |
| 권장 | 1 | `protective-equipment-types` | 보호구 종류 및 적용 |
| 권장 | 1 | `safety-education-stages` | 교육의 3단계·단계별 과정 |
| 권장 | 1 | `safety-management-organization` | 안전관리 조직 (라인·스태프) |
| 권장 | 2 | `anthropometry-design` | 인체측정·설계원칙 |
| 권장 | 2 | `cr-ratio` | C/R비 (Control-Response) |
| 권장 | 2 | `illuminance-luminance-reflectance` | 조도·휘도·반사율 관계 |
| 권장 | 2 | `man-machine-system-design` | 인간-기계 시스템 설계 6단계 |
| 권장 | 2 | `msd-risk-factors` | 근골격계 유해요인 5종 |
| 권장 | 2 | `point-source-illuminance` | 점광원 조도 |
| 권장 | 2 | `series-parallel-reliability` | 직렬·병렬 신뢰도 |
| 권장 | 2 | `signal-detection-theory` | 신호검출이론 (SDT) |
| 권장 | 2 | `system-analysis-techniques` | 시스템 분석 기법 비교 |
| 권장 | 2 | `workplace-layout-principles` | 작업장 배치 원칙 |
| 권장 | 3 | `balance-flange-diameter` | 평형 플랜지 지름 |
| 권장 | 3 | `boiler-safety-devices` | 보일러 안전장치 |
| 권장 | 3 | `crane-rope-load` | 크레인 로프 하중 |
| 권장 | 3 | `equipment-safety-three` | 설비 안전화 3가지 분류 |
| 권장 | 3 | `forklift-safety` | 지게차 안전 |
| 권장 | 3 | `grinder-rotation-speed` | 연삭숫돌 회전속도 |
| 권장 | 3 | `industrial-robot-safety` | 산업용 로봇 안전 조치 |
| 권장 | 3 | `penetrant-test-procedure` | 침투탐상검사 순서 6단계 |
| 권장 | 3 | `press-pre-work-checklist` | 프레스 작업시작 전 점검사항 7가지 |
| 권장 | 3 | `roller-stopping-distance` | 롤러기 급정지거리 |
| 권장 | 3 | `roller-surface-speed` | 롤러기 표면속도 |
| 권장 | 3 | `safety-certification-8` | 안전인증대상 방호장치 판별 |
| 권장 | 3 | `sling-wire-tension` | 슬링 와이어 장력 |
| 권장 | 3 | `vibration-diagnosis` | 진동 1차 설비진단법 3가지 |
| 권장 | 3 | `welding-defects` | 주요 용접 결함 종류 |
| 권장 | 4 | `body-current-effect` | 인체 통전전류별 영향 |
| 권장 | 4 | `combined-resistance` | 합성저항 (직렬·병렬) |
| 권장 | 4 | `electrical-fire-causes` | 전기화재 원인 |
| 권장 | 4 | `electrostatic-induction` | 정전유도 분배 전압 |
| 권장 | 4 | `explosion-grade-vessel` | 폭발등급 측정 표준용기 |
| 권장 | 4 | `explosion-proof-basics` | 방폭 3대 기본 개념 |
| 권장 | 4 | `explosion-zones` | 폭발 위험 장소 0·1·2종 |
| 권장 | 4 | `gas-group-classification` | 가스 그룹 분류 (IIA/IIB/IIC) |
| 권장 | 4 | `grounding-targets` | 전기기기 접지 대상 |
| 권장 | 4 | `leakage-breaker-exception` | 누전차단기 설치 불필요 조건 |
| 권장 | 4 | `lightning-arrester-conditions` | 피뢰기 구비조건 |
| 권장 | 4 | `power-off-procedure` | 정전작업 절차 6단계 |
| 권장 | 4 | `static-occurrence-factors` | 정전기 발생 요인 |
| 권장 | 4 | `static-prevention` | 정전기 재해 방지 대책 |
| 권장 | 4 | `wire-ignition-stages` | 과전류 전선 발화 단계 |
| 권장 | 5 | `bleve` | BLEVE (비등액체증기폭발) |
| 권장 | 5 | `cavitation` | 공동현상 (Cavitation) |
| 권장 | 5 | `combustion-range-risk` | 연소 범위와 위험성 |
| 권장 | 5 | `dust-explosion-factors` | 분진폭발 요인 (화학·물리적) |
| 권장 | 5 | `explosion-types` | 폭발 종류 (물리·화학) |
| 권장 | 5 | `extinguisher-effects` | 소화약제별 주 소화효과 |
| 권장 | 5 | `fire-suppression-principles` | 소화 원리 4가지 |
| 권장 | 5 | `flash-vs-ignition-point` | 인화점 vs 발화점 |
| 권장 | 5 | `purge-inerting` | 퍼지 (불활성화) |
| 권장 | 5 | `reactor-distillation-equipment` | 반응기·증류탑·열교환기 |
| 권장 | 5 | `spontaneous-combustion` | 자연발화 |
| 권장 | 5 | `surging-phenomenon` | 서징(Surging) 현상 |
| 권장 | 6 | `demolition-safety-measures` | 해체 작업 안전 조치 |
| 권장 | 6 | `slope-collapse-prevention` | 법면 붕괴 예방조치 3대 핵심 |
| 권장 | 6 | `slope-stabilization-methods` | 사면 안정 공법 분류 |
| 권장 | 6 | `soil-collapse-prevention` | 토사붕괴 원인·예방 |
| 권장 | 6 | `steel-frame-work` | 철골작업 안전 |
| 권장 | 6 | `temporary-structure-defects` | 가설구조물 4대 특징 |
| 권장 | 6 | `tower-crane-wind-limits` | 타워크레인 강풍 작업중지 기준 |
| 권장 | 6 | `tunnel-blasting` | 터널·발파 안전 |
| 권장 | 6 | `vehicle-overturn-prevention` | 차량계 하역운반기계 전도 방지 |

실제 이미지는 아직 만들지 않는다. 법정 표지·법정 기호는 법령 별표 기준 자체 재현, 기출 도형은 원본 기출 PDF 추출, KOSHA 만화·삽화는 참고만 하는 원칙을 적용한다.

## 미시작 30개

| 분류 | 과목 | slug | 제목 | 후속 출처 |
|---|---:|---|---|---|
| 기존 완료 챕터 흡수 후보 | 1 | `cumulative-noise-dose` | 누적소음노출량 D 계산 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 독립 챕터 유지 후보 | 1 | `hearing-protection` | 방음보호구 EP-1·EP-2·EM | KOSHA 후속 검증 / 법령 후속 검증 / 시각 권장 |
| 기존 완료 챕터 흡수 후보 | 1 | `pavlov-conditioning` | 파블로프 조건반사설 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 과목 범위 충돌 보류 | 1 | `safety-devices` | 방호장치 종류 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 1 | `twa-calculation` | TWA 계산 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 2 | `chemical-plant-safety-assessment` | 화학설비 안전성 평가 5단계 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 2 | `hazop-guidewords` | HAZOP·가이드워드 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 2 | `inspired-volume-correction` | 흡기량 보정 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 2 | `luminous-intensity` | 광도 (I) | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 독립 챕터 유지 후보 | 2 | `msd-investigation-cycle` | 근골격계 유해요인 조사 주기 | KOSHA 후속 검증 / 법령 후속 검증 / 시각 낮음 |
| 독립 챕터 유지 후보 | 2 | `risk-assessment-procedure` | 위험성평가 수행 절차 | KOSHA 후속 검증 / 법령 후속 검증 / 시각 낮음 |
| 근거 부족 정리 후보 | 2 | `workplace-illuminance-standard` | 작업면 조도 기준 | KOSHA 아님 / 법령 후속 검증 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 3 | `divider-blade-installation` | 분할날 설치 조건 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 3 | `machine-safety-six` | 기계설비 안전화 6종 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 3 | `ndt-types` | 비파괴검사 종류 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 3 | `parallel-mesh-opening` | 평형 보호망 최대 구멍 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 근거 부족 정리 후보 | 3 | `press-shear-force` | 프레스 전단력 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 근거 부족 정리 후보 | 4 | `basic-electric-terms` | 전기 기본 용어 정리 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 4 | `electric-shock-factors` | 감전 위험 4대 영향 요소 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 4 | `insulation-calculation` | 저압전로 절연저항 계산 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 근거 부족 정리 후보 | 4 | `power-cut-rate` | 정전률 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 독립 챕터 유지 후보 | 5 | `drying-equipment` | 건조설비 안전 | KOSHA 후속 검증 / 법령 후속 검증 / 시각 권장 |
| 근거 부족 정리 후보 | 5 | `flash-rate` | 플래시율 (F) | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 5 | `gas-mass-volume` | 기체 질량·부피 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 5 | `hazard-index` | 위험도 (H) | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 근거 부족 정리 후보 | 6 | `clam-shell` | 클램셸 (Clam Shell) 용도 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 6 | `demolition-methods` | 해체 공법 4종 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 독립 챕터 유지 후보 | 6 | `euler-buckling-load` | 오일러 좌굴하중 (Pcr) | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 6 | `forklift-stability-criteria` | 지게차 안정도 기준 4종 | KOSHA 아님 / 법령 아님 / 시각 낮음 |
| 기존 완료 챕터 흡수 후보 | 6 | `forklift-stability-formula` | 지게차 주행 좌·우 안정도 | KOSHA 아님 / 법령 아님 / 시각 낮음 |

미시작 분류는 2026-08-05 재분류 감사의 승인 전 상태를 유지한다. 신규 slug, 동결 키 변경, 관계 추가 또는 스텁 삭제를 승인하지 않는다.

## 전체 상세 목록

250개 전체 결과는 같은 경로의 `2026-08-08-industrial-safety-chapter-source-classification.csv`를 정본으로 사용한다.

## 한계와 다음 게이트

- 이번 분류는 저장소 본문·frontmatter·기출 관계를 기준으로 한 콘텐츠 운영 분류다.
- 각 후보에 대응하는 KOSHA 개별 자료의 최신판·공공누리 유형·직접 URL은 아직 확정하지 않았다.
- 법령·고시·KEC 수치의 현행 원문 대조는 실제 본문 보강 게이트에서 수행한다.
- 이미지 제작, KOSHA 페이지 캡처, 챕터 본문 수정, 기출 관계 변경은 수행하지 않았다.
- `AI_HANDOVER.md`는 갱신하지 않는다. 읽기 전용 감사이며 구현·기술 검토·Owner 승인이 완료되지 않았다.
- Commit·Push·PR·배포는 수행하지 않는다.

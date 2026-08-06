# 산업안전기사 미시작 챕터 34개 재분류

- 감사일: 2026-08-05
- 기준 커밋: `6dcadf897be0d88c8bfe49974c019cb747db64c8`
- 대상: 산업안전기사 기존 미시작 챕터 34개
- 작업 성격: 구조·관계 후보를 정하는 읽기 전용 감사
- 저장소 변경: 이 문서만 추가. 챕터, 문제, 관계, 공개 상태는 변경하지 않음

## 결론

미시작 34개는 다음과 같이 재분류한다.

| 분류 | 개수 | 의미 |
|---|---:|---|
| `KEEP_NEXT_GATE` | 9 | 독립 학습 범위와 직접 기출 또는 법령상 학습 필요성이 있어 다음 콘텐츠 게이트 후보로 유지 |
| `ABSORB_EXISTING` | 18 | 기존 완료 챕터가 같은 범위를 이미 소유하므로 기존 챕터에 최소 보강 후 스텁 정리 후보 |
| `RETIRE_NO_EVIDENCE` | 6 | 직접 기출 근거가 없거나 과도하게 넓고 기존 구조와 중복되어 비공개 스텁 정리 후보 |
| `HOLD_SCOPE_CONFLICT` | 1 | 주제는 유효하지만 현재 동결 `subject_id`와 실제 기출 과목이 충돌해 이번 범위에서 실행 불가 |
| 합계 | 34 |  |

현재 34개 파일의 `questions`는 모두 빈 배열이다. 이번 재분류는 관계나 공개를 자동 승인하지 않는다. 신규 관계는 원본 PDF 대조가 끝난 텍스트 문항만, 법령·기준 본문은 현행 공식 원문 대조가 끝난 챕터만 다음 게이트에서 반영한다.

## 재분류 기준

1. 산업안전기사 1,680문항의 본문·선택지에서 직접 주제 후보를 검색했다.
2. 237개 완료 챕터의 본문과 관계를 대조해 같은 공식·기준을 이미 소유하는지 확인했다.
3. 이미 다른 완료 챕터에 연결된 문항은 단순 중복 관계로 추가하지 않고 범위 소유권을 먼저 판단했다.
4. `subject_id`가 실제 후보 문항 과목과 다른 스텁은 동결 키를 바꾸지 않고 구조 충돌로 분류했다.
5. 이미지 문항은 텍스트 문항과 분리하고 원본 이미지 확인 전 공개 후보에서 제외했다.
6. 관계가 없더라도 현행 법령 학습에 독립 가치가 있는 챕터는 `KEEP_NEXT_GATE`로 유지할 수 있지만, 공식 원문 검증 전에는 작성하지 않는다.

## 1. 다음 게이트 유지 9개

| slug | 유지 근거 | 관계 후보·조건 | 다음 게이트 |
|---|---|---|---|
| `drying-equipment` | 건조설비 구조·독립 단층건물·폭발화재 예방을 직접 묻는 텍스트 기출이 반복됨 | 미연결 6건: `20210814_093`, `20210515_100`, `20190804_093`, `20180304_088`, `20180428_096`, `20190427_098` | PDF 6건과 현행 산업안전보건기준 직접 대조 |
| `construction-illuminance` | 건설작업장 작업면 조도 수치를 직접 묻는 과목 6 기출이 2건 존재 | 미연결 `20220305_107`, `20190303_117` | 기출 당시·현행 조도 기준을 분리해 검증 |
| `euler-buckling-load` | 동바리 일반 기준과 구분되는 좌굴하중 계산 학습 범위가 존재 | `20210814_110`은 현재 `shore-safety-standard` 관계. PDF 확인 뒤 이동 여부 판단 | 공식·단위·지지조건 대조 후 독립 계산 챕터 판단 |
| `ladder-cage-standard` | 일반 사다리식 통로 기준을 직접 묻는 과목 6 텍스트 기출이 반복됨 | 미연결 8건: `20220424_114`, `20220305_103`, `20210814_109`, `20200822_113`, `20200926_106`, `20180819_108`, `20190303_115`, `20190427_117` | 기존 slug는 유지하고 화면 범위를 ‘사다리식 통로·울’로 재정의, 현행 조문 대조 |
| `articulation-index` | 명료도 지수·통화 간섭 지수를 구분하는 텍스트 기출이 존재 | 미연결 텍스트 `20220305_028`, `20180428_027`; 이미지 `20210814_036`은 제외 | 텍스트 2건만 PDF 대조. 이미지 문항은 별도 게이트 |
| `msd-investigation-cycle` | 근골격계 유해요인 조사 주기는 기존 `msd-risk-factors`가 명시적으로 제외한 독립 법령 범위 | 직접 주기 문항은 현재 데이터에서 확인되지 않음 | 관계 0건 법령 기반 챕터로 유지할지 현행 고시 대조 후 확정 |
| `carelessness-misjudgment` | 부주의 발생 원인·예방을 직접 묻는 미연결 텍스트 기출 2건이 존재 | `20190804_012`, `20180819_012`; 억측판단 내용은 `human-error-by-process`에 유지 | 제목·본문 범위를 부주의 원인·예방으로 축소해 PDF 대조 |
| `hearing-protection` | 기존 보호구 총론이 의도적으로 제외한 EP-1·EP-2·EM 세부 범위 | `20190804_019`는 현재 `protective-equipment-types` 관계 | PDF·당시 규격·현행 보호구 기준 확인 후 관계 이동 판단 |
| `risk-assessment-procedure` | 위험성평가의 정의와 절차는 독립 학습 범위이며 과목 2 텍스트 후보가 존재 | 미연결 `20220424_037` | 최신 위험성평가 지침과 기출 당시 절차 체계를 분리해 검증 |

`workplace-illuminance-standard`는 유지 목록에서 제외한다. 현재 문제 데이터에서 동일한 수치 기준의 직접 문항은 과목 6에만 존재하므로 `construction-illuminance`를 기출 기반 소유자로 유지한다.

## 2. 기존 완료 챕터 흡수 18개

| slug | 흡수 대상 | 판단 근거 |
|---|---|---|
| `gas-mass-volume` | `ideal-gas-law`, `concentration-conversion` | 표준상태 질량·부피 후보 2건이 이미 농도 환산 챕터에 연결되고 이상기체 챕터가 단위·몰부피 경계를 설명함 |
| `hazard-index` | `combustion-range-risk` | 위험도 공식과 텍스트 관계가 이미 이동·반영됨. 이미지 `20220424_097`은 계속 제외 |
| `demolition-methods` | `demolition-safety-measures` | 폭파해체공법 후보 `20200926_109`가 기존 완료 챕터에 연결됨 |
| `forklift-stability-criteria` | `forklift-safety` | 실제 안정도 기출은 과목 3이며 기존 챕터가 4·6·18·(15+1.1V)%와 모멘트를 이미 소유 |
| `forklift-stability-formula` | `forklift-safety` | 위와 동일. 과목 6 스텁의 `subject_id`를 바꾸지 않고 흡수 |
| `electric-shock-factors` | `body-current-effect` | 직접 영향 요인인 전류·시간·경로와 전압의 구분이 기존 본문에 이미 구현됨. 미연결 후보 `20180428_080`만 후속 PDF 대조 |
| `insulation-calculation` | `max-leakage-current`, `low-voltage-insulation` | 누설전류와 절연저항 범위를 분산 흡수한 기존 결정 유지 |
| `chemical-plant-safety-assessment` | `safety-assessment-basic-principles` | 5·6단계 흐름과 정성·정량·대책·재평가 범위를 기존 챕터가 소유. 미연결 절차형 3건은 후속 관계 후보 |
| `hazop-guidewords` | `system-analysis-techniques` | HAZOP 가이드워드 표와 관련 기출 5건이 기존 챕터에 이미 반영됨 |
| `inspired-volume-correction` | `oxygen-consumption` | 질소 79% 보정 계산과 직접 기출 `20210515_036`이 기존 챕터에 구현됨 |
| `luminous-intensity` | `point-source-illuminance` | 광도 `I`와 조도 공식이 기존 계산 챕터에 구현됨. 독립 광도 계산 기출은 확인되지 않음 |
| `divider-blade-installation` | `circular-saw-devices` | 분할날 기능·톱날 간격과 관계 3건이 기존 챕터에 이미 포함됨 |
| `machine-safety-six` | `equipment-safety-three` | 데이터에서 확인되는 실제 범위는 구조·기능·작업 안전화와 기능 안전화 세부 문항이며 독립 6종 근거는 없음 |
| `ndt-types` | `test-types` | 비파괴검사 8종과 관련 기출이 기존 챕터에 이미 구현됨 |
| `parallel-mesh-opening` | `ilo-guard-opening` | 공식과 관계 이동을 완료한 기존 결정 유지 |
| `pavlov-conditioning` | `learning-theories` | 파블로프 조건반사설과 관계 2건이 기존 챕터에 이미 구현됨 |
| `cumulative-noise-dose` | `total-noise-dose` | 실제 TWA·소음노출량 후보는 과목 2이며 기존 총 소음 노출량 챕터로 통합하는 것이 과목·공식 경계에 맞음 |
| `twa-calculation` | `total-noise-dose` | 미연결 `20210307_025`가 과목 2 TWA 계산 문항. 과목 1 스텁의 동결 키를 바꾸지 않고 기존 과목 2 챕터에 흡수 후보 |

흡수는 스텁 삭제를 즉시 승인한다는 뜻이 아니다. 다음 구조 게이트에서 흡수 대상 챕터의 본문이 실제로 필요한 세부 범위를 포함하는지 확인하고, 부족한 경우 최소 보강한 뒤 비공개 스텁 정리를 결정한다.

## 3. 근거 부족 정리 후보 6개

| slug | 판단 근거 | 처리 제안 |
|---|---|---|
| `flash-rate` | 1,680문항에서 플래시율·엔탈피차/잠열 공식의 직접 후보를 확인하지 못함 | 비공개 스텁 정리 후보 |
| `clam-shell` | 과거 연결 후보 `20200822_112`는 클램셸이 아니라 높은 곳 굴착용 장비 문항으로 오배치 판정됨 | 비공개 스텁 정리 후보 |
| `basic-electric-terms` | 범위가 전압·전류·저항·전력·전하량으로 과도하게 넓고 각각의 완료 계산 챕터가 존재 | 독립 허브를 만들지 않고 정리 후보 |
| `power-cut-rate` | 정전률 공식의 직접 기출을 확인하지 못했고 가용도·신뢰도 챕터와 경계도 불명확 | 비공개 스텁 정리 후보 |
| `workplace-illuminance-standard` | 동일 수치의 직접 기출은 과목 6에만 있고 과목 2에서는 점광원·국부조명 문제만 확인됨 | `construction-illuminance`를 유지하고 이 스텁은 정리 후보 |
| `press-shear-force` | 프레스 전단력 공식의 직접 기출을 확인하지 못했으며 현재 데이터의 전단 관련 문항은 프레스 안전기준 또는 흙의 전단응력임 | 비공개 스텁 정리 후보 |

## 4. 범위 충돌 보류 1개

| slug | 충돌 | 후속 조건 |
|---|---|---|
| `safety-devices` | 스텁은 과목 1이지만 위험장소·위험원 방호장치 분류의 직접 문항 `20220305_047`, `20180819_044`는 과목 3이다. 기존 프레스 전용 챕터에 억지로 넣으면 범위가 과대해지고, `subject_id` 변경은 동결 키 변경이다. | 현재 스텁은 비공개 유지. 과목 3의 일반 방호장치 범위를 신규 slug 없이 수용할 완료 챕터가 확인될 때만 재검토 |

## 다음 실행 묶음

1. **관계·일반 콘텐츠 배치**: `articulation-index`, `carelessness-misjudgment`.
2. **법령·기준 배치**: `drying-equipment`, `construction-illuminance`, `ladder-cage-standard`, `hearing-protection`, `risk-assessment-procedure`, `msd-investigation-cycle`.
3. **계산 구조 배치**: `euler-buckling-load`와 `shore-safety-standard`의 관계 소유권 결정.
4. **흡수 배치**: 18개 대상의 기존 본문 충족 여부와 후보 관계를 검증한 뒤 스텁 정리.
5. **정리 배치**: `RETIRE_NO_EVIDENCE` 6개와 흡수 완료 스텁은 Owner 승인 후 별도 PR에서 삭제 여부 결정.

## 중단·미실행 사항

- 원본 PDF 전수 대조: 미실행. 이번 감사는 관계 후보 선정 단계다.
- 공식 법령·고시 최신 원문 대조: 미실행. 법령 배치의 선행 조건으로 남긴다.
- 챕터 본문·frontmatter·questions·related·status 수정: 없음.
- 기존 스텁 삭제: 없음.
- 신규 slug·의존성·스키마·URL 규칙 변경: 없음.
- Commit·Push·PR·배포: 미실행.
- `AI_HANDOVER.md`: 미갱신. 감사 결과의 Owner 승인과 구현 게이트 전이므로 확정 상태로 기록하지 않는다.

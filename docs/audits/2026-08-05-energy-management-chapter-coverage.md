# 에너지관리기능사 기출 기반 챕터 분류·커버리지 감사

- 감사일: 2026-08-05
- 대상: `src/data/questions/energy-management.json`
- 범위: 2010-01-31~2016-07-10, 27회, 1,620문항
- 성격: 검토용 분류·관계 제안. 실제 챕터 관계, URL, 공개 상태는 변경하지 않음

## 결론

1,620문항 전부를 21개 학습 주제 후보에 배정했다. 미분류는 0건이다. 자동 저신뢰 55건과 그림 문항 32건을 교사용 원본 PDF로 직접 대조했으며, 중복 1건을 제외한 86건의 최종 주제를 확정했다. 자동 1순위와 다른 판정은 22건이다. 현재 12개 URL은 12개 중심 주제에 유지하고, 문항 근거가 독립적으로 반복되는 9개 주제를 분리 후보로 두는 구성이 가장 안정적이다. 이번 감사 결과는 관계 자동 반영이나 신규 URL 승인 근거가 아니다.

## 분류 방법

- 문제 본문과 선택지를 함께 검사하되 본문 일치에 2배 가중치를 적용했다.
- 숫자·계산·설비·법규·운전 절차 등 21개 주제별 명시 패턴을 사용했다.
- 본문만으로 주제가 드러나지 않는 그림 문항 2건은 기존 이미지 자산 감사표의 `missing_element` 설명을 자동 분류 입력에 보완했다.
- 자동 저신뢰 55건과 그림 문항 32건은 27개 교사용 원본 PDF의 문제·보기·표시 정답을 직접 대조했다. 겹치는 1건을 제외한 86건 모두 최종 주제를 `pdf-reviewed`로 기록했다.
- 원본 검수 결과는 `final_topic` 계열 필드에만 반영해 자동 `primary_topic`·점수·신뢰도 기록을 보존했다.
- `jpg 확필` 32건은 분류에는 포함했지만 그림 누락 위험을 해소하거나 공개 가능으로 판정하지 않았다.
- 동일 본문·선택지는 반복 출제로 집계하되 삭제·병합하지 않았다.

## 전체 결과

- 신뢰도: high 1371, medium 194, low 55, unclassified 0
- 1·2순위 동률: 19건
- 원본 PDF 직접 검수: 86건
- 자동 1순위에서 수정된 최종 주제: 22건
- 고유 본문·선택지 조합: 1533개
- 반복 출제 그룹: 85개, 포함 문항 172건, 최대 3회
- 반복 출제 정답 충돌: 0건
- 기존 URL 유지·주제 집중: 12개
- 분리 후보: 9개
- 병합 권고: 없음

## 현재 12개 URL의 기출 커버리지

URL | 현재 제목 | 배정 문항 | 포함 주제 수 | 포함 주제 후보 | low | 그림
--- | --- | ---: | ---: | --- | ---: | ---:
`boiler-piping-insulation` | 보일러 배관·밸브·보온 | 290 | 4 | `heating-systems`<br>`steam-traps-condensate`<br>`piping-fittings-valves`<br>`insulation-materials` | 8 | 10
`boiler-installation-combustion` | 연료·연소·통풍과 보일러 설치 | 286 | 5 | `heating-load-radiators`<br>`draft-flue-gas`<br>`burners-furnaces-atomization`<br>`combustion-air-calculation`<br>`fuel-properties` | 6 | 5
`boiler-operation-basics` | 열·증기·보일러 기초 | 234 | 2 | `boiler-types-construction`<br>`heat-steam-thermodynamics` | 3 | 0
`energy-laws-and-inspection` | 에너지 관계법규와 검사 체계 | 172 | 1 | `energy-laws-inspection` | 1 | 5
`boiler-accessory-equipment` | 보일러 부속설비와 계측 | 118 | 2 | `instruments-accessories`<br>`environmental-pollution-control` | 1 | 1
`boiler-efficiency-heat-balance` | 보일러 효율·증발량·열정산 | 108 | 1 | `efficiency-output-heat-balance` | 5 | 5
`boiler-water-treatment` | 보일러 수질관리 | 97 | 1 | `water-treatment-corrosion` | 2 | 1
`boiler-auxiliary-equipment` | 보일러 부대설비 | 75 | 1 | `auxiliary-feedwater-equipment` | 9 | 1
`boiler-protection-devices` | 보일러 안전장치 | 73 | 1 | `safety-devices` | 3 | 0
`boiler-control-systems` | 보일러 자동제어와 인터록 | 70 | 1 | `automatic-control-interlocks` | 0 | 1
`boiler-operation-maintenance` | 보일러 기동·운전·정지 | 63 | 1 | `operation-maintenance-preservation` | 14 | 3
`boiler-work-safety` | 보일러 작업안전과 사고예방 | 34 | 1 | `failures-accidents-safety` | 3 | 0

현재 `boiler-piping-insulation`과 `boiler-installation-combustion`은 각각 4개와 5개 주제를 한 URL에 포함해 범위가 가장 넓다. `boiler-operation-basics`와 `boiler-accessory-equipment`도 각각 2개 주제를 포함한다. 나머지 8개 URL은 현재 경계와 기출 주제 경계가 대체로 일치한다.

## 21개 학습 주제 제안

검토 키(아직 URL 아님) | 제목 | 문항 | 고유 문항 | 출제 회차 | high/medium/low | 동률 | 그림 | 권고
--- | --- | ---: | ---: | ---: | --- | ---: | ---: | ---
`energy-laws-inspection` | 에너지 관계법규·검사 | 172 | 163 | 27 | 165/6/1 | 0 | 5 | 기존 URL 유지·주제 집중
`boiler-types-construction` | 보일러 형식·구조·재료 | 142 | 136 | 27 | 101/39/2 | 1 | 0 | 분리 후보
`heating-systems` | 증기·온수·복사난방 | 114 | 105 | 27 | 100/11/3 | 2 | 0 | 분리 후보
`piping-fittings-valves` | 배관·이음쇠·밸브 | 109 | 105 | 24 | 89/17/3 | 1 | 9 | 기존 URL 유지·주제 집중
`efficiency-output-heat-balance` | 효율·증발량·열정산 | 108 | 101 | 26 | 90/13/5 | 2 | 5 | 기존 URL 유지·주제 집중
`water-treatment-corrosion` | 수질관리·스케일·부식 | 97 | 91 | 27 | 81/14/2 | 0 | 1 | 기존 URL 유지·주제 집중
`heat-steam-thermodynamics` | 열·증기·열역학 기초 | 92 | 84 | 27 | 80/11/1 | 0 | 0 | 기존 URL 유지·주제 집중
`instruments-accessories` | 계측·부속장치 | 86 | 83 | 25 | 69/16/1 | 0 | 0 | 기존 URL 유지·주제 집중
`fuel-properties` | 연료 특성·발열량 | 83 | 79 | 26 | 78/4/1 | 0 | 0 | 분리 후보
`auxiliary-feedwater-equipment` | 급수·부대설비 | 75 | 74 | 27 | 59/7/9 | 5 | 1 | 기존 URL 유지·주제 집중
`safety-devices` | 안전장치·연소안전 | 73 | 70 | 27 | 63/7/3 | 1 | 0 | 기존 URL 유지·주제 집중
`automatic-control-interlocks` | 자동제어·인터록 | 70 | 65 | 27 | 65/5/0 | 0 | 1 | 기존 URL 유지·주제 집중
`operation-maintenance-preservation` | 기동·운전·정지·보존 | 63 | 61 | 26 | 41/8/14 | 5 | 3 | 기존 URL 유지·주제 집중
`burners-furnaces-atomization` | 버너·화격자·연소장치 | 62 | 58 | 25 | 56/4/2 | 0 | 0 | 분리 후보
`draft-flue-gas` | 통풍·연도·굴뚝 | 51 | 46 | 25 | 43/6/2 | 0 | 4 | 분리 후보
`heating-load-radiators` | 난방부하·방열기 계산 | 45 | 44 | 26 | 43/1/1 | 1 | 0 | 분리 후보
`combustion-air-calculation` | 연소·공기비·배기가스 계산 | 45 | 41 | 23 | 36/9/0 | 0 | 1 | 기존 URL 유지·주제 집중
`insulation-materials` | 보온·단열재 | 41 | 39 | 21 | 39/1/1 | 1 | 0 | 분리 후보
`failures-accidents-safety` | 고장·사고·작업안전 | 34 | 33 | 22 | 24/7/3 | 0 | 0 | 기존 URL 유지·주제 집중
`environmental-pollution-control` | 집진·환경설비 | 32 | 30 | 26 | 30/2/0 | 0 | 1 | 분리 후보
`steam-traps-condensate` | 증기트랩·응축수 환수 | 26 | 25 | 19 | 19/6/1 | 0 | 1 | 분리 후보

## 중복·누락·위험 판단

- 미분류 0건이므로 분류표 자체의 공백은 없다.
- 자동 low 55건은 모두 원본 PDF로 최종 판정을 완료했다. 자동 점수와 low 표시는 분류기 추적을 위해 그대로 유지한다.
- 동률 19건 중 원본 검수 범위에 포함된 문항은 `final_topic`으로 해소했다. 나머지 자동 동률은 실제 관계 작성 시 본문·정답 맥락을 한 번 더 확인한다.
- 반복 출제 85그룹은 기출 빈도를 보여 주는 근거이므로 삭제 대상이 아니다. 동일 본문·선택지 사이 정답 충돌은 0건이다.
- 그림 문항 32건은 기존 `jpg 확필` 상태와 비공개 조건을 그대로 유지한다.
- 9개 분리 후보는 학습 단위 제안이며 신규 slug 승인이나 생성으로 간주하지 않는다.

## 다음 게이트

1. Owner가 12개 유지 + 9개 분리 구조와 신규 공개 식별자 필요 여부를 결정한다.
2. 승인된 구조에 한해 기출 관계를 작성하고 관계 무결성·중복·과목 적합성을 검증한다.
3. 관계 검토가 끝난 뒤에만 챕터 본문 작성과 공개 여부를 별도 승인한다.

## 생성물

- `docs/audits/2026-08-05-energy-management-chapter-classification.csv`: 자동 분류와 원본 검수 최종 분류를 함께 보존한 1,620문항 전수 분류표
- `docs/audits/2026-08-05-energy-management-chapter-proposal.csv`: 21개 주제별 커버리지·권고
- `docs/audits/2026-08-05-energy-management-pdf-candidate-review.csv`: 원본 대조 86건의 문제·정답·이미지 검수 원장
- `scripts/audit-energy-chapter-coverage.mjs`: 재현 가능한 분류·검증 스크립트

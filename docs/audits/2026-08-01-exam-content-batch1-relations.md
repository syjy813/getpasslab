# 시험 포인트 첫 개선 배치 — 관계 무결성 단계

- 작업일: 2026-08-01
- 대상: 확정 관계 불일치 8건 / 6개 공개 챕터
- 결과: 관계 정리 및 사용자용 출제 경향 보정

## 관계 처리 결과

| 문항 | 기존 오연결 | 처리 대상 | 판정 |
|---|---|---|---|
| `20180819_004` | `serious-accident-criteria` | `미매핑 유지` | unmapped-no-exact-target |
| `20210814_004` | `safety-signs` | `safety-management-organization` | explicit-target / 신규 추가 |
| `20220424_023` | `msd-risk-factors` | `murrell-rest-formula` | explicit-target / 신규 추가 |
| `20220424_038` | `msd-risk-factors` | `thermal-conditions-wbgt` | explicit-target / 신규 추가 |
| `20220305_089` | `fire-classification` | `미매핑 유지` | unmapped-no-exact-target |
| `20220305_099` | `fire-classification` | `bleve` | explicit-target / 신규 추가 |
| `20220305_091` | `combustion-range-risk` | `complete-combustion-cst` | explicit-target / 신규 추가 |
| `20220424_096` | `flash-vs-ignition-point` | `미매핑 유지` | unmapped-no-exact-target |

## 미매핑 유지 사유

- `20180819_004`: 승인 범위의 기존 완료 챕터에서 의미가 정확히 일치하는 단일 대상을 찾지 못해 관계를 임의 생성하지 않음. 문항: 산업안전보건법령에 따른 근로자 안전·보건교육 중 근로자 정기 안전·보건교육의 교육내용에 해당하지 않는 것은? (단, 산업안전보건법 및 일반관리에 관한 사항은 제외한다.)
- `20220305_089`: 승인 범위의 기존 완료 챕터에서 의미가 정확히 일치하는 단일 대상을 찾지 못해 관계를 임의 생성하지 않음. 문항: 건축물 공사에 사용되고 있으나, 불에 타는 성질이 있어서 화재 시 유독한 시안화수소 가스가 발생되는 물질은?
- `20220424_096`: 승인 범위의 기존 완료 챕터에서 의미가 정확히 일치하는 단일 대상을 찾지 못해 관계를 임의 생성하지 않음. 문항: 다음 중 공기 중 최소 발화에너지 값이 가장 작은 물질은?

## 검증 기준

- 8개 문항이 기존 오연결 챕터에서 모두 제거됨.
- 명확한 기존 완료 챕터가 있는 경우에만 관계를 유지·추가함.
- 대상 챕터와 문항의 `subject_id` 일치 확인.
- 존재하지 않는 `question_id`, 챕터 내부 중복 관계, 동결 메타데이터 변경 없음.
- `msd-risk-factors`에서 잘못 연결된 휴식시간·WBGT 문항 설명 제거.
- 6개 원본 챕터의 `examComment`를 관계 정리 후 의미에 맞게 보정.

## 변경 챕터

- `bleve`
- `combustion-range-risk`
- `complete-combustion-cst`
- `fire-classification`
- `flash-vs-ignition-point`
- `msd-risk-factors`
- `murrell-rest-formula`
- `safety-management-organization`
- `safety-signs`
- `serious-accident-criteria`
- `thermal-conditions-wbgt`

## 다음 단계

- 관계 변경 결과를 기준으로 첫 배치 16개 챕터의 빈도 수치를 다시 집계한다.
- 빈도 표현 5개를 근사 표현 없이 교정한다.
- 법령·편집 고위험 5개는 공식 출처 검증 후 별도 커밋으로 처리한다.

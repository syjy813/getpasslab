# 에너지관리기능사 챕터 후보 원본 PDF 정밀 검수

- 검수일: 2026-08-05
- 원본: `C:\Users\Guns\Desktop\에너지관리기능사 기출.zip`
- 범위: 2010-01-31~2016-07-10 교사용 PDF 27개
- 후보: 자동 low 55건 + `jpg 확필` 32건 - 중복 1건 = 86건
- 성격: 챕터 분류 검수. 문제 데이터, 챕터 관계, slug, 검토 플래그, 공개 상태는 변경하지 않음

## 결론

86건 모두 교사용 원본 PDF의 문제·보기·표시 정답을 직접 대조했다. 저장 정답은 86건 전부 원본과 일치했다. 그림 문항 32건은 원본과 내재화 이미지 자산을 함께 육안 확인했고, 32개 파일 모두 필요한 수식·표·도형·보기 영역이 판독 가능했다. 자동 1순위와 다른 최종 주제는 low 19건과 그림 전용 3건, 합계 22건이다.

자동 분류의 `primary_topic`, 점수, 신뢰도는 추적용으로 보존하고, 원본 검수 결론은 `final_topic`, `final_title`, `final_current_slug`, `review_resolution=pdf-reviewed`에 분리 기록했다.

## 원본·데이터 검증

- 원본 PDF: 27개, 고유 SHA-256 27개
- PDF 문제 번호 위치 확인: 86/86
- 교사용 정답 표시와 저장 정답 일치: 86/86
- 본문 앞부분 자동 일치: 85/86
- 본문 자동 일치 예외: `20140406_031` 1건. 수식이 PDF 텍스트 추출을 분절해 자동 비교만 실패했으며, 원본 이미지에서 본문·계산식·정답을 직접 확인해 통과
- 그림 자산 SHA-256 일치: 32/32
- 그림 자산 육안 판독: 32/32
- 최종 분류 확정: 86/86

## 자동 1순위 수정 22건

문항 ID | 범위 | 자동 1순위 | 원본 검수 최종 주제
--- | --- | --- | ---
`20100131_036` | low | `heat-steam-thermodynamics` | `heating-load-radiators`
`20100328_052` | low | `auxiliary-feedwater-equipment` | `safety-devices`
`20100711_006` | low | `auxiliary-feedwater-equipment` | `efficiency-output-heat-balance`
`20101003_006` | low | `auxiliary-feedwater-equipment` | `efficiency-output-heat-balance`
`20110417_016` | low | `instruments-accessories` | `safety-devices`
`20110417_042` | low | `draft-flue-gas` | `operation-maintenance-preservation`
`20110731_052` | low | `heat-steam-thermodynamics` | `operation-maintenance-preservation`
`20111009_032` | low | `steam-traps-condensate` | `operation-maintenance-preservation`
`20120212_028` | low | `boiler-types-construction` | `failures-accidents-safety`
`20120408_043` | low | `boiler-types-construction` | `operation-maintenance-preservation`
`20121020_022` | low | `failures-accidents-safety` | `operation-maintenance-preservation`
`20130414_025` | low | `instruments-accessories` | `operation-maintenance-preservation`
`20130721_007` | low | `failures-accidents-safety` | `operation-maintenance-preservation`
`20130721_044` | 그림 | `boiler-types-construction` | `piping-fittings-valves`
`20140406_002` | low | `failures-accidents-safety` | `operation-maintenance-preservation`
`20140406_020` | low | `burners-furnaces-atomization` | `failures-accidents-safety`
`20140406_029` | low | `piping-fittings-valves` | `insulation-materials`
`20140720_041` | 그림 | `boiler-types-construction` | `piping-fittings-valves`
`20150404_028` | low | `automatic-control-interlocks` | `auxiliary-feedwater-equipment`
`20160402_038` | low | `heating-systems` | `piping-fittings-valves`
`20160402_043` | 그림 | `boiler-types-construction` | `piping-fittings-valves`
`20160710_028` | low | `auxiliary-feedwater-equipment` | `water-treatment-corrosion`

## 영향과 남은 게이트

- 이번 검수는 분류 감사표만 보완했다. 1,620문항의 본문·보기·정답과 기존 식별자는 변경하지 않았다.
- 실제 기출↔챕터 관계는 아직 0건이며, 12개 기존 URL + 9개 분리 후보 구조에 대한 Owner 결정 전에는 반영하지 않는다.
- 그림 문항 32건의 `jpg 확필` 플래그와 비공개 조건은 그대로 유지한다. 이미지 자산 검수가 공개 승인이나 이용 권리 해소를 뜻하지 않는다.
- 과거 법규 문제는 기출 당시 정답 검수만 완료한 상태다. 현행 법령 콘텐츠로 사용할 때는 별도 공식 원문 대조가 필요하다.

## 재현 파일

- `scripts/audit-energy-pdf-candidates.py`
- `docs/audits/2026-08-05-energy-management-pdf-candidate-review.csv`
- `docs/audits/2026-08-05-energy-management-chapter-classification.csv`

# 에너지관리기능사 기출↔챕터 관계 적용 준비안

> 이 문서와 동명 CSV는 관계 적용 전 제안 스냅샷이다. 2026-08-05 로컬 적용 후 상태는 `docs/audits/2026-08-05-energy-management-21-chapter-local-implementation.md`를 확인한다.

- 작성일: 2026-08-05
- 기준: 원본 PDF 검수를 반영한 `final_topic`
- 범위: 27회, 1,620문항, 21개 학습 주제
- 상태: 검토용 파생 산출물. 실제 챕터 frontmatter와 production에는 미적용

## 결론

1,620문항을 21개 최종 주제에 1:1 배정한 관계 적용 준비표를 생성했다. 기존 slug로 연결 가능한 주제는 12개이고, 별도 slug가 필요한 분리 후보는 9개다. 그림 문항 32건은 적용 대상에서 제외했으며 나머지 1588건도 Owner의 관계 활성화 승인 전까지 모두 `pending-owner-activation` 상태다.

이 파일과 CSV는 실제 관계 정본이 아니다. 프로젝트 결정 D-73에 따라 실제 관계를 활성화할 때는 챕터 md frontmatter의 `questions` 배열 한 곳에만 기록해야 한다.

## 무결성 결과

- 전체 관계 후보: 1620건
- 고유 question ID: 1620건
- 과목 불일치: 0건
- 동일 문항의 복수 최종 주제: 0그룹
- 기존 slug 대상 주제: 12개
- 분리 후보 주제: 9개
- 관계 적용 가능 후보: 1588건
- 그림 검토로 제외: 32건
- 실제 frontmatter 관계: 0건 유지

## 21개 관계 대상

주제 키 | 제목 | 전체 | 적용 후보 | 그림 제외 | 조치 | 현재 컨테이너 | 제안 대상 slug | slug 상태
--- | --- | ---: | ---: | ---: | --- | --- | --- | ---
`energy-laws-inspection` | 에너지 관계법규·검사 | 172 | 167 | 5 | 기존 URL 유지 | `energy-laws-and-inspection` | `energy-laws-and-inspection` | 기존 slug
`boiler-types-construction` | 보일러 형식·구조·재료 | 142 | 142 | 0 | 분리 후보 | `boiler-operation-basics` | `boiler-types-construction` | 미생성·Owner 승인 필요
`heating-systems` | 증기·온수·복사난방 | 114 | 114 | 0 | 분리 후보 | `boiler-piping-insulation` | `heating-systems` | 미생성·Owner 승인 필요
`piping-fittings-valves` | 배관·이음쇠·밸브 | 109 | 100 | 9 | 기존 URL 유지 | `boiler-piping-insulation` | `boiler-piping-insulation` | 기존 slug
`efficiency-output-heat-balance` | 효율·증발량·열정산 | 108 | 103 | 5 | 기존 URL 유지 | `boiler-efficiency-heat-balance` | `boiler-efficiency-heat-balance` | 기존 slug
`water-treatment-corrosion` | 수질관리·스케일·부식 | 97 | 96 | 1 | 기존 URL 유지 | `boiler-water-treatment` | `boiler-water-treatment` | 기존 slug
`heat-steam-thermodynamics` | 열·증기·열역학 기초 | 92 | 92 | 0 | 기존 URL 유지 | `boiler-operation-basics` | `boiler-operation-basics` | 기존 slug
`instruments-accessories` | 계측·부속장치 | 86 | 86 | 0 | 기존 URL 유지 | `boiler-accessory-equipment` | `boiler-accessory-equipment` | 기존 slug
`fuel-properties` | 연료 특성·발열량 | 83 | 83 | 0 | 분리 후보 | `boiler-installation-combustion` | `fuel-properties` | 미생성·Owner 승인 필요
`auxiliary-feedwater-equipment` | 급수·부대설비 | 75 | 74 | 1 | 기존 URL 유지 | `boiler-auxiliary-equipment` | `boiler-auxiliary-equipment` | 기존 slug
`safety-devices` | 안전장치·연소안전 | 73 | 73 | 0 | 기존 URL 유지 | `boiler-protection-devices` | `boiler-protection-devices` | 기존 slug
`automatic-control-interlocks` | 자동제어·인터록 | 70 | 69 | 1 | 기존 URL 유지 | `boiler-control-systems` | `boiler-control-systems` | 기존 slug
`operation-maintenance-preservation` | 기동·운전·정지·보존 | 63 | 60 | 3 | 기존 URL 유지 | `boiler-operation-maintenance` | `boiler-operation-maintenance` | 기존 slug
`burners-furnaces-atomization` | 버너·화격자·연소장치 | 62 | 62 | 0 | 분리 후보 | `boiler-installation-combustion` | `burners-furnaces-atomization` | 미생성·Owner 승인 필요
`draft-flue-gas` | 통풍·연도·굴뚝 | 51 | 47 | 4 | 분리 후보 | `boiler-installation-combustion` | `draft-flue-gas` | 미생성·Owner 승인 필요
`heating-load-radiators` | 난방부하·방열기 계산 | 45 | 45 | 0 | 분리 후보 | `boiler-installation-combustion` | `heating-load-radiators` | 미생성·Owner 승인 필요
`combustion-air-calculation` | 연소·공기비·배기가스 계산 | 45 | 44 | 1 | 기존 URL 유지 | `boiler-installation-combustion` | `boiler-installation-combustion` | 기존 slug
`insulation-materials` | 보온·단열재 | 41 | 41 | 0 | 분리 후보 | `boiler-piping-insulation` | `insulation-materials` | 미생성·Owner 승인 필요
`failures-accidents-safety` | 고장·사고·작업안전 | 34 | 34 | 0 | 기존 URL 유지 | `boiler-work-safety` | `boiler-work-safety` | 기존 slug
`environmental-pollution-control` | 집진·환경설비 | 32 | 31 | 1 | 분리 후보 | `boiler-accessory-equipment` | `environmental-pollution-control` | 미생성·Owner 승인 필요
`steam-traps-condensate` | 증기트랩·응축수 환수 | 26 | 25 | 1 | 분리 후보 | `boiler-piping-insulation` | `steam-traps-condensate` | 미생성·Owner 승인 필요

## 적용 원칙

1. 기존 URL 유지 12개는 기존 slug에 연결할 수 있지만, 공개 차단 요구 때문에 이번 단계에서는 frontmatter를 수정하지 않는다.
2. 분리 후보 9개의 `proposed_target_slug`는 제안값일 뿐이며 실제 파일·URL은 생성하지 않았다.
3. `jpg 확필` 32건은 slug 승인 여부와 관계없이 `frontmatter_inclusion=exclude`를 유지한다.
4. 실제 관계 적용 시에는 이 준비표를 입력으로 사용하되, 정본은 각 챕터 frontmatter의 `questions` 배열만 둔다.
5. 관계 적용·공개는 신규 slug 승인, 이미지 문항 처리, 기술 리뷰를 각각 통과한 뒤 별도 수행한다.

## 다음 승인 항목

- 분리 후보 9개의 신규 slug 생성 여부와 제안 식별자 확정
- 텍스트 문항 1588건의 frontmatter 관계 활성화 시점
- 그림 문항 32건의 렌더러·대체텍스트 검증 후 별도 공개 여부

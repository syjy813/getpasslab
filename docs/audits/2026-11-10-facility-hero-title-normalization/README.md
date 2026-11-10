# 시설 대표 이미지 타이틀·부제 정렬 1차 통일

기준일: 2026-11-10

## 목적

게시 중인 시설 대표 이미지 14장을 전수 비교한 뒤, 현재 승인된 `employment-types` 대표 이미지의 상단 타이포 구조를 일반 대표 이미지 정본으로 삼아 편차가 큰 6장을 우선 교정한다.

## 대상

- 01 `what-is-facility-management`
- 06 `hanfms`
- 08 `korailtech`
- 10 `statutory-appointments`
- 11 `mechanical-maintainer-levels`
- 13 `boiler-inspection-manager`

공개 URL·본문·alt·이미지 경로는 바꾸지 않는다.

## 적용 규격

- 캔버스: 1440×1080, 4:3
- 타이틀: 중앙 정렬, 시각적 기준 y≈50~178px, 좌우 안전영역 80px
- 부제: 중앙 정렬, y≈197~257px, 좌우 안전영역 120px
- 상단 정보 위계: 타이틀 → 부제 2단계
- 캡슐/붓터치형 부제와 세 번째 설명문 제거
- 밝은 아이보리/크림 상단 배경, 외곽 여백·프레임 없음
- 본문 시각 요소는 대략 y=280~320px 아래에서 시작
- 각 글의 기존 설비·건물·서류 장면은 최대한 유지

## 보존·변경 범위

각 대상은 WebP 공개 파생본과 PNG 마스터를 함께 교체하고, `docs/audits/2026-11-06-facility-image-bulk/manifest.json`의 두 SHA-256을 새 파일과 일치시킨다. 대상 6장 외 시설 이미지와 콘텐츠 원문은 변경하지 않는다.

## 검증 계획

1. manifest 해시와 실제 WebP/PNG 바이트 일치
2. WebP/PNG 1440×1080 확인
3. 시설 bulk visual QA
4. 시설 publication QA / SEO
5. PR diff에서 대상 6장 외 제품 이미지 변경 없음 확인
6. 사용자 승인 후에만 main 병합 및 Production 배포

호병백마는 별도 시리즈 톤 승인본이므로 이번 1차 통일 대상에서 제외한다.

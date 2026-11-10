# 시설 대표 이미지 타이틀·부제 정렬 2차 통일

기준일: 2026-11-10

## 목적

1차에서 편차가 큰 6장을 정리한 뒤 남은 미세 조정 대상 02·04·05·07·09·12의 상단 타이포를 §5.13.11 정본에 맞춘다.

## 대상

- 02 `first-job`
- 04 `shifts-and-pay`
- 05 `public-sector-comparison`
- 07 `postal-facilities`
- 09 `kamcofmc`
- 12 `mechanical-career-records`

공개 URL·본문·alt·이미지 경로는 유지한다.

## 적용 규격

- 캔버스 1440×1080, 4:3
- 타이틀 중앙 정렬, y≈50~178px
- 부제 중앙 정렬, y≈197~257px
- 타이틀 → 부제 2단계 정보 위계
- 캡슐형 부제·세 번째 설명문·장식형 구분선 제거
- 아이보리/크림 상단 배경, 외곽 프레임 없음
- 기존 건물·설비·서류·체크리스트 등 본문 시각 요소는 유지

## 파일 처리

02·04·07·09·12는 기존 bulk hero 공개 WebP와 PNG 검수 마스터를 교체한다.
05 공공부문 대표 이미지는 2026-11-05 역사 manifest와 기존 v2 파생본을 보존하기 위해 새 `facility-image-refresh/05/01-public-sector-hero-v3.webp` 및 별도 master를 override로 추가한다.

PNG 검수 마스터는 공개 WebP와 동일한 1440×1080 화면을 확인하기 위한 무손실 indexed PNG로 저장한다.

## 검증

1. 새 WebP/PNG SHA-256과 manifest 일치
2. 6장 모두 1440×1080
3. 기존 역사 공공부문 파생본 보존
4. bulk visual / pictogram / card-spacing 보호 검사
5. Facility publication QA / SEO
6. PR diff에서 승인 대상 외 제품 이미지 변경 없음

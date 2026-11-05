# 시설 인포그래픽 생성기
이 스크립트는 `docs/standards/facility-content-guide-v1.4.md` §5.13.6~7의 SVG 헤더 및 1~4장 카드 제작 규칙을 코드로 고정한다.
호출 예: `node scripts/generate-facility-infographic.mjs docs/standards/facility-infographic-templates/example-3.json /tmp/facility-3.svg`
캔버스 1440×1080, 제목 x80/top140/64px Bold, 부제 30px/16px 간격, 로고 210×34 x1150/y80, 카드 상단은 헤더 행 수에 따라 자동 계산한다.
카드 개수: 1장 단일 본문, 2장 좌우 비교, 3장 3열 비교, 4장 2×2 비교. 카드 수에 따라 달라지는 것은 카드 좌표와 내부 정보 밀도뿐이다.
생성 결과는 편집 가능한 SVG이며 기존 공개 WebP 및 원본과 별개이다. 발행은 별도의 이미지 검수/반영 절차를 따르고, 모바일에서 긴 텍스트 가독성을 확인해야 한다.

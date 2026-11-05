# 시설 카드형 이미지 정본

카드 1~4개의 공통 제작 템플릿이다. `example-N.json`의 내용만 교체해 다음 명령으로 SVG를 생성한다.

```sh
node scripts/generate-facility-infographic.mjs docs/standards/facility-infographic-templates/example-3.json /tmp/facility-3.svg
node --test scripts/test-facility-infographic.mjs
```

- 캔버스 1440×1080, 제목 x80/y140·64px Bold, 부제30px·제목 아래16px, 좌측 정렬 유지.
- 우측 상단 로고는 **x1200/y44**, 예약 영역210×34px. 이전 x1150/y80보다 오른쪽50px·위36px 이동. 심벌·글자 크기는 유지한다.
- **우측 하단 원형 그린 장식은 제거**한다. 좌측 상단 장식과 프레임, 하단 메시지 영역은 유지한다.
- 1카드는 단일 설명, 2카드는 좌우 비교, 3카드는3열, 4카드는2×2(각 행236px·행 간격20px). 제목이 길면 글자를 줄이지 않고 후속 영역을 이동한다.
- 대표 이미지·썸네일의 합성 템플릿과 별개다. 과거 감사기록의 렌더러와 미병합 PR246 소스는 최신 정본으로 사용하지 않는다.
- 새 카드 유형이 필요하면 목적·구조를 제안해 승인을 받은 뒤 렌더러·JSON/SVG 샘플·가이드·검증을 함께 갱신한다.
- WebP 변환 예: Sharp에 SVG를 density96으로 입력하고1440×1080으로 변환, `webp({quality:86,effort:6})`. 한글 글꼴을 확인하고 승인한 최종 WebP 바이트를 발행한다.
- 발행 전 320/390px·PC1440px에서 로고 잘림·카드 배치·세부문구 확인. 중요한 조건은 HTML 본문에도 제공한다.

정본 규칙: `docs/standards/facility-content-guide-v1.4.md` §5.13.6~7.

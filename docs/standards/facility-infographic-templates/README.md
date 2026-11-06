# 시설 카드형 이미지 정본

## 카드 하단 여백 축소 프로필 (2026-11-06)

신규 카드 및 여백 수정을 승인받은 카드는 `cardSpacing: "compact"`와 다음 명령을 사용한다. 기본 렌더러를 재사용하면서 설명 마지막 줄과 하단 라벨 사이의 공백을 약 절반으로 줄인다. 카드·라벨·하단 메시지·프레임을 함께 줄이며 텍스트와 아이콘은 원래 크기를 유지한다. 같은 행의 라벨 높이는 동일하게 유지한다.

```sh
node scripts/generate-facility-compact-infographic.mjs docs/standards/facility-infographic-templates/compact-example-3.json /tmp/facility-compact.svg
node scripts/check-facility-card-spacing.mjs
```

가로는 1440px, 높이는 공백 축소량에 따라 달라지므로 SVG·WebP·HTML 치수를 함께 갱신한다. 대표 이미지와 이전 승인본은 4:3을 유지하며 아래의 기존 샘플은 이전 제작 이력을 재현한다. 4카드 2×2 행은 이미 짧으므로 그대로 유지한다. 정본 가이드 §5.13.9 참조.

## 기존 4:3 프로필

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

## 픽토그램·한 줄 정렬

- 주제별 도형 정본은 `scripts/facility-pictograms.mjs`. 카드의 `icon`에 의미가 맞는 키를 지정한다. 청사/모자회사/업체계약/평균보수/채용공고/고용주확인/사업장/자격증/교대달력/급여명세/계약기간을 구별한다.
- 2/3카드 픽토그램은140/128px로 확대한다. 제목·카드·로고 좌표는 유지한다.
- 각 카드 하단 문구와 전체 이미지 하단 한 줄은 상자 중심좌표를 기준으로 배치한다. `dominant-baseline=central`과 글꼴의 광학보정을 함께 사용한다. 임의의 상단 y좌표로 맞추지 않는다.
- `node scripts/check-facility-card-centering.mjs`는 최종 WebP에서15개 라벨의 실제 글자영역을 측정해 위아래 여백 차이가2px 이하인지 확인한다. 현재 승인본의 최대 차이는1px.

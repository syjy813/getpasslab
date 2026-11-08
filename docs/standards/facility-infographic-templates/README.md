# 4·5·6개 통합형 (2026-11-08)

현재 지원 범위는 **1~6개**다. 기존 1~4개 4:3/compact 예제는 그대로 재현하며, 설명이 있는 4~6개 비교는 `cardLayout: "overview"`를 사용한다. 5·6개는 기존 렌더러에서도 overview를 자동 선택한다.

| 항목 수 | PC 한 장 | 모바일 한 장 | 예제 |
|---|---|---|---|
| 4 | 2×2 | 1열 4행 | `overview-example-4.json` — 0화의 호텔·병원·백화점·마트 통합 |
| 5 | 2+2+1, 마지막 카드 중앙 | 1열 5행 | `overview-example-5.json` — 호텔 면접 질문 |
| 6 | 2×3 | 1열 6행 | `overview-example-6.json` — 0화의 지원 전 확인사항 통합 |

읽기용 검토본은 [overview-preview.html](overview-preview.html). SVG 편집 마스터·PNG 원본·WebP 파생은 `overview-example-N-desktop/mobile.*`로 보존한다. `overview-workload-4.json`은 0화의 업무 부담 4조건을 추가 통합한 SVG 예제다. 기존 공개 0화는 아직 교체하지 않는다.

```sh
node scripts/render-facility-overview-examples.mjs
node --test scripts/test-facility-infographic.mjs scripts/test-facility-overview.mjs
# 기존 이미지 QA 환경(sharp)에서 PNG/WebP와 독립 검토본을 다시 만들 때만:
node scripts/prepare-facility-overview-preview.mjs
```

- 렌더러: 기존 `generate-facility-infographic.mjs` → `facility-overview-layout.mjs`; compact 진입점도 같은 통합형으로 위임한다. 패키지·제품 의존성 추가 없음.
- PC 마스터는 폭 1440, 제목/부제 64/30px과 기존 색·브랜드·픽토그램을 재사용한다. 높이는 실제 카드 내용에 따라 늘어나며 **4:3에 강제로 압축하지 않는다**.
- 모바일은 같은 항목과 순서·설명을 모두 포함한 폭 720의 1열 파생이다. 제목 44, 부제/설명/라벨 32px, 카드 제목 40px. 별도 정보 이미지로 분할한 것이 아니며 한 화면에는 전체 항목이 담긴 이미지 하나만 노출한다.
- 카드별 제목·요약·상세(최대 3개, 각 2줄)·하단 문구를 모두 보존한다. 긴 문구는 줄바꿈과 높이로 해결하며 한도를 넘으면 오류를 내고 문구를 조용히 생략하지 않는다. 5개형의 마지막 카드도 동일 폭을 유지한다.
- 모바일/PC 선택은 실제 삽입 위치에서 `<picture>`로 제공한다. preview 예제는 767px 이하 모바일 파생을 선택한다. `<source>`와 `<img>`에 각 파일의 실제 width/height를 넣어 비율을 예약하며, 확대·crop·가로 스크롤을 넣지 않는다.
- 320/390px(본문폭 280/350px), PC/태블릿 768/1440px(검토본 본문폭 720px)에서 확인한다. 핵심 세부 글씨는 이 조건에서 12px 이상이다. 더 좁은 삽입 위치에서는 다시 확인하며 PC 이미지를 모바일에 단순 축소해 쓰지 않는다.
- 같은 비교 주제의 4~6개는 이 통합형을 우선한다. 다른 질문을 설명하는 이미지까지 억지로 합치지는 않는다. 실제 발행 전 본문 비교표/설명·alt와 정보가 일치하는지 별도로 확인한다.
- 이번 브라우저 검사와 CI 근거는 PR 및 `docs/audits/2026-11-08-facility-overview/README.md`를 확인한다. 템플릿 검수와 실제 글 적용·Production 배포는 구분한다.

---

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

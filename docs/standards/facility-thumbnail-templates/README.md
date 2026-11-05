# GetPassLab 시설 대표 이미지·썸네일 — 풀블리드 정본 (2026-11-05)

정본 가이드: `docs/standards/facility-content-guide-v1.4.md` **§5.13.8**.

## 신규 대표 이미지·썸네일은 반드시 이 방식 사용

**배경 이미지가 1440×1080 캔버스 전체를 채운다.** 하얀 헤더·아이보리 프레임·구분선·하단 그래픽 슬롯·반투명 텍스트 박스를 생성하지 않는다. 이미지와 분리된 **투명 SVG에 제목·부제·우측 상단 공식 GetPassLab 로고만** 렌더링해 최종 WebP 위에 합성한다.

| 레이어 | 고정/가변 | 기본 좌표·규칙 |
|---|---|---|
| 배경 | 주제별 4:3 그림 **가변**, 반드시 텍스트·로고 없는 순수 일러스트 | 1440×1080 **전체**. 위·아래 끝까지 그림 존재, 합성시 자동 크롭 금지 |
| 제목 | 텍스트 가변, 위치·색상 고정 | 중심 x=720, 상단 y=140, `#114935`, 임시 **64px Bold** |
| 부제 | 텍스트 가변, 위치·색상 고정 | 중심 x=720, 첫 줄 기본 y=230, `#52665B`, 임시 **30px Regular** |
| GetPassLab | **공식 SVG만** | x=1150/y=80, 카드 템플릿과 동일한 심벌·워드마크, 1회 |

**폰트 크기 미확정:** 64/30px은 직전 가이드 수치를 그대로 임시 적용한 시안용 값이며, **합성 결과를 본 뒤 사용자와 결정**한다. 별도 승인 전 임의로 축소/증가하지 않는다.

## 제작

`example-fullbleed.json`은 샘플 내용. `fullbleed-overlay-sample.svg`는 **배경이 없는 투명 글자·로고 오버레이(발행용 이미지 아님)**이다.

```sh
# 투명 오버레이 SVG 생성 — 글자·로고 위치 확인용
node scripts/render-facility-thumbnail-fullbleed.mjs docs/standards/facility-thumbnail-templates/example-fullbleed.json --overlay /tmp/fullbleed-overlay.svg

# 4:3 전체 배경 + 투명 오버레이 = 최종 WebP
node scripts/render-facility-thumbnail-fullbleed.mjs docs/standards/facility-thumbnail-templates/example-fullbleed.json --compose /path/to/artwork-only-4x3.png /tmp/fullbleed-result.webp
```

- **그림 제작 시** 원본 이미지 내부에 이미 그려진 제목·부제·로고·시리즈명·배지를 그대로 포함하지 않는다. 제목/로고가 있는 AI 완성 이미지를 배경으로 사용하면 **중복 표기 실패**다.
- 4:3 완성 그림을 입력한다. 종횡비가 맞지 않으면 오류를 내고, 사용자 승인 없이 자동 크롭/왜곡하지 않는다.
- 그림 상단은 **텍스트 가독성이 확보되는 구도와 명도**로 제작한다. 템플릿에서 임의 흰색 띠·반투명 박스·그라데이션으로 가리지 않는다.
- 기존 고품질 배경 그래픽에 사람·건물·설비·문서 등 무엇을 그릴지는 콘텐츠 취지에 맞게 자유롭게 결정한다. 템플릿은 전체 배경 하나만 받는다.
- **카드형 1~4종 비교 이미지**는 기존 `facility-infographic-templates/` 및 §5.13.7의 좌측 정렬·카드 레이아웃을 그대로 사용한다.
- 기존 `hero-4x3-preview.svg`, `hero-4x3-collage-preview.svg`, `generate-facility-thumbnail.mjs` 등의 분할 그래픽/콜라주 템플릿은 **구버전 호환·회귀 테스트용**이다. 신규 4:3 대표 이미지는 `render-facility-thumbnail-fullbleed.mjs`만 사용한다. 특수한 형식이 필요하다면 사용자 승인 후 별도 공식 템플릿으로 등록한다.
- **실서버 배포·기존 콘텐츠 3종 교체는 이번 정본 등록만으로 진행되지 않는다.** 합성 이미지/폰트 크기를 검수한 뒤 별도 승인한다.

## QA

```sh
node --test scripts/test-facility-thumbnail-fullbleed.mjs
node --test scripts/test-facility-thumbnail.mjs
node --test scripts/test-facility-infographic.mjs
```

세 테스트와 320/390/1440px 시각 QA를 구분해 보고한다. 공식 로고 x1150/y80, 제목·부제 x720, 상단 이미지 점유, 중복 글자·로고, 기존 공개 URL 보호를 확인한다.

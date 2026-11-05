# GetPassLab 시설 썸네일·대표 이미지 4:3 템플릿

정본 규칙: `docs/standards/facility-content-guide-v1.4.md` §5.13.8. **실제 배경·제목·부제·로고는 공통 SVG에서 생성하고, 주제별 메인 그래픽만 교체한다.**

## 잠금 영역과 교체 영역

| 구분 | 1440×1080 기준 | 변경 정책 |
|---|---|---|
| 캔버스/배경 | 1440×1080, 포레스트 그린·아이보리, 라운드 프레임 | 임의 변경 금지 |
| 브랜드 | x=1150, y=80, 경로형 심벌+GetPassLab, 색상 #114935 | 단 한 번, 좌표·크기 고정 |
| 메인 제목 | **x=720, text-anchor=middle**, top=140, 64px Bold, #114935 | 가운데 정렬, 텍스트만 변경. 2줄까지 허용 |
| 부제 | **x=720, text-anchor=middle**, 제목 블록 하단 16px, 30px Regular, #52665B | 가운데 정렬, 텍스트만 변경. 2줄까지 허용 |
| 구분선 | x=80..1360, 제목·부제 아래, 4px #76B978 | 자동 계산 |
| 메인 그래픽 외곽 | x=80, y=348, w=1280, h=652 (1줄 제목·부제 기준) | 헤더 2줄이면 y 자동 이동; 하단 y=1000 고정 |
| 실제 그림 안전영역 | x=98, y=366, w=1244, h=616 (1줄 기준) | **이 슬롯에만 그림 삽입**; 단일형은 1장, 콜라주형은 3장면. 안전영역 밖으로 넘침/로고 중복 금지 |

## 등록된 메인 그래픽 구성

- **일반 일러스트형** (`variant: "illustration"`, 기본): 1244×616px 그래픽 슬롯에 한 장을 삽입한다. 별도 그림·캐릭터·설비에 텍스트/브랜드/외곽 프레임을 생성하지 않는다.
- **콜라주형** (`variant: "collage"`): 3장면 고정 구획 — 좌측 큰 장면 `x98,y366,w760,h616`; 오른쪽 위 `x876,y366,w466,h299`; 오른쪽 아래 `x876,y683,w466,h299`. 슬롯 간격 18px, 모서리 18px, 각 이미지는 비율을 유지해 삽입한다.
- 둘 모두 **공통 배경·로고·타이틀 셸을 공유**한다. 다른 이미지 갯수·구획·비율이 필요하면 임의 제작하지 말고 신규 템플릿을 승인·등록한다. 그래픽 자체의 질감·디테일·구도는 주제에 맞게 고품질로 제작한다.

제목·부제의 모든 `tspan`도 x=720에 배치해 캔버스·그래픽 외곽·안전영역의 중심축과 맞춘다. **카드형 인포그래픽(1~4장)의 상단 제목·부제는 x=80, text-anchor=start의 좌측 정렬을 유지**한다. 공통 글꼴·색·로고 함수는 재사용하되 헤더 정렬 규칙은 용도별로 구분한다.

줄바꿈은 기존 폭 제한(제목 20.4, 부제 40 가중 글자 단위)과 최대 2줄을 유지한다. 문자열은 단어/의미 단위로 자동 분리하고, 명시적 줄바꿈은 `title`·`subtitle`에 문자열 배열을 전달한다. 각 줄을 따로 가운데 정렬하며 제목 74px·부제 40px 줄 높이, 제목 아래 16px 간격을 유지한다. 범위를 넘으면 오류로 처리하고 폰트를 줄이지 않는다.

## 제작·미리보기

미리보기(메인 그래픽 자리 표시):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-hero.json /tmp/facility-hero-preview.svg --preview
```

`example-hero.json`/`hero-4x3-preview.svg`는 제목·부제 각각 1줄 예시다. `example-hero-two-lines.json`/`hero-4x3-two-lines-preview.svg`는 각각 2줄인 예시로, 중심축은 그대로 두고 그래픽 시작 y만 114px 아래로 이동한다.

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-hero-two-lines.json /tmp/facility-hero-two-lines-preview.svg --preview
```

일반형 메인 그래픽 합성(PNG/JPG/WebP 중 하나):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-hero.json /tmp/facility-hero.svg --art /path/to/main-illustration.png
```

콜라주형 미리보기(3개 장면 교체 슬롯):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-collage.json /tmp/facility-collage-preview.svg --preview
```

콜라주형 메인 그래픽 합성(이미지 3개 필수, 순서: 왼쪽 메인 → 오른쪽 위 → 오른쪽 아래):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-collage.json /tmp/facility-collage.svg --collage /path/to/main.png /path/to/top-right.webp /path/to/bottom-right.jpg
```

- **그래픽만 AI 생성**: 별도로 제작한 주제 일러스트나 콜라주 각 장면에는 로고·제목·텍스트·구분선·배경 테두리를 그리지 않는다. 기하학적인 크롭이나 글자 삽입은 AI에게 맡기지 않는다.
- 자동 합성은 이미지 비율을 지키는 `meet` 방식이다. 그래픽을 자르거나 찌그러뜨리지 않으며, 모서리는 SVG 클립으로 보호한다. 안전영역에 맞는 구도를 처음부터 제작한다.
- **미리보기 템플릿은 공개 금지**: `--preview` 출력에는 메인 그래픽 자리 표시가 남는다. 최종 출력은 일반형 `--art` 1장 또는 콜라주형 `--collage` 3장이 필요하며, 누락·과다·잘못된 포맷을 거부한다.
- 1:1 티스토리 썸네일·1.91:1 OG 이미지는 별도 규격이다. 필요할 때 별도 템플릿을 승인·등록한다. 이 4:3 템플릿을 무작정 크롭하지 않는다.
- 이미 제작·승인된 대표 이미지와 기존 공개 URL은 이 템플릿 등록만으로 변경되지 않는다.

## 템플릿 미등록 상황

새로운 비율, 그래픽 영역 구조, 텍스트 배치가 필요한 경우 이미지를 임의 디자인하지 않는다. `시설 콘텐츠 통합 가이드` §5.13.7과 동일하게 **요구사항·재사용 불가 사유 설명 → 사용자 승인 → 새로운 템플릿/샘플/QA 제작 → GitHub 정본 등록 → 콘텐츠 적용** 순서로 진행한다.

## 검증

`node --test scripts/test-facility-thumbnail.mjs`과 기존 `scripts/test-facility-infographic.mjs`를 실행한다. 이후 SVG 렌더링, 로고 단일 표시, 표기 오류·비율·320/390px 모바일·1440px PC 목록/본문 크롭을 시각 QA한다. 테스트 통과만으로 실서버 반영이나 실제 시각 QA가 완료된 것은 아니다.

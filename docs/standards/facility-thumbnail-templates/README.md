# GetPassLab 시설 썸네일·대표 이미지 4:3 템플릿

정본 규칙: `docs/standards/facility-content-guide-v1.4.md` §5.13.8. **실제 배경·제목·부제·로고는 공통 SVG에서 생성하고, 주제별 메인 그래픽만 교체한다.**

## 잠금 영역과 교체 영역

| 구분 | 1440×1080 기준 | 변경 정책 |
|---|---|---|
| 캔버스/배경 | 1440×1080, 포레스트 그린·아이보리, 라운드 프레임 | 임의 변경 금지 |
| 브랜드 | x=1150, y=80, 경로형 심벌+GetPassLab, 색상 #114935 | 단 한 번, 좌표·크기 고정 |
| 메인 제목 | x=80, top=140, 64px Bold, #114935 | 텍스트만 변경. 2줄까지 허용 |
| 부제 | 제목 블록 하단 16px, 30px Regular, #52665B | 텍스트만 변경. 2줄까지 허용 |
| 구분선 | x=80..1360, 제목·부제 아래, 4px #76B978 | 자동 계산 |
| 메인 그래픽 외곽 | x=80, y=348, w=1280, h=652 (1줄 제목·부제 기준) | 헤더 2줄이면 y 자동 이동; 하단 y=1000 고정 |
| 실제 그림 안전영역 | x=98, y=366, w=1244, h=616 (1줄 기준) | **이 슬롯에만 그림 삽입**; 안전영역 밖으로 넘침/로고 중복 금지 |

## 제작·미리보기

미리보기(메인 그래픽 자리 표시):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-hero.json /tmp/facility-hero-preview.svg --preview
```

완성된 메인 그래픽 합성(PNG/JPG/WebP 중 하나):

```sh
node scripts/generate-facility-thumbnail.mjs docs/standards/facility-thumbnail-templates/example-hero.json /tmp/facility-hero.svg --art /path/to/main-illustration.png
```

- **그래픽만 AI 생성**: 별도로 제작한 주제 일러스트에는 로고·제목·텍스트·구분선·배경 테두리를 그리지 않는다. 기하학적인 크롭이나 글자 삽입은 AI에게 맡기지 않는다.
- 자동 합성은 이미지 비율을 지키는 `meet` 방식이다. 그래픽을 자르거나 찌그러뜨리지 않으며, 모서리는 SVG 클립으로 보호한다. 안전영역에 맞는 구도를 처음부터 제작한다.
- **미리보기 템플릿은 공개 금지**: `--preview` 출력에는 메인 그래픽 자리 표시가 남는다. 실제 이미지 출력은 `--art` 입력을 요구한다.
- 1:1 티스토리 썸네일·1.91:1 OG 이미지는 별도 규격이다. 필요할 때 별도 템플릿을 승인·등록한다. 이 4:3 템플릿을 무작정 크롭하지 않는다.
- 이미 제작·승인된 대표 이미지와 기존 공개 URL은 이 템플릿 등록만으로 변경되지 않는다.

## 템플릿 미등록 상황

새로운 비율, 그래픽 영역 구조, 텍스트 배치가 필요한 경우 이미지를 임의 디자인하지 않는다. `시설 콘텐츠 통합 가이드` §5.13.7과 동일하게 **요구사항·재사용 불가 사유 설명 → 사용자 승인 → 새로운 템플릿/샘플/QA 제작 → GitHub 정본 등록 → 콘텐츠 적용** 순서로 진행한다.

## 검증

`node --test scripts/test-facility-thumbnail.mjs`과 기존 `scripts/test-facility-infographic.mjs`를 실행한다. 이후 SVG 렌더링, 로고 단일 표시, 표기 오류·비율·320/390px 모바일·1440px PC 목록/본문 크롭을 시각 QA한다. 테스트 통과만으로 실서버 반영이나 실제 시각 QA가 완료된 것은 아니다.

# 2019년 8월 4일 산업안전기사 기출 원문 대조

전자문제집 CBT 학생용 PDF 8쪽 전체를 직접 렌더링하고, 본문·선택지·도형과 8쪽 정답표를 대조함

- 전체 120문항 확인 · 이전 검수 117~120번을 제외한 **116문항 신규 대조**
- **42문항 본문·선택지 수정**: 101~116번 16문항의 잘못 이관된 문제 복원, 깨진 글자·누락된 원문 용어 복원, 박스 지문 7개 전사
- **도형 3개 복원**: 033 FT 도, 051 와이어로프 장력, 061 감전 회로 · 내장 원본 이미지 그대로 변환 · 기존 064 수식 원본 일치 확인
- **정답 번호 120개 전부 일치** · 정답/문항 ID/순서/일자/과목/검수 필드 유지
- 063·068은 개정 전 문제 안내를 남기고 정답을 미리 알려 주는 외부 서비스 조작 문구 제거
- 문제 body의 줄바꿈을 표시하도록 `.q-body`에 `white-space:pre-line` 적용 · 기존 이미지 카드·계산 박스·제목 스타일 유지
- 공개 산업안전 챕터 **258개 유지** · 잘못 연결된 10문항 중 5개 이동, 5개 해제 · primary 참조 1019 → **1014**

## 자료와 확인 범위

- [CBT 발행 학생용 PDF](https://img.comcbt.com/xe/download/822fabe365db4a9bcfc05597b00ea22a/8976275/%EC%82%B0%EC%97%85%EC%95%88%EC%A0%84%EA%B8%B0%EC%82%AC20190804%28%ED%95%99%EC%83%9D%EC%9A%A9%29.pdf)
- SHA256: `b03996ec40a2c3d9b163b75c0f4287b37557e331d2ddbeb110e36688915af861`
- 직접 검수: PDF 1~8쪽과 정답표 · 원문 렌더링·레이아웃 추출을 병행
- **Q-Net 공식 원문·최종 정답·정오표와는 대조하지 못함**
- 발행자가 업데이트한 기출 자료임: 110번은 2022-06-02 개정 적용 안내를 그대로 유지
- 현행 법령 전수 재검증을 의미하지 않음 · 원문 자체의 일부 오탈자와 표현 차이는 `question-review.json`에 기록
- 컴활 집필 작업은 보류 유지

## 연결 정정

| 문항 | 기존 챕터 | 정정 |
|---|---|---|
| 20190804_101 | excavation-slope-standard | shore-safety-standard |
| 20190804_102 | vehicle-overturn-prevention | 미배정 · 전용 범위 확인 필요 |
| 20190804_103 | work-platform-standards | 미배정 · 전용 범위 확인 필요 |
| 20190804_104 | excavation-slope-standard | tunnel-support-safety |
| 20190804_105 | tower-crane-rope-support | 미배정 · 전용 범위 확인 필요 |
| 20190804_106 | steel-frame-work | 미배정 · 전용 범위 확인 필요 |
| 20190804_107 | safety-net-standards | soil-collapse-prevention |
| 20190804_108 | soil-collapse-prevention | safety-net-standards |
| 20190804_109 | shore-safety-standard | 미배정 · 전용 범위 확인 필요 |
| 20190804_113 | steel-pipe-scaffold | steel-frame-scaffold |

해제한 문항은 기존 챕터의 학습 범위와 원본 질문이 일치하지 않음 · 제목만 보고 다른 챕터에 옮기지 않음

복원한 051·061 그림은 원래 미배정 문항의 에셋이며, 공개 챕터에 연결됐다고 주장하지 않음

## 관련 공개 챕터

| 챕터 | 운영 링크 |
|---|---|
| excavation-slope-standard | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/excavation-slope-standard/) |
| shore-safety-standard | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/shore-safety-standard/) |
| vehicle-overturn-prevention | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/vehicle-overturn-prevention/) |
| work-platform-standards | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/work-platform-standards/) |
| tunnel-support-safety | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/tunnel-support-safety/) |
| tower-crane-rope-support | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/tower-crane-rope-support/) |
| steel-frame-work | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/steel-frame-work/) |
| safety-net-standards | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/safety-net-standards/) |
| soil-collapse-prevention | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/soil-collapse-prevention/) |
| steel-pipe-scaffold | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/steel-pipe-scaffold/) |
| steel-frame-scaffold | [챕터 확인](https://getpasslab.co.kr/industrial-safety/written/construction/steel-frame-scaffold/) |
| 컷셋·패스셋 | [033 FT 도 확인](https://getpasslab.co.kr/industrial-safety/written/ergonomics/cutset-pathset/) |

## 검증 증거

- 로컬 Build 성공 · public-content/SEO/deferred-content 오류 0 · `git diff --check` 통과
- 신규 source guard: 전체 1680문항에서 수정 42개를 역전사하면 기존 JSON 바이트 해시와 일치 · 그 외 1638개와 형식 보존
- 전체 445 article URL 유지 · 변경 12개 외 433개는 공유 질문 로더 파일명만 정확히 변경됨
- 원본·현행 loader 바이트 비교: dataset import 파일명 한 개만 변경 · 팝업 로직 유지
- 기존 배포 검증은 `read-before-20190804-review.mjs`에서 **정확한 승인 해시의 이번 변경만 역복원**하고, 신규 검증이 실제 현행 소스·자산·배정을 별도로 검사함 · 과거 audit 해시를 덮어쓰지 않음
- 실제 브라우저: **320·390·1440px / 360문항 팝업 검사 / 실제 공개 연결 21회 / HTML 12개 정확 비교 / 오류 0**
- 미배정 포함 120문항은 기존 버튼의 data 속성만 브라우저 메모리에서 변경해 실제 동일 loader/dialog로 확인하는 fixture임 · 이 검사를 공개 챕터 연결 완료로 세지 않음
- 정답 숨김→확인, 닫기→재오픈 초기화, ESC, 지문 줄바꿈, 이미지 200·원본 파일 해시·치수·비율·alt·가로 넘침 확인
- 캡처 직접 확인: 320px FT/감전 회로, 390px 발생기 지문, PC 101번 지문
- 적용 디자인 기준: 학습 이미지 디자인 시스템 **v1.2 §1·2·5·6·7·9** · [BRIEF.md](BRIEF.md)
- CI / Merge / Deploy / Production은 PR의 최종 확인 기록을 참조

## 다음 작업

1. 클램셸 챕터 집필: 복원된 120번 원문 기준 · 현재 STUB·미배정 유지
2. 이번 대조로 확인된 미배정 문항의 전용 학습 범위·연결 검토(해제 102·103·105·106·109 포함)

---
chapter_id: "P1-02a"
title: "비트맵·벡터와 해상도 비교"
slug: "bitmap-vector-resolution"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "멀티미디어와 표현"
tags: ["개념"]
summary: "픽셀·수학적 도형 표현과 해상도·갱신 빈도·색 깊이 비교"
questions: ["20180303_002", "20180901_001", "20190302_008", "20200229_015"]
supportingQuestions: [{"id": "20160305_005", "note": "픽셀 표현과 해상도 개념을 비교 · 나머지 장치 설정은 함께 볼 설명에서 학습", "chapter": "display-settings"}]
related: []
order: 124
priority: "1차"
status: "완료"
---

비트맵은 **픽셀의 집합**, 벡터는 **점·선·곡선 등의 수학적 정보**로 표현하며 해상도는 화면·이미지를 얼마나 세밀하게 표현하는지와 관련된 픽셀 수 기준임

## 비트맵 Bitmap

- 픽셀 단위로 저장
- 사진처럼 복잡한 색 표현에 적합
- 확대하면 픽셀이 커져 경계가 거칠어질 수 있음
- BMP·GIF·JPEG·PNG 등이 대표적 래스터 파일 형식

## 벡터 Vector

- 직선·곡선·도형의 좌표와 속성으로 표현
- 확대·축소해도 기하학적 경계가 다시 계산되어 품질 유지에 유리
- 로고·도형·일러스트 등에 적합

## 앨리어싱과 구별

비트맵 확대 시 계단처럼 거칠게 보이는 현상 → **Aliasing**

이를 부드럽게 완화하는 기법은 「경계·색 표현을 보완하는 안티앨리어싱·디더링」의 Anti-aliasing임

## 해상도

화면을 구성하는 픽셀 수와 관련된 표시 세밀도임

- Refresh rate → 화면을 초당 갱신하는 횟수
- Color depth → 한 픽셀에 표현 가능한 색 정보량
- Resolution → 픽셀 수에 따른 세밀도

서로 같은 값으로 취급하지 않음

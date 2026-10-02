---
chapter_id: "P1-02b-02"
title: "경계·색 표현을 보완하는 안티앨리어싱·디더링"
slug: "antialiasing-dithering"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "멀티미디어와 표현"
tags: ["개념"]
summary: "경계 계단현상 보정과 제한된 색 표현 보완 구별"
questions: ["20151017_002"]
supportingQuestions: [{"id": "20160305_002", "note": "경계 보정과 픽셀·모델링·렌더링의 역할을 비교", "chapter": "modeling-rendering"}, {"id": "20180303_002", "note": "경계 보정과 픽셀·모델링·렌더링의 역할을 비교", "chapter": "bitmap-vector-resolution"}, {"id": "20180901_001", "note": "경계 보정과 픽셀·모델링·렌더링의 역할을 비교", "chapter": "bitmap-vector-resolution"}, {"id": "20190302_008", "note": "경계 보정과 픽셀·모델링·렌더링의 역할을 비교", "chapter": "bitmap-vector-resolution"}, {"id": "20190831_001", "note": "경계 보정과 픽셀·모델링·렌더링의 역할을 비교", "chapter": "modeling-rendering"}]
related: []
order: 126
priority: "1차"
status: "완료"
---

안티앨리어싱은 **계단처럼 보이는 경계를 부드럽게 보정**, 디더링은 **제한된 색을 섞어 더 많은 색·명암처럼 보이게 표현**하는 기법임

## Anti-aliasing

개체의 경계 픽셀에 중간색을 배치해 들쭉날쭉한 계단현상을 덜 눈에 띄게 함

기출 단서 `이미지 가장자리의 계단현상 최소화` → **Anti-Aliasing**

## Dithering

사용 가능한 색 수가 제한될 때 서로 다른 색 점을 배치해 중간색·음영처럼 보이게 하는 기법임

## 혼동 제거

- Morphing → 한 이미지에서 다른 이미지로 중간 형태 생성
- Rendering → 3D 장면을 최종 이미지로 계산
- Anti-aliasing → 경계 보정
- Dithering → 제한된 색 표현 보완

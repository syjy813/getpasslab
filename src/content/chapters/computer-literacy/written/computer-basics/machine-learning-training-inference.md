---
chapter_id: "ADD-21"
title: "기계학습의 학습과 예측 단계"
slug: "machine-learning-training-inference"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "정보사회와 보안"
tags: ["개념"]
summary: "데이터로 모델을 맞추는 학습과 새 입력의 추론 구별"
questions: []
supportingQuestions: []
related: []
order: 136
priority: "1차"
status: "완료"
---

기계학습은 **학습 단계에서 데이터로 모델의 패턴·매개변수를 맞추고, 예측·추론 단계에서 새 입력을 학습된 모델에 넣어 결과를 얻음**

## 학습 Training

- 학습 데이터 입력
- 정답·목표 또는 데이터 구조를 이용해 패턴을 찾음
- 모델의 내부 매개변수를 조정

## 예측·추론 Inference

학습이 끝난 모델에 새로운 입력을 넣어 다음과 같은 결과를 얻는 단계임

- 분류 결과
- 예측값
- 생성 결과

## 예시

고양이·강아지 사진으로 모델을 학습함

새 사진을 넣어 `고양이`라고 판단함

→ 새 사진을 처리하는 과정은 **예측·추론**

`새 데이터를 볼 때마다 반드시 처음부터 다시 학습`한다고 이해하지 않음

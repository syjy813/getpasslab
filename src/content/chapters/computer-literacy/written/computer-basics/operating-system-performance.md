---
chapter_id: "P1-23-02"
title: "운영체제의 성능 평가 지표"
slug: "operating-system-performance"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "소프트웨어와 운영체제"
tags: ["개념"]
summary: "처리 능력·응답 시간·신뢰도·사용 가능도를 처리 방식과 구별"
questions: ["20161022_011"]
supportingQuestions: [{"id": "20180901_011", "note": "성능 평가 지표 선택지에만 적용 · 문항 전체의 실행 위치 판단은 함께 볼 설명에서 확인", "chapter": "operating-system-resources"}]
related: []
order: 31
priority: "1차"
status: "완료"
---

## 주요 평가 지표

| 평가 항목 | 판단 기준 |
|---|---|
| 처리 능력(Throughput) | 일정 시간 동안 얼마나 많은 작업을 처리하는가 |
| 응답 시간(Response Time) | 요청한 뒤 응답을 받기까지 얼마나 걸리는가 |
| 신뢰도(Reliability) | 오류 없이 정확하고 안정적으로 동작하는 정도 |
| 사용 가능도(Availability) | 필요할 때 시스템을 사용할 수 있는 정도 |

## 처리 방식과 평가 지표는 다름

`데이터를 일정 시간 모아 한꺼번에 처리한다`

는 설명은 운영체제의 성능 평가 항목이 아니라 **일괄 처리 방식**의 특징임

따라서 문제에서

- 처리 능력
- 신뢰도
- 사용 가능도
- 일괄 처리 능력

이 함께 나오면 `일괄 처리`만 다른 분류로 제거함

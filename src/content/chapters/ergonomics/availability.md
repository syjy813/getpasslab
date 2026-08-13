---
title: 가용도 (Availability)
slug: availability
subject_id: 2
group: 신뢰도·수명
tags: [계산]
summary: A = MTBF/(MTBF+MTTR)
questions: [20190303_036]
order: 6
priority: 1차
status: 완료
---
## 핵심 개념

<strong>가용도(Availability)</strong>는 장비가 전체 관측 시간 중 정상적으로 작동할 수 있는 비율임 · 수리가 가능한 장비에서는 평균고장간격(MTBF)과 평균수리시간(MTTR)의 관계로 표현함

$$A = \frac{MTBF}{MTBF + MTTR}$$

## 계산 기준

- 분모는 정상 작동 시간과 수리 시간을 합한 전체 주기임
- MTBF가 커지거나 MTTR이 작아지면 가용도는 높아짐
- 가용도는 고장 없이 작동할 확률인 신뢰도와 다름 · 가용도는 수리 후 다시 운전하는 시간을 포함함

기출문항에서 (A=0.9), (MTTR=2)시간이면

$$0.9 = \frac{MTBF}{MTBF+2} \Rightarrow MTBF = 18\ \text{시간}$$

## 시험 포인트

| 문제에서 보이는 키워드 | 정답으로 연결 |
|---|---|
| 가용도 (Availability) A | **$A = \frac{MTBF}{MTBF + MTTR}$** |
| 가용도 0.9·MTTR 2시간 | **$0.9 = \frac{MTBF}{MTBF+2} \Rightarrow MTBF = 18\ \text{시간}$** |
| 분모 | **정상 작동 시간과 수리 시간을 합한 전체 주기** |
| MTBF | **커지거나 MTTR이 작아지면 가용도는 높아짐** |
| 가용도 | **고장 없이 작동할 확률인 신뢰도와 다름** · 가용도는 수리 후 다시 운전하는 시간을 포함함 |
| 가용도 (Availability) | **MTTR을 분자에 넣지 않음** · **(MTBF+MTTR)를 분자로 쓰지 않음** |

## 자주 틀리는 포인트

- MTTR을 분자에 넣거나 (MTBF+MTTR)를 분자로 쓰지 않음
- 수리 가능한 시스템의 가용도와 수리 불가능 시스템의 MTTF를 같은 값으로 취급하지 않음

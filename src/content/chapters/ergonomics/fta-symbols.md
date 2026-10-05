---
title: FTA 사상기호와 게이트 기호
slug: fta-symbols
subject_id: 2
order: 1
priority: 출시 필수
status: 완료
group: FTA·시스템 분석
tags: [개념]
summary: 결함사상·기본사상·통상사상·생략사상과 AND·OR·억제 게이트 구분
questions: []
related: [fta-event-symbols, fta-logic-gates, fta-procedure, cutset-pathset]
---

## 사상과 게이트의 역할

FTA는 사고인 톱사상에서 원인을 거슬러 찾는 분석임

| 구분 | 나타내는 내용 |
|---|---|
| 사상기호 | 고장·결함, 기본 원인, 통상 상태, 전개를 생략한 사건 |
| 게이트 기호 | 입력사상과 출력사상 사이의 논리 관계 |

사상의 모양과 의미는 **FTA 사상기호**, 입력·출력 조건은 **FTA 게이트 기호**에서 각각 확인함

## FTA에 쓰는 불대수 기본정리

`+`는 OR, `·`는 AND, 프라임 기호 `'`는 NOT을 뜻함

| 법칙 | OR 형태 | AND 형태 |
|---|---|---|
| 항등 | $A+0=A$ | $A\cdot1=A$ |
| 지배 | $A+1=1$ | $A\cdot0=0$ |
| 멱등 | $A+A=A$ | $A\cdot A=A$ |
| 보수 | $A+A'=1$ | $A\cdot A'=0$ |
| 교환 | $A+B=B+A$ | $A\cdot B=B\cdot A$ |

분배법칙과 드모르간 법칙은 다음과 같음

$$
\begin{aligned}
A\cdot(B+C)&=A\cdot B+A\cdot C \\
A+(B\cdot C)&=(A+B)\cdot(A+C) \\
(A+B)'&=A'\cdot B' \\
(A\cdot B)'&=A'+B'
\end{aligned}
$$

시험에서 자주 줄여 쓰는 흡수·정리식은 `A+A·B=A`, `A·(A+B)=A`, `A+A'·B=A+B`임

게이트를 식으로 바꾼 뒤 같은 사상이 반복되면 이 법칙으로 단순화함

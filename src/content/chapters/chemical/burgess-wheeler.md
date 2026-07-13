---
title: Burgess-Wheeler 법칙
slug: burgess-wheeler
subject_id: 5
order: 4
priority: 출시 필수
status: 완료
group: 폭발 범위
tags: [계산공식]
summary: 폭발하한계(vol%) × 연소열(kcal/mol) ≈ 1,100
questions: [20190804_088]
related: [jones-formula, complete-combustion-cst]
examComment: 곱의 상수값(약 1,100)을 직접 묻는 단답형 — 2,800·3,200 등 오답 상수와의 구분이 전부.
---

## 핵심 공식 / 정의

Burgess-Wheeler 법칙 — 서로 유사한 탄화수소계 가스에서 폭발하한계와 연소열의 곱은 일정.

$$LFL \,[\text{vol\%}] \times \Delta H_c \,[\text{kcal/mol}] \approx 1{,}100$$

활용 — 연소열을 알면 하한계 추정 가능.

$$LFL \approx \frac{1{,}100}{\Delta H_c}$$

> ⚠️ **함정 주의**: 상수 1,100의 단위 조합은 vol% × kcal/mol — 연소열을 kJ 단위로 주는 변형 시 환산 필요. "유사한 탄화수소계"라는 적용 조건이 붙는 경험 법칙으로, 수소·CO 등 비탄화수소에는 적용 불가.

## 단위·기호 해설

| 기호 | 명칭 | 단위 | 주의점 |
|------|------|------|--------|
| LFL | 폭발하한계 | vol% | — |
| ΔHc | 연소열 | kcal/mol | 몰당 발열량 |
| 1,100 | 법칙 상수 | vol%·kcal/mol | 약(≈) 값 |

## 해석 / 의미

- 물리적 의미 — 폭발하한계 농도의 혼합기가 내는 단위부피당 발열량은 연료 종류와 무관하게 거의 일정(연소가 자립하는 최소 에너지 밀도)
- 연소열이 큰 연료일수록 하한계가 낮다는 반비례 관계 — 연소 범위와 위험성 챕터의 "하한 낮을수록 위험" 논리와 연결
- Jones식(양론 기반)·Burgess-Wheeler(발열량 기반)는 하한계를 추정하는 두 갈래 경험식으로 세트 정리

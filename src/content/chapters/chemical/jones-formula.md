---
title: Jones 식 (폭발범위 추정)
slug: jones-formula
subject_id: 5
group: 폭발 범위
tags: [계산공식]
summary: LFL = 0.55 × Cst, UFL = 3.5 × Cst
questions: [20220424_083, 20210814_094, 20200822_096, 20200606_097]
related: [complete-combustion-cst, burgess-wheeler]
examComment: Cst 계산 후 0.55배로 하한계를 구하는 2단 계산형이 표준. 부탄·에틸렌·프로판이 단골 소재.
---

## 핵심 공식 / 정의

Jones 식 — 화학양론 조성(Cst)으로 폭발(연소)범위를 추정.

$$LFL = 0.55 \times C_{st}, \qquad UFL = 3.5 \times C_{st}$$

대표 계산 — 부탄(C₄H₁₀).

$$n_{O_2} = 6.5 \Rightarrow C_{st} = \frac{100}{1+4.773 \times 6.5} \approx 3.1 \Rightarrow LFL = 0.55 \times 3.1 \approx 1.7\,\text{vol\%}$$

에틸렌(C₂H₄): n_O₂ = 3 → Cst ≈ 6.5 → LFL ≈ 3.6 vol%.

> ⚠️ **함정 주의**: 0.55(하한)와 3.5(상한)의 교차 대입이 대표 오답. Jones식은 추정식 — 실측값과 다를 수 있다는 단서("추산한다")가 문제에 명시됨. Cst 단계의 산소양론계수 오류가 최종 답을 벗어나게 하는 주 원인.

## 단위·기호 해설

| 기호 | 명칭 | 값 | 주의점 |
|------|------|------|--------|
| LFL(L) | 폭발하한계 | 0.55 Cst | vol% |
| UFL(U) | 폭발상한계 | 3.5 Cst | vol% |
| Cst | 화학양론 조성 | 선행 계산 | 완전연소 챕터 참조 |

## 해석 / 의미

- 물리적 의미 — 하한계는 양론 농도의 약 절반(연료 부족 한계), 상한계는 약 3.5배(산소 부족 한계)라는 경험적 규칙
- MOC 결합형이 최근 패턴 — Jones로 LFL 추산 → MOC = LFL × 산소양론계수의 2단 구조
- 실측값이 주어지면 실측 우선 — Jones식은 "실험값이 없을 때"의 추정 도구라는 위상까지 출제됨

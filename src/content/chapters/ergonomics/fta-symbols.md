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
questions: [20220424_030, 20210814_033, 20210515_032, 20180304_036, 20190303_023, 20180428_029, 20220305_037, 20180819_038, 20190804_036, 20200926_021, 20190427_037, 20210515_039]
related: [exclusive-or-gate, fta-procedure, cutset-pathset]
examComment: 기호 그림→명칭 매칭형이 반복 출제됨 · 통상사상(하우스), 기본사상(원), 억제·부정 게이트를 정확히 구분해야 함
---

## 핵심 개념

FTA 사상기호는 사건의 종류를, 게이트 기호는 사건 사이의 논리 관계를 나타냄

<figure class="chapter-figure chapter-figure-wide">
  <a
    class="chapter-figure-zoom-target"
    href="/images/chapters/fta-symbols/fta-symbols.svg"
    target="_blank"
    rel="noopener"
    aria-label="FTA 사상기호와 게이트 기호 원본 이미지를 새 창에서 크게 보기"
  >
    <img
      src="/images/chapters/fta-symbols/fta-symbols.svg"
      alt="FTA 결함사상, 기본사상, 통상사상, 생략사상과 AND, OR, 부정, 억제 게이트 기호를 비교한 그림"
      width="1000"
      height="570"
      loading="lazy"
      decoding="async"
    />
  </a>
  <figcaption>
    GetPassLab 자체 제작 · 연결 기출의 사상·게이트 기본 모형을 학습용으로 도식화
    <a class="chapter-figure-zoom-link" href="/images/chapters/fta-symbols/fta-symbols.svg" target="_blank" rel="noopener">원본 이미지 크게 보기</a>
  </figcaption>
</figure>

| 기호 | 명칭 | 의미 |
|------|------|------|
| 사각형 | 결함사상 | 해석 대상이 되는 고장·결함 (톱사상·중간사상) |
| 원 | 기본사상 | 고장 원인이 기본 수준까지 분석되어 추가 분석이 필요 없는 사상 |
| 하우스(집 모양) | 통상사상 | 정상 운전 중 통상적으로 발생하는 사상 |
| 마름모 | 생략(미전개)사상 | 자료 부족 등의 이유로 추가 전개를 중단하거나 생략한 사상 |

게이트 기호는 다음과 같음

| 게이트 | 출력 조건 |
|------|-----------|
| AND | 모든 입력이 동시에 발생할 때 |
| OR | 입력 중 하나 이상 발생할 때 |
| 부정(NOT) | 입력과 반대되는 현상이 출력 |
| 억제(Inhibit) | 입력사상과 표시된 조건사상(P)이 함께 성립할 때 |
| 우선적 AND | 입력이 정해진 순서로 발생할 때 |
| 조합 AND | n개 입력 중 k개 발생할 때 (예: 3개 중 2개) |
| 배타적 OR | 입력 중 정확히 1개만 발생할 때 |

억제·우선적 AND·조합 AND·배타적 OR은 기본 AND·OR에 조건을 더한 수정 게이트 계열로 다뤄질 수 있음

다만 기호를 묻는 문제에서는 `수정 게이트`라는 포괄 표현보다 각 게이트의 정확한 명칭을 구분해야 함

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

시험에서 자주 줄여 쓰는 흡수·정리식은 `A+A·B=A`, `A·(A+B)=A`, `A+A'·B=A+B`임 · 게이트를 식으로 바꾼 뒤 같은 사상이 반복되면 이 법칙으로 단순화함

## 기호 구분

| 형태 | 구분 | 주의점 |
|------|------|--------|
| 사각형·원·하우스·마름모 | 사상 기호 | "무엇이 일어났나" |
| 방패형(AND)·포탄형(OR) | 게이트 기호 | "어떻게 연결되나" |
| 육각형 | 억제 게이트 | 옆에 조건사상(P)을 함께 표시 |

## 시험 포인트

| 문제에서 보이는 모양·표현 | 정답으로 연결 |
|---|---|
| 사각형 | **결함사상** |
| 원 | **기본사상** |
| 집 모양 | **통상사상** |
| 마름모 | **생략사상** |
| 입력 중 하나 이상 발생 | **OR 게이트** |
| 입력과 반대되는 출력 | **부정 게이트** |
| 육각형 옆 조건 P | **억제 게이트** |
| 3개 입력 중 2개 발생 | **조합 AND 게이트** |
| $A+A'=1$ · $A\cdot A'=0$ | **보수법칙** |
| $(A+B)'=A'\cdot B'$ | **드모르간 법칙** |
| $A+A\cdot B=A$ | **흡수법칙** |

## 자주 틀리는 포인트

> ⚠️ **함정 주의**: 정상(頂上, Top)사상과 **통상사상**은 다른 개념임
> 정상 운전 중 일어날 것으로 기대되는 사상은 **통상사상**, 육각형에 조건 P가 붙으면 **억제 게이트**임

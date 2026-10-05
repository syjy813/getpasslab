---
title: FTA 게이트 기호
slug: fta-logic-gates
subject_id: 2
order: 1.2
priority: 출시 필수
status: 완료
group: FTA·시스템 분석
tags: [개념]
summary: AND·OR·부정·억제·조합 AND의 입력과 출력 조건 구분
questions: [20190303_023, 20180428_029, 20220305_037, 20180819_038, 20190804_036, 20200926_021, 20190427_037]
related: [fta-symbols, fta-event-symbols, exclusive-or-gate, cutset-pathset]
---

## 입력과 출력의 관계

게이트 기호는 **입력사상이 어떤 조건으로 출력사상과 연결되는지**를 나타냄

<figure class="chapter-figure">
  <a class="chapter-figure-zoom-target" href="/images/chapters/fta-symbols/fta-logic-gates.svg" target="_blank" rel="noopener" aria-label="FTA AND·OR·억제 게이트 그림 크게 보기">
    <img src="/images/chapters/fta-symbols/fta-logic-gates.svg" alt="두 입력을 연결한 AND와 OR, 한 입력과 옆 조건 P를 가진 육각형 억제 게이트를 비교한 그림" width="360" height="400" loading="lazy" decoding="async" />
  </a>
  <figcaption>학습용 재구성 · AND·OR의 입력 관계와 억제 게이트 옆 조건 P를 비교함 <a class="chapter-figure-zoom-link" href="/images/chapters/fta-symbols/fta-logic-gates.svg" target="_blank" rel="noopener">크게 보기</a></figcaption>
</figure>

| 게이트 | 출력이 생기는 조건 |
|---|---|
| AND | 모든 입력이 함께 발생 |
| OR | 입력 중 하나 이상 발생 |
| 부정(NOT) | 입력과 반대되는 현상이 출력 |
| 억제(Inhibit) | 입력사상과 옆에 표시한 조건사상 P가 함께 성립 |

입력 B₁ 또는 B₂ 중 어느 하나가 발생해 출력 A가 생기는 관계는 **OR**, 두 입력이 모두 필요하면 **AND**임

억제 게이트는 **육각형과 옆 조건 P**를 함께 확인함

입력과 반대되는 현상을 출력하는 **부정 게이트**와 구분함

## 조건이 추가된 게이트

| 게이트 | 추가 조건 |
|---|---|
| 우선적 AND | 모든 입력이 정해진 순서로 발생 |
| 조합 AND | n개 입력 중 지정된 k개가 발생 |
| 배타적 OR | 입력 중 정확히 하나만 발생 |

**3개 입력 중 2개가 발생할 때 출력**이 생기는 조건은 조합 AND임

입력이 발생하는 **순서**를 제한하는 우선적 AND나, **동시 발생 시 출력이 생기지 않는** 배타적 OR과 구분함

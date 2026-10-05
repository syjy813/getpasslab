---
title: FTA 사상기호
slug: fta-event-symbols
subject_id: 2
order: 1.1
priority: 출시 필수
status: 완료
group: FTA·시스템 분석
tags: [개념]
summary: 사각형·원·집 모양·마름모를 사상의 의미와 연결
questions: [20220424_030, 20210814_033, 20210515_032, 20180304_036, 20210515_039]
related: [fta-symbols, fta-logic-gates, fta-procedure]
---

## 모양과 사상의 의미

사상기호는 **어떤 사건이나 상태를 나타내는지**를 구분하는 기호임

<figure class="chapter-figure">
  <a class="chapter-figure-zoom-target" href="/images/chapters/fta-symbols/fta-event-symbols.svg" target="_blank" rel="noopener" aria-label="FTA 사상기호 그림 크게 보기">
    <img src="/images/chapters/fta-symbols/fta-event-symbols.svg" alt="사각형 결함사상, 원 기본사상, 집 모양 통상사상, 마름모 생략사상을 비교한 그림" width="360" height="340" loading="lazy" decoding="async" />
  </a>
  <figcaption>학습용 재구성 · 사각형·원·집 모양·마름모를 사상의 의미와 연결함 <a class="chapter-figure-zoom-link" href="/images/chapters/fta-symbols/fta-event-symbols.svg" target="_blank" rel="noopener">크게 보기</a></figcaption>
</figure>

| 모양 | 사상 | 의미 |
|---|---|---|
| 사각형 | 결함사상 | 고장·결함을 나타내며, 해석 대상인 톱사상이나 중간사상을 표시 |
| 원 | 기본사상 | 고장 원인이 기본 수준까지 분석되어 더 전개할 필요가 없는 사상 |
| 집 모양 | 통상사상 | 통상의 작업이나 기계 상태에서 일어날 것으로 기대되는 사상 |
| 마름모 | 생략사상<br />미전개사상 | 자료 부족 등의 이유로 더 이상 전개하지 않거나 전개를 생략한 사상 |

## 기본사상과 생략사상 구별

두 사상 모두 더 전개하지 않지만 **분석을 멈추는 이유**가 다름

- **기본사상**: 고장 원인을 기본 수준까지 분석했으므로 추가 분석이 필요 없음
- **생략사상**: 자료가 불충분해 결론을 내릴 수 없는 등의 이유로 추가 전개를 생략함

**정상(頂上, Top)사상**은 분석의 출발점인 톱사상을 뜻함

정상 운전 중 일어날 것으로 기대되는 **통상사상**과 구분함

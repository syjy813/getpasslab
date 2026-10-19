---
chapter_id: "FSM2-038"
title: "스프링클러 헤드·수원·방수 성능"
slug: "sprinkler-head-water-performance"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 1
group: "소방시설 구조·기준"
tags: ["계산"]
summary: "헤드 기준개수·수원·송수량 등 문제 조건을 적용함"
questions: []
related: []
order: 41
priority: "1차"
status: "완료"
---

## 헤드의 구성과 방향
폐쇄형 헤드는 감열체가 방수구를 막고 있다가 열로 개방 · 물은 **디플렉터**에 부딪혀 분산됨 · 감열체와 디플렉터 역할을 바꾸지 않음

상향형·하향형·측벽형은 설치 방향과 살수 분포가 다름 · 제품 형식에 맞게 설치하며 임의로 뒤집지 않음

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">

<div class="learning-visuals fire-bulk-visuals"><figure><figcaption><strong>감열체가 열리면 방수구를 통과한 물을 분산</strong><span>학습용 재구성</span></figcaption><img src="/images/fire-safety-manager-level2/closed-sprinkler-head-v1.svg" alt="폐쇄형 헤드의 감열체와 디플렉터 역할을 구분하는 단순 단면, 상세 제품 형상은 생략" width="320" height="270" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/closed-sprinkler-head-v1.svg" data-fire-alt="폐쇄형 헤드의 감열체와 디플렉터 역할을 구분하는 단순 단면, 상세 제품 형상은 생략" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>


## 수원·방수 기준
<div class="sample-table-scroll" tabindex="0" role="region" aria-label="수원·방수 기준 표"><table><thead><tr><th>항목</th><th>기본 기준</th></tr></thead><tbody><tr><td>폐쇄형 기본 수원</td><td>적용 기준개수 N × 1.6㎥ 이상</td></tr><tr><td>기준개수</td><td>용도·층수별 기준표 적용 · 최대 설치층의 실제 개수가 더 적으면 실제 개수 적용</td></tr><tr><td>헤드선단 압력</td><td>0.1MPa 이상 1.2MPa 이하</td></tr><tr><td>방수성능</td><td>0.1MPa에서 헤드당 80L/min 이상</td></tr><tr><td>옥상수조</td><td>기본 유효수량의 3분의 1 이상 · 제외 조건 확인</td></tr></tbody></table></div>

예: 적용 기준개수가 20개 → 20×1.6 = **32㎥** · 80L/min × 20분 = 1.6㎥/개

개방형은 최대 방수구역의 설치 헤드 수를 사용하고 30개 초과 시 수리계산 적용 · 전체 건물의 모든 헤드 개수를 무조건 곱하지 않음

<dialog id="fire-bulk-image-dialog" class="sample-image-layer" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="320" height="320" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

## 기준개수로 송수량 계산

가압송수장치의 송수량은 기준개수 N × **80L/min 이상** · 기준개수 30개이면 수원 48㎥·송수량 2,400L/min 이상으로 각각 계산

<p class="fire-source-note">적용 기준 · <a href="https://www.law.go.kr/LSW/admRulInfoR.do?admRulSeq=2100000281674&amp;admRulId=83616&amp;joTpYn=N&amp;languageType=KO&amp;chrClsCd=010201" target="_blank" rel="noopener">NFTC 103</a> · 2026-10-14 확인</p>

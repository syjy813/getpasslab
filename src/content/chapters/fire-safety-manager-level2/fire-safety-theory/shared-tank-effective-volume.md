---
chapter_id: "FSM2-082"
title: "수조의 유효수량 범위"
slug: "shared-tank-effective-volume"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 1
group: "소방시설 구조·기준"
tags: ["계산"]
summary: "일반급수와 소화용 흡수구 사이의 수량으로 겸용수조 유효수량을 계산함"
questions: []
practiceChapter: "indoor-hydrant-water-performance"
related: ["indoor-hydrant-water-performance"]
order: 37.1
priority: "2차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">
<link rel="stylesheet" href="/styles/fire-original-plan.css">

<div class="fire-panel-lesson fire-plan-lesson">

## 수조 전체 부피가 소화용 유효수량은 아님
**유효수량**은 소화에 실제 사용할 수 있도록 확보되는 물의 양<br>일반급수와 수조를 겸용하면 두 설비의 흡수구 위치를 먼저 확인

그림은 소화용 흡수구가 일반급수 흡수구보다 낮게 설치된 예시

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>겸용수조의 소화용 유효수량</strong></figcaption><img src="/images/fire-safety-manager-level2/shared-tank-effective-section-v1.svg" alt="일반급수 흡수구와 소화용 흡수구 사이 높이 1.5m를 소화용 유효높이로 계산하는 겸용수조 예시. 두 흡수구 밖의 부피는 계산에서 제외" width="380" height="570" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/shared-tank-effective-section-v1.svg" data-fire-alt="일반급수 흡수구와 소화용 흡수구 사이 높이 1.5m를 소화용 유효높이로 계산하는 겸용수조 예시. 두 흡수구 밖의 부피는 계산에서 제외" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>일반급수 흡수구가 위쪽</h3><p>일반급수 흡수구보다 위의 물은 일반급수로 사용될 수 있음<br>그 부분까지 모두 소화용으로 확보된 양이라고 계산하지 않음</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>두 흡수구 사이의 물을 계산</h3><p>그림의 진한 연녹색 영역은 일반급수 흡수구와 소화용 흡수구 사이<br>이 사이의 수량을 소화용 유효수량으로 판단</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>소화용 흡수구 아래는 제외</h3><p>수조 바닥까지 물이 있다고 전부 소화에 사용할 수 있는 것은 아님<br>그림의 소화용 흡수구보다 아래 부피를 유효수량에 더하지 않음</p></section></div>

## 직육면체 수조의 계산 예시
그림에서 두 흡수구 사이의 높이는 **1.5m**이고 바닥면적을 <strong>4㎡</strong>로 제시한 경우

**유효수량 = 바닥면적 × 유효높이 = 4 × 1.5 = 6㎥**

여기서 1.5m는 계산을 위한 예시이며 모든 수조에 적용하는 고정 높이가 아님

일반 옥내소화전 기준에서 산정 개수 N이 2개라면 기본 필요량은 **2 × 2.6 = 5.2㎥**<br>예시의 6㎥는 이 기본 필요량을 충족하지만, 옥상수원과 특별기준 등 다른 적용 조건은 별도로 확인

필요한 수원량과 방수 성능은 [옥내소화전의 수원과 성능](/fire-safety-manager-level2/written/fire-safety-theory/indoor-hydrant-water-performance/)에서 확인

<p class="fire-source-note">확인 근거: <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a> 2.1.4 및 2.1.5, 기존 겸용수조 그림과 대조</p>

</div>
<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-original-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="380" height="600" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

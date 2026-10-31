---
chapter_id: "FSM2-031"
title: "옥내소화전의 수원·수조·방수 성능"
slug: "indoor-hydrant-water-performance"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 1
group: "소방시설 구조·기준"
tags: ["계산"]
summary: "한 층 설치개수와 상한·옥상수원·방수 조건을 적용함"
questions: []
related: ["shared-tank-effective-volume"]
order: 37
priority: "출시 필수"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">
<link rel="stylesheet" href="/styles/fire-original-plan.css">

<div class="fire-panel-lesson fire-plan-lesson">

## 필요한 수원량과 방수 성능을 따로 계산
옥내소화전은 호스와 관창으로 물을 방수하는 설비<br>저장한 물의 양과 노즐선단에서의 방수 성능은 각각 확인

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="일반 기준의 수원과 성능"><table><thead><tr><th scope="col">항목</th><th scope="col">일반 기준</th></tr></thead><tbody><tr><th scope="row">산정 소화전 수 N</th><td>설치개수가 가장 많은 층의 개수<br>2개 이상이면 2개로 산정</td></tr><tr><th scope="row">기본 수원</th><td>N × 2.6㎥ 이상</td></tr><tr><th scope="row">방수압력</th><td>각 노즐선단 0.17MPa 이상</td></tr><tr><th scope="row">방수량</th><td>각 소화전 130L/min 이상</td></tr><tr><th scope="row">과압</th><td>노즐선단 0.7MPa 초과 시 호스접결구 인입 측 감압장치</td></tr></tbody></table></div>

130L/min × 20분 = 2,600L = **2.6㎥**<br>일반 기준에서 한 층에 4개가 설치되어도 N은 2이므로 기본 수원은 **5.2㎥ 이상**

## 겸용수조에서 확보되는 양
<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>겸용수조의 소화용 확보 범위</strong></figcaption><img src="/images/fire-safety-manager-level2/hydrant-water-tank-v1.svg" alt="일반급수 흡수구보다 아래이며 소화용 흡수구까지인 범위를 소화용 유효수량으로 판단하는 기존 개념도" width="320" height="310" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/hydrant-water-tank-v1.svg" data-fire-alt="겸용수조의 두 흡수구 사이 소화용 유효수량" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>
외형 부피 대신 실제로 소화에 사용할 수 있는 유효수량을 계산<br>두 흡수구 사이의 범위와 계산 예시는 [수조의 유효수량 범위](/fire-safety-manager-level2/written/fire-safety-theory/shared-tank-effective-volume/)에서 확인

## 옥상수조와 특별기준
기본 수원 외에 **그 유효수량의 3분의 1 이상을 옥상에 확보**하는 원칙과 법정 제외 조건을 구별<br>옥상수조 면제가 기본 수원량 전체의 면제를 뜻하지 않음

고층건축물의 옥내소화전은 N의 상한을 **5개**로 판단<br>30~49층은 **N×5.2㎥ 및 40분**, 50층 이상은 **N×7.8㎥ 및 60분** 조건 적용

창고시설 특별기준(NFTC 609)은 **N×5.2㎥ 및 40분** 조건을 확인<br>일반 기준 N×2.6㎥를 모든 용도와 규모에 그대로 적용하지 않음

<p class="fire-source-note">확인 근거: <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a> 2.1 및 2.2.1.3, 기존 고층/창고 특별기준 설명 보존</p>

</div>
<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-original-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="380" height="600" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

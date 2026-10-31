---
chapter_id: "FSM2-040"
title: "준비작동식 스프링클러와 교차회로 점검"
slug: "preaction-cross-zone-test"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "감지기 회로·수동 조작·밸브 개방·표시 상태를 연결함"
questions: []
related: ["preaction-panel-state-reading", "pump-manual-auto-reading"]
order: 54
priority: "출시 필수"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">
<link rel="stylesheet" href="/styles/fire-practice-phase2.css">

<div class="fire-panel-lesson fire-practice-lesson">

## 밸브 개방과 헤드 방수의 구별
준비작동식은 감지기가 화재를 감지하면 밸브를 열어 헤드 쪽 배관에 물을 공급하는 설비<br>**밸브가 열리는 것과 헤드에서 물이 나오는 것은 별개**

그림은 교차회로로 밸브를 자동 개방한 예시이며, 헤드는 아직 닫혀 있는 상태

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>밸브 개방과 헤드 닫힘</strong></figcaption><img src="/images/fire-safety-manager-level2/preaction-water-supply-v2.svg" alt="서로 다른 A와 B 감지회로가 작동해 준비작동밸브가 열린 예시. 점선은 기동 신호이고 초록 배관은 급수에서 2차측으로의 물 공급 경로. 폐쇄형 헤드는 닫혀 방수하지 않음" width="640" height="625" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/preaction-water-supply-v2.svg" data-fire-alt="서로 다른 A와 B 감지회로가 작동해 준비작동밸브가 열린 예시. 점선은 기동 신호이고 초록 배관은 급수에서 2차측으로의 물 공급 경로. 폐쇄형 헤드는 닫혀 방수하지 않음" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

<div class="fire-panel-steps">
<section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>A와 B에서 각각 감지해야 밸브가 열림</h3><p>그림은 감지기를 연결한 전기 회로를 A와 B로 나눈 예시<br>A회로 감지기 하나와 B회로 감지기 하나가 작동하면 자동 개방 조건 충족<br>A회로에서만 감지기 두 개가 작동하면 B회로는 감지하지 않았으므로 조건 미충족</p></section>
<section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>밸브가 열리면 헤드 쪽 배관에 물이 공급됨</h3><p>밸브를 지난 뒤 헤드로 이어지는 배관을 <strong>2차측</strong>이라 함<br>밸브가 열리면 이 배관으로 물이 공급되지만, 닫힌 헤드에서는 아직 물이 나오지 않음</p></section>
<section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>헤드가 화재열로 열려야 물이 나옴</h3><p>헤드는 감지기 신호만으로 열리지 않음<br>화재열로 헤드의 감열부가 작동해야 해당 헤드에서 물이 나옴<br>그림은 밸브만 열리고 헤드는 닫혀 있으므로 방수 없음</p></section>
</div>

## 수동 기동은 별도 경로
한 회로만 감지해도 화재 표시와 경보는 나타날 수 있지만, 그림의 자동 개방 조건인 A와 B의 감지는 충족되지 않음

수동조작함(SVP) 등 설비에 정해진 수동 기동 방식으로도 밸브를 열 수 있음<br>수동 기동은 사람이 조작하는 별도 경로이므로 A와 B의 감지를 모두 기다리는 자동 작동과 구별

제어반에서 입력, 기동 명령과 개방 확인을 읽는 방법은 [준비작동식 감시제어반 상태 판독](/fire-safety-manager-level2/written/fire-safety-practice/preaction-panel-state-reading/)에서 확인

## 시험 전 차단과 배수
관계자에게 시험을 알리고 경보와 연동에 영향을 받는 제어 상태 확인 → **2차측 개폐밸브 차단 → 배수밸브 개방** → 승인된 시험 방식으로 감지기와 밸브 작동 확인

2차측을 차단한 시험 상태에서는 준비작동밸브가 열려도 헤드측으로 물을 공급하지 않음<br>그림의 물 공급 경로와 시험 중 차단 상태를 구별

## 시험에서 확인할 상태
- 한 회로 작동: 화재 표시와 경보 확인
- 서로 다른 두 회로 작동: 교차 조건에 따른 밸브 개방 신호 확인
- 밸브 개방: 개방 표시와 시험 계통의 압력 변화 확인
- 수동 기동: 자동 교차 조건과 별도의 기동 경로 확인

교차회로 적용 제외 조건이나 승인된 다른 기동 방식이 있으면 해당 회로도로 판단

## 복구
교재 예시는 1차측 차단과 배수 → 수신기와 솔레노이드 복구 → 배수밸브 닫기와 세팅수실 충수 → 1차측 서서히 개방 및 밸브 누설 확인 → 2차측 개방과 펌프 자동 복구 순서로 연결

**수신기 복구버튼만으로 열린 밸브까지 자동 복구되는 것은 아님**<br>실제 밸브의 재설정 방식과 계통도에 맞는 복구 절차를 적용

<p class="fire-source-note">적용 기준: <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281674" target="_blank" rel="noopener">NFTC 103</a></p>

</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-practice-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="640" height="640" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

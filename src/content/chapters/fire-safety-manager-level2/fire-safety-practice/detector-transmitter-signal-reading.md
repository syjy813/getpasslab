---
chapter_id: "FSM2-076"
title: "감지기·발신기 동작과 수신기 표시 판독"
slug: "detector-transmitter-signal-reading"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "화재·지구·발신기 표시와 시험 선택 여부로 입력 신호를 구별함"
questions: []
practiceChapter: "p-receiver-indicators-switches"
related: ["p-receiver-indicators-switches", "receiver-operation-auto-reset", "false-alarm-confirm-reset"]
order: 56.2
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">

<div class="fire-panel-lesson">

## 화재 표시, 발생 구역, 입력 원인을 나누어 읽기
**화재 표시는 신호의 수신, 지구 표시는 해당 경계구역, 발신기 표시는 발신기 조작 여부를 판독하는 단서**

먼저 동작시험이 선택되어 있는지 확인<br>수신기 자체 시험 중인 상태와 현장 장치에서 신호가 들어온 상태를 구별

## 감지기와 발신기 신호의 비교
아래는 동작시험이 해제되어 있고 다른 이상은 없으며, 발신기 표시 기능이 정상인 수신기의 예시

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>발신기 입력과 3회로 표시</strong></figcaption><div class="fire-panel-artwork" style="--panel-ratio:1536/818;--panel-offset:-11.00244499%"><img src="/images/fire-safety-manager-level2/receiver-transmitter-full-panel-v2.webp" alt="동작시험 등 시험 선택이 해제된 수신기 전체 판. 회로선택 OFF, 화재 및 3회로 지구 표시와 발신기 표시가 켜져 있음" width="1536" height="1024" loading="lazy" decoding="async"></div><p class="fire-panel-note">※ 학습을 위해 재구성된 이미지</p><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/receiver-transmitter-full-panel-v2.webp" data-fire-alt="동작시험 등 시험 선택이 해제된 수신기 전체 판. 회로선택 OFF, 화재 및 3회로 지구 표시와 발신기 표시가 켜져 있음" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">전체 판 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>동작시험 해제 확인</h3><p>조작부의 동작시험이 선택되지 않은 상태<br>수신기 자체 시험 신호인지 현장 입력인지 먼저 구분</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>화재와 3회로 표시 확인</h3><p>화재 표시와 3회로 지구 표시가 켜져 있음<br>3회로가 어느 층인지는 일람도 또는 문제의 대응 조건을 적용</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>발신기 표시 확인</h3><p>발신기 표시까지 켜져 있으므로 이 예시에서는 발신기 조작을 입력 단서로 판독<br>실제 화재가 없다는 뜻으로 해석하지 않음</p></section></div>

감지기 신호에서도 화재 표시와 해당 지구 표시가 켜질 수 있음<br>**발신기 표시가 꺼졌다는 이유만으로 화재 신호가 없다고 판단하지 않음**

## 조건을 적용한 판독 예
‘1회로=1층, 3회로=3층’이며 다른 시험·고장은 없다는 조건에서 화재 표시, 3회로 지구 표시, 발신기 표시가 함께 켜짐

- 화재 신호가 수신된 경계구역: **3층**
- 신호의 입력 단서: **발신기 조작**
- 이 표시만으로 알 수 없는 것: 현장의 실제 연소 여부, 감지기 오염 여부, 예비전원의 잔여 용량

지구 표시만으로 같은 경계구역 안의 어느 감지기가 작동했는지까지 특정하지 않음<br>회로별 경계구역은 일람도나 문제의 대응 조건으로 확인

## 음향 정지와 신호 복구의 구별
주경종·지구경종 정지는 음향을 멈추는 기능<br>음향을 멈춰도 원인 신호와 화재 표시가 남아 있을 수 있음

<div class="fire-grade-exam-points"><ul><li><strong>발신기 표시 점등</strong><p>해당 예시에서 사람이 발신기를 조작했다는 단서<br>실제 화재가 없다는 뜻은 아님</p></li><li><strong>복구 후 다시 표시되는 경우</strong><p>입력 원인이 계속 남아 있는지 확인하는 문제와 연결<br>경보 정지나 복구버튼만으로 원인이 제거되었다고 읽지 않음</p></li></ul></div>

현장 확인과 비화재보의 처리 흐름은 [비화재보 확인·복구](/fire-safety-manager-level2/written/fire-safety-practice/false-alarm-confirm-reset/)에서 학습

<p class="fire-source-note">확인 근거 · 제공 자막 17:41–25:19 및 기존 P형 수신기 공개 문항의 조건과 대조 · <a href="https://www.youtube.com/watch?v=yMdCM9geWIc" target="_blank" rel="noopener">참고 강의</a></p>

</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-panel-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><div class="fire-panel-artwork" style="--panel-ratio:1536/818;--panel-offset:-11.00244499%"><img width="1536" height="1024" alt=""></div></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

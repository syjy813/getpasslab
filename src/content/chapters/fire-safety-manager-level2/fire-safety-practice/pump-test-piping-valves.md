---
chapter_id: "FSM2-078"
title: "성능시험 배관과 밸브 개폐 판독"
slug: "pump-test-piping-valves"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "설비측 토출밸브와 시험배관의 개폐·유량조절밸브를 구별해 운전별 상태를 읽음"
questions: []
practiceChapter: "pump-performance-tests"
related: ["pump-performance-tests", "pump-control-panels-states", "pump-manual-auto-reading"]
order: 51.1
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">

<div class="fire-panel-lesson">

## 설비로 보내는 길과 시험하는 길을 구별
성능시험배관은 **펌프 토출측 개폐밸브 앞에서 분기**<br>유량계 앞에는 개폐밸브, 뒤에는 유량조절밸브를 두어 시험 유량을 설정

설비측 토출밸브를 닫아도 그 앞에서 갈라진 시험배관을 통해 물을 보낼 수 있음

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>성능시험 배관과 밸브 개폐 상태</strong></figcaption><div class="fire-panel-artwork" style="--panel-ratio:1536/728;--panel-offset:-15.38461538%"><img src="/images/fire-safety-manager-level2/pump-test-system-full-v2.webp" alt="수조에서 펌프로 흡입한 물이 설비측 토출밸브 앞에서 시험배관으로 분기. 1번 닫힘, 2번 열림, 유량계 뒤 3번 조절 후 별도 환수관으로 수조에 돌아가는 학습 계통" width="1536" height="1024" loading="lazy" decoding="async"></div><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/pump-test-system-full-v2.webp" data-fire-alt="수조에서 펌프로 흡입한 물이 설비측 토출밸브 앞에서 시험배관으로 분기. 1번 닫힘, 2번 열림, 유량계 뒤 3번 조절 후 별도 환수관으로 수조에 돌아가는 학습 계통" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">전체 판 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>설비측 토출밸브는 닫힘</h3><p>①은 설비측으로 가는 경로를 차단<br>시험배관은 이 밸브 앞에서 분기하므로 시험측 경로와 구분</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>시험배관 개폐밸브는 열림</h3><p>②는 시험 유량계로 가는 경로를 개방<br>수조 → 펌프 → 분기점 → ② → 유량계 순서로 확인</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>유량조절밸브로 시험 유량 설정</h3><p>③은 유량계 뒤에서 시험 유량을 조절<br>유량계 → ③ → 수조로 이어지는 환수 경로를 확인</p></section></div>

성능시험에 필요한 구성과 환수 경로를 단순화한 학습용 계통도<br>흡입밸브, 체크밸브, 순환배관 및 압력계는 생략했으며 실제 시공도나 밸브 번호를 재현한 그림은 아님

②와 ③은 모두 시험배관에 있지만 역할이 다름<br>체절·정격·최대유량의 차이를 읽을 때는 특히 **③의 조절 상태와 유량계 값**을 확인

## 체절·정격·최대유량 시험의 차이
아래는 설비측을 차단하고 시험배관으로 환수하는 학습용 시험 조건

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="운전별 밸브 상태"><table><thead><tr><th scope="col">시험 상태</th><th scope="col">① 설비측</th><th scope="col">② 시험측</th><th scope="col">③ 유량조절</th></tr></thead><tbody><tr><th scope="row">체절</th><td>닫힘</td><td>열림</td><td>닫힘<br>시험 유량 0</td></tr><tr><th scope="row">정격</th><td>닫힘</td><td>열림</td><td>정격유량이 되도록 조절</td></tr><tr><th scope="row">최대유량</th><td>닫힘</td><td>열림</td><td>정격유량의 150%가 되도록 조절</td></tr></tbody></table></div>

체절은 **펌프가 운전하면서 주 토출 유량이 0인 상태**<br>펌프 자체가 정지한 상태와 다르며, 생략한 순환배관은 체절운전 시 수온 상승을 방지하는 역할

압력 합격 기준과 계산은 [펌프 성능시험과 체절·정격·최대운전](/fire-safety-manager-level2/written/fire-safety-practice/pump-performance-tests/)에서 비교

## 시험 후 복구에서 찾을 오답
시험용 밸브를 원상복구하고 **설비측 토출밸브를 다시 개방**하여 설비로 물을 보낼 수 있는 상태인지 확인

‘시험이 끝났으므로 설비측 토출밸브를 계속 닫아 둔다’는 설명은 틀림<br>펌프의 자동기동 상태도 함께 확인하며, 구체적인 시험·복구 조작은 해당 계통도와 제조사 절차에 따름

<p class="fire-source-note">확인 근거 · NFTC 102 2.3.7.1의 배치와 기존 성능시험 챕터의 시험·복구 조건을 대조 · <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a> / <a href="https://www.youtube.com/watch?v=WxX2_BLszbg" target="_blank" rel="noopener">참고 강의 08:13–15:50</a></p>

</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-panel-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><div class="fire-panel-artwork" style="--panel-ratio:1536/728;--panel-offset:-15.38461538%"><img width="1536" height="1024" alt=""></div></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

---
chapter_id: "FSM2-075"
title: "수신기 동작시험과 자동복구"
slug: "receiver-operation-auto-reset"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "동작시험의 표시와 자동복구 기능을 구별하고 시험 후 원위치 복구를 확인함"
questions: []
practiceChapter: "p-receiver-indicators-switches"
related: ["p-receiver-indicators-switches", "detector-transmitter-signal-reading", "receiver-circuit-continuity-test"]
order: 56.1
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">

## 동작시험은 수신기 자체에 시험 신호를 넣는 것
동작시험은 수신기에 화재 신호를 수동으로 입력해 화재 표시, 지구 표시 및 음향장치의 작동을 확인하는 시험

**회로도통시험은 배선의 연결 상태를 확인하는 별도 시험**이며, 동작시험이 정상이어도 현장의 감지기까지 정상이라고 단정할 수 없음

## 시험 상태를 읽는 순서
아래는 동작시험과 자동복구를 함께 선택하고 1회로를 시험하는 학습 예시

<div class="learning-visuals fire-bulk-visuals"><figure><figcaption><strong>동작시험과 자동복구를 선택한 시험 예시</strong><span>학습용 재구성 · 표시 명칭과 배치는 기기별로 다름</span></figcaption><img src="/images/fire-safety-manager-level2/receiver-operation-state-v1.svg" alt="동작시험과 자동복구가 선택되고 도통시험은 해제된 개념 수신기. 화재 표시와 1회로 지구 표시가 켜진 시험 상태" width="380" height="535" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/receiver-operation-state-v1.svg" data-fire-alt="동작시험과 자동복구가 선택되고 도통시험은 해제된 개념 수신기. 화재 표시와 1회로 지구 표시가 켜진 시험 상태" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

1. **동작시험 선택**: 현장 화재 신호가 아니라 수신기에서 만든 시험 신호인지 확인
2. **시험 회로 확인**: 회로 선택 번호와 켜진 지구 표시가 대응하는지 확인
3. **표시와 음향 확인**: 화재 표시, 해당 지구 표시 및 시험 조건에 따른 음향 작동을 확인

회로 번호가 곧 층수인 것은 아님<br>‘1회로=1층’처럼 대응 조건이 주어진 경우에만 해당 층으로 판단

## 자동복구와 복구버튼의 차이
자동복구는 감지기가 복구되면 수신기의 동작 상태도 따라 복구되도록 하는 **시험용 기능**<br>감지기를 차례로 시험할 때 매번 복구버튼을 누르는 과정을 줄이는 데 사용

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="자동복구와 복구버튼의 차이"><table><thead><tr><th scope="col">기능</th><th scope="col">판독할 내용</th></tr></thead><tbody><tr><th scope="row">자동복구</th><td>시험 중 원인 신호가 사라질 때 수신 표시가 따라 복구되는 기능</td></tr><tr><th scope="row">복구버튼</th><td>원인 신호를 제거한 뒤 수신기를 평상시 감시 상태로 되돌리는 조작</td></tr><tr><th scope="row">주경종·지구경종 정지</th><td>음향을 정지하는 기능<br>원인 신호 제거나 수신기 복구와 다름</td></tr></tbody></table></div>

시험 방식과 자동복구 스위치의 사용 조건은 제시된 수신기 범례로 확인<br>자동복구를 평상시 계속 선택해 두는 상태를 정상 감시로 판단하지 않음

## 시험을 끝낸 뒤의 판독
회로 선택을 정상 위치로 되돌리고 동작시험과 자동복구 선택을 해제한 뒤 평상시 표시를 확인

<div class="fire-grade-exam-points"><ul><li><strong>모든 표시등이 꺼져야 정상이라는 판단은 틀림</strong><p>교류전원이나 전압정상처럼 평상시 켜져 있어야 하는 표시가 있음</p></li><li><strong>화재·지구 표시만으로 실제 화재를 단정하지 않음</strong><p>동작시험 선택 여부와 입력 조건을 먼저 확인<br>실제 감지기·발신기 신호의 차이는 연결 챕터에서 비교</p></li></ul></div>

<p class="fire-source-note">확인 근거 · 제공 자막 05:00–11:14, 30:34–32:09 및 기존 수신기 챕터와 대조 · <a href="https://www.youtube.com/watch?v=yMdCM9geWIc" target="_blank" rel="noopener">참고 강의</a> / <a href="https://jngjsobang.go.kr/yeosu/minwon/counsel/counsel_list/index.jsp?boardId=bbs_0000000000000151&amp;cntId=213&amp;mode=view" target="_blank" rel="noopener">소방관서 자동복구 기능 설명</a></p>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="380" height="380" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

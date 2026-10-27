---
chapter_id: "FSM2-077"
title: "주펌프·충압펌프의 자동·수동 운전 판독"
slug: "pump-manual-auto-reading"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "제어반별 선택 위치와 펌프별 운전 표시를 따로 읽어 기동 가능 상태를 판단함"
questions: []
practiceChapter: "pump-control-panels-states"
related: ["pump-control-panels-states", "pump-test-piping-valves", "fire-pumps-piping-components"]
order: 50.1
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">

## 선택 모드와 실제 운전은 다른 정보
**선택스위치는 어떤 방식으로 기동하도록 설정했는지, 운전 표시는 지금 펌프가 돌고 있는지를 보여줌**

전원 표시가 켜져 있어도 펌프는 정지 상태일 수 있음<br>반대로 수동으로 선택한 펌프도 기동 조작을 하면 운전할 수 있음

## 두 제어반을 함께 읽기
감시제어반은 감시와 제어 명령을 담당하고, 동력제어반(MCC)은 전동기에 실제 전원을 공급·제어

<div class="learning-visuals fire-bulk-visuals"><figure><figcaption><strong>주펌프 수동 운전과 충압펌프 자동 대기를 구분</strong><span>학습용 재구성 · 표시 명칭과 배치는 기기별로 다름</span></figcaption><img src="/images/fire-safety-manager-level2/pump-manual-auto-state-v1.svg" alt="감시제어반 자동·연동, 동력제어반 주펌프 수동 선택과 운전 중 표시, 충압펌프 자동 선택과 정지 표시인 학습 패널" width="380" height="650" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/pump-manual-auto-state-v1.svg" data-fire-alt="감시제어반 자동·연동, 동력제어반 주펌프 수동 선택과 운전 중 표시, 충압펌프 자동 선택과 정지 표시인 학습 패널" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

이 예시는 감시제어반이 자동·연동이고 동력제어반에서 주펌프를 수동으로 기동한 상태<br>충압펌프는 자동을 선택했지만 현재는 정지 중인 상태

## 압력 저하 조건을 적용하면
다른 부분은 정상이며 자동기동 압력 조건이 충족된다는 전제로 판단

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="주펌프 수동과 충압펌프 자동의 판독"><table><thead><tr><th scope="col">대상</th><th scope="col">선택과 상태의 해석</th></tr></thead><tbody><tr><th scope="row">주펌프</th><td>수동 선택이므로 압력 신호에 의한 자동기동 상태가 아님<br>운전 표시가 켜져 있으면 수동으로 운전 중인 상태</td></tr><tr><th scope="row">충압펌프</th><td>자동 선택이므로 압력 조건에 따른 자동기동이 가능한 상태<br>자동 선택만으로 현재 운전 중이라고 단정하지 않음</td></tr></tbody></table></div>

**감시제어반의 자동 선택만 보고 두 펌프 모두 자동기동 가능하다고 판단하지 않음**<br>펌프마다 동력제어반의 선택 위치를 함께 확인

## 혼동하기 쉬운 표시
<div class="fire-grade-exam-points"><ul><li><strong>수동 기동 명령의 정지</strong><p>감시제어반에서 수동 기동 명령을 내리지 않는 상태와 자동기동 차단은 다름<br>자동·연동 선택과 동력제어반 선택을 함께 읽음</p></li><li><strong>주펌프와 충압펌프의 정지 조건</strong><p>주펌프는 기동 후 자동으로 정지하지 않는 기준을 적용<br>충압펌프는 예외이므로 두 펌프에 같은 정지 조건을 적용하지 않음</p></li><li><strong>표시등 색상</strong><p>운전·정지·고장의 이름과 범례로 판독<br>황색 또는 녹색이라는 색만으로 모든 기기의 상태를 확정하지 않음</p></li></ul></div>

<p class="fire-source-note">확인 근거 · 제공 자막의 예시 제어 조건 및 기존 펌프 제어반 챕터와 대조 · <a href="https://www.youtube.com/watch?v=WxX2_BLszbg" target="_blank" rel="noopener">펌프 강의 15:51–18:29</a> / <a href="https://www.youtube.com/watch?v=dE7IzOH-BEw" target="_blank" rel="noopener">제어반 사례 05:43–08:26</a> / <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a></p>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="380" height="380" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

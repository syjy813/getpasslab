---
chapter_id: "FSM2-035"
title: "펌프 성능시험과 체절·정격·최대운전"
slug: "pump-performance-tests"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["계산"]
summary: "시험 유량·압력·밸브 조건과 릴리프밸브의 역할을 구별함"
questions: []
related: ["pump-test-piping-valves", "pump-manual-auto-reading"]
order: 51
priority: "출시 필수"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">
<link rel="stylesheet" href="/styles/fire-practice-phase2.css">

<div class="fire-panel-lesson fire-practice-lesson">

## 세 시험점의 압력 판정
체절은 **140% 이하**, 최대유량은 **65% 이상**이라는 비교 방향을 구별<br>그림은 정격토출량 500L/min, 정격토출압력 0.60MPa인 펌프의 학습용 예시 곡선이며 제조사의 실제 성능곡선과 구분

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>체절과 최대유량 시험 결과</strong></figcaption><img src="/images/fire-safety-manager-level2/pump-performance-reading-v2.svg" alt="정격 대비 유량과 압력을 표시한 예시 곡선. 체절 압력 135%는 140% 이하, 정격점 100%, 최대유량 150%에서 압력 61.7%는 65%에 미달" width="640" height="580" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/pump-performance-reading-v2.svg" data-fire-alt="정격 대비 유량과 압력을 표시한 예시 곡선. 체절 압력 135%는 140% 이하, 정격점 100%, 최대유량 150%에서 압력 61.7%는 65%에 미달" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>체절은 압력 상한과 비교</h3><p>시험 유량은 0이며 펌프는 운전 중<br>정격토출압력의 140%를 넘지 않는지 확인</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>정격점은 유량과 압력의 기준</h3><p>정격토출량 100%에서 정격토출압력을 확보하는 점<br>다른 시험값을 이 정격값에 대한 비율로 환산</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>최대유량은 압력 하한과 비교</h3><p>유량계가 정격토출량의 150%를 가리키도록 설정<br>이때 정격토출압력의 65% 이상을 확보해야 하므로 그림의 61.7%는 미달</p></section></div>

## 시험값에 적용
정격토출량 500L/min, 정격토출압력 0.60MPa를 기준으로 계산

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="성능시험 예시 계산과 판정">

| 시험 | 비교 기준 | 예시 측정값 | 판단 |
|---|---|---|---|
| 체절 | 0.60 × 1.40 = **0.84MPa 이하** | 0.81MPa | 상한 이내 |
| 정격 | 500L/min에서 **0.60MPa 확보** | 0.60MPa | 기준 확보 |
| 최대유량 | 500 × 1.50 = **750L/min**에서 0.60 × 0.65 = **0.39MPa 이상** | 0.37MPa | 하한 미달 |

</div>

최대유량 시험의 압력 기준을 ‘65% 이하’로 읽으면 판정이 반대가 됨

## 시험 배관과 유량 설정
시험 준비에서 **펌프 토출측 개폐밸브를 닫아 설비측을 차단**하고 시험배관 연결과 제어 상태 확인<br>물은 시험배관의 유량계와 유량조절밸브를 거쳐 배수 또는 환수

- 체절시험: 유량조절밸브를 닫아 시험 유량 0에서 압력 확인
- 정격시험: 유량계를 보며 정격토출량 100%로 설정
- 최대유량시험: 유량계를 보며 정격토출량 150%로 설정

체절은 펌프가 정지한 상태가 아님<br>순환배관과 릴리프밸브는 체절운전 중 수온 상승을 방지하며 성능시험배관과 역할을 구별

배관 분기와 밸브 위치는 [성능시험 배관과 밸브 개폐 판독](/fire-safety-manager-level2/written/fire-safety-practice/pump-test-piping-valves/)의 전체 그림에서 확인

## 복구와 기동 상태
시험 후 펌프 정지 → 시험배관 밸브 원상복구 → **토출측 개폐밸브 개방** → 충압펌프와 주펌프의 자동기동 상태 확인

수동 기동 명령에도 주펌프가 돌지 않으면 동력제어반 전원, 선택 위치와 실제 기동회로 확인<br>운전 불능을 체절시험 합격으로 판단하지 않음

실제 계통도와 제조사 절차를 따르며 밸브 번호를 다른 설비에 그대로 적용하지 않음<br>선택 상태와 운전 표시는 [감시제어반과 동력제어반](/fire-safety-manager-level2/written/fire-safety-practice/pump-control-panels-states/)에서 구별

<p class="fire-source-note">적용 기준: <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a></p>

</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-practice-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="640" height="640" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

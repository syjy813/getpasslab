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
related: []
order: 54
priority: "출시 필수"
status: "완료"
---

## 밸브 기동과 헤드 방수를 분리
준비작동식은 감지기 신호로 밸브가 열려 2차측에 물을 공급 · 실제 방수에는 폐쇄형 헤드의 **열 개방**도 필요

교차회로는 서로 다른 두 감지기 회로의 작동 조건을 확인하는 방식 · 같은 회로 감지기 두 개만 작동시킨 것을 두 회로 작동으로 대체하지 않음

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">

<div class="learning-visuals fire-bulk-visuals"><figure><figcaption><strong>서로 다른 감지회로가 함께 밸브 기동 조건을 만듦</strong><span>학습용 재구성</span></figcaption><img src="/images/fire-safety-manager-level2/cross-zone-and-condition-v1.svg" alt="감지회로 A와 B가 AND 조건으로 밸브를 기동, 방수에는 별도로 헤드 열 개방 필요" width="320" height="305" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/cross-zone-and-condition-v1.svg" data-fire-alt="감지회로 A와 B가 AND 조건으로 밸브를 기동, 방수에는 별도로 헤드 열 개방 필요" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>


## 시험 전 준비
경보·연동에 영향을 받는 관계자에게 알리고 제어 상태 확인 → **2차측 개폐밸브 차단 → 배수밸브 개방** → 승인된 시험 방식으로 감지기·밸브 작동 확인

2차측 개폐밸브를 닫은 시험 상태에서는 밸브가 열려도 헤드측 배관으로 물을 공급하지 않음 · 실제 화재 시의 물 공급 흐름과 시험 중 상태를 구별

## 시험에서 보는 상태
- 한 회로 작동: 화재 표시·경보와 밸브 기동 조건을 구별
- 두 회로 작동: 교차 조건에 따른 밸브 개방 신호 확인
- 밸브 개방: 밸브개방 표시 및 시험 계통의 압력 변화 확인 · 헤드측 차단 유지
- 수동 기동: 자동 교차 조건과 별도의 기동 경로 확인

교차회로 적용 제외 조건이나 승인된 기동 방식이 있는 경우 실제 회로도에 따라 판단 · 모든 설비가 반드시 같은 스위치 순서로 작동한다고 일반화하지 않음

## 복구
교재 예시는 1차측 차단·배수 → 수신기·솔레노이드 복구 → 배수밸브 닫기·세팅수실 충수 → 1차측 서서히 개방·밸브 누설 확인 → 2차측 개방·펌프 자동 복구로 연결

수신기 복구버튼만 누르면 열린 밸브까지 자동으로 닫힌다고 읽지 않음 · 실제 밸브의 재설정 방식과 계통도에 따라 복구

<dialog id="fire-bulk-image-dialog" class="sample-image-layer" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="320" height="320" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

<p class="fire-source-note">적용 기준 · <a href="https://www.law.go.kr/LSW/admRulInfoR.do?admRulSeq=2100000281674&amp;admRulId=83616&amp;joTpYn=N&amp;languageType=KO&amp;chrClsCd=010201" target="_blank" rel="noopener">NFTC 103</a> · 2026-10-14 확인</p>

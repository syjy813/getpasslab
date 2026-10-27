---
chapter_id: "FSM2-079"
title: "준비작동식 감시제어반 상태 판독"
slug: "preaction-panel-state-reading"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "감지기 A·B와 SVP 입력, 밸브 기동 명령, 개방 확인 및 실제 방수를 구별함"
questions: []
practiceChapter: "preaction-cross-zone-test"
related: ["preaction-cross-zone-test", "sprinkler-types-operation", "pump-manual-auto-reading"]
order: 54.1
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css">

<div class="fire-panel-lesson">

## 감지기 신호와 밸브 개방 확인을 나누어 읽기
준비작동식의 교차회로는 **서로 다른 감지기 A·B회로의 작동으로 자동 밸브 기동 조건을 만드는 방식**

감지기 표시, 밸브 기동 명령, 밸브 개방 확인은 서로 다른 정보<br>같은 A회로의 감지기 두 개가 작동한 것을 A·B 두 회로 작동으로 판단하지 않음

## A만, A+B, SVP의 차이
아래는 교차회로가 적용되고 다른 기동 원인은 없는 설비의 입력 조건 비교<br>수동조작함(SVP)은 감지기 두 회로의 자동 조건과 별도의 수동 기동 경로

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>감지 입력과 기동 명령, 개방 확인을 따로 판독</strong><span>학습용 재구성 · 표시와 배치는 기기별로 다름</span></figcaption><img src="/images/fire-safety-manager-level2/preaction-full-panel-v2.webp" alt="준비작동식 학습용 감시제어반 전체 판. 감지기 A와 B는 켜지고 SVP 입력은 꺼져 있으며 밸브 기동 명령 있음과 개방 확인이 각각 표시된 상태" width="1536" height="1024" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/preaction-full-panel-v2.webp" data-fire-alt="준비작동식 학습용 감시제어반 전체 판. 감지기 A와 B는 켜지고 SVP 입력은 꺼져 있으며 밸브 기동 명령 있음과 개방 확인이 각각 표시된 상태" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">전체 판 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>A와 B 입력 확인</h3><p>서로 다른 A회로와 B회로 표시가 모두 켜진 상태<br>같은 A회로의 감지기 두 개를 A·B 두 회로로 읽지 않음</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>밸브 기동 명령 확인</h3><p>다른 기동 원인이 없는 예시에서 A·B 입력으로 자동 기동 조건 충족<br>입력 표시와 밸브를 여는 명령은 구분</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>밸브 개방 확인 신호 판독</h3><p>그림은 개방 확인 신호까지 들어온 예시<br>기동 명령만으로 실제 개방을 단정하지 않으며, 폐쇄형 헤드의 개방과 실제 방수도 별도 확인</p></section></div>

A회로만 감지해도 화재 표시와 음향 경보가 작동할 수 있음<br>**경보가 울렸다는 사실만으로 밸브 개방 조건까지 충족되었다고 판단하지 않음**

<div class="sample-table-scroll" tabindex="0" role="region" aria-label="입력 조건별 기동 판독"><table><thead><tr><th scope="col">입력 조건</th><th scope="col">기동 조건 판독</th></tr></thead><tbody><tr><th scope="row">A회로만 감지</th><td>교차회로 자동 기동 조건 미충족</td></tr><tr><th scope="row">A와 B회로 모두 감지</th><td>교차회로 자동 기동 조건 충족</td></tr><tr><th scope="row">SVP 수동 조작</th><td>두 감지회로 조건과 별도의 수동 기동 경로</td></tr></tbody></table></div>

## 명령, 개방 확인, 방수의 구별
<div class="sample-table-scroll" tabindex="0" role="region" aria-label="기동 명령과 실제 상태의 구별"><table><thead><tr><th scope="col">확인 정보</th><th scope="col">판독할 범위</th></tr></thead><tbody><tr><th scope="row">감지기 A·B 표시</th><td>어떤 감지회로에서 신호가 들어왔는지 확인</td></tr><tr><th scope="row">밸브 기동 명령</th><td>자동 조건 또는 수동 조작에 따라 밸브를 여는 명령이 나갔는지 확인</td></tr><tr><th scope="row">밸브개방 표시</th><td>해당 설비의 개방 확인 신호를 확인<br>입력 표시만으로 대신하지 않음</td></tr><tr><th scope="row">펌프 운전 표시</th><td>실제 펌프 운전 여부를 확인<br>감지기 두 회로 점등만으로 확정하지 않음</td></tr><tr><th scope="row">헤드 방수</th><td>밸브 개방과 물 공급 외에 폐쇄형 헤드의 열 개방이 필요</td></tr></tbody></table></div>

## 조건을 적용한 판독 예
다른 기동 원인 없이 A·B 표시가 모두 켜지고 밸브개방 확인 신호도 들어옴<br>폐쇄형 헤드는 열리지 않았고 설비측 밸브는 정상 개방 상태

- 교차회로의 자동 기동 조건: **충족**
- 유수검지장치 개방: **확인 신호로 판독**
- 헤드에서의 방수: **헤드가 닫혀 있으므로 아직 방수하지 않음**

점검 중 2차측 개폐밸브를 닫은 조건이라면, 개방 표시만으로 헤드측 물 공급까지 이루어졌다고 단정할 수 없음

## 수신기 복구와 밸브 복구는 별개
수신기 복구버튼만 눌렀다고 열린 유수검지장치가 반드시 닫히는 것은 아님<br>시험 전 차단과 밸브 재설정은 [준비작동식 스프링클러와 교차회로 점검](/fire-safety-manager-level2/written/fire-safety-practice/preaction-cross-zone-test/)에서 확인

<p class="fire-source-note">확인 근거 · 제공 자막 32:11–42:51, 00:44–03:20 및 기존 교차회로 챕터·공개 문항과 대조 · <a href="https://www.youtube.com/watch?v=WxX2_BLszbg" target="_blank" rel="noopener">스프링클러 강의</a> / <a href="https://www.youtube.com/watch?v=dE7IzOH-BEw" target="_blank" rel="noopener">제어반 사례</a> / <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281674" target="_blank" rel="noopener">NFTC 103</a></p>

</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-panel-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="1536" height="1024" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

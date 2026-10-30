---
chapter_id: "FSM2-033"
title: "소방펌프와 배관의 구성요소"
slug: "fire-pumps-piping-components"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 1
group: "소방시설 구조·기준"
tags: ["개념"]
summary: "주펌프·충압펌프·물올림장치·압력챔버·순환배관을 구별함"
questions: []
related: ["pump-circulation-relief-valve", "pressure-chamber-start-switch"]
order: 39
priority: "출시 필수"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css?v=fire-image-copy-20261028">
<link rel="stylesheet" href="/styles/fire-original-plan.css">

<div class="fire-panel-lesson fire-plan-lesson">

## 물을 공급하는 배관과 기동 신호를 구별
주 공급 경로는 **수원 → 흡입배관 → 펌프 → 체크밸브와 개폐밸브 → 소화설비**<br>체크밸브는 역류를 막고 개폐밸브는 배관을 열거나 닫는 역할

그림은 주 공급 경로와 압력 검지의 관계만 나타낸 부분 도식이며 계기와 상세 분기 및 펌프별 병렬 연결은 생략

<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>소화수 공급과 압력 검지</strong></figcaption><img src="/images/fire-safety-manager-level2/pump-system-overview-v2.svg" alt="수원에서 펌프, 체크밸브, 개폐밸브를 거쳐 설비로 물을 공급하고 설비측 배관의 압력 변동을 압력스위치에서 검지하는 부분 계통도" width="380" height="620" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/pump-system-overview-v2.svg" data-fire-alt="수원에서 펌프, 체크밸브, 개폐밸브를 거쳐 설비로 물을 공급하고 설비측 배관의 압력 변동을 압력스위치에서 검지하는 부분 계통도" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">그림 확대 ↗</button></figure></div>

<div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>주펌프는 화재 시 필요한 물을 공급</h3><p>주펌프는 필요한 유량과 압력을 공급하는 주된 펌프<br>예비펌프는 주펌프와 동등 이상의 성능을 갖는 별도 펌프</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>충압펌프는 작은 압력 저하를 보충</h3><p>정상적인 작은 누설 등으로 압력이 떨어질 때 보충해 주펌프가 자주 기동하는 것을 줄임<br>충압펌프와 물올림장치를 같은 장치로 읽지 않음</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>압력 검지는 물 공급과 다른 역할</h3><p>기동용수압개폐장치는 배관 압력변동을 검지해 기동 신호를 만듦<br>압력 신호가 있다는 사실만으로 실제 펌프 운전까지 정상이라고 판단하지 않음</p></section></div>

## 계기와 물올림장치
<div class="sample-table-scroll" tabindex="0" role="region" aria-label="부속장치 역할"><table><thead><tr><th scope="col">장치</th><th scope="col">판별 역할</th></tr></thead><tbody><tr><th scope="row">압력계</th><td>토출측 압력 확인<br>체크밸브 전 펌프 가까이 설치</td></tr><tr><th scope="row">연성계 또는 진공계</th><td>흡입측 상태 확인<br>법정 설치 제외 조건 있음</td></tr><tr><th scope="row">물올림장치</th><td>수원이 펌프보다 낮을 때 흡입측과 펌프에 물 유지</td></tr><tr><th scope="row">기동용수압개폐장치</th><td>압력변동 검지<br>압력챔버 또는 기동용압력스위치 등</td></tr></tbody></table></div>

물올림수조의 유효수량은 **100L 이상**, 급수배관은 **15mm 이상**<br>압력챔버 방식의 용적도 100L 이상이지만 목적은 압력 검지

## 서로 다른 배관
성능시험배관은 유량과 압력 시험, 순환배관은 체절운전 수온 상승 방지

[순환배관과 릴리프밸브](/fire-safety-manager-level2/written/fire-safety-theory/pump-circulation-relief-valve/) 및 [압력챔버와 압력스위치](/fire-safety-manager-level2/written/fire-safety-theory/pressure-chamber-start-switch/)에서 위치와 부품을 자세히 확인

직렬 배관은 흐름 경로에 있는 개폐밸브가 모두 열려야 통수 가능<br>밸브 번호 하나만으로 전체 통수 여부를 판단하지 않음

<p class="fire-source-note">확인 근거: <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a> 주펌프와 예비펌프 정의 및 기존 구성요소 문항과 대조</p>

</div>
<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-original-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">그림 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="380" height="600" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

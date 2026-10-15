---
chapter_id: FSM2-037
title: 스프링클러 방식과 작동 순서
slug: sprinkler-types-operation
cert_id: fire-safety-manager-level2
exam: written
subject_id: 1
group: 소방시설 구조·기준
tags: [개념]
summary: 습식·건식·준비작동식·일제살수식의 배관 상태와 방수 조건
questions: []
related: []
order: 40
priority: 출시 필수
status: 완료
---

<link rel="stylesheet" href="/styles/fire-sprinkler-visual.css">

<h2 id="core">핵심 개념</h2>
<p>스프링클러 방식은 <strong>2차측 배관의 상태 → 헤드 형태 → 밸브 기동 조건</strong>으로 판별함</p>
<ul><li><strong>1차측</strong>: 밸브로 물이 공급되는 쪽</li><li><strong>2차측</strong>: 밸브를 지나 헤드로 이어지는 쪽</li><li><strong>폐쇄형 헤드</strong>: 감열체로 닫혀 있다가 열을 받으면 개방</li><li><strong>개방형 헤드</strong>: 감열체 없이 방수구가 이미 열린 상태</li></ul>
<h2 id="four-types">스프링클러 4방식</h2>
<p>아래 그림은 <strong>평상시 상태</strong>를 비교하는 학습용 재구성임 · 공급측은 가압수가 있는 것으로 가정하고 가압송수장치·상세 트림·시공 치수는 생략</p>
<div class="learning-visuals"><figure id="method-wet"><figcaption><strong>① 습식</strong><span>2차측 가압수 · 폐쇄형 헤드</span></figcaption><div class="sprinkler-crop top-left"><img class="sprite" src="/images/fire-safety-manager-level2/sprinkler-standby-v1.png" decoding="async" width="1254" height="1254" alt="습식의 평상시 개념도. 밸브 공급측과 헤드측 모두 물이 차 있으며 헤드는 감열체로 닫혀 있음"></div><button class="zoom-button" data-position="top-left" data-title="습식 평상시 구조" aria-haspopup="dialog" aria-controls="image-dialog">그림 확대 ↗</button></figure><figure id="method-dry"><figcaption><strong>② 건식</strong><span>2차측 압축공기·질소 · 폐쇄형 헤드</span></figcaption><div class="sprinkler-crop top-right"><img class="sprite" src="/images/fire-safety-manager-level2/sprinkler-standby-v1.png" decoding="async" width="1254" height="1254" alt="건식의 평상시 개념도. 밸브 공급측은 물, 헤드측은 압축공기. 공기압축기의 관은 밸브 위 2차측에 연결되며 헤드는 폐쇄형"></div><button class="zoom-button" data-position="top-right" data-title="건식 평상시 구조" aria-haspopup="dialog" aria-controls="image-dialog">그림 확대 ↗</button></figure><figure id="method-preaction"><figcaption><strong>③ 준비작동식</strong><span>2차측 대기압·저압 · 폐쇄형 헤드</span></figcaption><div class="sprinkler-crop bottom-left"><img class="sprite" src="/images/fire-safety-manager-level2/sprinkler-standby-v1.png" decoding="async" width="1254" height="1254" alt="준비작동식의 평상시 개념도. 공급측만 물이 차 있고 헤드측은 대기압 또는 저압의 기체. 감지기 신호로 밸브를 기동하며 헤드는 폐쇄형"></div><button class="zoom-button" data-position="bottom-left" data-title="준비작동식 평상시 구조" aria-haspopup="dialog" aria-controls="image-dialog">그림 확대 ↗</button></figure><figure id="method-deluge"><figcaption><strong>④ 일제살수식</strong><span>2차측 대기압 · 개방형 헤드</span></figcaption><div class="sprinkler-crop bottom-right"><img class="sprite" src="/images/fire-safety-manager-level2/sprinkler-standby-v1.png" decoding="async" width="1254" height="1254" alt="일제살수식의 평상시 개념도. 공급측은 물, 헤드측은 대기압. 감열체 없는 개방형 헤드의 방수구는 이미 열려 있지만 밸브가 물을 차단해 아직 방수되지 않음"></div><button class="zoom-button" data-position="bottom-right" data-title="일제살수식 평상시 구조" aria-haspopup="dialog" aria-controls="image-dialog">그림 확대 ↗</button></figure></div>
<h2 id="operating-sequence">작동 순서</h2>
<div class="sample-table-scroll sample-table-scroll--wide" tabindex="0" role="region" aria-label="방식별 작동 순서 표"><table><thead><tr><th>방식</th><th>작동을 시작하는 단서</th><th>물 공급·방수 흐름</th></tr></thead><tbody><tr><td>습식</td><td>헤드가 열에 의해 개방</td><td>준비된 물 방수 → 유수검지장치 작동</td></tr><tr><td>건식</td><td>헤드 개방으로 기체 방출</td><td>2차측 압력 저하 → 1차측 수압으로 밸브 개방 → 물 공급·방수</td></tr><tr><td>준비작동식</td><td>감지기에 따른 밸브 개방</td><td>2차측에 물 공급 + 헤드 열 개방이 모두 충족되면 방수</td></tr><tr><td>일제살수식</td><td>자동감지 또는 수동식 기동</td><td>일제개방밸브 개방 → 담당 구역의 개방형 헤드에서 일제 방수</td></tr></tbody></table></div>
<p>준비작동식은 <strong>밸브 개방으로 물이 공급되는 조건</strong>과 <strong>헤드가 열에 의해 열리는 조건</strong>을 구분함 · 두 조건의 실제 선후는 화재 상황에 따라 달라질 수 있음</p>
<p>수동 기동도 가능하며 자동 기동 시 교차회로의 조건을 함께 확인</p>
<h2 id="wet-detail">습식의 경보 신호와 펌프 기동</h2>
<p><strong>알람밸브·기동용수압개폐장치</strong>를 사용하는 경우의 작동 예시</p>
<ol><li>열에 의해 폐쇄형 헤드 개방·방수</li><li>2차측 배관 압력 저하</li><li>1차측 압력에 밀려 알람밸브의 <strong>클래퍼</strong> 개방</li><li>시트링홀로 들어간 물이 <strong>경보용 압력스위치</strong> 작동 → 사이렌·밸브개방 표시</li><li>기동 설정압력까지 압력이 낮아지면 <strong>기동용수압개폐장치</strong> 작동 → 펌프 기동</li></ol>
<p>클래퍼는 알람밸브의 내부 덮개임 · 경보용 압력스위치는 경보 신호를 전달하고, 기동용수압개폐장치는 배관 압력변동을 검지해 펌프를 기동함</p>
<blockquote><p>현행 기준은 습식·건식의 펌프 기동을 유수검지장치 발신, 기동용수압개폐장치 또는 혼용으로 허용함 · <strong>‘펌프가 항상 마지막’으로 일반화하지 않음</strong></p></blockquote>
<h2 id="exam-points">시험 포인트</h2>
<div class="sample-table-scroll" tabindex="0" role="region" aria-label="시험 포인트 표"><table><thead><tr><th>문제에서 보이는 표현</th><th>정답으로 연결</th></tr></thead><tbody><tr><td>2차측까지 물 + 폐쇄형 헤드</td><td><strong>습식</strong></td></tr><tr><td>2차측 압축공기·질소 + 공기압축기</td><td><strong>건식</strong> · 공기 공급관의 2차측 연결 확인</td></tr><tr><td>감지기 작동 → 물 공급 + 폐쇄형 헤드</td><td><strong>준비작동식</strong> · 헤드의 열 개방도 필요</td></tr><tr><td>개방형 헤드 + 일제개방밸브</td><td><strong>일제살수식</strong> · 담당 구역에서 일제 방수</td></tr><tr><td>동결 우려가 있는 비난방 장소</td><td>평상시 <strong>2차측의 물 유무</strong>로 방식 구별</td></tr><tr><td>습식 사이렌·밸브개방 표시의 직접 원인</td><td>클래퍼 개방 후 <strong>경보용 압력스위치</strong> 작동</td></tr><tr><td>배관 압력변동에 따른 펌프 기동</td><td><strong>기동용수압개폐장치</strong> · 경보 신호와 역할 구별</td></tr></tbody></table></div>
<h2 id="mistakes">자주 틀리는 포인트</h2>
<ul><li>준비작동식은 밸브가 열렸다는 사실만으로 방수된다고 단정하지 않음 · <strong>물 공급과 헤드 열 개방</strong>을 모두 확인</li><li>일제살수식의 평상시 2차측은 대기압 상태임 · <strong>개방형 헤드</strong>라도 밸브가 물을 차단하므로 평상시에는 방수되지 않음</li><li>습식 사이렌의 직접 원인을 감지기 교차회로나 펌프 기동으로 대체하지 않음 · <strong>경보 신호와 펌프 기동</strong>의 역할 구별</li></ul>


<dialog id="image-dialog" class="sample-image-layer" aria-labelledby="image-dialog-title"><div class="image-layer-head"><h2 id="image-dialog-title">그림 확대</h2><button class="sample-close" data-close-modal autofocus>닫기</button></div><div class="zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><div class="sprinkler-crop zoom-crop top-left"><img class="sprite" src="/images/fire-safety-manager-level2/sprinkler-standby-v1.png" decoding="async" width="1254" height="1254" alt="선택한 스프링클러 방식의 평상시 구조 확대"></div></div><p class="zoom-help">작은 화면에서는 그림 안에서 좌우·위아래 이동</p></dialog>
<script src="/scripts/fire-sprinkler-zoom.js" defer></script>

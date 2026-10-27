---
chapter_id: "FSM2-077"
title: "주펌프·충압펌프의 자동·수동 운전 판독"
slug: "pump-manual-auto-reading"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "전체 제어반의 ① 연동, ② 주펌프 수동·정지, ③ 충압펌프 자동·정지를 읽고 자동기동 가능 상태를 구분함"
questions: []
practiceChapter: "pump-control-panels-states"
related: ["pump-control-panels-states", "pump-test-piping-valves", "fire-pumps-piping-components"]
order: 50.1
priority: "1차"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css">

<div class="fire-panel-lesson">
<section class="fire-panel-section"><h2>선택 모드와 현재 운전 상태를 따로 읽기</h2>
<p><strong>선택스위치</strong>는 어떤 방식으로 기동하도록 설정했는지, <strong>기동·정지 표시등</strong>은 지금 펌프가 돌고 있는지를 보여줌<br>자동 선택만으로 운전 중이라고 판단하거나, 수동 선택만으로 이미 기동했다고 판단하지 않음</p>
</section>

<section class="fire-panel-section"><h2>전체 판에서 ① → ② → ③ 순서로 판독</h2>
<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>연동 선택과 두 펌프의 선택·정지 상태</strong><span>학습용 재구성</span></figcaption><img src="/images/fire-safety-manager-level2/pump-control-full-panel-v2.webp" alt="① 감시제어반 연동, ② 동력제어반 주펌프 수동 선택과 정지 표시 켜짐, ③ 충압펌프 자동 선택과 정지 표시 켜짐. 두 펌프의 기동 표시 및 감시제어반 기동 표시는 꺼져 있음" width="1536" height="1024" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/pump-control-full-panel-v2.webp" data-fire-alt="① 감시제어반 연동, ② 동력제어반 주펌프 수동 선택과 정지 표시 켜짐, ③ 충압펌프 자동 선택과 정지 표시 켜짐. 두 펌프의 기동 표시 및 감시제어반 기동 표시는 꺼져 있음" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">전체 판 확대 ↗</button></figure></div><div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>감시제어반은 연동</h3><div class="fire-panel-detail" style="--detail-ratio:370/170;--detail-width:415.135135%;--detail-left:-47.297297%;--detail-top:-126.470588%"><img src="/images/fire-safety-manager-level2/pump-control-full-panel-v2.webp" alt="감시제어반 선택스위치가 연동을 가리킴" width="1536" height="1024" loading="lazy" decoding="async"></div><p>왼쪽 선택스위치는 <strong>연동</strong><br>이 위치만 보고 두 펌프 모두 자동기동 가능하다고 판단하지 않고 오른쪽 MCC를 확인</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>주펌프는 수동 선택, 정지 중</h3><div class="fire-panel-detail" style="--detail-ratio:300/380;--detail-width:512.000000%;--detail-left:-278.333333%;--detail-top:-92.105263%"><img src="/images/fire-safety-manager-level2/pump-control-full-panel-v2.webp" alt="주펌프 수동 선택, 기동 꺼짐과 정지 켜짐" width="1536" height="1024" loading="lazy" decoding="async"></div><p>MCC 주펌프 선택은 <strong>수동</strong><br>기동 표시는 꺼지고 정지 표시는 켜져 있으므로 <strong>수동으로 선택했지만 현재 정지 중</strong></p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>충압펌프는 자동 선택, 정지 중</h3><div class="fire-panel-detail" style="--detail-ratio:300/380;--detail-width:512.000000%;--detail-left:-380.000000%;--detail-top:-92.105263%"><img src="/images/fire-safety-manager-level2/pump-control-full-panel-v2.webp" alt="충압펌프 자동 선택, 기동 꺼짐과 정지 켜짐" width="1536" height="1024" loading="lazy" decoding="async"></div><p>MCC 충압펌프 선택은 <strong>자동</strong><br>기동 표시는 꺼지고 정지 표시는 켜져 있으므로 <strong>자동 대기이며 현재 정지 중</strong></p></section></div><p>전원 표시는 전원 공급 여부를 나타냄<br>맨 아래의 녹색 기동버튼과 적색 정지버튼은 조작부이며 그 위의 표시등과 구분</p>
</section>

<section class="fire-panel-section"><h2>압력이 낮아지면 어떻게 판단하는가</h2>
<p>다른 부분은 정상이며 해당 펌프의 자동기동 압력 조건이 충족된다는 전제</p><div class="sample-table-scroll" tabindex="0" role="region" aria-label="그림의 선택 위치에 압력 저하 조건 적용"><table><thead><tr><th scope="col">대상</th><th scope="col">현재 상태</th><th scope="col">압력 조건 충족 시</th></tr></thead><tbody><tr><th scope="row">주펌프</th><td>수동 선택이며 정지 중</td><td>자동기동 상태가 아님<br>수동 선택만으로 운전이 시작된 것은 아니며 기동 조작과 표시 확인 필요</td></tr><tr><th scope="row">충압펌프</th><td>자동 선택이며 정지 중</td><td>압력 조건에 따른 자동기동이 가능한 상태<br>현재 정지 표시를 고장으로 단정하지 않음</td></tr></tbody></table></div><p>그림만으로 압력 설정값, 기동 순서 또는 실제 방수 여부를 추정하지 않음<br>기동 조작과 평상시 복구는 <a href="/fire-safety-manager-level2/written/fire-safety-practice/pump-control-panels-states/">감시제어반과 동력제어반의 조작</a>에서 확인</p>
</section>

<p class="fire-source-note">확인 근거 · 제공 자막의 예시 제어 조건 및 기존 펌프 제어반 챕터와 대조 · <a href="https://www.youtube.com/watch?v=WxX2_BLszbg" target="_blank" rel="noopener">펌프 강의 15:51–18:29</a> / <a href="https://www.youtube.com/watch?v=dE7IzOH-BEw" target="_blank" rel="noopener">제어반 사례 05:43–08:26</a> / <a href="https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000281772" target="_blank" rel="noopener">NFTC 102</a></p>
</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-panel-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">전체 판 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="1536" height="1024" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

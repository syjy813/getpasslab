---
chapter_id: "FSM2-049"
title: "수신기 예비전원 시험과 이상 표시"
slug: "receiver-backup-power-test"
cert_id: "fire-safety-manager-level2"
exam: "written"
subject_id: 2
group: "소방시설 점검"
tags: ["절차"]
summary: "전체 수신기에서 예비전원시험 선택과 전압지시를 읽고 예비전원감시 이상과 구분함"
questions: []
related: ["receiver-circuit-continuity-test", "p-receiver-indicators-switches"]
order: 58
priority: "출시 필수"
status: "완료"
---

<link rel="stylesheet" href="/styles/fire-bulk-visual.css">
<link rel="stylesheet" href="/styles/fire-panel-lessons.css">

<div class="fire-panel-lesson">
<section class="fire-panel-section"><h2>예비전원 시험은 정전 때의 기능 유지 확인</h2>
<p>상용전원이 끊겨도 수신기의 감시 및 경보 기능이 유지되는지 확인하는 시험<br><strong>교류전원 표시가 켜져 있다는 사실만으로 예비전원이 정상이라고 판단하지 않음</strong></p>
</section>

<section class="fire-panel-section"><h2>전체 판에서 ① → ② → ③ 순서로 읽기</h2>
<div class="learning-visuals fire-bulk-visuals fire-panel-overview"><figure><figcaption><strong>시험 중 전압지시의 위치와 낮음 표시</strong><span>학습용 재구성</span></figcaption><img src="/images/fire-safety-manager-level2/receiver-backup-full-panel-v2.webp" alt="P형 5회로 수신기 전체 판. ① 예비전원시험 선택, ② 전압지시 구역 확인, ③ 낮음 켜짐. 예비전원감시와 도통시험 정상 및 단선 표시는 모두 꺼져 있고 회로선택은 OFF인 학습 예시" width="1536" height="1024" loading="lazy" decoding="async"><button class="fire-bulk-zoom" data-fire-src="/images/fire-safety-manager-level2/receiver-backup-full-panel-v2.webp" data-fire-alt="P형 5회로 수신기 전체 판. ① 예비전원시험 선택, ② 전압지시 구역 확인, ③ 낮음 켜짐. 예비전원감시와 도통시험 정상 및 단선 표시는 모두 꺼져 있고 회로선택은 OFF인 학습 예시" aria-haspopup="dialog" aria-controls="fire-bulk-image-dialog">전체 판 확대 ↗</button></figure></div><div class="fire-panel-steps"><section class="fire-panel-step"><h3><span class="fire-panel-number">①</span>예비전원시험 선택 확인</h3><div class="fire-panel-detail" style="--detail-ratio:200/155;--detail-width:768.000000%;--detail-left:-387.500000%;--detail-top:-377.419355%"><img src="/images/fire-safety-manager-level2/receiver-backup-full-panel-v2.webp" alt="파란 예비전원시험 버튼이 선택됨" width="1536" height="1024" loading="lazy" decoding="async"></div><p>아래 조작부의 <strong>예비전원시험</strong>이 선택된 상태<br>도통시험 버튼과 회로선택 다이얼로 배선 상태를 읽는 시험과 구분</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">②</span>전압지시 구역 찾기</h3><div class="fire-panel-detail" style="--detail-ratio:480/205;--detail-width:320.000000%;--detail-left:-71.875000%;--detail-top:-168.292683%"><img src="/images/fire-safety-manager-level2/receiver-backup-full-panel-v2.webp" alt="전압지시 구역의 높음, 정상, 낮음 표시" width="1536" height="1024" loading="lazy" decoding="async"></div><p>가운데 왼쪽 <strong>전압지시</strong> 구역을 확인<br>오른쪽 도통시험 구역의 정상 및 단선 표시를 읽지 않음</p></section><section class="fire-panel-step"><h3><span class="fire-panel-number">③</span>낮음 표시 판독</h3><div class="fire-panel-detail" style="--detail-ratio:170/150;--detail-width:903.529412%;--detail-left:-382.352941%;--detail-top:-266.666667%"><img src="/images/fire-safety-manager-level2/receiver-backup-full-panel-v2.webp" alt="전압지시 낮음 표시등이 켜져 있음" width="1536" height="1024" loading="lazy" decoding="async"></div><p>그림에서는 <strong>낮음이 켜져 있으므로 시험 중 전압 부족</strong>으로 판독<br>같은 판의 예비전원감시등은 꺼져 있어도, 시험 결과의 낮음 표시를 정상으로 바꾸어 읽지 않음</p></section></div><p class="fire-panel-scope">그림은 제시된 시험 상태의 학습 예시<br>표시 명칭과 시험 중 교류전원 표시 방식은 해당 기기의 범례 적용</p>
</section>

<section class="fire-panel-section"><h2>전압 수치와 감시 이상을 구분</h2>
<div class="sample-table-scroll" tabindex="0" role="region" aria-label="예비전원 시험과 이상 표시의 판독"><table><thead><tr><th scope="col">문제의 단서</th><th scope="col">판단</th></tr></thead><tbody><tr><th scope="row">전압계 방식</th><td>24V 계통에서 정상 범위를 <strong>19~29V</strong>로 준 경우 23V는 범위 안, 17V는 범위 밖<br>도통시험의 4~8V를 적용하지 않음</td></tr><tr><th scope="row">예비전원감시 점등</th><td>해당 기기에서 예비전원의 접속 또는 성능 이상을 알리는 표시인지 확인<br>축전지 접속, 배선, 충전 및 축전지 상태 확인</td></tr><tr><th scope="row">정전 때 기능 상실</th><td>예비전원 자동 전환과 전원 계통 확인</td></tr></tbody></table></div><p>19~29V는 제시된 학습 기기의 정상 범위이며 모든 제품의 공통 법정 전압이 아님</p>
</section>

<section class="fire-panel-section"><h2>전환과 시험 종료 후 확인</h2>
<p>예비전원 시험 조작 → 전환 및 전압·표시 확인 → 기능 확인 → 시험 해제 후 상용전원과 충전 상태 확인<br>상용전원 차단 시 예비전원으로 자동 전환되고, 복전 시 상용전원으로 자동 복귀하는지도 구분해 확인</p><div class="fire-grade-exam-points"><ul><li><strong>순간 전압 확인과 지속시간 확인은 다름</strong><p>예비전원은 <strong>감시 60분 후 경보 10분 이상</strong> 작동 조건을 확인<br>시험 버튼을 잠깐 눌러 정상 표시가 나왔다고 지속시간까지 검증된 것은 아님</p></li><li><strong>시험 해제와 충전 상태 복구</strong><p>시험 후 축전지를 분리한 채 두는 것을 정상 복구로 판단하지 않음<br>표시가 없거나 전원 이상이 남으면 시험 회로, 퓨즈 및 접속 상태 확인</p></li></ul></div>
</section>

<p class="fire-source-note">적용 기준 · <a href="https://www.law.go.kr/LSW/admRulInfoR.do?admRulSeq=2100000275086&amp;admRulId=83630&amp;joTpYn=N&amp;languageType=KO&amp;chrClsCd=010201" target="_blank" rel="noopener">NFTC 203</a> · 2026-10-14 확인</p>
</div>

<dialog id="fire-bulk-image-dialog" class="sample-image-layer fire-panel-dialog" aria-labelledby="fire-bulk-image-title"><div class="image-layer-head"><h2 id="fire-bulk-image-title">전체 판 확대</h2><button data-fire-close autofocus>닫기</button></div><div class="fire-bulk-zoom-scroll" tabindex="0" role="region" aria-label="확대 그림. 가로와 세로 이동 가능"><img width="1536" height="1024" alt=""></div></dialog>
<script src="/scripts/fire-bulk-zoom.js" defer></script>

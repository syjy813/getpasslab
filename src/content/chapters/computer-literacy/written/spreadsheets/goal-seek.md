---
title: "목표값 찾기의 수식·목표·변경 셀"
slug: "goal-seek"
cert_id: "computer-literacy"
exam: "written"
subject_id: 2
group: "데이터 분석"
tags: ["절차"]
summary: "문제에서 맞출 결과·목표 숫자·바꿀 입력을 찾아 목표값 찾기의 세 항목에 대응시킴"
questions: ["20161022_037", "20170902_021", "20180303_023", "20180901_040", "20200704_023"]
related: []
order: 4
priority: "1차"
status: "완료"
---

<p id="문제의-문장을-세-칸에-넣는다">목표값 찾기: <strong>원하는 수식 결과에 맞춰 입력값 하나를 찾는 기능</strong></p>

<h2 id="화면에서-셀을-찾아-설정한다">화면에서 셀 찾기와 설정</h2>

<div class="learning-condition"><span>문제의 조건</span><p><strong class="learning-result">① 평균</strong>을 <strong class="learning-target">② 70</strong>으로 맞추기 위해 <strong class="learning-input">③ 컴퓨터 판매량</strong> 조정</p></div>

<div class="learning-visuals">
<figure>
<figcaption><strong>셀 위치 · 학습용 재구성</strong><span>① 수식의 결과 E3 · ③ 수식에 참조되는 입력 B3</span></figcaption>
<img src="/images/computer-literacy/goal-seek-sheet.svg" width="480" height="336" alt="학습용 워크시트 — 2행 항목: A열 품목, B열 컴퓨터, C열 프린터, D열 캠코더, E열 평균 / 3행 판매량: B3 50, C3 70, D3 60 / ① 평균 E3은 수식 =AVERAGE(B3:D3)의 현재 결과 60 / ③ 바꿀 입력은 컴퓨터 판매량 B3" />
</figure>
<figure>
<figcaption><strong>같은 번호의 항목에 입력</strong><span>셀 주소 E3과 $E$3은 같은 위치</span></figcaption>
<img src="/images/computer-literacy/goal-seek-settings.svg" width="480" height="336" alt="목표값 찾기 설정 예시 — ① 수식 셀: 평균 셀 주소 $E$3 / ② 찾는 값: 문제에서 제시한 목표 숫자 70 / ③ 값을 바꿀 셀: 컴퓨터 판매량의 셀 주소 $B$3" />
</figure>
</div>

> **평균(E3)이 70이 되도록 컴퓨터 판매량(B3) 조정**

<h2 id="설정의-의미로-오답을-지운다">기출 판단 포인트</h2>

- **목표 70은 평균에 적용** — 현재 평균 60이나 앞으로 구할 컴퓨터 판매량과 구별
- **변경 대상은 B3 하나** — 프린터 C3나 여러 품목을 바꾸는 설명은 오답

<p id="도구를-묻는-문제는-계산-방향으로-구별한다"><strong>도구 선택</strong></p>

- 목표 결과에 맞는 입력 찾기 → **목표값 찾기**
- 입력 후보별 결과 비교 → **데이터 표**
- 입력값 묶음별 결과 비교 → **시나리오 관리자**

**설정·의미를 묻는 문제는 세 항목으로 판단 — 변경 후 판매량의 직접 계산은 불필요**

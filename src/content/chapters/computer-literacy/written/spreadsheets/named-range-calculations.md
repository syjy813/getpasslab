---
title: "이름을 실제 범위로 바꾸어 수식 계산하기"
slug: "named-range-calculations"
cert_id: "computer-literacy"
exam: "written"
subject_id: 2
group: "수식과 함수"
tags: ["계산"]
summary: "이름을 셀 범위로 바꾼 뒤, 함수에 맞게 개수·합계·평균·대응 곱 계산"
questions: ["20150307_037"]
related: []
order: 3
priority: "1차"
status: "완료"
---

<h2 id="이름과-실제-범위">범위 치환과 함수 계산</h2>

학습 예시: `첫범위`는 A1:A2, `둘째범위`는 B1:B2이며 모두 숫자

<div class="learning-visuals">
<figure>
<figcaption><strong>SUMPRODUCT · 학습용 재구성</strong><span>이름을 범위로 바꾸고 같은 위치끼리 곱하기</span></figcaption>
<img src="/images/computer-literacy/named-range-products.svg" width="480" height="360" alt="첫범위 A1:A2의 값 2와 4, 둘째범위 B1:B2의 값 3과 5 — 첫 위치 2×3=6, 둘째 위치 4×5=20을 더해 SUMPRODUCT 결과 26" />
</figure>
</div>

- `COUNT(첫범위,둘째범위)` → 숫자 셀 **4개**
- `SUM(첫범위,둘째범위)` → 2+4+3+5 = **14**
- `AVERAGE(첫범위,둘째범위)` → 14÷4 = **3.5**

SUMPRODUCT는 **각 범위의 합을 곱하는 (2+4)×(3+5)와 구별**

## 범위 덧셈과 전체 합계

`=첫범위+둘째범위`는 **두 범위 전체를 더하는 SUM이 아님**  
대응 값은 2+3과 4+5이므로, 전체 합계 14라는 설명은 오답

실제 표시값은 Excel 버전·수식 입력 위치·배열 입력 방식에 따라 차이  
동적 배열로 빈 영역에 펼치면 5와 9, 이전 방식의 같은 행 교차라면 해당 행의 값만 계산

## INDEX의 상대 위치

학습 예시: `성적`은 B2:D4

<div class="learning-visuals">
<figure>
<figcaption><strong>INDEX · 학습용 재구성</strong><span>시트 번호가 아닌 지정 범위 안에서 행·열 세기</span></figcaption>
<img src="/images/computer-literacy/named-range-index.svg" width="480" height="360" alt="성적 B2:D4의 값은 첫째 행 70·80·90, 둘째 행 60·85·95, 셋째 행 75·88·100 — INDEX(성적,2,1)은 범위 안의 두 번째 행과 첫 번째 열이 만나는 B3의 60" />
</figure>
</div>

`=AVERAGE(INDEX(성적,2,1),MAX(성적))`

1. `INDEX(성적,2,1)` → **60**
2. `MAX(성적)` → 범위의 최댓값 **100**
3. `AVERAGE(60,100)` → 두 값의 평균 **80**

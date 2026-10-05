---
title: 오일러 좌굴하중 (Pcr)
slug: euler-buckling-load
subject_id: 6
group: 건설 강도·하중
tags:
- 계산
summary: 양단 힌지 파이프서포트의 π²EI/L²와 길이·단면 단위 환산
questions:
- '20210814_110'
order: 1
priority: 1차
status: 완료
related:
- shore-safety-standard
---

## 양단 힌지의 좌굴하중

좌굴은 압축력을 받는 길고 가는 부재가 옆으로 휘어 안정성을 잃는 현상임

양단 힌지 조건에서는 다음 식을 적용함

$$
P_{cr}=\frac{\pi^2EI}{L^2}
$$

- $E$: 탄성계수
- $I$: 단면2차모멘트
- $L$: 부재 길이

길이가 분모의 제곱으로 들어가므로 다른 조건이 같다면 길이가 2배일 때 좌굴하중은 1/4임

## 단위를 맞추는 계산 예

계산 예의 값은 $L=3.5\,\text{m}$, $I=8.31\,\text{cm}^4$, $E=2.1\times10^5\,\text{MPa}$임

MPa를 N/mm²로 읽고 길이와 단면을 mm 기준으로 맞춤

$$
\begin{aligned}
L&=3500\,\text{mm} \\
I&=83100\,\text{mm}^4
\end{aligned}
$$

$$
P_{cr}=\frac{\pi^2\times2.1\times10^5\times83100}{3500^2}
$$

계산 결과는 약 **14060N**임

단면2차모멘트는 **4제곱 단위**이므로 cm⁴에서 mm⁴로 바꿀 때 10,000배임

양단 힌지 조건을 확인하고, 다른 지지조건에 이 식을 조건 없이 적용하지 않음

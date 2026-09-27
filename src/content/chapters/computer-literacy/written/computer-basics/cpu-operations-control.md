---
chapter_id: "P1-17-01"
title: "CPU의 연산·제어 기능"
slug: "cpu-operations-control"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "ALU는 계산 · CU는 명령 해독과 제어 · 레지스터는 내부 임시 저장"
questions: ["20150307_011", "20150627_018", "20151017_012", "20180303_016"]
supportingQuestions: [{"id": "20200704_018", "note": "사양표의 Core i5를 CPU에 대응 · RAM·SSD 구별은 함께 볼 설명에 포함", "chapter": "computer-specifications"}]
related: []
order: 8
priority: "1차"
status: "완료"
---

## 계산·제어·임시 저장 구별

| CPU 구성 | 역할 |
|---|---|
| ALU | 산술·논리 연산 |
| CU | 명령 해독·각 장치에 제어 신호 전달 |
| 레지스터 | CPU 내부에서 명령·주소·연산 결과 임시 저장 |

`명령 해독`, `장치에 지시·감독` → **CU의 제어 기능**

SSD는 데이터를 장기간 저장하는 보조기억장치이므로 CPU 구성 요소가 아님

## 기출 그림의 내부 명칭 확인

![2015년 10월 12번 원본 CPU 구성 그림](../../../../../assets/questions/computer-literacy/20151017_012.png)

- **(ㄱ):** ALU·누산기 포함 → 연산장치
- **(ㄴ):** 명령 레지스터·번지 레지스터 포함 → 제어장치

기출의 단순화된 구성도에서 내부 명칭을 보고 영역의 역할 판단

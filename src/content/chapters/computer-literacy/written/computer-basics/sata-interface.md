---
chapter_id: "P1-20b-03"
title: "SATA의 저장장치 연결 방식"
slug: "sata-interface"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "SATA는 직렬·점대점 연결 · PATA의 병렬 연결과 구별"
questions: ["20190831_012"]
supportingQuestions: []
related: []
order: 20
priority: "1차"
status: "완료"
---

## SATA와 PATA 비교

| 구분 | SATA | 전통적인 PATA |
|---|---|---|
| 전송 | **직렬** | 병렬 |
| 연결 | 점대점 | 한 케이블에 복수 장치 |
| 장치 구분 | 물리 연결에 Master/Slave 구분 불필요 | Master/Slave 사용 |

**Serial ATA → 직렬**이므로 `병렬 인터페이스`라는 선택지는 틀림

핫 플러그의 실제 동작은 컨트롤러·BIOS/UEFI 설정·운영체제·장치의 지원 조건에 따라 달라짐

## 2019년 8월 12번의 조건

제시 정답은 **① 병렬 인터페이스 방식**

③의 `CMOS에서 자동으로 Master와 Slave 지정`도 SATA의 일반적인 구조와 맞지 않는 표현

**①을 제시 정답으로 확인하되, ③을 SATA의 올바른 특징으로 암기하지 않음**

공식 정정 여부는 확인되지 않음 · 수록 답안은 ①이지만, ③도 SATA의 일반적인 특징과 맞지 않으므로 함께 주의함

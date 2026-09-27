---
chapter_id: "P1-18b-01"
title: "기억장치의 위치와 속도 순서"
slug: "memory-speed-hierarchy"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "접근 속도는 레지스터 → 캐시 → 주기억 → 보조기억 순으로 비교"
questions: ["20150627_016"]
supportingQuestions: [{"id": "20151017_012", "note": "그림의 CPU 내부와 주기억장치 위치 확인 · 속도 순서를 직접 묻는 문제는 아님", "chapter": "cpu-operations-control"}, {"id": "20161022_017", "note": "레지스터가 주기억장치보다 느리다는 보기와 구별", "chapter": "cpu-registers"}, {"id": "20170304_012", "note": "레지스터의 CPU 내부 위치·빠른 접근 속도 확인", "chapter": "cpu-registers"}]
related: []
order: 12
priority: "1차"
status: "완료"
---

## 위치와 속도 연결

기억장치의 대표적인 접근 속도: **레지스터 > 캐시 > 주기억장치 > 보조기억장치**

| 장치 | 위치·용도 |
|---|---|
| 레지스터 | CPU 내부 임시 저장 |
| 캐시 | CPU와 주기억장치 사이의 속도 차이 완화 |
| 주기억장치(RAM) | 실행 중인 프로그램·데이터 저장 |
| 보조기억장치 | HDD·SSD 등에 장기간 저장 |

CPU에 가까운 기억장치일수록 일반적으로 더 빠르고 용량은 작음

**레지스터는 주기억장치보다 용량은 작지만 속도는 빠름**

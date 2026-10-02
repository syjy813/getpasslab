---
chapter_id: "P1-17-02"
title: "레지스터에 저장하는 정보"
slug: "cpu-registers"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "레지스터에 저장하는 결과·명령·다음 주소 구별"
questions: ["20160625_014", "20161022_017", "20170304_012", "20180303_013", "20180901_010"]
supportingQuestions: [{"id": "20150627_016", "note": "CPU 내부 레지스터의 빠른 접근 속도를 다른 기억장치와 비교", "chapter": "memory-speed-hierarchy"}, {"id": "20151017_012", "note": "그림의 누산기·명령 레지스터 위치 확인 · 영역의 역할은 CPU 설명과 연결", "chapter": "cpu-operations-control"}]
related: ["cpu-operations-control"]
order: 9
priority: "1차"
status: "완료"
---

## 주요 레지스터

| 레지스터 | 저장하는 정보 |
|---|---|
| 누산기(AC) | 산술·논리 연산의 중간 결과 또는 결과 |
| 명령 레지스터(IR) | 현재 실행 중인 명령어 |
| 프로그램 카운터(PC) | **다음에 실행할 명령어의 주소** |
| 메모리 주소 레지스터(MAR) | 접근하려는 기억장치의 주소 |
| 메모리 버퍼 레지스터(MBR) | 기억장치와 주고받는 데이터 |

시험에서는 특히 `다음 명령어 주소`라는 표현이 나오면 **프로그램 카운터**를 선택함

## 레지스터의 위치와 속도

레지스터는 **CPU 내부의 임시기억장치**임

저장 용량은 주기억장치보다 매우 작지만 접근 속도는 더 빠름

`주기억장치보다 저장 용량이 적고 속도도 느리다`는 설명은 **속도가 느리다**는 부분 때문에 틀림

## Windows 레지스트리와 구별

CPU의 Register와 Windows의 Registry는 전혀 다른 개념임

- Register → CPU 내부 임시 저장
- Registry → 운영체제와 프로그램의 설정 정보를 저장하는 Windows 데이터베이스

따라서 `운영체제의 시스템 정보를 기억하고 관리한다`는 설명은 CPU 레지스터의 역할이 아님

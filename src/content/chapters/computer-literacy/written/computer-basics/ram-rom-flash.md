---
chapter_id: "P1-18a"
title: "RAM·ROM·플래시 메모리 비교"
slug: "ram-rom-flash"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "전원 차단 후 유지 여부와 기록·소거 방식으로 메모리 구별"
questions: ["20160305_008", "20160305_013", "20160625_013", "20170902_013", "20170902_020", "20190831_014"]
supportingQuestions: [{"id": "20150307_011", "note": "기억·저장 기능을 제어·연산 기능과 구별", "chapter": "cpu-operations-control"}, {"id": "20151017_012", "note": "그림의 주기억장치와 CPU 내부 영역 구별 · 전체 판단은 CPU 설명과 연결", "chapter": "cpu-operations-control"}, {"id": "20160625_011", "note": "ROM의 하드웨어 제어 코드를 펌웨어와 연결", "chapter": "firmware-bios"}, {"id": "20161022_017", "note": "RAM과 CPU 내부 레지스터의 위치·용량·속도 구별", "chapter": "cpu-registers"}, {"id": "20170304_012", "note": "RAM과 CPU 내부 임시기억장치 구별", "chapter": "cpu-registers"}, {"id": "20180901_009", "note": "BIOS 저장 위치를 휘발성 RAM과 구별", "chapter": "firmware-bios"}, {"id": "20190302_010", "note": "RAM 부족을 디스크 공간으로 보완하는 가상 메모리와 구별", "chapter": "virtual-memory"}, {"id": "20200229_006", "note": "EEPROM 계열 비휘발성 저장과 가상 메모리 구별", "chapter": "virtual-memory"}, {"id": "20200704_016", "note": "EEPROM 계열 저장과 CPU·RAM 사이 캐시 구별", "chapter": "cache-buffer"}, {"id": "20200704_018", "note": "사양표에서 DDR4 RAM과 SSD의 역할 구별", "chapter": "computer-specifications"}]
related: []
order: 10
priority: "1차"
status: "완료"
---

## RAM과 ROM

| 구분 | RAM | ROM 계열 |
|---|---|---|
| 전원 차단 | 내용이 사라지는 휘발성 | 내용이 유지되는 비휘발성 |
| 일반적인 역할 | 현재 실행 중인 프로그램과 데이터 저장 | 펌웨어 등 고정·반고정 정보 저장 |
| 읽기·쓰기 | 읽기와 쓰기 가능 | 종류에 따라 기록·소거 방식이 다름 |

기출에서 `현재 사용 중인 응용 프로그램이나 데이터`라는 단서가 나오면 **RAM**으로 판단함

## ROM 계열의 기록·소거 방식

| 종류 | 판단 단서 |
|---|---|
| PROM | 한 번 기록 후 일반적으로 다시 지우지 않음 |
| EPROM | **자외선**으로 내용을 지운 뒤 다시 기록 |
| EEPROM | **전기적 방법**으로 내용을 지우고 다시 기록 |
| Flash Memory | EEPROM 계열의 비휘발성 메모리로 전기적으로 기록·삭제 |

시험에서는 `EPROM = 자외선`, `EEPROM·Flash = 전기적 방법`의 차이를 우선 기억함

## 플래시 메모리

플래시 메모리는 비휘발성이며 전원이 꺼져도 데이터가 유지됨

USB 메모리, 디지털카메라, 휴대전화 등의 저장장치에 사용되는 사례로 출제됨

자기 디스크처럼 **트랙 단위로 저장하는 장치가 아님**

따라서 다음은 플래시 메모리의 오답 단서임

- 휘발성 메모리
- 트랙 단위 저장
- CPU와 RAM 사이에서 속도를 높이는 캐시 역할
- 디스크 일부를 RAM처럼 사용하는 가상 메모리 역할

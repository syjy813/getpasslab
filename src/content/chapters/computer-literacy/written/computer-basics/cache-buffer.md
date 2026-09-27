---
chapter_id: "P1-18b-02"
title: "캐시와 버퍼의 임시 저장 목적"
slug: "cache-buffer"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "캐시는 CPU와 RAM의 속도 차이 · 버퍼는 장치 사이의 속도 차이 완화"
questions: ["20200704_016"]
supportingQuestions: [{"id": "20150627_012", "note": "캐시·버퍼를 가상 메모리·연관 메모리·플래시와 구별하는 보기에 적용", "chapter": "virtual-memory"}, {"id": "20160305_013", "note": "캐시·버퍼를 가상 메모리·연관 메모리·플래시와 구별하는 보기에 적용", "chapter": "ram-rom-flash"}, {"id": "20190302_010", "note": "캐시·버퍼를 가상 메모리·연관 메모리·플래시와 구별하는 보기에 적용", "chapter": "virtual-memory"}, {"id": "20200229_006", "note": "캐시·버퍼를 가상 메모리·연관 메모리·플래시와 구별하는 보기에 적용", "chapter": "virtual-memory"}]
related: ["memory-speed-hierarchy"]
order: 13
priority: "1차"
status: "완료"
---

## 임시 저장의 목적 구별

| 개념 | 문제의 핵심 단서 |
|---|---|
| 캐시 | CPU와 주기억장치의 속도 차이 완화 |
| 버퍼 | 장치·처리 단계 사이의 속도 차이 완화 |
| 가상 메모리 | 디스크 일부를 이용해 주기억 용량 부족 보완 |
| 연관 메모리 | 주소 대신 저장된 내용의 일부로 검색 |
| 플래시 메모리 | EEPROM 계열의 비휘발성 저장 |

캐시는 자주 사용할 가능성이 높은 명령·데이터를 고속 메모리에 임시 저장

버퍼는 보내는 쪽과 받는 쪽의 처리 속도나 전송 단위가 다를 때 데이터를 잠시 모아 두는 공간

`CPU ↔ RAM의 속도 차이` → **캐시**, `장치 사이 임시 저장` → **버퍼**

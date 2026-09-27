---
chapter_id: "P1-31-02"
title: "패리티 비트로 오류 검출하기"
slug: "parity-bit"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "패리티는 문자 표현이 아닌 오류 검출용 추가 비트"
questions: ["20190302_007"]
supportingQuestions: [{"id": "20150627_011", "note": "문자 표현과 오류 검출·교정을 구별하는 선택지에 적용", "chapter": "character-codes"}, {"id": "20170902_012", "note": "문자 표현과 오류 검출·교정을 구별하는 선택지에 적용", "chapter": "character-codes"}, {"id": "20180303_011", "note": "문자 표현과 오류 검출·교정을 구별하는 선택지에 적용", "chapter": "character-codes"}, {"id": "20190831_010", "note": "문자 표현과 오류 검출·교정을 구별하는 선택지에 적용", "chapter": "character-codes"}]
related: ["character-codes"]
order: 7
priority: "1차"
status: "완료"
---

## 문자 코드와 패리티 비트

- ASCII·EBCDIC·Unicode → 문자나 기호를 표현
- 패리티 비트 → 전송 중 **오류 검출**을 위해 추가

따라서 `문자 표현 방법이 아닌 것`을 묻는 문제에서는 **Parity bit** 선택

## 검출과 교정 구별

- 짝수 패리티: 패리티 비트를 포함한 `1`의 개수를 짝수로 맞춤
- 홀수 패리티: 패리티 비트를 포함한 `1`의 개수를 홀수로 맞춤

약속한 홀짝과 다르면 오류 검출

**어느 비트가 잘못됐는지 찾아 고치는 오류 교정 기능은 없음**

짝수 개의 비트가 뒤집히면 홀짝이 유지되므로 단일 패리티로 모든 오류를 검출할 수 있는 것도 아님

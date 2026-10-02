---
chapter_id: "P1-14c"
title: "단방향·반이중·전이중 통신 비교"
slug: "simplex-half-full-duplex"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "송수신 방향과 동시 가능 여부로 세 통신 방식 구별"
questions: ["20200704_007"]
supportingQuestions: [{"id": "20160305_011", "note": "통신 방향과 네트워크 운영 구조·LAN의 범위를 구별", "chapter": "network-operating-structures"}, {"id": "20170902_004", "note": "통신 방향과 네트워크 운영 구조·LAN의 범위를 구별", "chapter": "network-scope-types"}, {"id": "20190831_008", "note": "통신 방향과 네트워크 운영 구조·LAN의 범위를 구별", "chapter": "network-operating-structures"}]
related: []
order: 96
priority: "1차"
status: "완료"
---

통신 방향 문제는 **양쪽이 송수신 가능한가**, 가능하다면 **동시에 가능한가**를 순서대로 보면 됨

## 단방향 Simplex

한쪽은 송신만 하고 다른 쪽은 수신만 하는 방식임

시험 예: **라디오 방송**

송신 측과 수신 측의 역할이 고정됨

## 반이중 Half-duplex

양쪽 모두 송신과 수신이 가능하지만 **같은 순간에 양쪽이 동시에 송신하지는 않는 방식**임

학습 예: 무전기

한쪽이 말할 때 다른 쪽이 듣고 역할을 바꿀 수 있음

## 전이중 Full-duplex

양쪽이 송신과 수신을 **동시에** 수행할 수 있는 방식임

학습 예: 전화 통화

## LAN과 반이중을 같은 말로 보지 않기

LAN은 네트워크의 범위·구성 개념임

반이중은 통신 방향·동시성 개념임

따라서 `LAN은 반이중 방식의 통신을 한다`를 LAN의 일반 정의로 사용할 수 없음

## 클라이언트/서버와도 다른 분류

클라이언트/서버·P2P는 운영 구조임

단방향·반이중·전이중은 통신 방향임

서로 같은 분류 기준으로 비교하지 않음

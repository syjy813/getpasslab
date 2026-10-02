---
chapter_id: "P1-14a-02"
title: "PING으로 연결 응답 확인하기"
slug: "ping-connectivity"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "연결 응답·왕복 시간 확인과 응답 없음의 해석 조건"
questions: ["20180901_019"]
supportingQuestions: []
related: []
order: 104
priority: "1차"
status: "완료"
---

PING은 **대상 호스트에 시험 패킷을 보내 응답 여부와 왕복 시간을 확인해 네트워크 도달 가능성을 점검**하는 명령임

## 무엇을 확인하는가

- 대상 IP·호스트에서 응답이 돌아오는지 확인
- 기본적인 네트워크 연결 상태 점검
- 응답 시간 확인 가능

## 무엇이 아닌가

- 원격 컴퓨터를 조작하는 원격 제어 기능이 아님
- 서버까지 거치는 전체 경로를 나열하는 경로 추적 기능이 아님
- 로그인 사용자 정보를 조회하는 기능이 아님

## 결과 해석 주의

PING 응답이 오면 해당 경로로 통신이 가능하다는 강한 단서가 됨

반대로 응답이 없더라도 방화벽·ICMP 차단 등 때문에 그럴 수 있으므로 **응답 없음 = 인터넷 완전 단절**이라고 단정하지 않음

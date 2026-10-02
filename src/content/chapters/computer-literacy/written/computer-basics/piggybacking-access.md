---
chapter_id: "P1-06-04"
title: "피기배킹의 무단 접근 방식"
slug: "piggybacking-access"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "정보사회와 보안"
tags: ["개념"]
summary: "남겨진 로그인 세션의 무단 사용과 도청·사칭 구별"
questions: ["20161022_005", "20180303_009"]
supportingQuestions: []
related: []
order: 149
priority: "1차"
status: "완료"
---

컴활 기출에서 피기배킹은 **정당한 사용자가 로그인된 상태를 남겨 두고 자리를 비웠을 때 비인가 사용자가 그 세션을 이어 사용해 무단 접근하는 행위**로 출제됨

## Piggybacking

기출 단서

`정상 사용자 로그인 → 종료·잠금 없이 자리 비움 → 다른 사람이 그 자리에서 계속 작업`

→ **Piggybacking**

다른 보안 문맥에서 tailgating과 비슷한 물리적 무단 동행을 가리키는 용어로 쓰이기도 있지만 이 챕터에서는 **기출 정의**를 우선함

## 다른 용어와 구별

- Spamming → 원치 않는 메시지 대량 발송
- Spoofing → 신원·주소 사칭
- Sniffing → 패킷 도청
- Piggybacking → 이미 인증된 사용 환경을 무단 이용

## 정상 방어 활동과 범죄 구별

백신을 제작·배포하는 정상적인 보안 활동 자체는 컴퓨터 범죄가 아님

저작권 침해·개인정보 유출·해킹에 의한 변조는 별도의 불법·침해 행위가 될 수 있음

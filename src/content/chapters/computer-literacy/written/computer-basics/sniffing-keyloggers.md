---
chapter_id: "P1-06-01"
title: "스니핑·키로거의 정보 수집 지점"
slug: "sniffing-keyloggers"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "정보사회와 보안"
tags: ["개념"]
summary: "네트워크 패킷 도청과 키 입력 기록의 수집 지점 비교"
questions: ["20160305_018", "20170902_006"]
supportingQuestions: []
related: []
order: 146
priority: "1차"
status: "완료"
---

스니핑은 **네트워크를 지나는 패킷을 엿보는 행위**, 키로거는 **사용자의 키보드 입력을 기록해 정보를 빼내는 행위**임

## Sniffing

수집 지점이 **네트워크 트래픽**임

기출 단서: `네트워크 주변을 지나다니는 패킷을 엿봄 → ID·비밀번호 획득`

→ Sniffing

## Key logger

수집 지점이 **사용자의 키 입력**임

기출 단서: `키보드 상의 키 입력 캐치 프로그램 → 개인정보 획득`

→ Key Logger

## 다른 용어와 구별

- Spoofing → 신뢰할 수 있는 주소·신원 등을 사칭
- Phishing → 가짜 사이트·메시지로 사용자의 입력을 유도
- Backdoor → 정상 인증 절차를 우회하는 숨은 접근 경로

공격 수행 방법이 아니라 **정보를 어디에서 빼내는지**에 집중해 판단함

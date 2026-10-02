---
chapter_id: "P1-43-02"
title: "DNS의 도메인 이름 변환"
slug: "dns-name-resolution"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "도메인 이름을 IP 주소 등 DNS 정보로 해석하는 역할"
questions: ["20151017_008"]
supportingQuestions: [{"id": "20150627_006", "note": "DNS의 이름 해석과 URL·IP 설정의 역할을 구별", "chapter": "http-url-structure"}, {"id": "20151017_006", "note": "DNS의 이름 해석과 URL·IP 설정의 역할을 구별", "chapter": "ipv4-ipv6-addresses"}, {"id": "20180303_008", "note": "DNS의 이름 해석과 URL·IP 설정의 역할을 구별", "chapter": "internet-interconnection"}, {"id": "20200704_005", "note": "DNS의 이름 해석과 URL·IP 설정의 역할을 구별", "chapter": "manual-ip-dhcp"}]
related: []
order: 102
priority: "1차"
status: "완료"
---

DNS는 **사람이 사용하는 도메인 이름을 IP 주소 등 DNS 레코드 정보로 찾아 주는 이름 해석 체계**임

## DNS가 담당하는 판단

- `www.example.com` 같은 이름으로 접속할 때 필요한 주소 정보를 찾음
- 시험에서는 **도메인 네임 → 숫자로 된 IP 주소** 변환을 핵심 역할로 판단함
- URL은 자원의 위치 표현, DHCP는 네트워크 설정 자동 할당, 도메인 등록은 등록기관·등록대행자 영역이므로 DNS의 이름 해석과 구별함

## 오답 구별

`루트 도메인이 국가를 구별함`이나 `DNS가 국가 도메인 자체를 등록·관리함`처럼 **도메인 계층·등록 정책과 이름 해석을 섞은 설명**을 정답으로 고르지 않음

도메인 계층 자체는 「도메인 이름의 계층 읽기」, IP 설정은 「IP 수동 설정과 DHCP 자동 할당」, URL은 「HTTP 전송과 URL의 구성」에서 담당함

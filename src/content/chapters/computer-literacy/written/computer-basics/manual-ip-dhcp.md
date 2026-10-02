---
chapter_id: "P1-09-02"
title: "IP 수동 설정과 DHCP 자동 할당"
slug: "manual-ip-dhcp"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "수동 구성값·MAC 주소와 DHCP의 자동 할당 구별"
questions: ["20170304_007", "20200704_005"]
supportingQuestions: [{"id": "20150627_006", "note": "수동 IP 구성값·자동 할당과 DNS·URL의 역할을 구별", "chapter": "http-url-structure"}, {"id": "20151017_008", "note": "수동 IP 구성값·자동 할당과 DNS·URL의 역할을 구별", "chapter": "dns-name-resolution"}]
related: []
order: 103
priority: "1차"
status: "완료"
---

수동 IP 설정은 **IP 주소·서브넷 마스크·게이트웨이·DNS 서버 주소 같은 네트워크 설정값**을 직접 지정하는 것이고, DHCP는 이 값을 자동으로 할당하는 방식임

## DHCP

- DHCP 서버가 클라이언트에 IP 설정을 자동 제공함
- 기출 단서 `ISP에서 각 컴퓨터의 IP 주소를 동적으로 할당` → **DHCP**
- HTTP는 웹 전송, SMTP는 메일 전송, TCP/IP는 더 넓은 통신 프로토콜 체계이므로 DHCP와 구별함

## 수동 설정값과 MAC 주소 구별

기출의 수동 TCP/IP 연결 항목

- IP 주소
- 서브넷 마스크
- DNS 서버 주소

`어댑터 주소`는 네트워크 어댑터의 MAC 주소를 가리키는 표현이며 사용자가 TCP/IP 주소 항목으로 지정하는 값이 아님

현재 Windows에서 DHCP가 게이트웨이·DNS 등 여러 설정을 함께 제공할 수 있으나 문제에서는 **자동 할당 역할**만 먼저 판단함

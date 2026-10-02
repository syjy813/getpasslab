---
chapter_id: "P1-11a"
title: "HTTP 전송과 URL의 구성"
slug: "http-url-structure"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "웹 전송 프로토콜과 주소의 스킴·호스트·포트·경로 구별"
questions: ["20150627_006", "20160625_006", "20190302_005", "20200229_005", "20200704_020"]
supportingQuestions: [{"id": "20180303_008", "note": "웹 자원 주소인 URL과 기반 네트워크인 인터넷을 구별", "chapter": "internet-interconnection"}]
related: []
order: 106
priority: "1차"
status: "완료"
---

HTTP는 **웹 브라우저와 웹 서버 사이에서 웹 자원을 주고받는 프로토콜**, URL은 **인터넷 자원의 위치를 나타내는 주소 표현**임

## HTTP

기출 단서

- 웹 서버 ↔ 웹 브라우저
- 하이퍼텍스트 문서 전송

→ **HTTP**

FTP는 파일 전송, SMTP는 전자우편 송신에 사용하므로 구별함

## URL 읽기

기출의 기본 형식

`프로토콜://호스트 서버 주소[:포트번호][/파일 경로]`

예시

`https://example.com:443/docs/page.html`

- `https` → 프로토콜·스킴
- `example.com` → 호스트
- `443` → 포트
- `/docs/page.html` → 경로

## DNS와 구별

URL은 **어디에 어떻게 접근할지 표현**하고 DNS는 그 안의 도메인 이름을 주소 정보로 해석하는 역할임

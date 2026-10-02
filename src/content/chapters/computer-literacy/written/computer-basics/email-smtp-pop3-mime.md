---
chapter_id: "P1-37-02"
title: "SMTP·POP3·MIME의 전자우편 처리 역할"
slug: "email-smtp-pop3-mime"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "메일 송신·가져오기·메시지 형식 확장의 역할 비교"
questions: ["20170304_013", "20170902_005", "20200229_009"]
supportingQuestions: [{"id": "20190302_006", "note": "전자우편 프로토콜과 회신·전달 기능을 구별", "chapter": "email-address-reply-forward"}]
related: []
order: 114
priority: "1차"
status: "완료"
---

전자우편 처리에서는 **SMTP의 메일 전송·서버 간 전달, POP3의 메일 가져오기, MIME의 메시지 형식 확장**을 구별함

## SMTP

메일 클라이언트에서 서버로 보내거나 메일 서버끼리 메시지를 전달하는 데 사용함

## POP3

원격 메일 서버에 접속해 사용자의 메일을 가져오는 데 사용함

메일 동기화 방식 전체를 POP3 하나로 일반화하지 않으며 IMAP은 별도 프로토콜임

## MIME

메일 본문·첨부파일에 다양한 문자셋과 콘텐츠 유형을 표현할 수 있도록 메시지 형식을 확장함

`MIME = 회신 기능을 제공하는 프로토콜`이 아님

## 문자 코드 오답

기출의 `기본적으로 8비트 Unicode/EBCDIC로 메일을 보낸다` 같은 설명은 전자우편 구조를 잘못 단순화한 것임

문자 인코딩과 SMTP·POP3·MIME의 역할을 따로 판단함

---
chapter_id: "P1-37-01"
title: "전자우편 주소와 회신·전달의 수신 대상"
slug: "email-address-reply-forward"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "네트워크와 인터넷"
tags: ["개념"]
summary: "주소 형식과 회신·전체 회신·전달의 수신 대상 비교"
questions: ["20190302_006"]
supportingQuestions: [{"id": "20150627_004", "note": "전자우편 주소와 수신 대상을 확인 · 프로토콜·파일 검사는 함께 볼 설명에서 학습", "chapter": "malware-prevention"}, {"id": "20170304_013", "note": "전자우편 주소와 수신 대상을 확인 · 프로토콜·파일 검사는 함께 볼 설명에서 학습", "chapter": "email-smtp-pop3-mime"}, {"id": "20200229_009", "note": "전자우편 주소와 수신 대상을 확인 · 프로토콜·파일 검사는 함께 볼 설명에서 학습", "chapter": "email-smtp-pop3-mime"}]
related: []
order: 113
priority: "1차"
status: "완료"
---

전자우편 주소는 **사용자 식별자@도메인** 형식이며, 회신·전체 회신·전달은 **메일을 누구에게 보내는가**가 다름

## 주소 형식

`user@example.com`

- `user` → 사용자 식별자
- `example.com` → 메일을 처리하는 도메인 이름

## 수신 대상 구별

- 회신 Reply → 보통 원래 발신자에게 답장
- 전체 회신 Reply all → 발신자와 해당 메일의 다른 수신자들을 포함해 답장
- 전달 Forward → 받은 내용을 사용자가 새로 지정한 다른 수신자에게 전달

연결 기출의 `작성한 답장만 발송자에게 보내는 기능을 전달이라 한다`는 설명은 **회신과 전달을 뒤바꾼 것**이므로 오답임

한 메일을 여러 수신자에게 동시에 보내는 것도 가능함

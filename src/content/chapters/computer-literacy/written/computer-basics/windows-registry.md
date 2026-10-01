---
chapter_id: "P1-27b"
title: "Windows 레지스트리에 저장하는 정보"
slug: "windows-registry"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "Windows 화면과 조작"
tags: ["개념"]
summary: "Windows 구성 데이터베이스를 CPU 레지스터·CMOS·캐시와 구별"
questions: ["20151017_020"]
supportingQuestions: [{"id": "20180303_013", "note": "CPU 레지스터와 Windows 레지스트리의 역할 차이에만 적용", "chapter": "cpu-registers"}]
related: []
order: 73
priority: "1차"
status: "완료"
---

## 레지스트리의 역할

현재 Microsoft 문서에서도 레지스트리를

**응용 프로그램과 시스템 구성 요소가 구성 데이터를 저장하고 읽는 시스템 정의 데이터베이스**

로 설명함

기출에서 다음 표현이 나오면 Registry와 연결함

- Windows 데이터베이스
- 시스템 하드웨어·소프트웨어 구성 정보
- 프로그램 실행과 시스템 설정에 필요한 정보

## CMOS와 구별

CMOS는 전통적으로 BIOS 설정과 같은 하드웨어 초기 설정 정보를 연결해 설명하는 개념임

Windows 운영체제의 구성 데이터베이스를 뜻하지 않음

따라서 문제의 단서가

**Windows 데이터베이스 + 시스템·소프트웨어 구성 정보**

라면 CMOS가 아니라 Registry임

## 하드 디스크와 구별

하드 디스크는 저장장치임

레지스트리 데이터가 저장장치에 실제 파일 형태로 존재할 수 있다는 사실과

`하드 디스크 자체가 Windows 구성 데이터베이스다`

라는 설명은 다른 의미임

## 캐시 메모리와 구별

캐시는 CPU와 주기억장치 사이의 속도 차이를 줄이기 위한 고속 기억장치임

시스템 설정 데이터베이스가 아님

## CPU 레지스터와 구별

CPU 레지스터는 CPU 내부에서 명령·주소·연산 결과 등을 임시로 저장하는 초고속 기억장치임

`운영체제의 시스템 정보를 기억하고 관리한다`

는 설명은 CPU 레지스터가 아니라 Windows **Registry**와 혼동한 것임

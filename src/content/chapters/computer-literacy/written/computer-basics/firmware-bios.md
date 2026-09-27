---
chapter_id: "P1-46"
title: "펌웨어와 BIOS의 부팅 역할"
slug: "firmware-bios"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "컴퓨터의 구성과 동작"
tags: ["개념"]
summary: "펌웨어는 하드웨어 제어 코드 · BIOS는 부팅 초기 점검·초기화 담당"
questions: ["20160625_011", "20180901_009"]
supportingQuestions: [{"id": "20150307_019", "note": "BIOS의 부팅 역할에만 적용 · 키보드 오류의 부팅 영향은 BIOS 설정에 따라 달라짐"}, {"id": "20151017_013", "note": "입력장치와 하드웨어 제어 프로그램인 펌웨어 구별", "chapter": "input-output-devices"}]
related: []
order: 22
priority: "1차"
status: "완료"
---

## 펌웨어의 성격과 저장 위치

**하드웨어 제어 프로그램 → ROM·플래시 같은 비휘발성 메모리에 저장**

기출의 `ROM에 기록된 마이크로프로그램`, `하드웨어 성능 향상을 위한 업그레이드` → **펌웨어**

키보드 같은 입력장치나 프리웨어·셰어웨어 같은 배포 방식의 이름은 아님

## BIOS의 부팅 역할

**전원 켜기 → POST로 하드웨어 점검 → 장치 초기화 → 다음 부팅 단계**

BIOS는 펌웨어이므로 `RAM에 저장되어 전원을 끄면 사라짐`은 틀린 설명

플래시 메모리를 이용한 BIOS는 업데이트 가능하므로 기출의 `ROM`을 절대 수정 불가라는 뜻으로 확대하지 않음

키보드 오류가 부팅에 영향을 주는지는 BIOS 설정에 따라 달라지므로 `키보드는 부팅과 무관`으로 일반화하지 않음

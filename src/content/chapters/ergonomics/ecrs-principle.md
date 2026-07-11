---
title: ECRS 원리
slug: ecrs-principle
subject_id: 2
group: 시스템 설계
tags: [이론, 빈출]
summary: Eliminate 제거 · Combine 결합 · Rearrange 재배치 · Simplify 단순화
questions: [20190804_025]
related: [workplace-layout-principles, man-machine-system-design]
examComment: 4원리에 없는 항목(Standardize 등)을 끼운 소거형 단일 패턴.
---

## 핵심 공식 / 정의

ECRS — 작업 개선의 4원리. 개선 검토는 반드시 이 순서로.

| 순서 | 원리 | 질문 |
|------|------|------|
| E | Eliminate (제거) | 이 작업을 없앨 수 없는가? |
| C | Combine (결합) | 다른 작업과 합칠 수 없는가? |
| R | Rearrange (재배치·재편성) | 순서·장소·담당을 바꿀 수 없는가? |
| S | Simplify (단순화) | 더 간단하게 할 수 없는가? |

> ⚠️ **함정 주의**: 목록에 Standardize(표준화)·Reduce(축소) 등 유사 용어를 끼운 선지가 정답(포함되지 않는 것). E→C→R→S는 개선 효과가 큰 순서 — 제거가 최우선이라는 서열까지 출제됨.

## 단위·기호 해설

| 원리 | 개선 강도 | 예 |
|------|-----------|-----|
| Eliminate | 최대 (작업 자체 소멸) | 불필요한 검사 폐지 |
| Combine | 큼 | 두 공정을 한 번에 |
| Rearrange | 중간 | 공구 위치 변경 |
| Simplify | 기본 | 동작 수 축소 |

## 해석 / 의미

- ECRS의 사상 = 개선은 빼기부터 — 없앨 수 있는 작업을 최적화하는 것은 낭비라는 동작경제·작업연구의 대원칙
- 위험성 감소 대책 우선순위(본질적 대책 → 공학적 → 관리적 → 보호구)와 동일한 논리 구조 — 근원 제거가 항상 첫 번째
- 작업장 배치·동작경제 원칙과 한 문제군을 이루는 시스템 설계 계열의 기초 어휘

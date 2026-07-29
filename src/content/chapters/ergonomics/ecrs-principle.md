---
title: ECRS 원리
slug: ecrs-principle
subject_id: 2
order: 3
priority: 출시 필수
status: 완료
group: 시스템 설계
tags: [개념]
summary: Eliminate 제거 · Combine 결합 · Rearrange 재배치 · Simplify 단순화
questions: [20190804_025]
related: [workplace-layout-principles, man-machine-system-design]
examComment: 4원리에 없는 항목(Standardize 등)을 끼운 소거형 단일 패턴.
---

## 핵심 개념

ECRS — 작업 개선의 4원리. 개선 검토는 반드시 이 순서로.

| 순서 | 원리 | 질문 |
|------|------|------|
| **E** | **Eliminate (제거)** | 이 작업을 없앨 수 없는가? |
| **C** | **Combine (결합)** | 다른 작업과 합칠 수 없는가? |
| **R** | **Rearrange (재배치·재편성)** | 순서·장소·담당을 바꿀 수 없는가? |
| **S** | **Simplify (단순화)** | 더 간단하게 할 수 없는가? |

## 판별 기준

| 원리 | 개선 강도 | 예 |
|------|-----------|-----|
| **Eliminate** | 최대 (작업 자체 소멸) | 불필요한 검사 폐지 |
| **Combine** | 큼 | 두 공정을 한 번에 |
| **Rearrange** | 중간 | 공구 위치 변경 |
| **Simplify** | 기본 | 동작 수 축소 |

## 시험 포인트

- 검토 순서는 **제거 → 결합 → 재배치 → 단순화**다.
- 작업 자체를 없앨 수 있는지 먼저 확인하고, 불가능할 때 다음 원리로 넘어간다.
- `Standardize(표준화)`와 `Reduce(축소)`는 ECRS 4원리에 포함되지 않는다.
- 정의 문장이 제시되면 없앰·합침·바꿈·간단하게 함의 방향으로 판별한다.
- 작업장 배치 원칙과 동작경제 원칙도 불필요한 움직임을 줄인다는 목표로 연결된다.

## 자주 틀리는 포인트

- ECRS와 이름이 비슷한 개선 용어를 목록에 추가하지 않는다.
- `Rearrange`를 단순화가 아니라 순서·장소·담당의 재배치로 구분한다.
- 기존 작업을 더 쉽게 만드는 `Simplify`와 작업 자체를 없애는 `Eliminate`를 바꾸어 읽지 않는다.

> ⚠️ **함정 주의**: `Standardize`나 `Reduce`처럼 그럴듯한 용어가 섞였는지 먼저 확인하고, E→C→R→S 순서를 함께 대조한다.

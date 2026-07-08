---
title: 방폭전기기기 표시코드
slug: explosion-proof-code
subject_id: 4
group: 방폭 구조
tags: [이론, 빈출]
summary: Ex ia IIC T4 Ga — 구조·가스그룹·온도등급·EPL 순서 해독
questions: [20200822_079, 20220424_073, 20210307_075, 20200926_061, 20210515_067]
related: [explosion-proof-types, gas-group-classification, explosion-temperature-class]
examComment: 표시코드 한 줄을 주고 각 요소 해석의 정오를 묻는 종합형. EPL 등급과 방폭부품 접미사 U가 세부 출제 포인트.
---

## 핵심 공식 / 정의

방폭기기 명판의 표시 순서.

$$\text{Ex} \;\; \underbrace{\text{ia}}_{방폭구조} \;\; \underbrace{\text{IIC}}_{가스그룹} \;\; \underbrace{\text{T4}}_{온도등급} \;\; \underbrace{\text{Ga}}_{EPL}$$

EPL(Equipment Protection Level, 기기보호등급) — 점화원이 될 가능성에 따른 보호 수준.

| EPL | 대상 분위기 | 보호 수준 | 사용 가능 장소 |
|------|------|------|------|
| Ga / Gb / Gc | 가스 (G) | 매우 높음 / 높음 / 강화 | 0종 / 1종 / 2종 |
| Da / Db / Dc | 분진 (D) | 매우 높음 / 높음 / 강화 | 20종 / 21종 / 22종 |

> ⚠️ **함정 주의**: EPL은 Explosion이 아닌 **Equipment** Protection Level. 인증번호 접미사 구분 — "U" = 방폭부품(단독 사용 불가), "X" = 특정 사용조건 있음. 두 접미사를 뒤바꾼 선지가 기출 정답 이력.

## 단위·기호 해설

| 요소 | 예시 | 의미 | 주의점 |
|------|------|------|--------|
| Ex | — | 방폭기기 표시 | 국제 공통 접두 |
| ia | d, p, o, e, n 등 | 방폭구조 종류 | 소문자 표기 |
| IIC | IIA·IIB·IIC / IIIA·IIIB·IIIC | 가스(II)·분진(III) 그룹 | III는 분진 — 가스로 해석하면 오답 |
| T4 | T1~T6 | 최고표면온도 등급 | T4 = 135℃ 이하 |
| Ga | Gb, Gc, Da~Dc | EPL | a로 끝나면 0종(20종) 가능 |

## 해석 / 의미

- 표시코드는 "이 기기를 어디에 설치할 수 있는가"의 압축 답안 — 장소 등급(EPL)·가스 종류(그룹)·발화온도(T등급) 3개 조건을 동시에 대조
- 예: Ex ia IIC T4 Ga = 본질안전 최고등급, 수소·아세틸렌 지역, 표면온도 135℃ 이하, 0종 장소 설치 가능
- 각 요소가 독립 챕터(구조 종류·가스그룹·온도등급)와 1:1 연결 — 이 챕터는 통합 해독 훈련의 허브

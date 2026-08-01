#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

HANDOVER = Path("AI_HANDOVER.md")
REPORT = Path("docs/audits/2026-08-02-exam-content-batch1-production-verification.md")
MERGE_SHA = "7898e84ed78d318fec1886daaad00bb0ef67815f"
PAGES_RUN = "30706599852"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 target, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    report = f'''# 시험 포인트 첫 개선 배치 production 검증

- 검증일: 2026-08-02
- 대상 PR: #8 `content: improve first exam-insight batch`
- `main` 병합 커밋: `{MERGE_SHA}`
- 병합 방식: Squash and merge
- 최종 결과: **PASS**

## 1. GitHub Pages 배포

- workflow: `Deploy to GitHub Pages`
- run: `{PAGES_RUN}`
- 기준 SHA: `{MERGE_SHA}`
- 상태: `completed / success`
- 생성·시작 시각: `2026-08-01T15:44:55Z`
- 완료 시각: `2026-08-01T15:45:39Z`

## 2. production runtime smoke test

| 페이지 | HTTP | 결과 |
|---|---:|---|
| 홈 | 200 | PASS |
| 반응기·증류탑·열교환기 | 200 | PASS |
| 안전밸브 차단밸브 금지 예외 | 200 | PASS |
| 자연발화 | 200 | PASS |
| 안전표지 종류 | 200 | PASS |
| 안전관리 조직 형태 | 200 | PASS |

## 3. 세부 확인

| 검사 | 결과 |
|---|---|
| 전체 대표 URL HTTP 200 | PASS |
| 홈 사이트 제목 | PASS |
| 반응기 챕터 `9문항 / 전체 14회차 중 6회차` 표현 | PASS |
| 안전밸브 출제 경향 문구 | PASS |
| 최신 공식 출처 확인 주의 문구 | PASS |
| 자연발화 3개 판단 포인트 | PASS |
| `20210814_004`의 안전표지 오연결 제거 | PASS |
| `20210814_004`의 안전관리 조직 관계 반영 | PASS |

## 4. 검증 방법 주의

- 기출 회차·문항 ID는 자동 생성되는 기출 이력과 문제 레이어의 내부 데이터에 정상적으로 존재할 수 있다.
- 따라서 수동 `시험 포인트` 교정 여부는 회차 문자열 전체의 부재가 아니라, 새 판단 포인트의 존재와 잘못된 관계 데이터의 제거·이동을 기준으로 검증했다.
- 사용자 노출 콘텐츠 검사는 기존 영구 CI 기준을 유지한다.

## 5. 남은 위험

- 법령 조문·별표 수치 전 항목의 의미 대조는 `LEGAL_SOURCE_RECHECK_REQUIRED`로 유지.
- `examComment` 미작성 공개 챕터 전체 보강은 후속 배치로 유지.
- 기존 npm 취약점과 Actions deprecation 경고는 별도 의존성·CI 작업으로 분리.
'''
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(report, encoding="utf-8", newline="\n")

    text = HANDOVER.read_text(encoding="utf-8")
    heading = "## 시험 포인트 첫 개선 배치·production 검증 게이트 완료 (2026-08-02)"
    if heading in text:
        raise RuntimeError("batch1 production gate already exists")

    text = replace_once(
        text,
        "> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-01 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.5",
        "> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.6",
        "handover header",
    )
    text = replace_once(
        text,
        "- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합과 공개 콘텐츠 내부 식별자·운영 문구 정리, 재발 방지 CI 가드의 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.",
        "- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 첫 시험 인사이트 배치의 관계·빈도·법령 편집 개선과 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.",
        "current state summary",
    )
    text = replace_once(
        text,
        "- **최신 동적 상태**: 문서 맨 아래의 `공개 챕터 내부 식별자·운영 문구 정리·production 검증 게이트 완료` 절을 우선한다.",
        "- **최신 동적 상태**: 문서 맨 아래의 `시험 포인트 첫 개선 배치·production 검증 게이트 완료` 절을 우선한다.",
        "latest gate pointer",
    )

    section = f'''

{heading}

이 절은 공개 챕터의 첫 시험 인사이트 개선 배치와 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #8 `content: improve first exam-insight batch` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `{MERGE_SHA}`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 이번 배치의 Production 상태: **VERIFIED**.
- 완료된 첫 개선 배치를 다시 수행하지 않는다.

### 2. 완료 범위

- 확정 관계 불일치 8건 제거.
- 명확한 기존 완료 챕터 5곳으로 관계 이동.
- 대상이 불명확한 3문항은 임의 관계 없이 미매핑 유지.
- 5개 챕터의 연결 문항 수·고유 시행 회차 재집계 및 근사·과장 표현 제거.
- 법령·고시 의존 4개 챕터의 출제 경향과 기준일 주의 보정.
- `spontaneous-combustion` 회차별 정답 나열을 3개 판단 포인트로 압축.
- 변경 파일: 챕터 21개, 감사 문서 4개.

### 3. 데이터 무결성·빌드 검증

- 전체 챕터: 250개.
- 전체 관계: 887건.
- 존재하지 않는 문항 참조: 0건.
- 챕터 내부 중복 관계: 0건.
- `subject_id` 불일치: 0건.
- `slug`, `subject_id`, `question_id` 무변경.
- `questions.json` 본문·선택지·정답 무변경.
- 최종 PR CI:
  - Astro build 성공, 209페이지.
  - SEO 검사 경고 0개·오류 0개.
  - 공개 콘텐츠·원문 무결성 검사 오류 0개.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `{PAGES_RUN}`.
- 기준 SHA: `{MERGE_SHA}`.
- 결과: `completed / success`.
- 대표 URL 6개 모두 HTTP 200.
- 빈도 문구, 법령 기준일 주의, 자연발화 시험 포인트, 대표 관계 이동을 production에서 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-exam-content-batch1-production-verification.md`.

### 5. 남은 위험과 다음 작업

- 법령 조문·별표 수치 전 항목의 의미 대조는 `LEGAL_SOURCE_RECHECK_REQUIRED`로 유지.
- `examComment` 미작성 공개 챕터 전체 보강은 후속 배치로 유지.
- Search Console 노출 데이터가 확보된 페이지를 다음 콘텐츠 개선 우선순위에 반영.
- npm 취약점과 Actions deprecation 경고는 콘텐츠 작업과 분리된 감사에서 처리.

다음 권장 작업은 남은 `examComment` 미작성 챕터를 빈도·검색 가치·정확성 위험으로 분류하고, 두 번째 개선 배치를 선정하는 것이다.
'''
    text = text.rstrip() + section + "\n"
    HANDOVER.write_text(text, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()

from pathlib import Path

p = Path('AI_HANDOVER.md')
text = p.read_text(encoding='utf-8')
title = '## 산업안전기사 1과목 P1 관계 보강·최종 sweep 완료 (2026-08-17)'

if title not in text:
    replacements = {
        '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-16 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.19': '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-17 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.20',
        '- **산업안전 관계 상태**: 1,680문항 중 고유 연결 968문항, 미연결 712문항. 관계 참조 978건, 다중 연결 10문항. PR #66의 23건에 이어 PR #68에서 14개 관계를 기존 5개 챕터에 추가했고, 보류 6건은 미연결 상태를 유지한다.': '- **산업안전 관계 상태**: 1,680문항 중 고유 연결 **994문항**, 미연결 **686문항**. 관계 참조 **1,004건**, 다중 연결 **10문항**. 1과목은 280문항 중 170문항 연결·110문항 미연결이며, 기존 챕터에 안전하게 추가할 수 있는 P1 후보의 최종 sweep을 완료했다.',
        '- **최신 동적 상태**: 문서 맨 아래의 `산업안전기사 기출 관계 정밀 보강 게이트 완료` 절을 우선한다.': '- **최신 동적 상태**: 문서 맨 아래의 `산업안전기사 1과목 P1 관계 보강·최종 sweep 완료` 절을 우선한다.'
    }
    for old, new in replacements.items():
        count = text.count(old)
        if count != 1:
            raise SystemExit(f'STOP replacement target count={count}: {old[:80]}')
        text = text.replace(old, new, 1)

    section = '''

---

## 산업안전기사 1과목 P1 관계 보강·최종 sweep 완료 (2026-08-17)

산업안전기사 미연결 문항 중 1과목(P1)을 최신 `main`에서 재검토했다. 자동 유사도는 후보 축소에만 사용하고 문항 의미·현재 챕터 소유 범위·정답·이미지/원문 누락 위험을 직접 대조해 검증된 관계만 반영했다.

### 1. Batch 3 구현·production 검증

- PR #73: `feat: add subject1 P1 batch3 verified relations`.
- Squash merge commit: `7503b7b9686868019fb60f2cd2c705774b33c67b`.
- 기존 챕터 관계 **6건** 추가: `group-discussion-methods` 5건, `severity-rate` 1건.
- `severity-rate`의 `examComment`를 실제 관계 기준 **10문항 / 8회차**로 정정하고 `영구 전노동 불능(13급)` 오표기를 **1~3급**으로 수정했다.
- PR head와 squash merge 후 `main`의 Git tree SHA가 `cbbf1224294250250f28436fba25e36828ec244c`로 동일함을 확인했다.
- GitHub Pages run `31964710432`: build **success**, deploy **success**.
- deployment `5934076841`: 최종 상태 **success**, environment URL `https://getpasslab.co.kr/`.

### 2. 검증된 최신 관계 기준선

- 산업안전기사 전체: **1,680문항**.
- 관계 참조: **1,004**.
- 고유 연결 문항: **994**.
- 미연결 문항: **686**.
- 다중 연결 문항: **10**.
- 1과목: **280문항 / 170 mapped / 110 unmapped**.

이전 `978 refs / 968 mapped / 712 unmapped` 기준선은 과거 상태이며 현재 동적 정본으로 사용하지 않는다.

### 3. 1과목 기존 챕터 최종 sweep

이전 검토·보류 이력을 제외하고 마지막 미검토 10문항을 재추출해 직접 검토했다. **기존 챕터에 추가할 수 있는 안전한 관계는 0건**으로 판정했다.

- `20210515_011`: 재해조사 절차 — 신규 챕터 후보.
- `20210515_014`: 헤링 착시 — **IMAGE_DEPENDENT**, 신규 챕터 후보.
- `20220305_019`: 자동운동 시지각 — 신규 챕터 후보.
- `20210814_012`: 레윈 행동식 — 신규 챕터 후보.
- `20200606_015`: 생체리듬 — 신규 챕터 후보.
- `20180819_006`: 산업재해 기록·분류 — **SOURCE_INCOMPLETE / ORIGINAL_CHECK_REQUIRED**.
- `20190303_010`: 인간오류 독립행동 분류 — 신규 챕터 후보.
- `20180304_020`: 생체리듬 — 신규 챕터 후보.
- `20220305_018`: 바이오리듬 — 신규 챕터 후보.
- `20200926_003`: Y-K 성격검사 — 신규 챕터 후보.

기존 챕터 범위를 재대조한 결과 `accident-analysis-tools`는 통계 분석도구, `human-error-by-process`는 인지·판단·조작 과정별 착오요인, `human-relations-mechanism`은 동일화·모방·암시·투사·커뮤니케이션을 소유하므로 위 문항을 유사하다는 이유만으로 흡수하지 않는다.

### 4. 신규 챕터 후보 군집

현재 1과목 미연결 전체에서 반복 출제 군집을 다시 확인했다.

- 레윈 행동법칙: **5문항**.
- 생체리듬: **6문항** — 23/28/33일 리듬과 주야 생리변화가 섞여 있어 범위 결정 필요.
- 재해조사·재해 발생 조치: **3문항**.
- Y-G / Y-K 성격검사: **2문항**.
- 착시·자동운동: **2문항** — 헤링 문항은 이미지 확인 필요.
- 인간오류 독립행동 분류: **1문항**.

신규 공개 slug는 Owner 결정 범위이므로 생성하지 않았다.

### 5. 남은 위험·다음 작업

- `20180819_006`은 현재 JSON 본문에 분류 조건이 빠져 있어 원본 확인 전 확정 금지.
- `20210515_014`는 그림 선택지이므로 원본 이미지 확인 전 공개 관계 확정 금지.
- 생체리듬 6문항은 하나의 챕터로 합칠지 범위를 나눌지 구조 결정이 필요.
- 추천 다음 배치는 **레윈 행동법칙 5문항 + 재해조사 3문항 + 성격검사 2문항**의 저위험 신규 챕터 3개다. 착시·생체리듬·인간오류 분류는 별도 검토한다.
- `npm ci`의 기존 **2 high severity vulnerabilities** 경고는 별도 해결되지 않았다.

최종 상태: 산업안전기사 1과목의 **기존 챕터 관계 보강 및 P1 최종 sweep VERIFIED**. 다음 구현은 Owner가 신규 공개 챕터 범위를 승인한 뒤 시작한다.
'''
    text = text.rstrip() + section.rstrip() + '\n'
    p.write_text(text, encoding='utf-8', newline='\n')

# Validation is intentionally duplicated here and in CI.
final = p.read_text(encoding='utf-8')
assert final.count(title) == 1
assert '고유 연결 **994문항**, 미연결 **686문항**' in final
assert '관계 참조 **1,004건**' in final
assert '- 고유 연결 문항: **994**.' in final
assert '- 미연결 문항: **686**.' in final
assert '7503b7b9686868019fb60f2cd2c705774b33c67b' in final
assert final.endswith('\n') and not final.endswith('\n\n')

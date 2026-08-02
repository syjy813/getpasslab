from pathlib import Path

path = Path('AI_HANDOVER.md')
text = path.read_text(encoding='utf-8')

replacements = {
    '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.6':
    '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.7',
    '- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 첫 시험 인사이트 배치의 관계·빈도·법령 편집 개선과 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.':
    '- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 첫 시험 인사이트 배치의 관계·빈도·법령 편집 개선과 두 번째 배치 12개 챕터의 출제 경향 보강·production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.',
    '- **최신 동적 상태**: 문서 맨 아래의 `시험 포인트 첫 개선 배치·production 검증 게이트 완료` 절을 우선한다.':
    '- **최신 동적 상태**: 문서 맨 아래의 `시험 포인트 두 번째 개선 배치·production 검증 게이트 완료` 절을 우선한다.',
}

for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one replacement target, found {count}: {old[:80]}')
    text = text.replace(old, new, 1)

heading = '## 시험 포인트 두 번째 개선 배치·production 검증 게이트 완료 (2026-08-02)'
if heading in text:
    raise SystemExit('Batch2 handover section already exists')

section = r'''

## 시험 포인트 두 번째 개선 배치·production 검증 게이트 완료 (2026-08-02)

이 절은 두 번째 `examComment` 개선 배치와 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #10 `content: add second exam trend batch` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 두 번째 개선 배치의 Production 상태: **VERIFIED**.
- 완료된 두 번째 배치를 다시 수행하지 않는다.

### 2. 완료 범위

- 공개 챕터 12개의 `examComment`를 보강.
- 전체 14개 시행 회차 대비 실제 문항 수·고유 회차 수 사용.
- 출제 유형·계산 흐름·부정형 함정을 학습자용 한 문장으로 요약.
- 변경 파일 12개, 12줄 추가, 삭제 0줄.
- `severity-rate`는 이미지 검수 미완료 문항을 제외한 공개 기준 6문항·6회차로 기록.

대상 챕터:

- 화학: `dust-explosion-factors`, `acetylene-properties`
- 전기: `shock-prevention`, `vf-danger-energy`
- 기계: `safety-factor`, `press-safety-distance`
- 안전관리: `accident-prevention-principles`, `severity-rate`, `hazard-prediction-training`, `safety-inspection-types`
- 인간공학: `anthropometry-design`, `information-entropy`

### 3. 데이터 무결성·빌드 검증

- PR 최종 HEAD: `973bc20020846515b461082e35588df454b0bb62`.
- GitHub Actions `SEO validation` run #101: 성공.
- Astro build 성공, 209페이지.
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개.
- `slug`, `subject_id`, `question_id`, 챕터 `questions` 관계 무변경.
- `questions.json` 본문·선택지·정답 무변경.
- 스키마·의존성·URL·production 설정 무변경.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `30747175723`.
- 기준 SHA: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-02T12:07:47Z → 2026-08-02T12:08:38Z`.
- production 검증 workflow run: `30748804989`.
- 홈과 대표 4개 챕터 모두 HTTP 200.
- 분진폭발 `13문항 / 11회차`, 심실세동 에너지 `8문항 / 8회차`, 강도율 공개 기준 `6문항 / 6회차`, 정보량 `3문항 / 3회차` 문구 반영 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-exam-content-batch2-production-verification.md`.

### 5. 남은 위험과 다음 작업

- T0 감사 기준 미작성 공개 챕터 121개 중 12개를 보강했으며 잔여 109개는 후속 배치로 유지.
- 관계 불일치 의심 항목과 챕터 범위 구조 후보는 `examComment` 작성과 분리해 검토.
- 법령·고시 의존 챕터는 현행 공식 원문 대조 후 작성.
- Search Console 노출 데이터가 확보되면 다음 배치 우선순위에 반영.
- npm 취약점 5건과 Actions deprecation 경고는 별도 의존성·CI 감사에서 처리.

다음 권장 작업은 관계 불일치·구조 후보를 먼저 정리한 뒤, 법령 비의존 고빈도 미작성 챕터의 세 번째 `examComment` 배치를 선정하는 것이다.
'''

path.write_text(text.rstrip() + section + '\n', encoding='utf-8')

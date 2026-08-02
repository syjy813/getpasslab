from pathlib import Path

path = Path('AI_HANDOVER.md')
text = path.read_text(encoding='utf-8')

replacements = {
    '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.7':
    '> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.8',
    '- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 첫 시험 인사이트 배치의 관계·빈도·법령 편집 개선과 두 번째 배치 12개 챕터의 출제 경향 보강·production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.':
    '- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 시험 인사이트 2개 배치, 관계·구조 정리 Gate A의 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.',
    '- **최신 동적 상태**: 문서 맨 아래의 `시험 포인트 두 번째 개선 배치·production 검증 게이트 완료` 절을 우선한다.':
    '- **최신 동적 상태**: 문서 맨 아래의 `관계·구조 정리 Gate A·production 검증 게이트 완료` 절을 우선한다.',
}

for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one replacement target, found {count}: {old[:100]}')
    text = text.replace(old, new, 1)

heading = '## 관계·구조 정리 Gate A·production 검증 게이트 완료 (2026-08-02)'
if heading in text:
    raise SystemExit('Gate A handover section already exists')

section = r'''

## 관계·구조 정리 Gate A·production 검증 게이트 완료 (2026-08-02)

이 절은 관계·구조 T0 감사에서 신규 공개 식별자나 법령 원문 확인 없이 확정할 수 있었던 Gate A 구현과 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #13 `fix: reconcile relation structure gate A` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `571a4aec906a4127e99f474b3a0e57d8c239598b`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 관계·구조 정리 Gate A의 Production 상태: **VERIFIED**.
- 완료된 Gate A 범위를 다시 수행하지 않는다.

### 2. 완료 범위

- 관계 제거 8건, 관계 추가 7건을 반영해 전체 관계를 887건에서 886건으로 정리.
- Swain 챕터에서 Reason 계열 2문항 분리.
- 심실세동 전류에서 위험한계 에너지 계산 1문항 제거.
- 심실세동 에너지에 원문 복원 대기 중인 정확한 내부 관계 3건 추가.
- 연삭숫돌 회전속도를 계산형 3문항으로 정리.
- 평형플랜지·연삭기 노출각도·기계의 5대 위험점 관계 보완.
- 누전차단기 설치 예외에서 설치 전압 기준 문항 1건 제거.
- 원문 누락·OCR 훼손 문항 3건을 `jpg 확필`로 전환해 복원 전 공개 차단.
- `연삭숙돌`, `숙돌` 사용자 노출 오타 교정.

변경 파일은 챕터 8개와 `questions.json` 1개이며, `questions.json`은 손상 문항 3건의 `review` 필드만 변경했다.

### 3. 데이터 무결성·빌드 검증

- PR 최종 HEAD: `e488fbcbf2aa8ca176f63d4e433f80432b5e5955`.
- GitHub Actions `SEO validation` run #113: 성공.
- Astro build 성공, 209페이지.
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개.
- 전체 관계: 886건.
- 존재하지 않는 문항 참조: 0건.
- 챕터 내부 중복 관계: 0건.
- `subject_id` 불일치: 0건.
- 기존 `slug`, `subject_id`, `question_id` 무변경.
- 문제 본문·선택지·정답 무변경.
- 신규 공개 `slug`, 의존성, 스키마, URL 규칙, production 설정 무변경.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `30752925033`.
- 기준 SHA: `571a4aec906a4127e99f474b3a0e57d8c239598b`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-02T14:48:31Z → 2026-08-02T14:49:11Z`.
- production 검증 workflow run: `30752971120`.
- Swain, 심실세동 전류, 심실세동 에너지, 연삭숫돌 회전속도, 기계의 5대 위험점, 누전차단기 설치 예외 페이지 모두 HTTP 200.
- 관계 제거·추가, 손상 문항 비노출, 공개 문항 수 유지, 제목·설명 보정을 production에서 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-relation-structure-gate-a-production-verification.md`.

### 5. 남은 위험과 다음 작업

- Reason 인간오류 분류와 일반 연삭기 안전 신규 챕터는 신규 공개 식별자 Owner 승인 필요.
- 심실세동 전류의 전격사 위험 범위 확대는 기존 챕터 보정 작업으로 유지.
- 건설공사 유해·위험방지계획서와 누전차단기 구조·정격·시설기준은 법령·고시 공식 원문 대조 후 보정.
- 원문 누락·OCR·이미지 의존 문항은 원본 복원 전 비공개 유지.
- `examComment` 미작성 공개 챕터 후속 배치는 관계·구조 정리와 분리해 진행.
- npm 취약점 5건과 Actions deprecation 경고는 별도 의존성·CI 감사에서 처리.

다음 권장 작업은 신규 공개 식별자 없이 가능한 기존 챕터 범위 보정을 먼저 진행하고, 신규 `slug` 2개는 Owner 명명·생성 결정을 별도 게이트로 처리하는 것이다.
'''

path.write_text(text.rstrip() + section + '\n', encoding='utf-8')

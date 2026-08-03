from pathlib import Path

handover_path = Path('AI_HANDOVER.md')
audit_path = Path('docs/audits/2026-08-03-gate-b2-law-and-relations-implementation.md')
trigger_path = Path('.gate-b2-docs-trigger')

text = handover_path.read_text(encoding='utf-8')
marker = '## Gate B2 원문 복원·법령·관계 production 게이트 완료 (2026-08-03)'

if marker not in text:
    replacements = [
        (
            '**최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-03 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.9',
            '**최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-03 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.10',
        ),
        (
            '관계·구조 정리 Gate A와 기존 챕터 범위 보정 Gate B1의 production 검증까지 완료됐다.',
            '관계·구조 정리 Gate A, 기존 챕터 범위 보정 Gate B1, 원문 복원·법령·관계 보정 Gate B2의 production 검증까지 완료됐다.',
        ),
        (
            '문서 맨 아래의 `관계·구조 범위 보정 Gate B1·production 검증 게이트 완료` 절을 우선한다.',
            '문서 맨 아래의 `Gate B2 원문 복원·법령·관계 production 게이트 완료` 절을 우선한다.',
        ),
    ]

    for old, new in replacements:
        count = text.count(old)
        if count != 1:
            raise RuntimeError(f'Expected one handover match, found {count}: {old}')
        text = text.replace(old, new, 1)

    section = r'''

## Gate B2 원문 복원·법령·관계 production 게이트 완료 (2026-08-03)

이 절은 `20190804_119` 원문 복원, 건설공사 유해·위험방지계획서 법령 콘텐츠, 누전차단기 법령 콘텐츠와 관계 3건의 구현·병합·production 검증 상태를 기록한다.

### 1. 현재 단계

- PR #27 `content: implement Gate B2 law and relation batch` 완료.
- Owner의 조건부 일괄 승인과 ChatGPT 최종 기술 리뷰 PASS 후 Squash and merge 완료.
- `main` 병합 커밋: `34c818eba4af6973cfeb5fa34df3064d374a13e5`.
- Gate B2 production 상태: **VERIFIED**.
- 완료된 Gate B2 범위를 다시 수행하지 않는다.

### 2. `20190804_119` 원문 복원

사용자가 제공한 `산업안전기사20190804(교사용).pdf` 8쪽의 119번 문항과 같은 쪽 정답표를 직접 대조했다.

- 본문: `감전재해의 직접적인 요인으로 가장 거리가 먼 것은?`
- 선택지: 통전전압의 크기 / 통전전류의 크기 / 통전시간 / 통전경로
- 정답: 1번
- 교사용 문제 본문의 정답 표시와 정답표가 일치함.

복원 결과:

- `questions.json`에서 해당 문항의 `body`, `choices`, `answer`, `review`만 복원.
- `question_id`, `subject_id`, 날짜·번호 유지.
- 전체 문제 수 1,680개 유지, ID 중복 0건.
- 인접 문항 `20190804_118`, `20190804_120` 무변경.
- 잘못된 건설공사 관계는 제거 상태 유지.
- 적합한 기존 챕터를 임의 생성·연결하지 않고 관계 0건의 미매핑 상태 유지.
- 원문 복원 후 임시 ID 하드코딩 공개 필터 제거.

### 3. 건설공사 법령 콘텐츠

`construction-hazard-plan-documents`에 다음을 반영했다.

- 건축물·인공구조물 지상높이 31m 이상.
- 일반 건축물 연면적 30,000㎡ 이상.
- 법령 열거 특정 시설과 냉동·냉장 창고 설비·단열공사 5,000㎡ 이상.
- 다리 최대 지간길이 50m 이상.
- 터널·댐·굴착 깊이 10m 기준.
- 대상 공사 착공 전날까지 제출.
- 공사 중 6개월 이내마다 확인.
- 첨부서류를 기능별로 구분.
- 2018~2022년 기출 시점과 2020년 전부개정 이후 조문 체계 구분.

기존 13개 관계를 유지하고 `20190804_119`를 다시 추가하지 않았다.

### 4. 누전차단기 법령 콘텐츠와 관계

`leakage-breaker-types`에 다음을 반영했다.

- 누전검출부·영상변류기·차단장치와 전력퓨즈 구분.
- 산업안전보건기준상 대지전압 150V 초과 설치 대상.
- 일반 감전방지용 30mA 이하·0.03초 이내.
- 정격전부하전류 50A 이상 기기의 200mA 이하·0.1초 이내 예외.
- 욕실 등 특정 장소 15mA 이하·0.03초 이하 또는 3kVA 이하 절연변압기 조건.
- 2022년 시행 당시 KEC 문항의 금속제 외함 저압 기계기구 50V 초과 기준.

추가 관계:

- `20220424_065`
- `20200926_065`
- `20180428_073`

세 문항은 추가 전 관계 0건임을 확인했고, 최종적으로 `leakage-breaker-types`에만 연결했다. `leakage-breaker-exception`의 기존 관계는 변경하지 않았다.

### 5. 병합 전 검증

- PR 최종 HEAD: `07c7b40d1826cfb19ca6f5e1574ebfaf909097ea`.
- Gate B2 runner run #27: `30804563487`, 성공.
- SEO validation run #156: `30804563832`, 성공.
- Astro build: 209페이지.
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠 검사: 오류 0개.
- 공개 본문의 내부 question ID·제작 문구 노출 0건.
- 신규 `slug`, 스키마, 의존성, URL 규칙, production 설정 변경 없음.

### 6. production runtime 검증

- 일회성 검증 PR #31은 병합하지 않고 종료.
- workflow run: `30804840067`.
- job: `91657665376`.
- 결과: `completed / success`.
- 첫 번째 확인 시도에서 통과.
- 건설공사 페이지에서 신규 법령 섹션, 31m·50m·착공 전날·6개월 기준 확인.
- 누전차단기 페이지에서 신규 법령 섹션, 관계 추가 문항, 30mA·15mA·150V 기준 확인.
- 손상 당시 건설공사 문항과 복원된 미매핑 문항이 건설공사 페이지에 노출되지 않음을 확인.
- 검증용 workflow 파일은 제거했고 PR #31은 병합하지 않았다.

### 7. 남은 위험과 다음 작업

- 50V 기준은 2022년 시행 당시 KEC 기출 기준으로 제공한다. 실제 현행 설계·시공에는 2026년 KEC 전문과 전로·기기 조건을 다시 확인한다.
- 원문 누락·OCR·이미지 의존 문항은 복원 전 비공개 원칙을 유지한다.
- Reason 인간오류 분류와 일반 연삭기 안전 신규 챕터는 신규 공개 `slug` Owner 결정이 필요하다.
- npm 취약점 5건, `tsconfck` deprecated, install-script allowlist 경고와 Actions deprecation 경고는 별도 의존성·CI 감사에서 처리한다.
- AdSense 승인·실제 광고 송출, Search Console 색인·sitemap 처리, GA4 실시간 이벤트는 외부 계정 증거로 별도 확정한다.
- 기출문제와 이미지의 상용 이용 범위는 Owner 법무·사업 결정이 필요하다.

다음 권장 작업은 외부 수익화·분석 상태 확인과 기출문제 이용 권리 결정이다. 저장소 기술 작업으로는 의존성·CI T0 감사 또는 손상·이미지 문항 위험 배치가 후속 후보다.
'''
    text = text.rstrip() + section + '\n'
    handover_path.write_text(text, encoding='utf-8')

final_marker = '## 6. 최종 병합·production 검증'
audit = audit_path.read_text(encoding='utf-8')
if final_marker not in audit:
    audit += r'''

## 6. 최종 병합·production 검증

- PR: #27 `content: implement Gate B2 law and relation batch`
- PR 최종 HEAD: `07c7b40d1826cfb19ca6f5e1574ebfaf909097ea`
- Squash merge commit: `34c818eba4af6973cfeb5fa34df3064d374a13e5`
- Gate B2 runner run #27: `30804563487`, 성공
- SEO validation run #156: `30804563832`, 성공
- Build: 209페이지
- SEO: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개
- 공개 콘텐츠 검사: 오류 0개
- production 검증 run: `30804840067`
- production 검증 job: `91657665376`
- 결과: 첫 번째 시도에서 `completed / success`
- 검증용 PR #31: 병합하지 않고 종료, workflow 파일 제거

최종 판정:

- `20190804_119` 원문 복원: 완료
- 임시 공개 차단 코드 제거: 완료
- 건설공사 법령 콘텐츠: 완료
- 누전차단기 법령 콘텐츠·관계 3건: 완료
- production: **VERIFIED**
- 신규 공개 식별자·스키마·의존성·URL·production 설정 변경: 없음
'''
    audit_path.write_text(audit.rstrip() + '\n', encoding='utf-8')

if trigger_path.exists():
    trigger_path.unlink()

print('Gate B2 handover and audit completion records prepared.')

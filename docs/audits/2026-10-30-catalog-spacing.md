# 실서버 QA 피드백: 목록·푸터 여백과 GNB 보조 문구

- 기준 main: `6960f6867b4452b61afa46cbf32c6e1faba93779` (PR #209 배포본)
- 사용자 제공 화면3개: 산업안전1과목 목록의 섹션 사이, 홈 GNB 로고 아래 문구, 홈 푸터 열 사이 간격.
- 제품 변경: `src/components/GNB.astro`, `src/styles/catalog.css`, `src/styles/global.css` 3개만 수정.

## 변경 기준 (코드 정의값)

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| 목록의 그룹 탐색→빈출, 빈출→전체 챕터, 챕터 그룹 사이 | 32px | 640px 이상64px, 그 미만48px |
| 홈·목록의 주요 section 상단 | 640px 이상48px, 그 미만32px | 640px 이상64px, 그 미만48px |
| 푸터 열 간격 | 32px | 768px 이상64px, 그 미만32px 유지 |
| 푸터가 다음 줄로 흐를 때 행 간격 | 32px | 768px 이상48px, 그 미만32px 유지 |
| GNB 로고 아래 ‘자격증의 모든 것’ | 표시 | 제거 |

홈 본문 상단의 서비스 설명은 사용자 표시 영역과 구분해 유지한다. 로고 홈 링크·자격증 메뉴·챕터 목차·광고 단위/예약 높이·푸터 링크·공개 URL·SEO·학습 본문·문항/이미지 데이터는 유지한다. 시설 영역은 추가하지 않는다.

## 검증 근거

기존 탐색 QA의 overflow·메뉴·기출/이미지·초점 복귀 검증을 유지하고, 사용자 제공 목록 경로 `/industrial-safety/written/safety-management/`를 추가한다. 18화면×4크기와 광고 resize4조건을 실행하며, 홈·목록·푸터 캡처와 실제 렌더링 간격을 결과 JSON에 남긴다. 캡처에서 임의로 픽셀을 산출하지 않는다.

이 문서의 수치는 코드 정의값이다. 실제 PASS/FAIL·렌더링 측정값은 해당 커밋의 GitHub Actions `Certification discovery QA` 결과/`certification-discovery-qa` artifact와 구현 PR에 기록한다. 이 계획을 실행 완료로 취급하지 않는다. headless Chromium과 실제 사용자 PC·실물 모바일 검증은 구분한다.

역사 검증 데이터 `2026-10-29-certification-discovery/review.json.gz`는 원래 main6c70 기준을 유지하면서 승인한 현재 UI 변화까지 재생성한다. 제품 소스 허용 목록9개는 기존1·2차 전체 범위를 뜻하며 이번 추가 수정은 위3개다. 알 수 없는 변형은 역복원하지 않으며 학습/문항/경로/SEO 보존 검사는 그대로 유지한다.

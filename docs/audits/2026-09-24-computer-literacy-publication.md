# 컴활 2급 8개 챕터 공개 검증

- 사용자 승인: 검토한 챕터를 실서버에 공개
- 기준 main: c7bfe0bd96f574c5540e110b7ec7fe709d78385a
- 원본 저장소의 미커밋 작업을 보존한 별도 worktree에서 구현
- 공개 범위: 8개 챕터, 14개 주 기출, 6개 기출 이미지, 4개 학습 SVG, 허브 2개와 과목 2개 포함 신규 12개 경로
- 식별자 대응: `2026-09-22-computer-literacy-publication-map.json`
- 출처·조건부 검증 이력: `2026-09-22-computer-literacy-publication-sources.md`
- 학습 본문 정본은 src/content/chapters/computer-literacy/written
- 기초 3개 기출 미배정, 일부 공개 안내. 부분 표본 빈출 배지 비활성화
- 미승인 전체 560문항·검수 도구·대량 이미지 변경은 이번 공개에서 제외

## 검증

- Build PASS: 268페이지 (2026-09-22), 기존 청크 크기 경고 유지
- SEO PASS: HTML 270, sitemap 269 URL, 경고/오류 0
- 공개 콘텐츠 PASS: HTML 270, 오류 0
- 기존 자격증 deferred delivery PASS
- 컴활 공개 검사 PASS: 8/14/6/4, canonical·기출 연결·실제 이미지 파일·공개 경로·비공개 내용 비노출
- 2026-09-24 위 검사 재실행 모두 PASS, git diff --check PASS
- 8개 챕터 모바일 가로 넘침 없음 및 학습 그림 로딩 확인 (2026-09-22)
- 390px 모바일에서 목표값 찾기 20200704_023 및 이름 범위 20150307_037의 이미지·문제·정답 공개·닫기 정상, 이전 챕터 이동 정상 (2026-09-24)
- 실제 Excel 엔진·Windows 7 UI 재현과 실제 학습자 성과 검증은 미실시. 답을 바꾸는 버전·입력 조건은 본문 유지

## 배포

이 기록 시점에는 Push·Deploy·Production 대기. PR 검사 통과 후 main 반영, GitHub Pages 배포 성공 및 실제 사이트 확인 필요

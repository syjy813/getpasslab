# 분리 챕터 개념 중심 교열 — 2026-10-05

사용자의 맥그리거 X·Y 챕터 빨간 박스 지적과 이어서 진행 요청에 따라 12개 개요·22개 세부·기존 THERP 총 35개 페이지를 검수했습니다.

- 선택지·정답을 직접 지목하는 문장과 표 뒤의 반복 요약을 삭제하거나 해당 개념에 통합.
- 맥그리거는 인간에 대한 가정과 관리 방향을 비교표에 통합. THERP는 중복 시험 포인트 표·일반 경고·범위 안내를 삭제하고 작업 분해·확률 조건 유지.
- 분석 대상·장치 역할·검사 원리·적용 조건과 133문항의 판단 근거 유지. 기출 수치·과거 법령 적용 시점과 계산 예시는 보존.
- 본문 전체가 시험과 무관한 이론집으로 확장되지 않도록 기존 연결 문항의 풀이에 필요한 범위만 유지.
- 35개 frontmatter, 기출 본문/선택지/답안/등록 이미지, 공통 CSS·레이아웃·기계 그림·재해분석 표·다른 자격증 불변.
- 이전 release snapshot을 변경하지 않고 originalSha256→sha256 검수 chain으로 새 본문만 허용.

맥그리거 보충 근거: MIT OpenCourseWare, Thomas A. Kochan의 High Road/Low Road 및 고성과 작업 시스템 자료 pp.4–5의 X/Y 인간관·통제·신뢰 설명.
https://www.ocw.mit.edu/courses/res-15-003-shaping-the-future-of-work-15-662x-spring-2016/f30460f13beac256b34a7b45b1c79be1_MITRES_15_003S16_worksys.pdf
원전 참고: https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Motivation/McGregor_The_Human_Side_of_Enterprise.pdf

제한: 원본 PDF에 누락된 그림·빈칸 및 OCR 오탈자는 재구성하지 않았습니다. 벤젠의 제시값/기록된 답안 차이와 과거 수치의 적용 시점처럼 답 판단에 영향을 주는 조건은 삭제하지 않았습니다. 감전보호용 차단기의 특정 기출 비교를 일반적인 모든 차단기의 절대 속도 순위로 확대하지 않았습니다. 현행 법령 전수 개정·실물 스마트폰·학습 효과 검증은 수행하지 않았습니다.

검수: review.json(35개 정확한 본문 지문), question-coverage.json(133문항↔개념 절), source-verification.json(그 외 src/public 667개 파일의 manifest 지문·미변경 git subtree·frontmatter 지문 보존).
Build/정본/SEO/본문 및 320·390·1440px QA와 최종 배포 상태는 PR 설명에서 확정합니다.

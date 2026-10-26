# 챕터 목차와 하단 고정 바 겹침 수정

기준 main `fb92caac3a3358285e21204217d1e9ff493e1091` / 작업 브랜치 `codex/gnb-toc-height-20261026`

## 원인과 변경

첨부 화면처럼 긴 목차가 하단 이전/다음 고정 바까지 내려옴. 기존 메뉴 max-height가 GNB와 아래 여백만 빼고 하단 고정 바 공간을 제외하지 않았음.

제품 변경은 `src/styles/global.css` 한 파일의 두 선언:

- 기존 body 하단 확보 공간 `72px + env(safe-area-inset-bottom)`을 `--chapter-mobile-nav-space` 변수로 추출
- 하단 바가 표시되는 1023px 이하에서 목차 최대 높이를 `100dvh - GNB 높이 - 하단 확보 공간 - 8px`로 제한
- 메뉴 내부 세로 스크롤 유지. 목차 위치·링크·현재 항목·좌우24px·PC·문제/그림·본문 변경 없음

## 검증

- WEB Build545페이지
- 새 native guard: 851제품 source/asset 중 CSS1개만 변경, 547HTML은 해당 CSS파일 참조만 변경, 524article 바이트 보존, 공개521챕터 유지
- 기존 GNB/모바일/위계/가독성 검사와 격리 fixture를 정확한 이번 CSS/참조 delta 역복원으로 유지. 과거 snapshot을 덮어쓰지 않음
- `Mobile learning UX QA`: 8대표 챕터×4폭과 일반 페이지8조건, 긴153챕터 목록의 320/390/768px×높이360/844px×하단 안전영역0/34px12조건. 총52조건
- 메뉴 바닥이 실제 고정 바 상단보다 최소8px 위에 있는지 검사. 마지막 챕터까지 메뉴 내부 스크롤·클릭 가능함을 확인
- 34px 안전 영역은 CI CSS 주입으로 bar padding과 확보 공간을 함께 늘린 모사. 실제 iOS/Safari 장치 검증으로 주장하지 않음
- 브라우저 최종 PASS/FAIL과 캡처는 PR Checks의 결과 기준

이번 수정의 main 병합·Production 배포는 미실행.

# 챕터 목차 GNB 이동 및 좌우 여백 교정

기준 main: `e23ba369f9666035b3153aec348c7564a8fe566f` (직전 PR191 배포 완료)
작업 브랜치: `codex/gnb-chapter-toc-20261026`

## 요청과 구현

- 본문 상단 드롭다운과 하단 가운데 목차를 제거. 하단은 기존 이전/다음 2열로 복구
- 챕터 상세의 GNB 우측을 '챕터 목차'로 변경. 현재 과목의 그룹/제목/순서를 기존 sideChapters 데이터로 렌더하며 현재 챕터 강조·열 때 현재 항목으로 내부 스크롤
- 홈·자격증·과목 목록 등 일반 페이지의 '자격증 · 과목' 메뉴 유지
- Production390px에서 로고 좌측16px, 우측 화살표 끝28px 확인. 컨테이너/버튼 중첩 padding을 정리해 양 끝24px로 통일
- body·기출·그림 확대·44px 터치·과목 전환·기존 URL/챕터 순서 유지. PC 사이드바 유지

제품 변경은 GNB, BaseLayout, ChapterLayout, global.css 4개. 신규 제품 컴포넌트/데이터 원본/의존성 없음.

## 검증

- WEB Build545페이지. native guard가851제품파일·547HTML의 정확한 delta, 524article 본문·수식·문항·이미지 원본 보존 확인
- 모든521챕터에서 GNB 목차와 기존 사이드바 링크의 제목·주소·순서·현재 상태가 일치. 23일반페이지의 원래 GNB 확인
- 기존 가독성·위계·기출·그림·격리 fixture 보호 검사 유지. 과거 review/snapshot은 수정하지 않고 이번 정확한 delta만 역사 검사에서 역복원
- `Mobile learning UX QA`: 7대표챕터×4폭에서 GNB목차·현재위치·44px·메뉴범위·실제이동/뒤로가기·양끝24px·기출/확대회귀. 일반 페이지8조건과 짧은화면2조건 포함 총38조건
- 전체521챕터×320/390/768/1440 기존 회귀 QA 유지. 브라우저 최종 결과는 PR Checks와 artifact 기준

연결 브라우저로 Production 변경 전 여백 확인. WEB localhost는 연결 브라우저 접근 불가하므로 수정본 브라우저 검증은 CI Chromium. 실물 iOS/Android/Safari 검증과 구분. 이 수정의 main 병합·Production 배포는 미실행.

## 보호 자료

baseline.json은 변경 전 제품/HTML/article 해시. review.json.gz는 정확한 4제품파일·HTML 변경의 무손실 역복원 패치. 새 native guard는 현재 바이트와 전체 article을 별도로 보호하며 승인되지 않은 변조는 거부함.

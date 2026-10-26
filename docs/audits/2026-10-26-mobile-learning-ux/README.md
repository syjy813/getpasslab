# 모바일 학습 UX 개선

기준: main `dbd9f1e68b03c9a00c03bd58e23e3f5a915da945` / PR #191

## 확인된 문제와 변경

| 확인 근거 | 변경 |
|---|---|
| Production 목표값 찾기 390px: 과목 메뉴 right 402.59px | 모바일 breadcrumb 내부 너비에 메뉴 배치 |
| 같은 페이지 기출 버튼 높이 29px | 모바일 기출·정답·닫기·메뉴 최소44px |
| releaseNotice가 없는 과목은 모바일 챕터 목록 없음 | 모든521챕터에 기존 과목 데이터로 그룹별 목록 제공 |
| 긴 챕터에서 전체 목차로 바로 돌아가기 어려움 | 기존 이전/다음 사이에 과목 목차 링크 |
| 480px 컴활 SVG가 모바일 본문342px에 축소 표시 | 별도 viewer/overlay 없는 learning-visuals에 원본 크기 확대 |
| GNB가 짧은 화면 아래로 길어짐 | 메뉴 최대높이와 내부 스크롤, Escape 닫기 |

기존 본문 폰트·14px 표·섹션 간격·수식 카드·기출 정본·공개 URL은 유지. 신규 서비스 구조나 자격증·본문 데이터 변경 없음.

## 학습 그림 브리프 — 원본 유지형

학습 이미지 정본: `docs/standards/learning-image-design-system-v1.md` v1.2 §§5–9 적용.

- 질문: 셀 주소·수식·부품 라벨을 원본 크기로 읽을 수 있는가?
- 대상: 기존 learning-visuals figure의 이미지. 자체 버튼/링크/SVG 오버레이가 있는 figure 및 boiler-circulation은 기존 구현 유지
- 캡션·기술 정보: 원본 HTML figcaption·alt·src·숫자·화살표·구조를 그대로 재사용. 이미지 신규 제작/크롭/재배치 없음
- 보기: 기존 그림 바로 아래 '그림 확대' 버튼. native dialog에서 원본 width를 사용하고 내부 가로/세로 스크롤 제공
- 종료: 닫기 버튼/Escape/바깥 클릭, body의 기존 스타일 우선순위·읽던 위치·버튼 포커스 복원
- 접근성: dialog 제목, close 초기 포커스, scroll region 이름과 설명, 이미지 alt 유지. 색만으로 상태를 표현하지 않음
- 검증 폭: 320·390·768·1440px. 기술적 내용의 재감사·실제 학습자 효과 측정으로 주장하지 않음

## 검증과 증거

WEB 실행 결과:

- Build545페이지, HTML547개·sitemap545URL, SEO/공개 콘텐츠/대비/deferred 오류0
- `check-mobile-learning-ux.mjs`: 기존851 src/public 파일, 모든547HTML, 524article의 정확한 바이트 보존. 전 과목521챕터의 목록·목차·viewer 구조 검사
- `check-global-chapter-readability.mjs`, `check-all-chapter-hierarchy.mjs` PASS
- 컴활 기존8/C1/001–081/082–159, 산업안전 분리/원문복원/미배정/수식/그림, 소방 launch/bulk/persona/standardization 및 문제풀이 정본 검사 PASS
- 역사 격리 fixture 4종은 신규 exact-inverse 모듈/압축 패치도 복사해 기존 금지 변경·삭제 거부 검증을 유지

브라우저 최종 상태는 [PR #191 Checks](https://github.com/syjy813/getpasslab/pull/191/checks) 기준:

- Mobile learning UX QA: 7대표 챕터×4폭, 짧은 메뉴2조건. 현재 항목·메뉴 경계·44px 터치·기출 정답/닫기·동일 이미지/alt/크기·3종 닫기·위치/스타일/포커스 복원
- All chapter reading hierarchy QA: 전체521×320/390/768/1440 = 2,084화면, 표·수식·제목/구분선·가로 넘침 회귀
- 기존 instant practice/모달/소방·산업안전 브라우저 회귀는 각 workflow의 결과·artifact로 확인

연결 브라우저는 Production 사전 UI 점검에 사용. WEB localhost 접근 불가로 수정본은 GitHub Actions Chromium에서 검증. 실제 iOS/Android/Safari 및 수정본 Production QA는 이번 검증에 포함하지 않음. main 병합·배포 미실행.

## 보호 검사 자료

- baseline.json: 변경 전 전체 제품 파일/HTML/article SHA256와 base commit
- review.json.gz: 정확한 제품3파일과 빌드 HTML의 역복원 패치. 반복 HTML을 무손실 gzip 압축했으며 검사 시 SHA256·패치 위치·원본 복원 SHA를 모두 확인
- `read-before-mobile-learning-ux.mjs`: 과거 검수에만 exact delta 역복원. 알 수 없는 파일·수정은 숨기지 않음
- 새 native guard는 현재 바이트와 기존 본문 전체를 독립 검증. 과거 snapshot·정답·검수 해시 덮어쓰기 없음

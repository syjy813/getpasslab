# 소방안전관리자 2급 최초 공개

## 목적과 승인 범위

사용자가 검토한 이미지 중심 스프링클러 샘플을 기존 GetPassLab 챕터 레이아웃으로 공개하고 홈·자격증 메뉴에 소방안전관리자 2급을 추가한다. 사용자는 신규 자격증 추가와 Production 배포를 명시 승인했다. 자체 예상문제·모의고사·나머지 목차 집필은 이번 범위에 포함하지 않는다.

기준 main: `429018e32bd21a8e85daa79fc8bfb58656583920`. 기존 launch 브랜치는 기준 main과 동일하며 PR이 없었다. 작업공간 정리 뒤 Library의 검토 HTML v2를 복구해 소스에 다시 통합했다. 이전 미커밋 통합 결과와 QA를 이번 결과로 주장하지 않는다.

## 공개 구성

- 자격증: 소방안전관리자 2급 (`fire-safety-manager-level2`), 국가기술자격과 별도 범주
- 자격시험: `written`, 공식 2과목 범위를 요약한 학습 구분
- 1과목: 소방안전관리 이론·소방시설 구조 (`fire-safety-theory`)
- 2과목: 소방시설 점검·계획·대응 (`fire-safety-practice`), 콘텐츠 준비 중
- 최초 공개: FSM2-037, 스프링클러 방식과 작동 순서
- URL: `/fire-safety-manager-level2/written/fire-safety-theory/sprinkler-types-operation/`

기존 ChapterLayout·토큰·learning-visuals·본문 타이포그래피 재사용. 검토본의 가짜 준비 중 관련 링크는 등록하지 않았다. 공개 질문 배정은 빈 배열이며 기출·복원문제·검수 판단·편집 메모 UI를 표시하지 않는다. 소방 2급 안내 페이지에서도 실제 기출 데이터가 있는 것처럼 보이는 회차/문항 통계를 숨긴다. 원문 기출 JSON·ID·정답과 기존 공개 URL은 그대로 유지한다.

## 이미지 브리프 및 적용 기준

이미지 디자인 정본 `docs/standards/learning-image-design-system-v1.md` v1.2 §§1–9를 실제 확인했다.

- 캡션: 각 방식의 평상시 2차측 상태와 헤드 형태
- 학습 질문: 물·기체 상태와 폐쇄형/개방형 헤드로 4방식을 구별할 수 있는가?
- 유형/레벨: 비교형 L1, 이전 승인 생성 PNG 원본 유지
- 원본: 복구 HTML의 내장 1254×1254 PNG; 바이트 그대로 추출
- 전달 범위: 평상시 구조 비교. 가압송수장치·상세 트림·시공 치수 생략
- 확인 관계: 건식 압축기 연결은 2차측, 준비작동식 공급측 가압수/2차측 기체/폐쇄형 헤드, 일제살수식 2차측 대기압/개방형 헤드
- 미확인 디테일: 볼트·노즐·게이지 외형은 실제 제품 사양으로 인증하지 않음
- 색/라벨: 물·압축공기·신호가 문자와 함께 표시. 조건·작동 순서는 웹 텍스트로 제공
- PC/모바일: 같은 PNG를 CSS 사분면으로 표시. 그림 제목은 HTML figcaption, 그림 안에는 상태·부품명만 유지
- 확대: 같은 사분면을 600px로 확대, 내부 가로/세로 이동. 버튼·Esc·배경 클릭으로 닫기, 본문 위치·inline style·포커스 복원
- 모바일: 320px/390px의 실제 그림 폭과 기존 2열/1열 구성 확인. 실제 iOS/Android/Safari는 별도 검증하지 않음

## 정확성 근거

- 한국소방안전원 시험 안내 Ver 26.1: https://safe.kfsi.or.kr/assets/downloadDoc/33.pdf (2026-10-14 재조회). 두 과목, 과목당 25문항·총 50문항·60분, 과목당 40점 이상·평균 70점 이상을 확인했다. 사이트 과목 이름은 공식 전체 범위를 요약한 학습 표시다.
- NFTC 103, 국립소방연구원공고 제2026-35호, 시행 2026-07-01: https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281674&chrClsCd=010201 . 본문 endpoint를 2026-10-14 직접 내려받아 1.7.1.9·23·25·26·27, 2.6.1.1·2.6.2.1·2.6.3.1~3을 재확인했다. 4방식 상태·기동 조건과 습식/건식 펌프 기동의 혼용 허용 확인.
- 복구 샘플의 이전 8문항 대조·Viking J-1 확인 기록은 `sample-editorial-review.json`에 역사적 자료로 보존. 이번에 원본 PDF 8문항을 새로 전수 검증한 것으로 표현하지 않는다.
- 공개 본문에서 복원 출처 설명을 제거하고 해당 습식 흐름은 알람밸브·기동용수압개폐장치를 사용하는 작동 예시로 표현. 펌프 순서를 모든 설비에 일반화하지 않는다.

## 보호 검사

`baseline.json`: 작업 시작 시 실제 main의 src/public 732개 파일 해시·450개 article 해시.
`release.json`: 변경 source 7개와 추가 source/assets 4개의 정확한 해시, 신규 article 1개.

원본 7개 source를 별도 originals에 보존했다. 기존 역사적 검사에는 정확한 신규 버전만 확인하고 원본으로 읽는 helper를 연결했다. 승인되지 않은 source 수정·원본 변조·이미지 변조·삭제·새 파일을 거부하는 격리 검사 7건을 추가했다. 기존 practice guard의 12개 검사를 유지한다. 가장 최신 guard는 역사적 projection 없이 실제 전체 인벤토리·article을 검사한다. 과거 audit JSON·해시는 수정하지 않았다.

## 검증 상태

- Astro Build: PASS, 471 pages
- 기존 보호/정본/콘텐츠/SEO check 29종: PASS
- 신규 history mutation guard: PASS, 7건
- 기존 450개 article 바이트 그대로 유지, 기존 src/public 732개 중 승인 source 7개만 변경
- 최신 브라우저 결과: `browser-results-local.json` 참조
- Commit·Push·CI·Merge·Deploy·Production 결과: 본 PR 및 실제 workflow 실행 결과 확인. 실행 전 완료로 주장하지 않는다.

실제 학습자 정답률, 실물 스마트폰·Safari, 전체 소방 2급 콘텐츠 정확성 검수는 이번 완료 범위가 아니다.

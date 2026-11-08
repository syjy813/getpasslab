# 4·5·6카드 통합형 — 구현·검증 기록

- 기준: main `9eca8430c03682a2b027e00a825fe5ed54b0c471`
- 브랜치: `codex/facility-card-4-6-20261108`
- 사용자 요청: 같은 비교 내용을 분할 이미지 2장으로 나누지 않고 4·5·6개 항목을 한 이미지에 담는 정본 템플릿 제작.
- 현재 정본 확인 결과: 기존 4개 요약형은 있었으나 최대 4개이고, 4개형 상세 생략·4:3 고정·기존 제작 방침의 2~3개 분할이 한계였다.

## 구현

- `cardLayout: "overview"`는 상세를 유지하는 4~6개 통합형이다. 5·6개는 자동 선택한다. 카드 제목·요약·최대 3개 상세·행동문구와 전체 메시지를 유지하고 높이를 늘린다. 한도를 초과하는 원고는 오류로 처리한다.
- PC 1440px 2열, 5개형 마지막 카드 중앙. 모바일 720px 1열은 같은 전체 항목·설명의 파생이며 분할본이 아니다. `<picture>`는 각 화면에 완결된 이미지 한 장을 선택한다.
- 기존 1~4개 기본/compact 토큰과 SVG 바이트는 그대로 재현한다. 추가 픽토그램 호텔은 0화 제작 스크립트의 침대 도형을 그대로 정본으로 등록했다.
- 시설 가이드 §5.13.4·§5.13.7~8 정합성 조정 및 §5.13.10 추가. 미병합 과거 템플릿을 정본으로 쓰지 않는다.
- 4개: 0화 시설 비교, 5개: PR #262 호텔 원고의 면접 질문, 6개: 0화 지원 전 확인사항. 업무 부담 4조건은 추가 JSON/SVG 예제로 포함했다. 기존 3묶음의 카드 필드 보존 대조는 [content-preservation.json](content-preservation.json).
- JSON/SVG·PNG·WebP와 [독립 검토본](../../standards/facility-infographic-templates/overview-preview.html), [치수·WebP 해시](../../standards/facility-infographic-templates/overview-image-manifest.json)를 보존했다. 검토본은 SVG를 포함한 자체 완결 HTML이며 PNG/WebP 파생도 별도로 제공한다.

## 실제 검증과 한계

- `node --test scripts/test-facility-infographic.mjs scripts/test-facility-overview.mjs`: **22개 PASS**. 기존 1~4개·compact 재현, 필드 보존, 장문에 따른 높이 변화, 5개형 배치, 초과 내용 오류, compact 위임, 이스케이프 검사.
- SVG 생성·PNG/WebP 변환 성공. 4개 PC/모바일 원본과 5개 PC 720px, 6개 모바일 350px 축소 이미지를 직접 확인했다. 카드 텍스트·아이콘 윤곽·행동문구·프레임을 확인하고 모바일 하단의 짧은 어미 단독 줄바꿈을 개선했다.
- 로컬 Chromium은 `socket() failed: Operation not permitted`로 실행하지 못했다. 로컬 브라우저 PASS로 기록하지 않는다.
- 새 `Facility overview template QA` CI는 **커밋된 SVG 재현 검사 후** 브라우저로 320/390/768/1440px의 picture 선택·완결된 이미지 1개·종횡비·가로 넘침·핵심 세부 글씨 표시 크기를 확인한다. 6개 SVG의 실제 글자 bbox 잘림·서로 겹침도 검사한다. 결과 JSON은 해당 실행의 `facility-overview-browser-validation` Artifact이며, 실제 성공 여부는 PR의 HEAD/실행에 연결한다.
- CI 범위는 해당 렌더러·픽토그램·예제 변경으로 제한했다. 생산 코드의 패키지/의존성 변경은 없으며 브라우저 도구는 CI 임시 디렉터리에만 설치한다.
- 사이트 Build·SEO·기존 공개 기능은 PR의 필수 CI 결과로 구분한다. 실제 글 적용·목차/광고/본문 구성·Production QA를 수행했다는 뜻은 아니다.

## 변경 경계와 후속

`src/`, `public/`, 기존 발행 manifest·0화 승인 원고·이미지·URL은 변경하지 않는다. 배포 요청이 없어 main 병합·Production 배포는 하지 않는다. 호텔 원고 PR #262도 수정하지 않는다.

0화에 실제 적용할 때는 6개 분할 이미지를 3개 통합 picture로 교체하되, 공개 metadata·alt·브라우저 이미지 선택·치수·release manifest와 검사기를 함께 갱신한다. 공개 적용 전 전용 미리보기와 사용자 승인 범위를 확인한다. 템플릿 제작 요청을 기존 모든 글의 일괄 교체 승인으로 해석하지 않는다.

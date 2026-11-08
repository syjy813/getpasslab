# 호병백마 0화 분할 이미지 통합

## 범위와 기준

- 사용자 요청: 호병백마 시리즈에서 2장으로 노출하는 같은 주제의 이미지를 한 장으로 합치기.
- 기준 main `9eca8430c03682a2b027e00a825fe5ed54b0c471`, 검증된 템플릿 체크포인트 PR #263 HEAD `ca30d38975eec8ca0b8ec18e852f27386ef43050`에서 이어서 작업했다.
- 현재 공개 원고는 0화이며 1화 원고는 별도 PR #262다. 이번 변경은 0화의 세 묶음에 한정한다.

| 구간 | 이전 | 적용 원고 |
|---|---|---|
| 시설별 관리 대상 | 호텔·병원 / 백화점·마트 2장 | 4개 시설 비교 1장 |
| 업무 부담 조건 | 운영시간·민원 / 업무분장·지원 2장 | 4개 조건 비교 1장 |
| 지원 전 확인 | 계약·근무·업무 / 지원·보수·교육 2장 | 6개 확인사항 1장 |

대표 썸네일은 그대로이며 본문 이미지는 6→3장, 페이지 전체는 대표 포함 7→4개 img로 바뀐다. PC는 2열, 모바일은 같은 전체 내용의 1열 이미지다. 각 구간의 picture가 화면별 완결된 이미지 하나를 선택한다.

## 원본 보존과 변경 경계

- [previous-article.md](previous-article.md)는 직전 공개 정본의 정확한 사본이며 기존 개정 manifest의 SHA-256과 대조한다. 기존 초안·7장 이미지 manifest·분할본 WebP·원본 마스터·과거 audit는 수정/삭제하지 않는다.
- 기존 원고의 본문·표·출처·메타데이터는 보존하고 정확히 세 figure 쌍과 실제 수정일만 바꾼다. 대표 이미지 HTML도 그대로다.
- 새 파일명은 `02-four-workplaces/03-why-hard/05-before-applying-combined-desktop/mobile.webp` 계열이다. 공개 글 URL과 기존 자산 URL은 유지한다.
- 현재 표시는 [manifest.json](manifest.json)의 groups로 관리한다. 기존 original/editorial manifest는 변경하지 않고 active release 조합에서 이번 원고와 새 자산 해시를 추가한다. 그림의 SVG·PNG 원본, WebP와 각각의 해시를 보존한다.
- CSS는 `.facility-overview-figure`에만 적용되는 3개 규칙을 덧붙인다. picture를 block으로 두고 각 이미지의 PC/모바일 비율을 로딩 전에 예약한다. 이전 CSS 사본과 Git blob을 보존하고 `현재 CSS = 이전 CSS + 정해진 규칙`임을 검사한다. 기존 15개 UI fingerprint 목록은 유지하되 해당 CSS의 현재 승인 blob만 active release에서 가져온다.
- 공용 원본 렌더러·픽토그램, 다른 게시글, 기존 이미지 템플릿은 바꾸지 않는다. 4·6개 템플릿과 같은 데이터를 재사용하고 각 분할본의 모든 카드 필드를 순서대로 대조한다.

## 구현·검증

- 생성: `node scripts/generate-hobyeongbaekma-integrated-images.mjs`
- 독립 이미지 검토본: `node scripts/preview-hobyeongbaekma-integrated-images.mjs`, [episode00-integrated-images-review.html](episode00-integrated-images-review.html)
- 직접 검사한 새 내용: 업무 부담 4조건의 PC PNG. 나머지 시설 4개/지원 6개는 직전 템플릿의 같은 카드·SVG·렌더링을 재사용하며 실제 페이지 선택/비율은 다시 검사한다.
- 전용 로컬 테스트 6개 PASS: 세 쌍만 변경, 본문/표/링크/hero 보존, 원본 카드 필드·순서 보존, SVG/PNG/WebP 해시, CSS 범위와 비율, 잘못된 원본 입력 차단.
- `check-hobyeongbaekma-publication.mjs`는 대표+3장·picture 3개·데스크톱/모바일 파일 해시·수정일·기존 공개 메타데이터와 내부링크를 검사한다.
- 실제 페이지 브라우저 QA는 320/390/768/1440px에서 전체 항목 한 장 선택·자연 치수·종횡비·가로 넘침·목차·표·런타임 오류를 검사한다. 새 이미지 응답을 잠시 보류한 상태에서도 높이가 예약되고 decode 후 1px 이상 높이가 뛰지 않는지 확인한다. 실제 삽입폭에서 필수 세부 글씨 12px 이상도 확인한다.
- 로컬 Chromium의 socket 제한은 이전과 같아 브라우저 검증은 PR의 CI에서 수행한다. Build·SEO·기존 시설 공개/비공개 회귀·0화 실제 화면 QA 결과는 해당 HEAD/실행 링크로 구분한다. 템플릿만의 과거 PASS를 실제 페이지 PASS로 확대하지 않는다.

## 실제 페이지 체크포인트와 기존 산출물 보호

적용 HEAD `d3bfd4058cf80ecab9eadf118d5113a5d546ac4c`의 [0화 실제 페이지 QA 42478116631](https://github.com/syjy813/getpasslab/actions/runs/42478116631), [Build·SEO 42478116582](https://github.com/syjy813/getpasslab/actions/runs/42478116582), [템플릿 QA 42478116646](https://github.com/syjy813/getpasslab/actions/runs/42478116646)는 성공했다. 0화의 실제 네 화면에서 pre-load 비율·decode 후 높이·4개 img/3개 picture·본문·목차·표를 확인했다.

기존 시설 회귀는 과거 고정 CSS 파일명 `FacilityCard.hoVVeo0t.css` 참조로 실패했다. 과거 `css-bundle.json`이나 public baseline을 수정하지 않고, 새 content-hash CSS에서 이번 세 규칙을 정확히 한 번 제거한 바이트가 **이전 compiled CSS SHA-256과 완전히 일치**하는지 검증하도록 연결했다. 산출물 inventory에는 정확히 6개 새 WebP만 추가하고 기존 자산·경로는 유지한다. 최종 HEAD의 시설 회귀 실행 결과를 확인한다.

이 후속 검사기 수정은 공개 원고/CSS/이미지/마스터를 바꾸지 않는다. 위 실제 페이지 성공은 동일 표시 대상에 재사용할 수 있으며 검사기 변경의 성공 여부는 최종 CI와 구분한다.

## 현재 상태와 다음 행동

원고·자산 교체는 별도 PR 브랜치에 구현했다. main 병합·Production 배포는 수행하지 않았다. 실제 빌드·QA 실행은 PR #263을 확인한다. 실서버 배포 요청 후 병합/배포하고 실제 0화의 4개 표시 이미지와 각 화면의 파일 선택을 확인한다.

# 시설 초기 5편 공개 설정 검수

기준: `c013e4f9c791f8e865c15db9ca1ae74e1b544f10`, `codex/facility-launch-20261031`, [Draft PR222](https://github.com/syjy813/getpasslab/pull/222). 사용자 self-canonical 방침 수용 후 후속 작업 승인에 따른 공개 설정·검증이다. main 병합·Production 배포·실서버 QA를 수행한 기록이 아니다.

## 공개 후보와 보호 범위

| 번호 | 고정 주소 | 상태 / 발행 예정일 | 본문 이미지 |
|---|---|---|---|
| 01 | /facility-management/career/what-is-facility-management/ | published / 2026-11-03 | 4 |
| 02 | /facility-management/career/first-job/ | published / 2026-11-03 | 4 |
| 03 | /facility-management/career/employment-types/ | published / 2026-11-03 | 5 |
| 04 | /facility-management/career/shifts-and-pay/ | published / 2026-11-03 | 5 |
| 05 | /facility-management/jobs/public-sector-comparison/ | published / 2026-11-03 | 4 |

- 업데이트·자료 확인일도2026-11-03. 배포가 다른 날로 미뤄지면 실제 날짜를 배포 전에 다시 맞춘다. 현재 소스의 published는 공개 후보 빌드 설정이며 실서버 게시 완료를 뜻하지 않는다.
- 미승인 `reading-job-postings` 예시 초안은 일반·검토 빌드 모두 제외. 6~15편은 이번 공개 필수 대상이 아니며 반영하지 않음. 초기 홈5편,진로4편,채용1편만 노출. 실무·자격/선임 빈 카테고리는 noindex/follow·사이트맵 제외.
- 05의 공개 출처/본문에서 파일 형식 표현을 '채용 공고문' 등으로 정리. 공개 문구 검사의 PDF 금칙어를 우회하는 예외를 추가하지 않았으며 URL·모집/급여/계약 사실은 유지.
- 원본WebP24개 보존,본문22개만 일반·검토 빌드에 복사. 01-04/05-03은 원본을 삭제하지 않고 배포 산출물에서 제외. 이미지 경로·slug·category·관련 글·기출 ID 보호. CSS 및 공통 JS 변경 없음.
- 기존 사실 검수/이미지 판정은 [factcheck-and-images-20261103.md](../2026-10-31-facility-launch/factcheck-and-images-20261103.md), 병행 발행 방침은 [정본](../../standards/facility-search-publication-policy.md). 새로운 법령·채용 조건을 추가하는 작업은 아님.

## 검증 방법과 실제 정적 결과

1. 변경 전 일반 빌드를 재생성하고 기존 native guard1473파일 PASS 이후 전체 대상 파일을 별도 보존. 현재 빌드와 전체 인벤토리를 비교했다. 차이는 [delta.json](delta.json)의 11개 수정과 상세HTML5개 추가뿐이며 삭제0개. 기존 자격증 HTML·문제 데이터·공개 파일 및 컴파일 JS/CSS11개는 바이트 동일하다.
2. 현재 보호 manifest는 그 승인된 차이만 반영하고 선행 사이트맵 바이트로의 역변환을 재확인했다. 과거 격리 회귀 스냅샷·beforeInventory·priorBundles·원본24개 해시는 유지했다. 임의 바이트 변경이 과거 기준으로 복원되지 않는 부정 검사도 native에서 유지한다.
3. 일반 빌드565페이지/567HTML·사이트맵563URL·SEO 오류0/기존 경고1(소방 기존 description161자). native1478파일 PASS. 시설 내부 링크77개,승인5편만 노출,각 H1·self-canonical·og:url·공유 이미지·공개 robots·Article의 URL/작성일/수정일/출처·화면3날짜·사이트맵·빈 카테고리 및 미승인 초안 제외 PASS.
4. 검토 빌드도565페이지/567HTML,시설 전체 noindex/nofollow·사이트맵 제외·Article 제외,시설 링크77개 PASS. 사이트맵555URL(색인 대상554페이지+사이트맵 index URL1),SEO 오류0/기존 경고1,공개 문구 오류0. noindex는 접근 제한 기능이 아니므로 검토 산출물은 공개 배포하지 않는다.
5. 일반 공개 문구·명암·컴활 출판/C1·문제 지연 표시·즉시 풀이6표본·전체 챕터 연결·3자격증 정적 문제 endpoint 검사 PASS. 현 WEB 정적 실행 결과와 PR의 새 head Checks를 별도로 구분한다.

## 브라우저와 CI

- `Facility publication QA`는 publication/private-preview 두 모드로 Build·정적 공개 검사·SEO·공개 문구 검사 후 Chromium을 실행한다. 각 모드12페이지×320/390/768/1440px=48조건. 대상: 홈·4카테고리·5상세·자격증 홈·컴활 대표 챕터.
- overflow·H1·서비스 GNB 전환 실제 클릭·현재 메뉴·발행일·출처·이미지22개 로딩/alt/폭·미승인 초안404·기존 자격증 breakpoint 동작을 검사한다. 320/390px의 각 이미지와4폭 홈/진로/면접 상세 캡처 및 results.json을 모드별 artifact로 남긴다.
- 현 WEB 실행기의 Chromium은 실행 비트 복구 후에도 SIGSEGV로 종료되어 화면 검사를 수행하지 못했다. 브라우저 PASS는 새 head의 GitHub Actions 실제 결과와 artifact를 확인한 뒤 보고한다. 이전 c013e4f의8개 CI 성공은 이전 초안 상태의 검증이므로 새 공개 상태 PASS로 대체하지 않는다.
- 실물 기기·Safari·글꼴 확대·실제 광고 수신·SNS별 OG 수집·LCP/CLS 수치는 미검증. 이미지 원본의 작은 글씨를 모두 읽기 쉽다고 새로 판정한 작업이 아니며 핵심은 본문 HTML로도 제공한다.

## 남은 승인 경계

최종 새 head CI 확인 → 사용자 별도 main 병합·Production 배포 승인 → 실제 배포 및 실서버 확인. 실제 Google 선택 canonical·색인·검색 유입은 아직 확인하지 않았다. 이용자 게시판·댓글은 이번 범위가 아니다.

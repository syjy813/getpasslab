# 시설 초기 콘텐츠 병행 발행·대표 URL 검토

2026-11-03(KST). 사용자 '다음 작업' 승인에 따라 437a99c 기준 PR222에서 수행했다. 실제 티스토리 두 원문을 조회하고,GetPassLab의 두 초안·canonical 구현·발행 조건과 대조했다.

## 결정

[시설 콘텐츠 검색·병행 발행 방침](../../standards/facility-search-publication-policy.md)을 초기 1~5편의 운영 결정으로 사용한다. 티스토리는 기존 진로·기관 탐색 글을 유지하고 GetPassLab은 면접 조건 확인·공고 해석 실습으로 사용 가치를 구체화한다. 양쪽 주제의 중첩이 남음을 인정하며 검색엔진의 별도 색인 보장으로 표현하지 않는다.

| 대상 | 실제 대조 결과 | 반영 |
|---|---|---|
| 티스토리 첫 취업(2026.10.11.) | 기계설비 경력,선임,경력서류,설비 경험,교육 및 면접 질문을 다룸. 새 글과 첫 직장 선택이라는 큰 질문이 겹침 | GetPassLab02를 첫 면접의 다섯 질문과 조건 확인에 집중. 단순 제목 변경에 그치지 않고 공고/면접 답변/확인 자료의 가상 기록 예시를 추가 |
| 티스토리 공공기관 비교(2026.10.15.) | 기관별 지원 경로·급여/정년/자격 비교가 중심. 새 글과 공공부문 취업·급여 범위가 겹침 | GetPassLab05의 공고 읽기 목적 유지. 앞서 대조한 회사 명의 PDF1/3쪽으로 전체156명→사업소37명→시설관리31명의 범위와 근무·급여·계약·시점을 기록하는 실습 보강 |

주제 일부와 기존 이미지가 같다는 사실을 숨기거나,단어 치환·문장 유사도 수치만으로 독창성/SEO 합격을 판정하지 않았다. 티스토리 본문의 법령·수치를 이번에 최신 검증하거나 그 내용을 GetPassLab의 사실 출처로 재사용하지 않았다.

## 원문 조회 및 출처

- [티스토리 첫 취업](https://achromatic-chameleon.tistory.com/entry/시설관리-첫-취업｜아무-곳이나-가면-안-되는-이유):공개 본문·소제목·면접 질문을 읽음. HTTP조회200,head의 canonical은 해당 티스토리 원문 URL.
- [티스토리 공공기관 비교](https://achromatic-chameleon.tistory.com/entry/공공기관-시설관리-취업-총정리｜급여·자격증·정년-비교):직접 open 첫 시도는 실패했으나 첫 글의 실제 관련 글 링크에서 본문을 읽음. HTTP조회200,head의 canonical은 해당 티스토리 원문 URL.
- [Google 대표 URL 선택](https://developers.google.com/search/docs/crawling-indexing/canonicalization):주내용이 유사하면 대표 문서로 묶을 수 있고,지정한 canonical과 다른 URL을 선택할 수 있음을 확인.
- [Google 대표 URL 지정](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls):canonical·내부 링크·사이트맵을 같은 공개 URL에 맞추는 원칙 확인. robots/noindex를 대표 URL 선정 수단으로 혼동하지 않음.

## 구현한 변경

- `first-job.md`:제목을 '시설관리 첫 면접 질문 5가지｜업무·급여·교육 확인표'로 변경. description·summary·도입을 면접 질문 중심으로 조정하고,가상의 공고/면접 답변/확인 자료3행 표로 실제 사용법을 보강. 경력신고·선임의 제한조건과 공식 sources 유지.
- `public-sector-comparison.md`:제목과 sources·수치를 유지하고,회사 명의 과거 공고 기록5행 표 추가. 전체/사업소/시설관리 인원,근무표별 금액·별도 항목·평가 전환·접수/입사 예정일을 함께 읽도록 함. 사실 출처는 [직전 사실 검수](factcheck-and-images-20261103.md)의 S13이며 새로운 모집 사실이나 법적 판단을 만들지 않음.
- 통합 가이드v1.4 §7에서 검색·병행 발행 운영 문서로 연결. 기존 정본의 집필·이미지 규칙을 복제하거나 대체하지 않음.
- content-review와AI_HANDOVER에 현재 결정을 연결해 이전의 '대표 URL 미결정' 상태를 갱신.
- native review manifest의 현행 두 원고 해시만 갱신. 승인된 그림·CSS·Astro 레이아웃·URL·출처·관련 글·문제·광고 변경 없음.

## canonical 적용 범위

공개 시 예상 주소:

| 글 | GetPassLab의 대표 주소 |
|---|---|
| 02 | https://getpasslab.co.kr/facility-management/career/first-job/ |
| 05 | https://getpasslab.co.kr/facility-management/jobs/public-sector-comparison/ |

기존 `BaseLayout.astro`의 `Astro.url.pathname` + 사이트 origin으로 canonical과og:url을 재사용한다. 새 cross-domain canonical 필드·리다이렉트·Tistory용 noindex를 추가하지 않았다. 두 원문에 대한 티스토리 편집·색인 설정 변경은 수행하지 않았다.

**초안 비공개와 공개 시 대표 URL은 별개다.** 두 글의 draft·publishedAt·updatedAt·reviewedAt·category·sources·related·certifications는 보존한다. 일반 빌드의 초안 상세/에셋 제외와,검토용의 noindex/nofollow·사이트맵 제외를 유지한다. 검토 HTML의 canonical이 GetPassLab을 가리킨다고 실제 색인 또는 발행 승인이 된 것은 아니다.

## 검증과 남은 단계

검증 결과는 아래 실행 기록과 최종 커밋의 CI에서 확인한다. 실제 발행 상태를 변경하거나 main 병합·Production 배포를 하지 않는다. 오픈 후 실제 Google 선택 canonical·색인·유입은 미확인이고,자동 추적 작업을 생성하지 않았다.

다음 단계는 공개 대상·실제 발행일 확정 및 **공개 상태의** sitemap/robots/Article/관련 글·UI QA다. 티스토리 원문 변경을 오픈의 필수 선행조건으로 두지 않는다. 기존 글을 통째로 옮기거나 공개 URL을 바꾸려면 이번 병행 운영 결정과 구분하여 별도 승인안을 준비한다.

### WEB 실행 결과

- 일반 빌드560페이지/HTML562,1,473파일 native 보호 PASS. 초안 글·이미지 비공개 검사 PASS,SEO 오류0/기존 경고1,공개 콘텐츠 오류0.
- 미리보기 빌드565페이지/HTML567,내부 링크44개 PASS,SEO 오류0/기존 경고1.
- 다섯 상세의 canonical각1개가 자기 공개 주소와 일치하고 og:url 동일,robots는noindex/nofollow,H1각1개 확인. 검토용 시설 URL은 사이트맵에서 제외됨.
- 두 원고의category/status/publishedAt/updatedAt/reviewedAt/sources/related/certifications와 이미지 참조 목록은 이전 커밋과 동일. 기존 공식 수치를 이용한 실습만 추가.
- git diff --check PASS. 새 head의 브라우저·회귀 CI 결과는 GitHub Checks에서 별도로 확인하며 실제 색인·배포 결과로 해석하지 않음.

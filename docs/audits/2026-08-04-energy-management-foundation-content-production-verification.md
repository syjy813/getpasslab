# 에너지관리기능사 기반·핵심요약 production 검증

- 검증일: 2026-08-04
- 작업 시작 `main`: `661ae46a80ccf9320fcd16a27eb38f0f665338ee`
- 최종 콘텐츠 `main`: `ebd35c37da892e676abd25f85beaecb0fd84f076`
- 결과: 다자격증 라우팅 기반과 에너지관리기능사 필기 핵심요약 12개 production 공개
- 신규 의존성·기존 동결 키·production 설정 변경: 없음
- 콘텐츠 스키마: 기존 데이터와 호환되는 기본값 포함 `cert_id`·`exam` 필드 확장

## 1. 공식 범위 확인

Q-Net 에너지관리기능사 종목 정보와 2026년 1월 1일~2028년 12월 31일 출제기준을 직접 확인했다.

- 필기 과목: `열설비 설치, 운전 및 관리`
- 시험 방식: 객관식 4지 택일형, 60문항, 60분
- 합격 기준: 100점 만점에 60점 이상
- 출제기준의 필기 주요 항목: 12개

구현한 12개 챕터는 출제기준의 다음 주요 항목에 일대일로 대응한다.

1. 보일러 설비 운영
2. 보일러 부대설비 설치 및 관리
3. 보일러 부속설비 설치 및 관리
4. 보일러 안전장치 정비
5. 보일러 열효율 및 정산
6. 보일러설비설치
7. 보일러 제어설비 설치
8. 보일러 배관설비 설치 및 관리
9. 보일러 운전
10. 보일러 수질 관리
11. 보일러 안전관리
12. 에너지 관계법규

공식 확인 경로:

- [Q-Net 에너지관리기능사 종목 정보](https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=7761)
- [Q-Net 시험정보](https://www.q-net.or.kr/crf005.do?gId=&gSite=Q&id=crf00503s02&jmCd=7761&jmInfoDivCcd=B0)
- [Q-Net 2026~2028 출제기준](https://www.q-net.or.kr/pageLink.do?link=cst/cstReport&jmCd=7761&mcrtrNo=1023)

## 2. 다자격증 기반

PR #49 `자격증별 콘텐츠 라우팅 기반 일반화`에서 산업안전기사에 고정된 정적 라우팅과 콘텐츠 조회를 자격증·시험·과목 범위로 일반화했다.

- 자격증·시험·과목 설정 레지스트리 추가
- 정적 라우트를 `[cert]/[exam]/[subject]/[slug]` 구조로 일반화
- 챕터·기출·관련 챕터 조회를 자격증 범위로 격리
- 홈페이지·GNB·Footer·개발용 관리 화면을 다자격증 구조로 확장
- 기존 산업안전기사 데이터에는 `cert_id: industrial-safety`, `exam: written` 스키마 기본값을 적용해 원문 대량 수정 없이 호환성 유지
- 기존 산업안전기사 공개 URL, canonical과 제목 유지

작업 커밋은 `fb50eee6ee98d6594df13ffe0000e414e83b1c5f`, Squash merge는 `24e485292b8be44f526699dfbf35ee4625f2526a`다.

## 3. 에너지관리기능사 콘텐츠

PR #50 `에너지관리기능사 필기 핵심요약 12개 추가`에서 다음 공개 범위를 추가했다.

- 자격증 slug: `energy-management`
- 시험 slug: `written`
- 과목 slug: `thermal-equipment`
- 과목명: `열설비 설치·운전 및 관리`
- 신규 완료 챕터: 12개

콘텐츠는 열·증기·보일러 기초, 부대·부속설비, 안전장치, 효율·열정산, 연소·통풍, 자동제어, 배관·보온, 운전·정비, 수질관리, 작업안전, 관계법규를 다룬다.

에너지관리기능사 기출 원본은 이번 범위에 포함되지 않았다. 신규 12개 챕터의 `questions`는 모두 빈 배열이며 기존 `questions.json`은 변경하지 않았다.

법규 챕터는 다음 현행 공식 원문과 2026년 검사제도 개정 안내를 구분해 반영했다.

- [에너지법](https://www.law.go.kr/lsInfoP.do?lsId=010164)
- [에너지이용 합리화법](https://www.law.go.kr/LSW/lsInfoP.do?lsId=001867&urlMode=lsInfoP)
- [에너지이용 합리화법 시행규칙](https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=286485)
- [기계설비법](https://www.law.go.kr/LSW/lsInfoP.do?eventGubun=060125&lsiSeq=219239)
- [한국에너지공단 열사용기자재 검사제도 개정 운영 안내](https://www.energy.or.kr/front/board/View2.do?boardMngNo=2&boardNo=24574)

작업 커밋은 rebase 전 `234e1e43c855a7cf023a5638e3896104200e07c1`, 최종 PR HEAD `e92772587d1e37ee1a362b57779922635beef03b`, Squash merge는 `ebd35c37da892e676abd25f85beaecb0fd84f076`이다.

## 4. 검증 결과

- `git diff --check`: 성공
- `questions.json` JSON parse: 성공
- 전체 문제: 1,680개
- 문제 ID 중복: 0건
- 전체 챕터: 262개
- 완료 챕터: 228개
- 미시작 챕터: 34개
- 에너지관리기능사 완료 챕터: 12개
- 에너지관리기능사 기출 관계: 0건
- 존재하지 않는 문항 관계: 0건
- 챕터 내부 관계 중복: 0건
- 존재하지 않는 동일 자격증 related slug: 0건
- 기존 `questions.json`·산업안전기사 챕터: 변경 없음
- `npm ci`: 성공
- `npm run build`: 242페이지 성공
- `npm run check:seo`: HTML 242개, sitemap URL 243개, 경고 0개, 오류 0개
- `npm run check:public-content`: HTML 242개, 오류 0개

초기 빌드에서 일부 신규 챕터가 기존 단일 분류 태그 스키마를 위반한 문제를 발견했다. 기존 스키마에 맞는 단일 분류 태그로 수정한 뒤 전체 검증을 다시 실행해 최종 오류 0건을 확인했다.

## 5. PR·CI·병합

| 작업 | PR | 최종 HEAD | SEO validation | Squash merge |
|---|---:|---|---:|---|
| 다자격증 라우팅 기반 | #49 | `fb50eee6ee98d6594df13ffe0000e414e83b1c5f` | `30909570504` (#179) 성공 | `24e485292b8be44f526699dfbf35ee4625f2526a` |
| 에너지관리기능사 12개 | #50 | `e92772587d1e37ee1a362b57779922635beef03b` | `30911082018` (#180) 성공 | `ebd35c37da892e676abd25f85beaecb0fd84f076` |

두 PR 모두 최종 diff, 수용 조건과 검증 결과를 기술 검토해 PASS로 판정한 뒤 Owner 승인에 따라 Squash merge했다. 작성자 계정의 자체 승인을 GitHub review 객체로 만들지는 않았다.

PR #49 병합 뒤 #50의 base를 `main`으로 변경하자 Squash merge ancestry 차이 때문에 기반 변경까지 중복 표시됐다. #50의 콘텐츠 커밋만 새 `main` 위에 rebase하고 `--force-with-lease`로 승인된 작업 브랜치를 갱신했다. 최종 PR은 14개 파일, 818줄 추가만 포함했고 `mergeable=true`와 새 pull-request CI 성공을 확인했다.

## 6. GitHub Pages·production

- Pages run: `30911145877`, `completed / success`
- 배포 커밋: `ebd35c37da892e676abd25f85beaecb0fd84f076`
- `https://getpasslab.co.kr/energy-management/`: HTTP 200, 본문·canonical 확인
- `https://getpasslab.co.kr/energy-management/written/`: HTTP 200, 본문·canonical 확인
- `https://getpasslab.co.kr/energy-management/written/thermal-equipment/`: HTTP 200, 본문·canonical 확인
- `boiler-operation-basics`: HTTP 200, 제목·본문·canonical 확인
- `energy-laws-and-inspection`: HTTP 200, 2026년 5월 28일 개정 주의·canonical 확인
- 산업안전기사 `leakage-breaker-types`: HTTP 200, 기존 제목·본문·canonical 확인
- `sitemap-index.xml`, `sitemap-0.xml`: HTTP 200
- 에너지관리기능사 허브와 대표 법규 챕터의 sitemap 등재 확인

## 7. 남은 위험

- 에너지관리기능사 기출 원본·정답은 아직 확보·검증되지 않았다. 기출 데이터와 챕터 관계는 원본 확보 뒤 별도 게이트로 추가한다.
- 기존 산업안전기사 기출문제·이미지의 상용 이용 권리 위험은 해소되지 않았다.
- 법령·검사제도 콘텐츠는 2026-08-04 확인 기준이다. 실제 적용에는 최신 법령, 기기 조건, 용량, 예외와 한국에너지공단 안내를 다시 확인한다.
- `npm ci`의 `esbuild@0.28.1` 설치 스크립트 allowlist 안내는 남아 있으나 clean install, build, PR CI와 Pages 배포는 성공했다.
- AdSense 승인·광고 송출, Search Console 처리와 GA4 실시간 이벤트는 외부 계정 증거로 별도 확인한다.

이번 에너지관리기능사 기반·핵심요약 production 게이트는 **VERIFIED**다.

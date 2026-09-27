# C1 웹 초안 로컬 반영·검증

작업일: 2026-09-25 · 승인 범위: 로컬 반영·검증까지

## 후속 주의 기출 안내 — 2026-09-27 정리

- 2026-09-26 구현·검증 완료 · 주의 4문항을 사용하는 6곳에 문제별 안내 적용
- ‘풀이 주의’ 표시와 ‘수록 답안’ 구별 · 답안 확인 시 쟁점 설명 표시, 다시 열면 초기화
- 14:27 KST Build 성공 · C1·기존 컴활·SEO·공개 콘텐츠·지연 기출 검사 통과
- 모바일 390×844px 주의 6곳 및 일반 컴활·에너지 기출 동작 확인
- 원문·정답·그림·배정 보존 · 공식 정정 여부 미확인 상태 유지 · commit·Push·Deploy·Production 반영 없음
- 상세 구현·문항별 QA: [CAUTION_UI_REVIEW.md](./CAUTION_UI_REVIEW.md)

## 후속 콘텐츠 검수 — 2026-09-26

27개 본문과 주 기출 63문항·보조 연결 41건의 풀이 근거를 전수 검토하고 8개 파일의 설명·안내를 보완

- 주 기출: 본문 근거 충분 54개 / 기출의 단위·용어 조건부 6개 / 원문 타당성 주의 3개
- 보조 연결: 자체 정답 판단 15건 / 일부 판단 23건 / 원문 주의 승계 3건
- 원문 주의: 컴퓨터 역사 20160305_012, Unicode 20190831_010, SATA 20190831_012 · 보조 키보드 부팅 20150307_019도 조건부
- 근거·원문 주의·출처·수정 내용: [CONTENT_REVIEW.md](./CONTENT_REVIEW.md)
- 파일별 검수 해시와 104건 판단: [content-review.json](./content-review.json)
- 이번 수정본의 모바일 측정: [content-review-mobile-qa.json](./content-review-mobile-qa.json)

### 최종 검증

- 2026-09-26 13:59 KST Build 성공: 295페이지 · 이전 청크 크기 경고 유지
- C1 원문 해시·배정·렌더링 검사, 기존 컴활 회귀 검사, SEO, 공개 콘텐츠, 기존 지연 기출 검사 통과
- SEO: HTML 297개·sitemap 296 URL, 경고 0·오류 0 · 공개 콘텐츠 오류 0
- 수정한 8개 챕터의 모바일 390×844px 본문·보조 안내가 최신 내용으로 표시되며 페이지 가로 넘침 없음
- 기존 27개 화면·그림 팝업 QA는 아래 최초 반영 기록 참조 · 이번에는 변경된 문구 범위를 재검증
- 문항별 검토 완료와 원문 타당성 전부 승인은 구별 · 주의 문항의 공식 채점 근거는 미확보 상태로 유지
- 원문·정답·그림·배정은 변경하지 않음 · commit·Push·Deploy·Production 반영 없음

## 결과

- 통합 집필 순서 1~27, C1 「컴퓨터의 구성과 동작」 27개 모두 반영
- 기존 공개 8개를 포함한 로컬 챕터 수 35개: 컴퓨터일반 31개, 스프레드시트 일반 4개
- 주 기출 63문항, 보조 연결 41건, 중복 제외 70문항
- 원본 기출 그림 2종을 재사용하며 CPU·사양표 본문에도 표시
- 원본 문제·선택지·정답·날짜·회차를 canonical 해시와 대조
- Test 및 Build 완료 · commit·Push·Deploy·Production 반영 없음

로컬 확인: http://127.0.0.1:4321/computer-literacy/written/computer-basics/

## 작업 위치와 보호

- 실제 변경 위치: `C:/Users/Guns/.codex/.chatgpt-projects/g-p-6aaa09b04f6481918872af245bf16eb6/work/c1-local`
- branch: `codex/c1-local`
- 기준 HEAD: `6a35d7f76703b5b121502c599d7eaf134ca99e28` · PR #82 병합 후 main
- 원본 저장소: `C:/Users/Guns/Documents/GitHub/getpasslab`
- 원본 main `c7bfe0bd96f574c5540e110b7ec7fe709d78385a`의 미커밋 작업 유지
- 원본 698개 파일의 작업 전후 SHA-256 일치 확인
- 원본에서 fetch로 원격 추적 정보를 갱신했으며 파일·현재 branch·HEAD는 변경하지 않음
- 별도 worktree에서만 로컬 반영했으므로 원본 main에 pull/reset하여 합치지 않음

## 자료와 재대조

- 사용자가 전달한 웹 초안과 인계서: 이 디렉터리에 원문 그대로 보존
- 현재 통합 목차 및 canonical 데이터가 2026-09-24 추출 자료와 바이트 단위로 일치함을 먼저 확인
- 검증 정본: 원본 저장소의 `2026-09-13-computer-literacy-writing-outline.md`, `src/data/questions/computer-literacy.json`, 이미지 등록부, 기존 문항별 검수 기록
- `source-verification.json`: 목차의 ID·제목·순서·과목·주/보조 배정, 원문 해시, 이미지 해시, 외부 보조 배정의 고정 검수 스냅샷
- 런타임 배정의 원본은 각 챕터 frontmatter이며 검수 스냅샷을 런타임 데이터로 조회하지 않음
- 배포 기준 데이터 52개를 보존하고 필요한 65개 추가 → 로컬 데이터 총 117개
- 기존 레코드의 원문 변경 없음 · 기존 `20200704_018`의 이미지 검수 플래그만 로컬에서 변경

## 본문 편집

- 웹 초안의 학습 본문을 기존 ChapterLayout·QuestionHistory에 연결
- 한 줄 요약은 frontmatter summary로 이동하고 같은 서론 중복 제거
- 반복 정의·비교표·마지막 요약을 축약하며 정답을 가르는 조건은 보존
- 명사형·~함·~임 및 문장 끝 마침표 생략 유지 · 원본 기출은 수정하지 않음
- 편집 메모·주 기출 적용 검토표·시각 자료 제작 메모·내부 ID는 학습 본문에서 제외
- 기출 그림의 내용을 다시 옮긴 사양표 대신 원본 그림과 ㉠~㉣ 설명 사용
- USB는 색상이 절대 규칙이 아니라는 설명에 더해 파란색이 USB 3.0 Standard-A의 권장 색이라는 직접 판단 근거 보완
- ADD-17은 학습 예시와 호환 조건만 유지 · 기출이나 출제 빈도를 새로 만들지 않음

## 구현 사항

- `chapter_id`: 통합 목차 감사용 ID 보존 · 기존 URL 키와 구분
- 신규 27개 slug: 기존 영문 소문자 kebab-case 규칙 적용 · 기존 slug와 충돌 없음
- 기존 컴퓨터일반 4개 챕터의 표시 순서를 통합 목차 38·39·40·43에 맞춤 · ID·제목·기출·본문은 유지
- 보조 문제의 연결 챕터가 아직 없는 경우 `chapter`를 생략하고 적용 범위만 표시
- 없는 링크를 만들지 않으며 명시된 연결 slug가 틀리거나 주 배정과 맞지 않으면 Build 오류 유지
- 보조 41건은 주 기출·빈도 집계에 넣지 않음
- 허브의 고정 ‘8개’ 문구 제거 · 현재 챕터 수는 기존 목록 집계가 표시
- 챕터 본문의 반복 공개 안내 배너는 다시 추가하지 않음
- 일반 Markdown 본문 이미지에 반응형 너비 적용 · 새 프레임워크·의존성 없음

## 이미지 검수

| question_id | 직접 확인한 단서 | 연결 정답 |
|---|---|---|
| 20151017_012 | (ㄱ)에 ALU·누산기, (ㄴ)에 명령·번지 레지스터 | ① |
| 20200704_018 | ㉠ Core i5, ㉡ UHD Graphics 620, ㉢ 16GB DDR4 RAM, ㉣ SSD 256GB | ④ |

현재 등록 PNG를 직접 열어 위 단서와 canonical 선택지·정답을 대조했으며 새 그림을 추정하거나 생성하지 않음

원본 560문항 데이터의 `review="jpg 확필"`는 그대로 보존
로컬 구현 데이터의 두 문항만 이미지 확인 후 `review=""`로 변경하여 기존 공개 필터에 연결
이는 해당 등록 그림의 확인 기록이며 원출제기관 정정 여부를 새로 확인했다는 의미는 아님

## 보존한 쟁점과 범위 제한

- **GB/GiB:** 연결된 과거 기출의 1024³ Byte 관례와 현재 SI/IEC 표기 구별
- **Unicode:** 20190831_010의 제시 정답 ④ 유지 · 현재 Unicode를 항상 16비트라고 설명하지 않음
- **SATA:** 20190831_012의 제시 정답 ① 유지 · ③ Master/Slave 문구의 호환 환경과 공식 채점 쟁점 미해결 상태 유지 · 공식 복수정답이라고 단정하지 않음
- **부팅:** 20150307_019는 BIOS 역할에만 보조 적용 · 키보드 오류의 부팅 영향은 BIOS 설정에 따라 다름
- **컴퓨터 발전:** 파스칼의 덧셈·뺄셈과 반복 연산을 구별 · EDSAC·UNIVAC의 기출 ‘최초’를 무조건적인 세계 최초로 일반화하지 않음
- **미작성 주 챕터:** 전자우편·멀티미디어·패치·RAM 부족 조치·부팅 실패·운영체제 성능에 속한 보조 문항 7개는 적용 범위만 표시 · 배정 이동 없음

### 이번 확인에 사용한 1차 자료

- [Unicode Consortium UTF FAQ](https://www.unicode.org/faq/utf_bom.html): 코드 포인트와 UTF-16 코드 단위 구별
- [NIST 이진 접두어](https://pml.nist.gov/cuu/Units/binary.html): GB/GiB 구별
- [USB-IF Compliance Updates](https://compliance.usb.org/index.asp?Format=Standard&UpdateFile=USB3): USB 3.0 A 커넥터의 파란색 권장
- [Cambridge EDSAC 역사](https://www.cl.cam.ac.uk/relics/history.html): 실용 프로그램 내장 컴퓨터의 범위
- [미국 Census Bureau Hollerith 기록](https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html): 천공카드·인구조사
- [미국 Census Bureau UNIVAC I 기록](https://www.census.gov/about/history/bureau-history/census-innovations/technology/univac-i.html): 초기 상업용 컴퓨터
- [Science Museum Group 계산기 소장 기록](https://collection.sciencemuseumgroup.org.uk/objects/co59811): 파스칼 방식의 덧셈·뺄셈

SATA와 BIOS의 조건부 판단은 원본 저장소의 `2026-09-11-computer-literacy-prewriting-fact-check.md` 기록 승계
SATA 제조사 링크의 이번 재조회는 실패했으며 이를 새 외부 재검증 완료로 표시하지 않음

## Test·Build·QA

- `npm run check:computer-literacy-c1`: 27개 ID·제목·순서·배정, 70개 원문 해시, 104개 주/보조 문제 팝업과 정답·그림·링크 검사 통과
- `npm run check:computer-literacy`: 기존 8개 챕터·14개 주 기출·3개 보조 연결·기존 그림 검사 통과
- `npm run check:seo`: HTML 297개, sitemap URL 296개 · 경고 0·오류 0
- `npm run check:public-content`: 오류 0
- `npm run check:deferred-question-content`: 기존 에너지·산업안전 기출 동작 구조 검사 통과
- `npm run build`: 2026-09-25 00:40 KST, 295페이지 생성 성공 · 기존 500kB 청크 경고 유지
- 390×844px: 27개 챕터 초기 진입 시 본문·표·그림의 페이지 가로 넘침 없음 · `mobile-qa.json`
- CPU·사양표 이미지 문제: 열기 → 정답 확인 → 닫기 직접 확인
- 보조 설명 링크 → 사양표 챕터, 하단 다음 링크 → 업그레이드 챕터 이동 확인
- ADD-17 기출 미배정 표시 확인 · 0회 출제 수치 생성 없음
- 문제의 원문과 정답 표시는 자동 검사, 대표 팝업의 상호작용은 브라우저 확인 · 실제 수험생의 정답률이나 휴대폰 기기 실측 시험은 수행하지 않음

### QA에서 발견한 점

- 본문 원본 그림의 고정 너비 때문에 모바일 가로 넘침 발생 → 반응형 이미지 너비 수정 후 27개 재확인
- 데스크톱에서 광고가 로드된 상태로 강제로 모바일 너비로 바꾸면 기존 광고 mount 너비가 남는 현상 관찰 · 처음부터 모바일 너비로 로드하면 정상 · 이번 콘텐츠 수정과 별개로 광고 반응형 전환의 후속 점검 대상
- 브라우저 도구의 일반 링크 클릭이 이동을 수행하지 않는 경우 실제 화면 좌표 클릭으로 이동 확인 · 앱 링크 자체는 정상

## 다음 단계

1. Owner가 로컬 목차에서 C1 화면·표현 검토
2. 실서버 공개 요청이 있을 때 현재 main과 차이 재확인, 이 worktree 변경만 commit·PR·배포 단계로 진행
3. 다음 웹 집필 입력 범위는 통합 순서 28 이후이며 이번 C1 작업으로 배정을 재설계하지 않음

아래 URL 매핑은 로컬 구현 결과이며 아직 Production URL 생성·배포를 뜻하지 않음


## 식별자와 로컬 URL

| 순서 | 식별자 | 제목 | slug | 주/보조 |
|---|---|---|---|---|
| 1 | P1-15a | 컴퓨터를 분류하는 기준 | `computer-classification` | 5/0 |
| 2 | P1-42a | 웨어러블 컴퓨터의 착용과 입력 방식 | `wearable-computers` | 2/0 |
| 3 | P1-15b | 컴퓨터 발전의 주요 전환 | `computer-development` | 1/0 |
| 4 | P1-16a-01 | 비트·바이트와 자료 구성 단위 | `bits-bytes-data-units` | 4/0 |
| 5 | P1-16a-02 | 저장 용량 환산하기 | `storage-capacity-conversion` | 2/0 |
| 6 | P1-31-01 | ASCII·EBCDIC·Unicode의 문자 표현 | `character-codes` | 5/2 |
| 7 | P1-31-02 | 패리티 비트로 오류 검출하기 | `parity-bit` | 1/4 |
| 8 | P1-17-01 | CPU의 연산·제어 기능 | `cpu-operations-control` | 4/1 |
| 9 | P1-17-02 | 레지스터에 저장하는 정보 | `cpu-registers` | 5/2 |
| 10 | P1-18a | RAM·ROM·플래시 메모리 비교 | `ram-rom-flash` | 6/10 |
| 11 | P1-19 | HDD·SSD·광학 저장장치 비교 | `storage-devices` | 4/3 |
| 12 | P1-18b-01 | 기억장치의 위치와 속도 순서 | `memory-speed-hierarchy` | 1/3 |
| 13 | P1-18b-02 | 캐시와 버퍼의 임시 저장 목적 | `cache-buffer` | 1/4 |
| 14 | P1-18b-03 | 가상 메모리로 주기억 용량 보완하기 | `virtual-memory` | 3/3 |
| 15 | P1-20a-01 | 정보의 이동 방향으로 입출력장치 구별하기 | `input-output-devices` | 2/1 |
| 16 | P1-20a-02 | 멀티미디어 보드의 처리 역할 | `multimedia-boards` | 1/0 |
| 17 | P1-20a-03 | 프린터의 인쇄 원리 | `printer-principles` | 1/0 |
| 18 | P1-20b-01 | 자동 인식과 전원을 켠 채 연결: PnP·핫 스와핑 | `plug-and-play-hot-swap` | 2/3 |
| 19 | P1-20b-02 | USB의 연결 방식과 규격 | `usb-interface` | 2/0 |
| 20 | P1-20b-03 | SATA의 저장장치 연결 방식 | `sata-interface` | 1/0 |
| 21 | P1-20b-04 | HDMI의 영상·음향 전송 | `hdmi-interface` | 1/0 |
| 22 | P1-46 | 펌웨어와 BIOS의 부팅 역할 | `firmware-bios` | 2/2 |
| 23 | P1-16b-01 | 연산 시간 단위와 빠르기 비교 | `processing-time-units` | 2/0 |
| 24 | P1-16b-02 | 성능 수치의 크기와 비교 방향 | `performance-metrics` | 2/1 |
| 25 | P1-16b-03 | 컴퓨터 사양표에서 장치와 용량 읽기 | `computer-specifications` | 1/0 |
| 26 | ADD-17 | 부품 업그레이드의 목적과 호환 조건 | `pc-upgrade-compatibility` | 0/0 |
| 27 | P1-15c | 일괄·실시간·분산 처리 비교 | `data-processing-methods` | 2/2 |

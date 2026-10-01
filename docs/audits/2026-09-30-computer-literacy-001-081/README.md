# [WEB 전달용 작업 결과서]

작성: 2026-09-30 · 실제 파일 반영 + 로컬 정적 검증 · Commit / Push / Deploy 미실행

> 현재 HEAD의 `AGENTS.md`에는 요청서가 언급한 결과서의 상세 필드 양식이 없음. 문서를 임의 변경하지 않고 작업명·기준·변경·검증·미완료·Git 상태·인수인계 항목으로 보고함.

## 1. 결과와 남은 작업

- 웹 초안 77개: 최신 공개본 27개를 보존하고 미반영 50개를 신규 파일로 반영
- 보호 대상 38·39·40·43번: URL·slug·본문·frontmatter 변경 없음
- 컴퓨터일반 81개 + 기존 스프레드시트일반 4개 = 컴활 전체 85개
- canonical 질문 70개 추가(117→187), 원본 PNG 4개 및 명시적 이미지 등록 추가
- 1~81 주 기출 145개·보조 연결 63개·렌더링 팝업 208개 정합성 검사 통과
- Test 7개 PASS, Build 345페이지 PASS
- **390px 모바일·320px 보조·데스크톱 실화면 QA 미완료**: 실행 브라우저 부재 → 설치 다운로드 오류 → 제공 브라우저의 localhost 접속 `ERR_BLOCKED_BY_CLIENT`
- 화면 QA 완료 기준은 아직 충족하지 않음. 실제 Windows/Excel 실행·시험기관 공식 정정 확인·CI·Production QA도 수행하지 않음
- 모든 변경은 미커밋 상태이며 원격과 Production에는 반영하지 않음

## 2. 작업 기준과 기존 작업 보호

실제 작업 경로: `/workspace/scratch/c98702d47b0f/getpasslab`

사용자 Windows PC의 로컬 경로를 직접 수정한 것이 아니라 이 작업 환경의 Git worktree에 반영함.

| 항목 | 확인값 |
|---|---|
| 기존 worktree | `/workspace/scratch/5d60be12d79b/repo` |
| 기존 branch | `codex/energy-expansion-tank-figure` |
| 기존 HEAD | `10c42b68720a1c253a36fadb649e1c5baca97372` |
| 시작 시 기존 변경 | 에너지 SVG·PNG 2개 수정, 미추적 파일 없음 |
| 신규 작업 branch | `codex/computer-literacy-001-081-local` |
| 기준 main / 작업 HEAD | `eb5726619dc7835d6c3d5820fef8650710b7407b` |
| 작업 방식 | 최신 origin/main fetch 후 별도 worktree 생성, 시작 시 clean |
| 보호 확인 | 기존 작업 파일 2개 해시·Git 상태 불변, 기존 챕터 파일 전체 해시 불변 |

확인 지침: `AGENTS.md`, 최신 `AI_HANDOVER.md`의 C1 공개 기록, `CHAPTER_WRITING_GUIDE.md`, 기존 스키마·URL·기출 렌더링 구조, `docs/standards/learning-image-design-system-v1.md`.

입력 ZIP의 6개 배치 원본은 master의 대응 구간과 일치함. `02_WORK_REQUEST_001_081.md`는 `WORK_REQUEST.md`로 보존, 배치 원본은 `source-drafts/`, ZIP 및 입력 파일 해시는 `input-hashes.json`과 `source-verification.json`에 기록함.

현재 저장소는 2026-09-24 패키지보다 최신임. 이미 승인·공개된 C1 1~27은 과거 초안으로 덮어쓰지 않음. 저장소에 없던 정본 문항·이미지는 기존 `computer-literacy-writing-kit-2026-09-24.zip`의 canonical·manifest·원본에서 추가함. 기존 117문항은 review를 포함한 모든 필드 값을 보존함.

## 3. 현재 저장소 우선 적용 차이

| 항목 | 09-24 목차/초안 | 반영 결과 |
|---|---|---|
| 1~27 | 신규 웹 초안 | 09-27 공개된 최신 27개 본문 보존 |
| 40 작업 표시줄 | 보조 `20150627_015` | 현재 보조 없음 유지 |
| 43 단축키 | 보조 `20151017_016` | 현재 보조 없음 유지 |
| Windows 그룹명 | Windows 작업과 관리 | 기존 공개 4개와 같은 `Windows 화면과 조작` 사용 |
| 기존 공개 4개 ID | 목차의 chapter ID | 기존 파일에 chapter_id를 추가하지 않고 기존 publication map 유지 |

그룹명은 현재 목차·사이드바가 그룹별로 정렬하는 구조에서 순서 38~81을 유지하기 위한 기존 명칭 채택임. 공개 본문·기출 배정을 바꾸거나 라우팅·레이아웃을 재설계하지 않음.

## 4. 콘텐츠 검수와 주요 수정

모든 81개에 대해 chapter ID·title·order·subject_id·주/보조 question_id·URL·원본 이미지 해시를 대조함. 신규 50개는 원본 배치의 학습 본문과 실제 연결 문항 원문·4개 선택지·수록 답안을 함께 읽고 범위를 점검함. 보조 문항은 적용 가능한 선택지·개념만 안내하고, 범위를 넘어서는 주제는 본문을 끌어오지 않음.

| 조건/발견 | 처리 |
|---|---|
| GB/GiB·Unicode·SATA | 최신 C1 본문과 기존 풀이 참고 보존, SATA 답안 ① 유지 |
| Windows 7/10 대 Win11 | 과거 기출 UI와 현재 메뉴·기능 조건 구별 유지, 가상 최신 UI 제작 없음 |
| 54 파일명 | 확장자까지 포함한 전체 파일명 기준으로 중복 여부 구별 |
| 63 메모장 | 과거 문항과 최신 앱 버전에 따른 서식 기능 차이 유지 |
| 64 Storage Sense | 다운로드·클라우드 정리 제외를 무조건 기본값으로 일반화하지 않음, 온라인 전용은 클라우드 원본 삭제와 구별 |
| 66~67 디스크 관리 | 오류 검사·정리·HDD 재정렬·SSD TRIM 목적 구별, 무분별한 프로세스 종료·재파티션을 최적화로 설명하지 않음 |
| 68 `20161022_018` | 원문 ②의 ‘파일을 관리’는 파일 시스템 정의와 모순이라고 단정하기 어려움. 초안의 ‘파일 종류 분류’라는 설명을 원문에 덧씌우지 않도록 수정. 수록 답안 ②·선택지 보존, ①의 트랙/섹터 초기화와 논리 포맷 구별, 공식 정정 여부 미확인 표시 |
| 69 정품 인증 경로 | Win10과 Win11 경로 구별 |
| 71 `20150627_013` | 드라이버 미설치 상태와 과거 노란 물음표 아이콘 표현 구별, 문항 팝업에도 풀이 참고 추가 |
| 77·81 로그인/계정/UAC | 로그인 수단과 권한 수준 구별, 표준 사용자 권한 상승의 관리자 자격 증명 조건, 과거 자녀 보호 기능 문맥 유지 |
| 직접 기출 없는 ADD | questions/supportingQuestions 빈 배열 유지, 학습 예시는 실제 기출이 아님을 표시 |
| 편집 내용 | 검수 메모·원문 ID·검토 체크리스트를 학습 본문에서 제외, 원본 배치와 감사 자료에 보존 |

`20161022_018`은 모호함을 숨기지 않는 조건부 반영임. 공식 정답 자체를 정정하거나 새로운 정답을 만든 것이 아님. 기존 SATA·Unicode 등 원문 타당성 쟁점도 해결됐다고 보고하지 않음.

공식 문서 재확인(2026-09-30, Windows 실제 실행과 구별):

- [드라이브 최적화](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/defragment-optimize-your-data-drives-in-windows): HDD/SSD 처리 구별
- [Storage Sense](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense): 드라이브·설정 조건 및 온라인 전용
- [Device Manager 문제 코드](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/device-manager-problem-codes): 상태 코드와 아이콘 표현 구별
- [UAC 동작](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/how-it-works): 관리자/표준 사용자 승격 조건
- [메모장 서식 기능 발표](https://blogs.windows.com/windows-insider/2025/05/30/text-formatting-in-notepad-begin-rolling-out-to-windows-insiders/): 앱 버전 조건을 둬야 하는 근거
- [format 명령](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/format): 파일 시스템 선택·빠른 포맷과 덮어쓰기 구별

## 5. 이미지 검수 브리프

적용 기준: `docs/standards/learning-image-design-system-v1.md` v1.2. 모두 **원본 유지** 유형이며, 선택지 해석에 쓰는 라벨·숫자·화면은 추정 생성·재배치·재색칠하지 않음. 별도 화살표·상태색·흐름 없음. 기존 Image 컴포넌트의 크기 제한과 alt를 사용함.

| 원본 문항 | 학습 질문/캡션 역할 | 처리 |
|---|---|---|
| 20151017_009 | ㄱ·ㄴ·ㄷ 사용 조건을 프리웨어/셰어웨어/상용에 대응 | 원본 추가 |
| 20151017_010 | Windows·Photoshop·Linux·한글·Unix에서 응용 소프트웨어 판단 | 원본 추가 |
| 20180901_012 | ㉠·㉡·㉢ 라이선스 조건 대응 | 원본 추가 |
| 20180901_003 | 디스크 속성의 오류 검사 목적 구별 | 원본 추가 |
| 20151017_012 | CPU 장치 구성 판별 | 기존 원본 보존 |
| 20200704_018 | CPU·그래픽·RAM·SSD 사양 해석 | 기존 원본 보존 |
| 20180303_019 | 기존 Windows 창 전환 단축키 | 기존 원본 보존 |

7개 원본을 시각 확인했고 파일·manifest 해시·PNG 치수 일치 확인. 출력에서 15회 이미지 연결, 파일 존재·alt 확인. 새 4개 이미지의 검수 전 `jpg 확필` 표시는 원본 대조 후에만 해제함. 기존 레지스트리 항목은 보존함.

390px 목표: 문항·이미지·선택지 세로 흐름, 가로 넘침 없음, 원본 텍스트 판독 가능. 보조 320px도 계획했으나 **실화면 판독·확대 동작 확인은 브라우저 실행 차단으로 미완료**임. 원본의 ‘윈도우 10 검증 완료’ 문구는 원문 일부이지 이번 작업에서 Windows를 실행했다는 뜻이 아님.

## 6. Test / Build / QA

| 검증 | 결과 |
|---|---|
| npm run build | PASS · 345페이지 생성 |
| npm run check:seo | PASS · 오류/경고 0 |
| npm run check:public-content | PASS · 오류 0 |
| npm run check:computer-literacy | PASS · 기존 공개 8개 URL/기출/이미지, 전체 85개 |
| npm run check:computer-literacy-c1 | PASS · 기존 27개와 104팝업, 기존 풀이 참고 보존 |
| npm run check:deferred-question-content | PASS · 에너지/산업안전 지연 기출 회귀 검사 |
| npm run check:computer-literacy-001-081 | PASS · 81개·208팝업·원본 해시·순서·배정·링크 |
| npm run check:contrast | PASS · 기존 텍스트 토큰 대비 |
| git diff --check | PASS |
| 모바일 390px / 보조 320px / 데스크톱 | BLOCKED · 실제 화면 판정 없음 |
| Commit / Push / CI / Deploy / Production QA | 미실행 |

이 저장소에는 `npm test` 명령이 없어 기존 프로젝트 검사 명령들과 신규 범위 검사를 실행함. Build 로그의 345페이지와 SEO 검사의 HTML 347개는 기존 리다이렉트 등 정적 HTML을 포함하는 집계 차이임.

증거: `test-results.json`, `build-output.txt`, `source-verification.json`, `browser-qa.json`, `final-git-review.json`.

브라우저가 준비된 환경에서 남은 QA 실행:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4325
# 별도 터미널. 이미 설치된 Playwright를 사용하며 프로젝트 의존성을 추가하지 않음
QA_PLAYWRIGHT_MODULE=/absolute/path/to/playwright node docs/audits/2026-09-30-computer-literacy-001-081/browser-qa.cjs
```

필요하면 `QA_CHROMIUM_PATH`에 설치된 Chromium 실행 파일, `QA_BASE_URL`에 로컬 preview 주소를 지정. 스크립트는 81개·208팝업의 열기/답안/닫기/초기화, 이미지·표·긴 제목 넘침, 320/1440px 대표 9페이지를 확인하도록 준비했으나 이번에는 브라우저가 실행되지 않았으므로 스크립트 자체의 브라우저 동작도 미검증임.

## 7. 변경 파일과 인수인계

- `src/content/chapters/computer-literacy/written/computer-basics/`: 신규 50개(아래 목록)
- `src/data/questions/computer-literacy.json`: 원문 그대로 70문항 추가
- `src/data/question-assets/computer-literacy.json`, `src/config/questionImages.ts`: 원본 4개 등록
- `src/assets/questions/computer-literacy/`: 원본 PNG 4개
- `src/config/questionCautions.ts`: Device Manager·포맷 풀이 참고 2개
- `scripts/check-computer-literacy-publication.mjs`: 현재 공개 예정 챕터 수 81/85로 검사 갱신
- `scripts/check-computer-literacy-001-081.mjs`, `package.json`: 새 범위 정합성 검사
- `AI_HANDOVER.md`: 이번 로컬 단계와 QA 차단 사실 추가
- 이 감사 폴더: 입력 원본, 81개 매핑, 검증 로그, 브라우저 QA 재실행 스크립트

공개 경로/slug 변경·질문 ID 생성·기출 원문/정답 변경·새 라이브러리 추가·스타일/라우팅/컴포넌트 재설계 없음. 런타임 관계 원본은 기존처럼 chapter frontmatter이며 이 폴더의 JSON은 고정된 검수 증거임.

다음 작업은 브라우저가 가능한 환경에서 실화면 QA를 완료하는 것임. 그 이후 Commit/Push/Deploy는 사용자가 별도 지시할 때만 수행.

## 8. 1~81 반영 대장

기본 공개 URL 패턴: `/computer-literacy/written/computer-basics/{slug}/`. 표의 상태는 파일 상태이며 이번에 배포했다는 뜻이 아님. 실제 파일 경로와 원문 해시는 `source-verification.json` 참조.

| 순서 | chapter ID | 제목 | slug | 주/보조 | 결과 |
|---:|---|---|---|---:|---|
| 1 | P1-15a | 컴퓨터를 분류하는 기준 | `computer-classification` | 5/0 | 최신 공개 본문 유지·초안 대조 |
| 2 | P1-42a | 웨어러블 컴퓨터의 착용과 입력 방식 | `wearable-computers` | 2/0 | 최신 공개 본문 유지·초안 대조 |
| 3 | P1-15b | 컴퓨터 발전의 주요 전환 | `computer-development` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 4 | P1-16a-01 | 비트·바이트와 자료 구성 단위 | `bits-bytes-data-units` | 4/0 | 최신 공개 본문 유지·초안 대조 |
| 5 | P1-16a-02 | 저장 용량 환산하기 | `storage-capacity-conversion` | 2/0 | 최신 공개 본문 유지·초안 대조 |
| 6 | P1-31-01 | ASCII·EBCDIC·Unicode의 문자 표현 | `character-codes` | 5/2 | 최신 공개 본문 유지·초안 대조 |
| 7 | P1-31-02 | 패리티 비트로 오류 검출하기 | `parity-bit` | 1/4 | 최신 공개 본문 유지·초안 대조 |
| 8 | P1-17-01 | CPU의 연산·제어 기능 | `cpu-operations-control` | 4/1 | 최신 공개 본문 유지·초안 대조 |
| 9 | P1-17-02 | 레지스터에 저장하는 정보 | `cpu-registers` | 5/2 | 최신 공개 본문 유지·초안 대조 |
| 10 | P1-18a | RAM·ROM·플래시 메모리 비교 | `ram-rom-flash` | 6/10 | 최신 공개 본문 유지·초안 대조 |
| 11 | P1-19 | HDD·SSD·광학 저장장치 비교 | `storage-devices` | 4/3 | 최신 공개 본문 유지·초안 대조 |
| 12 | P1-18b-01 | 기억장치의 위치와 속도 순서 | `memory-speed-hierarchy` | 1/3 | 최신 공개 본문 유지·초안 대조 |
| 13 | P1-18b-02 | 캐시와 버퍼의 임시 저장 목적 | `cache-buffer` | 1/4 | 최신 공개 본문 유지·초안 대조 |
| 14 | P1-18b-03 | 가상 메모리로 주기억 용량 보완하기 | `virtual-memory` | 3/3 | 최신 공개 본문 유지·초안 대조 |
| 15 | P1-20a-01 | 정보의 이동 방향으로 입출력장치 구별하기 | `input-output-devices` | 2/1 | 최신 공개 본문 유지·초안 대조 |
| 16 | P1-20a-02 | 멀티미디어 보드의 처리 역할 | `multimedia-boards` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 17 | P1-20a-03 | 프린터의 인쇄 원리 | `printer-principles` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 18 | P1-20b-01 | 자동 인식과 전원을 켠 채 연결: PnP·핫 스와핑 | `plug-and-play-hot-swap` | 2/3 | 최신 공개 본문 유지·초안 대조 |
| 19 | P1-20b-02 | USB의 연결 방식과 규격 | `usb-interface` | 2/0 | 최신 공개 본문 유지·초안 대조 |
| 20 | P1-20b-03 | SATA의 저장장치 연결 방식 | `sata-interface` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 21 | P1-20b-04 | HDMI의 영상·음향 전송 | `hdmi-interface` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 22 | P1-46 | 펌웨어와 BIOS의 부팅 역할 | `firmware-bios` | 2/2 | 최신 공개 본문 유지·초안 대조 |
| 23 | P1-16b-01 | 연산 시간 단위와 빠르기 비교 | `processing-time-units` | 2/0 | 최신 공개 본문 유지·초안 대조 |
| 24 | P1-16b-02 | 성능 수치의 크기와 비교 방향 | `performance-metrics` | 2/1 | 최신 공개 본문 유지·초안 대조 |
| 25 | P1-16b-03 | 컴퓨터 사양표에서 장치와 용량 읽기 | `computer-specifications` | 1/0 | 최신 공개 본문 유지·초안 대조 |
| 26 | ADD-17 | 부품 업그레이드의 목적과 호환 조건 | `pc-upgrade-compatibility` | 0/0 | 최신 공개 본문 유지·초안 대조 |
| 27 | P1-15c | 일괄·실시간·분산 처리 비교 | `data-processing-methods` | 2/2 | 최신 공개 본문 유지·초안 대조 |
| 28 | P1-21 | 시스템·응용·유틸리티 구별하기 | `software-types` | 5/0 | 신규 파일 반영 |
| 29 | P1-23-01 | 운영체제가 관리하는 자원과 작업 | `operating-system-resources` | 4/4 | 신규 파일 반영 |
| 30 | ADD-16 | 운영체제의 종류와 사용 환경 | `operating-system-environments` | 0/0 | 신규 파일 반영 |
| 31 | P1-23-02 | 운영체제의 성능 평가 지표 | `operating-system-performance` | 1/1 | 신규 파일 반영 |
| 32 | P1-22b | 컴파일러와 인터프리터의 번역·실행 방식 | `compiler-interpreter` | 1/0 | 신규 파일 반영 |
| 33 | P1-22a | 객체지향의 주요 특징 비교 | `object-oriented-features` | 2/0 | 신규 파일 반영 |
| 34 | P1-38-01 | 프리웨어·셰어웨어·오픈소스의 사용 조건 | `software-license-types` | 4/0 | 신규 파일 반영 |
| 35 | P1-38-02 | 알파·베타·체험판·번들의 배포 목적 | `software-release-versions` | 2/1 | 신규 파일 반영 |
| 36 | P1-38-03 | 패치와 업데이트의 목적 | `patches-and-updates` | 2/1 | 신규 파일 반영 |
| 37 | P1-48 | 파일 압축 형식 구별하기 | `archive-file-formats` | 1/0 | 신규 파일 반영 |
| 38 | ADD-01 | Windows 화면의 앱·파일·창 구별하기 | `windows-apps-files-windows` | 0/1 | 보호 대상 그대로 보존 |
| 39 | ADD-44 | 창 최소화·최대화·닫기의 결과 | `window-states` | 0/1 | 보호 대상 그대로 보존 |
| 40 | P1-24-01 | 작업 표시줄의 설정과 창 배열 | `taskbar-settings` | 3/0 | 보호 대상 그대로 보존 |
| 41 | P1-24-02 | 점프 목록의 최근 항목과 고정 | `jump-lists` | 1/2 | 신규 파일 반영 |
| 42 | P1-24-03 | Aero Peek으로 바탕화면·창 미리보기 | `aero-peek` | 2/1 | 신규 파일 반영 |
| 43 | P1-39 | Windows 단축키로 실행되는 동작 | `windows-shortcuts` | 4/0 | 보호 대상 그대로 보존 |
| 44 | P1-32b-01 | 해상도와 텍스트 표시 설정 | `display-settings` | 1/0 | 신규 파일 반영 |
| 45 | ADD-05 | 소리의 입력·출력 장치와 음량 | `sound-input-output` | 0/0 | 신규 파일 반영 |
| 46 | ADD-08 | 배경·테마와 해상도 설정 구별하기 | `backgrounds-and-themes` | 0/0 | 신규 파일 반영 |
| 47 | ADD-42 | 절전·최대 절전·종료의 차이 | `sleep-hibernate-shutdown` | 0/0 | 신규 파일 반영 |
| 48 | P1-32b-02 | 키보드와 마우스의 속성 설정 | `keyboard-mouse-properties` | 1/0 | 신규 파일 반영 |
| 49 | ADD-06 | Bluetooth 장치의 검색·페어링·연결 | `bluetooth-pairing` | 0/0 | 신규 파일 반영 |
| 50 | ADD-07 | 휴대전화와 PC 연결의 목적과 조건 | `phone-pc-link` | 0/0 | 신규 파일 반영 |
| 51 | P1-33 | Windows 접근성 기능의 도움 대상 | `windows-accessibility` | 5/0 | 신규 파일 반영 |
| 52 | P1-25a-02 | 탐색기의 폴더 계층과 이동 | `file-explorer-hierarchy` | 1/0 | 신규 파일 반영 |
| 53 | ADD-03 | 파일 찾기와 프로그램 실행 구별하기 | `file-search-and-run` | 0/0 | 신규 파일 반영 |
| 54 | P1-25a-01 | 파일·폴더의 이름과 속성 | `file-folder-properties` | 3/0 | 신규 파일 반영 |
| 55 | P1-25a-04 | 확장자로 파일의 용도 구별하기 | `file-extension-types` | 1/0 | 신규 파일 반영 |
| 56 | ADD-02 | 숨김 파일과 확장자의 표시 설정 | `hidden-files-extensions` | 0/0 | 신규 파일 반영 |
| 57 | P1-25b-01 | 파일·폴더 선택하기 | `selecting-files-folders` | 1/0 | 신규 파일 반영 |
| 58 | P1-25b-02 | 파일 복사·이동 결과 판단하기 | `copying-moving-files` | 1/1 | 신규 파일 반영 |
| 59 | P1-25b-03 | 바로가기와 원본의 관계 | `shortcuts-and-originals` | 4/0 | 신규 파일 반영 |
| 60 | P1-25a-03 | 라이브러리로 여러 위치의 파일 모아 보기 | `windows-libraries` | 1/0 | 신규 파일 반영 |
| 61 | P1-40 | 파일 삭제와 휴지통 복원 조건 | `recycle-bin-recovery` | 2/1 | 신규 파일 반영 |
| 62 | ADD-04 | 작업에 맞는 Windows 보조 도구 고르기 | `windows-accessories` | 0/0 | 신규 파일 반영 |
| 63 | P1-32c | 메모장에서 할 수 있는 작업 | `notepad-features` | 1/0 | 신규 파일 반영 |
| 64 | ADD-43 | 저장 공간 확인과 자동 정리 | `storage-sense` | 0/0 | 신규 파일 반영 |
| 65 | P1-26-01 | 디스크 정리로 지울 수 있는 항목 | `disk-cleanup` | 2/2 | 신규 파일 반영 |
| 66 | P1-26-02 | 디스크 오류 검사의 대상과 역할 | `disk-error-checking` | 1/1 | 신규 파일 반영 |
| 67 | P1-26-03 | 디스크 조각 모음과 최적화의 목적 | `drive-optimization` | 6/0 | 신규 파일 반영 |
| 68 | P1-26-04 | 디스크 포맷과 파일 시스템 | `disk-format-file-systems` | 2/1 | 신규 파일 반영 |
| 69 | P1-27a-03 | 시스템 기본 정보에서 확인하는 항목 | `system-about-information` | 3/0 | 신규 파일 반영 |
| 70 | P1-27a-04 | 시스템 정보의 범주별 확인 항목 | `system-information-categories` | 1/0 | 신규 파일 반영 |
| 71 | P1-27a-01 | 장치 관리자에서 장치·드라이버 확인하기 | `device-manager` | 2/1 | 신규 파일 반영 |
| 72 | P1-27a-02 | 작업 관리자에서 사용량 확인·작업 종료하기 | `task-manager` | 1/1 | 신규 파일 반영 |
| 73 | P1-27b | Windows 레지스트리에 저장하는 정보 | `windows-registry` | 1/1 | 신규 파일 반영 |
| 74 | P1-32a | 프로그램 제거·복구와 Windows 기능 설정 | `programs-and-windows-features` | 4/0 | 신규 파일 반영 |
| 75 | ADD-09 | 기본 앱과 파일 형식 연결 | `default-apps` | 0/0 | 신규 파일 반영 |
| 76 | ADD-15 | 업데이트 설치와 재시작 상태 | `update-restart-states` | 0/0 | 신규 파일 반영 |
| 77 | ADD-10 | 로그인 수단과 사용자 권한 구별하기 | `sign-in-and-account-types` | 0/0 | 신규 파일 반영 |
| 78 | ADD-11 | 시각·시간대·자동 설정의 차이 | `time-and-time-zones` | 0/0 | 신규 파일 반영 |
| 79 | ADD-12 | 표시 언어·입력 언어·지역 형식 | `language-and-region` | 0/0 | 신규 파일 반영 |
| 80 | ADD-13 | 게임 바와 게임 모드의 목적 | `game-bar-and-game-mode` | 0/0 | 신규 파일 반영 |
| 81 | P1-28 | 사용자 계정의 권한과 UAC 승인 | `user-accounts-uac` | 5/1 | 신규 파일 반영 |

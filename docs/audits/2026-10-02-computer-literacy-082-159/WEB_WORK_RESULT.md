# [WEB 전달용 작업 결과서]

작성일: 2026-10-02 · 저장소: `syjy813/getpasslab`

## 상태와 검토 경로

완료. Web Work에서 82~159 총 78개 챕터를 반영하고 Test·Build·390px/1440px QA·기존 회귀 검증을 통과함. 전용 브랜치 Commit·Push 및 [Draft PR #116](https://github.com/syjy813/getpasslab/pull/116)을 생성함. main push·PR merge·Production deploy는 수행하지 않음.

- 기준 main: `27dc3924aff77f478df50c15b5b7b337125c7fdb`
- 작업 브랜치: `codex/computer-literacy-082-159-web-20261002`
- 콘텐츠·브라우저 검사 기준 커밋: `5c83ad8257f90f876320497fb5844c952706fb17`
- 결과서·handover 추가 후 최종 HEAD는 Draft PR의 head 커밋을 확인. 콘텐츠 기준 커밋과 구분하여 문서만 추가하는 커밋으로 마감함
- 최종 git status: clean. 원래 작업 경로의 미커밋·미추적 변경은 보호하고 본 전용 worktree의 임시 의존성 링크만 제거함

## 입력 확인과 구현

실제 첨부 ZIP의 `02_WORK_REQUEST_082_159.md` 전체, `01_MASTER_DRAFTS_082_159.md`, 배치 4개를 확인함. master에 배치 내용이 포함되어 있으며 manifest의 6개 파일 크기·해시가 일치함. 파일명의 WEB/LOCAL 차이는 사용자 최신 직접 지시인 Web Work·브랜치 Commit/Push·Draft PR을 우선하여 처리함.

작업 시작 시 현재 main과 `AGENTS.md`, 최신 `AI_HANDOVER.md`, `CHAPTER_WRITING_GUIDE.md`, 이미지 디자인 기준 v1.2, 현재 canonical question 데이터 및 이전 사용자 정본 ZIP의 277개 통합 목차·기출을 확인함. 기존 미커밋 작업이 있는 다른 worktree를 수정하지 않고 최신 main에서 전용 worktree·브랜치를 생성함.

| 항목 | 결과 |
|---|---|
| 신규 챕터 | 78개: 컴퓨터일반 72 + 스프레드시트일반 6 |
| 통합 순서 | 82~159, ID·제목·과목·그룹·순서 정본 일치 |
| 기출 연결 | 주 149문항 + 보조 59건, 중복 제외 참조 155문항 |
| 정본 데이터 | 필요한 134문항 추가, 저장소 187→321문항 |
| ADD 챕터 | 11개, 기출·빈도 창작 없음 |
| 원본 이미지 | 7장 확인·연결: 기존 2장 + 신규 원본 PNG 5장 |
| 최종 변경 파일 | 신규 88 + 수정 8 = 96개, 삭제 0개 |
| 공개 컴활 챕터 | 기존 85 + 신규 78 = 163개 |

신규 파일은 챕터 Markdown 78개, 원본 PNG 5개, 감사 문서 3개, 검사·QA 스크립트 2개임. 수정 파일 8개는 `AI_HANDOVER.md`, 질문 JSON, 이미지 registry JSON, 이미지 매핑, 풀이 참고 매핑, `package.json`, 공개 수량 검사, 기존 브라우저 QA workflow임. 앱 구조·스타일·Production 배포 workflow·의존성은 변경하지 않음.

### 텍스트와 조건

목록·헤더 summary를 짧은 판단 기준으로 정리하고, 공개 본문에서 내부 ID·검수 메모를 제거함. 보조 문제는 배정 범위만 설명하고 공개된 주 담당 챕터가 있으면 연결함. 캡처에서 확인한 34개 신규 챕터의 분리된 조사·종결부를 문장에 연결하고 목록 안내를 완결된 문장으로 다듬음.

버전·조건을 유지하며 TIFF/BMP/WAV, 성형/트리형, 웹 표준 기술, 악성코드 유형, Excel 시트·입력·계산 옵션 설명을 기출과 대조함. Smart TV·IPv6·과거 255개 시트 제한에는 당시 수록 답안과 현재 일반 규칙을 구별하는 풀이 참고를 추가함. Point-in-time restore는 Windows 설치 드라이브에 한정됨을 명시함. 공식 근거·상세 편집 내역은 [README.md](README.md)에 기록함.

### 정본과 기존 Production 보호

모든 주 149문항과 보조 전용 6문항의 원문·4개 선택지·수록 정답을 직접 대조함. 주 배정 중복·누락 참조·과목 불일치·slug 충돌 없음. 기존 187개 문항 payload 해시는 전부 일치하며 원문·선택지·정답·메타데이터를 보존함.

통합 1~81 및 기존 Excel 4개, 총 85개 공개 본문과 기존 PNG 26개는 SHA-256 기준으로 보호함. 기존 URL·slug·ID·본문 변경 없음. 기존 이미지 registry 26개 항목도 보존함. 직접 원본을 확인한 기존 미사용 `20200704_001`, `20200704_021`의 `jpg 확필` 검수 플래그만 해제함. 질문 payload나 외부 정본 ZIP는 변경하지 않음.

원본 7장은 manifest·픽셀 치수·alt·정답 단서를 대조하고 모바일 모달 캡처로 읽힘을 확인함. 원본 유지형 브리프를 작성하고 v1.2의 원본/파생본 구별·모바일 표시·단계별 QA 기준을 적용함. 새 그림이나 파생 이미지는 제작하지 않음.

## 검증

Web Work의 Chromium 설치는 ZIP 다운로드 오류로 실패함. 승인된 Draft PR의 GitHub Actions에서 Ubuntu·Chromium과 임시 Astro preview를 실행하여 화면 검증함. Production을 QA 환경으로 사용하지 않음.

| 구분 | 결과·범위 |
|---|---|
| Test | 8개 `check:*` 검사 PASS |
| Build | Astro build PASS, 423페이지·425 HTML·sitemap 424 URL |
| 신규 390px | PASS: 78개 전체 + 81 경계 = 79페이지, 214개 모달 흐름 |
| 신규 PC 1440px | PASS: 동일 79페이지, 214개 모달 흐름 |
| 보조 320px | PASS: 대표 8페이지, 33개 모달 흐름 |
| 기존 1~81 회귀 | PASS: 390px 81페이지/208모달, 320px·1440px 각각 24페이지/69모달 |
| `git diff --check` | PASS, 최종 diff/status 확인 |

검사 명령: `check:contrast`, `check:seo`, `check:public-content`, `check:computer-literacy`, `check:computer-literacy-c1`, `check:deferred-question-content`, `check:computer-literacy-001-081`, `check:computer-literacy-082-159`.

신규 검사 범위: 78개 전체 + 81 경계 페이지를 390px·1440px에서 검사하고, 대표 8개는 320px에서도 검사함. 기출 열기·정답·닫기·재열기 초기화·Escape, 이미지 decode·비율·alt, 목차 펼침/접기·과목 전체 목록·PC 사이드바, 이전/다음 실제 이동, 표·긴 제목·IPv4/IPv6·URL·확장자·수식·단축키 넘침, 광고 예약 영역과 본문의 겹침을 확인함.

기존 과목 내 이동 규칙에 따라 81→82, 컴퓨터일반 마지막 153 및 스프레드시트 마지막 159의 다음 비활성화를 검사함. main에는 별도 ‘전체 보기’ URL/기능이 없어 기존 과목 전체 목록과 챕터 목차를 검증함. 별도 URL을 창작하지 않음.

첫 CI 실패는 과목 목록을 `main` 안에서 찾는 새 QA 스크립트의 선택자 오류였음. 기존 페이지의 `section.section.container` 구조와 실제 모든 링크를 확인하고 선택자 및 해당 페이지의 넘침 검사를 수정함. 실패를 통과로 기록하지 않으며 최종 수정 커밋의 재실행 결과로 판단함.

최종 검증 증거:

- [브라우저 QA·Build·8개 검사 성공](https://github.com/syjy813/getpasslab/actions/runs/36974197532), 기준 `5c83ad8257f90f876320497fb5844c952706fb17`
- [SEO CI 성공](https://github.com/syjy813/getpasslab/actions/runs/36974197535)
- [QA artifact](https://github.com/syjy813/getpasslab/actions/runs/36974197532/artifacts/11213486143): 캡처 152장 + 결과 JSON 2개. SHA-256 `acd3124a26500fc47da35d633321c6db48c682150b50908b0f7cf154d68f1317` 다운로드 후 일치 확인
- 신규 QA JSON: `passed: true`, `errors: []`, SHA-256 `0118bea6658b26e5894d66cb1647e3f679dcb57f3e8b5d163e4bce559c7a10b2`
- 기존 회귀 JSON: `passed: true`, `errors: []`, SHA-256 `ae1c768d53f7918038f01029482c3699e9b07d88b13af4a0d6b9ca298854a2d5`
- 신규 QA에서 과목 전체 목록 왕복 66회, 이전/다음 실제 클릭 34회, 광고 예약 영역 166곳, 이미지 decode/비율 확인 22건 성공. 원본 이미지 7장·풀이 참고 3종·대표 PC/모바일 캡처 및 최종 100·153·159 문장/표 캡처를 직접 확인함

화면 QA는 Chromium viewport 검사임. 실물 휴대폰·Windows/Excel 앱 실행 재현은 수행하지 않음. 외부 광고·추적 요청은 차단되고 preview에서 광고 송출이 비활성화되므로 광고 예약 영역만 확인함. CI 캡처·JSON의 artifact 보존 기간은 14일임.

## 제외·남은 단계

160 `P2-02a`는 BLOCKED 그대로 유지함. `20200704_024`의 실제 Excel 실행 재현 대기 및 `20190302_034`의 원본 이미지 검수 필요 상태를 해제하지 않음. 160 본문·문항·이미지·공개 URL·다음 링크를 이번 변경에 추가하지 않음.

이번 승인 범위의 미완료 구현·검증 항목 없음. Draft PR은 검토 가능한 상태임. 검증상 Production 반영을 막는 오류는 발견되지 않았으나, Production 배포는 이번 승인 범위에서 제외되어 미실행이며 현재 서비스에는 이 PR 내용이 반영되지 않음. 다음 단계는 사용자 검토이며 main merge·Production deploy는 별도 명시 지시 이후의 작업임.

상세 증거: [README.md](README.md), [source-verification.json](source-verification.json), [Draft PR #116](https://github.com/syjy813/getpasslab/pull/116).

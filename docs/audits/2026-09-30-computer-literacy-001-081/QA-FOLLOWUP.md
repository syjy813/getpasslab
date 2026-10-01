# [WEB 전달용 작업 결과서] 모바일 QA 후속 시도

## 결과

**모바일 실화면 QA 미완료(BLOCKED). 실제로 화면을 검증한 페이지는 0개임.**

현재 반영된 1~81 콘텐츠를 유지함. 실제 화면에서 확인된 문제가 없으므로 본문·이미지·스타일·컴포넌트·기출 관계를 수정하지 않음. 후속 시작 전과 후의 src/scripts 및 주요 설정·AGENTS/AI_HANDOVER 544개 파일 해시가 모두 동일함.

## 실행 환경과 차단 근거

- 작업 branch: `codex/computer-literacy-001-081-local`
- HEAD: `eb5726619dc7835d6c3d5820fef8650710b7407b`
- 경로: `/workspace/scratch/c98702d47b0f/getpasslab`
- 로컬 Chromium 실행 파일은 현재 환경에도 없음. 이전 설치 시도는 유효한 ZIP을 받지 못해 실패했으며 이번에는 동일 다운로드를 반복하지 않음
- 브라우저의 공식 troubleshooting 및 cloud-shared-files 안내 확인
- 기존 로컬 HTTP 미리보기 접속은 `ERR_BLOCKED_BY_CLIENT`로 차단된 상태
- 공식 공유 경로의 빌드 HTML 열기를 시도했으나 브라우저 URL 정책이 `file:` 프로토콜을 금지하며 HTTP/HTTPS만 허용한다고 반환함. 정책상 우회 금지 안내에 따라 다른 프로토콜/간접 실행/공개 배포로 우회하지 않음
- 시도한 파일: `file:///home/oai/share/c98702d47b0f/getpasslab/dist/computer-literacy/written/computer-basics/software-license-types/index.html`
- 실화면 미확인을 CSS 검사·HTML 생성·정적 테스트로 대체하여 PASS로 기록하지 않음

## 검증 대상과 결과

기준 폭 390px. 아래 항목 모두 실화면 판정 대기임.

| 항목 | 결과 |
|---|---|
| 표 가로 스크롤·잘림 | 미확인 |
| 긴 제목·단축키·확장자·코드 줄바꿈 | 미확인 |
| 원본 기출 이미지 크기·비율·판독성 | 미확인 |
| 기출 팝업 열기·닫기·본문 가독성 | 미확인 |
| 내부 링크·이전/다음 클릭 이동 | 미확인 |
| 레이아웃 깨짐·겹침 | 미확인 |

아래는 후속 검증 대상으로 선정한 페이지이며, 실화면 확인 완료 목록이 아님. 공통 미리보기 기준 주소는 `http://127.0.0.1:4325`임.

| 순서 | 페이지 | 경로 | 실화면 |
|---:|---|---|---|
| 28 | 시스템·응용·유틸리티 구별하기 | `/computer-literacy/written/computer-basics/software-types/` | 미확인 |
| 34 | 프리웨어·셰어웨어·오픈소스의 사용 조건 | `/computer-literacy/written/computer-basics/software-license-types/` | 미확인 |
| 43 | Windows 단축키로 실행되는 동작 | `/computer-literacy/written/computer-basics/windows-shortcuts/` | 미확인 |
| 54 | 파일·폴더의 이름과 속성 | `/computer-literacy/written/computer-basics/file-folder-properties/` | 미확인 |
| 55 | 확장자로 파일의 용도 구별하기 | `/computer-literacy/written/computer-basics/file-extension-types/` | 미확인 |
| 58 | 파일 복사·이동 결과 판단하기 | `/computer-literacy/written/computer-basics/copying-moving-files/` | 미확인 |
| 64 | 저장 공간 확인과 자동 정리 | `/computer-literacy/written/computer-basics/storage-sense/` | 미확인 |
| 66 | 디스크 오류 검사의 대상과 역할 | `/computer-literacy/written/computer-basics/disk-error-checking/` | 미확인 |
| 68 | 디스크 포맷과 파일 시스템 | `/computer-literacy/written/computer-basics/disk-format-file-systems/` | 미확인 |
| 71 | 장치 관리자에서 장치·드라이버 확인하기 | `/computer-literacy/written/computer-basics/device-manager/` | 미확인 |
| 81 | 사용자 계정의 권한과 UAC 승인 | `/computer-literacy/written/computer-basics/user-accounts-uac/` | 미확인 |

## 재실행 Test / Build

Build 345페이지 생성 PASS. 아래 프로젝트 검사 7개를 재실행하여 모두 PASS.

- `npm run check:seo`
- `npm run check:public-content`
- `npm run check:computer-literacy`
- `npm run check:computer-literacy-c1`
- `npm run check:deferred-question-content`
- `npm run check:computer-literacy-001-081`
- `npm run check:contrast`

전체 로그: `qa-followup-tests.json`. 정적 검증은 화면 가독성·겹침·실제 팝업 동작의 검증 결과가 아님.

## 최종 diff / status

- 후속 작업에서 기존 파일 수정 0개
- 기존 콘텐츠 반영 단계의 tracked 수정 7개 및 미추적 파일 유지
- 추가 파일은 이 결과서, 재실행 로그, Git 확인 기록 3개뿐
- `git diff --check` PASS, staged 변경 없음, branch/HEAD 불변
- 이전 worktree 에너지 SVG·PNG 2개의 미커밋 변경과 해시 보존
- Commit / Push / Deploy 미실행
- 구체적인 최종 상태: `qa-followup-git.json`

## 이어서 수행할 조건

이 미커밋 worktree를 읽고 Chromium을 실행할 수 있는 환경에서 `browser-qa.cjs`를 실행한 뒤 대표 화면을 육안 확인해야 함. 기존 README의 실행 방법 참조. 현재 도구만으로 로컬 브라우저 실행·미리보기 접근을 확보할 수 없어 완료를 보고하지 않음. Production 배포를 QA의 대안으로 수행하지 않음.

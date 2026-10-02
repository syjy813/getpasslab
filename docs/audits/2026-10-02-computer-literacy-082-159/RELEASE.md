# [WEB 전달용 작업 결과서] — 컴활 82~159 Production 배포

## 승인과 배포

- 사용자 `실서버 반영해줘` 승인(2026-10-02)에 따라 이전 검토용 PR 단계의 Merge/Deploy 금지 경계를 갱신함
- 배포 전 main `27dc3924aff77f478df50c15b5b7b337125c7fdb`, PR #116 HEAD `3793f93bd6b29f2d81dfa741f7d3b3839c8184d0`, mergeable/clean 및 최종 CI 성공 확인
- [PR #116](https://github.com/syjy813/getpasslab/pull/116)을 Ready 처리한 뒤 expected HEAD를 고정하여 squash merge
- 콘텐츠 배포 커밋 `e5814d4fe298f84dfb730dc96cb6ff5e2509f3c6`, tree `cddf9b5f13dd554bc331cce911c64fe3af681e41`
- [Pages 배포 36977703260](https://github.com/syjy813/getpasslab/actions/runs/36977703260)의 Build·Deploy 모두 success. 2026-10-02 07:17:21 UTC에 배포 성공, 공개 주소 https://getpasslab.co.kr/

## 반영 범위와 보호

- 82~159 총 78개(컴퓨터일반 72 + 스프레드시트일반 6)를 공개. 공개 컴활 챕터는 컴퓨터일반 153 + 스프레드시트 10 = 163개
- 기존 1~81 및 기존 Excel 4개 본문·URL, 기존 187문항 payload, 기존 이미지와 매핑을 보호
- 주 149문항·보조 59건, 중복 제외 155문항 연결. canonical 134문항 추가로 저장소 총 321문항
- 160 `P2-02a`는 BLOCKED 유지. `20200704_024` 실제 Excel 실행 재현과 `20190302_034` 원본 이미지 검수가 남아 있어 이번 배포에 포함하지 않음
- 원문·선택지·수록 정답을 유지. 과거 시험의 IPv6·Smart TV·시트 수 표현에는 풀이 참고를 제공

## 단계별 검증

| 단계 | 확인 결과 | 증거 |
|---|---|---|
| Test·Build·배포 전 브라우저 QA | 8개 정적 검사·Build·390/320/1440px 신규·기존 회귀 PASS | [최종 PR CI](https://github.com/syjy813/getpasslab/actions/runs/36975171431) |
| Production Deploy | Build·Deploy success | [Pages workflow](https://github.com/syjy813/getpasslab/actions/runs/36977703260) |
| Production HTTP·본문 대조 | 공개 163개 챕터가 HTTP 200이며, 각 `<main>` SHA-256이 배포 커밋의 빌드와 일치 | [Production QA](https://github.com/syjy813/getpasslab/actions/runs/36977996390) |
| Production 브라우저 QA | 390/1440px 신규 각 79페이지·320px 8페이지, 기존 390px 81페이지·320/1440px 각 24페이지 PASS, 오류 0개 | [Production QA](https://github.com/syjy813/getpasslab/actions/runs/36977996390) |
| Production 직접 확인 | 공개 82·97·100·159, PC 목차 이동, 이미지 로딩, 모달 답안·풀이 참고, 159 마지막 처리 확인 | Web Work 제공 Chrome 1348px |

Production QA는 main 변경 없는 임시 [PR #117](https://github.com/syjy813/getpasslab/pull/117)에서 배포 커밋을 고정 체크아웃하여 실제 공개 URL을 검사함. 실서버 QA 성공 후 임시 workflow를 제거하고 배포 기록·인수인계 문서만 반영함

학습 이미지 디자인 시스템 v1.2의 원본 유지형, 그림 브리프·alt·비율, 390px 필수/320px 보조, PC 공통 에셋, 공개 경로 확인 및 Production 검증 단계를 적용함. 새 이미지를 재제작하거나 원본 도판을 수정하지 않음

Chromium viewport QA이며 실물 스마트폰·Excel 앱 실행 검증은 수행하지 않음. 자동화에서는 외부 광고·추적 요청을 차단하고 예약 영역만 검사함. 제공 Chrome에서는 광고 한 건의 렌더링을 관찰했지만 전체 광고 송출 검증으로 확대하지 않음

## 결과 파일과 직접 검수

- [Production 캡처 34장·결과 JSON 3개](https://github.com/syjy813/getpasslab/actions/runs/36977996390/artifacts/11214752062): 다운로드 후 SHA-256 `10ca91b451c6cb794b77ae67ab183f07f625aac888f85461463bc82e6aa2bd9d` 대조 완료. GitHub 보존 기한은 2026-10-16 UTC
- 신규 QA는 390px/1440px 각각 모달 214개, 320px 모달 33개. 기존 QA는 390px 208개, 320px/1440px 각각 69개. 모든 열기·답안 확인·닫기·재열기 초기화·Escape 검사 PASS
- 과목 목차 전체 링크, 표와 긴 문자열의 넘침·잘림, PC 목차/본문 겹침, 81→82 및 마지막 153/159 이동, 이미지 decode·alt·비율, 광고 예약 영역 검사 PASS
- 원본 도판 7개, 풀이 참고 3개, 390px 100번 본문 및 1440px 159번 화면을 Production 캡처에서 직접 검수. 원본 도판은 의미 변경·왜곡 없이 표시됨
- 결과 JSON의 지문·검사 수·제한 사항을 `production-verification.json`에 영구 기록

## 인수인계

- 구현·검수의 상세 기록은 같은 디렉터리 `WEB_WORK_RESULT.md`, `README.md`, `source-verification.json`에 유지. 해당 문서의 미배포 표시는 이전 검토 단계의 기록이며 현재 배포 상태는 이 결과서와 최신 AI_HANDOVER 항목을 우선함
- 되돌릴 필요가 있으면 전용 브랜치에서 이 배포 커밋만 revert하여 PR로 처리. 다른 main 변경이나 보호한 기존 콘텐츠를 reset하지 않음

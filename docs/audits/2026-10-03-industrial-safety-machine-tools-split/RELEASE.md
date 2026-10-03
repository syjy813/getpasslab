# 공작기계 시범 분리 Production 배포 완료

- 배포일: 2026-10-03 (Asia/Seoul) · 사용자 `실서버 배포 해줘` 명시 승인
- [PR #120](https://github.com/syjy813/getpasslab/pull/120) expected HEAD `5b0a8785b0648971734ef8a40691aa9e1e3a0619` 고정 squash merge
- 배포 커밋 `ca25785948d122e05fbe98d628f2d7788e1af789` · 병합 전 main `f7247f69d49379f7649070df3378fe99d52d32b7`
- 검토본과 배포본 tree `721b7c35a1f915d77126382c254649901630c106` 일치
- 기존 공작기계 URL·제목 유지. 선반 11·밀링 6·드릴 4·플레이너 1·공통 2문항, 중복·누락 0

## 실제 검증

| 단계 | 결과 / 증거 |
|---|---|
| 검토 Test / Build | 최종 PR #120의 분리 전용·SEO CI success, 상세는 VALIDATION.md |
| Production Deploy | [37129895941](https://github.com/syjy813/getpasslab/actions/runs/37129895941) Build / Deploy success |
| Production HTTP·본문 | [37130003677](https://github.com/syjy813/getpasslab/actions/runs/37130003677) 5개 챕터 모두 HTTP 200, article SHA-256이 배포 빌드와 일치 |
| Production 기출 배정·목차·sitemap | 24문항 배정 일치, 기존 비교 페이지 및 신규 4개 경로 반영 PASS |
| Production 브라우저 | 390 / 1440 / 320px 각각 5개 챕터·24문항 전수·목차 카드 5개·기존 회귀 4개 PASS, 오류 0 |
| 직접 화면 검수 | 390px 선반, 1440px 비교, 320px 드릴 정답 팝업 캡처 확인 |
| 제공 Chrome 직접 동작 | 비교 → 선반 관련 링크 클릭, 선반 20220424_047 열기·정답 표시·닫기 정상 |

기출 본문·4개 선택지·정답을 화면별 전수 대조함. 열기·초기 정답 숨김·정답 공개·닫기·재열기 초기화·Esc, 관련 링크·모바일 이전/다음·PC 사이드바·가로 넘침·표 잘림·자산 HTTP/JavaScript 오류 확인

학습 이미지 표준 v1.2 §6의 390px·320px·PC 표시 검수 기준을 적용함. 학습 이미지 신규 제작·변경 없음. 실물 스마트폰 미검증, 외부 광고/추적 요청은 차단하고 광고 예약 영역만 검사함. 원본 PDF 대조 미실행

## 증거 및 보호

- [production-verification.json](production-verification.json): 공개 본문 해시·24문항 배정·목차/sitemap 결과
- [production-browser-results.json](production-browser-results.json): 실제 공개 URL 브라우저 검사 전체 결과
- Artifact `11276153604` / `machine-tools-production-qa`: PNG 33장 + JSON 2개 다운로드, ZIP SHA-256 대조 완료
- ZIP SHA-256 `b5c2e0cbe763289821d4991aa57a8c957c12ce8d591ef92b9b3f2b7e7bd73fc2` · 원본 artifact 만료 2026-10-17
- 임시 [QA PR #121](https://github.com/syjy813/getpasslab/pull/121)의 Production QA workflow는 검사 후 제거하고 배포 기록·인수인계만 반영
- 정본 1,680문항·본문·선택지·정답·원본 이미지 및 무관한 챕터 불변. 산업안전 완료 224개·주 기출 연결 1,004개 유지
- 되돌림은 전용 브랜치/PR에서 배포 커밋 `ca257859`만 revert하며 다른 main 작업을 reset하지 않음

기존 VALIDATION.md·REVIEW.md의 미배포 표시는 검토 당시 기록이며, 현재 공개 상태는 이 RELEASE.md를 우선함

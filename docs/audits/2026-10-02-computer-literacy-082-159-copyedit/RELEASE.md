# 컴활 82~159 교정·교열 수정본 Production 반영 완료

- 배포일: **2026-10-03 (Asia/Seoul)**
- 공개 사이트: https://getpasslab.co.kr/
- 사용자 `수정본 반영해줘` 승인으로 검토용 Draft PR의 미배포 경계를 갱신함
- [PR #118](https://github.com/syjy813/getpasslab/pull/118) expected HEAD `e20bfde772355d96ef8914b74a885ff1c4a5509a` 고정 squash merge
- 배포 커밋: `7b1b9d2d93a1e53dbd432a6bf9c7132a0cc659a2`
- 병합 전 main: `0eed0e2ffa2cbb86f53aa6c882b665ed32db4ba6`. 배포와 검토 커밋의 tree `ca7135ffa765a8f2b440a931bb69f1b7c5db6a75` 일치
- 82~159 총 78개 전수 교정·교열 중 54개 본문 수정·24개 유지. 조사·어색한 표현·편집 메모·문장 단절·긴 도입문 정리

## 단계별 실제 검증

| 단계 | 결과 / 증거 |
|---|---|
| Web Work Test / Build | Build·8개 검사·전체 frontmatter/인용/소제목/변경 범위·diff 검사 PASS |
| 배포 전 CI preview | [37025984215](https://github.com/syjy813/getpasslab/actions/runs/37025984215) success. 신규 390/1440 각 79페이지·320 8페이지 및 기존 1~81 회귀 검사 PASS |
| Production Deploy | [37028869533](https://github.com/syjy813/getpasslab/actions/runs/37028869533) Build/Deploy success |
| Production HTTP | [37029293094](https://github.com/syjy813/getpasslab/actions/runs/37029293094) 공개 163개 모두 HTTP 200, main 본문 SHA-256이 배포 빌드와 일치 |
| Production 브라우저 | 아래 대표 페이지의 390/320/1440px 검사 PASS, 오류 0개 |
| Production 캡처 직접 검수 | 6장 확인: 390px 82·117·131, 1440px 117, 320px 159, 390px Smart TV 문제/풀이 참고 |

## 실제 공개 URL 브라우저 QA 범위

| 화면 | 챕터 | 페이지 / 문제 팝업 | 결과 |
|---|---|---|---|
| 390px | 1·81·82·87·97·100·117·131·142·153·154·155·158·159 | 14 / 44 | PASS |
| 320px | 1·81·97·100·154·158·159 | 7 / 32 | PASS |
| 1440px | 1·81·82·87·97·100·117·131·142·153·154·155·158·159 | 14 / 44 | PASS |

가로 넘침·표 잘림·원본 이미지 로딩/alt/비율·팝업 열기/답안 공개/닫기/재열기 초기화/Escape·과목 목차·PC 사이드바·81→82 및 159 마지막 처리를 검사함. 기존 전체 본문은 HTTP 해시 대조, 배포 전 CI에서는 1~81 전수 회귀로 보호 확인함. Production 브라우저 샘플을 전체 78개 실화면 전수 검수로 표현하지 않음

수정된 117의 조사와 시대 조건, 82의 권한 설명, 131의 굵은 글씨, 159의 단축키 조건/결과 및 Smart TV 수록 답안·풀이 참고가 정상 표시됨을 캡처에서 확인함

## 증거와 보호 범위

- 구조화 증거: [production-verification.json](production-verification.json). 공개 163개 본문 해시 및 전체 Production 브라우저 결과 저장
- Artifact `11236817856` / `computer-literacy-copyedit-production-qa`: PNG 41장 + JSON 2개, 다운로드 SHA-256 대조 완료. 보존 만료 2026-10-16
- Artifact SHA-256: `abb5cf51342ccf50de754ef4c52a9f8003cbb7f3b9eae3d02a5e9e8895e130ab`
- [PR #119](https://github.com/syjy813/getpasslab/pull/119) 임시 QA workflow는 검사 후 제거. 배포 기록·인수인계 문서만 main에 반영
- 기존 1~81/Excel 4개, 78개 frontmatter·URL·기출 인용·단축키·수식 및 정본 질문/선택지/정답/이미지 유지
- 160 `P2-02a` BLOCKED 유지. 신규 본문·공개 URL 없음
- 이미지 표준 v1.2 §6/§9 기준 적용: 원본 공통 에셋 재사용, alt·비율·390px/320px/PC 실제 표시 확인. 이미지 제작·변경 없음
- 실물 스마트폰·Excel 앱 실행 미검증. 외부 광고/추적 요청은 차단하고 광고 예약 영역만 검사
- 되돌림이 필요하면 전용 브랜치/PR에서 배포 커밋 `7b1b9d2`만 revert. 다른 main 작업을 reset하지 않음

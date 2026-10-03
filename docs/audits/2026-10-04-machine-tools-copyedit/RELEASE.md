# 공작기계 5개 챕터 교정·교열 배포 완료

- 사용자 승인: `수정 재배포 진행해주고 챕터별 링크 전달해줘`
- [PR #122](https://github.com/syjy813/getpasslab/pull/122), expected HEAD `437572dcfbdce387455ee94943dfc72543686f3c` 고정 squash merge
- 배포 커밋 `0152c485946eabf929d1f9190f0dd39ca05455cd`, 로컬/검토본/배포본 tree `0ab8a31d9555e37c325865ec6423b7466666e906` 일치
- [Pages 37132671197](https://github.com/syjy813/getpasslab/actions/runs/37132671197) Build/Deploy success
- 문단·부품 목록·2열 비교 표로 정리하고 반복 안내·요약 축약. 칩 발생 표현 교정 및 안전수칙 표의 설명용 행동을 명확히 표시
- 5개 frontmatter·URL·기출 24문항 배정 불변. 원본 기출 JSON 본문/선택지/정답/이미지 및 보호 대상 580개 파일 불변
- 로컬 Build(427페이지)·분리 전용·SEO·공개 본문·deferred·대비·컴활 회귀 검사 PASS. 검수 hash chain 연속성 및 미검수 지문 거부 확인
- [SEO 37132306695](https://github.com/syjy813/getpasslab/actions/runs/37132306695) 및 [CI preview QA 37132306698](https://github.com/syjy813/getpasslab/actions/runs/37132306698) success
- CI preview: 390/1440/320px 각 5개 챕터·24문항 팝업·목차 5개·회귀 4개 PASS, 오류 0. 본문/4선택지/답안·공개·닫기·재열기 초기화·Esc·관련 링크·모바일 이전/다음·가로 넘침 확인
- 캡처 33장 중 390 비교/선반/드릴, 320 밀링, 1440 플레이너 직접 검수. artifact `11277442187`, ZIP SHA-256 `a3fbbcf25be9de51801debcee0e860589f05a44dd7ce9076475347ed0f078b48`; 요약 `ci-browser-summary.json`
- Production: 제공 Chrome에서 공개 비교→선반→밀링→드릴→플레이너 링크 이동 및 수정 본문 확인. 선반 `20220424_047` 문제/4선택지·정답 ①·닫기 확인
- Production의 3개 viewport/24문항 전수 재검사는 수행하지 않음. 위 전수 결과는 이번 PR의 CI preview 결과이며 Production 직접 확인과 구분함
- 기출 문자 오류는 원본 PDF 미제공으로 유지. 실물 스마트폰·원본 PDF·실제 학습자 효과 검증 및 학습 이미지 신규 제작 미실행

## 확인한 공개 링크

- [공작기계 비교](https://getpasslab.co.kr/industrial-safety/written/mechanical/machine-tools-safety/)
- [선반 안전](https://getpasslab.co.kr/industrial-safety/written/mechanical/lathe-safety/)
- [밀링 안전](https://getpasslab.co.kr/industrial-safety/written/mechanical/milling-safety/)
- [드릴 안전](https://getpasslab.co.kr/industrial-safety/written/mechanical/drill-safety/)
- [플레이너 안전](https://getpasslab.co.kr/industrial-safety/written/mechanical/planer-safety/)

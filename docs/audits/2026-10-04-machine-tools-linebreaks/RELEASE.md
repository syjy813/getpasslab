# 공작기계 본문 줄바꿈 배포 완료

- 사용자 `그건 수정해서 배포하자` 명시 승인
- [PR #124](https://github.com/syjy813/getpasslab/pull/124) expected HEAD `2f0cfd906bd2212180dff0c4260d06dd8a3a3bc4` 고정 squash merge
- 배포 커밋 `17d9d8d59b5ccccac4b0bedebca192bbbbd15bf3`; 로컬/검토/배포 tree `394f9778eeac681870d819f3eb3952be9c0a0dc5` 일치
- [Pages 37134617492](https://github.com/syjy813/getpasslab/actions/runs/37134617492) Build/Deploy success
- 5개 챕터의 설명 연결 가운뎃점은 문단·목록으로 분리. 단순 Markdown 줄바꿈이 브라우저에서 붙는 현상을 방지하기 위해 빈 줄 문단 사용
- 기존 단어·조건·강조·frontmatter·24문항 불변. 제목/장치명/표/메타데이터의 의미상 가운뎃점 유지
- 로컬 Build·분리 전용·SEO·공개 본문·deferred PASS; 580개 보호 파일·1,680 정본 문항/이미지 불변
- [SEO 37134237046](https://github.com/syjy813/getpasslab/actions/runs/37134237046), [CI preview QA 37134237057](https://github.com/syjy813/getpasslab/actions/runs/37134237057) success
- CI preview 390/1440/320px 각 5개 챕터·24문항 전수 팝업·목차·관련 링크·모바일 이전/다음·4개 회귀 PASS/오류 0. 390/1440 비교 챕터 캡처 직접 검수
- artifact `11277956296`, ZIP SHA-256 `251abe20058bfa5eddf8c7a190fca5ef990afe7a9ed50843866f9a590655d81b` 대조 및 전체 결과 `passed:true`/오류 0 확인
- Production 제공 Chrome에서 비교 챕터 첫 정의/절삭가공 설명 및 장갑 판단이 별도 문단으로 표시됨 확인. Production 3 viewport/24문항 전수 재검사는 미실행이며 CI 결과와 구분함
- 이미지 4장은 이번 배포 범위가 아님. 별도 [Draft PR #125](https://github.com/syjy813/getpasslab/pull/125)에 제작·삽입 및 QA 진행. 학습 이미지 정본 v1.2 적용; 이미지 Merge/Deploy 미실행
- 실물 스마트폰·원본 PDF 검수·학습자 효과 검증 미실행

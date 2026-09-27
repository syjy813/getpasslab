# C1 최초 공개 결과 — 2026-09-27

사용자가 실서버 배포를 요청하여 기존 로컬 검증 범위를 공개까지 확장

## 공개 식별 정보

- 공개 커밋: `294f9f01b1ba78f54e679c0d731a9fba173ccea6`
- [공개 PR #85](https://github.com/syjy813/getpasslab/pull/85): 2026-09-27 23:14 KST 병합
- [PR 검증 36325051956](https://github.com/syjy813/getpasslab/actions/runs/36325051956): 성공
- [Pages 배포 36325180914](https://github.com/syjy813/getpasslab/actions/runs/36325180914): build·deploy 성공, 23:15 KST 완료
- 이 문서는 위 최초 콘텐츠 배포의 증거를 기록 · 후속 문서 커밋은 콘텐츠 공개 커밋과 구별

## 통합 및 검증

- 원격 main의 기출 목록 배치(#83)·글자 크기(#84)를 보존하며 C1 통합
- 기출 배치 충돌은 보조 설명을 버튼 행 밖에 유지하면서 미작성 연결 설명의 빈 링크를 생성하지 않도록 해결
- 통합본 로컬 Build: 23:09 KST, 295페이지 성공 · 기존 청크 크기 경고 유지
- C1 고정 식별자·기출 해시·배정·표시 검사를 PR workflow에 추가
- C1·기존 컴활·SEO·공개 콘텐츠·지연 기출 검사 로컬 및 GitHub에서 통과
- SEO: HTML 297개·sitemap 296 URL, 경고·오류 0
- 인계 초안 원본의 Markdown 강제 줄바꿈 공백 3곳은 원본 그대로 보존 · 다운로드 원본과 SHA-256 일치 확인 · 해당 원본 보관 파일 외 diff 공백 검사 통과

## Production 확인

- [컴퓨터일반 목차](https://getpasslab.co.kr/computer-literacy/written/computer-basics/)
- 신규 27개 URL 전부 HTTP 200, 제목·canonical·공개 가능 상태 확인
- 주 63문항·보조 연결 41건에 해당하는 104개 dialog의 식별자·선택지 수·정답 표시를 로컬 정본과 대조
- 풀이 참고 4문항/6곳에만 안내 표시, 이전 ‘풀이 주의’ 명칭 없음
- 사용한 기출 그림 2종 모두 실제 이미지 응답 확인
- 27개 신규 챕터가 과목 목차에 연결됨을 확인 · 전체 컴활 35개(컴퓨터일반 31/스프레드시트일반 4)
- 실서버 브라우저 390×844px: SATA 기출 열기·수록 답안 확인·풀이 참고 표시·닫기·재열기 초기화 및 가로 넘침 없음
- 정적 응답 검사의 상세 결과: [production-verification.json](./production-verification.json)

## 상태

계획 → 구현 → Test → Build → Push → Deploy → Production 확인 완료

원본 저장소의 미커밋 작업 파일은 수정하지 않았고, 기존 C1 worktree에서 공개 절차 수행

역사·Unicode·SATA·키보드 부팅 문항의 공식 정정 여부·단일 정답 타당성 쟁점은 이전 검수 기록과 동일 · 이 배포가 미확인 공식 채점 근거를 확보했다는 뜻은 아님

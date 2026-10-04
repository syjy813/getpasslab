# 공작기계 그림 4장 배포 — 2026-10-04

## 산업안전 공작기계 그림 4장 Production 배포 완료 — 2026-10-04

- 사용자 `배포 후 실서버 링크` 명시 승인으로 [PR #125](https://github.com/syjy813/getpasslab/pull/125) expected HEAD `46aa77b47178f7b2b2d6134c8a734c1c291e9b39` 고정 squash merge
- 배포 커밋 `451bc9d56f13da4d0ddcb9c059cb91893e6f1b39`, 검토본/배포본 tree `7a43c61eedf57165b5ee7aed49786d78741fc83b` 일치. [Pages 37178244034](https://github.com/syjy813/getpasslab/actions/runs/37178244034) Build/Deploy success
- 선반·수평 밀링·드릴링 머신·플레이너 SVG 4장 공개. 학습 이미지 정본 v1.2 §§1–9 적용, brief·생략 범위·공통 에셋·alt/치수·라벨/방향 검수 기록 보존. 기존 URL/frontmatter/24문항·정본 불변
- 최종 HEAD [이미지/전수 QA 37135894154](https://github.com/syjy813/getpasslab/actions/runs/37135894154) 및 [SEO 37135894151](https://github.com/syjy813/getpasslab/actions/runs/37135894151) success. 390/1440/320px 5챕터/24팝업 및 이미지12개 검사 결과는 CI preview 증거임
- Production 제공 Chrome에서 4개 그림 직접 검수 및 로드 완료/naturalWidth 360/표시폭390/alt/페이지 가로 넘침 없음 확인. 비교 및 4개 챕터 이동, 선반 2022-04 47번 열기·정답·닫기 확인
- 이번 Production은 제공 Chrome 검증이며 3 viewport/24문항 전수 재검사는 미실행. 원본 PDF·실물 스마트폰·학습자 효과 검증 미실행
- 상세: `docs/audits/2026-10-04-machine-tools-visuals/RELEASE.md`, `production-verification.json`. 아래 이미지 미배포 표시는 이전 검토 단계의 이력이며 현재 공개 상태는 이 항목을 우선함


## 실서버 링크

- https://getpasslab.co.kr/industrial-safety/written/mechanical/lathe-safety/
- https://getpasslab.co.kr/industrial-safety/written/mechanical/milling-safety/
- https://getpasslab.co.kr/industrial-safety/written/mechanical/drill-safety/
- https://getpasslab.co.kr/industrial-safety/written/mechanical/planer-safety/
- https://getpasslab.co.kr/industrial-safety/written/mechanical/machine-tools-safety/

모든 URL은 배포 후 제공 Chrome의 post-redirect URL로 확인함.

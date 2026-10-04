# 선반 실물형 학습 이미지 Production 배포 — 2026-10-04

- 사용자 `넣어도 될듯?` 이미지 삽입 승인 및 기존 `배포 후 실서버 링크` 배포 승인 범위로 PR #128 expected HEAD `749d35cfd95abf9640c0e2977cb9141bed4188eb` 고정 squash merge
- 배포 커밋 `347c19bcfdbe2b1dd0be5f3dbee8d1d02cab421e`, 검토본/배포본 tree `91dae1f5e6d9318ac796b37b47617e9d549e6ba0` 일치
- [Pages37181440715](https://github.com/syjy813/getpasslab/actions/runs/37181440715) success. [공개 선반 챕터](https://getpasslab.co.kr/industrial-safety/written/mechanical/lathe-safety/)에서 기존 척·바이트 정의 및 새 일감 정의 바로 뒤에 WebP 표시 확인
- [SEO37181187800](https://github.com/syjy813/getpasslab/actions/runs/37181187800) 및 [CI QA37181187814](https://github.com/syjy813/getpasslab/actions/runs/37181187814) success. 390/1440/320px 각각5챕터/24문항 및 이미지12개 검사 오류0. ZIP digest 대조, 320/1440px 선반 그림 직접 시각 검수. 상세 `ci-browser-summary.json`
- Production 제공 Chrome 직접 UI/이미지 검사: 정의 목록 뒤 배치, alt, 로드 완료, natural1200×1440/표시폭390px, 가로 넘침 없음, 화면 캡처 검수. 상세 `production-verification.json`
- 학습 이미지 정본 v1.2 §§1–9 적용. 제작 전 brief·원본 외형 재사용·직접 라벨·회전 표식·방호 생략 캡션·alt/치수·모바일 라벨 검수. 생성 외형은 특정 제품 설계도가 아님
- URL/frontmatter·11문항/전체24문항·정본1680문항/보호580파일·다른3개 기계 이미지 유지
- Production 3 viewport/24문항 전수 재검사는 미실행이며 CI preview와 구분. 원본 PDF·실물 스마트폰·전문가 설계도·학습자 효과 검증 미실행
- `VALIDATION.md`의 CI 예정/배포 미실행 문구는 구현 단계의 이력. 현재 상태는 이 RELEASE 기록을 우선함

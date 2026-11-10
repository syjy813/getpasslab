# 호텔편 절망·희망 2부작 배포 체크포인트

- 기준: 2026-11-09, main e61d6326ab332da2d19f0a98a12f812b05e2be2e
- 사용자 배포 승인: ep.1-1 절망편과 ep.1-2 희망편 동시 공개, 두 확정 썸네일 사용.
- 새 원고: docs/drafts/facility/hobyeongbaekma/episode01-despair.md 및 episode01-hope.md (공개 전 src/content/facility로 복사)
- 지금 원고는 docs/drafts 편집본의 status: draft이며, **Production 공개 완료 아님**.
- 이전 PR #262 단일 호텔편은 별개이며 이번 2부작 원고로 대체. 예전 단일 호텔편을 병합/배포하지 않음.
- 사용자 편집 요청: 본문에 외부 링크·디시인사이드 후기 인용·근거 및 자료 섹션을 넣지 않음. 입문자에게 다양한 설비 경험과 적성 발견 기회가 될 수 있다는 희망편 메시지 유지.
- 대표 이미지 1-1: a_photorealistic_cinematic_thumbnail_youtube_styl.png(확정한 좌측정렬·객실 청소 빨간색) → /images/facility-series/ep1-1-despair/01-hero.webp (1440×1080, SHA-256 a24b84158073819980e10e16a9ea2a752f049374803e1b80099d20b3983795a2).
- 대표 이미지 1-2: 호텔_시설관리_희망편.png(최종 ‘이런 장점도 있다?’) → /images/facility-series/ep1-2-hope/01-hero.webp (1440×1080, SHA-256 8d967c8ded87d05b689481d822752d9a490162efe30d655fd874b7e2ad356a09).
- 이 파일 경로와 해시는 CHAT 실행 환경에서 생성된 파일을 기준으로 한다. 현재 GitHub에는 이 두 이미지 바이너리가 없음.

## 배포 전 필수 미완료

1. 두 WebP 파일을 GitHub의 위 public 경로에 실제 추가하고 Git blob의 SHA-256을 대조.
2. 공개 전 src/content/facility에 복사하고 각 Markdown에 대표 이미지의 figure (width=1440, height=1080)와 고유 alt 삽입.
3. 현재 시설 공개 스키마 src/content.config.ts는 published 상태에서 sources 1개 이상을 요구한다. 사용자 요청을 어기지 않으면서 근거 메타데이터·화면 표시 여부를 정합적으로 처리. **디시 후기를 출처로 사용하거나 외부 출처 링크를 공개 본문에 표시하지 않음.** 추측으로 인용·수치를 만들어 schema를 만족시키지 않음.
4. 두 원고를 status: published로 전환하고 publishedAt/updatedAt/reviewedAt을 실제 배포 날짜로 정렬.
5. 기존 0화 공개 URL 보호, 신규 개별 URL /facility-management/career/hobyeongbaekma-hotel-despair/ 및 /facility-management/career/hobyeongbaekma-hotel-hope/ 의 자기 canonical, Article, 목록/사이트맵/관련 카드 확인.
6. npm run build, 관련 SEO 및 public content 검사, 320/390/768/1440 px 화면과 이미지 표시 QA.
7. CI PASS 및 사용자 승인 범위 확인 후 PR 병합 → GitHub Pages 배포 성공 → 2개 URL/썸네일 실제 Production 확인.
8. AI_HANDOVER.md 현재 Snapshot 교체 갱신.

## 검증된 상태

- 콘텐츠 초안 2개가 별도 브랜치에서 생성됨.
- 확정 이미지 WebP 생성 및 SHA-256 기록만 완료. Git 바이너리 업로드/CI/병합/배포/Production 확인은 미완료.
- CHAT 연결 GitHub 도구는 텍스트 파일을 쓰지만 로컬 이미지 바이너리를 GitHub에 직접 전송하는 경로가 없어 배포를 진행하지 않음. 원고를 src/content/facility에 draft로 두면 구형 고정 파일 목록 CI가 실패하므로 docs/drafts로 이동하여 기존 공개 소스 불변을 유지함. 이 두 개 새 공개 페이지를 실제 추가할 때는 관련 고정 목록 기반 검사를 신중하게 확장하여 이전 기준을 보호해야 함.

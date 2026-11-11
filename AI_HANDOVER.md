# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-11 KST** · 호병백마 **병원 ep.2-1 절망편 / ep.2-2 희망편 게시 및 GitHub Pages 배포 성공**.
- 현재 제품 기준: `main`, [PR #271](https://github.com/syjy813/getpasslab/pull/271) squash 병합 제품 커밋 **`f1d6536b57f291606f018883bdbad3bda3cfe0e9`**.
- 배포 기준: [GitHub Pages run 42954859132](https://github.com/syjy813/getpasslab/actions/runs/42954859132), Build/Deploy 모두 `completed/success`, Deploy job `130307657164`에서 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인.
- 운영 문서 갱신은 `[skip ci]`로 별도 반영해 제품 재배포를 발생시키지 않는다.

## 이번 작업 상태

사용자 승인 범위: 병원편 최종 원고 2편과 확정 썸네일 2장을 게시하고 실서버까지 반영.

| 단계 | 상태 |
|---|---|
| 원고 | **완료** · `src/content/facility/hobyeongbaekma-hospital-despair.md`, `hobyeongbaekma-hospital-hope.md`, 두 글 모두 `status: published`, `publishedAt/updatedAt/reviewedAt: 2026-11-11` |
| 썸네일 | **완료** · 1440×1080 WebP 2장. 절망편 SHA-256 `83a1ea84729f1da333f2fdbe8859ef22deff6a13ad4bb4f603e310bdf948a516`, 희망편 `3e42d821e7ba280681e6fa5014a40eecf957a8517330d16e428d434e3d4d6f43` |
| PR / CI | **완료** · PR #271 HEAD `6fde7e0c`, SEO / 호병백마 / 시설 공개 / 자격증 탐색 / 소방 회귀 **5개 모두 PASS** |
| Git | **완료** · PR #271 squash 병합 → 제품 커밋 `f1d6536b` |
| Pages | **완료** · run 42954859132 Build/Deploy 모두 success |
| 배포 Artifact | **PASS** · Artifact ID `13826751730`. 두 HTML, 두 WebP, sitemap 존재. 각 페이지 자기 canonical, 상호 링크 확인. 배포 WebP SHA가 승인 파일과 일치 |
| Production 직접 화면 QA | **추가 확인 필요** · Pages 배포 성공은 확정. 현재 외부 HTTP/Web 도구에서는 GetPassLab URL 직접 조회가 제한되어 최신 200 응답·CDN 실파일·PC/모바일 육안 화면을 별도 확인하지 못함 |

## 공개 URL

- 병원 ep.2-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-despair/
- 병원 ep.2-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-hope/
- 시리즈 ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/
- 호텔 ep.1-1: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-despair/
- 호텔 ep.1-2: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-hope/

## 병원편 근거·구조

- 내부 검토 문서: `docs/drafts/facility/hobyeongbaekma/episode02-hospital-source-review.md`
- 기존 조사 46건 중 병원 관련 8건을 재검토. 익명 후기의 실제 근무 사실을 인증한 것으로 쓰지 않으며 직영/용역·전기/기계/건축·병원 규모를 일반화하지 않음.
- 공식 직무 예시는 ALIO 공공병원 직무기술서로 보강하고, 개별 기관 사례라는 범위를 메타데이터에 명시.
- 공개 본문에는 디시 원문 링크나 내부 '근거 및 자료' 섹션을 노출하지 않음.

## 보호된 기존 상태

- ep.0 안내문 제거·호텔 ep.1-1 연결: PR #270, 제품 `83cd2b0e`.
- 호텔 2부작: PR #264, 대표 이미지·본문·URL 유지.
- 일반 시설 대표 이미지 및 자격증 영역은 이번 병원편 게시에서 의도적 변경 없음.

## 미완료 / 다음 행동

1. 실서버 접근 가능한 브라우저에서 병원 2개 URL을 강력 새로고침해 제목·썸네일·상호 링크·관련 카드·표·PC/모바일 가로넘침을 육안 확인한다.
2. 필요하면 CDN에서 두 WebP를 직접 내려받아 위 승인 SHA와 대조한다.
3. Production 직접 QA가 끝나면 해당 결과를 제품 `f1d6536b` / Pages run `42954859132`과 연결해 Snapshot을 갱신한다.
4. 다음 호병백마 편은 백화점 또는 마트 자료 검토부터 진행한다.

## 근거

- [PR #271](https://github.com/syjy813/getpasslab/pull/271)
- [Pages run 42954859132](https://github.com/syjy813/getpasslab/actions/runs/42954859132)
- `docs/audits/2026-11-11-hospital-two-parter/README.md`, `manifest.json`

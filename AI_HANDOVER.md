# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-12 KST** · 호병백마 **백화점 ep.3-1 절망편 / ep.3-2 희망편과 최종 썸네일 2장 Production 배포 성공**.
- 제품 기준: `main`, [PR #273](https://github.com/syjy813/getpasslab/pull/273) squash 병합 제품 커밋 **`073943106dd01eda69938eb4055b24ab59f2c67d`**.
- 배포 기준: [GitHub Pages run 43140288305](https://github.com/syjy813/getpasslab/actions/runs/43140288305), Build/Deploy 모두 `completed/success`. Deploy job `130925572209`에서 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인.
- 운영 문서 갱신은 `[skip ci]` 커밋으로 별도 반영해 제품 재배포를 발생시키지 않는다.

## 이번 작업 결과

사용자 요청: 백화점 절망편·희망편을 기존 병원편과 동일한 시리즈 구조로 제작하고, 리뉴얼·입퇴점·야간작업 및 변경관리 경험을 보강한 뒤 썸네일 포함 실서버 배포.

| 단계 | 상태 |
|---|---|
| 원고 | **완료** · `src/content/facility/hobyeongbaekma-department-store-despair.md`, `hobyeongbaekma-department-store-hope.md`, 두 글 모두 `status: published`, `publishedAt/updatedAt/reviewedAt: 2026-11-12` |
| 절망편 핵심 | **완료** · 영업 중 민원 + 폐점 후 행사·리뉴얼·입퇴점·점검이 겹치는 시간 구조, 전기/기계 파트 차이, 교대·당직, 용역 구조, 면접 체크리스트 반영 |
| 희망편 핵심 | **완료** · 대형 상업시설의 파트 분업, 행사 전기·정기 점검·기록, 리뉴얼·입퇴점 시 기존 설비와 새 공간을 연결하는 변경관리 경험, 외주업체·입점매장·영업부서 조율 경험 반영 |
| 근거 | **완료** · 기존 백화점 후기 재검토 + 「유통산업발전법」 대규모점포 구조 + 신세계 MD개편/리뉴얼 정책 + 현대백화점 폐점 후 작업 운영 맥락 사용. 시설팀 직접 시공 의무로 확대하지 않음 |
| 썸네일 | **완료** · 1440×1080 WebP 2장. 절망편 SHA-256 `f2adf5a160cd34f29d57e1e80dff6aaf43744f2cf24a651afd57b0f6d214f62c`, 희망편 `610889534186260339f2df39b186690fb9b2d50174c4455cf87fb56fad2bed32` |
| PR / 사전 QA | **완료** · PR #273 최종 HEAD `85f09045`; SEO / 호병백마 / 시설 공개·반응형 / 자격증 탐색 / 소방 회귀 **5개 모두 PASS** |
| Git | **완료** · PR #273 squash 병합 → 제품 `07394310` |
| Pages | **완료** · run 43140288305 Build/Deploy success |
| 배포 Artifact | **PASS** · Artifact ID `13909631130`, Pages 게시 산출물 생성 완료 |
| Production 직접 화면 QA | **도구 제한으로 미확인** · GitHub Pages 배포 성공 및 환경 URL은 확인. 외부 운영 URL의 최신 HTTP 200·PC/모바일 실제 화면은 별도 육안 확인 필요 |
| 배포 후 전역 회귀 QA | **진행 중** · 제품 `07394310` 대상으로 workflow_run 10개 시작. Snapshot 작성 시 10개 모두 진행 중, 실패 없음 |

## 공개 URL

- 백화점 ep.3-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-department-store-despair/
- 백화점 ep.3-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-department-store-hope/
- 병원 ep.2-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-despair/
- 병원 ep.2-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-hope/
- 시리즈 ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 보호된 기존 상태

- 병원편 법적 시설기준 보강: PR #272, 제품 `7ae5e4ad`.
- 병원편 최초 발행·썸네일: PR #271.
- 호텔 2부작: PR #264.
- ep.0: PR #270. 이번 백화점 배포에서 기존 호텔·병원·ep.0 URL과 이미지 의도적 변경 없음.

## 다음 행동

1. 배포 후 전역 회귀 QA 10개 종료 상태를 제품 `07394310`과 연결해 확인한다.
2. 실서버 접근 가능한 브라우저에서 백화점 두 글의 신규 썸네일, H2, 표, 상호 링크, 320/390/768/1440 화면을 육안 확인한다.
3. 다음 호병백마 편은 마트 ep.4 절망편/희망편 자료 검토부터 진행한다.

## 근거

- [PR #273](https://github.com/syjy813/getpasslab/pull/273)
- [Pages run 43140288305](https://github.com/syjy813/getpasslab/actions/runs/43140288305), Artifact ID `13909631130`
- 제품 커밋 `073943106dd01eda69938eb4055b24ab59f2c67d`
- 내부 근거 검토: `docs/drafts/facility/hobyeongbaekma/episode03-department-store-source-review.md`

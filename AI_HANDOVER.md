# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-11 KST** · 호병백마 병원편에 **수술실·중환자실 법적 시설기준 + 실무적 해석**을 보강하고 Production 재배포 성공.
- 제품 기준: `main`, [PR #272](https://github.com/syjy813/getpasslab/pull/272) squash 병합 제품 커밋 **`7ae5e4ad6be8b5676541507212994022fed2ad8a`**.
- 배포 기준: [GitHub Pages run 43021958944](https://github.com/syjy813/getpasslab/actions/runs/43021958944), Build/Deploy 모두 `completed/success`. Deploy job `130527464646`에서 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인.
- 운영 문서 갱신은 `[skip ci]` 커밋으로 별도 반영해 제품 재배포를 발생시키지 않는다.

## 이번 작업 목적과 결과

사용자 요청: 후기 기반 병원편에 병원 특유의 민감한 진료환경을 보강. 절망편에는 수술실·중환자실과 연결된 설비 이상 대응의 긴장감, 희망편에는 공조·전원·가스 계통의 연결을 이해하는 경험을 추가하고 **현행 법적 시설기준도 함께 제시**.

| 단계 | 상태 |
|---|---|
| 법령 검증 | **완료** · 2026-11-11 기준 현행 「의료법 시행규칙」(2026-06-12 시행) 제34조·별표 4 확인. 중환자실의 무정전 시스템·중앙공급식 의료가스·격리/음압격리병실, 수술실의 공기정화설비·의료가스·예비전원설비를 공식 근거로 사용 |
| 절망편 | **완료** · `## 수술실·중환자실은 왜 설비 이상을 가볍게 넘기기 어렵나` 추가. 법적 시설규격과 '관련 설비 이상을 가볍게 넘기기 어려운 부담'이라는 실무적 해석을 명시적으로 구분 |
| 희망편 | **완료** · `## 예민한 공간을 지원하면 설비를 보는 눈이 달라질 수 있다` 추가. 담당 범위에서 공조·전원·가스 계통의 영향 범위·보고·인계를 배우는 것이 시스템 이해로 이어질 수 있다는 가정을 추가하고 자동 전문성 획득으로 단정하지 않음 |
| 담당 범위 경계 | **완료** · 법령은 의료기관의 시설규격이며 특정 시설관리 직원이 모든 설비를 직접 운전·정비해야 한다는 뜻이 아님을 공개 본문에 명시. 실제 담당은 병원 조직·자격·외주계약·업무분장에 따라 별도 확인 |
| PR / 사전 QA | **완료** · PR #272 최종 HEAD `a966aa7b`; SEO / 호병백마 / 시설 공개·반응형 / 자격증 탐색 / 소방 회귀 **5개 모두 PASS** |
| Git | **완료** · PR #272 squash 병합 → 제품 `7ae5e4ad` |
| Pages | **완료** · run 43021958944 Build/Deploy success |
| 배포 Artifact | **PASS** · Artifact ID `13854723784`. 절망편/희망편 HTML에 각각 신규 H2·「의료법 시행규칙」·무정전 시스템·공기정화설비·실무적 해석/가정 문자열 확인. 자기 canonical·sitemap 확인 |
| 썸네일 보호 | **PASS** · 절망편 SHA-256 `83a1ea84729f1da333f2fdbe8859ef22deff6a13ad4bb4f603e310bdf948a516`, 희망편 `3e42d821e7ba280681e6fa5014a40eecf957a8517330d16e428d434e3d4d6f43`; 배포 Artifact에서도 동일 |
| Production 직접 HTTP/화면 | **도구 제한으로 미확인** · GitHub Pages 자체 배포 성공과 환경 URL은 확정. 현재 web 도구가 GetPassLab 운영 URL 직접 조회를 거부해 최신 HTTP 200·실제 브라우저 렌더를 별도 증거로 확보하지 못함 |
| 배포 후 전역 회귀 QA | **진행 중** · 제품 `7ae5e4ad` 대상으로 workflow_run 10개 시작. Snapshot 작성 시 Practice UI / Earth retaining / FTA symbols / Industrial remaining splits 4개 PASS, 나머지 6개 진행 중. 실패 발생 시 별도 원인 확인 필요 |

## 공개 URL

- 병원 ep.2-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-despair/
- 병원 ep.2-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-hope/
- 시리즈 ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 보호된 기존 상태

- 병원편 최종 썸네일·본문 게시: PR #271, 제품 `f1d6536b`, Pages run 42954859132. 이번 PR #272에서 이미지 파일과 공개 URL은 변경하지 않음.
- ep.0 안내문 제거·호텔 ep.1-1 연결: PR #270.
- 호텔 2부작: PR #264. 이번 작업에서 호텔 본문·이미지·URL 변경 없음.

## 다음 행동

1. 배포 후 전역 회귀 QA 10개가 모두 종료되면 성공/실패를 제품 `7ae5e4ad`과 연결해 확인한다.
2. 실서버 접근 가능한 브라우저에서 병원 두 글을 강력 새로고침하고 신규 H2, 법령 문구, 표/본문 가로넘침, 썸네일, 상호 링크를 PC·모바일에서 육안 확인한다.
3. 법령 개정 시 제34조·별표 4의 시행일과 시설규격을 다시 확인하고 두 글의 요약·본문·source metadata를 함께 갱신한다.

## 근거

- [PR #272](https://github.com/syjy813/getpasslab/pull/272)
- [Pages run 43021958944](https://github.com/syjy813/getpasslab/actions/runs/43021958944), Artifact ID `13854723784`
- 제품 커밋 `7ae5e4ad6be8b5676541507212994022fed2ad8a`
- 내부 병원 근거 검토: `docs/drafts/facility/hobyeongbaekma/episode02-hospital-source-review.md`

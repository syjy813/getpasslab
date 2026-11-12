# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-12 KST** · 호병백마 **마트 ep.4-1 절망편 / ep.4-2 희망편과 시리즈 통일 썸네일 2장 Production 배포 성공**.
- 제품 기준: `main`, [PR #274](https://github.com/syjy813/getpasslab/pull/274) squash 병합 제품 커밋 **`0f6cb3503f991cb22bedbd1ca3a1e4a3d1997fa6`**.
- 배포 기준: [GitHub Pages run 43152644190](https://github.com/syjy813/getpasslab/actions/runs/43152644190), Build/Deploy 모두 `completed/success`. Deploy job `130965469040`에서 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인.
- 운영 문서 갱신은 `[skip ci]` 커밋으로 별도 반영해 제품 재배포를 발생시키지 않는다.

## 이번 작업 결과

사용자 요청: 호병백마 마지막 시설 유형인 마트 절망편·희망편을 제작하고, 기존 병원·백화점과 통일된 시리즈 썸네일을 적용해 실서버 배포.

| 단계 | 상태 |
|---|---|
| 원고 | **완료** · `src/content/facility/hobyeongbaekma-mart-despair.md`, `hobyeongbaekma-mart-hope.md`, 두 글 모두 `status: published`, 날짜 `2026-11-12` |
| 절망편 핵심 | **완료** · 폐점 후 공사·당직, 실질 휴게, 냉장·냉동 이상 대응, 전기·냉동·영선·제설 등 넓은 업무범위, 용역/경력증빙, 반대 사례 반영 |
| 희망편 핵심 | **완료** · 냉동·냉장·제상·원격감시, 경보→현장확인→보고→업체협업→복구확인→기록, 공조냉동 이론과 실제 설비 연결, 검침·외주 협업·경력증빙 반영 |
| 근거 | **완료** · 기존 마트 후기 재검토 + 현행 「유통산업발전법」 + 「식품위생법」 제7조 + 「식품의 기준 및 규격」. 시설직 개인의 식품안전 책임으로 확대하지 않음 |
| 썸네일 | **완료** · 기존 호병백마 절망/희망 디자인 계열과 통일한 1440×1080 WebP. 절망편 SHA-256 `b092c1078f554251cfb29448bdc23db96abd4debf905865e16fd40a4531c778b`, 희망편 `0378c000a85565d64b3283660319860930adec3c642a13f7afb6db7a6447ceb1` |
| PR / 사전 QA | **완료** · PR #274 최종 HEAD `d8f9227d`; SEO / 호병백마 / 시설 공개·반응형 / 자격증 탐색 / 소방 회귀 **5개 모두 PASS** |
| Git | **완료** · PR #274 squash 병합 → 제품 `0f6cb350` |
| Pages | **완료** · run 43152644190 Build/Deploy success |
| 배포 Artifact | **PASS** · Artifact ID `13914323321`. 마트 두 HTML, 상호 링크·canonical·sitemap 확인. 배포 WebP SHA가 승인 파일과 정확히 일치 |
| 배포 후 전역 회귀 QA | **진행 중** · 제품 `0f6cb350` 대상으로 workflow_run 10개 시작. Snapshot 작성 시 Practice UI 1개 PASS, 나머지 9개 진행 중, 실패 없음 |
| Production 직접 화면 QA | **별도 육안 확인 권장** · Pages 환경 배포 성공과 게시 Artifact는 확정. 실제 사용자 브라우저에서 캐시 갱신 후 모바일/PC 크롭·본문 표시를 최종 육안 확인하면 됨 |

## 공개 URL

- 마트 ep.4-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-mart-despair/
- 마트 ep.4-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-mart-hope/
- 백화점 ep.3-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-department-store-despair/
- 백화점 ep.3-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-department-store-hope/
- 병원 ep.2-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-despair/
- 병원 ep.2-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-hope/
- 시리즈 ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 보호된 기존 상태

- 백화점 2부작: PR #273, 제품 `07394310`.
- 병원 법적 시설기준 보강: PR #272; 최초 발행·썸네일: PR #271.
- 호텔 2부작: PR #264.
- ep.0: PR #270.
- 이번 마트 배포에서 기존 호텔·병원·백화점 본문·이미지·공개 URL은 의도적으로 변경하지 않음. 최신 6개 홈 카드 슬라이스 특성상 호텔 카드는 시설 홈에서 밀리고 커리어 카테고리에는 유지됨.

## 다음 행동

1. 배포 후 전역 회귀 QA 10개 종료 상태를 제품 `0f6cb350`과 연결해 확인한다.
2. 사용자 브라우저에서 마트 두 글을 강력 새로고침하고 최종 썸네일·본문·표·상호 링크를 모바일/PC에서 육안 확인한다.
3. 호병백마 ep.0~4 전체 시리즈의 연결 구조·목록 순서를 필요 시 최종 점검한다.

## 근거

- [PR #274](https://github.com/syjy813/getpasslab/pull/274)
- [Pages run 43152644190](https://github.com/syjy813/getpasslab/actions/runs/43152644190), Artifact ID `13914323321`
- 제품 커밋 `0f6cb3503f991cb22bedbd1ca3a1e4a3d1997fa6`
- 내부 근거 검토: `docs/drafts/facility/hobyeongbaekma/episode04-mart-source-review.md`

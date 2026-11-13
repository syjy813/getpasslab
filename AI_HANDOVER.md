# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-13 KST** · 호병백마 병원 ep.2-3 대학·대형병원 시설직 콘텐츠 Production 배포 성공.
- 제품 기준: `main`, [PR #275](https://github.com/syjy813/getpasslab/pull/275) squash 병합 제품 커밋 **`a25acff4dc772b9dd12f5910584fe527bf40edd4`**.
- 배포 기준: [GitHub Pages run 43337873601](https://github.com/syjy813/getpasslab/actions/runs/43337873601), Build/Deploy 모두 `completed/success`. Deploy 로그에서 제품 `a25acff4`의 Pages deployment 생성 후 `Reported success!`, 환경 URL `https://getpasslab.co.kr/` 확인.
- 배포 Artifact: **ID `13997268692`**, digest `sha256:59781a1b4fd174210c762a06139852ef3b4d269e05fab23182a48ee59c162773`.
- 운영 문서 갱신은 `[skip ci]` 커밋으로 별도 반영해 제품 재배포를 발생시키지 않는다.

## 이번 작업 결과 — 호병백마 병원 ep.2-3

사용자 요청: 대학·대형병원 시설직의 장점과 지원·면접 단계 확인 조건을 정리한 병원 ep.2-3을 최종 썸네일과 함께 실서버 배포.

| 단계 | 상태 |
|---|---|
| 공개 원고 | **완료** · `src/content/facility/hobyeongbaekma-hospital-large-university.md` · 제목 `[호병백마 ep.2-3] 병원도 다 같은 병원이 아니다｜대학·대형병원 시설직은 왜 따로 봐야 할까?` |
| 핵심 흐름 | **완료** · 대학·대형병원의 복지·고용·조직·설비 경험 장점 → 같은 병원 안의 직군/고용구조 차이 → 지원·면접 단계부터 조건 확인 |
| 조건 카드 | **완료** · 기존 검증된 시설 카드 UI 재사용. 고용주 / 직군 / 고용형태 / 보수·연금 / 복리후생 / 실제 업무·장기근속 **6개 카드** |
| 근거 | **완료** · 서울대학교병원 2026 하반기 채용의 기술직 기계 J1·시설지원직 기계 SA1 구분, 강원대학교병원 업무협력직 사례, 서울아산병원 복리후생 안내. 대학·대형병원 전체로 일반화하지 않음 |
| 썸네일 | **완료** · 사람 제거, `변외편` 문구 제거, `대학·대형병원은 어떨까?` 확정. 1440×1080 WebP, SHA-256 `184def5eb152d17238e77914709adcb8948c73449b9060b4d359bd5fb4e300e1` |
| 사전 QA | **PASS** · 최신 HEAD `c98eea5d`: SEO / 호병백마 / 시설 publication·private-preview / 자격증 탐색 PASS. 병원 responsive QA는 **3페이지 × 320·390·768·1440px PASS** |
| 소방 회귀 | **PASS 증거 재사용** · 같은 작업 HEAD `11067f39`, run `43335286662` success. 이후 변경은 시설 ep.2-3 본문·시설 전용 카드 매핑·시설 QA/가드뿐이며 소방 콘텐츠·공용 레이아웃·의존성 변경 없음 |
| Git | **완료** · PR #275 squash 병합 → 제품 `a25acff4` |
| Pages | **완료** · run `43337873601`, Build/Deploy success |
| 배포 Artifact QA | **PASS** · 새 HTML 존재, canonical 정확, sitemap 포함, 6개 조건 카드, 병원 ep.2-1/2-2 링크, hero 경로 확인. 배포 WebP 1440×1080 및 승인 SHA-256 정확히 일치 |
| Production 직접 HTTP | **환경 한계** · 현재 실행환경의 외부 DNS에서 `getpasslab.co.kr` 직접 조회가 실패해 실도메인 HTTP 육안 확인은 수행하지 못함. 대신 GitHub Pages deployment success + 실제 배포 Artifact를 제품 커밋과 연결해 검증함 |

## 공개 URL

- 병원 ep.2-3: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-large-university/
- 병원 ep.2-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-despair/
- 병원 ep.2-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hospital-hope/
- 시리즈 ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/

## 보호된 최근 상태

- Google 검색 브랜딩 작업: PR #276, 제품 `662ca57371d08d6b417e8feec6a339fba6930348`, Pages run `43337329786` success. 이번 ep.2-3 병합은 당시 최신 `main` 위에 정상 병합됨.
- 마트 ep.4: PR #274, 제품 `0f6cb350`.
- 백화점 ep.3: PR #273.
- 병원 ep.2-1/2-2: PR #271/#272.
- 호텔 ep.1: PR #264.
- ep.0: PR #270.
- 이번 작업에서 기존 공개 URL·기존 호병백마 본문·이미지는 변경하지 않음. 홈 최신 6개 슬라이스에는 새 ep.2-3가 들어오며 기존 병원 카드 중 1개만 남는 동작을 회귀 QA에서 명시적으로 검증함.

## 다음 행동

1. 사용자 브라우저에서 ep.2-3를 강력 새로고침해 실제 도메인의 최종 썸네일·6개 카드 표시를 한 번 육안 확인하면 Production 확인이 완결됨.
2. Google 검색 브랜딩 변경은 별도 재크롤링 반영 여부를 계속 구분해 판단한다.

## 근거

- [PR #275](https://github.com/syjy813/getpasslab/pull/275)
- [Pages run 43337873601](https://github.com/syjy813/getpasslab/actions/runs/43337873601), Artifact ID `13997268692`
- 제품 커밋 `a25acff4dc772b9dd12f5910584fe527bf40edd4`
- 내부 근거 검토: `docs/drafts/facility/hobyeongbaekma/episode02-3-hospital-employment-structure-source-review.md`
- Release manifest: `docs/audits/2026-11-13-hospital-ep2-3/manifest.json`

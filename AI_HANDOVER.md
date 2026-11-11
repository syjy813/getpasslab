# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 과거 작업·상세 검증은 Git PR·Actions·[audits](docs/audits/)를 정본으로 참조하며, 오래된 전체 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)에 보존한다.

## 기준 상태

- 최종 갱신: **2026-11-11 KST** · **호병백마 ep.0 안내문 삭제 및 ep.1-1 연결 배포 성공**. 실서버 직접 브라우저/HTTP 응답은 접근 제한으로 아직 미확인.
- 현재 제품 기준: `main`, [PR #270](https://github.com/syjy813/getpasslab/pull/270) squash 병합 제품 커밋 `83cd2b0eeec488b5f4652bce177fd888cf4c4edf`. 운영 상태 문서 갱신은 별도 `[skip ci]` 커밋으로 반영하고 제품 재배포를 발생시키지 않는다.
- 배포 기준: [GitHub Pages run 42933900188](https://github.com/syjy813/getpasslab/actions/runs/42933900188) · 위 제품 커밋, Build/Deploy 각각 `completed/success`, GitHub Pages Artifact `github-pages` ID `13817855931`.
- 실제 로컬 checkout의 uncommitted/untracked 상태는 미조회. GitHub의 현재 main/PR/Actions와 다운로드된 배포 Artifact 기준으로 기록.

## 이번 작업 목적과 상태

사용자 요청: [호병백마 ep.0](https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/) 본문 마지막 빨간 박스의 커뮤니티 경험담 안내문 **전체 삭제**, 마지막에서 [호텔 ep.1-1 절망편](https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-despair/) 연결.

| 단계 | 확인된 상태 |
|---|---|
| 구현 | **완료** · `src/content/facility/hobyeongbaekma.md` 안내문 삭제, `## 다음 편 보기`와 절망편 링크 추가, 관련 콘텐츠 첫 카드에 절망편 추가, `updatedAt: 2026-11-11` |
| 검사기 보완 | **완료** · 승인한 과거 이미지 통합 원본·manifest/이미지/CSS 변경 없이 이번 편집을 별도 허용하도록 `scripts/read-hobyeongbaekma-publication.mjs` 및 `test-hobyeongbaekma-integrated-images.mjs` 보완. `check-hobyeongbaekma-publication.mjs`, `qa-hobyeongbaekma-review.cjs`에서 안내문 삭제·본문 이동·관련 카드·모바일 화면 추가 검증 |
| PR / QA | **5개 모두 PASS** · [SEO 42932480829](https://github.com/syjy813/getpasslab/actions/runs/42932480829), [호병백마 전용 42932480785](https://github.com/syjy813/getpasslab/actions/runs/42932480785), [시설 공개/비공개 42932480824](https://github.com/syjy813/getpasslab/actions/runs/42932480824), [자격증 탐색 42932480832](https://github.com/syjy813/getpasslab/actions/runs/42932480832), [소방 42932480828](https://github.com/syjy813/getpasslab/actions/runs/42932480828). 검증 HEAD `1fbd498c254add46a0678d6e2081d9bca990b251` |
| Git | **완료** · [PR #270](https://github.com/syjy813/getpasslab/pull/270) squash 병합 `83cd2b0e`, 변경 파일 5개(원고 1개, 검사기 4개) |
| Pages | **Build/Deploy 성공** · [run 42933900188](https://github.com/syjy813/getpasslab/actions/runs/42933900188) 커밋 `83cd2b0e`, build/deploy jobs success |
| 배포 Artifact 실물 | **PASS** · ZIP 내 `artifact.tar`에서 ep.0 HTML 직접 파싱: 옛 안내문 문자열 0회, 다음 편 제목 및 ep.1-1 상대링크, 첫 관련 콘텐츠 카드 절망편, 수정일 2026-11-11, ep.0 이미지 4개 유지, ep.0 자기 canonical, 기존 ep.1-1·1-2 HTML·시설 홈/취업 목록 존재, 두 sitemap에 ep.0 및 ep.1-1 주소 포함 |
| Production 직접 QA | **추가 확인 필요** · GitHub Pages의 배포 success는 확인했지만 외부 HTTP 도구 및 실행 컨테이너에서 `getpasslab.co.kr` 직접 조회 실패(DNS/접근 제한). 연결 브라우저에서 읽은 ep.0 탭은 **배포 전(수정 2026-11-08) 상태로 열려 있는 미갱신 탭**이므로 최신 Production 검증 증거로 쓰지 않음. 새 URL의 HTTP 200·CDN SHA 및 PC/모바일 실제 화면을 PASS로 주장하지 않음 |

## 공개 URL

- ep.0: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma/
- ep.1-1 절망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-despair/
- ep.1-2 희망편: https://getpasslab.co.kr/facility-management/career/hobyeongbaekma-hotel-hope/

## 보호된 직전 작업

- [PR #264](https://github.com/syjy813/getpasslab/pull/264): 호텔 절망편·희망편 확정 원고/대표 이미지 동시 발행. 2026-11-11 [Pages run 42810573395](https://github.com/syjy813/getpasslab/actions/runs/42810573395) Attempt 4에서 Build/Deploy 성공. 3회 실패한 과거 attempt는 이력으로 보존. 이번 PR #270에서 두 호텔 본문·WebP·URL 변경 없음.
- [PR #263](https://github.com/syjy813/getpasslab/pull/263): ep.0 이미지 6→3 통합(대표 포함 본문 이미지 4), 과거 배포/PC·모바일 QA 완료. 이번 수정에서도 이 이미지/원본 감사/manifest 변경 없음.
- [PR #269](https://github.com/syjy813/getpasslab/pull/269): 일반 시설 대표 이미지 폰트 재통일. ep.0 디자인과 별개이며 수정 없음.
- [PR #261](https://github.com/syjy813/getpasslab/pull/261): 운영 문서 v2.2 경량화 및 레거시 보존.

## 미완료·다음 행동

1. **최우선: ep.0와 ep.1-1의 최신 Production 직접 QA.** 실서버 접근 가능한 브라우저에서 ep.0 강력 새로고침 후 안내문 부재, `다음 편 보기` 링크 클릭 후 ep.1-1 정상 200·대표 이미지 표시, 첫 관련 카드 이동, PC/모바일 가로넘침·이미지 로딩·화면 깨짐, 다른 ep.0/ep.1-2 링크 영향 확인. 실제 CDN WebP SHA가 필요하면 직접 내려받아 승인 hash 대조.
2. 병합·배포 후 자동 트리거된 전역 회귀 QA는 [Actions](https://github.com/syjy813/getpasslab/actions)에서 해당 제품 `83cd2b0e` 기준 결과 확인. 이 검사를 이번 호병백마 실서버 육안 QA와 혼동하지 않음.
3. 직접 QA 결과·오류가 나오면 기준 커밋과 함께 갱신. 이후 호병백마 병원·백화점·마트 편 등 후속 시리즈 기획/집필 검토.

## 근거

- [PR #270](https://github.com/syjy813/getpasslab/pull/270), QA 5개 링크(위 표), [Pages run 42933900188](https://github.com/syjy813/getpasslab/actions/runs/42933900188), Artifact ID `13817855931`, 제품 `83cd2b0e`.
- [호병백마 ep.0 통합 이미지 audit](docs/audits/2026-11-08-hobyeongbaekma-integrated-images/README.md), [호텔 2부작 audit](docs/audits/2026-11-10-hotel-two-parter/README.md).

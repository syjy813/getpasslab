# GetPassLab — 현재 상태 Snapshot

실행 지침은 [AGENTS.md](AGENTS.md). 상세 이력·검증은 PR·Actions·[audits](docs/audits/), 과거 인계는 [레거시 문서](docs/archives/AI_HANDOVER.legacy-2026-11-08.md)를 참조한다.

## 현재 작업 — GA4 시설관리 게시글 조회수 적재·정렬

- 갱신: **2026-11-15 KST**. 작업 브랜치 `chore/ga4-auth-connection`, [PR #278](https://github.com/syjy813/getpasslab/pull/278). 인증 완료 체크포인트부터 누적 조회수 적재와 카테고리 목록 정렬까지 이어서 구현했다.
- 인증: Google Cloud **결제 계정 미연결**, 키 없는 WIF 인증, 300초 `analytics.readonly` 토큰, GA4 Viewer 권한 제한 유지. [run 43697865632](https://github.com/syjy813/getpasslab/actions/runs/43697865632) 인증 성공을 재사용.
- 적재: [run 43705923328](https://github.com/syjy813/getpasslab/actions/runs/43705923328) **completed/success**. 공개 글 **24개 중 9개 기록 확인, 누적 48회**, 나머지 15개는 조회 기록 없음. 기간 **2026-07-30~2026-11-14**, 속성 시간대 `Asia/Seoul`. 전체 사이트 5,441회와 구분.
- 데이터: `src/data/facility-page-views.json`. 전체 페이지네이션, 발행글 canonical 경로 매칭, 누적값 교체, 불완전한 API 응답 차단, 실패 시 이전 JSON 유지. GitHub API는 해당 JSON 1개만 커밋. [데이터 커밋 8ab1e2b](https://github.com/syjy813/getpasslab/commit/8ab1e2b586303adb19959c51722a7a529d6b3de4).
- 화면: 카테고리 목록에 `최신순`/`조회수순`, 조회 기록 및 기준일 표시 적용. 기존 공개 URL·공통 카드 소스·이미지·본문 보호. 구현 [커밋 e7aded6](https://github.com/syjy813/getpasslab/commit/e7aded63a2528954b07785b7d6a4cb5e7f72978c).
- 검증: 로컬 584페이지 Build PASS, 시설관리 기존 소스/게시 가드 PASS, SEO 오류0·기존 경고5, 공개 콘텐츠 오류0. 로컬 Chromium 소켓 제한으로 실제 UI 클릭 검증 미완료. GitHub Actions Chromium 4폭 검사는 추가했으며 실행 결과 확인 전 PASS로 표시하지 않는다.
- 자동화: main 병합 후 매일 02:13 UTC(11:13 KST) 갱신 예정. **main 병합·Pages 배포·Production QA 미수행**, 별도 사용자 배포 승인 필요.
- 다음: GitHub UI QA 확인·PR 충돌 해소 후 사용자 배포 승인 시 main 병합/Pages/Production 확인. 인증/IAM 재설정 불필요. [기존 인증 상세 Audit](docs/audits/2026-11-15-ga4-auth/README.md).

## 기준 상태

- 갱신: **2026-11-15 KST**. 사수골대 ep.0 공개·실서버 배포·Production HTTP 검증 **완료**.
- 제품: `main@40a4b722ff60cbce62b4179dd9ee2483dcff3ed8`, [PR #277](https://github.com/syjy813/getpasslab/pull/277) squash 병합.
- 검증 HEAD: `0f13ef81e8eec48225253c89a43f59c9e33bd5b0`. 제품과 검증 HEAD의 Git tree는 `2bdc945de595d8b7a349a2cc262c2d1aeda70c98`로 동일하다.
- [Pages run 43697216589](https://github.com/syjy813/getpasslab/actions/runs/43697216589): Build/Deploy **success**. Deploy 로그의 `Reported success!`와 환경 URL 확인.
- 배포 Artifact: `14155381079`, digest `sha256:c23278a66800640cf762018d17aac660d985a52a09802bbb009bb043090af600`.
- 이 상태 문서·검증 기록은 제품 이후 `[skip ci]` 문서 커밋으로 갱신한다. 문서 갱신을 별도 제품 배포로 취급하지 않는다.

## 사수골대 ep.0 결과

| 단계 | 상태·근거 |
|---|---|
| 원고 | **완료** · `src/content/facility/sasugoldae.md`, 제목 `[사수골대 ep.0] 사수골대란 뭘까?` |
| 발행 메타 | **완료** · 발행 2026-11-15, 자료 확인 2026-11-13, Article citation 11개 유지. ep.0의 별도 조사 목록만 화면에서 숨김 |
| 썸네일 | **완료** · PNG 원본 보존, WebP 1448×1086·215,220 bytes, 본문·홈·카테고리 연결 |
| Build·SEO | **PASS** · 584페이지, SEO 오류0·기존 경고5, 공개 콘텐츠 오류0 |
| 화면 QA | **PASS** · 글/홈/카테고리 × 320·390·768·1440px, 목차 이동·가로 넘침·원본 비율·기존 출처 표시 회귀. [run 43696294230](https://github.com/syjy813/getpasslab/actions/runs/43696294230), Artifact `14154274038` |
| 시각 검토 | **완료** · 이전 동일 제품 소스 `1076a5b7`의 Artifact `14153230758`에서 390/1440px 상단·320px 하단·홈 캡처 확인. 이후 제품 소스·설정 변경 없음; 새 HEAD의 화면 CI도 재통과 |
| 공통 CI | **전부 PASS** · SEO, 사수골대, 호병백마, 자격증 탐색, 시설 발행/비공개 미리보기, 소방 전체 회귀. 6개 workflow·7개 job |
| 검사 보완 | **완료** · 신규 글·썸네일 산출물, 카드/출처 정책의 정확한 델타, 취업 카테고리 15개·홈 최신6개 변화 반영. 기존 원본 보호 해시 유지 |
| Production | **PASS** · 새 글·홈·카테고리·이미지·사이트맵·기존2글 HTTP 200. canonical/robots/citation/목록/사이트맵·썸네일 해시 일치 |
| 검증 범위 | 화면은 배포 전 Chromium, 실도메인은 배포 후 HTTP/HTML/이미지 대조. 실도메인의 브라우저 캡처를 수행한 것으로 확대하지 않음 |

공개 URL: https://getpasslab.co.kr/facility-management/career/sasugoldae/

검증 기록: [manifest](docs/audits/2026-11-15-sasugoldae-ep00/manifest.json), [release-validation](docs/audits/2026-11-15-sasugoldae-ep00/release-validation.json), [Production 검증](docs/audits/2026-11-15-sasugoldae-ep00/production-validation.json), [화면 수치](docs/audits/2026-11-15-sasugoldae-ep00/responsive-qa.json).

## 남은 사항·다음 행동

- **이번 ep.0 배포 범위의 미완료 없음.** 기존 SEO 경고5는 유지되며 오류와 구분한다.
- **시리즈 사전 자료 수집은 부분 완료**다. 핵심 후보71건은 독립 근무후기71건을 뜻하지 않는다. 집계·접근 제한·시설별 미달은 [source-index](docs/drafts/facility/sasugoldae/source-index.md)가 정본이다.
- 후속 조사 시 범수방 시설별 원문, 디시 댓글, 사우나/수영장 긍정·부정 직접후기, 대학 고용주·직군·연금과 공고 상세 공백부터 재개한다. 기존71건을 처음부터 재수집하지 않는다.
- 사우나 절망편·희망편 등 후속편 집필·새 배포는 후속 사용자 요청에 따라 진행한다.
- 기존 공개 URL·기존 호병백마 원고/이미지·자격증/문제 데이터는 보호했다. 최신6개 홈 슬라이스에서 기존 병원 일부 카드가 빠져도 카테고리와 상세 URL은 유지된다.
- 이전 병원 ep.2-3 배포 근거는 [기존 manifest](docs/audits/2026-11-13-hospital-ep2-3/manifest.json), PR #275·run 43337873601에 보존한다.

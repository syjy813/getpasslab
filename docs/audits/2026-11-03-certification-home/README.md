# 로고·자격증 토글 메인 통일

기준 main: `8882d40ff082b620fc678dc36cc91ceddd992fdd`. 작업 브랜치: `codex/unify-certification-home-20261103`. 사용자 WEB 수정·검증·PR 반영 승인. 이 수정의 main 병합·Production 배포는 수행하지 않는다.

## 원인과 변경

| 진입점 | 변경 전 | 검토본 |
|---|---|---|
| GetPassLab 로고 | `/` | `/` |
| 자격증의 모든 것 토글 | `/certifications/` | `/` |

`src/components/GNB.astro`의 자격증 토글 href 한 줄을 수정한다. 모든 페이지의 공통 GNB에 적용된다. 기존 메인 콘텐츠·디자인·광고를 그대로 사용하며 `/certifications/` 페이지와 기존 공개 URL도 유지한다. 시설 홈 CTA 등 다른 링크를 일괄 변경하는 작업은 아니다.

## 검증된 변경 범위

- 변경 전 일반 빌드에 native1478파일 보호 검사를 통과시킨 후 전체 기준 파일을 보존했다. 새 빌드는 GNB 소스1개와 일반HTML564개에서 토글 href 한 곳씩만 다르다. 모든 변경 파일이 그 문자열 치환과 정확히 일치함을 확인했다. 파일 추가·삭제0개.
- 변경 없는HTML3개는 소방 문제풀이 전용 페이지와 기존 이동 페이지2개다. sitemap·canonical·메타데이터·본문·문제 데이터·원본 이미지·광고 코드 및 공통 JS/CSS11개는 바이트 동일하다.
- 현재 보호 manifest의 해시/시설 패치 current 부분만 검토한 새 href에 맞게 갱신했다. beforeInventory·beforeSHA256·priorBundles·원본24개 이미지 해시는 그대로이며,기존 선행 바이트로의 역변환 및 임의 바이트 변경 거부 검사 유지. [전체 차이 해시](delta.json).
- Build565페이지/567HTML PASS. SEO563URL·오류0·기존 소방 description161자 경고1,공개 문구 오류0,native1478파일,시설 내부 링크77개 PASS. `git diff --check`·QA 구문 확인 PASS.

## PC·모바일 클릭 검증

기존 `qa-facility-launch.cjs`의 클릭 기대 주소를 `/`로 정정했다. 시설 홈에서 자격증 토글을 누르고 주소와 메인 H1을 저장한 뒤,시설 홈으로 돌아와 로고를 눌러 같은 주소·같은 H1인지 비교한다. 320·390·768·1440px 네 폭에서 실행한다.

실제 도착지인 `/`를 기존 검수 목록에 포함해 각 모드13페이지×4폭=52조건을 확인하고,자격증 메인 캡처도 남긴다. `/certifications/` 기존 페이지도 계속 검수한다. publication/private-preview 두 모드를 CI에서 검사하며,브라우저 실제 결과는 새 PR head의 Actions/모드별 artifact를 확인한다. 구현·정적 검사 결과와 CI 완료를 혼동하지 않는다.

## 보고 및 배포 경계

검토본 Commit·Push·Draft PR까지만 진행한다. 현재 실서버는 직전 시설 오픈 버전이며,이 링크 수정의 실서버 반영은 별도 사용자 배포 승인 이후다. 이후 배포 시에는 PC·모바일에서 로고와 토글을 직접 눌러 같은 메인으로 이동하는지 확인한다.

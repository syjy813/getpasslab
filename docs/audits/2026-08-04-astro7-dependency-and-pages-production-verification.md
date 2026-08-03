# Astro 7 의존성·GitHub Pages production 검증

- 검증일: 2026-08-04
- 작업 시작 `main`: `67ff8646fb7252d05bb49b734f8a5084f2347c23`
- 최종 검증 `main`: `ffeb20f76e08417005a154cb8130603252e1eb86`
- 신규 공개 식별자·스키마·URL·핵심 UX 변경: 없음

## 1. 의존성 보안 패치

PR #38에서 기존 semver 범위 안의 전이 의존성만 갱신했다.

- 작업 커밋: `39ec2c7e7f32b1ac97c29894e29d499b8b66e302`.
- ChatGPT 최종 기술 리뷰 PASS: review ID `4845243644`.
- SEO validation run `30823433637`, job `91718849718`: 성공.
- Squash merge commit: `3b686ba337b2a70552c1ba70ded08e4f94102bb8`.
- `postcss` 8.5.25, `svgo` 4.0.2, `nanoid` 3.3.17로 잠금파일 갱신.
- Astro·sharp·esbuild 취약점은 메이저 업그레이드가 필요해 이 PR에서는 분리했다.

## 2. Astro 7 마이그레이션

PR #39에서 Astro 5.18.2를 7.1.6으로 업그레이드했다.

- 작업 커밋: `dfe3c1560e4ad2e89b43dada8373899ca50e363c`.
- ChatGPT 최종 기술 리뷰 PASS: review ID `4845536418`.
- SEO validation run `30825611656`, job `91726339246`: 성공.
- Squash merge commit: `07b31a2a7e371f9e1aa78eae90d66515dc925f36`.
- Astro 7의 기본 Markdown 처리 변경에 맞춰 공식 `@astrojs/markdown-remark` 7.2.2와 `unified()`를 사용했다.
- 기존 `remark-math`·`rehype-katex` 수식 처리를 유지했다.
- `compressHTML: true`로 이전 HTML 공백 동작을 유지했다.
- `sharp` 0.35.3을 포함한 잠금파일 갱신 후 `npm audit` 취약점 0건을 확인했다.
- 콘텐츠·문항·관계·동결 키·URL은 변경하지 않았다.

## 3. 첫 Pages 배포 실패

Astro 7 병합 후 Pages run #102 `30825708533`이 실패했다.

- build job `91726670715`: 실패.
- deploy job `91726762579`: build 실패로 건너뜀.
- `withastro/action@v3`가 기본 Node 20.20.2를 사용했다.
- Astro 7.1.6의 요구 조건은 Node 22.12.0 이상이므로 빌드가 시작 단계에서 중단됐다.
- Pages artifact가 업로드되지 않아 이 run의 Astro 7 산출물은 production에 배포되지 않았다.
- 실패 확인 후 후속 변경과 문서 완료 처리를 중단하고 별도 hotfix로 분리했다.

## 4. Pages Node 24 hotfix

PR #40에서 기존 `withastro/action@v3`에 `node-version: 24` 입력만 추가했다.

- 작업 커밋: `298e250ff84527f00f8d5749522655b5502dc44e`.
- ChatGPT 최종 기술 리뷰 PASS: review ID `4845643488`.
- SEO validation run `30826409327`, job `91729070744`: 성공.
- Squash merge commit: `ffeb20f76e08417005a154cb8130603252e1eb86`.
- 변경 파일은 `.github/workflows/deploy.yml` 한 개이며 애플리케이션·패키지·콘텐츠·데이터 변경은 없다.
- Actions major-version 현대화는 이번 복구 범위에서 제외했다.

## 5. 최종 검증

로컬과 PR CI에서 다음을 확인했다.

- `git diff --check`: 성공.
- `npm ci`: 성공.
- `npm audit --json`: 취약점 0건.
- Astro build: 209페이지.
- SEO: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠: HTML 209개, 오류 0개.
- 문제 데이터: 1,680개, 중복 ID 0건.
- 대표 `ohms-law` 산출물의 KaTeX 마크업 확인.

최종 Pages run #103 `30826474085`:

- build job `91729293756`: 성공.
- deploy job `91729435295`: 성공.
- build 환경: Node 24.18.0.
- 배포 산출물 최종 수정 시각: 2026-08-03 15:14:08 UTC.

production runtime:

- 홈: HTTP 200.
- `construction-hazard-plan-documents`: HTTP 200.
- `leakage-breaker-types`: HTTP 200.
- `ohms-law`: HTTP 200, KaTeX 마크업 확인.
- `sitemap-index.xml`: HTTP 200.

최종 판정: Astro 7 마이그레이션과 Pages Node 24 복구 production 검증 **PASS**.

## 6. 남은 위험

- npm은 `esbuild@0.28.1` 설치 스크립트 allowlist 안내를 출력하지만 설치·빌드·배포는 성공했다.
- 현재 workflow의 `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`는 Node 20 action runtime deprecation 경고가 남아 있다. 공식 최신 action major 업그레이드는 별도 검토·PR 범위다.
- `punycode` deprecation 경고가 action 내부에서 출력되지만 현재 배포 실패 원인은 아니다.
- AdSense 승인·실제 광고 송출, Search Console 색인·sitemap 처리, GA4 실시간 이벤트는 외부 계정 증거로 별도 확정한다.
- 기출문제와 이미지의 상용 이용 범위는 Owner 법무·사업 결정이 필요하다.

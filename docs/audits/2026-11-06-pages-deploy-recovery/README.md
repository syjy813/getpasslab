# Pages 배포 지연 복구

사용자 승인된 시설 이미지85장 교체 배포를 완료하기 위한 운영 수정이다. 기준 main `2d78a90f99ffe7c0c0547b3352092d44f2e1dc9a` 및 PR #256.

## 확인한 문제와 변경

Pages run42183503276은 한글 폰트 설치 단계에서20분 이상 대기했으며 Astro 빌드를 시작하지 못했다. 설치 내부의 세부 원인은 실행 중 로그를 가져올 수 없어 확정하지 않았다.

현재 `astro.config.mjs`는 공개13편의90이미지를 모두 검수된 manifest의 WebP에서 복사한다. SVG를 다시 래스터화하는 분기는 이번 공개 이미지에서 실행되지 않는다. 따라서 Pages에서 불필요한 apt/font설치를 제거한다. 이미지 생성/검수 workflow의 폰트 설치는 그대로 둔다.

새 Pages 실행이 지연된 이전 실행을 취소하도록 concurrency.cancel-in-progress를 true로 바꾸고 build job에15분 제한을 둔다. 권한, 배포 대상, Node24, Astro/Pages action과 콘텐츠는 유지한다.

## 검증

- Fontconfig을 비어있는 폰트 디렉터리만 참조하도록 설정. `fc-list` 결과0개.
- 그 환경에서 `npm run build` 성공(573페이지,575 HTML). 출력942파일 모두 이전 검증 빌드와 SHA-256 동일.
- 공개13편의90이미지 참조가 모두 reviewed manifest에 존재. 미등록0.
- `check-facility-bulk-visuals.mjs`, `check-public-sector-visuals.mjs` PASS.
- SEO 오류0/기존description경고1, 공개문구 오류0, git diff --check PASS.
- 적용 가이드: 시설가이드 §5.13.4–9 및 학습이미지가이드 §6/9의 원본비율·예약치수·파일대조·브라우저/배포 상태 구분. 새 이미지 제작은 없다.

PR/Pages의 실제 성공과 Production의85장 해시·12편 HTML·주요화면 결과는 최종 실행기록으로 확인한다. 이 문서를 만들었을 때 복구 배포와 Production QA는 아직 미실행이다.

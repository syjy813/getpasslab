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

## 최종 실행 결과

- PR #257 병합, Pages https://github.com/syjy813/getpasslab/actions/runs/42186776599 build/deploy 성공. 원래 run42183503276의 deploy는 새실행으로 취소됨.
- 완료된 원래빌드로그로 지연원인확인: Ubuntu미러의61.2MB fonts-noto-cjk 다운로드가24분49초·41.1kB/s 소요. 설치가정지한것이아니라 다운로드가느렸음.
- Production 교체85장HTTP200·SHA-256모두일치,12편HTML의이미지수/경로/alt/치수일치. 보존5장도HTTP200·동일해시.
- Production1348px콘텐츠뷰포트에서 대표/새소방·영선카드 로딩·자연치수·비율·가로넘침없음·목차펼침확인. 원격PR256의공개/검토320·390·768·1440px브라우저검사통과와구분한다.
- 모바일실기기/Safari/광고실노출/색인은검증범위밖. 현재이미지교체잔여없음.
- 이 후속변경은상태문서와검증기록뿐이므로[skip ci]로중복배포를발생시키지않는다. 제품소스/공개산출물변경없음.

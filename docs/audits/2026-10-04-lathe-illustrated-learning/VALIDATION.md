# 선반 실물형 학습 이미지 검증

- 기준 main: 7aeb6dc1f4c028c6529221e9d6ada15160438926
- 원본/수정 chapter SHA-256 및 frontmatter 보호: review.json
- 기존 `척`·`바이트` 정의 유지, `일감(공작물): 가공할 재료` 보충. 그림은 정의 목록 바로 다음이며 칩 절 앞에 배치
- 원본 생성 선반 외형과 검토 PNG를 재사용. 제목·중복 요약·감김 위험을 이미지에서 빼고 HTML 본문/캡션으로 표현. 전체 외형과 가공부 확대, 세 부품의 직접 라벨 및 회전 화살표 유지
- 공개 WebP: 1200×1440, 201898 bytes. NanumGothic 문자 렌더를 최종 비트맵에 포함하며 폰트 파일은 저장소에 배포하지 않음
- 편집 원본: `lathe-annotated-source.svg` + `lathe-original-reference.jpg`. JPEG는 기존 생성 시안의 고품질 변환본, SVG는 검증 가능한 라벨/회전 표식. 재렌더 스크립트는 `render.cjs`, NanumGothic 로컬 설치 필요
- 340px/270px 파일 축소본과 1200px 공개 WebP 직접 시각 검수. 부품 라벨16.2px/20.4px, 회전 라벨14.4px/18.1px. 실제 웹 카드 표시폭은 CI에서 재검사
- Astro Build 427페이지 PASS. 분리 전용 보호 검사·SEO·공개 본문·deferred 및 컴활82~159 검사는 작업 로그/PR Checks와 함께 확인
- 기존 공개 SVG·다른3개 이미지·URL·frontmatter·기출11개/전체24개/정본1680개/보호580파일 유지. 수정본의 정확한 hash chain 항목만 추가하고 과거 검수 snapshot은 변경하지 않음
- CI 브라우저 QA: 390/1440/320px 5개 챕터/24문항과 4개 기계 이미지12개 검사 예정. 선반은 WebP 바이트/치수/alt/라벨 최소14px/정의 뒤 위치 검사, 나머지 SVG는 기존 검사 유지
- 전문가 설계도 검수·원본 PDF·실물 스마트폰·학습자 효과 검증 미실행. 생성 이미지의 노브/턱/내부 형상은 특정 기종 사양의 근거가 아님
- GitHub PR·CI 결과는 생성 후 갱신. 새 실물형 시안의 main Merge/Production Deploy 미실행

## 확정 결과 — 2026-10-04

PR #128 최종 head의 SEO37181187800/브라우저37181187814 success. 390/1440/320px 각5챕터/24문항과 이미지12검사 오류0. ZIP 지문 대조 및320/1440px 선반 캡처 직접 검수. Merge347c19bcfdbe2b1dd0be5f3dbee8d1d02cab421e / Pages37181440715 success. Production 정의·배치·이미지 로드 및 화면 검수 PASS. 위 예정/미실행 표시는 당시 단계의 기록이며 RELEASE.md 및 두 JSON 결과를 우선한다.

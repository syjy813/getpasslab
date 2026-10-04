# 선반 확대 잘림 수정 검증

- 기준 main2bb7ef698be4858777ffc8c8db4841308bd1f3d6 / 공개 파일 v2 1200×1800 / 264492bytes / SHA256 dd084f90c1eec8570136fa910f1e3dc8603232a5d88a633daf164ea1ca64b42d
- 기존 생성 JPG를 재사용하고 SVG 확대 범위를420 150 600 300에서320 120 840 590으로 넓힘. 척 전체·바이트 받침·레버 보존, 외곽만 부드럽게 마감. 캔버스 높이를1440→1800으로 늘려 아래 최소64px 흰 여백 확보
- full asset 및270px 축소본 직접 검수: 척/일감/바이트·리더선·회전 식별, 한글 정상. FONTCONFIG_FILE로 NanumGothic 설치 경로 제공, 폰트 바이너리 미배포
- 기존 문장·frontmatter·11문항/전체24문항·정본1680/보호580파일·나머지3이미지 유지. 본문은 v2 파일명·height만 변경. review hash chain 보존
- Astro Build427페이지, 분리 보호 검사, SEO429HTML/428URL 오류·경고0, 공개 본문 및deferred 오류0, JS syntax 및git diff --check PASS
- CI preview390/1440/320px 각5챕터/24문항 및 이미지12개 검사 예정. 기존 위치·파일/치수·alt·라벨 검사를 유지하고 자연비율 일치/파일 아래 여백 검사 추가
- Production 배포/검수는 미실행. 확정 CI·배포 결과는 PR 설명 및 후속 release 기록을 우선 확인

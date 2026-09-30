# 온수난방 팽창탱크 그림 개선 기록

- 대상: `heating-systems`의 개방형·격막식 밀폐형 팽창탱크 비교
- 원본: `public/images/energy-management/heating-expansion-tanks-v1.svg` (보존, 페이지 참조만 교체)
- 파생본: `heating-expansion-open-illustrated-v2.webp`, `heating-expansion-diaphragm-illustrated-v2.webp`
- 디자인 기준: `docs/standards/learning-image-design-system-v1.md` v1.2 §1·2·5·6·7·9

## 그림 브리프

| 항목 | 개방형 | 격막식 밀폐형 |
|---|---|---|
| 연결 기출·학습 질문 | `heating-systems`의 온수난방·팽창탱크 판별: 대기와 넘침관은 어디로 연결되는가? | 같은 문제군: 공기실과 난방수는 무엇으로 나뉘는가? |
| 유형·표현 | 구조 비교, L2 학습용 단면 | 구조 비교, L2 학습용 단면 |
| HTML 캡션 | 개방형 팽창탱크 / 윗면은 대기에 열리고, 넘침관은 별도로 배출 | 격막식 밀폐형 팽창탱크 / 공기실과 난방수를 격막으로 분리 |
| 핵심 구조·색 | 열린 윗면, 청록 난방수, 오른쪽 넘침관, 아래 팽창관 | 밀폐 용기, 위 공기실, 얇고 연속된 검은 격막, 아래 청록 난방수·연결관 |
| 그리는 범위 | 구조 비교. 평상시 수위·마른 넘침관. 난방 계통 전체는 생략 | 구조 비교. 공기 충전 밸브 외 계통 부품은 생략 |
| 금지할 오해 | 넘침관이 환수관으로 복귀하거나 평상시 계속 배출하는 표현 | 공기·물이 닿거나 격막 아래 빈 공간·자유 수면이 있는 표현 |
| 접근성 | 캡션과 별도 키·alt에서 위치와 연결 설명 | 캡션과 별도 키·alt에서 격막과 물 연결 설명 |
| 화면 | PC 2열, 모바일 1열. 두 이미지 모두 공통 에셋 | PC 2열, 모바일 1열. 두 이미지 모두 공통 에셋 |

## 근거와 편집 판단

- Caleffi, *Separation in Hydronic Systems* §2: 오래된 개방형 난방 계통의 팽창탱크는 높은 위치에서 대기와 통함. https://www.caleffi.com/sites/default/files/media/external-file/Idronics_15_NA_Separation%20in%20hydronic%20systems.pdf
- Caleffi, *Basic Concepts & Detailing*, Expansion Tank Placement: 현대의 격막식 팽창탱크에서 탄성 격막이 계통수와 공기를 완전히 분리하고 팽창에 따라 움직임. https://www.caleffi.com/en-us/blog/2-basic-concepts-detailing
- 기존 챕터 및 원본 SVG에 기술된 넘침관·팽창관의 별도 연결을 보존. AI 시안 첫 버전은 평상시 수위 아래인데도 넘침관에서 물을 흘려보내 폐기했고, 밀폐형 첫 버전은 격막 아래 빈 공간을 보여 폐기. 최종본은 해당 관계를 수정.
- **확인한 관계:** 위쪽 개방/밀폐, 넘침관의 별도 끝단, 아래 난방 계통 연결, 격막의 공기·물 분리. **생략한 관계:** 실제 계통의 배관 구배·펌프·안전밸브·설치 높이. **미확인 디테일:** 생성 그림의 금속 이음, 벽 두께, 충전 밸브 형상은 특정 제조사 사양이 아님.
- 확대와 위치 판단이 핵심이라 그림 안에 제목·본문을 중복하지 않고 HTML 캡션과 키에 배치. 물의 이동은 양방향 팽창·수축이 가능하므로 단방향 화살표를 그리지 않음.

## QA

- 원본 SVG는 유지하며 공개용 파생 WebP를 새 경로로 참조
- `npm run build`: 295페이지 성공. 대상 빌드 HTML에 v2 이미지 2개, 카드 키 2개, 크기·alt 포함. 두 WebP가 `dist/images`에 존재
- `npm run check:seo`: 경고·오류 0. `npm run check:public-content`, `npm run check:deferred-question-content`: 오류 0. `git diff --check`: 통과
- WebP 원본: 개방형 1145×1374(약 67 KB), 밀폐형 1024×1536(약 47 KB). CSS는 PC 2열·767px 이하 1열, 최대 이미지 높이 480px
- 실제 320px·390px 브라우저 캡처 및 실서버 표시는 아직 실행하지 않음. PR 이후 브라우저 검수와 배포는 별도 단계

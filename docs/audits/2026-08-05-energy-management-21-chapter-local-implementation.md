# 에너지관리기능사 21개 챕터 로컬 구현 검증

- 구현일: 2026-08-05
- 브랜치: `data/energy-management-question-storage`
- 기준 HEAD: `9700d63827a2cc07cc428bc94bc4000bd1a23a44`
- 구현 범위: 기존 12개 챕터 재편, 승인된 신규 slug 9개 생성, 텍스트 기출 1,588건 관계 적용
- 결과: **로컬 구현·무결성·빌드 PASS**
- 배포 상태: Commit·Push·PR·CI·production 배포 미실행

## 1. 구현 결과

- 챕터 파일: 21개, slug 21개 고유
- 기존 slug 유지: 12개
- 신규 slug: 9개
  - `boiler-types-construction`
  - `heating-systems`
  - `steam-traps-condensate`
  - `insulation-materials`
  - `environmental-pollution-control`
  - `burners-furnaces-atomization`
  - `draft-flue-gas`
  - `fuel-properties`
  - `heating-load-radiators`
- frontmatter 관계: 1,588건, 고유 ID 1,588개, 중복 0건
- `jpg 확필` 제외: 32건, 잘못 연결된 문항 0건
- 없는 question ID: 0건
- 자격·시험·과목 불일치: 0건
- `related` 미존재 slug: 0건
- `order`: 1~21 고유값

## 2. 챕터별 관계 수

| order | slug | 관계 |
|---:|---|---:|
| 1 | `boiler-operation-basics` | 92 |
| 2 | `boiler-types-construction` | 142 |
| 3 | `boiler-auxiliary-equipment` | 74 |
| 4 | `boiler-accessory-equipment` | 86 |
| 5 | `boiler-protection-devices` | 73 |
| 6 | `environmental-pollution-control` | 31 |
| 7 | `boiler-efficiency-heat-balance` | 103 |
| 8 | `boiler-installation-combustion` | 44 |
| 9 | `fuel-properties` | 83 |
| 10 | `burners-furnaces-atomization` | 62 |
| 11 | `draft-flue-gas` | 47 |
| 12 | `boiler-control-systems` | 69 |
| 13 | `heating-systems` | 114 |
| 14 | `steam-traps-condensate` | 25 |
| 15 | `boiler-piping-insulation` | 100 |
| 16 | `insulation-materials` | 41 |
| 17 | `heating-load-radiators` | 45 |
| 18 | `boiler-operation-maintenance` | 60 |
| 19 | `boiler-water-treatment` | 96 |
| 20 | `boiler-work-safety` | 34 |
| 21 | `energy-laws-and-inspection` | 167 |
| **합계** |  | **1,588** |

## 3. 콘텐츠 반영

- 21개 챕터 모두 `status: 완료`, `cert_id: energy-management`, `exam: written`, `subject_id: 1`로 설정했다.
- 기출 분류 경계에 맞춰 보일러 종류·난방·증기트랩·보온·환경·버너·통풍·연료·난방부하 범위를 독립 챕터로 분리했다.
- 기존 12개 본문은 분리된 범위와 중복되지 않도록 제목·summary·본문·출제 경향을 조정했다.
- 에너지 관계법규는 2010~2016년 기출 시점과 2026년 현행 기준을 분리했다. 현행 출제기준은 Q-Net의 2026-01-01~2028-12-31 적용기간, 현행 시행규칙은 2026-06-22 시행본을 기준으로 표시했다.
- 목록과 챕터 측면 탐색은 기존 `order` 메타데이터를 실제 렌더링 순서에 반영하도록 정렬했다.

## 4. 검증 결과

- `node scripts/audit-energy-chapter-coverage.mjs`: PASS
  - 전체 1,620문항, 미분류 0건
  - 원본 PDF 직접 검수 86건, 최종 주제 교정 22건
  - 관계 1,588건 적용, 이미지 32건 제외
- 구조 역검증: PASS
  - 21개 파일·slug, 1,588개 관계, 중복·누락·과목 불일치·잘못된 `related` 모두 0건
- `git diff --check`: PASS
- `npm run build`: PASS
  - 정적 페이지 251개, sitemap URL 252개
  - 에너지관리기능사 챕터 21개와 관계 1,588건 모두 로컬 HTML에 렌더링
- `npm run check:seo`: PASS, warning 0건, error 0건
- `npm run check:public-content`: PASS, error 0건

## 5. production 미반영 확인

2026-08-05 읽기 전용 runtime 확인 결과다.

- `/energy-management/written/`: HTTP 200, 챕터 12개
- `/energy-management/written/thermal-equipment/`: HTTP 200, 챕터 12개, 신규 slug 링크 없음
- `/energy-management/written/thermal-equipment/boiler-types-construction/`: HTTP 404
- `/sitemap-0.xml`: HTTP 200, 에너지 챕터 URL 12개, 신규 slug 없음

따라서 로컬 빌드에는 21개 챕터가 있지만 production은 기존 12개 상태를 유지한다.

## 6. 미실행·남은 게이트

- Commit·Push·PR·GitHub Actions CI·GitHub Pages 배포는 실행하지 않았다.
- 이 구현을 production에 반영하려면 ChatGPT 최종 기술 리뷰와 Owner의 Commit·Push·배포 승인이 필요하다.
- `jpg 확필` 32건은 이미지·대체텍스트 별도 검증 전까지 관계 제외를 유지한다.
- 기출문제 이용 권리 위험은 해소된 것으로 판정하지 않는다.
- `AI_HANDOVER.md`는 최종 기술 리뷰와 Owner 승인 전이므로 갱신하지 않는다.

## 7. 최종 기술 재리뷰

- 재리뷰일: 2026-08-05
- 판정: **로컬 구현 PASS**
- 1차 리뷰에서 발견한 공통 `order` 정렬의 산업안전기사 범위 초과 영향을 제거했다.
- 완료 챕터의 `order` 값이 과목 전체에서 고유한 경우에만 과목 전체 정렬을 적용한다. 따라서 에너지관리기능사는 1~21 순서를 사용하고, 그룹별 `order`를 재사용하는 산업안전기사는 기존 표시 순서를 유지한다.
- 산업안전기사 6개 과목의 로컬 목록·측면 탐색 순서를 production과 대조했으며 불일치는 0건이다.
- `ARCHITECTURE.md`의 현행 정본 경로를 `src/data/questions/{cert_id}.json`, 271개 챕터, 3,300문항으로 정정했다.
- `DECISION_LOG.md` D-82에서 2026-08-04 초기 관계 0건과 2026-08-05 로컬 관계 1,588건을 시점별로 분리했다.
- `npm ci`: PASS, 274 packages. `esbuild@0.28.1` install script allowlist 경고는 존재하지만 신규 의존성·빌드 실패는 없다.
- 최종 `git diff --check`, 관계 감사, build 251 pages, SEO 경고·오류 0, public-content 오류 0: PASS
- production은 12개 챕터를 유지하고 신규 `boiler-types-construction` URL은 HTTP 404로 미반영 상태다.

이 PASS는 로컬 변경의 기술 판정이다. Commit·Push·PR·CI·production 배포는 Owner의 다음 승인 전까지 진행하지 않는다.

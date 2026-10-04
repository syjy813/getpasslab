# Accident-analysis diagrams brief

Read AGENTS.md, CHAPTER_WRITING_GUIDE.md and learning-image-design-system-v1.md v1.2 before drawing. Apply §§1–6, 8–9: caption first, L1 comparisons, meaningful direct labels, no repeated image titles, common PC/mobile asset, minimum 14 CSS px core labels, 320/390/1440px QA and separate deployment evidence.

Prior plan: 산업안전기사-이미지-챕터분리-1차검수-20261003.md, Library libfile_1126f18e45e0819186ae6717c7789200 lines133–145. Keep one chapter; reduce three repeated tables. Close/cross original terminology and chart form remain unverified: do not draw its chart or claim a proven English equivalence. Preserve the minimal relationship-analysis explanation and canonical choice spellings. Next pilot is earth-retaining components, outside this release.

## Captions and learning questions, written before the SVGs

| Asset | Question / purpose | HTML caption |
|---|---|---|
| analysis-pareto-v1.svg | 20200926_017: distinguish sorted categories from chronological observations | 파레토도 / 사고 유형·기인물 등의 분류 항목을 큰 순서대로 나열함 |
| analysis-fishbone-v1.svg | 20200822_016, 20210515_008: fish skeleton, cause hierarchy and right-facing spine | 특성요인도(어골상) / 원인 가지를 모아 오른쪽의 결과(특성)에 연결함 |
| analysis-control-v1.svg | 20220424_006: time trend plus upper/lower limits | 관리도 / 시간에 따른 재해 발생 추이를 관리한계선과 비교함 |

All SVGs 390px wide. Core labels24px → 14.65px at238px display width. Structural/data lines5px →3.05px, detail leaders4px →2.44px. White/navy/slate standard palette; purple cumulative line is statistical data, not a fluid. Dashed control limits labelled UCL/LCL; out-of-limit point is circled and explicitly labelled, not conveyed by colour alone. Neutral direct category labels. No 3D styling on exact charts.

Pareto illustrative data: A50, B25, C15, D10 (total100); cumulative50/75/90/100%, matched left/right axes. Fishbone four generic cause categories and four hypothetical subcauses; not a real incident investigation or proof of causation. Control diagram: schematic chronological observations, central line and limits; no actual counts or statistically calculated thresholds claimed. Captions explicitly identify learning examples.

## Technical verification sources

- Canonical five questions read in full from src/data/questions/industrial-safety.json. Preserve entire dataset bytes, question IDs, choices and stored answers; no spelling corrections to source questions.
- ASQ Pareto: https://asq.org/quality-resources/pareto — descending bars, optional correctly scaled cumulative percentages.
- ASQ Fishbone: https://asq.org/quality-resources/fishbone — horizontal right-facing spine, effect at right, branches for causes and subcauses.
- ASQ Control: https://asq.org/quality-resources/control-chart — time order, centre line, upper/lower limits based on historic data. The drawing is a labelled shape example, not an applied control-limit calculation.
- 20190303_012 stored answer2 is preserved. Explain that exam's exclusion of 종합적 원인분석 in exam-specific terms, not a universal assertion that comprehensive investigation is invalid.

No physical device/flow connections apply. No new chapter/route/question assignment, historical snapshot rewrite, framework dependency or source image registry change.

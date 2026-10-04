# Milling illustration review

Applied design standard v1.2 §§1–9: caption first, L2 recognizable physical geometry, direct component labels, neutral motion arrows, one shared PC/mobile asset, no duplicated raster title, original/derived sources preserved, technical and visual review separated.

## Content/visual review before PR

- Six canonical questions reviewed. Frontmatter and all teaching text outside the HTML figure are byte-identical to the prior release. No question/answer/ID/image registry changes.
- Whole machine: recognizable column, horizontal cutter arbor with outboard support, vise on T-slotted table. Column leader targets the column casting, not a control handle.
- Detail: cutter teeth and workpiece contact visible; distinct workpiece between vise jaws. The vise/body pointer and cutter/workpiece pointers target their respective physical parts. Core cutter, workpiece and vise jaws remain away from crop boundaries; only peripheral machinery fades.
- Rotation and cross-feed arrows are illustrative movement examples; no universal spindle direction or climb/conventional-milling relationship is taught. Generated controls/fasteners are generic and not model specifications. Guards, coolant and drive internals are omitted as the caption states.
- 1200×2000 WebP, minimum label source size72; expected 320px viewport label14.28px; 16-unit motion stroke≈3.17px. Bottom64 rows have RGB channel minima253/255/253.
- Built-in image generation supplied the realistic base; exact labels/arrows added through a separately preserved SVG source and Sharp rasterization using locally installed NanumGothic. No font binary distributed.
- Original base: milling-original-reference.jpg. Public result: public/images/industrial-safety/milling-motion-illustrated-v1.webp. Generator prompt is recorded in generation.md.

## Local checks

- Astro build: 427 pages, passed.
- SEO: HTML429 / sitemap428, zero warnings/errors.
- Split regression: five routes, 24 uniquely assigned questions, 580 protected files including all1680 canonical questions unchanged, passed.
- Visual QA script syntax and git diff whitespace checks passed.
- Learning text outside figure: old/new byte comparison passed.

## Release evidence

CI preview browser QA, PR checks, merge, Pages deploy and Production checks are pending at the time of this commit. The PR body is the authoritative final release evidence and supersedes these historical pending status lines; it records tested commit/tree, artifact hash and deployed SHA without causing a separate documentation deployment.

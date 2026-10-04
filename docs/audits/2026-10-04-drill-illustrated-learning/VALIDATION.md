# Drill illustration review

Design standard v1.2 §§1–9 actually read and applied: caption first, L2 recognizable geometry, part labels/motion rendered separately, neutral palette, one shared PC/mobile asset, source/derived separation, minimum label size, technical and visual review distinguished.

## Content and image review

- Canonical4questions inspected. First2 concern fixed-drill workholding/chuck-key hazards; last2 remain covered by the unchanged portable-drill section. Fixed example is explicitly scoped in the caption.
- Added only `바이스: 일감을 물려 고정하는 장치`, supporting the small-workpiece fixing judgment. Frontmatter byte-identical. Comparison outside figure+that definition confirms every other teaching sentence remains byte-identical. Questions/answers/IDs/registries unchanged.
- Source full machine and zoom reviewed directly. Exposed spindle shaft→chuck→single fluted drill bit are coaxial, bit contacts visible workpiece between two vise jaws. Vise hold-down bolts attach to the table; chuck key absent. Leaders target their corresponding parts, not the rear column. Cutter motion is a rotation example, not an instruction for universal direction.
- Full machine remains inside frame. Enlarged spindle/chuck/bit/workpiece/vise jaws and both table hold-down bolts visible away from fading edges. Peripheral head/column/handle/table context fades; no core cutting part clipped.
- Generated controls/fasteners are generic, unverified details rather than specific machinery specifications. Cutter guarding, drive internals, coolant and full operating procedure omitted. Primary source and canonical questions are evidence; generated image is not engineering evidence.
- 1200×2000 WebP208562bytes, original JPEG270658bytes. All direct labels72source units; expected14.28px at320px viewport. Motion16units≈3.17px. Bottom64rows are clear white, checked after extract→PNG buffer to avoid Sharp stats ignoring extraction.
- Card left aligned, maximum424px, image maximum390px, top24px/side16px space. Same layout as approved milling. No other chapter alignment/asset changes.
- Built-in image_gen generated the realistic base. Exact SVG labels/arrows and Sharp renderer retained; locally installed NanumGothic used, no font binary distributed. Exact prompt in generation.md.

## Local checks

- Split regression:5routes/24questions,580protected files including1680canonical questions, passed.
- Script syntax, whitespace and teaching-text comparison passed.
- Astro427page build, passed. SEO429HTML/428sitemap URLs, warnings0/errors0.

## Release status at commit

CI preview320/390/1440px browser QA, artifact visual review, merge, Pages deployment and Production confirmation are pending at commit time. The PR body will hold final tested/deployed SHA/tree, artifact digest and Production evidence; its final status supersedes these historical pending lines without requiring a second documentation deployment.

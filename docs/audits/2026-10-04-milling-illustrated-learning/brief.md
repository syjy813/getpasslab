밀링의 커터·컬럼·바이스 — 학습용 재구성 · 수평형 예시, 방호장치 생략

# 제작 전 그림 브리프

- Chapter: 밀링 안전 / milling-safety
- Standard actually read: docs/standards/learning-image-design-system-v1.md v1.2 §§1–9; CHAPTER_WRITING_GUIDE.md
- Question IDs reviewed from canonical JSON: 20220424_043, 20210814_050, 20200606_046, 20190804_055, 20180304_059, 20180428_052
- Learning question: 무엇이 회전하고, 일감은 어디에 고정되며, 컬럼은 어디인가?
- Type/level: L2 recognizable machine illustration plus exact code-rendered component labels and motion arrows; full machine above and machining detail below
- Required: column, horizontal-axis cutter, workpiece held between vise jaws, vise mounted on table, cutter rotation and table/workpiece feed
- Content scope: component identity and motion example; not a complete operating/safeguarding setup. No climb/conventional milling lesson, dimensions, feeds or machine-model specifications
- Confirmed: chapter and six questions identify cutter/column/vise and securing the work; NPTEL explains peripheral cutter rotation and feed imparted to workpiece; CCOHS identifies workpiece in vise attached to table and rotating cutter
- Omitted: guards, coolant, full drive linkage and control procedure. Generated fasteners/control details are generic, unverified and not learning claims
- Sources: https://archive.nptel.ac.in/content/storage2/courses/112101005/modules/lec3-5/1.6.html ; https://www.ccohs.ca/oshanswers/safety_haz/metalworking/millingmachines.html ; existing chapter and canonical question JSON
- Reuse: existing milling-motion.svg is accurate L1 but user wants the approved lathe's realistic quality. Preserve SVG; create sibling illustrated asset. Approved lathe original is a style reference only, not geometry evidence
- Color: neutral navy/steel structure; #25334B motion/text, #526176 leaders, white outline for contrast. No fluid or correctness colors
- Labels: direct Korean labels, minimum 72/1200 source width so ≥14px at narrow mobile. No duplicate HTML title/subtitle or long explanatory text in raster
- Framing: whole machine uncropped; enlarged cutter/workpiece/vise with adequate peripheral context. Leave ≥64px final white bottom padding. Avoid clipped tools, cutter teeth and vise jaw
- Layout: one shared 1200px-wide asset; card max424px, top24px and side16px gaps, PC image390px, expected mobile308px (390 viewport) /238px (320 viewport)
- Alt draft: 전체 수평형 밀링과 가공부 확대 그림. 컬럼 옆의 커터가 회전하고, 바이스에 고정된 일감은 테이블과 함께 이동한다. 화살표는 움직임 예시이며 방호장치는 생략했다
- QA before release: actual rendered 320/390/1440px, source bytes/dimensions, labels/arrow legibility, caption/alt, all 24 machine-tool question links and historical hash-chain regressions
- Authorization: user approved previous figure and requested next chapter; existing explicit production deployment instruction applies

# PR #6 production verification

- Result: **FAIL**
- Verification time (UTC): `2026-08-01T11:53:52Z`
- Target merge commit: `ac2a610d68958c7a3193c8fbf75334c310aedf87`
- Pages workflow run: [#30697893844](https://github.com/syjy813/getpasslab/actions/runs/30697893844)
- Pages workflow status: `completed / success`
- Pages workflow window: `2026-08-01T11:32:38Z → 2026-08-01T11:33:28Z`

## Runtime smoke test

| Page | HTTP | Checks |
|---|---:|---|
| Home | 200 | Site title |
| Reactive dangerous gases | 200 | Natural-language exam labels; internal ID/PDF/JSON absent |
| VDT contrast | 200 | Rendered strong element; repaired LaTeX rho; internal ID absent |
| Accident cause classification | 200 | Rendered strong element; Markdown markers absent |

## Findings

- Reactive dangerous gases: forbidden content present — 20220424_098
- VDT contrast: forbidden content present — 20200606_028
- VDT contrast: forbidden content present — ho=0.85

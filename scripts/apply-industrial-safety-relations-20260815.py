#!/usr/bin/env python3
"""Apply verified Industrial Safety question→chapter relations."""
from __future__ import annotations
import argparse
import re
from pathlib import Path

SPEC = {
  "anthropometry-design": {
    "path": "src/content/chapters/ergonomics/anthropometry-design.md",
    "expected_questions": ["20200926_034", "20210515_021", "20210307_021", "20210814_029"],
    "add_questions": ["20200606_021"],
    "exam_comment_old": "examComment: 수록 기출 4문항이 전체 14개 회차 중 4개 회차에서 확인되며, 조절식·평균치·최대치·최소치 설계를 사용 상황과 도달·여유 조건에 맞춰 구분함",
    "exam_comment_new": "examComment: 수록 기출 5문항이 전체 14개 회차 중 5개 회차에서 확인되며, 조절식·평균치·최대치·최소치 설계를 사용 상황과 도달·여유 조건에 맞춰 구분함"
  },
  "availability": {"path": "src/content/chapters/ergonomics/availability.md", "expected_questions": ["20190303_036"], "add_questions": ["20210814_040"]},
  "boiler-safety-devices": {"path": "src/content/chapters/mechanical/boiler-safety-devices.md", "expected_questions": ["20220424_045", "20220305_053", "20220305_056", "20210814_054", "20210515_047", "20210515_046", "20210515_041", "20190804_050", "20200822_057", "20200926_058", "20180304_058", "20180428_051", "20180428_054", "20180819_053", "20190303_045"], "add_questions": ["20210307_051"]},
  "compatibility": {"path": "src/content/chapters/ergonomics/compatibility.md", "expected_questions": ["20180819_022"], "add_questions": ["20180304_032", "20180428_028"]},
  "complete-combustion-cst": {"path": "src/content/chapters/chemical/complete-combustion-cst.md", "expected_questions": ["20190303_098", "20200822_096", "20200606_097", "20220424_083", "20210814_094", "20190427_093", "20180304_094", "20220305_091"], "add_questions": ["20200822_097"]},
  "fta-symbols": {"path": "src/content/chapters/ergonomics/fta-symbols.md", "expected_questions": ["20220424_030", "20210814_033", "20210515_032", "20180304_036", "20190303_023", "20180428_029", "20220305_037", "20180819_038", "20190804_036", "20200926_021", "20190427_037"], "add_questions": ["20210515_039"]},
  "leadership-headship": {"path": "src/content/chapters/safety-management/leadership-headship.md", "expected_questions": ["20220424_020", "20200926_018"], "add_questions": ["20210515_002"]},
  "leakage-breaker-types": {"path": "src/content/chapters/electrical/leakage-breaker-types.md", "expected_questions": ["20210814_075", "20210307_071", "20200926_078", "20210515_065", "20180304_065", "20190303_072", "20190303_076", "20190427_068", "20220424_065", "20200926_065", "20180428_073"], "add_questions": ["20190303_073"]},
  "learning-theories": {"path": "src/content/chapters/safety-management/learning-theories.md", "expected_questions": ["20200822_010", "20180304_003"], "add_questions": ["20210307_015", "20210515_016"]},
  "max-leakage-current": {"path": "src/content/chapters/electrical/max-leakage-current.md", "expected_questions": ["20190804_067", "20200822_065", "20210814_073"], "add_questions": ["20180819_074"]},
  "purge-inerting": {"path": "src/content/chapters/chemical/purge-inerting.md", "expected_questions": ["20220424_082", "20180428_091"], "add_questions": ["20190427_085", "20200926_086", "20210814_082"]},
  "reactive-dangerous-gases": {"path": "src/content/chapters/chemical/reactive-dangerous-gases.md", "expected_questions": ["20220424_098", "20220305_093", "20190427_083"], "add_questions": ["20200822_087"]},
  "safety-handrail-structure": {"path": "src/content/chapters/construction/safety-handrail-structure.md", "expected_questions": ["20210814_105", "20200926_105", "20190303_103"], "add_questions": ["20190427_112"]},
  "safety-management-organization": {"path": "src/content/chapters/safety-management/safety-management-organization.md", "expected_questions": ["20190804_002", "20200926_001", "20210307_005", "20180428_020", "20190303_014", "20210814_004"], "add_questions": ["20180304_010", "20190427_004"]},
  "severity-rate": {
    "path": "src/content/chapters/safety-management/severity-rate.md",
    "expected_questions": ["20220424_002", "20210515_015", "20200822_019", "20200926_007", "20180304_016", "20180428_004", "20190427_012"],
    "add_questions": ["20180428_015"],
    "exam_comment_old": "examComment: 수록 기출 6문항이 전체 14개 회차 중 6개 회차에서 확인되며, 1,000근로시간당 근로손실일수의 의미·역산과 재해별 손실일수 환산 기준을 물음",
    "exam_comment_new": "examComment: 수록 기출 8문항이 전체 14개 회차 중 7개 회차에서 확인되며, 1,000근로시간당 근로손실일수의 의미·역산과 재해별 손실일수 환산 기준을 물음"
  },
  "soil-test-types": {"path": "src/content/chapters/construction/soil-test-types.md", "expected_questions": ["20200822_116"], "add_questions": ["20200926_104"]},
  "spontaneous-combustion": {"path": "src/content/chapters/chemical/spontaneous-combustion.md", "expected_questions": ["20220305_096", "20220305_098", "20210515_095", "20200822_100", "20180304_091", "20180819_082", "20190427_082"], "add_questions": ["20190303_094"]},
  "temporary-structure-defects": {"path": "src/content/chapters/construction/temporary-structure-defects.md", "expected_questions": ["20220424_113"], "add_questions": ["20220305_114"]},
  "twi-supervisor-training": {"path": "src/content/chapters/safety-management/twi-supervisor-training.md", "expected_questions": ["20220424_016", "20220305_015", "20210515_009", "20200606_017", "20180304_001"], "add_questions": ["20190303_001"]}
}

QUESTIONS_RE = re.compile(r"^questions:\s*\[(.*?)\]\s*$", re.MULTILINE)

def parse_questions(text: str) -> list[str]:
    m = QUESTIONS_RE.search(text)
    if not m:
        raise RuntimeError("questions frontmatter line not found")
    inner = m.group(1).strip()
    return [] if not inner else [x.strip() for x in inner.split(",") if x.strip()]

def render_questions(qids: list[str]) -> str:
    return "questions: [" + ", ".join(qids) + "]"

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    root = Path.cwd()
    changed = []
    total_add = 0
    for slug, item in SPEC.items():
        path = root / item["path"]
        if not path.is_file():
            raise SystemExit(f"STOP: missing file {path}")
        text = path.read_text(encoding="utf-8")
        current = parse_questions(text)
        expected = item["expected_questions"]
        if current != expected:
            raise SystemExit(f"STOP: current relation state changed for {slug}\nexpected={expected}\nactual={current}")
        additions = item["add_questions"]
        overlap = sorted(set(current) & set(additions))
        if overlap:
            raise SystemExit(f"STOP: candidate already related for {slug}: {overlap}")
        new_questions = current + additions
        new_text = QUESTIONS_RE.sub(render_questions(new_questions), text, count=1)
        old_comment = item.get("exam_comment_old") or ""
        new_comment = item.get("exam_comment_new") or ""
        if old_comment:
            if old_comment not in new_text:
                raise SystemExit(f"STOP: expected examComment changed for {slug}")
            new_text = new_text.replace(old_comment, new_comment, 1)
        parsed_after = parse_questions(new_text)
        if parsed_after != new_questions or len(parsed_after) != len(set(parsed_after)):
            raise SystemExit(f"STOP: postcondition failed for {slug}")
        if new_text != text:
            changed.append(str(path.relative_to(root)))
            total_add += len(additions)
            if args.apply:
                path.write_text(new_text, encoding="utf-8", newline="\n")
    mode = "APPLIED" if args.apply else "DRY-RUN PASS"
    print(f"{mode}: {total_add} relations / {len(changed)} files")
    if total_add != 24 or len(changed) != 19:
        raise SystemExit(f"STOP: unexpected change count {total_add} relations / {len(changed)} files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

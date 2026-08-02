#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS_PATH = ROOT / "src/data/questions.json"
CHAPTER_ROOT = ROOT / "src/content/chapters"

REVIEW_BLOCKS = {
    "20220305_040": "jpg 확필",  # 문제의 '다음 설명' 누락
    "20210814_021": "jpg 확필",  # 문제의 '다음 상황' 누락
    "20180428_065": "jpg 확필",  # OCR 훼손
}

EXPECTED_RELATIONS = {
    "src/content/chapters/ergonomics/swain-human-error.md": [
        "20210814_021",
        "20210307_038",
        "20190804_023",
        "20200822_022",
        "20200926_022",
    ],
    "src/content/chapters/electrical/ventricular-fibrillation-current.md": [
        "20180428_062",
        "20180819_061",
        "20180428_065",
        "20210814_074",
    ],
    "src/content/chapters/electrical/vf-danger-energy.md": [
        "20220424_077",
        "20220305_078",
        "20210814_077",
        "20210307_063",
        "20200606_064",
        "20200822_076",
        "20200926_077",
        "20190303_063",
        "20180304_080",
        "20180428_063",
        "20180819_080",
    ],
    "src/content/chapters/mechanical/grinder-rotation-speed.md": [
        "20210307_058",
        "20200926_045",
        "20190427_052",
    ],
    "src/content/chapters/mechanical/balance-flange-diameter.md": [
        "20220305_043",
        "20210307_056",
        "20180428_056",
        "20190804_041",
    ],
    "src/content/chapters/mechanical/grinder-exposure-angle.md": [
        "20180819_048",
        "20180428_041",
        "20190303_041",
    ],
    "src/content/chapters/mechanical/five-pinch-points.md": [
        "20220424_053",
        "20210515_057",
        "20210307_057",
    ],
    "src/content/chapters/electrical/leakage-breaker-exception.md": [
        "20220424_074",
        "20210515_063",
        "20190804_065",
        "20180428_076",
    ],
}

QUESTIONS_RE = re.compile(r"^questions:\s*\[(.*?)\]\s*$", re.MULTILINE)
SUBJECT_RE = re.compile(r"^subject_id:\s*(\d+)\s*$", re.MULTILINE)


def parse_relations(source: str, path: Path) -> list[str]:
    match = QUESTIONS_RE.search(source)
    if not match:
        raise RuntimeError(f"questions frontmatter missing: {path}")
    content = match.group(1).strip()
    if not content:
        return []
    return [item.strip().strip("'\"") for item in content.split(",")]


def parse_subject(source: str, path: Path) -> int:
    match = SUBJECT_RE.search(source)
    if not match:
        raise RuntimeError(f"subject_id missing: {path}")
    return int(match.group(1))


def is_public_question(question: dict[str, object]) -> bool:
    if question.get("review") == "jpg 확필":
        return False
    choices = question.get("choices")
    return (
        isinstance(choices, list)
        and len(choices) == 4
        and all(isinstance(choice, str) and choice.strip() for choice in choices)
    )


def main() -> None:
    questions = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    if not isinstance(questions, list):
        raise RuntimeError("questions.json root is not a list")

    before = copy.deepcopy(questions)
    by_id = {str(question["id"]): question for question in questions}
    if len(by_id) != len(questions):
        raise RuntimeError("duplicate question_id in questions.json")

    for question_id, review in REVIEW_BLOCKS.items():
        question = by_id.get(question_id)
        if question is None:
            raise RuntimeError(f"missing review target: {question_id}")
        current = question.get("review")
        if current not in ("", review):
            raise RuntimeError(
                f"unexpected review value for {question_id}: {current!r}"
            )
        question["review"] = review

    changed_fields: list[tuple[str, str]] = []
    for old, new in zip(before, questions, strict=True):
        question_id = str(old["id"])
        keys = set(old) | set(new)
        for key in keys:
            if old.get(key) != new.get(key):
                changed_fields.append((question_id, key))

    expected_changed = sorted((question_id, "review") for question_id in REVIEW_BLOCKS)
    if sorted(changed_fields) != expected_changed:
        raise RuntimeError(
            f"unexpected questions.json changes: {sorted(changed_fields)}"
        )

    QUESTIONS_PATH.write_text(
        json.dumps(questions, ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )

    total_relations = 0
    missing: list[tuple[str, str]] = []
    duplicates: list[tuple[str, str]] = []
    subject_mismatches: list[tuple[str, str, int, int]] = []

    for chapter_path in sorted(CHAPTER_ROOT.rglob("*.md")):
        source = chapter_path.read_text(encoding="utf-8")
        relations = parse_relations(source, chapter_path)
        subject_id = parse_subject(source, chapter_path)
        total_relations += len(relations)

        seen: set[str] = set()
        for question_id in relations:
            if question_id in seen:
                duplicates.append((str(chapter_path.relative_to(ROOT)), question_id))
            seen.add(question_id)

            question = by_id.get(question_id)
            if question is None:
                missing.append((str(chapter_path.relative_to(ROOT)), question_id))
                continue
            question_subject = int(question["subject_id"])
            if question_subject != subject_id:
                subject_mismatches.append(
                    (
                        str(chapter_path.relative_to(ROOT)),
                        question_id,
                        subject_id,
                        question_subject,
                    )
                )

    if total_relations != 886:
        raise RuntimeError(f"unexpected total relations: {total_relations} (expected 886)")
    if missing:
        raise RuntimeError(f"missing relation targets: {missing}")
    if duplicates:
        raise RuntimeError(f"duplicate chapter relations: {duplicates}")
    if subject_mismatches:
        raise RuntimeError(f"subject mismatches: {subject_mismatches}")

    for relative_path, expected in EXPECTED_RELATIONS.items():
        path = ROOT / relative_path
        actual = parse_relations(path.read_text(encoding="utf-8"), path)
        if actual != expected:
            raise RuntimeError(
                f"relation set mismatch: {relative_path}\n"
                f"expected={expected}\nactual={actual}"
            )

    for question_id, review in REVIEW_BLOCKS.items():
        if by_id[question_id].get("review") != review:
            raise RuntimeError(f"review block not applied: {question_id}")
        if is_public_question(by_id[question_id]):
            raise RuntimeError(f"blocked question still public: {question_id}")

    vf_relations = EXPECTED_RELATIONS[
        "src/content/chapters/electrical/vf-danger-energy.md"
    ]
    vf_public = sum(is_public_question(by_id[question_id]) for question_id in vf_relations)
    if vf_public != 8:
        raise RuntimeError(f"vf-danger-energy public count changed: {vf_public}")

    print("[gate-a] questions review blocks: 3")
    print(f"[gate-a] total chapter relations: {total_relations}")
    print("[gate-a] missing relations: 0")
    print("[gate-a] duplicate relations: 0")
    print("[gate-a] subject mismatches: 0")
    print(f"[gate-a] vf-danger-energy public questions: {vf_public}")


if __name__ == "__main__":
    main()

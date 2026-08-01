from __future__ import annotations

import base64
import hashlib
import json
import re
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PART_GLOB = "scripts/final-content-ops.part-*"
PAYLOAD_SHA256 = "f24f2c4f1e23dd59e4860280fb8cf2948f521b215938baefa0f6a9b6e49b5369"
FROZEN_FIELDS = ("slug", "subject_id", "questions", "related", "status")


def frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("frontmatter start missing")
    end = text.find("\n---", 4)
    if end < 0:
        raise ValueError("frontmatter end missing")
    result: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            result[key.strip()] = value.strip()
    return result


def body(text: str) -> str:
    end = text.find("\n---", 4)
    return text[end + 4 :]


def load_changes() -> dict[str, dict[str, object]]:
    parts = sorted(ROOT.glob(PART_GLOB))
    if len(parts) != 4:
        raise RuntimeError(f"expected 4 payload parts, found {len(parts)}")
    encoded = "".join(part.read_text("ascii").strip() for part in parts)
    actual = hashlib.sha256(encoded.encode("ascii")).hexdigest()
    if actual != PAYLOAD_SHA256:
        raise RuntimeError(f"payload checksum mismatch: {actual}")
    changes = json.loads(zlib.decompress(base64.b64decode(encoded, validate=True)).decode("utf-8"))
    if len(changes) != 61:
        raise RuntimeError(f"unexpected payload size: {len(changes)}")
    return changes


def main() -> int:
    changes = load_changes()
    blocked = [
        re.compile(r"\b\d{8}_\d{3}\b"),
        re.compile(r"\bq\d{8}\b", re.I),
        re.compile(r"\b(?:PDF|JSON|question_id)\b", re.I),
        re.compile(r"\breview\s*:|jpg\s*확필", re.I),
        re.compile(r"저장소|저장된\s*기출|후속\s*관계|역사적\s*관계|이미지\s*자산"),
        re.compile(r"공개\s*(?:렌더링|화면|페이지)|안전\s*필터"),
        re.compile(r"questions\s*배열|기출\s*DB|DB\s*ID|기출\s*매칭|등록\s*기출\s*데이터", re.I),
    ]

    for rel, item in sorted(changes.items()):
        path = ROOT / rel
        source = path.read_text("utf-8")
        actual_before = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual_before != item["before"]:
            raise RuntimeError(f"source changed unexpectedly: {rel} ({actual_before})")

        original_frontmatter = frontmatter(source)
        for old, new in item["ops"]:
            occurrences = source.count(old)
            if occurrences != 1:
                raise RuntimeError(f"replacement anchor count {occurrences}: {rel} / {old[:80]!r}")
            source = source.replace(old, new, 1)

        updated_frontmatter = frontmatter(source)
        for field in FROZEN_FIELDS:
            if original_frontmatter.get(field) != updated_frontmatter.get(field):
                raise RuntimeError(f"frozen field changed: {rel} {field}")

        public_body = body(source)
        for pattern in blocked:
            if pattern.search(public_body):
                raise RuntimeError(f"blocked public content remains: {rel} / {pattern.pattern}")
        if re.search(r"[\x00-\x09\x0b-\x1f\x7f]", source):
            raise RuntimeError(f"control character remains: {rel}")
        if re.search(r"(?:^|\n)ho\s*=", public_body):
            raise RuntimeError(f"orphaned LaTeX rho token remains: {rel}")

        path.write_text(source, encoding="utf-8", newline="\n")
        actual_after = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual_after != item["after"]:
            raise RuntimeError(f"unexpected output hash: {rel} ({actual_after})")

    print(f"[content cleanup] updated {len(changes)} reviewed files")
    return 0


if __name__ == "__main__":
    sys.exit(main())

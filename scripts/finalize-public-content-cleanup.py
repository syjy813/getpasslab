#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

CHAPTER_DIR = Path("src/content/chapters")
QUESTIONS_FILE = Path("src/data/questions.json")

ID_RE = re.compile(r"\b(?P<date>\d{8})_(?P<number>\d{3})\b")
Q_ALIAS_RE = re.compile(r"\bq\d{8}(?:_\d{3})?\b", re.IGNORECASE)
FRONTMATTER_RE = re.compile(r"\A---\r?\n(?P<meta>[\s\S]*?)\r?\n---\r?\n(?P<body>[\s\S]*)\Z")
STRONG_RE = re.compile(r"\*\*([^*\n]{1,500}?)\*\*")
STRONG_UNDERSCORE_RE = re.compile(r"__([^_\n]{1,500}?)__")
ESCAPED_STRONG_RE = re.compile(r"\\\*\\\*([^\n]{1,500}?)\\\*\\\*")
ESCAPED_UNDERSCORE_RE = re.compile(r"\\_\\_([^\n]{1,500}?)\\_\\_")
CODE_TOKEN_RE = re.compile(r"`([a-z0-9][a-z0-9-]{2,})`")

# 사용자 화면에 노출되면 안 되는 제작·검수 관점 표현을 학습자용 표현으로 바꾼다.
PHRASE_REPLACEMENTS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"PDF\s*원문과\s*JSON(?:의)?\s*선택지는", re.IGNORECASE), "기출 선택지는"),
    (re.compile(r"PDF\s*원문과\s*JSON", re.IGNORECASE), "기출문항"),
    (re.compile(r"PDF\s*원문", re.IGNORECASE), "기출문항"),
    (re.compile(r"JSON(?:의)?\s*선택지", re.IGNORECASE), "기출 선택지"),
    (re.compile(r"\bJSON\b", re.IGNORECASE), "수록 기출"),
    (re.compile(r"\bquestion_id\b", re.IGNORECASE), "기출문항"),
    (re.compile(r"\breview\s*[:=]\s*jpg\s*확필\b", re.IGNORECASE), ""),
    (re.compile(r"\breview\s*[:=]\s*[^,.;)\]\n]+", re.IGNORECASE), ""),
    (re.compile(r"jpg\s*확필", re.IGNORECASE), ""),
    (re.compile(r"저장소의\s*역사적\s*매핑"), "기존 분류"),
    (re.compile(r"공개\s*렌더링"), "화면 표시"),
    (re.compile(r"안전\s*필터"), "공개 기준"),
    (re.compile(r"questions\s*배열", re.IGNORECASE), "연결 기출 목록"),
    (re.compile(r"기출\s*DB", re.IGNORECASE), "수록 기출"),
    (re.compile(r"DB\s*ID", re.IGNORECASE), "기출문항"),
    (re.compile(r"\bDB\b", re.IGNORECASE), "자료"),
]

# 선택지를 전부 복제한 내부 검수형 문장은 정답 판단 기준으로 축약한다.
CHOICE_SENTENCE_RE = re.compile(
    r"(?:기출\s*)?선택지는\s*[^\n.]*?정답은\s*\d+번\s*(?P<answer>[^\n.]+?)(?:이다|다)\.",
    re.IGNORECASE,
)

# 공개 콘텐츠에서 제작 범위를 방어적으로 설명하는 문장은 학습 포인트로 치환하거나 제거한다.
DEFENSIVE_SENTENCE_PATTERNS = [
    re.compile(
        r"이\s*챕터는\s*(?P<focus>[^.\n]+?)만\s*설명하고,\s*(?:별도의\s*)?[^.\n]+?확정하지\s*않는다\.",
        re.IGNORECASE,
    ),
    re.compile(
        r"이\s*챕터는\s*(?P<focus>[^.\n]+?)을?\s*설명하며,\s*[^.\n]+?(?:확장|일반화|확정)하지\s*않는다\.",
        re.IGNORECASE,
    ),
]

INTERNAL_SOURCE_PATTERNS = [
    re.compile(r"\b\d{8}_\d{3}\b"),
    re.compile(r"\bq\d{8}(?:_\d{3})?\b", re.IGNORECASE),
    re.compile(r"PDF\s*원문", re.IGNORECASE),
    re.compile(r"\bJSON\b", re.IGNORECASE),
    re.compile(r"\bquestion_id\b", re.IGNORECASE),
    re.compile(r"jpg\s*확필", re.IGNORECASE),
    re.compile(r"기출\s*DB", re.IGNORECASE),
    re.compile(r"DB\s*ID", re.IGNORECASE),
    re.compile(r"공개\s*렌더링"),
    re.compile(r"안전\s*필터"),
    re.compile(r"questions\s*배열", re.IGNORECASE),
]


def load_question_labels() -> dict[str, str]:
    raw = json.loads(QUESTIONS_FILE.read_text(encoding="utf-8"))
    records = raw if isinstance(raw, list) else raw.get("questions", [])
    labels: dict[str, str] = {}
    for record in records:
        if not isinstance(record, dict):
            continue
        question_id = str(record.get("id", "")).strip()
        if not question_id:
            continue
        label = str(record.get("label", "")).strip().replace(" 시행", " 시험")
        number = record.get("number")
        if label and isinstance(number, int):
            labels[question_id] = f"{label} {number}번"
        elif label:
            labels[question_id] = label
    return labels


def split_source(source: str, path: Path) -> tuple[str, str]:
    match = FRONTMATTER_RE.match(source)
    if not match:
        raise RuntimeError(f"frontmatter를 찾을 수 없음: {path}")
    return match.group("meta"), match.group("body")


def frozen_values(meta: str, path: Path) -> tuple[str, str, str]:
    slug = re.search(r"^slug:\s*(.+?)\s*$", meta, re.MULTILINE)
    subject = re.search(r"^subject_id:\s*(.+?)\s*$", meta, re.MULTILINE)
    questions = re.search(r"^questions:\s*(.+?)\s*$", meta, re.MULTILINE)
    if not slug or not subject or not questions:
        raise RuntimeError(f"동결 키를 읽을 수 없음: {path}")
    return slug.group(1), subject.group(1), questions.group(1)


def load_slug_titles(files: list[Path]) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for path in files:
        meta, _ = split_source(path.read_text(encoding="utf-8"), path)
        slug = re.search(r"^slug:\s*['\"]?([^'\"\r\n]+)['\"]?\s*$", meta, re.MULTILINE)
        title = re.search(r"^title:\s*(.+?)\s*$", meta, re.MULTILINE)
        if slug and title:
            mapping[slug.group(1).strip()] = title.group(1).strip().strip("'\"")
    return mapping


def human_question_label(question_id: str, labels: dict[str, str]) -> str:
    if question_id in labels:
        return labels[question_id]
    match = ID_RE.fullmatch(question_id)
    if not match:
        return "해당 기출"
    date = match.group("date")
    number = int(match.group("number"))
    return f"{int(date[:4])}년 {int(date[4:6])}월 시험 {number}번"


def clean_emphasis_body(text: str) -> str:
    # 한국어 조사와 붙어도 확실히 렌더링되도록 본문의 Markdown 강조를 HTML strong으로 고정한다.
    text = ESCAPED_STRONG_RE.sub(lambda m: f"<strong>{m.group(1).strip()}</strong>", text)
    text = ESCAPED_UNDERSCORE_RE.sub(lambda m: f"<strong>{m.group(1).strip()}</strong>", text)
    text = STRONG_RE.sub(lambda m: f"<strong>{m.group(1).strip()}</strong>", text)
    text = STRONG_UNDERSCORE_RE.sub(lambda m: f"<strong>{m.group(1).strip()}</strong>", text)
    return text


def clean_inline_plain(text: str, labels: dict[str, str], slug_titles: dict[str, str]) -> str:
    text = ESCAPED_STRONG_RE.sub(lambda m: m.group(1).strip(), text)
    text = ESCAPED_UNDERSCORE_RE.sub(lambda m: m.group(1).strip(), text)
    text = STRONG_RE.sub(lambda m: m.group(1).strip(), text)
    text = STRONG_UNDERSCORE_RE.sub(lambda m: m.group(1).strip(), text)
    text = ID_RE.sub(lambda m: human_question_label(m.group(0), labels), text)
    text = Q_ALIAS_RE.sub("해당 기출", text)
    for pattern, replacement in PHRASE_REPLACEMENTS:
        text = pattern.sub(replacement, text)
    text = CODE_TOKEN_RE.sub(lambda m: slug_titles.get(m.group(1), m.group(1)), text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    return text


def clean_body(text: str, labels: dict[str, str], slug_titles: dict[str, str]) -> str:
    text = clean_emphasis_body(text)
    text = ID_RE.sub(lambda m: human_question_label(m.group(0), labels), text)
    text = Q_ALIAS_RE.sub("해당 기출", text)

    for pattern, replacement in PHRASE_REPLACEMENTS:
        text = pattern.sub(replacement, text)

    text = CODE_TOKEN_RE.sub(
        lambda m: slug_titles.get(m.group(1), m.group(0)),
        text,
    )

    text = CHOICE_SENTENCE_RE.sub(
        lambda m: f"정답 판단의 핵심은 {m.group('answer').strip()}이다.",
        text,
    )

    for pattern in DEFENSIVE_SENTENCE_PATTERNS:
        text = pattern.sub(
            lambda m: f"{m.group('focus').strip()}을 중심으로 판단한다.",
            text,
        )

    # 내부 검수 메모가 괄호 안에만 남은 경우 괄호 전체를 제거한다.
    text = re.sub(
        r"\([^()\n]*(?:PDF|JSON|question_id|review|jpg\s*확필|기출\s*DB|DB\s*ID)[^()\n]*\)",
        "",
        text,
        flags=re.IGNORECASE,
    )

    # 중복된 기출 표현과 기계적인 문장 연결을 정리한다.
    text = re.sub(r"기출\s*기출", "기출", text)
    text = re.sub(r"수록\s*기출\s*기출", "수록 기출", text)
    text = re.sub(r"[ \t]+([,.;:!?])", r"\1", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def clean_meta(meta: str, labels: dict[str, str], slug_titles: dict[str, str]) -> str:
    lines = meta.splitlines()
    cleaned: list[str] = []
    for line in lines:
        if line.startswith("examComment:"):
            value = line.split(":", 1)[1].strip()
            value = clean_inline_plain(value, labels, slug_titles)
            line = f"examComment: {value}"
        cleaned.append(line)
    return "\n".join(cleaned)


def assert_no_internal_source(path: Path, meta: str, body: str, slug_titles: dict[str, str]) -> None:
    visible_source = body
    exam_match = re.search(r"^examComment:\s*(.*?)\s*$", meta, re.MULTILINE)
    if exam_match:
        visible_source += "\n" + exam_match.group(1)

    failures: list[str] = []
    for pattern in INTERNAL_SOURCE_PATTERNS:
        if pattern.search(visible_source):
            failures.append(pattern.pattern)

    if re.search(r"(?:\\?\*\\?\*[^*\n]{1,500}\\?\*\\?\*|__[^_\n]{1,500}__)", visible_source):
        failures.append("unrendered emphasis")

    for token in re.findall(r"`([a-z0-9][a-z0-9-]{2,})`", visible_source):
        if token in slug_titles:
            failures.append(f"chapter slug:{token}")

    if failures:
        raise RuntimeError(f"정리 후 내부 표현 잔존: {path} -> {', '.join(failures)}")


def main() -> None:
    files = sorted(CHAPTER_DIR.rglob("*.md"))
    if not files:
        raise RuntimeError("챕터 파일이 없습니다.")

    labels = load_question_labels()
    slug_titles = load_slug_titles(files)
    frozen_before: dict[str, tuple[str, str, str]] = {}
    changed: list[str] = []

    for path in files:
        source = path.read_text(encoding="utf-8")
        meta, body = split_source(source, path)
        frozen_before[str(path)] = frozen_values(meta, path)

        new_meta = clean_meta(meta, labels, slug_titles)
        new_body = clean_body(body, labels, slug_titles)
        assert_no_internal_source(path, new_meta, new_body, slug_titles)

        new_source = f"---\n{new_meta}\n---\n{new_body}"
        if new_source != source.replace("\r\n", "\n"):
            path.write_text(new_source, encoding="utf-8")
            changed.append(str(path))

    for path in files:
        meta, _ = split_source(path.read_text(encoding="utf-8"), path)
        if frozen_values(meta, path) != frozen_before[str(path)]:
            raise RuntimeError(f"동결 키 변경 감지: {path}")

    print(f"[content-cleanup] inspected={len(files)} changed={len(changed)}")
    for path in changed:
        print(f"[content-cleanup] updated {path}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render and verify Energy Management chapter-review candidates against source PDFs."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw, ImageFont


FILLED_ANSWERS = {"❶": 1, "❷": 2, "❸": 3, "❹": 4}
ANCHOR_RE = re.compile(r"^(\d{1,2})\.$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", type=Path, required=True)
    parser.add_argument(
        "--classification",
        type=Path,
        default=Path("docs/audits/2026-08-05-energy-management-chapter-classification.csv"),
    )
    parser.add_argument(
        "--questions",
        type=Path,
        default=Path("src/data/questions/energy-management.json"),
    )
    parser.add_argument(
        "--image-manifest",
        type=Path,
        default=Path("docs/audits/2026-08-05-energy-management-question-image-assets.csv"),
    )
    parser.add_argument("--output-dir", type=Path, default=Path("tmp/pdfs/energy-candidate-review"))
    parser.add_argument(
        "--ledger",
        type=Path,
        default=Path("docs/audits/2026-08-05-energy-management-pdf-candidate-review.csv"),
    )
    return parser.parse_args()


def normalized(text: str) -> str:
    return re.sub(r"\s+", "", text).replace("ㆍ", "·")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def question_anchors(page: pdfplumber.page.Page) -> list[dict[str, float | int]]:
    anchors: list[dict[str, float | int]] = []
    midpoint = page.width / 2
    for word in page.extract_words(use_text_flow=False, keep_blank_chars=False):
        match = ANCHOR_RE.match(word["text"])
        if not match:
            continue
        x0 = float(word["x0"])
        if not (x0 < 45 or midpoint < x0 < midpoint + 45):
            continue
        anchors.append(
            {
                "number": int(match.group(1)),
                "x0": x0,
                "top": float(word["top"]),
                "column": 0 if x0 < midpoint else 1,
            }
        )
    return anchors


def find_question(pdf: pdfplumber.PDF, number: int) -> tuple[int, int, tuple[float, float, float, float]]:
    matches: list[tuple[int, dict[str, float | int], list[dict[str, float | int]]]] = []
    for page_index, page in enumerate(pdf.pages):
        anchors = question_anchors(page)
        for anchor in anchors:
            if anchor["number"] == number:
                matches.append((page_index, anchor, anchors))
    if len(matches) != 1:
        raise ValueError(f"question {number}: expected one PDF anchor, found {len(matches)}")

    page_index, anchor, anchors = matches[0]
    page = pdf.pages[page_index]
    column = int(anchor["column"])
    top = max(0.0, float(anchor["top"]) - 4.0)
    following = [
        float(item["top"])
        for item in anchors
        if int(item["column"]) == column and float(item["top"]) > float(anchor["top"]) + 1
    ]
    bottom = min(following) - 4.0 if following else page.height - 30.0
    midpoint = page.width / 2
    left = 20.0 if column == 0 else midpoint + 2.0
    right = midpoint - 2.0 if column == 0 else page.width - 20.0
    return page_index, column, (left, top, right, bottom)


def source_answer(crop_text: str) -> int | None:
    found = [value for marker, value in FILLED_ANSWERS.items() if marker in crop_text]
    return found[0] if len(found) == 1 else None


def continuation_crop(
    pdf: pdfplumber.PDF,
    page_index: int,
    column: int,
) -> tuple[pdfplumber.page.CroppedPage, int]:
    continuation_page_index = page_index if column == 0 else page_index + 1
    continuation_column = 1 if column == 0 else 0
    if continuation_page_index >= len(pdf.pages):
        raise ValueError("question continuation would exceed PDF page count")
    page = pdf.pages[continuation_page_index]
    following_anchors = [
        float(anchor["top"])
        for anchor in question_anchors(page)
        if int(anchor["column"]) == continuation_column
    ]
    if not following_anchors:
        raise ValueError("continuation column has no following question anchor")
    midpoint = page.width / 2
    left = 20.0 if continuation_column == 0 else midpoint + 2.0
    right = midpoint - 2.0 if continuation_column == 0 else page.width - 20.0
    return page.crop((left, 55.0, right, min(following_anchors) - 4.0)), continuation_page_index


def stacked_image(parts: list[pdfplumber.page.CroppedPage], resolution: int = 200) -> Image.Image:
    images = [part.to_image(resolution=resolution, antialias=True).original.convert("RGB") for part in parts]
    canvas = Image.new("RGB", (max(image.width for image in images), sum(image.height for image in images)), "white")
    y = 0
    for image in images:
        canvas.paste(image, (0, y))
        y += image.height
    return canvas


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def make_contact_sheets(
    rows: list[dict[str, str]],
    crops_dir: Path,
    output_dir: Path,
    prefix: str,
    per_sheet: int = 8,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    label_font = font(22)
    column_width = 900
    header_height = 44
    padding = 16
    for sheet_index in range(0, len(rows), per_sheet):
        batch = rows[sheet_index : sheet_index + per_sheet]
        prepared: list[tuple[dict[str, str], Image.Image]] = []
        for row in batch:
            image = Image.open(crops_dir / f"{row['question_id']}.png").convert("RGB")
            if image.width > column_width - padding * 2:
                ratio = (column_width - padding * 2) / image.width
                image = image.resize((int(image.width * ratio), int(image.height * ratio)))
            prepared.append((row, image))

        row_heights: list[int] = []
        for start in range(0, len(prepared), 2):
            pair = prepared[start : start + 2]
            row_heights.append(max(image.height for _, image in pair) + header_height + padding * 2)
        canvas = Image.new("RGB", (column_width * 2, sum(row_heights)), "white")
        draw = ImageDraw.Draw(canvas)
        y = 0
        for pair_index, start in enumerate(range(0, len(prepared), 2)):
            pair = prepared[start : start + 2]
            row_height = row_heights[pair_index]
            for column, (row, image) in enumerate(pair):
                x = column * column_width
                label = (
                    f"{row['question_id']}  p{row['source_page']}  "
                    f"src/stored={row['source_answer']}/{row['stored_answer']}  "
                    f"{row['scope']}  {row['final_topic']}"
                )
                draw.rectangle((x, y, x + column_width - 1, y + row_height - 1), outline="#777777")
                draw.text((x + padding, y + 8), label, fill="black", font=label_font)
                canvas.paste(image, (x + padding, y + header_height))
            y += row_height
        output = output_dir / f"{prefix}-{sheet_index // per_sheet + 1:02d}.jpg"
        canvas.save(output, quality=92, subsampling=0)


def make_asset_sheets(rows: list[dict[str, str]], output_dir: Path, per_sheet: int = 8) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    label_font = font(22)
    column_width = 900
    header_height = 80
    padding = 16
    for sheet_index in range(0, len(rows), per_sheet):
        batch = rows[sheet_index : sheet_index + per_sheet]
        prepared: list[tuple[dict[str, str], Image.Image]] = []
        for row in batch:
            image = Image.open(row["asset_path"]).convert("RGB")
            if image.width > column_width - padding * 2:
                ratio = (column_width - padding * 2) / image.width
                image = image.resize((int(image.width * ratio), int(image.height * ratio)))
            prepared.append((row, image))

        row_heights: list[int] = []
        for start in range(0, len(prepared), 2):
            pair = prepared[start : start + 2]
            row_heights.append(max(image.height for _, image in pair) + header_height + padding * 2)
        canvas = Image.new("RGB", (column_width * 2, sum(row_heights)), "white")
        draw = ImageDraw.Draw(canvas)
        y = 0
        for pair_index, start in enumerate(range(0, len(prepared), 2)):
            pair = prepared[start : start + 2]
            row_height = row_heights[pair_index]
            for column, (row, image) in enumerate(pair):
                x = column * column_width
                draw.rectangle((x, y, x + column_width - 1, y + row_height - 1), outline="#777777")
                draw.text((x + padding, y + 8), row["question_id"], fill="black", font=label_font)
                draw.text((x + padding, y + 40), row["missing_element"], fill="black", font=label_font)
                canvas.paste(image, (x + padding, y + header_height))
            y += row_height
        output = output_dir / f"assets-{sheet_index // per_sheet + 1:02d}.jpg"
        canvas.save(output, quality=92, subsampling=0)


def main() -> None:
    args = parse_args()
    classifications = load_csv(args.classification)
    image_manifest = {row["question_id"]: row for row in load_csv(args.image_manifest)}
    questions = {
        question["id"]: question
        for question in json.loads(args.questions.read_text(encoding="utf-8"))
    }
    candidates = [
        row
        for row in classifications
        if row["confidence"] == "low" or row["review"] == "jpg 확필"
    ]
    expected_ids = {row["question_id"] for row in candidates}
    if len(candidates) != len(expected_ids):
        raise ValueError("candidate classification contains duplicate IDs")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    crops_dir = args.output_dir / "crops"
    sheets_dir = args.output_dir / "sheets"
    crops_dir.mkdir(parents=True, exist_ok=True)

    pdf_by_date = {
        match.group(1): path
        for path in args.pdf_dir.glob("*.pdf")
        if (match := re.search(r"(\d{8})", path.name))
    }
    if len(pdf_by_date) != 27:
        raise ValueError(f"expected 27 source PDFs, got {len(pdf_by_date)}")
    rows: list[dict[str, str]] = []
    open_pdfs: dict[str, pdfplumber.PDF] = {}
    try:
        for classification in candidates:
            question_id = classification["question_id"]
            question = questions[question_id]
            date_key = question_id.split("_")[0]
            pdf_path = pdf_by_date.get(date_key)
            if not pdf_path:
                raise FileNotFoundError(f"source PDF missing for {question_id}")
            if date_key not in open_pdfs:
                open_pdfs[date_key] = pdfplumber.open(pdf_path)
            pdf = open_pdfs[date_key]
            page_index, column, bbox = find_question(pdf, int(question["number"]))
            crop = pdf.pages[page_index].crop(bbox)
            crop_text = crop.extract_text() or ""
            extracted_answer = source_answer(crop_text)
            crop_parts = [crop]
            page_label = str(page_index + 1)
            if extracted_answer is None:
                continuation, continuation_page_index = continuation_crop(pdf, page_index, column)
                continuation_text = continuation.extract_text() or ""
                crop_text = f"{crop_text}\n{continuation_text}"
                crop_parts.append(continuation)
                extracted_answer = source_answer(crop_text)
                if continuation_page_index != page_index:
                    page_label = f"{page_index + 1}-{continuation_page_index + 1}"
            stacked_image(crop_parts).save(crops_dir / f"{question_id}.png")

            body_found = normalized(question["body"])[:30] in normalized(crop_text)
            image_row = image_manifest.get(question_id, {})
            asset_path = image_row.get("asset_path", "")
            asset_hash = sha256(Path(asset_path)) if asset_path and Path(asset_path).exists() else ""
            scope = "both" if classification["confidence"] == "low" and classification["review"] == "jpg 확필" else (
                "low" if classification["confidence"] == "low" else "image"
            )
            rows.append(
                {
                    "question_id": question_id,
                    "scope": scope,
                    "source_pdf": pdf_path.name,
                    "source_pdf_sha256": sha256(pdf_path),
                    "source_page": page_label,
                    "number": str(question["number"]),
                    "source_answer": "" if extracted_answer is None else str(extracted_answer),
                    "stored_answer": str(question["answer"]),
                    "answer_match": str(extracted_answer == question["answer"]).lower(),
                    "body_anchor_match": str(body_found).lower(),
                    "review": question["review"],
                    "primary_topic": classification["primary_topic"],
                    "final_topic": classification["final_topic"],
                    "topic_changed": str(
                        classification["primary_topic"] != classification["final_topic"]
                    ).lower(),
                    "review_resolution": classification["review_resolution"],
                    "runner_up": classification["runner_up"],
                    "confidence": classification["confidence"],
                    "tied": classification["tied"],
                    "correct_choice": question["choices"][question["answer"] - 1],
                    "missing_element": image_row.get("missing_element", ""),
                    "asset_path": asset_path,
                    "asset_sha256": asset_hash,
                    "asset_hash_match": str(bool(asset_hash) and asset_hash == image_row.get("sha256", "")).lower(),
                    "body": question["body"],
                    "choices": " | ".join(question["choices"]),
                }
            )
    finally:
        for pdf in open_pdfs.values():
            pdf.close()

    rows.sort(key=lambda row: row["question_id"])
    if len(rows) != 86:
        raise ValueError(f"expected 86 unique review candidates, got {len(rows)}")
    if any(row["review_resolution"] != "pdf-reviewed" for row in rows):
        failed = [row["question_id"] for row in rows if row["review_resolution"] != "pdf-reviewed"]
        raise ValueError(f"candidate missing PDF-reviewed resolution: {failed}")
    if sum(row["topic_changed"] == "true" for row in rows) != 22:
        raise ValueError("expected 22 reviewed topic corrections")
    if any(row["answer_match"] != "true" for row in rows):
        failed = [row["question_id"] for row in rows if row["answer_match"] != "true"]
        raise ValueError(f"source answer extraction mismatch: {failed}")
    body_anchor_exceptions = [row["question_id"] for row in rows if row["body_anchor_match"] != "true"]
    if body_anchor_exceptions != ["20140406_031"]:
        raise ValueError(f"unexpected body anchor exceptions: {body_anchor_exceptions}")
    image_rows = [row for row in rows if row["scope"] in {"image", "both"}]
    if len(image_rows) != 32:
        raise ValueError(f"expected 32 image candidates, got {len(image_rows)}")
    if any(row["asset_hash_match"] != "true" for row in image_rows):
        failed = [row["question_id"] for row in image_rows if row["asset_hash_match"] != "true"]
        raise ValueError(f"image asset hash mismatch: {failed}")

    args.ledger.parent.mkdir(parents=True, exist_ok=True)
    with args.ledger.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)

    make_contact_sheets(rows, crops_dir, sheets_dir, "all-candidates")
    make_contact_sheets([row for row in rows if row["scope"] in {"low", "both"}], crops_dir, sheets_dir, "low")
    make_contact_sheets(image_rows, crops_dir, sheets_dir, "image")
    make_asset_sheets(image_rows, sheets_dir)

    print(
        json.dumps(
            {
                "candidates": len(rows),
                "low": sum(row["scope"] in {"low", "both"} for row in rows),
                "image": sum(row["scope"] in {"image", "both"} for row in rows),
                "answer_matches": sum(row["answer_match"] == "true" for row in rows),
                "body_anchor_matches": sum(row["body_anchor_match"] == "true" for row in rows),
                "asset_hash_matches": sum(row["asset_hash_match"] == "true" for row in image_rows),
                "reviewed_topic_corrections": sum(row["topic_changed"] == "true" for row in rows),
                "contact_sheets": len(list(sheets_dir.glob("*.jpg"))),
                "ledger": str(args.ledger),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

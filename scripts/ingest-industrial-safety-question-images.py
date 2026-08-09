#!/usr/bin/env python3
"""Extract industrial-safety question visuals from the original student PDFs.

Teacher PDFs are used only to verify the stored answer. Student PDFs are used
for the public-facing assets so that the correct-answer marker is not exposed.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

import pdfplumber
from PIL import Image, ImageChops, ImageDraw, ImageFont


QUESTION_ANCHOR_RE = re.compile(r"^(\d{1,3})\.$")
ANSWER_MARKERS = {
    "❶": 1,
    "❷": 2,
    "❸": 3,
    "❹": 4,
    "➊": 1,
    "➋": 2,
    "➌": 3,
    "➍": 4,
}
CHOICE_MARKERS = {
    "①": 1,
    "②": 2,
    "③": 3,
    "④": 4,
    **ANSWER_MARKERS,
}
NON_IMAGE_FALSE_POSITIVES = {"20180428_065"}
PIXEL_CROP_OVERRIDES = {
    "20180304_080": (20, 36, 360, 190),
    "20180428_063": (20, 36, 360, 190),
    "20180819_080": (130, 0, 365, 159),
}


@dataclass(frozen=True)
class Piece:
    page_index: int
    column: int
    bbox: tuple[float, float, float, float]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", type=Path, required=True)
    parser.add_argument(
        "--questions",
        type=Path,
        default=Path("src/data/questions/industrial-safety.json"),
    )
    parser.add_argument(
        "--asset-dir",
        type=Path,
        default=Path("src/assets/questions/industrial-safety"),
    )
    parser.add_argument(
        "--asset-registry",
        type=Path,
        default=Path("src/data/question-assets/industrial-safety.json"),
    )
    parser.add_argument(
        "--asset-manifest",
        type=Path,
        default=Path(
            "docs/audits/2026-08-09-industrial-safety-question-image-assets.csv"
        ),
    )
    parser.add_argument(
        "--review-dir",
        type=Path,
        default=Path("tmp/pdfs/industrial-safety-question-images"),
    )
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def question_anchors(page: pdfplumber.page.Page) -> list[dict[str, float | int]]:
    midpoint = page.width / 2
    found: list[dict[str, float | int]] = []
    for word in page.extract_words(use_text_flow=False, keep_blank_chars=False):
        match = QUESTION_ANCHOR_RE.match(word["text"])
        if not match:
            continue
        x0 = float(word["x0"])
        if not (x0 < 45 or midpoint < x0 < midpoint + 45):
            continue
        found.append(
            {
                "number": int(match.group(1)),
                "top": float(word["top"]),
                "column": 0 if x0 < midpoint else 1,
            }
        )
    return found


def column_bounds(page: pdfplumber.page.Page, column: int) -> tuple[float, float]:
    midpoint = page.width / 2
    return (20.0, midpoint - 2.0) if column == 0 else (midpoint + 2.0, page.width - 20.0)


def find_question(pdf: pdfplumber.PDF, number: int) -> Piece:
    matches: list[tuple[int, dict[str, float | int], list[dict[str, float | int]]]] = []
    for page_index, page in enumerate(pdf.pages):
        anchors = question_anchors(page)
        for anchor in anchors:
            if anchor["number"] == number:
                matches.append((page_index, anchor, anchors))
    if len(matches) != 1:
        raise ValueError(f"question {number}: expected one anchor, found {len(matches)}")

    page_index, anchor, anchors = matches[0]
    page = pdf.pages[page_index]
    column = int(anchor["column"])
    left, right = column_bounds(page, column)
    following = [
        float(item["top"])
        for item in anchors
        if int(item["column"]) == column
        and float(item["top"]) > float(anchor["top"]) + 1
    ]
    bottom = min(following) - 4.0 if following else page.height - 30.0
    return Piece(page_index, column, (left, max(45.0, float(anchor["top"]) - 4.0), right, bottom))


def next_position(page_index: int, column: int) -> tuple[int, int]:
    return (page_index, 1) if column == 0 else (page_index + 1, 0)


def preamble_piece(pdf: pdfplumber.PDF, page_index: int, column: int) -> Piece:
    if page_index >= len(pdf.pages):
        raise ValueError("question continuation exceeds PDF page count")
    page = pdf.pages[page_index]
    left, right = column_bounds(page, column)
    tops = [
        float(item["top"])
        for item in question_anchors(page)
        if int(item["column"]) == column
    ]
    bottom = min(tops) - 4.0 if tops else page.height - 30.0
    if bottom <= 45.0:
        raise ValueError("question continuation has no visible preamble")
    return Piece(page_index, column, (left, 45.0, right, bottom))


def piece_text(pdf: pdfplumber.PDF, piece: Piece) -> str:
    return pdf.pages[piece.page_index].crop(piece.bbox).extract_text(
        x_tolerance=2,
        y_tolerance=2,
    ) or ""


def source_answer(text: str) -> int | None:
    found = [answer for marker, answer in ANSWER_MARKERS.items() if marker in text]
    return found[0] if len(found) == 1 else None


def source_choices(text: str) -> set[int]:
    return {number for marker, number in CHOICE_MARKERS.items() if marker in text}


def question_pieces(pdf: pdfplumber.PDF, number: int) -> tuple[list[Piece], int]:
    pieces = [find_question(pdf, number)]
    combined = piece_text(pdf, pieces[0])
    answer = source_answer(combined)
    choices = source_choices(combined)
    while (answer is None or choices != {1, 2, 3, 4}) and len(pieces) < 4:
        page_index, column = next_position(pieces[-1].page_index, pieces[-1].column)
        piece = preamble_piece(pdf, page_index, column)
        pieces.append(piece)
        combined += "\n" + piece_text(pdf, piece)
        answer = source_answer(combined)
        choices = source_choices(combined)
    if answer is None:
        raise ValueError(f"question {number}: teacher answer marker not found")
    if choices != {1, 2, 3, 4}:
        raise ValueError(f"question {number}: source choices incomplete: {sorted(choices)}")
    return pieces, answer


def matching_student_pieces(pdf: pdfplumber.PDF, teacher_pieces: list[Piece]) -> list[Piece]:
    pieces: list[Piece] = []
    for piece in teacher_pieces:
        page = pdf.pages[piece.page_index]
        left, right = column_bounds(page, piece.column)
        pieces.append(
            Piece(
                piece.page_index,
                piece.column,
                (left, piece.bbox[1], right, min(piece.bbox[3], page.height - 30.0)),
            )
        )
    return pieces


def image_boxes(page: pdfplumber.page.Page, piece: Piece) -> list[tuple[float, float, float, float]]:
    left, top, right, bottom = piece.bbox
    boxes: list[tuple[float, float, float, float]] = []
    for image in page.images:
        bbox = (
            float(image["x0"]),
            float(image["top"]),
            float(image["x1"]),
            float(image["bottom"]),
        )
        if bbox[2] > left and bbox[0] < right and bbox[3] > top and bbox[1] < bottom:
            boxes.append(bbox)
    return boxes


def visual_piece(page: pdfplumber.page.Page, piece: Piece, boxes: list[tuple[float, float, float, float]]) -> Piece:
    top = max(piece.bbox[1], min(box[1] for box in boxes) - 6.0)
    bottom = min(piece.bbox[3], max(box[3] for box in boxes) + 6.0)
    return Piece(
        piece.page_index,
        piece.column,
        (piece.bbox[0] + 10.0, top, piece.bbox[2] - 2.0, bottom),
    )


def render_piece(pdf: pdfplumber.PDF, piece: Piece, resolution: int = 300) -> Image.Image:
    return (
        pdf.pages[piece.page_index]
        .crop(piece.bbox)
        .to_image(resolution=resolution, antialias=True)
        .original.convert("RGB")
    )


def trim_white(image: Image.Image, border: int = 10) -> Image.Image:
    background = Image.new("RGB", image.size, "white")
    difference = ImageChops.difference(image, background).convert("L")
    bbox = difference.point(lambda value: 255 if value > 12 else 0).getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - border)
    top = max(0, bbox[1] - border)
    right = min(image.width, bbox[2] + border)
    bottom = min(image.height, bbox[3] + border)
    return image.crop((left, top, right, bottom))


def stack(images: list[Image.Image], gap: int = 18) -> Image.Image:
    width = max(image.width for image in images)
    height = sum(image.height for image in images) + gap * (len(images) - 1)
    canvas = Image.new("RGB", (width, height), "white")
    y = 0
    for image in images:
        canvas.paste(image, (0, y))
        y += image.height + gap
    return canvas


def make_asset(pdf: pdfplumber.PDF, pieces: list[Piece]) -> tuple[Image.Image, str, int]:
    visual_pieces: list[Piece] = []
    image_count = 0
    for piece in pieces:
        boxes = image_boxes(pdf.pages[piece.page_index], piece)
        image_count += len(boxes)
        if boxes:
            visual_pieces.append(visual_piece(pdf.pages[piece.page_index], piece, boxes))

    crop_mode = "embedded-visual"
    selected = visual_pieces
    if not selected:
        crop_mode = "full-question-fallback"
        selected = pieces
    rendered = [trim_white(render_piece(pdf, piece)) for piece in selected]
    return stack(rendered), crop_mode, image_count


def apply_pixel_crop(question_id: str, image: Image.Image) -> Image.Image:
    bbox = PIXEL_CROP_OVERRIDES.get(question_id)
    if bbox is None:
        return image
    if bbox[2] > image.width or bbox[3] > image.height:
        raise ValueError(
            f"{question_id}: crop override {bbox} exceeds image size {image.size}"
        )
    return trim_white(image.crop(bbox))


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in (Path("C:/Windows/Fonts/malgun.ttf"), Path("C:/Windows/Fonts/arial.ttf")):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def contact_sheets(asset_dir: Path, output_dir: Path, ids: list[str], per_sheet: int = 6) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    label_font = font(22)
    column_width = 900
    padding = 16
    label_height = 44
    for sheet_start in range(0, len(ids), per_sheet):
        batch = ids[sheet_start : sheet_start + per_sheet]
        prepared: list[tuple[str, Image.Image]] = []
        for question_id in batch:
            image = Image.open(asset_dir / f"{question_id}.png").convert("RGB")
            if image.width > column_width - padding * 2:
                ratio = (column_width - padding * 2) / image.width
                image = image.resize(
                    (int(image.width * ratio), int(image.height * ratio)),
                    Image.Resampling.LANCZOS,
                )
            prepared.append((question_id, image))
        rows = [prepared[index : index + 2] for index in range(0, len(prepared), 2)]
        row_heights = [max(image.height for _, image in row) + label_height + padding * 2 for row in rows]
        canvas = Image.new("RGB", (column_width * 2, sum(row_heights)), "white")
        draw = ImageDraw.Draw(canvas)
        y = 0
        for row, row_height in zip(rows, row_heights):
            for column, (question_id, image) in enumerate(row):
                x = column * column_width
                draw.rectangle((x, y, x + column_width - 1, y + row_height - 1), outline="#777777")
                draw.text((x + padding, y + 8), question_id, fill="black", font=label_font)
                canvas.paste(image, (x + padding, y + label_height))
            y += row_height
        canvas.save(output_dir / f"assets-{sheet_start // per_sheet + 1:02d}.jpg", quality=94, subsampling=0)


def pdf_index(root: Path) -> dict[tuple[str, str], Path]:
    found: dict[tuple[str, str], Path] = {}
    for path in root.rglob("*.pdf"):
        date_match = re.search(r"(20\d{6})", path.name)
        kind = "teacher" if "교사용" in path.name else "student" if "학생용" in path.name else None
        if not date_match or kind is None:
            continue
        key = (date_match.group(1), kind)
        if key in found:
            raise ValueError(f"duplicate source PDF for {key}: {found[key]} and {path}")
        found[key] = path
    return found


def main() -> None:
    args = parse_args()
    questions = json.loads(args.questions.read_text(encoding="utf-8"))
    candidates = [question for question in questions if question.get("review") == "jpg 확필"]
    if len(candidates) != 76:
        raise ValueError(f"expected 76 image candidates, found {len(candidates)}")

    args.asset_dir.mkdir(parents=True, exist_ok=True)
    args.asset_registry.parent.mkdir(parents=True, exist_ok=True)
    args.asset_manifest.parent.mkdir(parents=True, exist_ok=True)
    index = pdf_index(args.pdf_dir)
    open_pdfs: dict[Path, pdfplumber.PDF] = {}
    hashes: dict[Path, str] = {}
    rows: list[dict[str, object]] = []

    try:
        for question in candidates:
            date_key = question["id"].split("_", 1)[0]
            teacher_path = index.get((date_key, "teacher"))
            student_path = index.get((date_key, "student"))
            if teacher_path is None or student_path is None:
                raise FileNotFoundError(f"missing teacher or student PDF for {date_key}")
            for path in (teacher_path, student_path):
                if path not in open_pdfs:
                    open_pdfs[path] = pdfplumber.open(path)
                    hashes[path] = sha256(path)

            teacher = open_pdfs[teacher_path]
            student = open_pdfs[student_path]
            teacher_pieces, answer = question_pieces(teacher, int(question["number"]))
            if answer != int(question["answer"]):
                raise ValueError(
                    f"{question['id']}: source/stored answer mismatch {answer}/{question['answer']}"
                )
            student_pieces = matching_student_pieces(student, teacher_pieces)
            false_positive = question["id"] in NON_IMAGE_FALSE_POSITIVES
            if false_positive:
                asset_required = False
                crop_mode = "not-an-image-question"
                source_image_count = 0
                asset_path_text = ""
                width = ""
                height = ""
                asset_hash = ""
                alt = ""
            else:
                asset_required = True
                asset, crop_mode, source_image_count = make_asset(student, student_pieces)
                asset = apply_pixel_crop(question["id"], asset)
                asset_path = args.asset_dir / f"{question['id']}.png"
                asset.save(asset_path, optimize=True)
                asset_path_text = asset_path.as_posix()
                width = asset.width
                height = asset.height
                asset_hash = sha256(asset_path)
                alt = f"{question['body']} 문항에 제시된 원본 표·수식·도형"
            rows.append(
                {
                    "question_id": question["id"],
                    "source_student_pdf": student_path.name,
                    "source_student_pdf_sha256": hashes[student_path],
                    "source_teacher_pdf": teacher_path.name,
                    "source_teacher_pdf_sha256": hashes[teacher_path],
                    "source_pages": "+".join(str(piece.page_index + 1) for piece in student_pieces),
                    "stored_answer": question["answer"],
                    "source_answer": answer,
                    "answer_match": True,
                    "asset_required": asset_required,
                    "crop_mode": crop_mode,
                    "source_image_count": source_image_count,
                    "asset_path": asset_path_text,
                    "width_px": width,
                    "height_px": height,
                    "asset_sha256": asset_hash,
                    "teacher_answer_mark_included": False,
                    "review_status": question["review"],
                    "alt_text": alt,
                }
            )
    finally:
        for pdf in open_pdfs.values():
            pdf.close()

    fieldnames = list(rows[0])
    with args.asset_manifest.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    registry = [
        {
            "id": row["question_id"],
            "asset_path": row["asset_path"],
            "width": row["width_px"],
            "height": row["height_px"],
            "alt": row["alt_text"],
        }
        for row in rows
        if row["asset_required"]
    ]
    args.asset_registry.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    contact_sheets(
        args.asset_dir,
        args.review_dir / "asset-sheets",
        [str(row["question_id"]) for row in rows if row["asset_required"]],
    )
    print(
        json.dumps(
            {
                "candidates": len(rows),
                "assets": sum(bool(row["asset_required"]) for row in rows),
                "embedded_visual": sum(row["crop_mode"] == "embedded-visual" for row in rows),
                "full_question_fallback": sum(row["crop_mode"] == "full-question-fallback" for row in rows),
                "not_an_image_question": sum(row["crop_mode"] == "not-an-image-question" for row in rows),
                "answer_matches": sum(bool(row["answer_match"]) for row in rows),
                "asset_dir": str(args.asset_dir),
                "manifest": str(args.asset_manifest),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Create a reviewable Computer Literacy written-exam draft from a teacher PDF."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw, ImageFont


QUESTION_ANCHOR_RE = re.compile(r"^(\d{1,2})\.$")
CHOICE_MARKER_RE = re.compile(r"([①②③④❶❷❸❹])")
CHOICE_NUMBER = {
    "①": 1,
    "②": 2,
    "③": 3,
    "④": 4,
    "❶": 1,
    "❷": 2,
    "❸": 3,
    "❹": 4,
}
FILLED_MARKERS = {"❶": 1, "❷": 2, "❸": 3, "❹": 4}

VISUAL_DESCRIPTIONS = {
    1: "렌더링 작업을 설명한 보기 상자",
    18: "㉠~㉣이 표시된 노트북 사양 목록",
    21: "엑셀 빠른 실행 도구 모음의 실행 취소 아이콘",
    23: "제품별 판매현황 표와 목표값 찾기 설정 화면",
    25: "근무기간과 나이를 조합한 고급 필터 조건 선택지 네 개",
    26: "엑셀 부분합 설정 대화상자",
    27: "입력 데이터·표시 형식·표시 결과 선택지 네 개",
    28: "엑셀 통합 설정 대화상자",
    29: "가·갑·월·자가 입력된 워크시트 행",
    32: "메모가 표시된 성적 관리 워크시트",
    33: "이율과 원금에 따른 수익금액 계산표",
    35: "환자번호와 성별 코드표가 포함된 워크시트",
    36: "나무 종류와 수확량 데이터가 포함된 워크시트",
    38: "매크로 보안 경고가 표시된 엑셀 화면",
    39: "학점별 인원수를 클럽 기호로 표시한 워크시트",
    40: "반별 남녀 인원 표와 묶은 세로 막대형 차트",
}

VISUAL_ALT_TEXT = {
    1: "컴퓨터 프로그램으로 3차원 애니메이션 사물 모형에 명암과 색상을 추가하는 작업을 설명한 보기",
    18: "Intel Core i5-8세대, Intel UHD Graphics 620, 16GB DDR4 RAM, SSD 256GB로 구성된 노트북 사양",
    21: "왼쪽으로 굽은 파란색 화살표 모양의 실행 취소 아이콘",
    23: "노트북·프린터·스캐너 판매량과 평균을 보여 주는 표 및 수식 셀 E4, 찾는 값 40, 값을 바꿀 셀 B4가 입력된 목표값 찾기 화면",
    25: "근무기간 15년 이상과 나이 50세 이상 조건을 행과 열에 다르게 배치한 선택지 네 개",
    26: "그룹화할 항목은 지점, 사용할 함수는 합계, 부분합 계산 항목은 재고로 설정된 부분합 대화상자",
    27: "입력 데이터와 표시 형식, 표시 결과를 비교하는 선택지 네 개",
    28: "함수 합계와 사용할 레이블, 원본 데이터 연결 항목이 표시된 통합 대화상자",
    29: "A1부터 D1까지 가, 갑, 월, 자가 입력되고 해당 범위가 선택된 워크시트",
    32: "A4 셀의 이름 이길순 옆에 장학생 메모가 표시된 성적 관리 워크시트",
    33: "행에는 이율 1.5%, 2.3%, 3.0%, 5.0%, 열에는 원금이 배치된 수익금액 계산표",
    35: "환자번호의 네 번째 문자 M과 F를 성별 남과 여로 변환하는 데이터표와 코드표",
    36: "나무번호, 종류, 높이, 나이, 수확량, 수입과 사과나무 평균 수확량 셀이 포함된 표",
    38: "보안 경고와 콘텐츠 사용 버튼이 표시된 엑셀 화면",
    39: "학생별 학점과 학점별 인원수를 클럽 기호로 표시한 엑셀 성적 분포표",
    40: "반별 남녀 인원과 합계를 나타낸 표 및 남녀 묶은 세로 막대형 차트",
}

# These two questions use images as the four answer choices. The first visual
# block of question 27 is a shared header, followed by four choice rows.
GRAPHIC_CHOICE_START = {25: 0, 27: 1}


@dataclass(frozen=True)
class Piece:
    page_index: int
    column: int
    bbox: tuple[float, float, float, float]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--review-dir", type=Path, required=True)
    parser.add_argument("--asset-dir", type=Path)
    parser.add_argument("--asset-manifest", type=Path)
    parser.add_argument("--asset-registry", type=Path)
    parser.add_argument("--cert-id", default="computer-literacy")
    args = parser.parse_args()
    if bool(args.asset_dir) != bool(args.asset_manifest):
        parser.error("--asset-dir and --asset-manifest must be provided together")
    if args.asset_registry and not args.asset_dir:
        parser.error("--asset-registry requires --asset-dir and --asset-manifest")
    return args


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def exam_date(path: Path) -> datetime:
    match = re.search(r"(20\d{6})", path.name)
    if not match:
        raise ValueError(f"exam date not found in file name: {path.name}")
    return datetime.strptime(match.group(1), "%Y%m%d")


def anchors(page: pdfplumber.page.Page, column: int) -> list[tuple[int, float]]:
    midpoint = page.width / 2
    found: list[tuple[int, float]] = []
    for word in page.extract_words(use_text_flow=False, keep_blank_chars=False):
        match = QUESTION_ANCHOR_RE.match(word["text"])
        if not match:
            continue
        x0 = float(word["x0"])
        expected_column = 0 if x0 < midpoint else 1
        if expected_column != column:
            continue
        if column == 0 and x0 > 45:
            continue
        if column == 1 and not midpoint < x0 < midpoint + 45:
            continue
        found.append((int(match.group(1)), float(word["top"])))
    return sorted(set(found), key=lambda item: item[1])


def segment_pieces(pdf: pdfplumber.PDF) -> tuple[dict[int, Piece], dict[tuple[int, int], Piece]]:
    question_pieces: dict[int, Piece] = {}
    preambles: dict[tuple[int, int], Piece] = {}
    for page_index, page in enumerate(pdf.pages):
        midpoint = page.width / 2
        for column in (0, 1):
            column_anchors = anchors(page, column)
            left = 20.0 if column == 0 else midpoint + 2.0
            right = midpoint - 2.0 if column == 0 else page.width - 20.0
            first_top = column_anchors[0][1] - 4.0 if column_anchors else page.height - 30.0
            preambles[(page_index, column)] = Piece(
                page_index,
                column,
                (left, 45.0, right, max(45.0, first_top)),
            )
            for index, (number, top) in enumerate(column_anchors):
                if number in question_pieces:
                    raise ValueError(f"duplicate question anchor: {number}")
                bottom = (
                    column_anchors[index + 1][1] - 4.0
                    if index + 1 < len(column_anchors)
                    else page.height - 30.0
                )
                question_pieces[number] = Piece(
                    page_index,
                    column,
                    (left, max(45.0, top - 4.0), right, bottom),
                )
    return question_pieces, preambles


def next_segment(piece: Piece, page_count: int) -> tuple[int, int] | None:
    if piece.column == 0:
        return piece.page_index, 1
    if piece.page_index + 1 < page_count:
        return piece.page_index + 1, 0
    return None


def crop_text(pdf: pdfplumber.PDF, piece: Piece) -> str:
    return pdf.pages[piece.page_index].crop(piece.bbox).extract_text(
        x_tolerance=2,
        y_tolerance=2,
    ) or ""


def cleaned(text: str) -> str:
    kept: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("컴퓨터활용능력 2급"):
            continue
        if line.startswith("최강 자격증 기출문제"):
            continue
        if re.match(r"^\d과목\s*:", line):
            continue
        if line.startswith("전자문제집 CBT 홈페이지"):
            break
        kept.append(line)
    return re.sub(r"\s+", " ", " ".join(kept)).strip()


def choice_numbers(text: str) -> set[int]:
    return {CHOICE_NUMBER[marker] for marker in CHOICE_MARKER_RE.findall(text)}


def split_question(text: str, number: int) -> tuple[str, list[str], int]:
    normalized = cleaned(text)
    normalized = re.sub(rf"^{number}\.\s*", "", normalized)
    matches = list(CHOICE_MARKER_RE.finditer(normalized))
    answer_markers = [FILLED_MARKERS[match.group()] for match in matches if match.group() in FILLED_MARKERS]
    if len(answer_markers) != 1:
        raise ValueError(f"question {number}: expected one filled answer marker, got {answer_markers}")

    body = normalized[: matches[0].start()].strip() if matches else normalized
    choices: dict[int, str] = {}
    for index, match in enumerate(matches):
        choice_number = CHOICE_NUMBER[match.group()]
        if choice_number in choices:
            continue
        end = matches[index + 1].start() if index + 1 < len(matches) else len(normalized)
        choices[choice_number] = normalized[match.end() : end].strip()
    ordered = [choices.get(value, "") for value in range(1, 5)]
    return body, ordered, answer_markers[0]


def intersects_image(page: pdfplumber.page.Page, bbox: tuple[float, float, float, float]) -> bool:
    left, top, right, bottom = bbox
    for image in page.images:
        if (
            float(image["x1"]) > left
            and float(image["x0"]) < right
            and float(image["bottom"]) > top
            and float(image["top"]) < bottom
        ):
            return True
    return False


def visual_images(
    pdf: pdfplumber.PDF,
    pieces: list[Piece],
) -> list[tuple[int, tuple[float, float, float, float]]]:
    found: list[tuple[int, tuple[float, float, float, float]]] = []
    for piece in pieces:
        left, top, right, bottom = piece.bbox
        page = pdf.pages[piece.page_index]
        page_images = sorted(
            page.images,
            key=lambda image: (float(image["top"]), float(image["x0"])),
        )
        for image in page_images:
            image_bbox = (
                float(image["x0"]),
                float(image["top"]),
                float(image["x1"]),
                float(image["bottom"]),
            )
            if (
                image_bbox[2] > left
                and image_bbox[0] < right
                and image_bbox[3] > top
                and image_bbox[1] < bottom
            ):
                found.append((piece.page_index, image_bbox))
    return found


def visual_asset(
    pdf: pdfplumber.PDF,
    images: list[tuple[int, tuple[float, float, float, float]]],
    question_number: int,
    resolution: int = 300,
) -> Image.Image:
    rendered = [
        pdf.pages[page_index]
        .crop(bbox)
        .to_image(resolution=resolution, antialias=True)
        .original.convert("RGB")
        for page_index, bbox in images
    ]
    if len(rendered) == 1:
        return rendered[0]

    choice_start = GRAPHIC_CHOICE_START.get(question_number)
    gap = 20
    if choice_start is None:
        width = max(image.width for image in rendered)
        height = sum(image.height for image in rendered) + gap * (len(rendered) - 1)
        canvas = Image.new("RGB", (width, height), "white")
        y = 0
        for image in rendered:
            canvas.paste(image, (0, y))
            y += image.height + gap
        return canvas

    label_width = 64
    width = label_width + max(image.width for image in rendered)
    height = sum(image.height for image in rendered) + gap * (len(rendered) - 1)
    canvas = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(canvas)
    font_path = Path("C:/Windows/Fonts/malgun.ttf")
    label_font = ImageFont.truetype(str(font_path), 34) if font_path.exists() else ImageFont.load_default()
    y = 0
    choice_number = 1
    for index, image in enumerate(rendered):
        canvas.paste(image, (label_width, y))
        if index >= choice_start:
            label = "①②③④"[choice_number - 1]
            label_bbox = draw.textbbox((0, 0), label, font=label_font)
            label_height = label_bbox[3] - label_bbox[1]
            draw.text(
                (10, y + (image.height - label_height) // 2 - label_bbox[1]),
                label,
                fill="black",
                font=label_font,
            )
            choice_number += 1
        y += image.height + gap
    if choice_number != 5:
        raise ValueError(
            f"question {question_number}: expected four graphic choices, got {choice_number - 1}"
        )
    return canvas


def stacked_crop(pdf: pdfplumber.PDF, pieces: list[Piece], resolution: int = 180) -> Image.Image:
    images = [
        pdf.pages[piece.page_index]
        .crop(piece.bbox)
        .to_image(resolution=resolution, antialias=True)
        .original.convert("RGB")
        for piece in pieces
        if piece.bbox[3] > piece.bbox[1]
    ]
    canvas = Image.new("RGB", (max(image.width for image in images), sum(image.height for image in images)), "white")
    y = 0
    for image in images:
        canvas.paste(image, (0, y))
        y += image.height
    return canvas


def contact_sheets(
    image_dir: Path,
    sheets_dir: Path,
    question_ids: list[str],
    per_sheet: int = 4,
) -> None:
    sheets_dir.mkdir(parents=True, exist_ok=True)
    font_path = Path("C:/Windows/Fonts/malgun.ttf")
    label_font = ImageFont.truetype(str(font_path), 24) if font_path.exists() else ImageFont.load_default()
    column_width = 720
    padding = 16
    label_height = 42
    for start in range(0, len(question_ids), per_sheet):
        batch = question_ids[start : start + per_sheet]
        prepared: list[tuple[str, Image.Image]] = []
        for question_id in batch:
            image = Image.open(image_dir / f"{question_id}.png").convert("RGB")
            if image.width > column_width - padding * 2:
                ratio = (column_width - padding * 2) / image.width
                image = image.resize((int(image.width * ratio), int(image.height * ratio)))
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
        canvas.save(sheets_dir / f"visual-review-{start // per_sheet + 1:02d}.jpg", quality=92)


def write_asset_manifest(
    manifest_path: Path,
    rows: list[dict[str, object]],
) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "question_id",
        "source_pdf",
        "source_pdf_sha256",
        "source_page",
        "missing_element",
        "asset_path",
        "width_px",
        "height_px",
        "sha256",
        "source_image_count",
        "teacher_answer_mark_included",
        "review_status",
        "chapter_relation_count",
        "production_rendered",
        "alt_text",
    ]
    with manifest_path.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_asset_registry(
    registry_path: Path,
    rows: list[dict[str, object]],
) -> None:
    registry_path.parent.mkdir(parents=True, exist_ok=True)
    registry = [
        {
            "id": row["question_id"],
            "asset_path": row["asset_path"],
            "width": row["width_px"],
            "height": row["height_px"],
            "alt": row["alt_text"],
        }
        for row in rows
    ]
    registry_path.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    args = parse_args()
    date = exam_date(args.pdf)
    label = f"{date.year}년 {date.month}월 시행"
    args.review_dir.mkdir(parents=True, exist_ok=True)
    if args.asset_dir:
        args.asset_dir.mkdir(parents=True, exist_ok=True)

    with pdfplumber.open(args.pdf) as pdf:
        question_pieces, preambles = segment_pieces(pdf)
        expected = set(range(1, 41))
        if set(question_pieces) != expected:
            raise ValueError(
                f"expected question anchors 1..40, missing={sorted(expected - set(question_pieces))}, "
                f"extra={sorted(set(question_pieces) - expected)}"
            )

        questions: list[dict[str, object]] = []
        visual_ids: list[str] = []
        asset_rows: list[dict[str, object]] = []
        source_hash = sha256(args.pdf)
        for number in range(1, 41):
            first = question_pieces[number]
            pieces = [first]
            text = crop_text(pdf, first)
            if choice_numbers(text) != {1, 2, 3, 4}:
                continuation_key = next_segment(first, len(pdf.pages))
                if continuation_key is None:
                    raise ValueError(f"question {number}: incomplete choices without continuation")
                continuation = preambles[continuation_key]
                pieces.append(continuation)
                text = f"{text}\n{crop_text(pdf, continuation)}"

            body, choices, answer = split_question(text, number)
            has_visual = any(
                intersects_image(pdf.pages[piece.page_index], piece.bbox)
                for piece in pieces
            )
            question_id = f"{date:%Y%m%d}_{number:03d}"
            if has_visual:
                visual_ids.append(question_id)
                stacked_crop(pdf, pieces).save(args.review_dir / f"{question_id}.png")
                if args.asset_dir:
                    image_blocks = visual_images(pdf, pieces)
                    if not image_blocks:
                        raise ValueError(f"question {number}: visual flag without image blocks")
                    asset_path = args.asset_dir / f"{question_id}.png"
                    asset = visual_asset(pdf, image_blocks, number)
                    asset.save(asset_path, optimize=True)
                    pages = sorted({page_index + 1 for page_index, _ in image_blocks})
                    asset_rows.append(
                        {
                            "question_id": question_id,
                            "source_pdf": args.pdf.name,
                            "source_pdf_sha256": source_hash,
                            "source_page": "+".join(str(page) for page in pages),
                            "missing_element": VISUAL_DESCRIPTIONS[number],
                            "asset_path": asset_path.as_posix(),
                            "width_px": asset.width,
                            "height_px": asset.height,
                            "sha256": sha256(asset_path),
                            "source_image_count": len(image_blocks),
                            "teacher_answer_mark_included": "false",
                            "review_status": "jpg 확필",
                            "chapter_relation_count": 0,
                            "production_rendered": "false",
                            "alt_text": VISUAL_ALT_TEXT[number],
                        }
                    )

            questions.append(
                {
                    "id": question_id,
                    "cert_id": args.cert_id,
                    "exam": "written",
                    "subject_id": 1 if number <= 20 else 2,
                    "date": f"{date:%Y-%m-%d}",
                    "label": label,
                    "number": number,
                    "body": body,
                    "choices": [choice or f"이미지 선택지 {index}" for index, choice in enumerate(choices, 1)],
                    "answer": answer,
                    "review": "jpg 확필" if has_visual else "",
                }
            )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    contact_sheets(args.review_dir, args.review_dir / "sheets", visual_ids)
    if args.asset_dir and args.asset_manifest:
        if len(asset_rows) != len(visual_ids):
            raise ValueError(
                f"asset rows do not match visual questions: {len(asset_rows)} != {len(visual_ids)}"
            )
        write_asset_manifest(args.asset_manifest, asset_rows)
        if args.asset_registry:
            write_asset_registry(args.asset_registry, asset_rows)
        contact_sheets(
            args.asset_dir,
            args.review_dir / "asset-sheets",
            visual_ids,
        )
    print(
        json.dumps(
            {
                "source": str(args.pdf),
                "source_sha256": source_hash,
                "questions": len(questions),
                "visual_review": len(visual_ids),
                "visual_ids": visual_ids,
                "assets": len(asset_rows),
                "asset_dir": str(args.asset_dir) if args.asset_dir else None,
                "asset_manifest": str(args.asset_manifest) if args.asset_manifest else None,
                "asset_registry": str(args.asset_registry) if args.asset_registry else None,
                "output": str(args.output),
                "review_dir": str(args.review_dir),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

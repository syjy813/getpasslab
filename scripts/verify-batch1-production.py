#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import os
import re
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode

REPO = os.environ["GITHUB_REPOSITORY"]
MERGE_SHA = os.environ.get("MERGE_SHA", "7898e84ed78d318fec1886daaad00bb0ef67815f")
TOKEN = os.environ["GH_TOKEN"]
SITE_ORIGIN = os.environ.get("SITE_ORIGIN", "https://getpasslab.co.kr").rstrip("/")
OUTPUT = Path(os.environ.get("VERIFY_OUTPUT", "batch1-production-verification.json"))


class VisibleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hidden_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:  # type: ignore[no-untyped-def]
        if tag.lower() in {"script", "style", "noscript", "template"}:
            self.hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style", "noscript", "template"} and self.hidden_depth:
            self.hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self.hidden_depth:
            self.parts.append(data)

    def text(self) -> str:
        return re.sub(r"\s+", " ", html.unescape(" ".join(self.parts))).strip()


def request_json(url: str) -> dict:
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "getpasslab-production-verifier",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def wait_for_pages_run() -> dict:
    url = (
        f"https://api.github.com/repos/{REPO}/actions/workflows/deploy.yml/runs"
        "?branch=main&per_page=30"
    )
    selected = None
    for attempt in range(40):
        payload = request_json(url)
        selected = next(
            (run for run in payload.get("workflow_runs", []) if run.get("head_sha") == MERGE_SHA),
            None,
        )
        if selected and selected.get("status") == "completed":
            break
        print(
            "[pages-wait] "
            f"attempt={attempt + 1} run={selected and selected.get('id')} "
            f"status={selected and selected.get('status')}"
        )
        time.sleep(15)

    if not selected:
        raise RuntimeError(f"No Pages workflow run found for {MERGE_SHA}")
    if selected.get("status") != "completed" or selected.get("conclusion") != "success":
        raise RuntimeError(
            "Pages workflow failed or incomplete: "
            f"id={selected.get('id')} status={selected.get('status')} "
            f"conclusion={selected.get('conclusion')}"
        )

    return {
        "id": selected["id"],
        "html_url": selected["html_url"],
        "status": selected["status"],
        "conclusion": selected["conclusion"],
        "head_sha": selected["head_sha"],
        "created_at": selected["created_at"],
        "run_started_at": selected.get("run_started_at"),
        "updated_at": selected["updated_at"],
    }


def fetch_page(path: str) -> dict[str, object]:
    query = urlencode({"verify": MERGE_SHA[:12], "ts": int(time.time())})
    url = f"{SITE_ORIGIN}{path}?{query}"
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "GetPassLab production verifier",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read().decode("utf-8", errors="replace")
        status = response.status
        final_url = response.geturl()
    parser = VisibleTextParser()
    parser.feed(raw)
    return {"url": final_url, "status": status, "raw": raw, "text": parser.text()}


def verify_runtime() -> dict:
    paths = {
        "home": "/",
        "reactor": "/industrial-safety/written/chemical/reactor-distillation-equipment/",
        "valve": "/industrial-safety/written/chemical/safety-valve-shutoff-exception/",
        "spontaneous": "/industrial-safety/written/chemical/spontaneous-combustion/",
        "signs": "/industrial-safety/written/safety-management/safety-signs/",
        "organization": "/industrial-safety/written/safety-management/safety-management-organization/",
    }

    last_failures: list[str] = []
    pages: dict[str, dict[str, object]] = {}
    checks: list[tuple[str, bool]] = []
    for attempt in range(12):
        pages = {name: fetch_page(path) for name, path in paths.items()}
        checks = [
            ("all-http-200", all(page["status"] == 200 for page in pages.values())),
            ("home-title", "GetPassLab" in str(pages["home"]["text"])),
            (
                "reactor-frequency",
                "연결 기출 9문항이 전체 14개 회차 중 6개 회차에서 확인"
                in str(pages["reactor"]["text"]),
            ),
            (
                "valve-comment",
                "안전밸브 전후 차단밸브 설치 금지 원칙과 허용 예외"
                in str(pages["valve"]["text"]),
            ),
            (
                "valve-current-source-caution",
                "현행 실무 적용 전에는 최신" in str(pages["valve"]["text"])
                and "산업안전보건기준에 관한 규칙" in str(pages["valve"]["text"]),
            ),
            (
                "spontaneous-three-points",
                all(
                    phrase in str(pages["spontaneous"]["text"])
                    for phrase in (
                        "산화열·분해열·흡착열·중합열",
                        "발열 속도가 방열 속도를 넘고",
                        "증발열처럼 자연발화 원인으로 보기 어려운 항목",
                    )
                ),
            ),
            (
                "spontaneous-old-list-removed",
                "2022년 3월 시험 96번" not in str(pages["spontaneous"]["text"]),
            ),
            (
                "wrong-relation-removed",
                "20210814_004" not in str(pages["signs"]["raw"]),
            ),
            (
                "required-relation-present",
                "20210814_004" in str(pages["organization"]["raw"]),
            ),
        ]
        last_failures = [name for name, passed in checks if not passed]
        if not last_failures:
            break
        print(f"[runtime-wait] attempt={attempt + 1} failures={last_failures}")
        time.sleep(10)

    if last_failures:
        raise RuntimeError(f"Runtime verification failed: {last_failures}")

    return {
        "pages": {
            name: {"url": page["url"], "status": page["status"]}
            for name, page in pages.items()
        },
        "checks": [{"name": name, "passed": passed} for name, passed in checks],
    }


def main() -> None:
    pages_run = wait_for_pages_run()
    runtime = verify_runtime()
    result = {
        "merge_sha": MERGE_SHA,
        "site_origin": SITE_ORIGIN,
        "pages_run": pages_run,
        "runtime": runtime,
        "result": "PASS",
    }
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

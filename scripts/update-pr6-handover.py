#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

HANDOVER = Path("AI_HANDOVER.md")
FRAGMENT = Path("docs/audits/pr6-handover-gate.tmp.md")
HEADING = "## 공개 챕터 내부 식별자·운영 문구 정리·production 검증 게이트 완료 (2026-08-01)"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 replacement, found {count}")
    return updated


def main() -> None:
    text = HANDOVER.read_text(encoding="utf-8")
    if HEADING in text:
        raise RuntimeError("PR6 production gate already exists")

    text = replace_once(
        text,
        r"^> \*\*최초 작성일\*\*: 2026-07-14 / \*\*최종 갱신일\*\*: 2026-07-31 / \*\*작성자\*\*: Claude·ChatGPT·Codex / \*\*버전\*\*: v1\.4$",
        "> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-01 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.5",
        "header",
    )
    text = replace_once(
        text,
        r"^- \*\*현재\*\*: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab\.co\.kr` production에 배포했다\. HTTPS·정책·SEO·AdSense·GA4 코드 통합은 완료됐고, 외부 서비스의 승인·색인·실시간 수신 상태는 별도 확인이 남았다\.$",
        "- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합과 공개 콘텐츠 내부 식별자·운영 문구 정리, 재발 방지 CI 가드의 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.",
        "summary current state",
    )
    text = replace_once(
        text,
        r"^- \*\*최신 동적 상태\*\*: 문서 맨 아래의 `SEO description 전수 개선·production 배포 게이트 완료` 절을 우선한다\.$",
        "- **최신 동적 상태**: 문서 맨 아래의 `공개 챕터 내부 식별자·운영 문구 정리·production 검증 게이트 완료` 절을 우선한다.",
        "latest gate pointer",
    )

    fragment = FRAGMENT.read_text(encoding="utf-8").strip()
    text = text.rstrip() + "\n\n" + fragment + "\n"
    HANDOVER.write_text(text, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()

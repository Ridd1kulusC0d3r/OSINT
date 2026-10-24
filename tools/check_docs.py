#!/usr/bin/env python3
"""Check local Markdown links and SVG validity without third-party dependencies."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOC_AREAS = ("docs", "recursos", "labs", "templates")
DOCS = [ROOT / "README.md", ROOT / "CONTRIBUTING.md", ROOT / "ROADMAP.md"]
for area in DOC_AREAS:
    DOCS.extend((ROOT / area).rglob("*.md"))

MARKDOWN_LINK = re.compile(r"!?(?:\\[[^\\]]*\\])\\(([^)]+)\\)")
HTML_ASSET = re.compile(r'(?:src|href)="([^"]+)"')


def check_path(source: Path, target: str) -> str | None:
    target = target.strip().strip("<>").split(" ", 1)[0]
    if not target or target.startswith(("#", "mailto:", "data:")):
        return None
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith("//"):
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    dest = (source.parent / path).resolve()
    if not dest.is_relative_to(ROOT):
        return f"link escapes repository: {target}"
    if not dest.exists():
        return f"missing local path: {target}"
    return None


def main() -> int:
    errors: list[str] = []
    for source in DOCS:
        if not source.is_file():
            errors.append(f"missing documentation file: {source.relative_to(ROOT)}")
            continue
        contents = source.read_text(encoding="utf-8")
        for expr in (MARKDOWN_LINK, HTML_ASSET):
            for match in expr.finditer(contents):
                error = check_path(source, match.group(1))
                if error:
                    errors.append(f"{source.relative_to(ROOT)}: {error}")

    for svg in (ROOT / "assets").glob("*.svg"):
        try:
            ET.parse(svg)
        except ET.ParseError as exc:
            errors.append(f"{svg.relative_to(ROOT)}: invalid SVG/XML: {exc}")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"OK: {len(DOCS)} documentation pages and SVG markup checked")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

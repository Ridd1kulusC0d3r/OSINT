#!/usr/bin/env python3
"""Validate Markdown links, heading anchors, SVG and curated catalog offline.

No third-party dependencies or network requests. Run from any directory:
    python3 tools/check_docs.py
"""
from __future__ import annotations

import csv
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
AREAS = ("docs", "recursos", "labs", "templates")
ROOT_DOCS = ("README.md", "CONTRIBUTING.md", "ROADMAP.md")
MD_LINK = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")
HTML_LINK = re.compile(r"""(?:src|href)=["']([^"']+)["']""")
HEADING = re.compile(r"^\s{0,3}#{1,6}\s+(.+?)\s*$", re.MULTILINE)
HTML_ID = re.compile(r"""\bid=["']([^"']+)["']""")
FENCED = re.compile(r"(?ms)^\s*```[^\n]*\n.*?^\s*```\s*$")
FIELDS = ("id", "nome", "categoria", "url", "origem", "valor",
          "limitacao", "revisado_em", "status")
STATUS = {"referencia_documental", "validado_em_teste", "historico", "em_avaliacao"}


def markdown_docs(root: Path = ROOT) -> list[Path]:
    docs = [root / path for path in ROOT_DOCS]
    for area in AREAS:
        docs.extend(sorted((root / area).rglob("*.md")))
    return docs


def strip_fences(content: str) -> str:
    return FENCED.sub("", content)


def slugify(title: str) -> str:
    """Close approximation of GitHub's heading slugger for local QA."""
    title = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", title)
    title = re.sub(r"<[^>]+>", "", title)
    title = re.sub(r"[`*_~]", "", title.lower().strip())
    title = re.sub(r"[^\w\-\s]", "", title, flags=re.UNICODE)
    return re.sub(r"\s", "-", title)


def heading_anchors(content: str) -> set[str]:
    cleaned = strip_fences(content)
    anchors = set(HTML_ID.findall(cleaned))
    used: Counter[str] = Counter()
    for match in HEADING.finditer(cleaned):
        slug = slugify(match.group(1).rstrip("#").strip())
        if not slug:
            continue
        number = used[slug]
        anchors.add(f"{slug}-{number}" if number else slug)
        used[slug] += 1
    return anchors


def extract_links(content: str) -> list[str]:
    cleaned = strip_fences(content)
    return [m.group(1) for m in MD_LINK.finditer(cleaned)] + [
        m.group(1) for m in HTML_LINK.finditer(cleaned)
    ]


def validate_link(source: Path, link: str, root: Path = ROOT) -> str | None:
    link = link.strip().strip("<>").split(" ", 1)[0]
    if not link or link.startswith(("mailto:", "data:")):
        return None
    if link.startswith("//"):
        return None
    target = urlsplit(link)
    if target.scheme or target.netloc:
        return None
    if target.path.startswith("/"):
        return f"absolute local link is not portable: {link}"

    # Fragment-only links point to the source file.
    dest = (source.parent / unquote(target.path)).resolve() if target.path else source.resolve()
    if not dest.is_relative_to(root.resolve()):
        return f"link escapes repository: {link}"
    if not dest.exists():
        return f"missing path: {link}"
    if target.fragment and dest.is_file() and dest.suffix.lower() == ".md":
        anchors = heading_anchors(dest.read_text(encoding="utf-8"))
        fragment = unquote(target.fragment)
        if fragment not in anchors:
            # GitHub slug rendering of a leading decorative emoji differs by renderer.
            normalized = fragment.lstrip("-")
            if normalized not in {a.lstrip("-") for a in anchors}:
                return f"missing heading #{fragment} in {dest.relative_to(root)}"
    return None


def validate_catalog(csv_path: Path) -> list[str]:
    errors: list[str] = []
    if not csv_path.is_file():
        return [f"missing catalog: {csv_path}"]

    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None or tuple(reader.fieldnames) != FIELDS:
            return ["catalog: invalid column names or order"]
        ids: set[str] = set()
        urls: set[str] = set()
        for number, row in enumerate(reader, start=2):
            label = f"catalog line {number}"
            if None in row:
                errors.append(f"{label}: excess columns")
                continue
            for field in FIELDS:
                if not row.get(field, "").strip():
                    errors.append(f"{label}: missing {field}")
            ident = row["id"].strip()
            url = row["url"].strip()
            if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", ident):
                errors.append(f"{label}: invalid id")
            if ident in ids:
                errors.append(f"{label}: duplicate id")
            ids.add(ident)
            parsed = urlsplit(url)
            if parsed.scheme != "https" or not parsed.hostname:
                errors.append(f"{label}: expected HTTPS URL")
            if url in urls:
                errors.append(f"{label}: duplicate URL")
            urls.add(url)
            if row["status"].strip() not in STATUS:
                errors.append(f"{label}: invalid status")
            try:
                reviewed = date.fromisoformat(row["revisado_em"].strip())
                if reviewed > date.today():
                    errors.append(f"{label}: future review date")
            except ValueError:
                errors.append(f"{label}: invalid review date")
    return errors


def validate_repository(root: Path = ROOT) -> list[str]:
    errors: list[str] = []
    docs = markdown_docs(root)
    for source in docs:
        if not source.is_file():
            errors.append(f"missing document: {source.relative_to(root)}")
            continue
        for link in extract_links(source.read_text(encoding="utf-8")):
            err = validate_link(source, link, root)
            if err:
                errors.append(f"{source.relative_to(root)}: {err}")
    for svg in (root / "assets").glob("*.svg"):
        try:
            ET.parse(svg)
        except ET.ParseError as exc:
            errors.append(f"{svg.relative_to(root)}: invalid SVG: {exc}")
    errors.extend(validate_catalog(root / "recursos" / "catalogo.csv"))
    return errors


def main() -> int:
    errors = validate_repository()
    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(f"FAILED: {len(errors)} documentation errors", file=sys.stderr)
        return 1
    print(f"PASS: {len(markdown_docs())} Markdown pages, SVG and catalog (offline)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

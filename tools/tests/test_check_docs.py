"""Unit tests for offline documentation QA."""
from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.check_docs import (
    extract_links,
    heading_anchors,
    slugify,
    validate_catalog,
    validate_link,
)


class LinkChecks(unittest.TestCase):
    def test_extract_markdown_and_html(self) -> None:
        text = '[Guide](../docs/guide.md#section) <img src="hero.svg">'
        self.assertEqual(extract_links(text), ["../docs/guide.md#section", "hero.svg"])

    def test_ignores_links_in_code_fences(self) -> None:
        text = '```md\n[Fake](absent.md)\n```\n[Real](docs.md)'
        self.assertEqual(extract_links(text), ["docs.md"])

    def test_slug_with_accents(self) -> None:
        self.assertEqual(slugify("Dados públicos brasileiros"), "dados-públicos-brasileiros")

    def test_heading_anchors_and_repetition(self) -> None:
        data = "## Teste\n## Teste\n## Dados públicos\n"
        self.assertEqual(heading_anchors(data),
                         {"teste", "teste-1", "dados-públicos"})

    def test_resolved_and_missing_link(self) -> None:
        with tempfile.TemporaryDirectory() as location:
            root = Path(location)
            docs = root / "docs"
            docs.mkdir()
            source = root / "README.md"
            source.write_text("# Início")
            target = docs / "guide.md"
            target.write_text("## Guia útil")
            self.assertIsNone(validate_link(source, "docs/guide.md#guia-útil", root))
            self.assertIn("missing heading", validate_link(source, "docs/guide.md#nada", root))
            self.assertIn("missing path", validate_link(source, "docs/unknown.md", root))
            self.assertIn("escapes repository", validate_link(source, "../outside.md", root))

    def test_external_link_ignored(self) -> None:
        self.assertIsNone(validate_link(Path("README.md"), "https://example.org", Path.cwd()))


class CatalogChecks(unittest.TestCase):
    def test_duplicate_ids_detected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / "catalog.csv"
            head = "id,nome,categoria,url,origem,valor,limitacao,revisado_em,status\n"
            base = "a,Nome,Metodo,https://example.org/{},Origem,Valor,Limite,2026-01-01,referencia_documental\n"
            file.write_text(head + base.format("one") + base.format("two"), encoding="utf-8")
            self.assertTrue(any("duplicate id" in e for e in validate_catalog(file)))


if __name__ == "__main__":
    unittest.main()

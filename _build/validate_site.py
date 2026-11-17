#!/usr/bin/env python3
"""Static checks for the Cyber Access Protocol site.

Checks: tag balance, duplicate ids, one h1 per page, image alt text, and local
href/src resolution. This is a structural linter, not a browser test.
"""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}
OPTIONAL_END = {"p", "li", "dt", "dd", "tr", "td", "th", "thead", "tbody",
                "tfoot", "option", "colgroup"}


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, int]] = []
        self.errors: list[str] = []
        self.ids: dict[str, int] = {}
        self.h1 = 0
        self.images_missing_alt: list[int] = []
        self.refs: list[tuple[str, int]] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        values = dict(attrs)
        line = self.getpos()[0]
        if "id" in values:
            if values["id"] in self.ids:
                self.errors.append(
                    f"duplicate id '{values['id']}' (lines {self.ids[values['id']]} and {line})")
            else:
                self.ids[values["id"]] = line
        if tag == "h1":
            self.h1 += 1
        if tag == "img" and "alt" not in values:
            self.images_missing_alt.append(line)
        for name in ("href", "src"):
            if name in values and values[name]:
                self.refs.append((values[name], line))
        if tag in VOID:
            return
        self.stack.append((tag, line))

    def handle_startendtag(self, tag: str, attrs) -> None:
        values = dict(attrs)
        line = self.getpos()[0]
        if "id" in values:
            if values["id"] in self.ids:
                self.errors.append(
                    f"duplicate id '{values['id']}' (lines {self.ids[values['id']]} and {line})")
            else:
                self.ids[values["id"]] = line
        if tag == "img" and "alt" not in values:
            self.images_missing_alt.append(line)
        for name in ("href", "src"):
            if name in values and values[name]:
                self.refs.append((values[name], line))

    def handle_endtag(self, tag: str) -> None:
        line = self.getpos()[0]
        if tag in VOID:
            return
        for index in range(len(self.stack) - 1, -1, -1):
            open_tag, open_line = self.stack[index]
            if open_tag == tag:
                if index != len(self.stack) - 1:
                    unclosed = [f"{t}@{l}" for t, l in self.stack[index + 1:]]
                    self.errors.append(
                        f"</{tag}> at line {line} closes over unclosed {unclosed}")
                del self.stack[index:]
                return
        self.errors.append(f"stray </{tag}> at line {line}")


def local_ref_exists(ref: str) -> bool:
    parsed = urlparse(ref)
    if parsed.scheme or parsed.netloc or ref.startswith("#") or ref.startswith("mailto:"):
        return True
    path = unquote(parsed.path)
    if not path:
        return True
    return (ROOT / path).exists()


def main() -> int:
    failures = 0
    pages = sorted(ROOT.glob("*.html"))
    for path in pages:
        parser = Page()
        parser.feed(path.read_text(encoding="utf-8"))
        page_failures: list[str] = []
        if parser.stack:
            page_failures.append(
                "unclosed: " + ", ".join(f"{t}@{l}" for t, l in parser.stack[-8:]))
        page_failures.extend(parser.errors)
        if parser.h1 != 1:
            page_failures.append(f"h1 count is {parser.h1}, expected 1")
        if parser.images_missing_alt:
            page_failures.append(
                f"img without alt at lines {parser.images_missing_alt}")
        for ref, line in parser.refs:
            if not local_ref_exists(ref):
                page_failures.append(f"missing local ref '{ref}' at line {line}")
        if page_failures:
            failures += 1
            print(f"\n{path.name}: FAIL")
            for item in page_failures:
                print(f"  - {item}")
        else:
            print(f"{path.name}: PASS")
    print(f"\n{len(pages)} pages checked, {failures} with issues.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

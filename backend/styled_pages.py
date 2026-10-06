"""Read actual React prerenders without substituting simplified SEO markup."""
from pathlib import Path
from urllib.parse import urlsplit, unquote

MARKER = 'data-prerendered="1"'


def route_of(requested_uri: str) -> str:
    return unquote(urlsplit(requested_uri).path).rstrip("/") or "/"


def read_styled_page(build_dir: Path, requested_uri: str):
    path = route_of(requested_uri)
    if path == "/admin" or path.startswith("/admin/"):
        return None
    if any(part in (".", "..") for part in path.split("/")):
        return None
    base = build_dir.resolve()
    target = (base / path.lstrip("/") / "index.html").resolve()
    if not target.is_relative_to(base) or not target.is_file():
        return None
    html = target.read_text(encoding="utf-8")
    return html if MARKER in html else None


def read_styled_404(build_dir: Path):
    target = build_dir / ".styled-404.html"
    if not target.is_file():
        return None
    html = target.read_text(encoding="utf-8")
    return html if MARKER in html else None

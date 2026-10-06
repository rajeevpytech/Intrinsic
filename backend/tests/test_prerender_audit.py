"""Audit the per-route generated static HTML produced by backend/prerender.py.

Reads files directly from disk — NO JavaScript. Asserts each generated page has
non-empty #root, a title, a route-specific h1, canonical+og:url pointing to apex,
meta description, parseable JSON-LD, and the main JS bundle present.
"""
import glob
import json
import os
import re

import pytest

BUILD_DIR = "/app/frontend/build"
APEX = "https://intrinsicamerica.com"


def _all_pages():
    paths = sorted(glob.glob(os.path.join(BUILD_DIR, "**/index.html"), recursive=True))
    # root index.html too
    root = os.path.join(BUILD_DIR, "index.html")
    if root not in paths:
        paths.insert(0, root)
    return paths


ALL_PAGES = _all_pages()


def _route_for(path):
    rel = os.path.relpath(path, BUILD_DIR)
    if rel == "index.html":
        return "/"
    return "/" + rel[: -len("/index.html")]


@pytest.mark.parametrize("path", ALL_PAGES, ids=_route_for)
def test_page_has_full_initial_html(path):
    html = open(path, encoding="utf-8").read()

    # (a) #root is NOT empty
    assert '<div id="root"></div>' not in html, f"Empty #root in {path}"
    # Make sure #root tag exists and has children
    m = re.search(r'<div id="root">(.*?)</div>\s*(?:<script|</body)', html, re.S)
    assert m and m.group(1).strip(), f"#root has no children in {path}"

    # (b) <title>
    tm = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    assert tm and tm.group(1).strip(), f"Missing <title> in {path}"

    # (c) route-specific <h1>
    hm = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    assert hm and hm.group(1).strip(), f"Missing <h1> in {path}"

    # (d) canonical + og:url (apex) — exactly one canonical
    canonicals = re.findall(
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I
    )
    assert len(canonicals) == 1, f"Expected 1 canonical, got {len(canonicals)} in {path}"
    assert canonicals[0].startswith(APEX), f"Canonical not apex in {path}: {canonicals[0]}"
    og = re.search(
        r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']', html, re.I
    )
    assert og and og.group(1) == canonicals[0], f"og:url != canonical in {path}"

    # (e) meta description
    desc = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I
    )
    assert desc and desc.group(1).strip(), f"Missing meta description in {path}"

    # (f) >=1 parseable application/ld+json
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.S | re.I,
    )
    assert blocks, f"No JSON-LD in {path}"
    for b in blocks:
        json.loads(b.strip())  # must parse

    # (g) main JS bundle still present
    assert re.search(
        r'<script[^>]+src=["\']/static/js/main\.[a-f0-9]+\.js["\']', html
    ), f"main JS bundle missing in {path}"


def test_404_html_present_and_valid():
    p = os.path.join(BUILD_DIR, "404.html")
    assert os.path.exists(p), "404.html missing"
    html = open(p, encoding="utf-8").read()
    assert '<div id="root"></div>' not in html
    assert re.search(r"<title>.*</title>", html, re.S | re.I)
    assert re.search(r"<h1[^>]*>.*?</h1>", html, re.S | re.I)
    # 404 exempt from canonical, but should still have meta description
    assert re.search(
        r'<meta[^>]+name=["\']description["\']', html, re.I
    ), "Missing description in 404.html"
    # JSON-LD parseable (if present)
    for b in re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.S | re.I,
    ):
        json.loads(b.strip())


# ---- uniqueness across key pages ----

KEY_ROUTES = {
    "home": "index.html",
    "cyber": "services/cybersecurity/index.html",
    "healthcare": "industries/healthcare/index.html",
    "contact": "contact/index.html",
}


def _extract(path):
    html = open(os.path.join(BUILD_DIR, path), encoding="utf-8").read()
    title = re.search(r"<title>(.*?)</title>", html, re.S | re.I).group(1).strip()
    desc = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I
    ).group(1).strip()
    canon = re.search(
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I
    ).group(1)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I).group(1).strip()
    # 120-char body excerpt
    body = re.search(r"<body[^>]*>(.*?)</body>", html, re.S | re.I).group(1)
    text = re.sub(r"<[^>]+>", " ", body)
    text = re.sub(r"\s+", " ", text).strip()
    return {"title": title, "desc": desc, "canon": canon, "h1": h1, "excerpt": text[:120]}


def test_key_pages_unique_titles_and_descriptions():
    data = {k: _extract(p) for k, p in KEY_ROUTES.items()}
    titles = [d["title"] for d in data.values()]
    descs = [d["desc"] for d in data.values()]
    assert len(set(titles)) == len(titles), f"Non-unique titles: {titles}"
    assert len(set(descs)) == len(descs), f"Non-unique descriptions: {descs}"
    # Also h1 and canonical should differ
    assert len({d["h1"] for d in data.values()}) == len(data)
    assert len({d["canon"] for d in data.values()}) == len(data)
    # Print the before/after sample
    for k, d in data.items():
        print(f"\n== {k} ==")
        for key, val in d.items():
            print(f"  {key}: {val}")

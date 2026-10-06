"""Regression: prerender.py MUST be idempotent — re-running without a new
`yarn build` must NOT accumulate <link rel=canonical>, <meta name=robots>,
or application/ld+json tags, must NOT empty #root, must NOT corrupt body.

Runs backend/prerender.py three times in a row (no rebuild between), then
asserts counts on every build/**/index.html + 404.html.
"""
import glob
import json
import os
import re
import subprocess
import sys

import pytest

REPO = "/app"
BUILD = os.path.join(REPO, "frontend", "build")


def _run_prerender():
    r = subprocess.run(
        [sys.executable, "backend/prerender.py", "--build-dir", "frontend/build"],
        cwd=REPO, capture_output=True, text=True, timeout=120,
    )
    assert r.returncode == 0, f"prerender failed: {r.stderr}\n{r.stdout}"
    return r.stdout


@pytest.fixture(scope="module", autouse=True)
def _repeat_runs():
    # Three consecutive runs with NO yarn build between them.
    _run_prerender()
    _run_prerender()
    _run_prerender()
    yield


def _all_html():
    paths = sorted(glob.glob(os.path.join(BUILD, "**/index.html"), recursive=True))
    paths.append(os.path.join(BUILD, "404.html"))
    return paths


def _counts(html):
    return {
        "canonical": len(re.findall(r'<link[^>]+rel=["\']canonical["\'][^>]*>', html, re.I)),
        "robots": len(re.findall(r'<meta[^>]+name=["\']robots["\'][^>]*>', html, re.I)),
        "ld": re.findall(
            r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.S | re.I,
        ),
    }


def test_pristine_template_cached():
    assert os.path.exists(os.path.join(BUILD, ".prerender-template.html")), \
        "Pristine template cache missing — prerender should snapshot it"


@pytest.mark.parametrize("path", _all_html(), ids=lambda p: os.path.relpath(p, BUILD))
def test_no_duplicates_after_repeated_runs(path):
    html = open(path, encoding="utf-8").read()
    c = _counts(html)
    # robots: always exactly 1
    assert c["robots"] == 1, f"{path}: {c['robots']} robots metas (expected 1)"
    # canonical: 1 on real pages. 404.html still gets 1 (with empty href) from
    # _meta_head — the key invariant is it does NOT grow across runs.
    assert c["canonical"] == 1, f"{path}: {c['canonical']} canonicals (expected 1)"
    # #root not empty, body not truncated
    assert '<div id="root"></div>' not in html, f"{path}: empty #root (body corrupted)"
    assert html.rstrip().endswith("</html>"), f"{path}: file does not end with </html>"
    assert "</body>" in html, f"{path}: missing </body>"
    # Every JSON-LD block parses — if any got concatenated/corrupted this fails.
    for b in c["ld"]:
        json.loads(b.strip())


def test_ld_count_stable_across_additional_run():
    """One MORE prerender run must not change JSON-LD counts per file."""
    before = {p: len(_counts(open(p, encoding="utf-8").read())["ld"]) for p in _all_html()}
    _run_prerender()
    after = {p: len(_counts(open(p, encoding="utf-8").read())["ld"]) for p in _all_html()}
    diffs = {p: (before[p], after[p]) for p in before if before[p] != after[p]}
    assert not diffs, f"JSON-LD count changed: {diffs}"

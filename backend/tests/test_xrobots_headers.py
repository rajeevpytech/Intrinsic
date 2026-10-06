"""Iteration 4 — X-Robots-Tag HTTP response header assertions.

The preview K8s/CF ingress rewrites Cache-Control and injects a blanket
X-Robots-Tag: noindex, nofollow on ALL preview responses. That is an edge-level
preview safeguard and NOT the application's behaviour. The feature under test is
whether the FastAPI app itself emits the per-result headers. We therefore test
header behaviour against the backend origin directly (localhost:8001), and use
the external REACT_APP_BACKEND_URL for body / 301 / sitemap / robots.txt checks.
"""
import os
import re
import pytest
import requests

EXT_BASE = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
LOCAL_BASE = "http://localhost:8001"
CANONICAL_BASE = "https://intrinsicamerica.com"


def ssr_local(path, headers=None):
    return requests.get(f"{LOCAL_BASE}/api/ssr", params={"path": path},
                        headers=headers or {}, allow_redirects=False, timeout=15)


def ssr_ext(path, headers=None):
    return requests.get(f"{EXT_BASE}/api/ssr", params={"path": path},
                        headers=headers or {}, allow_redirects=False, timeout=30)


def _hdr(resp, name):
    return resp.headers.get(name, "")


# ---------- 1) /admin & /admin/login carry X-Robots-Tag + no-store ----------
@pytest.mark.parametrize("path", ["/admin", "/admin/login"])
def test_admin_x_robots_tag_header(path):
    r = ssr_local(path)
    assert r.status_code == 200, f"{path}: {r.status_code}"
    xrt = _hdr(r, "X-Robots-Tag").lower()
    assert "noindex" in xrt and "nofollow" in xrt, f"{path}: X-Robots-Tag={xrt!r}"
    cc = _hdr(r, "Cache-Control").lower()
    assert "no-store" in cc, f"{path}: Cache-Control={cc!r}"
    # HTML still carries the robots meta AND an empty #root (SPA shell preserved)
    html = r.text
    m = re.search(r'<meta\s+name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
    assert m and "noindex" in m.group(1).lower() and "nofollow" in m.group(1).lower(), \
        f"{path}: robots meta missing/weak"
    root = re.search(r'<div\s+id=["\']root["\'][^>]*>(.*?)</div>', html, re.S | re.I)
    assert root is not None and root.group(1).strip() == "", f"{path}: #root not empty"


# ---------- 2) 404 & 410 carry X-Robots-Tag: noindex, follow + no-store ----------
def test_404_x_robots_tag_header():
    r = ssr_local("/no-such-page")
    assert r.status_code == 404
    xrt = _hdr(r, "X-Robots-Tag").lower()
    assert "noindex" in xrt and "follow" in xrt and "nofollow" not in xrt, f"404 XRT={xrt!r}"
    assert "no-store" in _hdr(r, "Cache-Control").lower()


def test_410_x_robots_tag_header():
    r = ssr_local("/jobs/accounting-specialist")
    assert r.status_code == 410
    xrt = _hdr(r, "X-Robots-Tag").lower()
    assert "noindex" in xrt and "follow" in xrt and "nofollow" not in xrt, f"410 XRT={xrt!r}"
    assert "no-store" in _hdr(r, "Cache-Control").lower()


# ---------- 3) Public pages: NO X-Robots-Tag; public cacheable ----------
@pytest.mark.parametrize("path", ["/about", "/services/cybersecurity"])
def test_public_pages_no_x_robots_tag(path):
    r = ssr_local(path)
    assert r.status_code == 200
    xrt = _hdr(r, "X-Robots-Tag")
    assert xrt == "", f"{path}: unexpected X-Robots-Tag={xrt!r}"
    cc = _hdr(r, "Cache-Control").lower()
    assert "public" in cc and "max-age=60" in cc, f"{path}: Cache-Control={cc!r}"
    # robots meta remains index,follow
    m = re.search(r'<meta\s+name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']', r.text, re.I)
    assert m and "index" in m.group(1).lower() and "noindex" not in m.group(1).lower(), \
        f"{path}: robots meta={m.group(1) if m else None!r}"
    # single apex self-referencing canonical
    canons = re.findall(r'<link\s+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', r.text, re.I)
    assert len(canons) == 1 and canons[0].rstrip("/") == f"{CANONICAL_BASE}{path}".rstrip("/"), \
        f"{path}: canonicals={canons}"
    # route-specific title/description/h1
    assert re.search(r"<title[^>]*>(.+?)</title>", r.text, re.S | re.I), f"{path}: empty title"
    assert re.search(r'<meta\s+name=["\']description["\']', r.text, re.I), f"{path}: no desc"
    assert re.search(r"<h1[^>]*>(.+?)</h1>", r.text, re.S | re.I), f"{path}: no h1"


# ---------- 4) 301 target resolves to 200 (no redirect loop) ----------
@pytest.mark.parametrize("src,dst", [
    ("/about-us", "/about"),
    ("/help-desk-support", "/services/managed-it"),
    ("/healthcare", "/industries/healthcare"),
    ("/terms-conditions", "/terms-of-service"),
    ("/services/managed-support", "/services/managed-it"),
    ("/services/managed-it-services", "/services/managed-it"),
])
def test_301_target_resolves_200(src, dst):
    r = ssr_local(src)
    assert r.status_code == 301
    loc = r.headers.get("location", "")
    assert loc.rstrip("/") == f"{CANONICAL_BASE}{dst}".rstrip("/"), f"{src}: loc={loc!r}"
    r2 = ssr_local(dst)
    assert r2.status_code == 200, f"301 target {dst} -> {r2.status_code}"
    # the hop target is a public page, must not have an app-emitted X-Robots-Tag
    assert _hdr(r2, "X-Robots-Tag") == "", f"{dst}: unexpected XRT"


# ---------- 5) Non-trailing-slash forms of legacy redirects ----------
@pytest.mark.parametrize("src,dst", [
    ("/about-us/", "/about"),
    ("/help-desk-support/", "/services/managed-it"),
    ("/healthcare/", "/industries/healthcare"),
    ("/terms-conditions/", "/terms-of-service"),
])
def test_legacy_trailing_slash_variants(src, dst):
    r = ssr_local(src)
    assert r.status_code == 301, f"{src}: {r.status_code}"
    assert r.headers.get("location", "").rstrip("/") == f"{CANONICAL_BASE}{dst}".rstrip("/")


# ---------- 6) www -> apex (direct, since ingress strips X-Forwarded-Host) ----------
def test_www_to_apex_redirect():
    r = requests.get(f"{LOCAL_BASE}/api/ssr", params={"path": "/about"},
                     headers={"X-Forwarded-Host": "www.intrinsicamerica.com"},
                     allow_redirects=False, timeout=10)
    assert r.status_code == 301
    assert r.headers.get("location", "").rstrip("/") == f"{CANONICAL_BASE}/about"


# ---------- 7) robots.txt and sitemap.xml (external URL is fine for bodies) ----------
def test_robots_txt_external():
    r = requests.get(f"{EXT_BASE}/api/robots.txt", timeout=20)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/plain")
    assert re.search(r"^\s*Disallow:\s*/admin\s*$", r.text, re.M), r.text
    assert re.search(r"^\s*Sitemap:\s*.*?/api/sitemap\.xml\s*$", r.text, re.M), r.text


def test_sitemap_excludes_private_and_legacy():
    import xml.etree.ElementTree as ET
    from urllib.parse import urlparse
    r = requests.get(f"{EXT_BASE}/api/sitemap.xml", timeout=20)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith(("application/xml", "text/xml"))
    root = ET.fromstring(r.text)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    paths = [urlparse(el.text.strip()).path for el in root.findall(".//sm:loc", ns)]
    assert paths
    forbidden = ["/admin", "/about-us", "/help-desk-support", "/healthcare",
                 "/terms-conditions", "/jobs/", "/services/managed-support",
                 "/services/managed-it-services"]
    bad = [p for p in paths if any(p == f or p.startswith(f) for f in forbidden)]
    assert not bad, f"sitemap contains forbidden: {bad}"

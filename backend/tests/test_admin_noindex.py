"""New iteration backend test — verifies:
 1) /api/ssr?path=/admin and /admin/<sub> return 200 with noindex SPA shell
 2) robots.txt contains 'Disallow: /admin' and 'Sitemap:' pointing at /api/sitemap.xml
 3) Regression — public routes (/about, /services/cybersecurity) remain index,follow with apex canonical
 4) Regression — legacy 301s, www->apex 301, old-job 410, unknown 404
 5) sitemap has no /admin or legacy/alias/old-job paths
 6) Inquiry POST stores a record and admin can list it (email send is decoupled; no verification)
"""
import os
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
CANONICAL_BASE = "https://intrinsicamerica.com"
ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "Intrinsic#2026Admin"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def ssr(path, extra_headers=None):
    h = {}
    if extra_headers:
        h.update(extra_headers)
    return requests.get(f"{BASE_URL}/api/ssr", params={"path": path},
                        headers=h, allow_redirects=False, timeout=30)


def _meta(html, name):
    for pat in (
        rf'<meta\s+name=["\']{name}["\'][^>]*content=["\']([^"\']*)["\']',
        rf'<meta\s+content=["\']([^"\']*)["\'][^>]*name=["\']{name}["\']',
    ):
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1)
    return ""


def _title(html):
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    return (m.group(1).strip() if m else "")


def _canonicals(html):
    return re.findall(r'<link\s+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', html, re.I)


def _root_inner(html):
    m = re.search(r'<div\s+id=["\']root["\'][^>]*>(.*?)</div>', html, re.S | re.I)
    return (m.group(1).strip() if m else None)


def _h1(html):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    return re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else ""


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def auth_client(client):
    r = client.post(f"{BASE_URL}/api/auth/login",
                    json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    tok = r.json().get("access_token") or r.json().get("token")
    assert tok
    s = requests.Session()
    s.headers.update({"Authorization": f"Bearer {tok}"})
    return s


# ---------- 1) /admin SPA shell with noindex ----------
@pytest.mark.parametrize("path", ["/admin", "/admin/login", "/admin/dashboard", "/admin/inquiries"])
def test_admin_route_returns_200_noindex_empty_root(path):
    r = ssr(path)
    assert r.status_code == 200, f"{path}: expected 200, got {r.status_code}"
    html = r.text
    robots = _meta(html, "robots")
    assert "noindex" in robots.lower() and "nofollow" in robots.lower(), \
        f"{path}: robots meta is {robots!r}"
    # root div must be present and empty (SPA shell preserved)
    inner = _root_inner(html)
    assert inner is not None, f"{path}: #root div missing"
    assert inner == "", f"{path}: #root should be empty for SPA shell, got {inner[:120]!r}"


def test_admin_route_has_no_public_body_or_apex_canonical():
    """/admin must NOT inject public body content or a canonical to another page."""
    html = ssr("/admin").text
    # No h1 content injected (SPA shell has empty root)
    assert _h1(html) == "", f"/admin should not have server-rendered h1, got {_h1(html)!r}"
    # No <link rel=canonical ... data-ssr=1 ...> flipping canonical to public URL.
    canons = _canonicals(html)
    for c in canons:
        # if any canonical exists, it must not point to a non-admin public page like /about
        assert "/about" not in c and "/services" not in c and "/industries" not in c, \
            f"/admin leaked public canonical: {c}"


# ---------- 2) robots.txt ----------
def test_robots_txt_contains_admin_disallow_and_sitemap(client):
    r = client.get(f"{BASE_URL}/api/robots.txt", timeout=20)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/plain")
    body = r.text
    assert "User-agent: *" in body
    assert re.search(r"^\s*Disallow:\s*/admin\s*$", body, re.M), f"missing Disallow: /admin\n{body}"
    assert re.search(r"^\s*Sitemap:\s*.*?/api/sitemap\.xml\s*$", body, re.M), \
        f"missing Sitemap: line pointing at /api/sitemap.xml\n{body}"


# ---------- 3) Regression: public routes unchanged ----------
@pytest.mark.parametrize("path", ["/about", "/services/cybersecurity"])
def test_public_routes_still_indexable(path):
    r = ssr(path)
    assert r.status_code == 200
    html = r.text
    robots = _meta(html, "robots").lower()
    assert "index" in robots and "noindex" not in robots, f"{path} robots={robots!r}"
    assert "follow" in robots and "nofollow" not in robots, f"{path} robots={robots!r}"
    canons = _canonicals(html)
    assert len(canons) == 1, f"{path}: canonical count={len(canons)}"
    assert canons[0].rstrip("/") == f"{CANONICAL_BASE}{path}".rstrip("/"), \
        f"{path}: canonical={canons[0]}"
    assert _title(html), f"{path}: empty title"
    assert _meta(html, "description"), f"{path}: missing description"
    assert _h1(html), f"{path}: missing h1"


# ---------- 4) Regression: redirects/errors ----------
def test_www_to_apex_redirect_direct():
    r = requests.get("http://localhost:8001/api/ssr", params={"path": "/about"},
                     headers={"X-Forwarded-Host": "www.intrinsicamerica.com"},
                     allow_redirects=False, timeout=10)
    assert r.status_code == 301
    assert r.headers.get("location", "").rstrip("/") == f"{CANONICAL_BASE}/about"


@pytest.mark.parametrize("src,dst", [
    ("/about-us", "/about"),
    ("/help-desk-support", "/services/managed-it"),
    ("/healthcare", "/industries/healthcare"),
    ("/terms-conditions", "/terms-of-service"),
    ("/services/managed-support", "/services/managed-it"),
    ("/services/managed-it-services", "/services/managed-it"),
])
def test_legacy_301(src, dst):
    r = ssr(src)
    assert r.status_code == 301, f"{src}: {r.status_code}"
    assert r.headers.get("location", "").rstrip("/") == f"{CANONICAL_BASE}{dst}".rstrip("/")


def test_old_job_410():
    r = ssr("/jobs/accounting-specialist")
    assert r.status_code == 410


def test_unknown_404():
    r = ssr("/no-such-page")
    assert r.status_code == 404


# ---------- 5) sitemap ----------
def test_sitemap_clean(client):
    r = client.get(f"{BASE_URL}/api/sitemap.xml", timeout=20)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith(("application/xml", "text/xml"))
    root = ET.fromstring(r.text)
    paths = [urlparse(el.text.strip()).path for el in root.findall(".//sm:loc", NS)]
    assert paths, "sitemap empty"
    forbidden = ["/admin", "/about-us", "/help-desk-support", "/healthcare",
                 "/terms-conditions", "/contact-us", "/jobs/",
                 "/services/managed-support", "/services/managed-it-services"]
    bad = [p for p in paths if any(p == f or p.startswith(f) for f in forbidden)]
    assert not bad, f"sitemap contains forbidden paths: {bad}"


# ---------- 6) Inquiry POST persists; admin can read ----------
def test_inquiry_post_persists_and_listable(client, auth_client):
    payload = {
        "name": "TEST_IterationN User",
        "email": "test_itern@example.com",
        "message": "SSR admin noindex iteration test — please ignore.",
        "company": "TEST_Co",
    }
    r = client.post(f"{BASE_URL}/api/inquiries", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    data = r.json()
    assert data.get("id") or data.get("_id") or data.get("success"), f"no id in response: {data}"
    created_id = data.get("id")
    # admin can list
    r2 = auth_client.get(f"{BASE_URL}/api/inquiries", timeout=20)
    assert r2.status_code == 200, r2.text
    items = r2.json()
    assert isinstance(items, list)
    assert any((it.get("email") == payload["email"]) or (it.get("id") == created_id)
               for it in items), f"inquiry not found in listing (id={created_id})"

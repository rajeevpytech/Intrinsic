"""SSR / SEO / GEO audit for Intrinsic Technology.
Tests reproduce the audit described in iteration 2 request:
 - sitemap -> per-URL /api/ssr audit
 - per-page metadata uniqueness
 - structured data (Service, FAQPage, BreadcrumbList, Article, JobPosting)
 - domain consolidation (www->apex 301)
 - legacy redirect map
 - retired jobs 301/410
 - 404 for unknown
 - robots / llms / sitemap sanity
 - admin content-site freshness
 - OG image endpoint
"""
import os
import re
import json
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://quick-deploy-372.preview.emergentagent.com").rstrip("/")
CANONICAL_BASE = "https://intrinsicamerica.com"
ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "Intrinsic#2026Admin"

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_client(client):
    r = client.post(f"{BASE_URL}/api/auth/login",
                    json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    tok = r.json().get("access_token") or r.json().get("token")
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json",
                      "Authorization": f"Bearer {tok}"})
    return s


def ssr(path, extra_headers=None, allow_redirects=False):
    headers = {}
    if extra_headers:
        headers.update(extra_headers)
    return requests.get(f"{BASE_URL}/api/ssr", params={"path": path},
                        headers=headers, allow_redirects=allow_redirects, timeout=30)


def _title(html):
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    return (m.group(1).strip() if m else "")


def _meta(html, name):
    for pat in (
        rf'<meta\s+name=["\']{name}["\'][^>]*content=["\']([^"\']*)["\']',
        rf'<meta\s+content=["\']([^"\']*)["\'][^>]*name=["\']{name}["\']',
    ):
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1)
    return ""


def _og(html, prop):
    m = re.search(rf'<meta\s+property=["\']{prop}["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
    return m.group(1) if m else ""


def _canonicals(html):
    return re.findall(r'<link\s+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', html, re.I)


def _h1(html):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    return re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else ""


def _jsonld_blocks(html):
    blocks = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html, re.S | re.I):
        raw = m.group(1).strip()
        try:
            blocks.append(json.loads(raw))
        except Exception as e:
            blocks.append({"__parse_error__": str(e), "__raw__": raw[:200]})
    return blocks


def _types_in(blocks):
    types = []
    for b in blocks:
        if not isinstance(b, dict):
            continue
        graph = b.get("@graph") if isinstance(b.get("@graph"), list) else [b]
        for item in graph:
            if isinstance(item, dict):
                t = item.get("@type")
                if isinstance(t, list):
                    types.extend(t)
                elif t:
                    types.append(t)
    return types


def _root_nonempty(html):
    m = re.search(r'<div\s+id=["\']root["\'][^>]*>(.*?)</div>', html, re.S | re.I)
    return bool(m and m.group(1).strip())


# ---------- Sitemap-driven audit ----------
@pytest.fixture(scope="module")
def sitemap_paths(client):
    r = client.get(f"{BASE_URL}/api/sitemap.xml")
    assert r.status_code == 200, r.text
    root = ET.fromstring(r.text)
    locs = [el.text.strip() for el in root.findall(".//sm:loc", NS)]
    assert len(locs) >= 10, f"too few locs: {len(locs)}"
    paths = []
    for loc in locs:
        p = urlparse(loc).path or "/"
        paths.append(p)
    return paths


def test_sitemap_valid_and_clean(client, sitemap_paths):
    r = client.get(f"{BASE_URL}/api/sitemap.xml")
    assert r.headers.get("content-type", "").startswith(("application/xml", "text/xml"))
    bad = [p for p in sitemap_paths if any(x in p for x in [
        "/about-us", "/help-desk-support", "/contact-us", "/jobs/",
        "/admin", "/terms-conditions", "/job-openings", "managed-support",
    ])]
    assert not bad, f"sitemap contains legacy/redirect/admin paths: {bad}"


def test_ssr_audit_every_sitemap_path(sitemap_paths):
    """For every sitemap URL assert status 200 + required SEO primitives present."""
    failures = []
    for p in sitemap_paths:
        r = ssr(p)
        if r.status_code != 200:
            failures.append((p, f"status={r.status_code}"))
            continue
        html = r.text
        title = _title(html)
        desc = _meta(html, "description")
        canonicals = _canonicals(html)
        h1 = _h1(html)
        issues = []
        if not title:
            issues.append("empty title")
        if not desc:
            issues.append("missing meta description")
        if len(canonicals) != 1:
            issues.append(f"canonical count={len(canonicals)}")
        elif not canonicals[0].startswith(CANONICAL_BASE):
            issues.append(f"canonical not apex: {canonicals[0]}")
        elif canonicals[0] != f"{CANONICAL_BASE}{p}".rstrip("/") and canonicals[0] != f"{CANONICAL_BASE}{p}":
            # allow trailing slash normalization
            if canonicals[0].rstrip("/") != f"{CANONICAL_BASE}{p}".rstrip("/"):
                issues.append(f"canonical mismatch: {canonicals[0]}")
        for tag in ("og:title", "og:description", "og:url", "og:image"):
            if not _og(html, tag):
                issues.append(f"missing {tag}")
        for tag in ("twitter:card", "twitter:title", "twitter:description", "twitter:image"):
            if not _meta(html, tag):
                issues.append(f"missing {tag}")
        if not h1:
            issues.append("missing h1")
        if not _root_nonempty(html):
            issues.append("empty #root")
        if issues:
            failures.append((p, "; ".join(issues)))
    assert not failures, "SSR audit failures:\n" + "\n".join(f"{p}: {msg}" for p, msg in failures)


def test_per_page_uniqueness():
    paths = ["/", "/about", "/services/cybersecurity", "/services/cloud",
             "/industries/healthcare", "/service-areas/new-york"]
    titles, descs = {}, {}
    for p in paths:
        html = ssr(p).text
        titles[p] = _title(html)
        descs[p] = _meta(html, "description")
    assert len(set(titles.values())) == len(paths), f"duplicate titles: {titles}"
    assert len(set(descs.values())) == len(paths), f"duplicate descriptions: {descs}"


# ---------- Structured data ----------
def test_service_has_service_and_breadcrumb_jsonld():
    for p in ("/services/cybersecurity", "/services/cloud", "/services/managed-it"):
        html = ssr(p).text
        types = _types_in(_jsonld_blocks(html))
        assert "Service" in types, f"{p} missing Service JSON-LD, got {types}"
        assert "BreadcrumbList" in types, f"{p} missing BreadcrumbList, got {types}"


def test_faq_pages_have_visible_faq_and_jsonld():
    for p in ("/services/managed-it", "/services/cybersecurity", "/service-areas/new-york"):
        html = ssr(p).text
        assert re.search(r"frequently asked questions", html, re.I), f"{p} missing visible FAQ heading"
        types = _types_in(_jsonld_blocks(html))
        assert "FAQPage" in types, f"{p} missing FAQPage JSON-LD, got {types}"


def test_case_study_article_jsonld(client):
    cs = client.get(f"{BASE_URL}/api/content/case-studies").json()
    assert cs, "no case studies seeded"
    # Case studies don't have explicit slug field; SSR derives slug from title (see ssr_render._slug)
    title = cs[0].get("title", "")
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    html = ssr(f"/case-studies/{slug}").text
    types = _types_in(_jsonld_blocks(html))
    assert "Article" in types, f"case study /{slug} missing Article JSON-LD, got {types}"


def test_job_detail_jobposting():
    html = ssr("/careers/it-support-level-2").text
    types = _types_in(_jsonld_blocks(html))
    assert "JobPosting" in types, f"missing JobPosting, got {types}"


def test_all_jsonld_parses():
    for p in ("/", "/about", "/services/cybersecurity", "/service-areas/new-york"):
        for b in _jsonld_blocks(ssr(p).text):
            assert "__parse_error__" not in b, f"{p}: invalid JSON-LD: {b}"


# ---------- Domain consolidation ----------
def test_www_to_apex_redirect():
    """The preview K8s ingress strips/replaces X-Forwarded-Host, so the public URL
    always receives the preview host. Validate the backend redirect logic directly
    via localhost (production nginx forwards the real www host)."""
    r = requests.get("http://localhost:8001/api/ssr", params={"path": "/about"},
                     headers={"X-Forwarded-Host": "www.intrinsicamerica.com"},
                     allow_redirects=False, timeout=10)
    assert r.status_code == 301, f"expected 301, got {r.status_code}"
    assert r.headers.get("location", "").rstrip("/") == f"{CANONICAL_BASE}/about"


# ---------- Legacy redirect map ----------
LEGACY = {
    "/about-us": "/about",
    "/help-desk-support": "/services/managed-it",
    "/healthcare": "/industries/healthcare",
    "/terms-conditions": "/terms-of-service",
    "/contact-us": "/contact",
    "/jobs": "/careers",
    "/job-openings": "/careers",
    "/services/managed-support": "/services/managed-it",
    "/services/managed-it-services": "/services/managed-it",
    "/services/ai-automation": "/services/ai",
}


@pytest.mark.parametrize("src,dst", list(LEGACY.items()))
def test_legacy_redirects(src, dst):
    r = ssr(src)
    assert r.status_code == 301, f"{src}: expected 301 got {r.status_code}"
    loc = r.headers.get("location", "")
    assert loc.rstrip("/") == f"{CANONICAL_BASE}{dst}".rstrip("/"), f"{src}->{loc}"


# ---------- Retired jobs ----------
def test_retired_jobs_matching_active_301():
    for slug in ("it-support-level-2", "it-project-manager", "sales-representative"):
        r = ssr(f"/jobs/{slug}")
        assert r.status_code == 301, f"/jobs/{slug}: {r.status_code}"
        assert r.headers.get("location", "").endswith(f"/careers/{slug}")


def test_retired_jobs_no_match_410():
    for slug in ("accounting-specialist", "accounting-and-administrative-assistant"):
        r = ssr(f"/jobs/{slug}")
        assert r.status_code == 410, f"/jobs/{slug}: {r.status_code}"


# ---------- Unknown -> 404 ----------
def test_unknown_path_404():
    r = ssr("/this-does-not-exist-xyz")
    assert r.status_code == 404
    html = r.text
    assert re.search(r'name=["\']robots["\'][^>]*noindex', html, re.I), "404 should be noindex"


# ---------- Crawler files ----------
def test_robots_txt(client):
    r = client.get(f"{BASE_URL}/api/robots.txt")
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/plain")
    assert "Sitemap:" in r.text


def test_llms_txt(client):
    r = client.get(f"{BASE_URL}/api/llms.txt")
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/plain")
    assert len(r.text) > 50


# ---------- Admin content-site freshness ----------
def test_admin_edit_appears_in_ssr(client, auth_client):
    cur = client.get(f"{BASE_URL}/api/content-site").json()
    original = cur.get("hero_h1") or cur.get("hero", {}).get("h1") or ""
    marker = "TEST_HERO_MARKER_SSR_42"
    # Try flat field first
    payload = dict(cur)
    payload["hero_h1"] = marker
    r = auth_client.put(f"{BASE_URL}/api/content-site", json=payload)
    assert r.status_code in (200, 204), r.text
    try:
        html = ssr("/").text
        # look for marker anywhere in HTML body (hero_h1 is injected to intro/h1)
        assert marker in html, "hero_h1 marker not present in SSR home HTML"
    finally:
        payload["hero_h1"] = original
        auth_client.put(f"{BASE_URL}/api/content-site", json=payload)


# ---------- OG image ----------
def test_og_image_png(client):
    r = client.get(f"{BASE_URL}/api/og/page.png", params={"title": "Test"})
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/png")
    assert len(r.content) > 1000

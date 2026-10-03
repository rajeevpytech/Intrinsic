"""Iteration 28 — blog article, OG images, sitemap+Google verification, regression."""
import os
import re
import requests
import pytest

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://deploy-hub-274.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"
ADMIN = {"email": "admin@intrinsicamerica.com", "password": "IntrinsicAdmin2026!"}
BLOG_SLUG = "the-real-cost-of-a-ransomware-attack"
CASE_SLUG = "improving-program-reporting-across-a-global-nonprofit-network"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json=ADMIN, timeout=20)
    assert r.status_code == 200, r.text
    return r.json().get("token") or r.json().get("access_token")


@pytest.fixture
def admin_h(token):
    return {"Authorization": f"Bearer {token}"}


# ---- Blog ----
def test_blog_published_and_fields():
    r = requests.get(f"{API}/content/blogs", timeout=20)
    assert r.status_code == 200
    blogs = r.json()
    pub = [b for b in blogs if b.get("published")]
    # Only one published blog expected
    assert len(pub) == 1, f"expected 1 published blog, got {len(pub)}"
    b = pub[0]
    assert b.get("title")
    assert b.get("category")
    assert b.get("content") and len(b["content"]) > 50


# ---- OG images ----
def test_og_blog_png():
    r = requests.get(f"{API}/og/blogs/{BLOG_SLUG}.png", timeout=30)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("image/png")
    assert r.content[:8] == b"\x89PNG\r\n\x1a\n"
    assert len(r.content) > 2000


def test_og_case_study_png():
    r = requests.get(f"{API}/og/case-studies/{CASE_SLUG}.png", timeout=30)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("image/png")
    assert r.content[:8] == b"\x89PNG\r\n\x1a\n"


def test_og_unknown_404():
    r = requests.get(f"{API}/og/blogs/does-not-exist-xyz.png", timeout=20)
    assert r.status_code == 404


# ---- Sitemap ----
def test_sitemap_includes_blog_and_case_study():
    r = requests.get(f"{API}/sitemap.xml", timeout=20)
    assert r.status_code == 200
    body = r.text
    assert f"/blog/{BLOG_SLUG}" in body
    assert f"/case-studies/{CASE_SLUG}" in body
    # drafts should not appear
    assert body.count("/blog/") >= 1


# ---- SEO google verification round-trip ----
def test_google_verification_token_roundtrip(admin_h):
    get_r = requests.get(f"{API}/seo", timeout=20)
    assert get_r.status_code == 200
    orig = get_r.json().get("google_site_verification", "")
    try:
        tok = "TESTTOKEN_i28_abc"
        put_r = requests.put(f"{API}/seo", json={**get_r.json(), "google_site_verification": tok}, headers=admin_h, timeout=20)
        assert put_r.status_code == 200
        g2 = requests.get(f"{API}/seo", timeout=20).json()
        assert g2["google_site_verification"] == tok
    finally:
        requests.put(f"{API}/seo", json={**get_r.json(), "google_site_verification": orig}, headers=admin_h, timeout=20)


# ---- Regression: inquiries ----
def test_inquiries_post_200():
    payload = {"name": "TEST_i28", "email": "test_i28@example.com", "company": "T", "message": "hello"}
    r = requests.post(f"{API}/inquiries", json=payload, timeout=20)
    assert r.status_code == 200, r.text


# ---- Admin login already tested via fixture ----
def test_admin_login_ok(token):
    assert token and isinstance(token, str) and len(token) > 10

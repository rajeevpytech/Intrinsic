"""Backend tests for SEO/GEO endpoints — Iteration 27"""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback to frontend/.env read
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.strip().split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "IntrinsicAdmin2026!"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed {r.status_code}: {r.text}"
    tok = r.json().get("token") or r.json().get("access_token")
    assert tok, f"no token in {r.json()}"
    return tok


# ---- SEO public GET ----
def test_get_seo_public():
    r = requests.get(f"{API}/seo", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("site_name"), "site_name missing"
    assert "organization" in data and "same_as" in data["organization"]
    assert "geo" in data and "enabled" in data["geo"]


# ---- SEO PUT persists ----
def test_put_seo_persist(admin_token):
    r0 = requests.get(f"{API}/seo", timeout=15)
    cur = r0.json()
    new_desc = "TEST_seo_desc_" + os.urandom(4).hex()
    payload = {**cur, "default_description": new_desc}
    # ensure pages dict for next tests
    pages = dict(cur.get("pages") or {})
    pages["/about"] = {"title": "TEST About Override", "description": "TEST about override description"}
    payload["pages"] = pages

    r = requests.put(f"{API}/seo", json=payload, headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r.status_code == 200, r.text

    r2 = requests.get(f"{API}/seo", timeout=15)
    data = r2.json()
    assert data["default_description"] == new_desc
    assert data["pages"].get("/about", {}).get("title") == "TEST About Override"


# ---- sitemap.xml ----
def test_sitemap_xml():
    r = requests.get(f"{API}/sitemap.xml", timeout=15)
    assert r.status_code == 200
    assert "xml" in r.headers.get("content-type", "").lower()
    body = r.text
    assert "<urlset" in body
    assert "<loc>" in body
    # should include static route(s)
    assert "/about" in body or "/contact" in body


# ---- robots.txt ----
def test_robots_txt():
    r = requests.get(f"{API}/robots.txt", timeout=15)
    assert r.status_code == 200
    assert "Sitemap:" in r.text
    assert "/api/sitemap.xml" in r.text


# ---- llms.txt ----
def test_llms_txt():
    r = requests.get(f"{API}/llms.txt", timeout=15)
    assert r.status_code == 200
    assert r.text.lstrip().startswith("# Intrinsic Technology")


# ---- inquiries regression ----
def test_inquiries_post():
    payload = {
        "name": "TEST SEO Regression",
        "email": "test_seo_reg@example.com",
        "message": "automated test",
        "company": "TestCo",
    }
    r = requests.post(f"{API}/inquiries", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text


# ---- admin login regression ----
def test_admin_login_regression(admin_token):
    assert isinstance(admin_token, str) and len(admin_token) > 10

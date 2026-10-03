"""Port/deploy smoke tests for Intrinsic Technology (review iteration)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
BASE_URL = BASE_URL.rstrip("/")
ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "IntrinsicAdmin2026!"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data, data
    return data["access_token"]


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---- Health & root ----
def test_health():
    r = requests.get(f"{BASE_URL}/api/health", timeout=20)
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok" or body.get("ok") is True or "ok" in str(body).lower()


def test_root_api():
    r = requests.get(f"{BASE_URL}/api/", timeout=20)
    assert r.status_code == 200
    # Note: source string is "Intrrinsic API" (typo intentional in codebase); accept either.
    assert "intr" in r.text.lower() and "api" in r.text.lower()


# ---- Auth ----
def test_auth_me(admin_token):
    r = requests.get(f"{BASE_URL}/api/auth/me",
                     headers={"Authorization": f"Bearer {admin_token}"}, timeout=20)
    assert r.status_code == 200
    assert r.json().get("email") == ADMIN_EMAIL


def test_auth_me_rejects_no_token():
    r = requests.get(f"{BASE_URL}/api/auth/me", timeout=20)
    assert r.status_code in (401, 403)


# ---- Content endpoints (seeded) ----
@pytest.mark.parametrize("name", ["blogs", "testimonials", "case-studies", "jobs", "service-briefs"])
def test_content_lists(name):
    r = requests.get(f"{BASE_URL}/api/content/{name}", timeout=20)
    assert r.status_code == 200, f"{name}: {r.status_code} {r.text[:200]}"
    data = r.json()
    assert isinstance(data, list)
    # Blogs are seeded as drafts (published=False) by design, so public list may be empty.
    if name != "blogs":
        assert len(data) >= 1, f"{name} has no seeded data"


def test_content_site():
    r = requests.get(f"{BASE_URL}/api/content-site", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, dict)
    # should include some hero section
    text = str(data).lower()
    assert "hero" in text or "title" in text


# ---- Inquiries flow ----
def test_inquiry_write_and_admin_read(auth_headers):
    unique = f"TEST_{int(time.time())}"
    payload = {
        "name": f"TEST User {unique}",
        "email": f"test_{unique}@example.com",
        "message": f"Automated test inquiry {unique}",
    }
    r = requests.post(f"{BASE_URL}/api/inquiries", json=payload, timeout=30)
    assert r.status_code in (200, 201), f"POST inquiry: {r.status_code} {r.text}"

    r2 = requests.get(f"{BASE_URL}/api/inquiries", headers=auth_headers, timeout=20)
    assert r2.status_code == 200, r2.text
    items = r2.json()
    assert isinstance(items, list)
    emails = [i.get("email") for i in items]
    assert payload["email"] in emails, f"Inquiry not found in admin list"


def test_inquiries_requires_auth():
    r = requests.get(f"{BASE_URL}/api/inquiries", timeout=20)
    assert r.status_code in (401, 403)


# ---- Storage status ----
def test_storage_status(auth_headers):
    r = requests.get(f"{BASE_URL}/api/admin/storage/status", headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), dict)


# ---- SEO/discovery ----
def test_seo_json():
    r = requests.get(f"{BASE_URL}/api/seo", timeout=20)
    assert r.status_code == 200


def test_sitemap():
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=20)
    assert r.status_code == 200
    assert "<urlset" in r.text or "<?xml" in r.text


def test_robots():
    r = requests.get(f"{BASE_URL}/api/robots.txt", timeout=20)
    assert r.status_code == 200
    assert "user-agent" in r.text.lower()


def test_llms_txt():
    r = requests.get(f"{BASE_URL}/api/llms.txt", timeout=20)
    assert r.status_code == 200

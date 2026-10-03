"""Iteration test: image optimization integrity + email settings + inquiries flow."""
import os
import time
from pathlib import Path

import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "IntrinsicAdmin2026!"


@pytest.fixture(scope="module")
def auth_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


# ---------- Image availability ----------
IMAGES_TO_CHECK = [
    "/images/ai-assessment-hero.png",
]


class TestImages:
    @pytest.mark.parametrize("path", IMAGES_TO_CHECK)
    def test_image_returns_200(self, path):
        r = requests.get(f"{BASE}{path}", timeout=20)
        assert r.status_code == 200, f"{path} -> {r.status_code}"
        assert int(r.headers.get("Content-Length", len(r.content))) > 1000, "image seems empty"
        assert "image" in r.headers.get("Content-Type", "").lower() or r.content[:8] in (
            b"\x89PNG\r\n\x1a\n", b"\xff\xd8\xff\xe0", b"\xff\xd8\xff\xe1"
        )

    def test_many_public_images_resolve(self):
        """Sample ~15 real images from the public images dir and ensure all load."""
        pub = Path("/app/frontend/public/images")
        if not pub.exists():
            pytest.skip("no public images dir")
        exts = {".png", ".jpg", ".jpeg", ".webp"}
        files = [p for p in pub.rglob("*") if p.suffix.lower() in exts][:15]
        missing = []
        for f in files:
            rel = "/images/" + str(f.relative_to(pub)).replace("\\", "/")
            r = requests.get(f"{BASE}{rel}", timeout=20)
            if r.status_code != 200 or len(r.content) < 500:
                missing.append((rel, r.status_code, len(r.content)))
        assert not missing, f"Broken/missing images: {missing}"


# ---------- Email settings ----------
class TestEmailSettings:
    def test_get_requires_auth(self):
        assert requests.get(f"{API}/email-settings").status_code == 401

    def test_get_default(self, auth_headers):
        r = requests.get(f"{API}/email-settings", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert "smtp_password" not in d
        for k in ["enabled", "gmail_address", "from_name", "subject", "body",
                  "has_password", "notify_enabled", "notify_email"]:
            assert k in d, f"missing field {k}"

    def test_save_settings_persists(self, auth_headers):
        payload = {
            "enabled": True,
            "gmail_address": "sender@gmail.com",
            "from_name": "Intrrinsic Test",
            "notify_enabled": True,
            "notify_email": "owner@intrinsicamerica.com",
            "subject": "Hi {{name}}",
            "body": "Hello {{name}}",
            "smtp_password": "fakeAppPassword123",
        }
        r = requests.put(f"{API}/email-settings", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "smtp_password" not in d
        assert d["has_password"] is True
        assert d["gmail_address"] == "sender@gmail.com"
        assert d["notify_email"] == "owner@intrinsicamerica.com"
        assert d["enabled"] is True

        # Re-GET verifies persistence
        g = requests.get(f"{API}/email-settings", headers=auth_headers).json()
        assert g["has_password"] is True
        assert g["from_name"] == "Intrrinsic Test"

    def test_update_without_password_keeps_saved(self, auth_headers):
        r = requests.put(f"{API}/email-settings", json={
            "enabled": True, "gmail_address": "sender2@gmail.com",
            "from_name": "Renamed", "notify_enabled": True,
            "notify_email": "owner@intrinsicamerica.com",
            "subject": "S", "body": "B", "smtp_password": "",
        }, headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["has_password"] is True
        assert d["gmail_address"] == "sender2@gmail.com"

    def test_test_send_returns_clear_error_without_crash(self, auth_headers):
        # Clear gmail -> expect 400 (no 500)
        requests.put(f"{API}/email-settings", json={
            "enabled": False, "gmail_address": "", "from_name": "Intrrinsic",
            "notify_enabled": False, "notify_email": "",
            "subject": "", "body": "", "smtp_password": "",
        }, headers=auth_headers)
        r = requests.post(f"{API}/email-settings/test",
                          json={"to_email": "x@example.com"}, headers=auth_headers)
        assert r.status_code == 400
        detail = (r.json().get("detail") or "").lower()
        assert "gmail" in detail or "password" in detail


# ---------- Inquiries flow ----------
class TestInquiries:
    def test_submit_and_list(self, auth_headers):
        payload = {"name": "TEST_IterUser", "email": "test_iter@example.com",
                   "company": "Acme", "phone": "555", "message": "hello"}
        t0 = time.time()
        r = requests.post(f"{API}/inquiries", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        assert r.json()["success"] is True
        assert "id" in r.json()
        assert time.time() - t0 < 10, "inquiry POST too slow (email blocking?)"

        created_id = r.json()["id"]
        lst = requests.get(f"{API}/inquiries", headers=auth_headers)
        assert lst.status_code == 200
        ids = [x.get("id") for x in lst.json()]
        assert created_id in ids, "created inquiry not found in admin list"

        # Cleanup
        for it in lst.json():
            if it.get("name", "").startswith("TEST_") or it.get("email", "").endswith("@example.com"):
                requests.delete(f"{API}/inquiries/{it['id']}", headers=auth_headers)

    def test_submit_validation(self):
        r = requests.post(f"{API}/inquiries", json={"name": "", "email": ""})
        assert r.status_code == 400

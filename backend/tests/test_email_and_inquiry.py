"""Tests for admin-configurable Gmail confirmation email + non-blocking inquiry POST."""
import os
import time
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="module")
def auth_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.fixture(scope="module", autouse=True)
def reset_email_settings(auth_headers):
    """Snapshot -> yield -> restore to disabled/empty state after tests."""
    yield
    # Best-effort reset: enable=false, empty everything (password isn't updated when empty, so wipe via direct payload)
    requests.put(f"{API}/email-settings", json={
        "enabled": False, "gmail_address": "", "from_name": "Intrrinsic Team",
        "subject": "", "body": "", "smtp_password": "",
    }, headers=auth_headers)


# ---- Email settings ----
class TestEmailSettings:
    def test_get_requires_auth(self):
        r = requests.get(f"{API}/email-settings")
        assert r.status_code == 401

    def test_put_requires_auth(self):
        r = requests.put(f"{API}/email-settings", json={"enabled": False})
        assert r.status_code == 401

    def test_test_requires_auth(self):
        r = requests.post(f"{API}/email-settings/test", json={"to_email": "x@y.com"})
        assert r.status_code == 401

    def test_get_default(self, auth_headers):
        r = requests.get(f"{API}/email-settings", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        # Must NOT expose raw password
        assert "smtp_password" not in d
        for k in ["enabled", "gmail_address", "from_name", "subject", "body", "has_password"]:
            assert k in d

    def test_save_settings_and_password_masking(self, auth_headers):
        payload = {
            "enabled": True,
            "gmail_address": "sender@gmail.com",
            "from_name": "Intrrinsic Test",
            "subject": "Hi {{name}} from {{company}}",
            "body": "Hello {{name}}, thanks!",
            "smtp_password": "fakeAppPassword123",
        }
        r = requests.put(f"{API}/email-settings", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "smtp_password" not in d, "PUT response must not leak password"
        assert d["has_password"] is True
        assert d["gmail_address"] == "sender@gmail.com"
        assert d["enabled"] is True
        assert d["subject"] == "Hi {{name}} from {{company}}"

        # GET again -- password still hidden, has_password still true
        g = requests.get(f"{API}/email-settings", headers=auth_headers).json()
        assert "smtp_password" not in g
        assert g["has_password"] is True
        assert g["from_name"] == "Intrrinsic Test"

    def test_update_without_password_keeps_saved(self, auth_headers):
        # Update other fields, don't send password
        r = requests.put(f"{API}/email-settings", json={
            "enabled": True,
            "gmail_address": "sender2@gmail.com",
            "from_name": "Renamed",
            "subject": "S",
            "body": "B",
            "smtp_password": "",  # empty -> should NOT overwrite
        }, headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["has_password"] is True, "Saved password should be preserved when smtp_password is empty"
        assert d["gmail_address"] == "sender2@gmail.com"
        assert d["from_name"] == "Renamed"

    def test_send_test_no_config_returns_400(self, auth_headers):
        # Clear settings first (password can't be blanked via API by design, but we can disable/clear gmail)
        # To reliably get a "no config" state, save fresh with empty gmail (password unchanged).
        # Use a dedicated approach: try to test with a fresh, unsaved-state simulation isn't possible;
        # instead, verify that when gmail_address is empty the endpoint errors.
        requests.put(f"{API}/email-settings", json={
            "enabled": False, "gmail_address": "", "from_name": "Intrrinsic",
            "subject": "", "body": "", "smtp_password": "",
        }, headers=auth_headers)
        r = requests.post(f"{API}/email-settings/test",
                          json={"to_email": "test@example.com"}, headers=auth_headers)
        assert r.status_code == 400
        assert "app password" in r.json().get("detail", "").lower() or "gmail" in r.json().get("detail", "").lower()


# ---- Inquiry submission must NEVER be blocked by email ----
class TestInquiryNonBlocking:
    def test_public_submit_success_when_email_disabled(self):
        payload = {"name": "TEST_User1", "email": "test1@example.com",
                   "company": "Acme", "phone": "555", "message": "hi"}
        t0 = time.time()
        r = requests.post(f"{API}/inquiries", json=payload, timeout=15)
        dt = time.time() - t0
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["success"] is True and "id" in d
        # Should return fast (email is background)
        assert dt < 10, f"Inquiry POST too slow ({dt:.1f}s) — email may be blocking"

    def test_submit_when_email_enabled_with_bad_creds(self, auth_headers):
        # Enable email with fake creds. Set password so has_password=True.
        requests.put(f"{API}/email-settings", json={
            "enabled": True, "gmail_address": "bogus@gmail.com",
            "from_name": "Intrrinsic", "subject": "Hi {{name}}",
            "body": "Body {{company}}", "smtp_password": "invalid-app-password",
        }, headers=auth_headers)
        t0 = time.time()
        r = requests.post(f"{API}/inquiries", json={
            "name": "TEST_User2", "email": "test2@example.com",
            "company": "TestCo", "phone": "", "message": "second"
        }, timeout=30)
        dt = time.time() - t0
        assert r.status_code == 200, r.text
        assert r.json()["success"] is True
        # Background task shouldn't block: response must come back promptly
        assert dt < 15, f"Inquiry POST too slow ({dt:.1f}s) — background not offloaded"

    def test_validation_missing_fields(self):
        r = requests.post(f"{API}/inquiries", json={"name": "", "email": ""})
        assert r.status_code == 400

    def test_admin_can_list_and_delete_inquiries(self, auth_headers):
        r = requests.get(f"{API}/inquiries", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        # Cleanup TEST_ inquiries
        for it in items:
            if it.get("name", "").startswith("TEST_") or it.get("email", "").endswith("@example.com"):
                requests.delete(f"{API}/inquiries/{it['id']}", headers=auth_headers)

"""New feature tests: owner notification email fields (notify_enabled, notify_email)
plus inquiries CRUD + auth login with correct seeded creds."""
import os
import time
import requests
import pytest
from pathlib import Path

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin@intrinsic.com"
ADMIN_PASSWORD = "Admin@12345"


@pytest.fixture(scope="module")
def auth():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    tok = r.json()["access_token"]
    assert isinstance(tok, str) and len(tok) > 10
    return {"Authorization": f"Bearer {tok}"}


# ---- Auth ----
def test_login_bad_password_401():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
    assert r.status_code == 401


# ---- Email settings notify fields ----
class TestNotifySettings:
    def test_get_default_has_notify_fields(self, auth):
        r = requests.get(f"{API}/email-settings", headers=auth, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "smtp_password" not in d
        for k in ["enabled", "gmail_address", "from_name", "subject", "body",
                  "has_password", "notify_enabled", "notify_email"]:
            assert k in d, f"missing field {k}"

    def test_put_persists_notify_fields(self, auth):
        payload = {
            "enabled": False,
            "gmail_address": "sender@gmail.com",
            "from_name": "Intrrinsic Team",
            "notify_enabled": True,
            "notify_email": "owner@company.com",
            "subject": "S",
            "body": "B",
            "smtp_password": "",
        }
        r = requests.put(f"{API}/email-settings", json=payload, headers=auth, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["notify_enabled"] is True
        assert d["notify_email"] == "owner@company.com"
        assert "smtp_password" not in d

        # persist across GET
        g = requests.get(f"{API}/email-settings", headers=auth, timeout=15).json()
        assert g["notify_enabled"] is True
        assert g["notify_email"] == "owner@company.com"

    def test_test_endpoint_400_without_gmail_creds(self, auth):
        # ensure gmail_address is empty so we hit the 400 branch deterministically
        requests.put(f"{API}/email-settings", json={
            "enabled": False, "gmail_address": "", "from_name": "Intrrinsic",
            "notify_enabled": True, "notify_email": "owner@company.com",
            "subject": "", "body": "", "smtp_password": "",
        }, headers=auth, timeout=15)
        r = requests.post(f"{API}/email-settings/test",
                          json={"to_email": "someone@example.com"}, headers=auth, timeout=15)
        assert r.status_code == 400
        detail = (r.json().get("detail") or "").lower()
        assert "app password" in detail or "gmail" in detail


# ---- Inquiries end-to-end (persistence + admin listing) ----
class TestInquiries:
    def test_post_and_list(self, auth):
        payload = {"name": "TEST_Notify", "email": "notify_test@example.com",
                   "company": "TEST_Co", "phone": "555", "message": "hello"}
        t0 = time.time()
        r = requests.post(f"{API}/inquiries", json=payload, timeout=20)
        dt = time.time() - t0
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["success"] is True and "id" in body
        assert dt < 10, f"POST too slow ({dt:.1f}s), email likely blocking"
        iid = body["id"]

        # Admin sees the inquiry
        items = requests.get(f"{API}/inquiries", headers=auth, timeout=15).json()
        row = next((x for x in items if x["id"] == iid), None)
        assert row is not None
        assert row["name"] == "TEST_Notify"
        assert row["email"] == "notify_test@example.com"
        assert row["type"] == "contact"
        # ObjectId must be filtered out
        assert "_id" not in row

        # cleanup
        d = requests.delete(f"{API}/inquiries/{iid}", headers=auth, timeout=15)
        assert d.status_code == 200

    def test_submit_stays_fast_with_notify_enabled_and_bad_creds(self, auth):
        # Configure notify with garbage creds; POST must still return promptly.
        requests.put(f"{API}/email-settings", json={
            "enabled": True, "gmail_address": "bogus@gmail.com",
            "from_name": "Intrrinsic",
            "notify_enabled": True, "notify_email": "owner@company.com",
            "subject": "Hi {{name}}", "body": "Body",
            "smtp_password": "invalid-app-password",
        }, headers=auth, timeout=15)
        t0 = time.time()
        r = requests.post(f"{API}/inquiries", json={
            "name": "TEST_Notify2", "email": "notify_test2@example.com", "message": "x"
        }, timeout=30)
        dt = time.time() - t0
        assert r.status_code == 200
        assert r.json()["success"] is True
        assert dt < 15, f"POST too slow ({dt:.1f}s) — bg task likely blocking"

    def test_missing_fields_400(self):
        r = requests.post(f"{API}/inquiries", json={"name": "", "email": "a@b.c"}, timeout=15)
        assert r.status_code == 400

    def test_list_requires_auth(self):
        r = requests.get(f"{API}/inquiries", timeout=15)
        assert r.status_code == 401


@pytest.fixture(scope="module", autouse=True)
def _cleanup(auth):
    yield
    try:
        items = requests.get(f"{API}/inquiries", headers=auth, timeout=15).json()
        for it in items:
            if it.get("name", "").startswith("TEST_") or it.get("email", "").endswith("@example.com"):
                requests.delete(f"{API}/inquiries/{it['id']}", headers=auth, timeout=10)
        # reset notify to disabled
        requests.put(f"{API}/email-settings", json={
            "enabled": False, "gmail_address": "", "from_name": "Intrrinsic Team",
            "notify_enabled": False, "notify_email": "",
            "subject": "", "body": "", "smtp_password": "",
        }, headers=auth, timeout=15)
    except Exception:
        pass

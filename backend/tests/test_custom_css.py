"""Backend regression tests for the Custom CSS admin API.

Covers:
- GET /api/custom-css defaults + persistence
- PUT /api/custom-css (auth, size, validation, empty=clear)
- POST /api/custom-css/validate (auth, HTML guard, parser, no persistence)
- No _id leakage, no unrelated site records mutated
"""
import os
import re
from pathlib import Path
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
credentials = Path("/app/memory/test_credentials.md").read_text()
ADMIN_EMAIL = re.search(r"Email:\s*`([^`]+)`", credentials).group(1)
ADMIN_PASSWORD = re.search(r"Password:\s*`([^`]+)`", credentials).group(1)
CSS_ENDPOINT = f"{BASE_URL}/api/custom-css"
VALIDATE_ENDPOINT = f"{BASE_URL}/api/custom-css/validate"


@pytest.fixture(scope="module")
def admin_token():
    resp = requests.post(f"{BASE_URL}/api/auth/login",
                         json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert resp.status_code == 200, f"Admin login failed: {resp.status_code}"
    return resp.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def original_theme(auth_headers):
    """Snapshot theme so we can verify only custom_css was modified."""
    resp = requests.get(f"{BASE_URL}/api/theme", timeout=15)
    return resp.json() if resp.status_code == 200 else None


@pytest.fixture(scope="module")
def original_live_edits():
    """Snapshot resources live edits to prove they are untouched."""
    resp = requests.get(f"{BASE_URL}/api/live-edits", params={"path": "/resources"}, timeout=15)
    return resp.json() if resp.status_code == 200 else []


@pytest.fixture(scope="module", autouse=True)
def restore_original_css(auth_headers):
    """Snapshot and restore whatever the user currently has published."""
    response = requests.get(CSS_ENDPOINT, timeout=15)
    response.raise_for_status()
    original = response.json()
    yield
    restored = requests.put(CSS_ENDPOINT, headers=auth_headers, json={"css": original["css"]}, timeout=15)
    assert restored.status_code == 200, "Original CSS could not be restored"
    assert requests.get(CSS_ENDPOINT, timeout=15).json()["css"] == original["css"]


# ---- GET defaults ----------------------------------------------------------
class TestCustomCssGet:
    def test_get_public_no_auth(self):
        resp = requests.get(CSS_ENDPOINT, timeout=15)
        assert resp.status_code == 200
        data = resp.json()
        assert set(data.keys()) == {"css", "updated_at"}
        assert isinstance(data["css"], str)
        assert "_id" not in data
        assert "id" not in data
        assert "key" not in data


# ---- Auth ------------------------------------------------------------------
class TestCustomCssAuth:
    def test_put_requires_auth(self):
        resp = requests.put(CSS_ENDPOINT, json={"css": "body{color:red;}"}, timeout=15)
        assert resp.status_code == 401

    def test_validate_requires_auth(self):
        resp = requests.post(VALIDATE_ENDPOINT, json={"css": "body{color:red;}"}, timeout=15)
        assert resp.status_code == 401

    def test_put_bad_token(self):
        resp = requests.put(CSS_ENDPOINT,
                            headers={"Authorization": "Bearer garbage"},
                            json={"css": ""}, timeout=15)
        assert resp.status_code == 401


# ---- Validate --------------------------------------------------------------
class TestCustomCssValidate:
    def test_valid_css_accepted(self, auth_headers):
        css = ("/* comment */\n"
               ":root { --brand: #00388e; }\n"
               "@media (min-width: 768px) { body { margin: 0; } }\n"
               "@supports (display: grid) { .grid { display: grid; } }\n"
               "@keyframes pulse { 0% { opacity: 0 } 100% { opacity: 1 } }\n"
               "html[data-le-page='/resources'] [data-testid='resources-hero'] { background-color: #6b7a78 !important; }\n")
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers, json={"css": css}, timeout=15)
        assert resp.status_code == 200, resp.text
        assert resp.json() == {"valid": True}

    def test_style_tag_rejected(self, auth_headers):
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers,
                             json={"css": "<style>body{color:red}</style>"}, timeout=15)
        assert resp.status_code == 422
        assert "css only" in resp.json()["detail"].lower()

    def test_script_tag_rejected(self, auth_headers):
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers,
                             json={"css": "body{} <script>alert(1)</script>"}, timeout=15)
        assert resp.status_code == 422

    def test_top_level_garbage_rejected(self, auth_headers):
        # Bare identifier at top-level (no selector or block) produces a tinycss2 error token
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers,
                             json={"css": "@@@ !!! ###"}, timeout=15)
        assert resp.status_code == 422
        assert "css error" in resp.json()["detail"].lower()

    def test_size_limit_enforced(self, auth_headers):
        big = "a" * 50001
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers, json={"css": big}, timeout=15)
        assert resp.status_code == 422

    def test_missing_css_field(self, auth_headers):
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers, json={}, timeout=15)
        assert resp.status_code == 422

    def test_extra_fields_forbidden(self, auth_headers):
        resp = requests.post(VALIDATE_ENDPOINT, headers=auth_headers,
                             json={"css": "body{}", "extra": "x"}, timeout=15)
        assert resp.status_code == 422

    def test_validate_does_not_persist(self, auth_headers):
        marker = "/* validate-only-marker-should-not-persist */ .zz-testonly-abc { color: red; }"
        before = requests.get(CSS_ENDPOINT, timeout=15).json().get("css") or ""
        r = requests.post(VALIDATE_ENDPOINT, headers=auth_headers, json={"css": marker}, timeout=15)
        assert r.status_code == 200
        after = requests.get(CSS_ENDPOINT, timeout=15).json().get("css") or ""
        assert after == before
        assert "zz-testonly-abc" not in after


# ---- Put/persistence -------------------------------------------------------
class TestCustomCssPersistence:
    def test_publish_then_get(self, auth_headers):
        css = ".zz-test-persist-xyz { color: #123456 !important; }"
        r = requests.put(CSS_ENDPOINT, headers=auth_headers, json={"css": css}, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["css"] == css
        assert body["updated_at"] is not None
        assert "_id" not in body

        g = requests.get(CSS_ENDPOINT, timeout=15).json()
        assert g["css"] == css
        assert g["updated_at"] is not None

    def test_empty_string_clears(self, auth_headers):
        # first publish something
        requests.put(CSS_ENDPOINT, headers=auth_headers,
                     json={"css": ".zz-precleartest{color:red}"}, timeout=15)
        r = requests.put(CSS_ENDPOINT, headers=auth_headers, json={"css": ""}, timeout=15)
        assert r.status_code == 200
        assert r.json()["css"] == ""
        g = requests.get(CSS_ENDPOINT, timeout=15).json()
        assert g["css"] == ""

    def test_put_invalid_rejected_and_not_persisted(self, auth_headers):
        before = requests.get(CSS_ENDPOINT, timeout=15).json().get("css") or ""
        r = requests.put(CSS_ENDPOINT, headers=auth_headers,
                         json={"css": "<style>bad</style>"}, timeout=15)
        assert r.status_code == 422
        after = requests.get(CSS_ENDPOINT, timeout=15).json().get("css") or ""
        assert after == before


# ---- Isolation -------------------------------------------------------------
class TestCustomCssIsolation:
    def test_theme_untouched_after_publish(self, auth_headers, original_theme):
        if original_theme is None:
            pytest.skip("theme snapshot unavailable")
        requests.put(CSS_ENDPOINT, headers=auth_headers,
                     json={"css": ".zz-iso-a{color:blue}"}, timeout=15)
        now = requests.get(f"{BASE_URL}/api/theme", timeout=15).json()
        assert now == original_theme

    def test_live_edits_untouched(self, auth_headers, original_live_edits):
        requests.put(CSS_ENDPOINT, headers=auth_headers,
                     json={"css": ".zz-iso-b{color:green}"}, timeout=15)
        now = requests.get(f"{BASE_URL}/api/live-edits",
                           params={"path": "/resources"}, timeout=15).json()
        assert now == original_live_edits

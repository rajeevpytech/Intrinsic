"""Tests for Live Editor: /api/live-edits and /api/theme endpoints.

Safe test file (fixed by testing agent iteration 13):
- Uses REACT_APP_BACKEND_URL from env (no hardcoded default that could hit stale env)
- Parses admin credentials from /app/memory/test_credentials.md
- Snapshots and restores site theme + live_edits scoped to test paths only
- Removed destructive DELETE path='*' cleanup
- Uses non-existent unique paths so no production live_edits are touched
- Empty PUT /api/theme is a NO-OP (uses exclude_unset), not a reset
"""
import os
import re
import pytest
import requests


def _load_backend_url():
    v = os.environ.get("REACT_APP_BACKEND_URL", "").strip()
    if v:
        return v.rstrip("/")
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    return line.split("=", 1)[1].strip().strip('"').rstrip("/")
    except Exception:
        pass
    return ""


BASE_URL = _load_backend_url()
API = f"{BASE_URL}/api"

_CREDS_FILE = "/app/memory/test_credentials.md"


def _parse_admin_credentials():
    """Parse admin email/password from memory file. Handles backticked and plain values."""
    with open(_CREDS_FILE, "r") as f:
        text = f.read()
    email = re.search(r"Email:\s*`?([^`\n]+)`?", text)
    pwd = re.search(r"Password:\s*`?([^`\n]+)`?", text)
    assert email and pwd, f"Could not parse admin credentials from {_CREDS_FILE}"
    return email.group(1).strip().strip("`"), pwd.group(1).strip().strip("`")


ADMIN_EMAIL, ADMIN_PASSWORD = _parse_admin_credentials()

# Unique test paths — never touch production paths
TEST_PATH_A = "/__live_editor_test_A__"
TEST_PATH_B = "/__live_editor_test_B__"
TEST_SEL = "h1.__live_editor_test_selector__"


@pytest.fixture(scope="module")
def admin_token():
    assert BASE_URL, "REACT_APP_BACKEND_URL is not set"
    r = requests.post(f"{API}/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    body = r.json()
    return body.get("access_token") or body.get("token")


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module", autouse=True)
def _snapshot_and_restore(admin_token):
    """Backup theme + any pre-existing edits on our test paths. Restore after suite."""
    h = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    theme_before = requests.get(f"{API}/theme", timeout=15).json()
    edits_a = requests.get(f"{API}/live-edits", params={"path": TEST_PATH_A}, timeout=15).json()
    edits_b = requests.get(f"{API}/live-edits", params={"path": TEST_PATH_B}, timeout=15).json()

    yield

    # Restore theme by PUTting full snapshot (exclude_unset is honored, but full body is safe)
    try:
        requests.put(f"{API}/theme", json=theme_before, headers=h, timeout=15)
    except Exception:
        pass
    # Clean up only edits on our test paths
    for path in (TEST_PATH_A, TEST_PATH_B):
        try:
            requests.delete(f"{API}/live-edits", params={"path": path}, headers=h, timeout=15)
        except Exception:
            pass
    # Re-seed any pre-existing edits on our test paths (should be none normally)
    for saved_edits in (edits_a, edits_b):
        for e in saved_edits:
            try:
                requests.put(f"{API}/live-edits", json={
                    "path": e["path"], "selector": e["selector"],
                    "label": e.get("label"), "props": e.get("props", {})
                }, headers=h, timeout=15)
            except Exception:
                pass


class TestLiveEditsAuth:
    def test_get_live_edits_public(self):
        r = requests.get(f"{API}/live-edits", params={"path": "/"}, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_put_requires_admin(self):
        r = requests.put(f"{API}/live-edits",
                         json={"path": TEST_PATH_A, "selector": "h1", "props": {"text": "x"}}, timeout=15)
        assert r.status_code in (401, 403)

    def test_delete_requires_admin(self):
        r = requests.delete(f"{API}/live-edits", params={"path": TEST_PATH_A}, timeout=15)
        assert r.status_code in (401, 403)


class TestLiveEditsCRUD:
    def test_create_and_read(self, auth_headers):
        payload = {"path": TEST_PATH_A, "selector": TEST_SEL,
                   "label": "H1", "props": {"text": "TEST HELLO", "color": "#ff0000"}}
        r = requests.put(f"{API}/live-edits", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["path"] == TEST_PATH_A
        assert data["selector"] == TEST_SEL
        assert data["props"]["text"] == "TEST HELLO"
        assert data["props"]["color"] == "#ff0000"

        # GET verify persistence
        r = requests.get(f"{API}/live-edits", params={"path": TEST_PATH_A}, timeout=15)
        assert r.status_code == 200
        items = r.json()
        found = [i for i in items if i["selector"] == TEST_SEL]
        assert len(found) == 1
        assert found[0]["props"]["text"] == "TEST HELLO"

    def test_empty_props_deletes(self, auth_headers):
        # Seed first
        requests.put(f"{API}/live-edits",
                     json={"path": TEST_PATH_A, "selector": TEST_SEL, "props": {"text": "x"}},
                     headers=auth_headers, timeout=15)
        payload = {"path": TEST_PATH_A, "selector": TEST_SEL, "props": {}}
        r = requests.put(f"{API}/live-edits", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json().get("deleted") is True

    def test_selector_required(self, auth_headers):
        r = requests.put(f"{API}/live-edits",
                         json={"path": TEST_PATH_A, "selector": "  ", "props": {"text": "x"}},
                         headers=auth_headers, timeout=15)
        assert r.status_code == 400

    def test_delete_by_path(self, auth_headers):
        # Seed then delete only our test path
        requests.put(f"{API}/live-edits",
                     json={"path": TEST_PATH_A, "selector": TEST_SEL, "props": {"text": "x"}},
                     headers=auth_headers, timeout=15)
        r = requests.delete(f"{API}/live-edits", params={"path": TEST_PATH_A},
                            headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["deleted"] >= 1
        r = requests.get(f"{API}/live-edits", params={"path": TEST_PATH_A}, timeout=15)
        assert [i for i in r.json() if i["selector"] == TEST_SEL] == []


class TestTheme:
    def test_get_theme_public(self):
        r = requests.get(f"{API}/theme", timeout=15)
        assert r.status_code == 200
        data = r.json()
        for k in ("brand", "royal", "accent", "headingFont", "bodyFont", "pageBg"):
            assert k in data

    def test_put_theme_requires_admin(self):
        r = requests.put(f"{API}/theme", json={"brand": "#123456"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_put_partial_and_empty_is_noop(self, auth_headers):
        # Snapshot inside this test to compare
        before = requests.get(f"{API}/theme", timeout=15).json()
        r = requests.put(f"{API}/theme", json={"brand": "#112233", "accent": "#445566"},
                         headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["brand"] == "#112233"
        assert data["accent"] == "#445566"
        # Other fields (e.g. headingFont, typography) preserved
        for k in ("headingFont", "bodyFont", "pageBg"):
            assert data[k] == before.get(k, "")

        # Empty PUT should be a no-op now (exclude_unset)
        r = requests.put(f"{API}/theme", json={}, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["brand"] == "#112233"  # unchanged
        assert d["accent"] == "#445566"

        # Restore original values via full PUT of snapshot
        requests.put(f"{API}/theme", json=before, headers=auth_headers, timeout=15)

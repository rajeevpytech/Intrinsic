"""Backend tests for Editor & Review Modes feature."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fullstack-verify-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": "admin", "password": "admin123"}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---- /api/modes ----
def test_get_modes_public():
    r = requests.get(f"{API}/modes", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "editor_enabled" in d and "review_enabled" in d
    assert isinstance(d["editor_enabled"], bool)
    assert isinstance(d["review_enabled"], bool)


def test_put_modes_unauth():
    r = requests.put(f"{API}/modes", json={"editor_enabled": False}, timeout=15)
    assert r.status_code in (401, 403)


def test_put_modes_toggle_and_restore(auth_headers):
    # off
    r = requests.put(f"{API}/modes", json={"editor_enabled": False, "review_enabled": False}, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["editor_enabled"] is False
    assert d["review_enabled"] is False
    # verify via GET
    g = requests.get(f"{API}/modes", timeout=15).json()
    assert g["editor_enabled"] is False and g["review_enabled"] is False
    # restore ON
    r = requests.put(f"{API}/modes", json={"editor_enabled": True, "review_enabled": True}, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["editor_enabled"] is True and d["review_enabled"] is True


# ---- /api/modes/stats ----
def test_modes_stats_requires_auth():
    r = requests.get(f"{API}/modes/stats", timeout=15)
    assert r.status_code in (401, 403)


def test_modes_stats_ok(auth_headers):
    r = requests.get(f"{API}/modes/stats", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    for k in ("live_edits", "live_blocks", "feedback"):
        assert k in d and isinstance(d[k], int)


# ---- DELETE /api/feedback ----
def test_delete_all_feedback_unauth():
    r = requests.delete(f"{API}/feedback", timeout=15)
    assert r.status_code in (401, 403)


def test_delete_all_feedback_flow(auth_headers):
    # seed
    fb = {"page": "/", "author": "TEST_user", "text": "TEST_comment"}
    c = requests.post(f"{API}/feedback", json=fb, timeout=15)
    assert c.status_code == 200
    stats_before = requests.get(f"{API}/modes/stats", headers=auth_headers, timeout=15).json()
    assert stats_before["feedback"] >= 1
    # delete all
    r = requests.delete(f"{API}/feedback", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "deleted" in d and d["deleted"] >= 1
    stats_after = requests.get(f"{API}/modes/stats", headers=auth_headers, timeout=15).json()
    assert stats_after["feedback"] == 0


# ---- DELETE /api/live-blocks ----
def test_delete_all_live_blocks_unauth():
    r = requests.delete(f"{API}/live-blocks", timeout=15)
    assert r.status_code in (401, 403)


def test_delete_all_live_blocks_ok(auth_headers):
    r = requests.delete(f"{API}/live-blocks", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert "deleted" in r.json()


def test_final_flags_are_on(auth_headers):
    # ensure ON at end
    requests.put(f"{API}/modes", json={"editor_enabled": True, "review_enabled": True}, headers=auth_headers, timeout=15)
    d = requests.get(f"{API}/modes", timeout=15).json()
    assert d["editor_enabled"] is True and d["review_enabled"] is True

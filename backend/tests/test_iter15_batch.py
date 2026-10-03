"""Iter15/16 batch tests: draft blogs workflow + brief-download flow + public brief has_file/no file.

Credentials sourced from /app/memory/test_credentials.md (never hardcoded).
BASE_URL sourced from env REACT_APP_BACKEND_URL — no empty fallback (fail fast).
All test-created data is cleaned up via try/finally + module fixture teardown so a
re-run never leaves stale TEST_ prefixed records around.
"""
import os
import re
import uuid
from pathlib import Path

import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
CREDS_FILE = Path("/app/memory/test_credentials.md")


def _load_admin_creds():
    text = CREDS_FILE.read_text()
    email = re.search(r"Email:\s*`([^`]+)`", text).group(1)
    password = re.search(r"Password:\s*`([^`]+)`", text).group(1)
    return email, password


ADMIN_EMAIL, ADMIN_PASSWORD = _load_admin_creds()

# Unique marker for this test run so parallel/re-runs never collide
RUN_TAG = uuid.uuid4().hex[:8]


def _admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed {r.status_code} {r.text}"
    token = r.json().get("token") or r.json().get("access_token")
    assert token
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = _admin_session()
    yield s
    # Module teardown: sweep any leftover TEST_ artifacts created by this run
    try:
        blogs = s.get(f"{BASE_URL}/api/admin/content/blogs", timeout=15).json()
        for b in blogs:
            title = b.get("title", "") or ""
            if title.startswith(f"TEST_iter16_{RUN_TAG}"):
                s.delete(f"{BASE_URL}/api/content/blogs/{b['id']}", timeout=10)
    except Exception:
        pass
    try:
        inquiries = s.get(f"{BASE_URL}/api/inquiries", timeout=15).json()
        for inq in inquiries:
            em = inq.get("email", "") or ""
            msg = inq.get("message", "") or ""
            if RUN_TAG in em or RUN_TAG in msg:
                s.delete(f"{BASE_URL}/api/inquiries/{inq['id']}", timeout=10)
    except Exception:
        pass


# ---- Draft workflow ----
def test_public_blogs_returns_only_published(admin_client):
    r = requests.get(f"{BASE_URL}/api/content/blogs", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    for b in data:
        assert b.get("published") is True, f"unpublished item leaked: {b.get('title')}"


def test_admin_blogs_shows_all_including_drafts(admin_client):
    r = admin_client.get(f"{BASE_URL}/api/admin/content/blogs", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    drafts = [i for i in items if i.get("draft_state_revision") == "placeholder-draft-v1"]
    assert len(drafts) >= 3, f"expected >=3 placeholder drafts, got {len(drafts)}"
    for d in drafts:
        assert d.get("published") is False


def test_admin_blogs_route_requires_auth():
    r = requests.get(f"{BASE_URL}/api/admin/content/blogs", timeout=15)
    assert r.status_code in (401, 403)


def test_create_blog_defaults_to_draft(admin_client):
    unique_title = f"TEST_iter16_{RUN_TAG}_{uuid.uuid4().hex[:6]}"
    new_id = None
    try:
        body = {"title": unique_title, "excerpt": "test", "category": "TEST"}
        r = admin_client.post(f"{BASE_URL}/api/content/blogs", json=body, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created.get("published") is False
        new_id = created["id"]

        pub = requests.get(f"{BASE_URL}/api/content/blogs", timeout=15).json()
        assert not any(x["id"] == new_id for x in pub)

        r2 = admin_client.put(f"{BASE_URL}/api/content/blogs/{new_id}",
                              json={"published": True}, timeout=15)
        assert r2.status_code == 200
        assert r2.json().get("published") is True

        pub2 = requests.get(f"{BASE_URL}/api/content/blogs", timeout=15).json()
        assert any(x["id"] == new_id for x in pub2), "published article missing from public list"

        r3 = admin_client.put(f"{BASE_URL}/api/content/blogs/{new_id}",
                              json={"published": False}, timeout=15)
        assert r3.status_code == 200
        pub3 = requests.get(f"{BASE_URL}/api/content/blogs", timeout=15).json()
        assert not any(x["id"] == new_id for x in pub3)
    finally:
        if new_id:
            resp = admin_client.delete(f"{BASE_URL}/api/content/blogs/{new_id}", timeout=15)
            assert resp.status_code in (200, 204, 404), f"cleanup delete failed: {resp.status_code}"


# ---- Service briefs ----
def test_public_briefs_strip_file_expose_has_file(admin_client):
    r = requests.get(f"{BASE_URL}/api/content/service-briefs", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    for it in items:
        assert "file" not in it, "public brief must not expose file path"
        assert "has_file" in it


def test_admin_briefs_include_file(admin_client):
    r = admin_client.get(f"{BASE_URL}/api/admin/content/service-briefs", timeout=15)
    assert r.status_code == 200
    items = r.json()
    with_file = [i for i in items if i.get("file")]
    assert len(with_file) >= 1


# ---- Brief-download flow ----
@pytest.fixture(scope="module")
def sample_brief(admin_client):
    r = admin_client.get(f"{BASE_URL}/api/admin/content/service-briefs", timeout=15)
    assert r.status_code == 200
    for it in r.json():
        if it.get("file") and it.get("available") is not False:
            return it
    pytest.skip("no available brief with file")


def test_brief_download_success(admin_client, sample_brief):
    """Success path: also cleans up its own inquiry so re-runs stay clean."""
    email = f"TEST_iter16_{RUN_TAG}_success@example.com"
    inquiry_id = None
    try:
        payload = {"brief_id": sample_brief["id"], "name": "TEST_iter16 User",
                   "email": email, "company": "TEST_iter16 Co",
                   "message": f"please send {RUN_TAG}"}
        r = requests.post(f"{BASE_URL}/api/brief-download", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert data.get("file", "").endswith(".pdf")

        file_path = data["file"].lstrip("/")
        pdf_url = f"{BASE_URL}/{file_path}"
        pr = requests.get(pdf_url, timeout=20)
        assert pr.status_code == 200
        assert pr.content[:4] == b"%PDF"

        # Locate the just-created inquiry for cleanup
        inqs = admin_client.get(f"{BASE_URL}/api/inquiries", timeout=15).json()
        matches = [i for i in inqs if i.get("email") == email]
        assert len(matches) == 1
        inquiry_id = matches[0]["id"]
    finally:
        if inquiry_id:
            resp = admin_client.delete(f"{BASE_URL}/api/inquiries/{inquiry_id}", timeout=15)
            assert resp.status_code in (200, 204, 404), f"cleanup delete failed: {resp.status_code}"


def test_brief_download_invalid_email(sample_brief):
    r = requests.post(f"{BASE_URL}/api/brief-download",
                      json={"brief_id": sample_brief["id"], "name": "n",
                            "email": "not-an-email", "company": "c", "message": "m"}, timeout=15)
    assert r.status_code == 422


def test_brief_download_missing_company(sample_brief):
    r = requests.post(f"{BASE_URL}/api/brief-download",
                      json={"brief_id": sample_brief["id"], "name": "n",
                            "email": "a@b.com", "company": "", "message": "m"}, timeout=15)
    assert r.status_code in (400, 422)


def test_brief_download_missing_message(sample_brief):
    r = requests.post(f"{BASE_URL}/api/brief-download",
                      json={"brief_id": sample_brief["id"], "name": "n",
                            "email": "a@b.com", "company": "c", "message": ""}, timeout=15)
    assert r.status_code in (400, 422)


def test_brief_download_invalid_id():
    r = requests.post(f"{BASE_URL}/api/brief-download",
                      json={"brief_id": "does-not-exist", "name": "n",
                            "email": "a@b.com", "company": "c", "message": "m"}, timeout=15)
    assert r.status_code == 404


def test_brief_download_creates_admin_inquiry(admin_client, sample_brief):
    tag = f"iter16-{RUN_TAG}-{uuid.uuid4().hex[:4]}"
    email = f"TEST_iter16_{tag}@example.com"
    inquiry_id = None
    try:
        payload = {"brief_id": sample_brief["id"], "name": "TEST_iter16",
                   "email": email, "company": "TEST_iter16",
                   "message": f"marker {tag}"}
        r = requests.post(f"{BASE_URL}/api/brief-download", json=payload, timeout=20)
        assert r.status_code == 200
        q = admin_client.get(f"{BASE_URL}/api/inquiries", timeout=15)
        assert q.status_code == 200
        inquiries = q.json()
        matches = [i for i in inquiries if i.get("email") == payload["email"]]
        assert len(matches) == 1, f"expected exactly 1 inquiry, got {len(matches)}"
        m = matches[0]
        inquiry_id = m["id"]
        assert m.get("type") == "brief_download"
        assert m.get("details", {}).get("brief_id") == sample_brief["id"]
        assert m.get("details", {}).get("brief_title") == sample_brief.get("title", "")
        assert m.get("message") == f"marker {tag}"
    finally:
        if inquiry_id:
            resp = admin_client.delete(f"{BASE_URL}/api/inquiries/{inquiry_id}", timeout=15)
            assert resp.status_code in (200, 204, 404), f"cleanup delete failed: {resp.status_code}"

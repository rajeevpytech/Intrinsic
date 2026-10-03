"""Backend tests for Intrrinsic admin panel."""
import os
import io
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    # Fall back to frontend/.env
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---- Auth ----
class TestAuth:
    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_no_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---- Content CRUD ----
@pytest.mark.parametrize("name", ["blogs", "testimonials", "case-studies"])
class TestContent:
    def test_list_public(self, name):
        r = requests.get(f"{API}/content/{name}")
        assert r.status_code == 200
        assert isinstance(r.json(), list) and len(r.json()) > 0

    def test_write_requires_auth(self, name):
        r = requests.post(f"{API}/content/{name}", json={"title": "x"})
        assert r.status_code == 401
        # PUT / DELETE require auth too
        r2 = requests.put(f"{API}/content/{name}/nonexistent", json={"title": "x"})
        assert r2.status_code == 401
        r3 = requests.delete(f"{API}/content/{name}/nonexistent")
        assert r3.status_code == 401

    def test_crud_flow(self, name, auth_headers):
        payload = {"title": "TEST_item", "quote": "TEST_quote", "tag": "TEST_tag",
                   "body": "TEST body", "excerpt": "TEST excerpt", "category": "TEST",
                   "role": "TEST role", "since": "TEST since"}
        r = requests.post(f"{API}/content/{name}", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        created = r.json()
        assert "id" in created
        item_id = created["id"]

        # Verify persisted via GET
        r2 = requests.get(f"{API}/content/{name}")
        assert any(i["id"] == item_id for i in r2.json())

        # Update
        r3 = requests.put(f"{API}/content/{name}/{item_id}",
                          json={"title": "TEST_updated", "quote": "TEST_updated_q", "tag": "TEST_updated_tag"},
                          headers=auth_headers)
        assert r3.status_code == 200
        upd = r3.json()
        # One of these should match
        assert (upd.get("title") == "TEST_updated" or upd.get("quote") == "TEST_updated_q"
                or upd.get("tag") == "TEST_updated_tag")

        # Delete
        r4 = requests.delete(f"{API}/content/{name}/{item_id}", headers=auth_headers)
        assert r4.status_code == 200
        r5 = requests.get(f"{API}/content/{name}")
        assert all(i["id"] != item_id for i in r5.json())


# ---- Site content ----
class TestSite:
    def test_get_site_public(self):
        r = requests.get(f"{API}/content-site")
        assert r.status_code == 200
        d = r.json()
        for k in ["hero_h1", "hero_h2", "hero_paragraph", "hero_cta", "resources_heading", "resources_sub"]:
            assert k in d

    def test_put_site_requires_auth(self):
        r = requests.put(f"{API}/content-site", json={"hero_h1": "x"})
        assert r.status_code == 401

    def test_put_site_updates(self, auth_headers):
        orig = requests.get(f"{API}/content-site").json()
        try:
            r = requests.put(f"{API}/content-site", json={**orig, "hero_h1": "TEST_HERO"}, headers=auth_headers)
            assert r.status_code == 200
            assert r.json()["hero_h1"] == "TEST_HERO"
            # Verify persist
            assert requests.get(f"{API}/content-site").json()["hero_h1"] == "TEST_HERO"
        finally:
            # revert
            requests.put(f"{API}/content-site", json=orig, headers=auth_headers)
            assert requests.get(f"{API}/content-site").json()["hero_h1"] == orig["hero_h1"]


# ---- Image upload ----
class TestUpload:
    def test_upload_requires_auth(self):
        r = requests.post(f"{API}/upload", files={"file": ("t.png", b"x", "image/png")})
        assert r.status_code == 401

    def test_upload_and_serve(self, auth_headers):
        # 1x1 PNG
        png = bytes.fromhex(
            "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
            "890000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082"
        )
        r = requests.post(f"{API}/upload", files={"file": ("t.png", png, "image/png")}, headers=auth_headers)
        assert r.status_code == 200, r.text
        path = r.json()["path"]
        assert path

        r2 = requests.get(f"{API}/files/{path}")
        assert r2.status_code == 200
        assert r2.headers.get("content-type", "").startswith("image/")
        assert len(r2.content) > 0

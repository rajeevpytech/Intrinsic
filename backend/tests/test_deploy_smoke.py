"""Pre-deploy smoke tests for Intrinsic backend."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://intrinsic-stage.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@intrinsic.io"
ADMIN_PASSWORD = "Intrinsic@Admin2026!"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    tok = r.json().get("access_token")
    assert tok
    return tok


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---- Health ----
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()

    def test_health(self, session):
        r = session.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---- Auth ----
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        assert isinstance(data["access_token"], str) and len(data["access_token"]) > 10

    def test_login_invalid(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_unauthorized(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code in (401, 403)


# ---- Inquiries (DB read/write) ----
_state = {}


class TestInquiries:
    def test_create_inquiry(self, session):
        payload = {
            "name": "TEST_Smoke User",
            "email": "test_smoke@example.com",
            "company": "TestCo",
            "phone": "555-0100",
            "message": "Smoke test inquiry",
            "type": "contact",
            "details": {"source": "pytest"},
        }
        r = session.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert data.get("id")
        _state["inquiry_id"] = data["id"]

    def test_list_inquiries_requires_auth(self):
        r = requests.get(f"{API}/inquiries")
        assert r.status_code in (401, 403)

    def test_list_inquiries_authenticated(self, session, auth_headers):
        r = session.get(f"{API}/inquiries", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        ids = [i.get("id") for i in items]
        assert _state.get("inquiry_id") in ids, "Created inquiry not persisted"

    def test_cleanup_inquiry(self, session, auth_headers):
        iid = _state.get("inquiry_id")
        if iid:
            r = session.delete(f"{API}/inquiries/{iid}", headers=auth_headers)
            assert r.status_code == 200


# ---- Public content ----
class TestPublicContent:
    @pytest.mark.parametrize("name", ["blogs", "testimonials", "case-studies", "jobs", "service-briefs"])
    def test_content_endpoint(self, session, name):
        r = session.get(f"{API}/content/{name}")
        assert r.status_code == 200, f"{name}: {r.text}"
        assert isinstance(r.json(), list)

    def test_content_site(self, session):
        r = session.get(f"{API}/content-site")
        assert r.status_code == 200
        data = r.json()
        assert "hero_h2" in data

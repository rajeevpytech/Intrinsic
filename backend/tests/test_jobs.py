"""Tests for admin-managed jobs via /api/content/jobs."""
import os
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if False else "https://deploy-ready-345.preview.emergentagent.com"
# fallback: use the frontend .env value
try:
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip()
                break
except Exception:
    pass

ADMIN_EMAIL = "admin@intrinsic.com"
ADMIN_PASSWORD = "Admin@12345"

@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]

@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_list_jobs_public():
    r = requests.get(f"{BASE_URL}/api/content/jobs")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    for j in data:
        assert "slug" in j and "title" in j


def test_create_without_token_401():
    r = requests.post(f"{BASE_URL}/api/content/jobs", json={"title": "x", "slug": "x"})
    assert r.status_code == 401


def test_full_crud_flow(auth_headers):
    body = {
        "title": "QA Temp Role",
        "slug": "qa-temp-role",
        "category": "QA",
        "type": "Full Time",
        "location": "Remote",
        "overview": "temp",
        "responsibilities": ["do a", "do b"],
        "requirements": ["req a"],
        "preferred": [],
        "published": False,
    }
    # Create
    r = requests.post(f"{BASE_URL}/api/content/jobs", json=body, headers=auth_headers)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["slug"] == "qa-temp-role"
    assert created["published"] is False
    assert "id" in created
    job_id = created["id"]

    # Verify via GET
    r = requests.get(f"{BASE_URL}/api/content/jobs")
    found = [j for j in r.json() if j.get("id") == job_id]
    assert len(found) == 1
    assert found[0]["title"] == "QA Temp Role"

    # Update
    r = requests.put(f"{BASE_URL}/api/content/jobs/{job_id}",
                     json={**body, "published": True, "title": "QA Temp Role Updated"},
                     headers=auth_headers)
    assert r.status_code == 200
    upd = r.json()
    assert upd["published"] is True
    assert upd["title"] == "QA Temp Role Updated"

    # Delete
    r = requests.delete(f"{BASE_URL}/api/content/jobs/{job_id}", headers=auth_headers)
    assert r.status_code == 200

    # Confirm gone
    r = requests.get(f"{BASE_URL}/api/content/jobs")
    assert not any(j.get("id") == job_id for j in r.json())


def test_cleanup_qa_temp():
    """Cleanup any stray qa-temp jobs from prior runs (admin token needed)."""
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    token = r.json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE_URL}/api/content/jobs")
    for j in r.json():
        if (j.get("slug") or "").startswith("qa-temp"):
            requests.delete(f"{BASE_URL}/api/content/jobs/{j['id']}", headers=h)

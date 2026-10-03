"""Tests for POST /api/applications (job applications) and admin visibility."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": "admin", "password": "admin123"}, timeout=30)
    # admin login uses email field but seed uses ADMIN_EMAIL — try both
    if r.status_code != 200:
        r = requests.post(f"{API}/auth/login", json={"email": "admin@intrrinsic.com", "password": "admin123"}, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"Cannot login as admin: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def created_ids():
    return []


def test_application_missing_name_fails():
    r = requests.post(f"{API}/applications", data={"name": "", "email": "x@y.com"}, timeout=30)
    assert r.status_code in (400, 422)


def test_application_missing_email_fails():
    r = requests.post(f"{API}/applications", data={"name": "TEST_", "email": ""}, timeout=30)
    assert r.status_code in (400, 422)


def test_application_bad_resume_extension_fails():
    files = {"resume": ("bad.exe", b"nope", "application/octet-stream")}
    data = {"name": "TEST_Bad", "email": "bad@example.com", "role": "QA"}
    r = requests.post(f"{API}/applications", data=data, files=files, timeout=30)
    assert r.status_code == 400
    assert ".pdf" in r.text.lower() or "resume" in r.text.lower()


def test_application_happy_path_no_resume(created_ids):
    data = {
        "name": "TEST_Cara Applicant",
        "email": "TEST_cara@example.com",
        "phone": "+1 555 7777",
        "role": "Security Operations Analyst",
        "cover_letter": "I would love to join",
    }
    r = requests.post(f"{API}/applications", data=data, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("success") is True
    assert "id" in body
    created_ids.append(body["id"])


def test_application_happy_path_with_pdf(created_ids):
    # tiny valid-ish PDF header bytes
    pdf_bytes = b"%PDF-1.4\n%TEST\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"
    files = {"resume": ("resume.pdf", pdf_bytes, "application/pdf")}
    data = {
        "name": "TEST_Cara With Resume",
        "email": "TEST_cara2@example.com",
        "phone": "+1 555 8888",
        "role": "Security Operations Analyst",
        "cover_letter": "Please review the attached resume.",
    }
    r = requests.post(f"{API}/applications", data=data, files=files, timeout=60)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("success") is True
    created_ids.append(body["id"])


def test_admin_lists_applications(admin_token, created_ids):
    r = requests.get(f"{API}/inquiries", headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
    assert r.status_code == 200
    items = r.json()
    ids = {i["id"] for i in items}
    for cid in created_ids:
        assert cid in ids
    apps = [i for i in items if i["id"] in created_ids]
    for a in apps:
        assert a["type"] == "application"
        assert "role" in a["details"]
        assert a["details"]["role"] == "Security Operations Analyst"
    # Verify at least one has a resume path
    with_resume = [a for a in apps if a["details"].get("resume")]
    assert len(with_resume) >= 1
    # Try downloading resume
    resume_path = with_resume[0]["details"]["resume"]
    r2 = requests.get(f"{API}/files/{resume_path}", timeout=30)
    assert r2.status_code == 200
    assert len(r2.content) > 0


def test_cleanup(admin_token, created_ids):
    for cid in created_ids:
        r = requests.delete(f"{API}/inquiries/{cid}", headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200

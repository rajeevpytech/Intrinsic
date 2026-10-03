"""Tests for inquiry type=assessment vs contact + details persistence."""
import os
import requests
import pytest

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"


@pytest.fixture(scope="module")
def auth():
    r = requests.post(f"{API}/auth/login", json={"email": "admin", "password": "admin123"})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _post(payload):
    r = requests.post(f"{API}/inquiries", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["id"]


def test_assessment_inquiry_persists_type_and_details(auth):
    iid = _post({
        "name": "TEST_SecQA", "email": "secqa@example.com", "company": "TEST_SecCo",
        "phone": "555", "message": "assess",
        "type": "assessment",
        "details": {"company_size": "11–50 employees", "primary_concern": "Ransomware & malware", "current_provider": ""},
    })
    try:
        items = requests.get(f"{API}/inquiries", headers=auth).json()
        row = next((x for x in items if x["id"] == iid), None)
        assert row is not None
        assert row["type"] == "assessment"
        assert row["details"]["company_size"] == "11–50 employees"
        assert row["details"]["primary_concern"] == "Ransomware & malware"
    finally:
        requests.delete(f"{API}/inquiries/{iid}", headers=auth)


def test_contact_inquiry_defaults_to_contact_type(auth):
    iid = _post({"name": "TEST_ContactQA", "email": "cqa@example.com", "message": "hi"})
    try:
        items = requests.get(f"{API}/inquiries", headers=auth).json()
        row = next((x for x in items if x["id"] == iid), None)
        assert row is not None
        assert row["type"] == "contact"
    finally:
        requests.delete(f"{API}/inquiries/{iid}", headers=auth)


def test_missing_name_or_email_400():
    r = requests.post(f"{API}/inquiries", json={"name": "", "email": "x@y.com", "type": "assessment"})
    assert r.status_code == 400
    r2 = requests.post(f"{API}/inquiries", json={"name": "x", "email": "", "type": "assessment"})
    assert r2.status_code == 400

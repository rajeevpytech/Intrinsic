"""Backend tests for Service Briefs feature."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://deploy-now-154.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@intrinsic.com"
ADMIN_PASSWORD = "Admin@Intrinsic2026"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json().get("access_token") or r.json().get("token")


@pytest.fixture(scope="module")
def briefs(session):
    r = session.get(f"{BASE_URL}/api/content/service-briefs")
    assert r.status_code == 200
    return r.json()


# ---- GET /api/content/service-briefs ----
def test_service_briefs_list(briefs):
    assert isinstance(briefs, list)
    assert len(briefs) == 4
    titles = [b["title"] for b in briefs]
    assert titles == [
        "Managed IT Services",
        "Microsoft 365",
        "vCIO — Strategic IT Leadership",
        "Cybersecurity",
    ]
    # availability
    avail_map = {b["title"]: b.get("available") for b in briefs}
    assert avail_map["Managed IT Services"] is True
    assert avail_map["Microsoft 365"] is True
    assert avail_map["vCIO — Strategic IT Leadership"] is True
    assert avail_map["Cybersecurity"] is False
    # no _id leak
    for b in briefs:
        assert "_id" not in b


# ---- POST /api/brief-download ----
def test_brief_download_success(session, briefs):
    managed = next(b for b in briefs if b["title"] == "Managed IT Services")
    r = session.post(f"{BASE_URL}/api/brief-download", json={
        "brief_id": managed["id"], "name": "TEST_User", "email": "test_briefs@example.com", "company": "TEST_Co"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["success"] is True
    assert data["file"].endswith(".pdf")


def test_brief_download_missing_name(session, briefs):
    managed = next(b for b in briefs if b["title"] == "Managed IT Services")
    r = session.post(f"{BASE_URL}/api/brief-download", json={"brief_id": managed["id"], "name": "", "email": "a@b.com"})
    assert r.status_code == 400


def test_brief_download_missing_email(session, briefs):
    managed = next(b for b in briefs if b["title"] == "Managed IT Services")
    r = session.post(f"{BASE_URL}/api/brief-download", json={"brief_id": managed["id"], "name": "X", "email": ""})
    assert r.status_code == 400


def test_brief_download_unknown_id(session):
    r = session.post(f"{BASE_URL}/api/brief-download", json={"brief_id": "does-not-exist", "name": "X", "email": "a@b.com"})
    assert r.status_code == 404


def test_brief_download_unavailable(session, briefs):
    cyber = next(b for b in briefs if b["title"] == "Cybersecurity")
    r = session.post(f"{BASE_URL}/api/brief-download", json={"brief_id": cyber["id"], "name": "X", "email": "a@b.com"})
    assert r.status_code == 400


def test_brief_download_recorded_lead(session, admin_token, briefs):
    m365 = next(b for b in briefs if b["title"] == "Microsoft 365")
    unique_email = "test_brief_lead_capture@example.com"
    r = session.post(f"{BASE_URL}/api/brief-download", json={
        "brief_id": m365["id"], "name": "TEST_LeadUser", "email": unique_email, "company": "TEST_Co"
    })
    assert r.status_code == 200

    # Fetch inquiries as admin
    r2 = requests.get(f"{BASE_URL}/api/inquiries", headers={"Authorization": f"Bearer {admin_token}"})
    assert r2.status_code == 200, r2.text
    inquiries = r2.json()
    match = [i for i in inquiries if i.get("email") == unique_email and i.get("type") == "brief_download"]
    assert len(match) >= 1
    assert "Microsoft 365" in match[0].get("message", "")


# ---- Static file serving ----
@pytest.mark.parametrize("path", [
    "/briefs/intrinsic-managed-it-services-service-brief.pdf",
    "/briefs/intrinsic-microsoft-365-service-brief.pdf",
    "/briefs/intrinsic-vcio-service-brief.pdf",
])
def test_pdfs_served(path):
    r = requests.get(f"{BASE_URL}{path}")
    assert r.status_code == 200, path
    assert "pdf" in r.headers.get("content-type", "").lower()


@pytest.mark.parametrize("path", [
    "/images/brief-managed-it-cover.webp",
    "/images/brief-m365-cover.webp",
    "/images/brief-vcio-cover.webp",
])
def test_covers_served(path):
    r = requests.get(f"{BASE_URL}{path}")
    assert r.status_code == 200, path
    ct = r.headers.get("content-type", "").lower()
    assert "webp" in ct or "image" in ct

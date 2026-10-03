"""End-to-end backend test for admin authoring flows:
- Login as admin
- Upload PNG (case study hero) + PDF (service brief)
- Create case study via /api/content/case-studies with image
- Verify GET returns it
- Update Cybersecurity service brief with cover + file + available=true + pages
- Verify /api/files/{path} serves both correctly
- Cleanup: delete created case study, revert Cybersecurity brief
"""
import io
import os
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_EMAIL = "admin@intrinsic.com"
ADMIN_PASSWORD = "Admin@Intrinsic2026"


def _make_png(w=8, h=8, color=(10, 60, 145)):
    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    raw = b""
    for _ in range(h):
        raw += b"\x00" + bytes(color) * w
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


def _make_pdf():
    return (b"%PDF-1.4\n"
            b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
            b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
            b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>endobj\n"
            b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n"
            b"0000000053 00000 n \n0000000099 00000 n \n"
            b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n147\n%%EOF\n")


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed {r.status_code} {r.text}"
    token = r.json().get("token") or r.json().get("access_token")
    assert token, f"No token: {r.json()}"
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s


@pytest.fixture(scope="module")
def state():
    return {}


def test_login_and_me(admin_client):
    r = admin_client.get(f"{BASE_URL}/api/auth/me", timeout=15)
    assert r.status_code == 200


def test_upload_image(admin_client, state):
    png = _make_png()
    files = {"file": ("hero.png", png, "image/png")}
    r = admin_client.post(f"{BASE_URL}/api/upload", files=files, timeout=30)
    assert r.status_code == 200, r.text
    p = r.json()["path"]
    assert p and p.endswith(".png")
    state["image_path"] = p

    # Serve
    r2 = requests.get(f"{BASE_URL}/api/files/{p}", timeout=30)
    assert r2.status_code == 200
    assert "image/png" in r2.headers.get("content-type", "")
    assert r2.content[:8] == b"\x89PNG\r\n\x1a\n"


def test_upload_pdf(admin_client, state):
    pdf = _make_pdf()
    files = {"file": ("brief.pdf", pdf, "application/pdf")}
    r = admin_client.post(f"{BASE_URL}/api/upload", files=files, timeout=30)
    assert r.status_code == 200, r.text
    p = r.json()["path"]
    assert p and p.endswith(".pdf")
    state["pdf_path"] = p

    r2 = requests.get(f"{BASE_URL}/api/files/{p}", timeout=30)
    assert r2.status_code == 200
    assert "application/pdf" in r2.headers.get("content-type", "")
    assert r2.content.startswith(b"%PDF")


def test_upload_requires_auth():
    r = requests.post(f"{BASE_URL}/api/upload",
                      files={"file": ("x.png", b"x", "image/png")}, timeout=15)
    assert r.status_code in (401, 403)


def test_create_case_study(admin_client, state):
    body = {
        "tag": "TEST_INDUSTRY · Managed IT",
        "title": "TEST_CASE_STUDY_AUTHORING",
        "stat": "40% faster",
        "body": "TEST summary line 1.\nTEST line 2.",
        "challenge": "TEST_CHALLENGE_TEXT",
        "approach": "TEST_APPROACH_TEXT",
        "results": ["TEST result A", "TEST result B", "TEST result C"],
        "quote": "TEST quote content",
        "quote_author": "TEST Author, TEST Co",
        "image": state["image_path"],
    }
    r = admin_client.post(f"{BASE_URL}/api/content/case-studies", json=body, timeout=30)
    assert r.status_code in (200, 201), r.text
    created = r.json()
    assert "id" in created
    state["case_id"] = created["id"]
    for k in ("tag", "title", "stat", "challenge", "approach", "quote", "image"):
        assert created.get(k) == body[k], f"field {k} mismatch: {created.get(k)!r} vs {body[k]!r}"
    assert created.get("results") == body["results"]


def test_case_study_in_public_list(admin_client, state):
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    items = r.json()
    match = [it for it in items if it.get("id") == state["case_id"]]
    assert match, "created case study not found in public list"
    assert match[0]["image"] == state["image_path"]


def test_find_cyber_brief(admin_client, state):
    r = requests.get(f"{BASE_URL}/api/content/service-briefs", timeout=15)
    assert r.status_code == 200
    briefs = r.json()
    cyber = None
    for b in briefs:
        blob = f"{b.get('title','')} {b.get('service','')}".lower()
        if "cyber" in blob:
            cyber = b
            break
    assert cyber, f"No cybersecurity brief found. Titles: {[b.get('title') for b in briefs]}"
    state["cyber_id"] = cyber["id"]
    # Snapshot for revert
    state["cyber_original"] = {
        k: cyber.get(k) for k in
        ("title", "service", "subtitle", "pages", "summary", "points",
         "cover", "file", "available")
    }


def test_flip_cyber_brief_live(admin_client, state):
    payload = dict(state["cyber_original"])
    payload["file"] = state["pdf_path"]
    payload["cover"] = state["image_path"]
    payload["pages"] = "2 pages"
    payload["available"] = True
    r = admin_client.put(f"{BASE_URL}/api/content/service-briefs/{state['cyber_id']}",
                         json=payload, timeout=30)
    assert r.status_code in (200, 201), r.text
    updated = r.json()
    assert updated.get("file") == state["pdf_path"]
    assert updated.get("cover") == state["image_path"]
    assert updated.get("available") is True
    assert updated.get("pages") == "2 pages"

    # Verify via GET list
    r2 = requests.get(f"{BASE_URL}/api/content/service-briefs", timeout=15)
    assert r2.status_code == 200
    cyber = next(b for b in r2.json() if b["id"] == state["cyber_id"])
    assert cyber["file"] == state["pdf_path"]

    # Download the brief file
    r3 = requests.get(f"{BASE_URL}/api/files/{state['pdf_path']}", timeout=30)
    assert r3.status_code == 200
    assert "application/pdf" in r3.headers.get("content-type", "")


def test_zzz_cleanup_case_study(admin_client, state):
    if state.get("case_id"):
        r = admin_client.delete(f"{BASE_URL}/api/content/case-studies/{state['case_id']}",
                                timeout=15)
        assert r.status_code in (200, 204)
        r2 = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
        assert not any(it.get("id") == state["case_id"] for it in r2.json())


def test_zzz_cleanup_revert_cyber(admin_client, state):
    if state.get("cyber_id") and state.get("cyber_original"):
        orig = dict(state["cyber_original"])
        # Enforce coming-soon state: available=False, no file/cover, pages empty
        orig["file"] = None
        orig["cover"] = None
        orig["pages"] = ""
        orig["available"] = False
        r = admin_client.put(f"{BASE_URL}/api/content/service-briefs/{state['cyber_id']}",
                             json=orig, timeout=30)
        assert r.status_code in (200, 201), r.text
        updated = r.json()
        assert not updated.get("file")
        assert not updated.get("cover")
        assert updated.get("available") is False

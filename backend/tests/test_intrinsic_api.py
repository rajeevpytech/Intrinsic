"""Backend API tests for Intrinsic Technology app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://quick-deploy-372.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@intrinsicamerica.com"
ADMIN_PASSWORD = "Intrinsic#2026Admin"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(client):
    r = client.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data or "token" in data
    return data.get("access_token") or data.get("token")


@pytest.fixture(scope="module")
def auth_client(client, token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
    return s


# --- Health ---
def test_health(client):
    r = client.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    assert r.json().get("status") in ("ok", "healthy") or "ok" in str(r.json()).lower()


def test_root(client):
    r = client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    body = r.text.lower()
    assert "intrinsic" in body


# --- Auth ---
def test_auth_me(auth_client):
    r = auth_client.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 200
    d = r.json()
    assert d.get("email") == ADMIN_EMAIL


# --- Public content ---
def test_case_studies(client):
    r = client.get(f"{BASE_URL}/api/content/case-studies")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) >= 1  # expect 5 seeded


def test_jobs(client):
    r = client.get(f"{BASE_URL}/api/content/jobs")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) >= 1


def test_testimonials(client):
    r = client.get(f"{BASE_URL}/api/content/testimonials")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_content_site(client):
    r = client.get(f"{BASE_URL}/api/content-site")
    assert r.status_code == 200


def test_seo(client):
    r = client.get(f"{BASE_URL}/api/seo")
    assert r.status_code == 200


# --- Inquiries ---
def test_inquiry_submit_and_list(client, auth_client):
    payload = {"name": "TEST_User", "email": "test_user@example.com", "message": "TEST inquiry from pytest"}
    r = client.post(f"{BASE_URL}/api/inquiries", json=payload)
    assert r.status_code in (200, 201), r.text
    r2 = auth_client.get(f"{BASE_URL}/api/inquiries")
    assert r2.status_code == 200
    items = r2.json()
    assert any(i.get("email") == payload["email"] for i in items)


# --- Blog CRUD ---
def test_blog_crud(auth_client):
    payload = {
        "title": "TEST_Blog_Post",
        "slug": "test-blog-post-pytest",
        "content": "TEST content body",
        "excerpt": "TEST excerpt",
        "author": "Tester",
        "tags": ["test"],
        "published": True,
    }
    r = auth_client.post(f"{BASE_URL}/api/content/blogs", json=payload)
    assert r.status_code in (200, 201), r.text
    blog = r.json()
    blog_id = blog.get("id") or blog.get("_id")
    assert blog_id

    upd = auth_client.put(f"{BASE_URL}/api/content/blogs/{blog_id}", json={**payload, "title": "TEST_Blog_Updated"})
    assert upd.status_code in (200, 204), upd.text

    dl = auth_client.delete(f"{BASE_URL}/api/content/blogs/{blog_id}")
    assert dl.status_code in (200, 204), dl.text


# --- SEO / SSR ---
def test_sitemap(client):
    r = client.get(f"{BASE_URL}/api/sitemap.xml")
    assert r.status_code == 200
    assert "<urlset" in r.text or "<?xml" in r.text


def test_robots(client):
    r = client.get(f"{BASE_URL}/api/robots.txt")
    assert r.status_code == 200
    assert "User-agent" in r.text or "user-agent" in r.text.lower()



def test_brief_download(client):
    # Get a real brief id
    briefs = client.get(f"{BASE_URL}/api/content/service-briefs").json()
    assert len(briefs) > 0, "no service briefs seeded"
    brief_id = briefs[0]["id"]
    payload = {"name": "TEST_User", "email": "test_brief@example.com", "company": "TEST Co", "brief_id": brief_id, "message": "TEST brief download"}
    r = client.post(f"{BASE_URL}/api/brief-download", json=payload)
    assert r.status_code in (200, 201), r.text


def test_ssr_home(client):
    r = client.get(f"{BASE_URL}/api/ssr", params={"path": "/"})
    assert r.status_code == 200
    assert "<html" in r.text.lower() or "<!doctype" in r.text.lower()


def test_auth_me_no_token(client):
    r = client.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code in (401, 403)

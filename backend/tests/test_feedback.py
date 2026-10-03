"""Backend tests for review-feedback endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": "admin", "password": "admin123"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def created_pin():
    payload = {
        "page": "/",
        "author": "TEST_Tester",
        "text": "TEST_Comment initial",
        "selector": "h1",
        "label": "Hero heading",
        "rel_x": 0.4, "rel_y": 0.3, "doc_x": 100, "doc_y": 200,
    }
    r = requests.post(f"{API}/feedback", json=payload)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["id"] and d["status"] == "open" and d["replies"] == []
    assert d["author"] == "TEST_Tester" and d["text"] == "TEST_Comment initial"
    return d


class TestCreate:
    def test_create_pin(self, created_pin):
        assert created_pin["page"] == "/"

    def test_create_empty_author(self):
        r = requests.post(f"{API}/feedback", json={"page": "/", "author": "  ", "text": "x"})
        assert r.status_code == 400

    def test_create_empty_text(self):
        r = requests.post(f"{API}/feedback", json={"page": "/", "author": "n", "text": ""})
        assert r.status_code == 400


class TestList:
    def test_list_all(self, created_pin):
        r = requests.get(f"{API}/feedback")
        assert r.status_code == 200
        ids = [i["id"] for i in r.json()]
        assert created_pin["id"] in ids

    def test_list_filtered(self, created_pin):
        r = requests.get(f"{API}/feedback", params={"page": "/"})
        assert r.status_code == 200
        assert all(i["page"] == "/" for i in r.json())
        assert created_pin["id"] in [i["id"] for i in r.json()]

    def test_list_no_mongo_id(self, created_pin):
        r = requests.get(f"{API}/feedback")
        for item in r.json():
            assert "_id" not in item


class TestReplies:
    def test_add_reply(self, created_pin):
        r = requests.post(f"{API}/feedback/{created_pin['id']}/replies",
                          json={"author": "TEST_Replier", "text": "TEST_reply body"})
        assert r.status_code == 200, r.text
        d = r.json()
        assert len(d["replies"]) >= 1
        assert d["replies"][-1]["text"] == "TEST_reply body"

    def test_reply_unknown(self):
        r = requests.post(f"{API}/feedback/nonexistent-id/replies",
                          json={"author": "a", "text": "b"})
        assert r.status_code == 404

    def test_reply_empty_text(self, created_pin):
        r = requests.post(f"{API}/feedback/{created_pin['id']}/replies",
                          json={"author": "a", "text": ""})
        assert r.status_code == 400


class TestStatus:
    def test_resolve(self, created_pin):
        r = requests.patch(f"{API}/feedback/{created_pin['id']}", json={"status": "resolved"})
        assert r.status_code == 200
        assert r.json()["status"] == "resolved"

    def test_reopen(self, created_pin):
        r = requests.patch(f"{API}/feedback/{created_pin['id']}", json={"status": "open"})
        assert r.status_code == 200
        assert r.json()["status"] == "open"

    def test_invalid_status(self, created_pin):
        r = requests.patch(f"{API}/feedback/{created_pin['id']}", json={"status": "bogus"})
        assert r.status_code == 400


class TestDelete:
    def test_delete_requires_auth(self, created_pin):
        r = requests.delete(f"{API}/feedback/{created_pin['id']}")
        assert r.status_code in (401, 403)

    def test_delete_with_token(self, admin_token):
        # create fresh pin to delete
        c = requests.post(f"{API}/feedback", json={"page": "/", "author": "TEST_del",
                                                    "text": "TEST_delete me"}).json()
        r = requests.delete(f"{API}/feedback/{c['id']}",
                            headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        # verify gone
        ids = [i["id"] for i in requests.get(f"{API}/feedback").json()]
        assert c["id"] not in ids


def test_cleanup(admin_token, created_pin):
    """Delete the TEST_ pin created in this module."""
    requests.delete(f"{API}/feedback/{created_pin['id']}",
                    headers={"Authorization": f"Bearer {admin_token}"})
    # also clean any other TEST_ pins
    for item in requests.get(f"{API}/feedback").json():
        if item.get("author", "").startswith("TEST_"):
            requests.delete(f"{API}/feedback/{item['id']}",
                            headers={"Authorization": f"Bearer {admin_token}"})

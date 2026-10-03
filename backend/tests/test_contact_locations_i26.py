"""Iteration 26 regression tests for the Contact Locations section.
Ensures:
  * Boston address no longer has an extra comma after "MA" and is served as
    a single textContent child with a newline (whitespace-pre-line safe).
  * Stable, testid-based selectors `contact-location-{id}-{city|address}` persist
    through the live-editor save round-trip without clobbering other saved edits.
"""
import json
import os
import re
from pathlib import Path

import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"
CONTACT_PATH = "/contact"
BOSTON_SELECTOR = '[data-testid="contact-location-boston-address"]'


# ---- Credentials -----------------------------------------------------------
@pytest.fixture(scope="session")
def admin_token():
    credentials = (Path(__file__).resolve().parents[2] / "memory/test_credentials.md").read_text()
    email = re.search(r"Email:\s*`([^`]+)`", credentials).group(1)
    password = re.search(r"Password:\s*`([^`]+)`", credentials).group(1)
    r = requests.post(
        f"{API}/auth/login",
        json={"email": email, "password": password},
        timeout=15,
    )
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---- Preserve all saved edits; clean up ONLY this test's Boston selector ----
@pytest.fixture
def boston_edit_slot(auth_headers):
    response = requests.get(f"{API}/live-edits", timeout=15)
    response.raise_for_status()
    before = response.json()
    if any(e["path"] == CONTACT_PATH and e["selector"] == BOSTON_SELECTOR for e in before):
        pytest.skip("Boston already has a saved edit; do not overwrite user content")
    yield
    response = requests.get(f"{API}/live-edits", timeout=15)
    response.raise_for_status()
    owned = [e for e in response.json() if e["path"] == CONTACT_PATH and e["selector"] == BOSTON_SELECTOR]
    if owned:
        assert owned[0]["label"] == "TEST_I26_BOSTON_ADDRESS", "Refusing to delete another edit"
        deleted = requests.delete(
            f"{API}/live-edits",
            params={"path": CONTACT_PATH, "selector": BOSTON_SELECTOR},
            headers=auth_headers,
            timeout=15,
        )
        assert deleted.status_code == 200 and deleted.json()["deleted"] == 1
    response = requests.get(f"{API}/live-edits", timeout=15)
    response.raise_for_status()
    assert sorted(json.dumps(e, sort_keys=True) for e in response.json()) == sorted(
        json.dumps(e, sort_keys=True) for e in before
    ), "Saved edits changed outside this test's exact selector"


# ---- Static JS bundle asserts (shipped SPA) --------------------------------
def test_boston_punctuation_in_shipped_bundle():
    r = requests.get(f"{BASE_URL}/contact", timeout=20)
    assert r.status_code == 200
    bundle_paths = re.findall(r'/static/js/[^"\s]+\.js', r.text)
    assert bundle_paths, "No JS bundles found in /contact HTML"
    bad_hits = []
    good_hits = []
    for path in bundle_paths[:12]:
        jr = requests.get(f"{BASE_URL}{path}", timeout=30)
        if jr.status_code != 200:
            continue
        if "Boston, MA, 02109" in jr.text:
            bad_hits.append(path)
        if "75 State Street, Suite 100" in jr.text and "Boston, MA 02109" in jr.text:
            good_hits.append(path)
    assert not bad_hits, f"Legacy comma after MA still shipped in bundles: {bad_hits}"
    assert good_hits, "Correct Boston address not found in shipped bundles"


# ---- Live edit API round-trip ---------------------------------------------
def test_boston_live_edit_round_trip_and_stable_selector(auth_headers, boston_edit_slot):
    new_text = "75 State Street, Suite 101\nBoston, MA 02109"
    payload = {
        "path": CONTACT_PATH,
        "selector": BOSTON_SELECTOR,
        "label": "TEST_I26_BOSTON_ADDRESS",
        "props": {"text": new_text},
    }
    put = requests.put(f"{API}/live-edits", json=payload, headers=auth_headers, timeout=15)
    assert put.status_code == 200, put.text
    saved = put.json()
    assert saved["selector"] == BOSTON_SELECTOR
    assert saved["props"]["text"] == new_text
    assert "\n" in saved["props"]["text"]

    # GET verifies persistence
    listed = requests.get(f"{API}/live-edits", params={"path": CONTACT_PATH}, timeout=15).json()
    boston = [e for e in listed if e["selector"] == BOSTON_SELECTOR]
    assert boston, "Boston edit not persisted"
    assert boston[0]["props"]["text"] == new_text

    # The fixture restores only this exact selector, including on assertion failure.


def test_live_edit_requires_admin():
    r = requests.put(
        f"{API}/live-edits",
        json={"path": CONTACT_PATH, "selector": BOSTON_SELECTOR, "props": {"text": "x"}},
        timeout=15,
    )
    assert r.status_code in (401, 403)

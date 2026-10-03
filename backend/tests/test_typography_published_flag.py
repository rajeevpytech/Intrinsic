"""Regression tests for typographyPublished flag (iteration_14).

Behaviour under test:
  * GET /api/theme returns typographyPublished bool.
  * PUT /api/theme with a nonempty typography block auto-sets flag True
    when flag not explicitly supplied.
  * Partial PUT (e.g., accent-only) keeps flag unchanged.
  * Empty PUT keeps flag unchanged.
  * Explicit typographyPublished:false in body persists (allows explicit unpublish).
"""
import copy
import re
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

BASE_URL = dotenv_values(Path(__file__).resolve().parents[2] / 'frontend' / '.env')['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"

_creds = (Path(__file__).resolve().parents[2] / 'memory' / 'test_credentials.md').read_text()
ADMIN_EMAIL = re.search(r'^- Email:\s*`?([^`\n]+?)`?\s*$', _creds, re.M).group(1)
ADMIN_PASSWORD = re.search(r'^- Password:\s*`?([^`\n]+?)`?\s*$', _creds, re.M).group(1)


@pytest.fixture(scope='module')
def admin_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}", "Content-Type": "application/json"}


@pytest.fixture(scope='module', autouse=True)
def restore_theme(admin_headers):
    original = requests.get(f"{API}/theme", timeout=15).json()
    snapshot = copy.deepcopy(original)
    yield snapshot
    r = requests.put(f"{API}/theme", json=snapshot, headers=admin_headers, timeout=20)
    assert r.status_code == 200, r.text


def test_get_theme_returns_flag_key():
    d = requests.get(f"{API}/theme", timeout=15).json()
    assert "typographyPublished" in d
    assert isinstance(d["typographyPublished"], bool)


def test_typography_put_auto_marks_published(admin_headers, restore_theme):
    base = copy.deepcopy(restore_theme)
    base['typography']['hero']['color'] = '#123456'
    base['typography']['hero']['desktop'] = 52
    base['typography']['hero']['mobile'] = 32
    # do NOT include typographyPublished
    base.pop('typographyPublished', None)
    r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
    assert r.status_code == 200, r.text
    after = requests.get(f"{API}/theme", timeout=15).json()
    assert after['typographyPublished'] is True
    assert after['typography']['hero']['color'].lower() == '#123456'
    assert after['typography']['hero']['desktop'] == 52


def test_accent_only_patch_does_not_clear_flag(admin_headers, restore_theme):
    # ensure published
    base = copy.deepcopy(restore_theme)
    base['typography']['hero']['color'] = '#123456'
    base['typography']['hero']['desktop'] = 52
    base['typographyPublished'] = True
    requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)

    r = requests.put(f"{API}/theme", json={"accent": "#ff0088"}, headers=admin_headers, timeout=20)
    assert r.status_code == 200
    after = requests.get(f"{API}/theme", timeout=15).json()
    assert after['typographyPublished'] is True
    assert after['accent'] == '#ff0088'


def test_empty_put_preserves_flag(admin_headers, restore_theme):
    base = copy.deepcopy(restore_theme)
    base['typographyPublished'] = True
    base['typography']['hero']['color'] = '#123456'
    requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)

    r = requests.put(f"{API}/theme", json={}, headers=admin_headers, timeout=20)
    assert r.status_code == 200
    after = requests.get(f"{API}/theme", timeout=15).json()
    assert after['typographyPublished'] is True


def test_explicit_unpublish_persists(admin_headers, restore_theme):
    base = copy.deepcopy(restore_theme)
    base['typographyPublished'] = True
    base['typography']['hero']['color'] = '#123456'
    requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)

    r = requests.put(f"{API}/theme", json={"typographyPublished": False}, headers=admin_headers, timeout=20)
    assert r.status_code == 200
    after = requests.get(f"{API}/theme", timeout=15).json()
    assert after['typographyPublished'] is False
    # existing typography values retained
    assert after['typography']['hero']['color'].lower() == '#123456'


def test_typography_put_with_explicit_false_stays_false(admin_headers, restore_theme):
    base = copy.deepcopy(restore_theme)
    base['typography']['hero']['color'] = '#654321'
    base['typographyPublished'] = False
    r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
    assert r.status_code == 200
    after = requests.get(f"{API}/theme", timeout=15).json()
    assert after['typographyPublished'] is False
    assert after['typography']['hero']['color'].lower() == '#654321'

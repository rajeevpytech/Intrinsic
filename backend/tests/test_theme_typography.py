"""Theme + Typography API regression tests.

Backs up the current /api/theme document, runs validation/auth/persistence tests,
then RESTORES the original theme to avoid leaking test styles into production.
"""
import copy
from pathlib import Path
import re
import pytest
import requests
from dotenv import dotenv_values
from typography import Typography

BASE_URL = dotenv_values(Path(__file__).resolve().parents[2] / 'frontend' / '.env')['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"
credentials = (Path(__file__).resolve().parents[2] / 'memory' / 'test_credentials.md').read_text()
ADMIN_EMAIL = re.search(r'^- Email:\s*`?([^`\n]+?)`?\s*$', credentials, re.M).group(1)
ADMIN_PASSWORD = re.search(r'^- Password:\s*`?([^`\n]+?)`?\s*$', credentials, re.M).group(1)

CATEGORIES = ['header', 'hero', 'section', 'subheading', 'body', 'small', 'eyebrow']


@pytest.fixture(scope='module')
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope='module')
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope='module', autouse=True)
def backup_and_restore(auth_headers):
    original = requests.get(f"{API}/theme", timeout=15).json()
    yield original
    # Restore original (strip any non-schema keys just in case)
    r = requests.put(f"{API}/theme", json=original, headers=auth_headers, timeout=15)
    assert r.status_code == 200, f"restore failed: {r.status_code} {r.text}"


class TestThemePublic:
    def test_get_theme_public_no_auth(self):
        r = requests.get(f"{API}/theme", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert 'typography' in data
        for cat in CATEGORIES:
            assert cat in data['typography'], f"missing {cat}"
            s = data['typography'][cat]
            for f in ['family', 'mobile', 'tablet', 'desktop', 'weight', 'color', 'darkColor', 'lineHeight', 'letterSpacing', 'style']:
                assert f in s, f"{cat} missing {f}"

    def test_theme_contains_no_mongo_id_or_secrets(self):
        r = requests.get(f"{API}/theme", timeout=15)
        text = r.text
        assert '_id' not in text
        assert 'password' not in text.lower()
        assert 'jwt' not in text.lower()
        assert 'ObjectId' not in text

    def test_defaults_match_current_reference(self):
        d = Typography().model_dump()
        # hero desktop 46 weight 450 serif blue - reference
        assert d['hero']['desktop'] == 46
        assert d["hero"]["weight"] == 450
        assert 'Playfair' in d['hero']['family']
        # eyebrow dark gold on light per user request
        assert d['eyebrow']['color'].lower() == '#895600'
        assert d['body']['lineHeight'] == pytest.approx(1.62)


class TestThemeAuth:
    def test_put_theme_requires_auth(self):
        r = requests.put(f"{API}/theme", json={}, timeout=15)
        assert r.status_code in (401, 403), f"expected 401/403 got {r.status_code}"

    def test_put_theme_invalid_token(self):
        r = requests.put(f"{API}/theme", json={}, headers={"Authorization": "Bearer notavalidtoken"}, timeout=15)
        assert r.status_code in (401, 403)


class TestThemeValidation:
    def test_reject_invalid_hex(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['typography']['hero']['color'] = 'notahex'
        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_oversize_font(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['typography']['hero']['desktop'] = 9999
        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_bad_weight(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['typography']['hero']['weight'] = 123
        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_bad_family(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['typography']['hero']['family'] = 'Comic Sans'
        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_bad_brand_color(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['brand'] = 'red'
        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 422


class TestThemePersistence:
    def test_update_and_read_back_persists(self, auth_headers, backup_and_restore):
        body = copy.deepcopy(backup_and_restore)
        body['typography']['hero']['desktop'] = 44
        body['typography']['hero']['weight'] = 700
        body['typography']['body']['color'] = '#222222'

        r = requests.put(f"{API}/theme", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        resp = r.json()
        assert resp['typography']['hero']['desktop'] == 44
        assert resp['typography']['hero']['weight'] == 700
        assert resp['typography']['body']['color'] == '#222222'

        # Fresh GET should return same
        g = requests.get(f"{API}/theme", timeout=15).json()
        assert g['typography']['hero']['desktop'] == 44
        assert g['typography']['hero']['weight'] == 700
        assert g['typography']['body']['color'] == '#222222'

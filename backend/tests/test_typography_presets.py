"""Typography Preset CRUD regression tests.

Preserves /api/theme and only touches presets prefixed TEST_. Cleans up on teardown.
"""
import copy
import re
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

from typography import Typography

BASE_URL = dotenv_values(Path(__file__).resolve().parents[2] / 'frontend' / '.env')['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"
credentials = (Path(__file__).resolve().parents[2] / 'memory' / 'test_credentials.md').read_text()
ADMIN_EMAIL = re.search(r'^- Email: (.+)$', credentials, re.M).group(1)
ADMIN_PASSWORD = re.search(r'^- Password: (.+)$', credentials, re.M).group(1)

CATEGORIES = ['header', 'hero', 'section', 'subheading', 'body', 'small', 'eyebrow']
CREATED_IDS = set()


@pytest.fixture(scope='module')
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope='module')
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope='module')
def default_typography():
    return Typography().model_dump()


@pytest.fixture(scope='module', autouse=True)
def theme_backup_and_cleanup(auth_headers):
    original_theme = requests.get(f"{API}/theme", timeout=15).json()
    original_post = requests.post
    def tracked_post(url, *args, **kwargs):
        response = original_post(url, *args, **kwargs)
        if url == f'{API}/typography-presets' and response.status_code == 201:
            CREATED_IDS.add(response.json()['id'])
        return response
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(requests, 'post', tracked_post)
        try:
            yield original_theme
        finally:
            _delete_created_presets(auth_headers)
            r = requests.put(f"{API}/theme", json=original_theme, headers=auth_headers, timeout=15)
            assert r.status_code == 200, f"restore failed: {r.status_code} {r.text}"


def _delete_created_presets(auth_headers):
    for preset_id in list(CREATED_IDS):
        response = requests.delete(f'{API}/typography-presets/{preset_id}', headers=auth_headers, timeout=15)
        assert response.status_code in (200, 404)
        CREATED_IDS.discard(preset_id)


class TestPresetsAuth:
    def test_list_requires_auth(self):
        r = requests.get(f"{API}/typography-presets", timeout=15)
        assert r.status_code in (401, 403)

    def test_create_requires_auth(self, default_typography):
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_noauth", "typography": default_typography}, timeout=15)
        assert r.status_code in (401, 403)

    def test_patch_requires_auth(self):
        r = requests.patch(f"{API}/typography-presets/507f1f77bcf86cd799439011",
                           json={"name": "x"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_delete_requires_auth(self):
        r = requests.delete(f"{API}/typography-presets/507f1f77bcf86cd799439011", timeout=15)
        assert r.status_code in (401, 403)

    def test_invalid_token_rejected(self, default_typography):
        r = requests.get(f"{API}/typography-presets",
                         headers={"Authorization": "Bearer bogus"}, timeout=15)
        assert r.status_code in (401, 403)


class TestPresetCreate:
    def test_create_and_get_persists(self, auth_headers, default_typography, theme_backup_and_cleanup):
        _delete_created_presets(auth_headers)
        payload = {"name": "TEST_Preset_Alpha", "typography": default_typography}
        r = requests.post(f"{API}/typography-presets", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        # Response shape
        assert isinstance(data['id'], str) and len(data['id']) == 24
        assert data['name'] == "TEST_Preset_Alpha"
        assert 'created_at' in data
        assert 'typography' in data
        for cat in CATEGORIES:
            assert cat in data['typography']
        # No leaks
        assert '_id' not in data
        assert 'name_key' not in data

        # Theme unchanged
        theme_now = requests.get(f"{API}/theme", timeout=15).json()
        assert theme_now == theme_backup_and_cleanup

        # GET list returns it
        lst = requests.get(f"{API}/typography-presets", headers=auth_headers, timeout=15).json()
        names = [p['name'] for p in lst]
        assert "TEST_Preset_Alpha" in names
        found = next(p for p in lst if p['name'] == 'TEST_Preset_Alpha')
        assert '_id' not in found and 'name_key' not in found

    def test_trim_whitespace_name(self, auth_headers, default_typography):
        payload = {"name": "   TEST_Trim_Me   ", "typography": default_typography}
        r = requests.post(f"{API}/typography-presets", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 201, r.text
        assert r.json()['name'] == "TEST_Trim_Me"

    def test_reject_blank_name(self, auth_headers, default_typography):
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "   ", "typography": default_typography},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_name_over_60_chars(self, auth_headers, default_typography):
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_" + "x" * 60, "typography": default_typography},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_invalid_typography_family(self, auth_headers, default_typography):
        bad = copy.deepcopy(default_typography)
        bad['hero']['family'] = 'Comic Sans MS'
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_BadFamily", "typography": bad},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_invalid_typography_color(self, auth_headers, default_typography):
        bad = copy.deepcopy(default_typography)
        bad['hero']['color'] = 'red'
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_BadColor", "typography": bad},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_invalid_typography_size(self, auth_headers, default_typography):
        bad = copy.deepcopy(default_typography)
        bad['hero']['desktop'] = 9999
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_BadSize", "typography": bad},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_reject_extra_field_in_typography(self, auth_headers, default_typography):
        bad = copy.deepcopy(default_typography)
        bad['hero']['bogus'] = 'x'
        r = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_Extra", "typography": bad},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 422

    def test_duplicate_name_case_insensitive_returns_409(self, auth_headers, default_typography):
        _delete_created_presets(auth_headers)
        base = {"name": "TEST_Duplicate", "typography": default_typography}
        r1 = requests.post(f"{API}/typography-presets", json=base, headers=auth_headers, timeout=15)
        assert r1.status_code == 201
        r2 = requests.post(f"{API}/typography-presets",
                           json={"name": "test_duplicate", "typography": default_typography},
                           headers=auth_headers, timeout=15)
        assert r2.status_code == 409


class TestPresetRename:
    def test_rename_ok_keeps_snapshot(self, auth_headers, default_typography):
        _delete_created_presets(auth_headers)
        c = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_Rename_Src", "typography": default_typography},
                          headers=auth_headers, timeout=15)
        assert c.status_code == 201
        preset_id = c.json()['id']
        original_typo = c.json()['typography']

        r = requests.patch(f"{API}/typography-presets/{preset_id}",
                           json={"name": "TEST_Rename_Dst"}, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data['name'] == "TEST_Rename_Dst"
        assert data['typography'] == original_typo
        assert data['id'] == preset_id

    def test_rename_duplicate_returns_409(self, auth_headers, default_typography):
        _delete_created_presets(auth_headers)
        a = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_A", "typography": default_typography},
                          headers=auth_headers, timeout=15).json()
        b = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_B", "typography": default_typography},
                          headers=auth_headers, timeout=15).json()
        r = requests.patch(f"{API}/typography-presets/{b['id']}",
                           json={"name": "test_a"}, headers=auth_headers, timeout=15)
        assert r.status_code == 409

    def test_rename_invalid_id_returns_404(self, auth_headers):
        r = requests.patch(f"{API}/typography-presets/not-a-valid-id",
                           json={"name": "TEST_x"}, headers=auth_headers, timeout=15)
        assert r.status_code == 404

    def test_rename_missing_id_returns_404(self, auth_headers):
        r = requests.patch(f"{API}/typography-presets/507f1f77bcf86cd799439099",
                           json={"name": "TEST_ghost"}, headers=auth_headers, timeout=15)
        assert r.status_code == 404

    def test_rename_extra_field_rejected(self, auth_headers, default_typography):
        c = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_RenameExtra", "typography": default_typography},
                          headers=auth_headers, timeout=15)
        preset_id = c.json()['id']
        r = requests.patch(f"{API}/typography-presets/{preset_id}",
                           json={"name": "TEST_RenameExtra2", "typography": default_typography},
                           headers=auth_headers, timeout=15)
        assert r.status_code == 422


class TestPresetDelete:
    def test_delete_only_target(self, auth_headers, default_typography, theme_backup_and_cleanup):
        _delete_created_presets(auth_headers)
        a = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_Del_A", "typography": default_typography},
                          headers=auth_headers, timeout=15).json()
        b = requests.post(f"{API}/typography-presets",
                          json={"name": "TEST_Del_B", "typography": default_typography},
                          headers=auth_headers, timeout=15).json()

        r = requests.delete(f"{API}/typography-presets/{a['id']}", headers=auth_headers, timeout=15)
        assert r.status_code == 200

        # a gone, b remains
        lst = requests.get(f"{API}/typography-presets", headers=auth_headers, timeout=15).json()
        names = [p['name'] for p in lst]
        assert "TEST_Del_A" not in names
        assert "TEST_Del_B" in names

        # theme unchanged
        theme_now = requests.get(f"{API}/theme", timeout=15).json()
        assert theme_now == theme_backup_and_cleanup

    def test_delete_invalid_id_returns_404(self, auth_headers):
        r = requests.delete(f"{API}/typography-presets/not-an-id", headers=auth_headers, timeout=15)
        assert r.status_code == 404

    def test_delete_missing_id_returns_404(self, auth_headers):
        r = requests.delete(f"{API}/typography-presets/507f1f77bcf86cd799439099",
                            headers=auth_headers, timeout=15)
        assert r.status_code == 404

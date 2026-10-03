"""Post-implementation preservation regression tests for /api/theme + /api/live-edits.

These tests verify the FIX for iteration_11's reproduced bugs:
  * PUT /api/theme with a subset of top-level keys must NOT clobber unspecified
    top-level fields (brand/royal/pageBg/headingFont/bodyFont) nor unspecified
    typography categories.
  * PUT /api/theme with an empty body must be a no-op (not a reset).
  * PUT /api/theme with an explicit empty-string color resets ONLY that slot.
  * Invalid values still 422 and do not corrupt DB.
  * live_edits round-trip persists across independent GETs.

The suite mutates shared /api/theme state; keep it serial. The module-scope
`restore_theme` fixture snapshots the pre-suite theme and restores it in teardown.
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
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return {"Authorization": f"Bearer {r.json()['access_token']}", "Content-Type": "application/json"}


@pytest.fixture(scope='module', autouse=True)
def restore_theme(admin_headers):
    original = requests.get(f"{API}/theme", timeout=15).json()
    snapshot = copy.deepcopy(original)
    yield snapshot
    r = requests.put(f"{API}/theme", json=snapshot, headers=admin_headers, timeout=20)
    assert r.status_code == 200, f"theme restore failed: {r.status_code} {r.text}"


# ---- Baseline (existing behaviour still intact) ------------------------------
class TestPreviewDefaults:
    def test_theme_returns_full_shape(self):
        r = requests.get(f"{API}/theme", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ("brand", "royal", "accent", "pageBg", "headingFont", "bodyFont", "typography"):
            assert k in d, f"missing key {k}"
        for cat in ('header', 'hero', 'section', 'subheading', 'body', 'small', 'eyebrow'):
            assert cat in d['typography']
            for f in ('family', 'mobile', 'tablet', 'desktop', 'weight', 'color', 'darkColor', 'lineHeight', 'letterSpacing', 'style'):
                assert f in d['typography'][cat]

    def test_live_edits_unseeded_path_is_empty_list(self):
        r = requests.get(f"{API}/live-edits", params={"path": "/__no_such_path_used_in_repro__"}, timeout=15)
        assert r.status_code == 200
        assert r.json() == []


# ---- Preservation regressions -----------------------------------------------
class TestPartialThemePreserves:
    """After the fix, partial PUT /api/theme must merge, not replace."""

    UNIQUE_COLOR = '#abcdef'
    UNIQUE_SIZE = 51

    def test_accent_only_preserves_typography_and_other_colors(self, admin_headers, restore_theme):
        # 1. Author a unique hero style AND explicit brand/royal/pageBg.
        baseline = copy.deepcopy(restore_theme)
        baseline['brand'] = '#123456'
        baseline['royal'] = '#654321'
        baseline['pageBg'] = '#f0f0f0'
        baseline['typography']['hero']['color'] = self.UNIQUE_COLOR
        baseline['typography']['hero']['desktop'] = self.UNIQUE_SIZE
        baseline['typography']['body']['color'] = '#222233'
        r = requests.put(f"{API}/theme", json=baseline, headers=admin_headers, timeout=20)
        assert r.status_code == 200, r.text

        # 2. Partial PUT: only accent.
        r = requests.put(f"{API}/theme", json={"accent": "#ff0088"}, headers=admin_headers, timeout=20)
        assert r.status_code == 200, r.text
        merged = r.json()

        # 3. Fresh GET from a new session.
        after = requests.get(f"{API}/theme", timeout=15).json()

        # accent was updated, everything else preserved.
        for got in (merged, after):
            assert got['accent'] == '#ff0088'
            assert got['brand'] == '#123456'
            assert got['royal'] == '#654321'
            assert got['pageBg'] == '#f0f0f0'
            assert got['typography']['hero']['color'].lower() == self.UNIQUE_COLOR
            assert got['typography']['hero']['desktop'] == self.UNIQUE_SIZE
            assert got['typography']['body']['color'].lower() == '#222233'

    def test_partial_typography_category_preserves_other_categories(self, admin_headers, restore_theme):
        base = copy.deepcopy(restore_theme)
        base['typography']['hero']['color'] = '#111111'
        base['typography']['hero']['desktop'] = 47
        base['typography']['section']['color'] = '#222222'
        base['typography']['section']['desktop'] = 33
        r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
        assert r.status_code == 200

        # Partial: only update section.color; hero must not regress.
        # Backend requires TypeStyle fields when a category is present -- send full section only.
        section_full = dict(base['typography']['section'], color='#333333')
        r = requests.put(f"{API}/theme",
                         json={"typography": {"section": section_full}},
                         headers=admin_headers, timeout=20)
        assert r.status_code == 200, r.text

        after = requests.get(f"{API}/theme", timeout=15).json()
        assert after['typography']['section']['color'].lower() == '#333333'
        # hero untouched.
        assert after['typography']['hero']['color'].lower() == '#111111'
        assert after['typography']['hero']['desktop'] == 47

    def test_empty_body_is_noop(self, admin_headers, restore_theme):
        base = copy.deepcopy(restore_theme)
        base['brand'] = '#aa11aa'
        base['typography']['hero']['color'] = '#bbccdd'
        base['typography']['hero']['desktop'] = 48
        r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
        assert r.status_code == 200

        r = requests.put(f"{API}/theme", json={}, headers=admin_headers, timeout=20)
        assert r.status_code == 200
        after = requests.get(f"{API}/theme", timeout=15).json()
        assert after['brand'] == '#aa11aa'
        assert after['typography']['hero']['color'].lower() == '#bbccdd'
        assert after['typography']['hero']['desktop'] == 48

    def test_explicit_empty_color_resets_only_that_slot(self, admin_headers, restore_theme):
        base = copy.deepcopy(restore_theme)
        base['brand'] = '#aa11aa'
        base['accent'] = '#bb22bb'
        r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
        assert r.status_code == 200

        # Explicitly clear only brand.
        r = requests.put(f"{API}/theme", json={"brand": ""}, headers=admin_headers, timeout=20)
        assert r.status_code == 200
        after = requests.get(f"{API}/theme", timeout=15).json()
        assert after['brand'] == ''
        # accent survived.
        assert after['accent'] == '#bb22bb'

    def test_invalid_value_422_and_does_not_mutate(self, admin_headers, restore_theme):
        base = copy.deepcopy(restore_theme)
        base['brand'] = '#010203'
        r = requests.put(f"{API}/theme", json=base, headers=admin_headers, timeout=20)
        assert r.status_code == 200

        # Now send invalid hex.
        r = requests.put(f"{API}/theme", json={"brand": "notahex"}, headers=admin_headers, timeout=20)
        assert r.status_code == 422
        after = requests.get(f"{API}/theme", timeout=15).json()
        assert after['brand'] == '#010203', "invalid PUT should not mutate DB"


# ---- Live-edits round-trip (unchanged behaviour) -----------------------------
class TestLiveEditPersistenceAcrossReads:
    TEST_PATH = '/__persist_repro__'
    TEST_SEL = 'h1.__persist_repro_h1__'

    def test_saved_edit_readback(self, admin_headers):
        try:
            r = requests.put(
                f"{API}/live-edits",
                json={"path": self.TEST_PATH, "selector": self.TEST_SEL,
                      "label": "Repro H1", "props": {"text": "REPRO", "color": "#ff0000", "fontSize": 42}},
                headers=admin_headers, timeout=20,
            )
            assert r.status_code == 200, r.text
            items = requests.get(f"{API}/live-edits", params={"path": self.TEST_PATH}, timeout=15).json()
            match = [i for i in items if i['selector'] == self.TEST_SEL]
            assert len(match) == 1
            assert match[0]['props']['text'] == 'REPRO'
            assert match[0]['props']['color'] == '#ff0000'
            assert match[0]['props']['fontSize'] == 42
        finally:
            requests.delete(f"{API}/live-edits",
                            params={"path": self.TEST_PATH, "selector": self.TEST_SEL},
                            headers=admin_headers, timeout=15)

    def test_partial_update_only_affects_target_selector(self, admin_headers):
        # Two independent selectors under the same path; updating one must not affect the other.
        path = '/__persist_repro_iso__'
        sel_a = 'h1.__iso_a__'
        sel_b = 'h1.__iso_b__'
        try:
            requests.put(f"{API}/live-edits",
                         json={"path": path, "selector": sel_a, "props": {"text": "A1", "color": "#111111"}},
                         headers=admin_headers, timeout=15)
            requests.put(f"{API}/live-edits",
                         json={"path": path, "selector": sel_b, "props": {"text": "B1", "color": "#222222"}},
                         headers=admin_headers, timeout=15)
            # Update only A.
            requests.put(f"{API}/live-edits",
                         json={"path": path, "selector": sel_a, "props": {"text": "A2", "color": "#111111"}},
                         headers=admin_headers, timeout=15)
            items = {i['selector']: i for i in requests.get(f"{API}/live-edits", params={"path": path}, timeout=15).json()}
            assert items[sel_a]['props']['text'] == 'A2'
            assert items[sel_b]['props']['text'] == 'B1'
            assert items[sel_b]['props']['color'] == '#222222'
        finally:
            requests.delete(f"{API}/live-edits", params={"path": path}, headers=admin_headers, timeout=15)

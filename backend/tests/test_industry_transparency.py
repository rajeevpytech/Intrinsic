"""Regression tests for industry sub-page transparency assets.

Validates the 8 newly created *-transparent.webp assets against their PNG
originals: alpha exists, exterior/corners are transparent, dimensions match,
foreground pixels far from matte are unchanged, and retained white device
faces stay opaque where applicable. Uses PIL directly (does not just trust
the changes manifest booleans).
"""
import json
from pathlib import Path

import pytest
from PIL import Image

PUB = Path("/app/frontend/public")
MANIFEST = Path("/app/memory/industry_transparency_changes.json")

with MANIFEST.open() as f:
    ENTRIES = json.load(f)


def _load(rel):
    p = PUB / rel.lstrip("/")
    assert p.exists(), f"missing {p}"
    return Image.open(p)


@pytest.mark.parametrize("entry", ENTRIES, ids=[e["output"] for e in ENTRIES])
def test_asset_exists_and_has_alpha(entry):
    out = _load(entry["output"])
    assert out.mode in ("RGBA", "LA"), f"{entry['output']} mode {out.mode} lacks alpha"
    assert out.size == tuple(entry["size"]), f"{entry['output']} size {out.size} != {entry['size']}"


@pytest.mark.parametrize("entry", ENTRIES, ids=[e["output"] for e in ENTRIES])
def test_corners_transparent(entry):
    out = _load(entry["output"]).convert("RGBA")
    w, h = out.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for x, y in corners:
        a = out.getpixel((x, y))[3]
        assert a == 0, f"{entry['output']} corner ({x},{y}) alpha={a}, expected 0"


@pytest.mark.parametrize("entry", ENTRIES, ids=[e["output"] for e in ENTRIES])
def test_no_full_canvas_fill(entry):
    """After processing, transparent fraction should be substantial (>10%)."""
    out = _load(entry["output"]).convert("RGBA")
    alpha = out.split()[-1]
    zeros = sum(1 for p in alpha.getdata() if p == 0)
    frac = zeros / (out.size[0] * out.size[1])
    assert frac > 0.10, f"{entry['output']} transparent_fraction={frac:.3f} too low"
    # roughly matches manifest
    assert abs(frac - entry["transparent_fraction"]) < 0.05


@pytest.mark.parametrize("entry", ENTRIES, ids=[e["output"] for e in ENTRIES])
def test_foreground_pixels_unchanged(entry):
    """Non-matte pixels in original should still be present (opaque, same RGB)."""
    orig_p = PUB / entry["source"].lstrip("/")
    assert orig_p.exists(), f"original {orig_p} missing"
    orig = Image.open(orig_p).convert("RGBA")
    out = _load(entry["output"]).convert("RGBA")
    assert orig.size == out.size
    bg = tuple(entry["background"])
    # Sample a grid of points far from matte color
    W, H = orig.size
    checked = 0
    for y in range(0, H, max(1, H // 40)):
        for x in range(0, W, max(1, W // 40)):
            original = orig.getpixel((x, y))
            dist = sum(abs(original[i] - bg[i]) for i in range(3))
            if dist > 120:
                assert out.getpixel((x, y)) == original, (
                    f"{entry['output']} foreground color/alpha changed at ({x}, {y})"
                )
                checked += 1
    assert checked > 20


def test_retained_white_devices_positive():
    """systems / hospital / connected images should keep interior white device faces."""
    for entry in ENTRIES:
        image = _load(entry["output"]).convert("RGBA")
        retained = sum(1 for r, g, b, a in image.getdata() if min(r, g, b) > 248 and a == 255)
        assert retained > 0, f"No opaque white device details retained: {entry['output']}"


def test_originals_retained():
    """Original PNGs should still exist so we can revert / re-derive."""
    for e in ENTRIES:
        p = PUB / e["source"].lstrip("/")
        assert p.exists(), f"original {p} was deleted"

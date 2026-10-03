"""Regression tests for /services/cloud hero transparency asset.

Validates cloud-hero-transparent.webp against cloud-hero-new.png:
- Same dimensions, RGBA with real alpha channel.
- Corners and vast exterior are fully transparent (real alpha, not opacity).
- Inside empty cloud areas transparent.
- Representative opaque foreground pixels (blue towers/outline, white device
  faces, amber nodes, green server panel) remain retained and unchanged.
- Original asset untouched.
"""
from pathlib import Path

import pytest
from PIL import Image

PUB = Path("/app/frontend/public/images")
ORIG = PUB / "cloud-hero-new.png"
OUT = PUB / "cloud-hero-transparent.webp"


@pytest.fixture(scope="module")
def orig():
    return Image.open(ORIG).convert("RGB")


@pytest.fixture(scope="module")
def out():
    return Image.open(OUT)


def test_originals_retained():
    assert ORIG.exists(), "original cloud-hero-new.png missing"


def test_output_exists_and_rgba(out):
    assert out.mode == "RGBA"


def test_dimensions_match_native(orig, out):
    assert orig.size == out.size == (1922, 818)


def test_corners_transparent(out):
    w, h = out.size
    for x, y in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        a = out.getpixel((x, y))[3]
        assert a == 0, f"corner ({x},{y}) alpha={a}"


def test_left_blank_region_transparent(out):
    # Left half is empty sky in original; must be transparent (not opacity).
    for x in range(0, 800, 100):
        for y in range(0, 800, 100):
            a = out.getpixel((x, y))[3]
            assert a == 0, f"left ({x},{y}) alpha={a} should be 0"


def test_transparent_fraction_large(out):
    alpha = out.split()[-1]
    zeros = sum(1 for p in alpha.getdata() if p == 0)
    frac = zeros / (out.size[0] * out.size[1])
    assert frac > 0.5, f"transparent_fraction={frac:.3f} too low"


def test_inside_empty_cloud_transparent(out):
    # Sample patches at cloud interior (above shield, between documents) and
    # verify some transparency exists (not fully opaque).
    zeros = 0
    total = 0
    for cx, cy in [(1150, 260), (1500, 260), (1327, 260)]:
        for dy in range(-20, 20, 2):
            for dx in range(-20, 20, 2):
                total += 1
                if out.getpixel((cx + dx, cy + dy))[3] == 0:
                    zeros += 1
    assert zeros > 100, f"cloud interior has too few transparent samples: {zeros}/{total}"


def test_representative_opaque_pixels_retained(out):
    # These coordinates correspond to key illustration objects that must remain
    # visible & opaque after transparency processing.
    key_points = {
        "amber_node_left": (899, 316),
        "amber_node_top": (1328, 140),
        "amber_node_right": (1765, 314),
        "amber_node_bottom": (1328, 710),
        "left_document_face": (1135, 470),
        "middle_document_face": (1477, 470),
        "right_document_face": (1629, 470),
        "green_server_panel": (1378, 617),
    }
    for name, (x, y) in key_points.items():
        px = out.getpixel((x, y))
        assert px[3] == 255, f"{name} at ({x},{y}) not opaque: alpha={px[3]}"


def test_foreground_rgb_matches_original(orig, out):
    """Opaque pixels should keep original artwork colors (not zeroed)."""
    key_points = [
        (899, 316), (1328, 140), (1765, 314), (1328, 710),
        (1135, 470), (1477, 470), (1629, 470), (1378, 617),
    ]
    for x, y in key_points:
        op = orig.getpixel((x, y))
        rp = out.getpixel((x, y))
        assert op == rp[:3], f"({x},{y}) orig={op} out={rp}"


def test_no_full_canvas_opacity_hack(out):
    """If someone lowered global opacity, we'd see uniform semi-transparent pixels
    across many locations. Ensure alpha values are polarised (mostly 0 or 255)."""
    alpha = out.split()[-1]
    hist = alpha.histogram()
    total = sum(hist)
    polar = hist[0] + hist[255]
    ratio = polar / total
    assert ratio > 0.9, f"alpha not polarised (opacity hack?), 0/255 fraction={ratio:.3f}"

"""Extract the supplied Cloud illustration without its baked-in sky/landscape.

Keep the original canvas so CloudHome's existing motion coordinates stay aligned.
Device faces and the green server panel are artwork, not background to erase.
Run from any directory; requires the existing Pillow and numpy dependencies.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
IMAGES = ROOT / "frontend/public/images"


def main():
    source = Image.open(IMAGES / "cloud-hero-new.png").convert("RGB")
    rgb = np.asarray(source, dtype=np.float32)
    height, width = rgb.shape[:2]

    # The foreground's saturated blue is distinct from the pale blue sky/waves.
    alpha = np.clip((rgb[:, :, 2] - rgb[:, :, 0] - 75) / 45, 0, 1)
    background = np.asarray(source.filter(ImageFilter.MaxFilter(9)), dtype=np.float32)
    foreground = np.clip(
        (rgb - (1 - alpha[:, :, None]) * background) / np.maximum(alpha[:, :, None], 0.001),
        0, 255,
    )

    # Retain thin vertical connections, estimating their local matte from either side.
    for x, top in [(918, 235), (961, 466), (1076, 0), (1328, 36), (1594, 0), (1813, 0)]:
        left = rgb[:, x - 10:x - 7].mean(axis=1)
        right = rgb[:, x + 8:x + 11].mean(axis=1)
        matte = (left + right) / 2
        for column in range(x - 2, x + 3):
            pixel = rgb[:, column]
            line_alpha = np.clip((np.max(np.abs(pixel - matte), axis=1) - 2) / 65, 0, 1)
            line_alpha[:top] = 0
            use = line_alpha > alpha[:, column]
            line_rgb = np.clip(
                (pixel - (1 - line_alpha[:, None]) * matte) / np.maximum(line_alpha[:, None], 0.001),
                0, 255,
            )
            foreground[use, column] = line_rgb[use]
            alpha[use, column] = line_alpha[use]

    # Preserve original pixels in solid illustrated objects, including white faces.
    objects = Image.new("L", (width, height))
    draw = ImageDraw.Draw(objects)
    for box in [
        (1042, 419, 1228, 518),       # left document
        (1427, 419, 1527, 518),       # middle document
        (1546, 419, 1712, 518),       # right document
        (1077, 552, 1679, 683),       # green server enclosure / equipment
    ]:
        draw.rectangle(box, fill=255)
    # The shield outline and white face (not the blue square behind it).
    draw.polygon([
        (1328, 420), (1342, 427), (1363, 432), (1362, 452),
        (1357, 471), (1348, 487), (1328, 502), (1310, 490),
        (1298, 475), (1291, 455), (1292, 433), (1314, 428),
    ], fill=255)
    for x, y, radius in [
        (899, 316, 12), (1328, 140, 13), (1765, 314, 13), (1328, 710, 14),
        (918, 547, 7), (961, 467, 8), (1076, 235, 8), (1076, 362, 8),
        (1328, 209, 10), (1328, 344, 9), (1328, 393, 9),
        (1328, 522, 10), (1328, 551, 10), (1594, 116, 9),
        (1594, 362, 8), (1594, 521, 8), (1813, 198, 6),
        (1813, 403, 8), (1813, 656, 8),
    ]:
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=255)

    protected = np.asarray(objects) > 0
    foreground[protected] = rgb[protected]
    alpha[protected] = 1
    result = np.dstack((foreground, np.rint(alpha * 255))).astype(np.uint8)
    result[result[:, :, 3] == 0, :3] = 0
    image = Image.fromarray(result, "RGBA")
    destination = IMAGES / "cloud-hero-transparent.webp"
    image.save(destination, lossless=True, exact=True)
    print(f"Saved {destination.name}: {image.size}, {(alpha == 0).mean():.1%} transparent")


if __name__ == "__main__":
    main()

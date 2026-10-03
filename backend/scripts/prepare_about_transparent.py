"""Make the About page process + industries graphics transparent.

Both source assets are animated GIFs with a solid background matte
(process = near-white, industries = muted green #526f68). We remove ONLY the
background matte that is connected to the frame edges (flood fill), so interior
artwork (e.g. white "MANAGEMENT" text on a dark-green box, white lines, orange
dots) is preserved. Output is an animated WebP with a real alpha channel so the
section background colour shows through. Originals are kept.
"""
import os
import numpy as np
from PIL import Image, ImageDraw

BASE = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "images", "about")
SENTINEL = (255, 0, 255)  # magenta marker, not present in the artwork


def coalesce_frames(path):
    im = Image.open(path)
    frames, durations = [], []
    try:
        n = im.n_frames
    except Exception:
        n = 1
    for i in range(n):
        im.seek(i)
        frames.append(im.convert("RGBA"))
        durations.append(im.info.get("duration", 80))
    return frames, durations


def strip_matte(frame, thresh):
    rgb = frame.convert("RGB")
    w, h = rgb.size
    marker = rgb.copy()
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for s in seeds:
        ImageDraw.floodfill(marker, s, SENTINEL, thresh=thresh)
    marr = np.array(marker)
    bg = (marr[:, :, 0] == SENTINEL[0]) & (marr[:, :, 1] == SENTINEL[1]) & (marr[:, :, 2] == SENTINEL[2])
    arr = np.array(rgb)
    alpha = np.where(bg, 0, 255).astype("uint8")
    out = np.dstack([arr, alpha])
    return Image.fromarray(out, "RGBA")


def process(src_name, out_name, thresh):
    src = os.path.join(BASE, src_name)
    frames, durations = coalesce_frames(src)
    cleaned = [strip_matte(f, thresh) for f in frames]
    out = os.path.join(BASE, out_name)
    cleaned[0].save(
        out, format="WEBP", save_all=True, append_images=cleaned[1:],
        duration=durations, loop=0, lossless=True, disposal=2, quality=100,
    )
    # report transparency on the first fully-revealed (last) frame
    last = np.array(cleaned[-1])
    transparent = 100.0 * (last[:, :, 3] == 0).sum() / (last.shape[0] * last.shape[1])
    print(f"{out_name}: {len(cleaned)} frames, {last.shape[1]}x{last.shape[0]}, "
          f"{transparent:.1f}% transparent on final frame")


if __name__ == "__main__":
    process("operational-process.gif", "operational-process-transparent.webp", thresh=42)
    process("supported-industries.gif", "supported-industries-transparent.webp", thresh=46)

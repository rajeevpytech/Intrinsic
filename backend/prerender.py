#!/usr/bin/env python3
"""Static prerenderer for public marketing pages.

Reuses the SAME request-time renderer as /api/ssr (ssr_render.render) to emit
real, page-specific initial HTML for every indexable public route into the
frontend build directory:

    build/index.html                      ->  /
    build/<route>/index.html              ->  /<route>
    build/404.html                        ->  genuine 404 body

This gives a deployment path that works even behind a plain SPA nginx
(`try_files $uri $uri/ /index.html;`): the per-route file is served directly,
so visitors AND crawlers get complete content before any JavaScript. React then
mounts on #root and takes over (createRoot().render replaces the shell — no
hydration mismatch, no layout change).

Run after every `yarn build` and on every admin publish so the static HTML never
goes stale:

    python3 backend/prerender.py --build-dir frontend/build

Routes/content/SEO come from the live DB + ssr.ROUTES, identical to the SSR
endpoint, so there is a single source of truth.
"""
from __future__ import annotations
import argparse
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ssr_render  # noqa: E402
from ssr import normalize  # noqa: E402

ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

# Mirrors server.SEO_STATIC_ROUTES + server.DEFAULT_SEO (single source for defaults
# lives in server.py; we import lazily to avoid booting the whole FastAPI app).
from server import SEO_STATIC_ROUTES, DEFAULT_SEO, _slugify_py  # noqa: E402


async def _seo_settings(db) -> dict:
    doc = await db.settings.find_one({"key": "seo"}, {"_id": 0, "key": 0}) or {}
    merged = {**DEFAULT_SEO, **doc}
    merged["organization"] = {**DEFAULT_SEO["organization"], **(doc.get("organization") or {})}
    merged["geo"] = {**DEFAULT_SEO["geo"], **(doc.get("geo") or {})}
    merged["pages"] = doc.get("pages") or {}
    return merged


async def _all_routes(db) -> list[str]:
    routes = list(SEO_STATIC_ROUTES)
    async for c in db.case_studies.find({}, {"title": 1}):
        slug = _slugify_py(c.get("title", ""))
        if slug:
            routes.append(f"/case-studies/{slug}")
    async for b in db.blogs.find({"published": True}, {"title": 1}):
        slug = _slugify_py(b.get("title", ""))
        if slug:
            routes.append(f"/blog/{slug}")
    async for j in db.jobs.find({"published": True}, {"slug": 1}):
        if j.get("slug"):
            routes.append(f"/careers/{j['slug']}")
    seen, out = set(), []
    for r in routes:
        if r not in seen:
            seen.add(r)
            out.append(r)
    return out


def _out_path(build: Path, route: str) -> Path:
    route = normalize(route)
    if route == "/":
        return build / "index.html"
    return build / route.strip("/") / "index.html"


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--build-dir", default=str(ROOT_DIR.parent / "frontend" / "build"))
    args = ap.parse_args()
    build = Path(args.build_dir).resolve()
    index = build / "index.html"
    pristine = build / ".prerender-template.html"
    if not index.exists() and not pristine.exists():
        print(f"ERROR: {index} not found — run `yarn build` first.", file=sys.stderr)
        return 2
    # Always render from the PRISTINE post-build template, never from an already-rendered
    # file (which would duplicate head tags and corrupt the #root body on re-run). Cache it
    # on first use so repeat runs (e.g. on every admin publish) stay idempotent.
    if pristine.exists():
        template = pristine.read_text(encoding="utf-8")
    else:
        template = index.read_text(encoding="utf-8").replace("%PUBLIC_URL%", "")
        pristine.write_text(template, encoding="utf-8")

    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    try:
        seo = await _seo_settings(db)
        routes = await _all_routes(db)
        written, skipped = 0, 0
        for route in routes:
            res = await ssr_render.render(route, host="", db=db, seo=seo, template=template)
            if res["status"] != 200:
                skipped += 1
                continue
            dest = _out_path(build, route)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(res["html"], encoding="utf-8")
            written += 1
        # Genuine 404 body (nginx: error_page 404 /404.html;)
        notfound = await ssr_render.render("/__prerender_404__", host="", db=db, seo=seo, template=template)
        (build / "404.html").write_text(notfound["html"], encoding="utf-8")
        print(f"Prerendered {written} pages (skipped {skipped} non-200) + 404.html into {build}")
        return 0
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))

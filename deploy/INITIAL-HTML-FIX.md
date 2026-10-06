# Fixing the empty-`#root` initial HTML on intrinsicamerica.com

## 1. Diagnosis (production serving path)
A request to any public page on production is answered by the **CRA build's shared
`frontend/build/index.html`** (the SPA fallback). That file is exactly **8,578 bytes** with an
empty `<div id="root"></div>` — the same size/shape reported for `/`, `/services/cybersecurity`,
`/industries/healthcare` and `/contact`, and for Googlebot. So production nginx is serving the
shared shell for every route and is **not** routing to the existing SSR endpoint (`/api/ssr`) nor
to any per-route prerendered file. Nothing in the app is broken — the HTML layer simply isn't wired.

The repo already contains a correct request-time renderer (`backend/ssr.py` + `backend/ssr_render.py`,
exposed at `GET /api/ssr`) that returns full, page-specific HTML. The fix is to make production
serve that real HTML. Two supported, non-visual ways (pick one):

## 2. Option A — SSR proxy (recommended, always fresh)
`deploy/nginx-intrinsic.conf` proxies every HTML page request to `/api/ssr` (which renders from the
live DB, so admin edits appear immediately) and returns 301 / 404 / 410 correctly. Static assets,
`/api`, uploads, and `/admin` keep their own locations. Requires the FastAPI backend running on
127.0.0.1:8000.

Deploy: `sudo bash deploy/deploy-vps.sh` (backs up, copies backend SSR files + nginx site,
`nginx -t`, reloads nginx, restarts backend; prints rollback).

## 3. Option B — static prerender (works behind a plain SPA nginx, no SSR upstream)
`backend/prerender.py` reuses the SAME renderer to write real per-route files into the build:
```
build/index.html                     ->  /
build/<route>/index.html             ->  /<route>   (46 routes from the live sitemap)
build/404.html                       ->  genuine 404 body
```
Run it right after every build and on every admin publish (so static HTML never goes stale):
```bash
cd /var/www/intrinsic/current
yarn --cwd frontend build
python3 backend/prerender.py --build-dir frontend/build
```
nginx for Option B (serve the per-route file, real 404 for unknown, SPA takes over on mount):
```nginx
root /var/www/intrinsic/current/frontend/build;
index index.html;
location / { try_files $uri $uri/index.html =404; }
error_page 404 /404.html;
# keep: location /api/ { proxy_pass http://127.0.0.1:8000; }  location = /sitemap.xml { proxy_pass .../api/sitemap.xml; }  location = /robots.txt { ... }
# keep long-cache for /static/, and X-Robots-Tag noindex for /admin
```

### Keeping it in sync (requirement 5)
- Option A: automatic — HTML is rendered per request from the DB.
- Option B: wire the admin "Publish" action (or a post-publish hook) to re-run `prerender.py` and
  flip the release symlink. The symlink only flips on success, so a failed regen keeps the last good copy.

## 4. Verified in the Emergent workspace (no JS executed)
- Fresh `build/index.html` == 8,578 bytes (matches the production shell — confirms the diagnosis).
- `prerender.py` wrote **46 per-route pages + 404.html**; raw-file audit: 0 empty roots, **unique titles
  (no duplicates)**, self-referencing apex canonical + og:url on every page, route-specific `<h1>`,
  >=1 parseable JSON-LD per page, JS bundle preserved so React mounts.
- Browser: served the prerendered build and loaded `/services/cybersecurity/` directly — React mounted
  the full styled page with no layout change (createRoot replaces `#root`; no hydration mismatch).

## 5. Production verification — PENDING (needs VPS access)
The Emergent workspace cannot reach the VPS, so production is not yet changed. After deploying, run:
```bash
curl -sI https://www.intrinsicamerica.com/              # 301 -> https://intrinsicamerica.com/
curl -s  https://intrinsicamerica.com/services/cybersecurity | grep -o '<title>[^<]*</title>'
curl -s  https://intrinsicamerica.com/services/cybersecurity | grep -o '<h1>[^<]*</h1>'
curl -sI https://intrinsicamerica.com/this-does-not-exist   # 404 (not 200 homepage)
```
Only mark the issue FIXED once the live domain returns per-route HTML (not the 8,578-byte shell).

## 6. Rollback
- Option A: `sudo bash deploy/deploy-vps.sh --rollback` (or restore the printed backup dir + reload nginx).
- Option B: flip the `current` symlink back to the previous `releases/<ts>` and `sudo systemctl reload nginx`.

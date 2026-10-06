# Styled initial HTML, asset routing and deployment (Intrinsic VPS)

## What visitors and crawlers receive
- Every public sitemap route: the **actual React page** (real DOM, CSS, live edits, current content,
  page-specific title / description / canonical / H1 / JSON-LD), produced by
  `frontend/scripts/prerender-styled.cjs` from the production build and live public API data.
  Served by `/api/ssr` (`backend/styled_pages.py`) for the exact path, trailing slash and query variants.
- Interactive startup: `static/js/prerender-boot.js` keeps that styled page visible, mounts React in a hidden
  `#root`, waits for its public API calls and finite entrance animations, then swaps in one frame
  (transitions suppressed via `html.pr-swap`). Saved live edits / theme / custom CSS are embedded in the page
  (`window.__INTRINSIC_PUBLIC_DATA__`) so React's first render already carries them.
- Unknown URLs: HTTP 404 with the styled "page not found" page (`build/.styled-404.html`), `noindex`.
- `/admin*`: SPA shell, `X-Robots-Tag: noindex, nofollow`, `no-store`.
- A public route with no snapshot yet (e.g. a brand-new case study): the real React shell with the SEO head;
  the simplified text exists only inside `<noscript>`; a background regeneration is queued.
- `HEAD` is answered for pages and crawler files (was 405).

## Freshness after admin publishing
`backend/styled_refresh.py`: any successful admin write to live edits/blocks, content, site content, theme,
custom CSS, SEO, typography or import schedules a debounced (20 s) regeneration of all styled pages, written
atomically into the live build. Old pages stay served until each new page is written; failures are logged and
leave the previous pages in place. Requires the tooling installed by the deploy script at
`/var/cache/intrinsic-prerender` (Playwright + Chromium) and `node` on the service PATH.
Env (optional): `STYLED_REFRESH=0` disables, `STYLED_REFRESH_DELAY`, `STYLED_PRERENDER_TOOLS`,
`STYLED_REFRESH_API_ORIGIN` (default `http://127.0.0.1:8000`), `FRONTEND_BUILD_DIR`.

`backend/prerender.py` (old plain-text prerender) is retired and refuses to run.

## Uploaded images
Root cause of the 404s: nginx's static-extension regex location took precedence over the plain
`location /api/` prefix, so `/api/files/...png|svg` never reached FastAPI. Fix: `location ^~ /api/`.
Backend fallback if an object is missing from storage: exact original bytes from
`backend/seed_data/site_export.json`; for a header/footer logo edit whose file is unrecoverable, the approved
project logo (`logo-navy.png` / `logo-white.png`). No uploads or DB records are changed.

## nginx rules (see `nginx-intrinsic.conf`)
- `location ^~ /api/` → FastAPI.
- `location = /robots.txt|/sitemap.xml|/llms.txt` → FastAPI-generated files.
- Static extensions: `try_files $uri =404` (never the HTML SSR handler).
- HTML: `rewrite ^ /api/ssr break; proxy_pass http://127.0.0.1:8000;` + `X-Original-URI`
  (a `proxy_pass .../api/ssr` URI inside `location /` would splice paths: `/about` → `/api/ssrabout`).

## Deploy
`sudo bash /var/www/intrinsic/deploy/update-styled-vps.sh <branch>` — staged build with
`REACT_APP_BACKEND_URL=https://intrinsicamerica.com`, `/undefined/api` guard, prerender + browser verification
of the staged build, minimal in-place nginx patch (keeps SSL), `nginx -t`, atomic build swap, service restart,
health checks, live checks of every sitemap route through local nginx with TLS/SNI, automatic rollback
(build, nginx site, git commit, service) on any failure. Backups: `/var/backups/intrinsic/deploy-*`.

## Verification tooling
- `frontend/scripts/verify-styled.cjs` — staged build: no-JS styled header/H1, slow-mount heading stability.
- `frontend/scripts/e2e-styled-check.cjs` — any running site: per route × desktop/mobile, JS disabled,
  slow JS + slow API cold load sampled every frame (blank frames, duplicate sections, heading change, H1 jump,
  fade), console errors, failed requests, `/undefined/api`, pre/post-swap screenshots.

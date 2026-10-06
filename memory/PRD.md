# PRD — Intrinsic Technology Website (ported)

## Original problem statement
User uploaded a pre-built Emergent project (USA-intrinsic-main.zip) and said "deploy here".
The archive is the **Intrinsic Technology** managed IT / cybersecurity / cloud-services marketing
website (not a stock tool, despite the archive name). Task: port it to run end-to-end here.

## Architecture
- React (CRA + CRACO) frontend, FastAPI backend, MongoDB.
- Public marketing site (home, services, industries, resources, careers, contact, case studies, blog).
- SEO/SSR endpoints (sitemap.xml, robots.txt, llms.txt, /api/ssr, OG image generation).
- Admin dashboard (content CRUD, SEO manager, live visual editor, typography/theme, email settings,
  analytics, storage, migration), JWT auth.
- Emergent managed object storage for uploads; managed Resend (optional) for inquiry email.

## What was done (2026-06)
- Extracted archive; identified it as a complete pre-built Emergent app.
- Ported backend/ and frontend/ into /app (preserved protected .env vars).
- Wired required env: JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, EMERGENT_LLM_KEY, STORAGE_BACKEND=emergent,
  EMAIL_FROM_NAME, INQUIRY_NOTIFY_EMAIL.
- Installed deps: backend (tinycss2, pillow, httpx — already in requirements.txt), frontend (react-markdown, remark-gfm).
- Verified end-to-end: testing agent 100% backend (12/12) + frontend. Admin login, content, inquiries, SEO all work.

## Admin
- /admin/login — admin@intrinsicamerica.com / Intrinsic#2026Admin (seeded on startup, idempotent).

## SEO/GEO remediation (2026-06)
Rechecked the 6 Oct 2026 reassessment. The codebase already implements the full fix:
request-time SSR (backend/ssr.py + ssr_render.py at /api/ssr) renders real per-page HTML
(title, description, apex canonical, OG/Twitter, breadcrumb/Service/FAQPage/Article/JobPosting
JSON-LD), legacy 301 map + alias consolidation, old-job 301/410, genuine 404, www->apex 301,
all 4 office addresses, visible service/industry/location FAQs, substantive NY/NJ service-area
pages, and index.html Organization/ProfessionalService/WebSite @graph. The About intro is a
complete paragraph (no "managed tec" truncation). deploy/nginx-intrinsic.conf does HTTP->HTTPS
and www->apex 301s and proxies HTML to /api/ssr.
- FIX this iteration: /api/ssr returned 503 in environments without a CRA build. Added a
  fallback to the committed frontend/public/index.html template so SSR is self-sufficient and
  always returns real per-page HTML. Verified by testing_agent iteration_2 (26/26 + 12/12, 100%).
- PENDING (owner/deploy): the live VPS must deploy deploy/nginx-intrinsic.conf + a fresh build
  so HTML requests reach /api/ssr (root cause of the 6 Oct SPA-shell findings is an un-deployed
  SSR config, not the code). Account tasks = Needs access (Search Console/Bing submission,
  IndexNow, business-profile + LinkedIn consistency, owner confirmation of business facts).

## Backend-only SEO pass (2026-06, iteration 3)
Strict backend/server scope (no frontend changes). Two minimal, reversible changes:
- ssr_render.py: /admin and /admin/* now serve the SPA shell with 200 + robots
  "noindex, nofollow" and no canonical (was 404 — would have broken admin under the SSR
  proxy; also fixes the admin "index,follow" issue). _private_shell() only flips robots +
  strips canonical; #root stays empty so React admin boots unchanged.
- server.py robots_txt: added "Disallow: /admin".
Verified by testing_agent iteration_3 (19/19 new + 26/26 prior SSR audit intact, frontend 100%).
Also copied deploy/nginx-intrinsic.conf + DEPLOYMENT.md into /app (server config, part of repo).
All other SEO issues (empty HTML, per-page metadata/canonical, www->apex, legacy 301s,
/sitemap.xml alias, unknown 404) are already implemented in the SSR layer + nginx conf and are
PENDING production deployment of that config. Email delivery = UNVERIFIED (EMERGENT_EMAIL_KEY
not set; no authorization to send test emails); recipient logic correct, inquiry storage preserved.

## Backend SEO pass (2026-06, iteration 4)
Strict backend/server scope. Changes:
- Admin X-Robots-Tag HTTP header: /api/ssr now merges per-result headers; /admin & /admin/*
  return 200 + 'X-Robots-Tag: noindex, nofollow' + 'Cache-Control: no-store' (server-level,
  not just meta). 404/410 return 'X-Robots-Tag: noindex, follow'. Public pages unchanged
  (no header, index,follow meta, public cache). [backend/server.py, backend/ssr_render.py]
- nginx: added 'location ^~ /admin' with server-level X-Robots-Tag + re-declared security headers.
- nginx bug fix: named '@ssr' location had an illegal proxy_pass URI part (would fail nginx -t on
  the VPS) — fixed via rewrite; backend still reads path from X-Original-URI.
- Added deploy/deploy-vps.sh (backup + nginx -t + reload + restart + rollback).
Verified by testing_agent iteration_4 (19/19 + prior 19/19 + 26/26 all intact, frontend 100%).
Preview note: Cloudflare/K8s edge injects a blanket X-Robots-Tag on all /api responses — a
preview-only artifact; production (nginx->uvicorn) serves the app's real per-route headers.

## Initial-HTML fix (2026-06, iterations 5-6)
Diagnosed: production serves the shared CRA build/index.html (exactly 8,578 bytes, empty #root)
for every route — nginx not wired to SSR/prerender. Delivered two non-visual deployment paths:
- Option A (SSR proxy, always fresh): deploy/nginx-intrinsic.conf -> /api/ssr (already present).
- Option B (static generation): backend/prerender.py reuses ssr_render.render to write real
  per-route files (46 pages + 404.html) into frontend/build; works behind a plain SPA nginx.
Fixed a HIGH idempotency bug (duplicate canonical/JSON-LD + body corruption on re-run) via 3 layers:
data-ssr marker on injected JSON-LD (ssr.py), strip-before-inject in _meta_head (ssr_render.py),
and a pristine template cache build/.prerender-template.html (prerender.py + server loader prefers it).
Empty canonical suppressed on 404/error pages. Verified iterations 5-6 (100%: prerender audit 48/48,
idempotency 49/49, ssr 26, xrobots 34, admin 4; browser regression + freshness pass). Docs:
deploy/INITIAL-HTML-FIX.md. Production verification PENDING (no VPS access).

## Backlog
- P1: Set EMERGENT_EMAIL_KEY to enable inquiry email notifications (currently non-blocking no-op).
- P2: Login form placeholder says "Username" though it expects email (cosmetic, from original app).
- P2: server.py is one large file; could be split into routers (out of scope for a port).
- P3: Go-live deployment with custom domain (intrinsicamerica.com) + SEO submission (see DEPLOYMENT.md).

## Styled initial HTML v2 + routing fixes (2026-10-06)
Built on branch codex/fix-styled-initial-html (= main 7d1c265 + 8bde753). Local commit e3dbe3d on
fix/styled-initial-html-v2 (NOT pushed: no GitHub credentials in workspace; bundle at /root/intrinsic-fix-styled-initial-html-v2.bundle).
- Root cause of upload 404s on production: nginx static-extension regex beat `location /api/` -> `^~ /api/`.
- Repo nginx conf also spliced paths (`proxy_pass .../api/ssr` in `location /`) -> rewrite form.
- Real React prerender (frontend/scripts/prerender-styled.cjs) + seamless swap (prerender-boot.js);
  reveal scripts scoped to #root; styled 404; HEAD support; publish-triggered refresh (backend/styled_refresh.py);
  plain-text backend/prerender.py retired; deploy/update-styled-vps.sh staged deploy + rollback + live checks.
- Verified in preview via local nginx :8080 (repo conf) -> backend :8001: 46 routes x 3 URL variants,
  92 route/device browser runs (no-JS, slow JS+API), functional (nav, contact form, admin login), publish refresh.
- NOT deployed to the VPS; production verification pending.
- Preview-only backend/.env additions: STYLED_PRERENDER_TOOLS=/root/prtools, STYLED_REFRESH_API_ORIGIN=:8001, STYLED_REFRESH_DELAY=5.

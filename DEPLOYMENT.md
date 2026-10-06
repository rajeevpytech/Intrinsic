# Intrinsic — Deployment (VPS: /var/www/intrinsic)

> These are the access-dependent steps for your VPS. The agent builds/tests in the Emergent
> workspace + preview; it cannot reach your VPS, GitHub repo, live domain, or Search Console.
> Run these on the server where you have access. Mark = step that only you can perform.

## 0. Prerequisites
- Node 18+ and yarn on the build host.
- FastAPI backend already running on 127.0.0.1:8000 (keep your existing .env, DB, uploads, certs).
- Existing PR `codex/seo-crawlable-public-html` (prerender of public routes): if already merged/deployed,
  KEEP it. This guide's nginx `try_files $uri/index.html` serves those prerendered files. Do not run a
  second, conflicting prerenderer.

## 1. Versioned build (atomic release)
```bash
cd /var/www/intrinsic
ts=$(date +%Y%m%d%H%M%S)
git fetch origin && git checkout <merged-branch>        # = your prerender branch / main
# backend deps (if changed)
python3 -m venv .venv 2>/dev/null; . .venv/bin/activate; pip install -r backend/requirements.txt
# frontend build (CRA/CRACO). If the prerender PR adds a postbuild prerender step, it runs here.
cd frontend && yarn install --frozen-lockfile && yarn build && cd ..
# stage release and flip the "current" symlink atomically
mkdir -p releases/$ts && cp -a frontend/build releases/$ts/frontend-build
ln -sfn /var/www/intrinsic/releases/$ts /var/www/intrinsic/current   # = activate release
```
Point nginx `root` at `/var/www/intrinsic/current/frontend-build` (see nginx-intrinsic.conf; adjust if your
build path differs). Keep the previous `releases/*` for rollback.

## 2. Nginx
```bash
sudo mkdir -p /etc/nginx/intrinsic
sudo cp deploy/legacy-redirects.map /etc/nginx/intrinsic/legacy-redirects.map   # fill real pairs first
sudo cp deploy/nginx-intrinsic.conf /etc/nginx/sites-available/intrinsic
sudo ln -sfn /etc/nginx/sites-available/intrinsic /etc/nginx/sites-enabled/intrinsic
sudo nginx -t          # MUST pass before reload
sudo systemctl reload nginx
```
Adjust the two `ssl_certificate*` paths to your actual cert. Do NOT overwrite working cert/proxy settings.

## 3. Rollback (tested path)
```bash
ls -1 /var/www/intrinsic/releases        # pick the previous timestamp
ln -sfn /var/www/intrinsic/releases/<previous_ts> /var/www/intrinsic/current
sudo nginx -t && sudo systemctl reload nginx
```
A failed build never flips `current`, so the last working release stays live.

## 4. Post-deploy production re-checks ( — run on the live domain)
```bash
curl -sI https://www.intrinsicamerica.com/        # expect 301 -> https://intrinsicamerica.com/
curl -sI http://intrinsicamerica.com/             # expect 301 -> https
curl -s  https://intrinsicamerica.com/ | grep -c 'application/ld+json'   # schema present (no JS)
curl -sI https://intrinsicamerica.com/this-does-not-exist               # expect HTTP/2 404
curl -s  https://intrinsicamerica.com/robots.txt | head
curl -s  https://intrinsicamerica.com/sitemap.xml | head
```
Run Lighthouse (mobile + desktop) on production for: home, a service, an industry, resources, a case
study, careers, contact, a blog post. Record median of 3 runs + tool version. Local/preview numbers are
NOT production numbers.

## 5. Keeping public HTML current after admin edits
- The public HTML/metadata/sitemap must be regenerated when admin publishes.
- Recommended: an admin "Publish" action triggers the Section 1 build+flip (or a cache purge if using a
  prerender cache). Show build status; on failure, keep the last good release (the symlink is only flipped
  on success). The FastAPI-generated `/robots.txt` and `/sitemap.xml` are always live (proxied), so they
  reflect current published content immediately.

## 6. Indexing ( — account access required)
- Google Search Console + Bing Webmaster Tools: submit https://intrinsicamerica.com/sitemap.xml,
  inspect representative URLs, confirm canonical selection, add legacy-URL handling.
- Set `google_site_verification` in the SEO settings (admin) and redeploy, or add the meta tag.

## Access-dependent items the agent could NOT perform here
- VPS build/flip, nginx reload, SSL — commands above.
- Production Lighthouse + live-domain re-checks — Section 4.
- Legacy-URL 301 map values — needs your Search Console export (deploy/legacy-redirects.map).
- Search Console / Bing submission + verification — Section 6.
- Confirming the business facts already in schema (addresses, phone, email) are final.

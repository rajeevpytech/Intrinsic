#!/usr/bin/env bash
# Intrinsic VPS deploy: styled initial HTML + asset/API routing fixes.
# Usage (as root, from anywhere):  bash /var/www/intrinsic/deploy/update-styled-vps.sh [branch]
# Keeps: SSL certificates, .env files, MongoDB content, uploads. Rolls back automatically on any failure.
set -Eeuo pipefail

BRANCH="${1:-main}"
APP=/var/www/intrinsic
BUILD="$APP/frontend/build"
SERVICE=intrinsic-api
API=http://127.0.0.1:8000
DOMAIN=intrinsicamerica.com
PUBLIC_API_ORIGIN="https://$DOMAIN"
TOOLS=/var/cache/intrinsic-prerender
SITE=$(readlink -f /etc/nginx/sites-enabled/intrinsic)
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="/var/backups/intrinsic/deploy-$TS"
STAGE="$APP/frontend/.build-stage-$TS"
export PLAYWRIGHT_BROWSERS_PATH="$TOOLS/browsers"

log() { echo "==> $*"; }
health() {
    for _ in $(seq 1 40); do curl -fsS --max-time 3 "$API/api/health" >/dev/null 2>&1 && return 0; sleep 1; done
    echo "!! backend health check failed"; return 1
}

[ "$(id -u)" = 0 ] || { echo "Run as root (sudo)."; exit 1; }
cd "$APP"
git rev-parse --git-dir >/dev/null
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Tracked files on the server have local changes; commit/stash them first:"; git status --short; exit 1
fi
nginx -t
health
PREV_COMMIT=$(git rev-parse HEAD)

log "1/9 Backup -> $BACKUP"
mkdir -p "$BACKUP"
echo "$PREV_COMMIT" > "$BACKUP/previous-commit.txt"
cp -a "$SITE" "$BACKUP/nginx-site.conf"
[ -d "$BUILD" ] && cp -a "$BUILD" "$BACKUP/build"
for f in backend/.env frontend/.env; do [ -f "$f" ] && install -D -m 600 "$f" "$BACKUP/$f"; done

ACTIVATED=0
rollback() {
    local code=$?
    trap - ERR
    echo "!! Deployment failed (exit $code). Rolling back from $BACKUP"
    cp -a "$BACKUP/nginx-site.conf" "$SITE"
    if [ "$ACTIVATED" = 1 ] && [ -d "$BACKUP/build" ]; then
        rm -rf "$BUILD.failed-$TS"; mv "$BUILD" "$BUILD.failed-$TS" 2>/dev/null || true
        cp -a "$BACKUP/build" "$BUILD"
    fi
    rm -rf "$STAGE"
    git -c advice.detachedHead=false checkout -q --detach "$PREV_COMMIT" || true
    systemctl restart "$SERVICE" || true
    nginx -t && systemctl reload nginx || true
    health || true
    echo "Rolled back to commit $PREV_COMMIT. Backup kept at $BACKUP"
    exit "$code"
}
trap rollback ERR

log "2/9 Checkout origin/$BRANCH"
git fetch --prune origin
git -c advice.detachedHead=false checkout -q --detach "origin/$BRANCH"
echo "deploying $(git rev-parse --short HEAD) (previous $PREV_COMMIT)" | tee "$BACKUP/new-commit.txt"

log "3/9 Prerender tooling (outside the app): $TOOLS"
mkdir -p "$TOOLS"
[ -f "$TOOLS/package.json" ] || echo '{"name":"intrinsic-prerender-tools","private":true}' > "$TOOLS/package.json"
[ -d "$TOOLS/node_modules/playwright" ] || yarn --cwd "$TOOLS" add --silent playwright@1.56.1
node "$TOOLS/node_modules/playwright/cli.js" install --with-deps chromium

log "4/9 Staged production build -> $STAGE"
cd "$APP/frontend"
yarn install --frozen-lockfile --network-timeout 600000
REACT_APP_BACKEND_URL="$PUBLIC_API_ORIGIN" GENERATE_SOURCEMAP=false BUILD_PATH="$STAGE" yarn build
cd "$APP"
if grep -rlq "undefined/api" "$STAGE/static/js"; then echo "!! build contains /undefined/api"; false; fi
grep -lq "$PUBLIC_API_ORIGIN" "$STAGE"/static/js/main.*.js || { echo "!! API origin not baked into build"; false; }

log "5/9 Styled prerender of every sitemap route (read-only against the running API)"
NODE_PATH="$TOOLS/node_modules" BUILD_PATH="$STAGE" SEO_API_ORIGIN="$API" node frontend/scripts/prerender-styled.cjs
NODE_PATH="$TOOLS/node_modules" BUILD_PATH="$STAGE" ASSET_ORIGIN="$PUBLIC_API_ORIGIN" node frontend/scripts/verify-styled.cjs
# Tabs still running the previous release can keep loading their hashed chunks.
[ -d "$BUILD/static" ] && cp -an "$BUILD/static/." "$STAGE/static/"

log "6/9 Nginx: ^~ /api/, static files never sent to SSR, crawler files"
python3 - "$SITE" "$BUILD" <<'PY'
import re, sys
from pathlib import Path
site, build = Path(sys.argv[1]), sys.argv[2]
text = site.read_text()
roots = re.findall(r'^\s*root\s+([^;]+);', text, re.M)
if not any(r.strip().rstrip('/') == build for r in roots):
    raise SystemExit(f"nginx root is {roots}, expected {build}; refusing to guess. Fix root first.")
if not re.search(r'location\s+(\^~\s+)?/api/\s*\{', text):
    raise SystemExit("No 'location /api/' block found; refusing to patch.")
text = re.sub(r'location\s+/api/\s*\{', 'location ^~ /api/ {', text)
# Static-extension regex locations must 404 on a miss instead of falling through to the SSR/HTML handler.
def fix_static(m):
    block = m.group(0)
    block = re.sub(r'try_files\s+\$uri\s+(@\w+|/index\.html|\$uri/\s+/index\.html|/api/ssr)\s*;', 'try_files $uri =404;', block)
    return block
text = re.sub(r'location\s+~\*?\s+[^{]*\\\.\(\?:?[^{]*\{[^{}]*\}', fix_static, text)
# proxy_pass with a URI inside a prefix location splices the path (/about -> /api/ssrabout); use rewrite.
text = re.sub(r'proxy_pass\s+http://127\.0\.0\.1:8000/api/ssr\s*;', 'rewrite ^ /api/ssr break;\n        proxy_pass http://127.0.0.1:8000;', text)
if 'X-Original-URI' not in text and 'api/ssr' in text:
    raise SystemExit("SSR proxy does not pass X-Original-URI; refusing to patch an unknown layout.")
for name in ('robots.txt', 'sitemap.xml', 'llms.txt'):
    if not re.search(r'location\s+=\s+/' + re.escape(name) + r'\s*\{', text):
        if text.count('    location / {') != 1:
            raise SystemExit("Cannot place crawler-file locations safely (expected one 'location / {').")
        text = text.replace('    location / {', f'    location = /{name} {{ proxy_pass http://127.0.0.1:8000/api/{name}; }}\n    location / {{', 1)
site.write_text(text)
print("nginx site patched:", site)
PY
nginx -t

log "7/9 Activate build + backend"
ACTIVATED=1
mv "$BUILD" "$BACKUP/live-build-moved"
mv "$STAGE" "$BUILD"
SVC_USER=$(systemctl show -p User --value "$SERVICE" || true)
if [ -n "$SVC_USER" ] && [ "$SVC_USER" != root ]; then
    chown -R "$SVC_USER" "$BUILD"
    chown -R "$SVC_USER" "$TOOLS"
fi
systemctl restart "$SERVICE"
health
systemctl reload nginx

log "8/9 Live verification through this server's nginx (TLS + SNI for $DOMAIN)"
python3 - "$BUILD" "$DOMAIN" <<'PY'
import json, os, re, socket, ssl, sys, http.client
from pathlib import Path
build, domain = Path(sys.argv[1]), sys.argv[2]
PORT = int(os.environ.get("LIVE_CHECK_PORT", "443"))
ctx = ssl.create_default_context()
if os.environ.get("LIVE_CHECK_INSECURE") == "1":  # local test harness only (self-signed cert)
    ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
class Local(http.client.HTTPSConnection):
    # TLS + SNI for the real domain, but connected to this machine's nginx (bypasses DNS/CDN caches).
    def connect(self):
        self.sock = self._context.wrap_socket(socket.create_connection(("127.0.0.1", PORT), self.timeout), server_hostname=self.host)
def get(path):
    conn = Local(domain, PORT, context=ctx, timeout=30)
    conn.request("GET", path, headers={"Cache-Control": "no-cache", "User-Agent": "intrinsic-deploy-check"})
    r = conn.getresponse(); body = r.read(); conn.close()
    return r.status, {k.lower(): v for k, v in r.getheaders()}, body
fails = []
def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond: fails.append(msg)
manifest = json.loads((build / "styled-prerender-manifest.json").read_text())
routes = [p["route"] for p in manifest["pages"] if not p["route"].startswith("/__")]
for route in routes:
    for variant in {route, (route.rstrip("/") + "/") if route != "/" else "/", route + "?utm_source=deploycheck"}:
        s, h, b = get(variant); html = b.decode("utf-8", "replace")
        canon = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', html)
        ok = (s == 200 and 'data-prerendered="1"' in html and "<title>" in html and re.search(r"<h1[\s>]", html)
              and canon and canon.group(1).rstrip("/") == f"https://{domain}{route}".rstrip("/"))
        check(bool(ok), f"styled page {variant} -> {s}")
for name, ctype in (("/robots.txt", "text/plain"), ("/sitemap.xml", "xml"), ("/llms.txt", "text/plain")):
    s, h, b = get(name)
    check(s == 200 and ctype in h.get("content-type", "") and not b.lstrip().lower().startswith(b"<!doctype"), f"{name} -> {s} {h.get('content-type')}")
shell = (build / ".react-shell.html").read_text()
for asset, ctype in ((re.search(r'src="(/static/js/main\.[^"]+\.js)"', shell).group(1), "javascript"),
                     (re.search(r'href="(/static/css/main\.[^"]+\.css)"', shell).group(1), "text/css"),
                     ("/static/js/prerender-boot.js", "javascript"), ("/favicon.svg", "image/svg")):
    s, h, _ = get(asset); check(s == 200 and ctype in h.get("content-type", ""), f"asset {asset} -> {s} {h.get('content-type')}")
s, h, b = get("/static/js/does-not-exist.js"); check(s == 404 and b"data-prerendered" not in b, f"missing asset -> {s} (not HTML page)")
s, h, b = get("/api/live-edits")
for src in sorted(set(re.findall(r'/api/files/[^"\'\s)]+', b.decode()))):
    s2, h2, b2 = get(src); check(s2 == 200 and h2.get("content-type", "").startswith("image/") and len(b2) > 100, f"upload {src} -> {s2} {h2.get('content-type')}")
s, h, b = get("/this-page-does-not-exist-deploycheck"); check(s == 404, f"unknown route -> {s}")
s, h, b = get("/admin"); check(s == 200 and "noindex" in h.get("x-robots-tag", ""), f"/admin -> {s} X-Robots-Tag={h.get('x-robots-tag')}")
s, h, b = get("/api/health"); check(s == 200, f"/api/health -> {s}")
if fails:
    print(f"{len(fails)} live check(s) failed"); sys.exit(1)
print(f"All live checks passed for {len(routes)} sitemap routes")
PY

log "9/9 Done"
trap - ERR
echo "SUCCESS: deployed $(git rev-parse --short HEAD). Backup + rollback material: $BACKUP"
echo "Manual rollback: git -C $APP checkout --detach $PREV_COMMIT && rm -rf $BUILD && cp -a $BACKUP/build $BUILD && cp -a $BACKUP/nginx-site.conf $SITE && systemctl restart $SERVICE && nginx -t && systemctl reload nginx"

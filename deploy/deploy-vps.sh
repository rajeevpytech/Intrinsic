#!/usr/bin/env bash
#
# Intrinsic — backend/server SEO deploy for the production VPS.
# Deploys the SSR backend (server.py, ssr.py, ssr_render.py, email_service.py)
# + the nginx site config (www->apex, legacy 301s, /sitemap.xml, real 404/410,
# admin X-Robots-Tag). Safe + reversible: backs up every file it touches,
# validates nginx before reload, and prints exact rollback commands.
#
# RUN ON THE VPS (where you have access). The Emergent workspace CANNOT reach
# your VPS, so this is NOT auto-executed from the build environment.
#
# Usage:   sudo bash deploy/deploy-vps.sh
# Rollback: see the commands printed at the end, or re-run with: sudo bash deploy/deploy-vps.sh --rollback
set -euo pipefail

# ---- Adjust these to your server if different -------------------------------
APP_DIR="/var/www/intrinsic/current"          # your active release (symlink)
NGINX_SITE="/etc/nginx/sites-available/intrinsic"
NGINX_LINK="/etc/nginx/sites-enabled/intrinsic"
BACKEND_SERVICE="intrinsic-backend"           # systemd unit for uvicorn on 127.0.0.1:8000
REPO_NGINX="$(cd "$(dirname "$0")" && pwd)/nginx-intrinsic.conf"
REPO_BACKEND="$(cd "$(dirname "$0")/.." && pwd)/backend"
TS="$(date +%Y%m%d%H%M%S)"
BACKUP_DIR="/var/backups/intrinsic-seo-$TS"
# -----------------------------------------------------------------------------

if [[ "${1:-}" == "--rollback" ]]; then
  echo "Pick a backup dir under /var/backups/ (intrinsic-seo-*) and restore from it:"
  ls -1d /var/backups/intrinsic-seo-* 2>/dev/null || true
  echo "Then: sudo cp <backup>/intrinsic.nginx $NGINX_SITE && sudo nginx -t && sudo systemctl reload nginx"
  echo "And restore backend files from <backup>/backend/* then: sudo systemctl restart $BACKEND_SERVICE"
  exit 0
fi

echo "==> 1/5 Backing up to $BACKUP_DIR"
mkdir -p "$BACKUP_DIR/backend"
[[ -f "$NGINX_SITE" ]] && cp -a "$NGINX_SITE" "$BACKUP_DIR/intrinsic.nginx" || echo "   (no existing nginx site to back up)"
for f in server.py ssr.py ssr_render.py email_service.py; do
  [[ -f "$APP_DIR/backend/$f" ]] && cp -a "$APP_DIR/backend/$f" "$BACKUP_DIR/backend/$f" || true
done
echo "   backup complete."

echo "==> 2/5 Deploying backend SSR/SEO files (preserving .env, uploads, DB, certs)"
for f in server.py ssr.py ssr_render.py email_service.py; do
  cp -a "$REPO_BACKEND/$f" "$APP_DIR/backend/$f"
  echo "   updated backend/$f"
done

echo "==> 3/5 Installing nginx site config (adjust ssl_certificate* paths first if needed)"
cp -a "$REPO_NGINX" "$NGINX_SITE"
ln -sfn "$NGINX_SITE" "$NGINX_LINK"

echo "==> 4/5 Validating nginx config (MUST pass before reload)"
if ! nginx -t; then
  echo "!! nginx -t FAILED — restoring previous nginx site and aborting."
  [[ -f "$BACKUP_DIR/intrinsic.nginx" ]] && cp -a "$BACKUP_DIR/intrinsic.nginx" "$NGINX_SITE"
  nginx -t && systemctl reload nginx || true
  exit 1
fi

echo "==> 5/5 Reloading nginx + restarting backend"
systemctl reload nginx
systemctl restart "$BACKEND_SERVICE"

echo
echo "DONE. Production re-checks:"
echo "  curl -sI https://www.intrinsicamerica.com/           # expect 301 -> https://intrinsicamerica.com/"
echo "  curl -sI http://intrinsicamerica.com/                # expect 301 -> https"
echo "  curl -sI https://intrinsicamerica.com/about-us/      # expect 301 -> /about"
echo "  curl -sI https://intrinsicamerica.com/no-such-page   # expect 404"
echo "  curl -sI https://intrinsicamerica.com/admin          # expect X-Robots-Tag: noindex, nofollow"
echo "  curl -sI https://intrinsicamerica.com/sitemap.xml    # expect 200 application/xml"
echo "  curl -s  https://intrinsicamerica.com/services/cloud | grep -o '<title>[^<]*</title>'"
echo
echo "ROLLBACK (if needed):"
echo "  sudo cp -a $BACKUP_DIR/intrinsic.nginx $NGINX_SITE && sudo nginx -t && sudo systemctl reload nginx"
echo "  sudo cp -a $BACKUP_DIR/backend/* $APP_DIR/backend/ && sudo systemctl restart $BACKEND_SERVICE"

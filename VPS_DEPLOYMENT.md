# Self-Hosting Intrinsic on a VPS (standalone, no Emergent dependency)

Everything the site needs — section colors, layouts, content, and the 17 uploaded
images — is already in this repo (code + `backend/seed_data/site_export.json`). A
fresh MongoDB auto-populates itself on first backend startup via `seed_from_export()`.

## 1. Requirements on the VPS
- Node 18+ and Yarn, Python 3.11+, and MongoDB (local install or MongoDB Atlas).

## 2. Backend `.env` (create `/app/backend/.env`)
```
MONGO_URL="mongodb://localhost:27017"     # your own Mongo (local or Atlas)
DB_NAME="intrinsic"
CORS_ORIGINS="https://your-domain.com"    # your site origin(s), comma-separated
JWT_SECRET="<long-random-string>"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="<choose-a-strong-password>"
STORAGE_BACKEND="local"                   # IMPORTANT: stores/serves images from local disk
INQUIRY_NOTIFY_EMAIL="you@yourdomain.com" # where contact-form inquiries are sent
# Email (pick ONE path):
#   A) Keep Emergent managed email: set EMERGENT_EMAIL_KEY + EMAIL_FROM_NAME (needs internet to Emergent)
#   B) Fully standalone: leave EMERGENT_EMAIL_KEY unset and configure Gmail/SMTP in Admin -> Email Settings
# EMERGENT_LLM_KEY is NOT needed when STORAGE_BACKEND=local.
```
> Do NOT set `STORAGE_BACKEND=local` on the Emergent preview — there the 17 images
> live in Emergent object storage. `local` is a VPS-only setting; on a fresh VPS DB
> the images are written to `backend/uploads/` automatically from the seed bundle.

## 3. Frontend `.env` (create `/app/frontend/.env`)
```
REACT_APP_BACKEND_URL="https://your-domain.com"   # public URL that routes /api to the backend
```

## 4. Install & run
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
# On first start it seeds content + colors + layout + images into the fresh DB.

# Frontend (build static files and serve them, e.g. with nginx or `npx serve`)
cd frontend
yarn install
yarn build        # outputs ./build
npx serve -s build -l 3000   # or point nginx at ./build
```
Put a reverse proxy (nginx) in front: route `/api/*` to `:8001`, everything else to
the static `build/` (SPA fallback to `index.html`).

## 5. Emergent services -> standalone replacements
| Emergent service | Used for | Standalone replacement |
|---|---|---|
| Object storage (`integrations.emergentagent.com`, `EMERGENT_LLM_KEY`) | Uploaded images | `STORAGE_BACKEND=local` — files on VPS disk (`backend/uploads`), served at `/api/files/...`. Auto-restored from the seed bundle. |
| Managed email (`EMERGENT_EMAIL_KEY`) | Contact-form notifications | Configure Gmail/SMTP in **Admin -> Email Settings** (there is an SMTP fallback), or your own Resend/SendGrid/Mailgun account. |

## 6. Images
- **Uploaded (17):** embedded as base64 in `seed_data/site_export.json`; extracted to
  `backend/uploads/` on first startup when `STORAGE_BACKEND=local`. Served at `/api/files/<path>`.
- **Static:** already in `frontend/public/images/` (ship with the repo).
- Any external links inside content (e.g. a case-study PDF hosted elsewhere) can be
  re-uploaded through **Admin** and the link updated if you want them fully self-hosted.

## 7. Admin login
Uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env` (seeded on first start).
Visit `/admin/login`.

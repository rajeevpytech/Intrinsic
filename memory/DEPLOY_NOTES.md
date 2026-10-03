# Intrinsic — Deploy Notes

## 2026-06 (job intrinsic-deploy-1) — fresh load of zip v12
- Loaded Intrinsic-main (12).zip into /app (preserved job .git/.emergent/.env).
- backend/.env set: MONGO_URL/DB_NAME (local), CORS_ORIGINS=preview origin, JWT_SECRET (random), ADMIN_EMAIL/ADMIN_PASSWORD, STORAGE_BACKEND=emergent, EMERGENT_LLM_KEY (Universal key).
- Verified preview: /api/health 200, admin login 200, /api/content-site 200, /api/theme 200, /api/live-edits 200, storage status = 17 emergent files, homepage renders.
- DB starts with baked-in site export seed (startup log: "Seeded content from baked-in site export"). Full live-site export (~1027 records) NOT re-imported (no export file provided).
- At deploy: Emergent serves frontend+backend same-origin, so CORS is not blocking. Set CORS_ORIGINS to the prod origin if a cross-origin client is added later.

## Env var inventory
- Backend (required): MONGO_URL, DB_NAME, JWT_SECRET, CORS_ORIGINS, ADMIN_EMAIL, ADMIN_PASSWORD
- Backend (optional): STORAGE_BACKEND (default emergent), EMERGENT_LLM_KEY (object storage + AI), SMTP_GMAIL_ADDRESS/SMTP_GMAIL_APP_PASSWORD/INQUIRY_NOTIFY_EMAIL (email), EMERGENT_EMAIL_KEY, LOCAL_STORAGE_DIR, INTEGRATION_PROXY_URL
- Frontend (required): REACT_APP_BACKEND_URL

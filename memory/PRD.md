# Intrinsic Technology — PRD

## Original problem statement
Port the user's existing "Intrinsic" project (uploaded zip, React + FastAPI + MongoDB marketing site + admin CMS) into this platform, run it end-to-end in preview, then publish. Also: import the user's real site-content export and make it persist in code so GitHub pushes/deploys carry it (no repeated import/export).

## Architecture
- Frontend: React (CRA + CRACO), Tailwind, framer-motion, shadcn/ui. 40+ marketing pages + admin CMS. API via REACT_APP_BACKEND_URL + /api. Admin JWT token in localStorage['intr_token'].
- Backend: FastAPI + Motor (MongoDB). JWT admin auth, Emergent object storage for uploads, managed Resend + Gmail SMTP for inquiry email (pending key), analytics, live visual edits, typography/custom-css, full export/import migration.
- Env (backend/.env): MONGO_URL, DB_NAME, CORS_ORIGINS, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, EMERGENT_LLM_KEY, INQUIRY_NOTIFY_EMAIL.

## Admin credentials
admin@intrinsicamerica.com / IntrinsicAdmin2026! (env-seeded; see memory/test_credentials.md). Two original imported admins (admin@intrinsic.com, admin@intrinsic.io) also exist with unknown hashed passwords — harmless.

## Implemented (with dates)
- 2026-06: Ported uploaded Intrinsic code into /app; wired env; installed tinycss2/pillow/httpx; services healthy. Verified 100% backend (17 tests) + 100% frontend (admin login, inquiry write->DB->admin read, object storage, SEO/discovery endpoints).
- 2026-06: Global section-padding rhythm — public content sections keep their total vertical padding but re-split 65% top / 35% bottom; hero sections bottom-aligned with breathing room. Scoped CSS in frontend/src/index.css (.page-in section.py-* + hero align-content:end). Admin/navbar/modals untouched; inter-section gaps preserved.
- 2026-06: Imported user's real site export (intrinsic-site-export-20261002) into live DB via /api/admin/import — 1183 records + 17 files restored. Made it persist in code: baked trimmed bundle to backend/seed_data/site_export.json (blogs, case_studies, files, jobs, live_edits, service_briefs, settings, site, testimonials + 17 file binaries). Added seed_from_export() that auto-restores on a FRESH DB; guarded legacy demo seed (is_fresh check) so it never overwrites real content. Users/analytics/leads intentionally not baked (env admin + fresh analytics). Verified: real content live, images serve 200, env-admin login works. seed_data NOT gitignored → ships on GitHub push.

## Backlog / remaining
- P2: Email delivery (Resend/SMTP) pending — needs EMERGENT_EMAIL_KEY or Gmail app password + recipient. Inquiries still persist and appear in admin; only outbound email is skipped.
- P0 (user action): Publish to a live URL — separate explicit deploy step (first deploy = 50 ECU), pending user confirmation.

## Next tasks
- Deploy/publish when user confirms.
- Wire live email when key provided.

# Intrinsic — Port & Deploy

Bring the uploaded "Intrinsic" project into this platform, get it running end-to-end in a live preview, and then publish it to a public URL.
The goal is a working, shareable version of the app you already built — not a redesign or a feature rewrite.

## Who it's for
The owner of the Intrinsic project who wants their existing code hosted and reachable on the internet, plus anyone they share the live link with.

## Core features and experience
- The app's existing functionality is preserved as-is. Whatever Intrinsic already does (its screens, flows, and logic) continues to work the same way.
- The app runs as a single hosted web app: a frontend users see in the browser, backed by its server and database.
- Data the app saves (accounts, content, settings — whatever it stores today) persists in a database so it survives restarts.
- Any external services the app relies on (AI, email, payments, login, etc.) are reconnected using the appropriate keys so those features work live, not in a broken or mocked state.

## User flow
1. A visitor opens the published link.
2. They land on Intrinsic's home/entry screen exactly as designed.
3. They use the app's existing features (sign in, browse, create, submit — whatever applies).
4. Their actions read and write through the server to the database, and results appear back in the browser.

## UI/UX feel
Unchanged from the original project. The look, layout, fonts, and interactions ship as they were built. Nothing is restyled unless something is visibly broken by the move into this environment, in which case it's repaired to match the original intent.

## Implementation phases

### Phase 1 — MVP (built now)
- Load the uploaded Intrinsic code into this environment.
- Adapt only what the platform requires to run: how the frontend reaches the backend, how the backend reaches the database, and how configuration/keys are supplied. No feature changes.
- Get the frontend and backend both running and talking to each other in a live preview.
- Confirm the main screens load and the primary flow works end-to-end.
- Reconnect external services **only where keys are available**; anything missing a key is flagged clearly rather than silently stubbed.
- Publish to a public URL.

### Phase 2 — Reconnect & harden (later)
- Wire up any integrations that were skipped in Phase 1 because keys weren't ready.
- Fix any secondary flows or edge cases that didn't survive the move cleanly.
- Verify data persistence and basic error handling across the app.

### Phase 3 — Polish & custom domain (later)
- Address any visual or behavioral gaps against the original.
- Optional custom domain, and any performance or reliability tuning.

## Assumptions
- "Deploy here" means: port your existing Intrinsic code into this environment, get it running, then publish — not rebuild it from scratch and not merely review it.
- The code in the zip is substantially complete and was working (or nearly working) before upload; the task is hosting it, not finishing unbuilt features.
- The project will run on this platform's supported setup. If the original backend is built in a different technology than this platform runs natively, the backend is adapted/re-hosted to run here while keeping the same behavior and API shape the frontend expects.
- A fresh database is used in this environment. Any existing data from your previous setup is **not** migrated unless you provide an export.
- External integrations stay the same services the original app used. For each, a working key is needed to go fully live; where a key isn't provided, that specific feature is marked as pending rather than faked.
- No new features, screens, or redesigns are added during Phase 1 — scope is strictly "make the existing app run and be reachable."
- Publishing to a live URL is a separate, explicit step taken after the app is confirmed working in preview.

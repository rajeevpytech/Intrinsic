# Intrinsic: Rebuild of the Uploaded Project

A working, deployable rebuild of the uploaded "Intrinsic-main" project. It keeps the same screens, features and content, and runs as one full web app.

Note: the zip can't be opened during planning. Its contents will be read at the very start of the build, and the build will follow them. Where the code differs from the general descriptions below, the code wins.

## Who it's for
- The owner of the Intrinsic project, who wants it running live on Emergent without rebuilding it by hand.
- The project's existing end users, who should see the same product they would get from the original code.

## Core features and experience
- **Faithful reproduction:** every page, route, and component in the uploaded code is rebuilt with the same layout, text, images and behaviour.
- **Working data:** any data the original saves (forms, records, user content, settings) is stored and kept between sessions instead of being lost on refresh.
- **Working backend:** any server logic or API calls in the original are rebuilt so actions really do something.
- **Outside services kept:** AI, email, payments, file uploads, or login found in the code are connected through Emergent's built-in equivalents where they exist (Emergent LLM key for OpenAI/Claude/Gemini, managed Stripe test mode, managed Resend email, Emergent object storage, Emergent Google login or email/password login).
- **Services with no built-in equivalent:** if a service needs the user's own keys, it is clearly labelled MOCKED in phase 1, and keys are requested before it is turned on.
- **Responsive:** works on desktop and mobile, the same way the original does (or better, if the original wasn't responsive).

## User flow
1. A visitor opens the app and lands on the same home/entry screen as the original.
2. They move through the same navigation and pages.
3. If the original has accounts, they sign up or log in, then reach their personal area.
4. They do the project's main actions (create, view, edit, generate, buy, whatever the code supports), and the results are saved.
5. They come back later and their data is still there.

## UI/UX feel
- Matches the original's visual identity: colours, fonts, spacing, imagery and tone.
- Only obvious defects get fixed (broken layouts, missing images, unreadable contrast, missing loading or error states). There is no redesign.
- Small, subtle interaction polish (hover, loading and transition states) is added only where the original has none.

## Implementation phases
**Phase 1: MVP (built now)**
- Unpack and review the uploaded project.
- Rebuild all core screens and the main user journey end to end, with real data saving.
- Connect integrations that can run without user keys. Clearly mark any others as MOCKED.
- Check the main flows end to end.
- Run a deployment readiness check, then publish to a live Emergent URL. A first deployment costs 50 credits, and the user confirms this before publishing.

**Phase 2: Integrations and completeness**
- Turn on integrations that need the user's own keys, after the user provides them.
- Fill in secondary or edge-case screens and admin tools that the original contains.
- Redeploy so the live site picks up these additions.

**Phase 3: Polish and custom domain**
- Tune performance and mobile, add SEO and sharing metadata, and finalise content.
- Optionally connect a custom domain to the live Emergent deployment.

## Assumptions
- "Deploy here" means: host the app on Emergent and publish it to a live URL as part of the first version, not just as a later step.
- The uploaded code can't be deployed as is. It is rebuilt on this platform first, then published.
- "Build this" means: recreate the uploaded project as a working app, keeping its features, design and content.
- The original's design is kept as is. There is no redesign or rebrand.
- If the original uses a different tech setup, it is ported to this platform's setup. What users see and can do stays the same.
- Login is only added if the original has it. The method matches the original where possible (email/password or Google).
- AI features use the Emergent LLM key, staying with the same provider/model family as the original where it's supported.
- Payments, if present, run in Stripe test mode first.
- Any service that would need the user's private keys is MOCKED in phase 1 and labelled as such.
- Files and images that users upload go to managed object storage.
- Any hardcoded secrets or API keys found in the uploaded code are not reused. They are moved to secure configuration.
- If the code is incomplete, unfinished parts are completed using sensible defaults and listed in the phase 1 summary.

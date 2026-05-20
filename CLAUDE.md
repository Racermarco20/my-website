# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with three independent parts:

- `frontend/` — React SPA, deployed to GitHub Pages, served from custom domain `racermarco20.at`
- `backend/` — Spring Boot REST API. **Currently not deployed** and not used by the frontend. Kept for future features (auth, contact form, etc.).
- `analytics/` — Cloudflare Worker + D1 (SQLite at the edge). Lightweight pageview tracking that the frontend talks to. The dashboard in the frontend (`/dashboard`) reads aggregated stats from it.

The frontend is statically hosted and only talks to the analytics Worker via HTTP. The backend is dormant.

## Frontend

### Commands (run inside `frontend/`)
```
npm run dev       # dev server
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run preview   # preview production build locally
```

### Stack
- React 19 + TypeScript + Vite 7
- React Router DOM 7 (`BrowserRouter` with `basename={import.meta.env.BASE_URL}`)
- Tailwind CSS v4 — **CSS-first config**, no `tailwind.config.ts`. All design tokens live in the `@theme` block inside `src/index.css`. Use CSS custom properties (`var(--color-brand)` etc.) for inline styles.
- No state management library — local `useState`/`useRef`/`useEffect` only

### Key files
- `src/brand.ts` — single source of truth for name constants (`BRAND_NAME`, `BRAND_HANDLE`). Import from here, never hardcode.
- `src/index.css` — Tailwind import + full design token palette (brand red, dark backgrounds, text colors, border)
- `src/main.tsx` — router setup, all routes defined here. Wraps routes in an `<App>` that calls `usePageTracking()`.
- `src/pages/Home.tsx` — most complex page; SVG clip-path organic reveal effect driven by `requestAnimationFrame`
- `src/pages/Dashboard.tsx` — analytics dashboard. Token-gated (Bearer auth to the Worker), token stored in `localStorage`.
- `src/lib/analytics.ts` — `usePageTracking()` hook. Fires `POST /e` to the Worker on every route change via `fetch keepalive` (not `sendBeacon` — CORS credentials issues). Skips `/dashboard` so the dashboard doesn't track itself.

### Env vars
- `VITE_ANALYTICS_URL` — base URL of the Cloudflare Worker (no trailing slash). Without it, the tracking hook is a no-op (this is fine, the page still works). Loaded from `frontend/.env` locally and from the `VITE_ANALYTICS_URL` GitHub Actions secret in CI.

### Routing
All routes are in `main.tsx`. The 404 catch-all uses `<Route path="*" element={<NotFound />} />`. GitHub Pages SPA fallback is handled by copying `dist/index.html` → `dist/404.html` in CI.

### Design tokens (from `src/index.css`)
```
--color-brand / --color-brand-light / --color-brand-dark   (red scale)
--color-bg / --color-surface / --color-surface-2           (dark backgrounds)
--color-text / --color-text-muted                          (text)
--color-border                                             (#333)
```

### Home page reveal mechanic
`src/pages/Home.tsx` renders two stacked PNGs (face underneath, helmet on top). An SVG `<clipPath>` with `clipRule="evenodd"` punches an organic hole in the helmet layer where the cursor is, revealing the face. The hole shape is computed via polar coordinates + 5 overlapping sine waves that morph over time. Morphing speed scales with cursor velocity (`speedRef`).

## Analytics (Cloudflare Worker + D1)

Lives in `analytics/`. Worker is deployed at `https://marco-edge.racermarco20.workers.dev` (worker name `marco-edge`, D1 binding `DB` → DB name `marco-analytics`).

### Naming convention — IMPORTANT
The Worker and its paths use **adblocker-neutral names** because uBlock Origin / EasyPrivacy block hosts and URLs containing words like `analytics`, `track`, `tracker`, `stats`. Do not rename to anything that triggers those filters.

- Worker hostname: `marco-edge` (not `marco-analytics`)
- Endpoints: `POST /e` (event ingest), `GET /s` (stats query). Health: `GET /` returns `ok`.

### Schema (`analytics/schema.sql`)
One table `page_views`: `ts, path, referrer, country, city, ua_browser, ua_os, ua_device, session_id`.

### Commands (run inside `analytics/`)
```
npm run dev            # local Worker on :8787
npm run deploy         # wrangler deploy
npm run db:init        # apply schema.sql to remote D1
npm run db:init:local  # apply schema.sql to local D1
```

### Config
- `wrangler.toml` — Worker name, D1 binding (with `database_id`), `ALLOWED_ORIGINS` (comma-separated; currently `racermarco20.at`, `www.racermarco20.at`, `racermarco20.github.io`, `localhost:5173`).
- `DASHBOARD_TOKEN` — Wrangler secret, password for the `/dashboard` frontend. Set with `wrangler secret put DASHBOARD_TOKEN`.

### Auth model
Tracking is anonymous and public (CORS-restricted to known origins). The `/s` stats endpoint requires `Authorization: Bearer <DASHBOARD_TOKEN>`. The `/dashboard` frontend asks for the token on first visit and stores it in `localStorage`.

### CORS quirks
- Use `fetch` with `credentials: 'omit'` and `keepalive: true` from the frontend. **Don't use `sendBeacon`** — it forces credentials and breaks the preflight against this Worker.
- Worker handles OPTIONS preflight and echoes the requesting Origin back if it's in `ALLOWED_ORIGINS`.

## Backend

### Commands (run inside `backend/`)
```
./mvnw spring-boot:run   # run locally
./mvnw package           # build JAR
./mvnw test              # run tests
```

### Stack
- Spring Boot 3.5 / Java 21
- Spring Security (OAuth2 authorization server + resource server + client)
- Spring Data JPA + MySQL
- Lombok

### Configuration
All sensitive config is env-var driven (no defaults for DB):
- `DB_URL`, `DB_USER`, `DB_PASS` — required
- `PORT` (default 8080), `DB_POOL_SIZE` (default 10), `DDL_AUTO` (default `update`)

### Docker
Multi-stage build in `backend/Dockerfile` — Maven build stage, then slim JRE runtime image.

## Deployment

- **Frontend**: CI `.github/workflows/pages.yml` — triggers on push to `main`, builds frontend with `VITE_ANALYTICS_URL` from the repo secret, deploys to GitHub Pages. Custom domain `racermarco20.at` is configured at GitHub Pages → DNS at the domain registrar.
- **Analytics Worker**: deployed manually with `npm run deploy` inside `analytics/`. Not in CI (Wrangler needs an authenticated Cloudflare session).
- **Backend**: not deployed. Dockerfile exists for future use.

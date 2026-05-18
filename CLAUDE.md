# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with two independent parts:

- `frontend/` — React SPA, deployed to GitHub Pages
- `backend/` — Spring Boot REST API, deployed via Docker (Render or similar)

They are **not connected at build time** — the frontend is statically hosted and talks to the backend via HTTP.

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
- `src/main.tsx` — router setup, all routes defined here
- `src/pages/Home.tsx` — most complex page; SVG clip-path organic reveal effect driven by `requestAnimationFrame`

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

CI: `.github/workflows/pages.yml` — triggers on push to `main`, builds frontend, deploys to GitHub Pages.  
Backend: deployed separately via Docker image (not part of CI pipeline).

# Analytics — Cloudflare Worker + D1

Tiny tracking backend for the frontend. Runs serverless on Cloudflare's edge, stores page-views in D1 (SQLite), and serves an aggregated `/stats` endpoint that the `/dashboard` page in the frontend consumes.

```
Visitor browser ──POST /track──► Cloudflare Worker ──► D1 (SQLite)
                                       ▲
                                       │ GET /stats  (Bearer token)
                                       │
                                Your /dashboard route
```

Cost: **0 €** at expected traffic (Workers free tier = 100k req/day, D1 free tier = 5 GB + 5M reads/day).

---

## Was du einmalig tun musst

### 1. Cloudflare-Account + Wrangler

```bash
# Wenn noch nicht installiert
npm install -g wrangler

cd analytics
npm install
wrangler login          # öffnet Browser, einmal einloggen
```

### 2. D1-Datenbank anlegen

```bash
wrangler d1 create marco-analytics
```

Wrangler gibt eine `database_id` aus. Kopier sie in `wrangler.toml` an die Stelle `REPLACE_WITH_D1_DATABASE_ID`.

### 3. Schema in D1 laden

```bash
npm run db:init
```

### 4. Dashboard-Token setzen

Das ist das Passwort für `/dashboard`. Denk dir einen langen String aus (z. B. via `openssl rand -hex 32` oder einfach 30+ random Zeichen).

```bash
wrangler secret put DASHBOARD_TOKEN
# Wrangler fragt nach dem Wert — eingeben, fertig.
```

### 5. ALLOWED_ORIGINS prüfen

In `wrangler.toml` sind aktuell `https://racermarco20.github.io` und `http://localhost:5173` erlaubt. Wenn du eine eigene Domain hast, dort ergänzen.

### 6. Deploy

```bash
npm run deploy
```

Wrangler druckt die Worker-URL, z. B. `https://marco-analytics.<dein-account>.workers.dev`. **Diese URL brauchst du gleich.**

### 7. Frontend mit der Worker-URL bauen

Lokal:
```bash
cd ../frontend
cp .env.example .env
# .env editieren: VITE_ANALYTICS_URL=https://marco-analytics.<dein-account>.workers.dev
npm run dev
```

Für GitHub Pages: In den Repo-Settings → **Secrets and variables → Actions → New repository secret**:
- Name: `VITE_ANALYTICS_URL`
- Value: die Worker-URL

Beim nächsten `git push` baut die CI mit der URL und Tracking ist live.

### 8. Dashboard öffnen

- Lokal: http://localhost:5173/dashboard
- Live: https://racermarco20.github.io/dashboard
- Login mit dem `DASHBOARD_TOKEN` aus Schritt 4.

---

## Lokal entwickeln am Worker

```bash
cd analytics
npm run dev          # startet Worker auf http://localhost:8787
npm run db:init:local # Schema in lokale D1
```

In `frontend/.env`:
```
VITE_ANALYTICS_URL=http://localhost:8787
```

## Daten ansehen ohne Dashboard

```bash
wrangler d1 execute marco-analytics --remote --command "SELECT path, COUNT(*) FROM page_views GROUP BY path"
```

## Token vergessen?

```bash
wrangler secret put DASHBOARD_TOKEN   # überschreibt den alten
```

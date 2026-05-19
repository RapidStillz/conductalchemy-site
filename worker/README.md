# Conduct Alchemy — Cloudflare Worker

This Worker provides a lightweight backend for the private-track unlock system.  
It stores unlock submissions in **Cloudflare KV** (free tier) and exposes two endpoints:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/unlock` | Submit an unlock record |
| GET | `/api/unlock` | Retrieve all submissions (admin) |
| GET | `/api/health` | Health check |

---

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- A [Cloudflare account](https://dash.cloudflare.com) (free tier is sufficient)
- Wrangler CLI (installed as a dev dependency)

---

## Setup

### 1. Install dependencies

```bash
cd worker
npm install
```

### 2. Authenticate Wrangler

```bash
npx wrangler login
```

### 3. Create the KV namespace

```bash
npx wrangler kv:namespace create UNLOCK_STORE
npx wrangler kv:namespace create UNLOCK_STORE --preview
```

Copy the two `id` values printed by Wrangler and paste them into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "UNLOCK_STORE"
id = "YOUR_PRODUCTION_KV_ID"
preview_id = "YOUR_PREVIEW_KV_ID"
```

### 4. Deploy

```bash
npm run deploy
```

Note the Worker URL printed after deploy, e.g.:  
`https://conduct-alchemy-worker.YOUR-ACCOUNT.workers.dev`

---

## Connect the frontend

In your Cloudflare Pages project settings, add an environment variable:

```
VITE_WORKER_URL = https://conduct-alchemy-worker.YOUR-ACCOUNT.workers.dev
```

Rebuild and redeploy the Pages site. Unlock submissions will now be sent to the
Worker and persisted in KV. The admin page (`/admin`) will display all submissions
fetched live from the Worker.

---

## Local development (without a deployed Worker)

Leave `VITE_WORKER_URL` unset (or empty). The frontend automatically falls back
to **localStorage mock mode** — submissions are stored in the browser and visible
in the admin Access Log tab, with no Worker calls made.

This means the site works fully on Cloudflare Pages free tier with zero backend
cost until you choose to deploy the Worker.

---

## KV data format

Each submission is stored as a JSON object under a key like:
```
submission:2025-05-02T12:00:00.000Z:abc123def
```

An ordered index is maintained under the key `__submission_index__`.

---

## CORS

The Worker allows all origins (`*`). If you want to restrict to your Pages domain,
replace `"Access-Control-Allow-Origin": "*"` with your domain in `src/index.ts`.

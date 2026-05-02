/**
 * API configuration for the Cloudflare Worker backend.
 *
 * On Cloudflare Pages, set the environment variable VITE_WORKER_URL to
 * your deployed Worker URL, e.g.:
 *   VITE_WORKER_URL=https://conduct-alchemy-worker.your-account.workers.dev
 *
 * When VITE_WORKER_URL is not set (or empty), the app runs in local-only
 * mock mode — all unlock submissions are stored in localStorage and the
 * Worker endpoints are never called.
 */
export const WORKER_URL: string =
  (import.meta.env.VITE_WORKER_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export const API_BASE = WORKER_URL;
export const IS_MOCK_MODE = !WORKER_URL;

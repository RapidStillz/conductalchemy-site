/**
 * Conduct Alchemy — Cloudflare Worker
 *
 * Endpoints:
 *   POST /api/unlock   — store an unlock submission in KV
 *   GET  /api/unlock   — retrieve all submissions (admin)
 *   OPTIONS *          — CORS preflight
 *
 * KV Binding required: UNLOCK_STORE
 * See wrangler.toml for binding configuration.
 */

export interface Env {
  UNLOCK_STORE: KVNamespace;
}

/** Index key that stores an ordered list of all submission keys. */
const INDEX_KEY = "__submission_index__";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function err(message: string, status: number): Response {
  return json({ ok: false, error: message }, status);
}

// ---------------------------------------------------------------------------
// POST /api/unlock
// ---------------------------------------------------------------------------
async function handlePost(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  // Basic validation
  const required = ["trackId", "trackTitle", "name", "email", "intendedUse"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string") {
      return err(`Missing or invalid field: ${field}`, 422);
    }
  }

  const id =
    (body.id as string | undefined) ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    id,
    trackId: body.trackId,
    trackTitle: body.trackTitle,
    name: body.name,
    email: body.email,
    intendedUse: body.intendedUse,
    termsAccepted: !!body.termsAccepted,
    timestamp: (body.timestamp as string) || new Date().toISOString(),
    userAgent: (body.userAgent as string | undefined) ?? null,
    source: "api",
  };

  const key = `submission:${record.timestamp}:${id}`;

  // Store the record
  await env.UNLOCK_STORE.put(key, JSON.stringify(record), {
    // Keep submissions indefinitely (remove expirationTtl to persist forever)
  });

  // Update the ordered index
  const indexRaw = await env.UNLOCK_STORE.get(INDEX_KEY);
  const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
  index.push(key);
  await env.UNLOCK_STORE.put(INDEX_KEY, JSON.stringify(index));

  return json({ ok: true, id }, 201);
}

// ---------------------------------------------------------------------------
// GET /api/unlock
// ---------------------------------------------------------------------------
async function handleGet(env: Env): Promise<Response> {
  const indexRaw = await env.UNLOCK_STORE.get(INDEX_KEY);
  if (!indexRaw) {
    return json([]);
  }

  const index: string[] = JSON.parse(indexRaw);

  // Fetch all records in parallel
  const settled = await Promise.allSettled(
    index.map((key) => env.UNLOCK_STORE.get(key))
  );

  const records = settled
    .map((r) => (r.status === "fulfilled" && r.value ? JSON.parse(r.value) : null))
    .filter(Boolean);

  // Return newest first
  records.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return json(records);
}

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { method, pathname } = { method: request.method, pathname: url.pathname };

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (pathname === "/api/unlock") {
      if (method === "POST") return handlePost(request, env);
      if (method === "GET") return handleGet(env);
      return err("Method not allowed", 405);
    }

    // Health check
    if (pathname === "/api/health") {
      return json({ ok: true, timestamp: new Date().toISOString() });
    }

    return err("Not found", 404);
  },
};

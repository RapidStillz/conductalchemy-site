import type { ApiResponse, Asset, Decision, Knowledge, Project, Relationship } from "./domain";

interface Env {
  STUDIO_OS_DB: D1Database;
  FOUNDER_TOKEN: string;
}

const json = <T>(body: ApiResponse<T>, status = 200): Response =>
  Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    },
  });

const now = (): string => new Date().toISOString();
const id = (): string => crypto.randomUUID();

function authorise(request: Request, env: Env): boolean {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(token && token === env.FOUNDER_TOKEN);
}

async function parseBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function humanId(prefix: string): string {
  return `${prefix}-${Date.now().toString().slice(-6)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

async function listProjects(env: Env): Promise<Response> {
  const result = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, title, summary, status, health,
            owner_id AS ownerId, priority, created_at AS createdAt,
            updated_at AS updatedAt, archived_at AS archivedAt
       FROM projects
      WHERE archived_at IS NULL
      ORDER BY priority ASC, updated_at DESC`,
  ).all<Project>();
  return json({ success: true, data: result.results ?? [] });
}

async function createProject(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Project>>(request);
  if (!body.title?.trim()) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Project title is required." } }, 400);
  }

  const projectId = id();
  const timestamp = now();
  const projectHumanId = body.humanId ?? humanId("PRJ");
  const ownerId = body.ownerId ?? "founder";

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO projects
       (id, human_id, title, summary, status, health, owner_id, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(projectId, projectHumanId, body.title.trim(), body.summary ?? "", body.status ?? "active", body.health ?? "healthy", ownerId, body.priority ?? 3, timestamp, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'PROJECT_CREATED', 'project', ?, ?, ?, ?)`,
    ).bind(id(), projectId, ownerId, JSON.stringify({ title: body.title, humanId: projectHumanId }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'PROJECT_CREATED', 'project', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, projectId, "Created through Studio OS API", JSON.stringify(body), timestamp),
  ]);

  const created = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, title, summary, status, health, owner_id AS ownerId,
            priority, created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
       FROM projects WHERE id = ?`,
  ).bind(projectId).first<Project>();
  return json({ success: true, data: created as Project }, 201);
}

async function listAssets(env: Env): Promise<Response> {
  const result = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType,
            title, summary, status, version, owner_id AS ownerId,
            created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
       FROM assets WHERE archived_at IS NULL ORDER BY updated_at DESC`,
  ).all<Asset>();
  return json({ success: true, data: result.results ?? [] });
}

async function createAsset(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Asset>>(request);
  if (!body.title?.trim() || !body.assetType?.trim()) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Asset title and type are required." } }, 400);
  }

  const assetId = id();
  const timestamp = now();
  const assetHumanId = body.humanId ?? humanId("AST");
  const ownerId = body.ownerId ?? "founder";

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO assets
       (id, human_id, project_id, asset_type, title, summary, status, version, owner_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(assetId, assetHumanId, body.projectId ?? null, body.assetType.trim(), body.title.trim(), body.summary ?? "", body.status ?? "active", body.version ?? 1, ownerId, timestamp, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'ASSET_CREATED', 'asset', ?, ?, ?, ?)`,
    ).bind(id(), assetId, ownerId, JSON.stringify({ title: body.title, humanId: assetHumanId }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'ASSET_CREATED', 'asset', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, assetId, "Creative asset added", JSON.stringify(body), timestamp),
  ]);

  const created = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType,
            title, summary, status, version, owner_id AS ownerId,
            created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
       FROM assets WHERE id = ?`,
  ).bind(assetId).first<Asset>();
  return json({ success: true, data: created as Asset }, 201);
}

async function listDecisions(env: Env): Promise<Response> {
  const result = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, title, decision, rationale, status, owner_id AS ownerId,
            review_date AS reviewDate, created_at AS createdAt, updated_at AS updatedAt
       FROM decisions ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, updated_at DESC`,
  ).all<Decision>();
  return json({ success: true, data: result.results ?? [] });
}

async function createDecision(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Decision>>(request);
  if (!body.title?.trim() || !body.decision?.trim() || !body.rationale?.trim()) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Decision title, proposal and rationale are required." } }, 400);
  }
  const decisionId = id();
  const timestamp = now();
  const ownerId = body.ownerId ?? "founder";
  const decisionHumanId = body.humanId ?? humanId("DEC");
  const status = body.status ?? "open";

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO decisions (id, human_id, title, decision, rationale, status, owner_id, review_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(decisionId, decisionHumanId, body.title.trim(), body.decision.trim(), body.rationale.trim(), status, ownerId, body.reviewDate ?? null, timestamp, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, ?, 'decision', ?, ?, ?, ?)`,
    ).bind(id(), status === "open" ? "FOUNDER_APPROVAL_REQUIRED" : "DECISION_CREATED", decisionId, ownerId, JSON.stringify({ title: body.title }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'DECISION_CREATED', 'decision', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, decisionId, body.rationale.trim(), JSON.stringify(body), timestamp),
  ]);
  return json({ success: true, data: { id: decisionId, humanId: decisionHumanId, status } }, 201);
}

async function confirmDecision(decisionId: string, env: Env): Promise<Response> {
  const timestamp = now();
  const existing = await env.STUDIO_OS_DB.prepare(`SELECT * FROM decisions WHERE id = ?`).bind(decisionId).first();
  if (!existing) return json({ success: false, error: { code: "NOT_FOUND", message: "Decision not found." } }, 404);

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(`UPDATE decisions SET status = 'confirmed', updated_at = ? WHERE id = ?`).bind(timestamp, decisionId),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'DECISION_APPROVED', 'decision', ?, 'founder', '{}', ?)`,
    ).bind(id(), decisionId, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log (id, actor_id, action, entity_type, entity_id, reason, before_json, after_json, created_at)
       VALUES (?, 'founder', 'DECISION_APPROVED', 'decision', ?, 'Founder confirmed decision', ?, ?, ?)`,
    ).bind(id(), decisionId, JSON.stringify(existing), JSON.stringify({ ...existing, status: "confirmed" }), timestamp),
  ]);
  return json({ success: true, data: { id: decisionId, status: "confirmed" } });
}

async function listKnowledge(env: Env): Promise<Response> {
  const result = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, title, summary, knowledge_type AS knowledgeType, confidence,
            status, owner_id AS ownerId, review_date AS reviewDate, created_at AS createdAt, updated_at AS updatedAt
       FROM knowledge ORDER BY updated_at DESC`,
  ).all<Knowledge>();
  return json({ success: true, data: result.results ?? [] });
}

async function createKnowledge(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Knowledge>>(request);
  if (!body.title?.trim() || !body.summary?.trim() || !body.knowledgeType) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Knowledge title, summary and type are required." } }, 400);
  }
  const knowledgeId = id();
  const timestamp = now();
  const ownerId = body.ownerId ?? "founder";
  const knowledgeHumanId = body.humanId ?? humanId("KNW");

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO knowledge (id, human_id, title, summary, knowledge_type, confidence, status, owner_id, review_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(knowledgeId, knowledgeHumanId, body.title.trim(), body.summary.trim(), body.knowledgeType, body.confidence ?? "validated", body.status ?? "active", ownerId, body.reviewDate ?? null, timestamp, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'KNOWLEDGE_ADDED', 'knowledge', ?, ?, ?, ?)`,
    ).bind(id(), knowledgeId, ownerId, JSON.stringify({ title: body.title }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'KNOWLEDGE_ADDED', 'knowledge', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, knowledgeId, "Institutional knowledge captured", JSON.stringify(body), timestamp),
  ]);
  return json({ success: true, data: { id: knowledgeId, humanId: knowledgeHumanId } }, 201);
}

async function createRelationship(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Relationship>>(request);
  if (!body.sourceType || !body.sourceId || !body.relationshipType || !body.targetType || !body.targetId) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Complete source, relationship and target details are required." } }, 400);
  }
  const relationshipId = id();
  const timestamp = now();
  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO relationships (id, source_type, source_id, relationship_type, target_type, target_id, confidence, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(relationshipId, body.sourceType, body.sourceId, body.relationshipType, body.targetType, body.targetId, body.confidence ?? 1, body.notes ?? "", timestamp, timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'RELATIONSHIP_CREATED', 'relationship', ?, 'founder', ?, ?)`,
    ).bind(id(), relationshipId, JSON.stringify(body), timestamp),
  ]);
  return json({ success: true, data: { id: relationshipId } }, 201);
}

async function dashboard(env: Env): Promise<Response> {
  const [projectRows, assetRows, decisionRows, knowledgeRows, activityRows] = await Promise.all([
    env.STUDIO_OS_DB.prepare(`SELECT id, human_id AS humanId, title, summary, status, health, owner_id AS ownerId, priority, created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt FROM projects WHERE archived_at IS NULL ORDER BY priority ASC, updated_at DESC LIMIT 8`).all<Project>(),
    env.STUDIO_OS_DB.prepare(`SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType, title, summary, status, version, owner_id AS ownerId, created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt FROM assets WHERE archived_at IS NULL ORDER BY updated_at DESC LIMIT 8`).all<Asset>(),
    env.STUDIO_OS_DB.prepare(`SELECT id, human_id AS humanId, title, decision, rationale, status, owner_id AS ownerId, review_date AS reviewDate, created_at AS createdAt, updated_at AS updatedAt FROM decisions WHERE status = 'open' ORDER BY updated_at DESC LIMIT 8`).all<Decision>(),
    env.STUDIO_OS_DB.prepare(`SELECT COUNT(*) AS count FROM knowledge WHERE status IN ('active','validated')`).first<{ count: number }>(),
    env.STUDIO_OS_DB.prepare(`SELECT id, action, entity_type AS entityType, reason, created_at AS createdAt FROM activity_log ORDER BY created_at DESC LIMIT 10`).all(),
  ]);

  const projects = projectRows.results ?? [];
  const recentAssets = assetRows.results ?? [];
  const waitingDecisions = decisionRows.results ?? [];
  const blocked = projects.find((project) => project.health === "blocked");
  const attention = projects.find((project) => project.health === "attention");
  const priorityProject = blocked ?? attention ?? projects[0];
  const priority = waitingDecisions[0]
    ? { title: waitingDecisions[0].title, rationale: "Founder confirmation is required before dependent work should continue.", projectId: null }
    : priorityProject
      ? { title: priorityProject.title, rationale: priorityProject.summary || "Advance the highest-priority active project.", projectId: priorityProject.id }
      : { title: "Create the first project", rationale: "Studio OS needs an active project to coordinate.", projectId: null };

  return json({ success: true, data: {
    generatedAt: now(),
    counts: { activeProjects: projects.length, assets: recentAssets.length, waitingDecisions: waitingDecisions.length, knowledgeItems: knowledgeRows?.count ?? 0 },
    projects,
    recentAssets,
    waitingDecisions,
    recentActivity: activityRows.results ?? [],
    priority,
  } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { status: 204 });
    if (!authorise(request, env)) return json({ success: false, error: { code: "UNAUTHORISED", message: "A valid Founder token is required." } }, 401);

    const { pathname } = new URL(request.url);
    try {
      if (pathname === "/api/health" && request.method === "GET") return json({ success: true, data: { service: "studio-os", status: "healthy", checkedAt: now() } });
      if (pathname === "/api/dashboard" && request.method === "GET") return dashboard(env);
      if (pathname === "/api/projects" && request.method === "GET") return listProjects(env);
      if (pathname === "/api/projects" && request.method === "POST") return createProject(request, env);
      if (pathname === "/api/assets" && request.method === "GET") return listAssets(env);
      if (pathname === "/api/assets" && request.method === "POST") return createAsset(request, env);
      if (pathname === "/api/decisions" && request.method === "GET") return listDecisions(env);
      if (pathname === "/api/decisions" && request.method === "POST") return createDecision(request, env);
      if (/^\/api\/decisions\/[^/]+\/confirm$/.test(pathname) && request.method === "PATCH") return confirmDecision(pathname.split("/")[3], env);
      if (pathname === "/api/knowledge" && request.method === "GET") return listKnowledge(env);
      if (pathname === "/api/knowledge" && request.method === "POST") return createKnowledge(request, env);
      if (pathname === "/api/relationships" && request.method === "POST") return createRelationship(request, env);
      return json({ success: false, error: { code: "NOT_FOUND", message: "Route not found." } }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return json({ success: false, error: { code: "INTERNAL_ERROR", message } }, 500);
    }
  },
};
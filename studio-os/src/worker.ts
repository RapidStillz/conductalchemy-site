import type { ApiResponse, Asset, Project } from "./domain";

interface Env {
  STUDIO_OS_DB: D1Database;
  FOUNDER_TOKEN: string;
}

interface DashboardSummary {
  generatedAt: string;
  counts: {
    activeProjects: number;
    assets: number;
    waitingDecisions: number;
    knowledgeItems: number;
  };
  projects: Project[];
  recentAssets: Asset[];
  recentActivity: Array<{
    id: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    reason: string | null;
    createdAt: string;
  }>;
  priority: {
    title: string;
    rationale: string;
    projectId: string | null;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = <T>(body: ApiResponse<T>, status = 200): Response =>
  Response.json(body, { status, headers: corsHeaders });

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

async function listAssets(env: Env): Promise<Response> {
  const result = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType,
            title, summary, status, version, owner_id AS ownerId,
            created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
       FROM assets
      WHERE archived_at IS NULL
      ORDER BY updated_at DESC
      LIMIT 100`,
  ).all<Asset>();

  return json({ success: true, data: result.results ?? [] });
}

async function getDashboard(env: Env): Promise<Response> {
  const [counts, projects, recentAssets, recentActivity] = await Promise.all([
    env.STUDIO_OS_DB.prepare(
      `SELECT
        (SELECT COUNT(*) FROM projects WHERE archived_at IS NULL AND status = 'active') AS activeProjects,
        (SELECT COUNT(*) FROM assets WHERE archived_at IS NULL) AS assets,
        (SELECT COUNT(*) FROM decisions WHERE archived_at IS NULL AND status IN ('proposed', 'waiting')) AS waitingDecisions,
        (SELECT COUNT(*) FROM knowledge WHERE archived_at IS NULL) AS knowledgeItems`,
    ).first<DashboardSummary["counts"]>(),
    env.STUDIO_OS_DB.prepare(
      `SELECT id, human_id AS humanId, title, summary, status, health,
              owner_id AS ownerId, priority, created_at AS createdAt,
              updated_at AS updatedAt, archived_at AS archivedAt
         FROM projects
        WHERE archived_at IS NULL
        ORDER BY priority ASC, updated_at DESC
        LIMIT 6`,
    ).all<Project>(),
    env.STUDIO_OS_DB.prepare(
      `SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType,
              title, summary, status, version, owner_id AS ownerId,
              created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
         FROM assets
        WHERE archived_at IS NULL
        ORDER BY updated_at DESC
        LIMIT 8`,
    ).all<Asset>(),
    env.STUDIO_OS_DB.prepare(
      `SELECT id, actor_id AS actorId, action, entity_type AS entityType,
              entity_id AS entityId, reason, created_at AS createdAt
         FROM activity_log
        ORDER BY created_at DESC
        LIMIT 12`,
    ).all<DashboardSummary["recentActivity"][number]>(),
  ]);

  const projectList = projects.results ?? [];
  const topProject = projectList[0] ?? null;
  const data: DashboardSummary = {
    generatedAt: now(),
    counts: counts ?? { activeProjects: 0, assets: 0, waitingDecisions: 0, knowledgeItems: 0 },
    projects: projectList,
    recentAssets: recentAssets.results ?? [],
    recentActivity: recentActivity.results ?? [],
    priority: topProject
      ? {
          title: topProject.title,
          rationale: topProject.summary || "Highest-priority active project in Studio OS.",
          projectId: topProject.id,
        }
      : {
          title: "Create the first Studio OS project",
          rationale: "The dashboard will recommend the next action once project data exists.",
          projectId: null,
        },
  };

  return json({ success: true, data });
}

async function createProject(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Project>>(request);
  if (!body.title?.trim()) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Project title is required." } }, 400);
  }

  const projectId = id();
  const timestamp = now();
  const humanId = body.humanId ?? `PRJ-${Date.now().toString().slice(-6)}`;
  const ownerId = body.ownerId ?? "founder";

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO projects
       (id, human_id, title, summary, status, health, owner_id, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      projectId,
      humanId,
      body.title.trim(),
      body.summary ?? "",
      body.status ?? "active",
      body.health ?? "healthy",
      ownerId,
      body.priority ?? 3,
      timestamp,
      timestamp,
    ),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events
       (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'PROJECT_CREATED', 'project', ?, ?, ?, ?)`,
    ).bind(id(), projectId, ownerId, JSON.stringify({ title: body.title, humanId }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log
       (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'PROJECT_CREATED', 'project', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, projectId, "Created through Studio OS API", JSON.stringify(body), timestamp),
  ]);

  const created = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, title, summary, status, health,
            owner_id AS ownerId, priority, created_at AS createdAt,
            updated_at AS updatedAt, archived_at AS archivedAt
       FROM projects WHERE id = ?`,
  ).bind(projectId).first<Project>();

  return json({ success: true, data: created as Project }, 201);
}

async function createAsset(request: Request, env: Env): Promise<Response> {
  const body = await parseBody<Partial<Asset>>(request);
  if (!body.title?.trim() || !body.assetType?.trim()) {
    return json({ success: false, error: { code: "VALIDATION_ERROR", message: "Asset title and type are required." } }, 400);
  }

  const assetId = id();
  const timestamp = now();
  const humanId = body.humanId ?? `AST-${Date.now().toString().slice(-6)}`;
  const ownerId = body.ownerId ?? "founder";

  await env.STUDIO_OS_DB.batch([
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO assets
       (id, human_id, project_id, asset_type, title, summary, status, version, owner_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      assetId,
      humanId,
      body.projectId ?? null,
      body.assetType.trim(),
      body.title.trim(),
      body.summary ?? "",
      body.status ?? "active",
      body.version ?? 1,
      ownerId,
      timestamp,
      timestamp,
    ),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO events
       (id, event_type, entity_type, entity_id, actor_id, payload_json, created_at)
       VALUES (?, 'ASSET_CREATED', 'asset', ?, ?, ?, ?)`,
    ).bind(id(), assetId, ownerId, JSON.stringify({ title: body.title, humanId }), timestamp),
    env.STUDIO_OS_DB.prepare(
      `INSERT INTO activity_log
       (id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
       VALUES (?, ?, 'ASSET_CREATED', 'asset', ?, ?, ?, ?)`,
    ).bind(id(), ownerId, assetId, "Created through Studio OS API", JSON.stringify(body), timestamp),
  ]);

  const created = await env.STUDIO_OS_DB.prepare(
    `SELECT id, human_id AS humanId, project_id AS projectId, asset_type AS assetType,
            title, summary, status, version, owner_id AS ownerId,
            created_at AS createdAt, updated_at AS updatedAt, archived_at AS archivedAt
       FROM assets WHERE id = ?`,
  ).bind(assetId).first<Asset>();

  return json({ success: true, data: created as Asset }, 201);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
    if (!authorise(request, env)) {
      return json({ success: false, error: { code: "UNAUTHORISED", message: "A valid Founder token is required." } }, 401);
    }

    const { pathname } = new URL(request.url);

    try {
      if (pathname === "/api/dashboard" && request.method === "GET") return getDashboard(env);
      if (pathname === "/api/projects" && request.method === "GET") return listProjects(env);
      if (pathname === "/api/projects" && request.method === "POST") return createProject(request, env);
      if (pathname === "/api/assets" && request.method === "GET") return listAssets(env);
      if (pathname === "/api/assets" && request.method === "POST") return createAsset(request, env);
      if (pathname === "/api/health" && request.method === "GET") {
        return json({ success: true, data: { service: "studio-os", status: "healthy", checkedAt: now() } });
      }

      return json({ success: false, error: { code: "NOT_FOUND", message: "Route not found." } }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return json({ success: false, error: { code: "INTERNAL_ERROR", message } }, 500);
    }
  },
};

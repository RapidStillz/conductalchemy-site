import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertCircle, Archive, Brain, CheckCircle2, FolderKanban, Gavel, RefreshCw, Sparkles } from "lucide-react";
import "./styles.css";

type Health = "healthy" | "attention" | "blocked";

type Project = { id: string; humanId: string; title: string; summary: string; status: string; health: Health; priority: number; updatedAt: string };
type Asset = { id: string; humanId: string; projectId: string | null; assetType: string; title: string; summary: string; status: string; version: number; updatedAt: string };
type Activity = { id: string; action: string; entityType: string; reason: string | null; createdAt: string };
type Decision = { id: string; humanId: string; title: string; decision: string; rationale: string; status: string; updatedAt: string };

type DashboardData = {
  generatedAt: string;
  counts: { activeProjects: number; assets: number; waitingDecisions: number; knowledgeItems: number };
  projects: Project[];
  recentAssets: Asset[];
  waitingDecisions: Decision[];
  recentActivity: Activity[];
  priority: { title: string; rationale: string; projectId: string | null };
};

type ApiResponse<T> = { success: boolean; data?: T; error?: { message: string } };
const API_URL = import.meta.env.VITE_STUDIO_OS_API_URL ?? "http://localhost:8787";

function relativeTime(value: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function healthLabel(health: Health) {
  if (health === "blocked") return { text: "Blocked", icon: AlertCircle };
  if (health === "attention") return { text: "Needs attention", icon: AlertCircle };
  return { text: "Healthy", icon: CheckCircle2 };
}

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("studio-os-token") ?? "");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }, []);

  async function loadDashboard() {
    if (!token.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/dashboard`, { headers: { Authorization: `Bearer ${token.trim()}` } });
      const payload = (await response.json()) as ApiResponse<DashboardData>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error?.message ?? "Unable to load Studio OS.");
      sessionStorage.setItem("studio-os-token", token.trim());
      setData(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load Studio OS.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDecision(decisionId: string) {
    setConfirming(decisionId);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/decisions/${decisionId}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      const payload = (await response.json()) as ApiResponse<{ id: string }>;
      if (!response.ok || !payload.success) throw new Error(payload.error?.message ?? "Unable to confirm decision.");
      await loadDashboard();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to confirm decision.");
    } finally {
      setConfirming(null);
    }
  }

  useEffect(() => { if (token) void loadDashboard(); }, []);

  if (!data) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="mark"><Sparkles size={22} /></div>
          <p className="eyebrow">Founder access</p>
          <h1>Studio OS</h1>
          <p className="muted">Your projects, assets, decisions and organisational memory in one place.</p>
          <label>Founder token
            <input type="password" value={token} onChange={(event) => setToken(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void loadDashboard()} placeholder="Enter development token" />
          </label>
          {error && <p className="error">{error}</p>}
          <button onClick={() => void loadDashboard()} disabled={loading || !token.trim()}>{loading ? "Opening…" : "Open Studio OS"}</button>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside>
        <div className="brand"><span className="mark"><Sparkles size={18} /></span><strong>Studio OS</strong></div>
        <nav>
          <a className="active"><FolderKanban size={18} />Dashboard</a>
          <a><Archive size={18} />Projects</a>
          <a><Sparkles size={18} />Assets</a>
          <a><Gavel size={18} />Decisions</a>
          <a><Brain size={18} />Knowledge</a>
        </nav>
        <p className="aside-note">Founder-controlled creative operating system.</p>
      </aside>

      <main className="dashboard">
        <header>
          <div><p className="eyebrow">Founder control centre</p><h1>{greeting}, Ash.</h1><p className="muted">Here is what needs your attention now.</p></div>
          <button className="secondary" onClick={() => void loadDashboard()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
        </header>

        {error && <p className="error banner-error">{error}</p>}

        <section className="priority-card">
          <div><p className="eyebrow">Today’s priority</p><h2>{data.priority.title}</h2><p>{data.priority.rationale}</p></div>
          <span>Recommended next action</span>
        </section>

        <section className="metrics">
          <article><span>Active projects</span><strong>{data.counts.activeProjects}</strong></article>
          <article><span>Assets</span><strong>{data.counts.assets}</strong></article>
          <article><span>Waiting decisions</span><strong>{data.counts.waitingDecisions}</strong></article>
          <article><span>Knowledge items</span><strong>{data.counts.knowledgeItems}</strong></article>
        </section>

        <section className="panel decisions-panel">
          <div className="panel-heading"><div><p className="eyebrow">Founder decision centre</p><h2>Waiting for your confirmation</h2></div><span>{data.waitingDecisions.length} open</span></div>
          <div className="decision-list">
            {data.waitingDecisions.length === 0 && <p className="empty">Nothing is waiting for founder approval.</p>}
            {data.waitingDecisions.map((decision) => (
              <article className="decision" key={decision.id}>
                <div><span>{decision.humanId}</span><h3>{decision.title}</h3><p className="proposal">{decision.decision}</p><p>{decision.rationale}</p></div>
                <button onClick={() => void confirmDecision(decision.id)} disabled={confirming === decision.id}>{confirming === decision.id ? "Confirming…" : "Confirm decision"}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid">
          <div className="panel projects-panel">
            <div className="panel-heading"><div><p className="eyebrow">Portfolio</p><h2>Projects</h2></div><span>{data.projects.length} shown</span></div>
            <div className="project-list">
              {data.projects.length === 0 && <p className="empty">No projects yet.</p>}
              {data.projects.map((project) => {
                const health = healthLabel(project.health); const Icon = health.icon;
                return <article className="project" key={project.id}><div><div className="project-title"><h3>{project.title}</h3><span className={`health ${project.health}`}><Icon size={14} />{health.text}</span></div><p>{project.summary || "No project summary yet."}</p></div><small>{project.humanId} · updated {relativeTime(project.updatedAt)}</small></article>;
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading"><div><p className="eyebrow">Live record</p><h2>Recent progress</h2></div></div>
            <div className="timeline">
              {data.recentActivity.length === 0 && <p className="empty">Activity will appear as work is recorded.</p>}
              {data.recentActivity.map((item) => <article key={item.id}><span className="timeline-dot" /><div><strong>{item.action.replaceAll("_", " ").toLowerCase()}</strong><p>{item.reason ?? item.entityType}</p><small>{relativeTime(item.createdAt)}</small></div></article>)}
            </div>
          </div>
        </section>

        <section className="panel assets-panel">
          <div className="panel-heading"><div><p className="eyebrow">Latest work</p><h2>Recent assets</h2></div></div>
          <div className="asset-grid">
            {data.recentAssets.length === 0 && <p className="empty">Create an asset to populate this view.</p>}
            {data.recentAssets.map((asset) => <article key={asset.id}><span>{asset.assetType}</span><h3>{asset.title}</h3><p>{asset.summary || "No summary yet."}</p><small>Version {asset.version} · {relativeTime(asset.updatedAt)}</small></article>)}
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
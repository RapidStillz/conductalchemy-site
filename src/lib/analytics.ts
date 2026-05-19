// ---------------------------------------------------------------------------
// Client-side page-view analytics — localStorage backed
// ---------------------------------------------------------------------------

export interface PageView {
  path: string;
  timestamp: string;
  referrer?: string;
  sessionId: string;
}

export interface DayStat {
  date: string;    // YYYY-MM-DD
  views: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueSessions: number;
  viewsByPath: { path: string; views: number }[];
  recentViews: PageView[];
  last30Days: DayStat[];
}

const KEY = "ca_pageviews";
const SESSION_KEY = "ca_analytics_session";
const MAX_STORED = 1000;

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "nosession";
  }
}

export function trackPageView(path: string): void {
  try {
    const view: PageView = {
      path,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || undefined,
      sessionId: getSessionId(),
    };
    const stored = getRawViews();
    stored.push(view);
    localStorage.setItem(KEY, JSON.stringify(stored.slice(-MAX_STORED)));
  } catch {
    // localStorage unavailable or full — silently skip
  }
}

function getRawViews(): PageView[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PageView[]) : [];
  } catch {
    return [];
  }
}

export function getPageViews(): PageView[] {
  return getRawViews();
}

export function clearPageViews(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const views = getRawViews();

  // Views by path
  const pathMap: Record<string, number> = {};
  const sessionSet = new Set<string>();

  for (const v of views) {
    pathMap[v.path] = (pathMap[v.path] || 0) + 1;
    sessionSet.add(v.sessionId);
  }

  const viewsByPath = Object.entries(pathMap)
    .map(([path, count]) => ({ path, views: count }))
    .sort((a, b) => b.views - a.views);

  // Last 30 days
  const now = new Date();
  const days: DayStat[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const count = views.filter((v) => v.timestamp.startsWith(date)).length;
    days.push({ date, views: count });
  }

  return {
    totalViews: views.length,
    uniqueSessions: sessionSet.size,
    viewsByPath,
    recentViews: [...views].reverse().slice(0, 25),
    last30Days: days,
  };
}

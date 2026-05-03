import {
  useState, useEffect, useCallback, useMemo,
  Component, type ReactNode,
} from "react";
import {
  Track, SiteContent, HeroStat, LogoItem, Testimonial,
  getTracks, saveTracks, getSiteContent, saveSiteContent,
  ACCESS_STATUS_OPTIONS, AccessStatus,
  GENRE_OPTIONS, MOOD_PRESETS, USE_CASE_PRESETS,
} from "@/lib/cms";
import {
  UnlockRecord, fetchSubmissions, getLocalSubmissions, revokeLocalAccess,
} from "@/lib/access";
import { IS_MOCK_MODE } from "@/lib/api-config";

// ---------------------------------------------------------------------------
// Error Boundary
// ---------------------------------------------------------------------------

interface EBState { hasError: boolean; message: string }

class AccessLogErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: unknown): EBState {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.error("[Access Log] Render error:", error, info);
  }
  handleReset = () => this.setState({ hasError: false, message: "" });
  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-red-500/30 bg-red-500/5 px-6 py-10 text-center">
          <p className="text-sm font-serif text-red-400 mb-2">The Access Log encountered a display error.</p>
          <p className="text-[10px] font-mono text-red-400/60 mb-6 max-w-lg mx-auto break-all">{this.state.message}</p>
          <button onClick={this.handleReset} className="text-xs uppercase tracking-widest border border-red-500/40 text-red-400 px-4 py-2 hover:bg-red-500/10 transition-colors">
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type AdminTab = "dashboard" | "catalogue" | "content" | "access-log";

const EMPTY_TRACK: Track = {
  id: "", title: "", artist: "Conduct Alchemy", genre: GENRE_OPTIONS[0],
  mood: [], bpm: 0, musicalKey: "", description: "", lyrics: "",
  licensingNotes: "", versions: [], visualConceptNotes: "", useCases: [],
  featured: false, heroTrack: false, featuredOrder: undefined,
  accessStatus: "Public", audioUrl: "", previewAudioUrl: "", videoUrl: "",
  coverArtUrl: "", collaborators: [],
  socialLinks: { youtube: "", instagram: "", spotify: "", soundcloud: "", tiktok: "" },
  createdAt: new Date().toISOString(),
};

const ACCESS_STATUS_COLORS: Record<AccessStatus, string> = {
  Public: "text-green-400 border-green-400/30 bg-green-400/5",
  Private: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  "NDA / Token Access Required": "text-red-400 border-red-400/30 bg-red-400/5",
};

const INTENDED_USES = ["Film", "TV", "TV Drama", "Advertising", "Game", "Game Trailers", "Sports", "Bollywood", "Digital", "YouTube", "Personal", "Other"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeFormatDate(ts: unknown): string {
  try {
    if (ts == null || ts === "") return "No date";
    const d = new Date(String(ts));
    if (isNaN(d.getTime())) return String(ts);
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(ts ?? "No date"); }
}

function exportCsv(records: UnlockRecord[]) {
  try {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const headers = ["ID","Track ID","Track Title","Name","Email","Intended Use","Terms","Timestamp","Source","User Agent"];
    const rows = records.map((r) => [esc(r.id),esc(r.trackId),esc(r.trackTitle),esc(r.name),esc(r.email),esc(r.intendedUse),r.termsAccepted?"Yes":"No",esc(r.timestamp),esc(r.source),esc(r.userAgent)].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ca-unlock-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) { console.error("[Admin] CSV export failed:", e); }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-border/40 bg-card/20 p-5">
      <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-muted-foreground mb-2">{label}</div>
      <div className="text-3xl font-serif">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground/60 font-sans mt-1">{sub}</div>}
    </div>
  );
}

function RecordRow({ rec, onRevoke }: { rec: UnlockRecord; onRevoke: (r: UnlockRecord) => void }) {
  try {
    const src = rec.source === "api" || rec.source === "local" ? rec.source : "api";
    return (
      <tr className="border-b border-border/20 hover:bg-card/10 transition-colors">
        <td className="px-4 py-3">
          <div className="font-serif text-sm leading-tight">{String(rec.trackTitle || "Unknown track")}</div>
          <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">ID {String(rec.trackId || "—")}</div>
        </td>
        <td className="px-4 py-3 font-sans text-sm">{String(rec.name || "Unknown")}</td>
        <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{String(rec.email || "No email")}</td>
        <td className="px-4 py-3">
          <span className="text-[9px] uppercase tracking-widest border border-border/40 px-2 py-1 text-muted-foreground">
            {String(rec.intendedUse || "—")}
          </span>
        </td>
        <td className="px-4 py-3">
          {rec.termsAccepted
            ? <span className="text-green-400 text-[10px]">✓ Yes</span>
            : <span className="text-muted-foreground text-[10px]">—</span>}
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{safeFormatDate(rec.timestamp)}</td>
        <td className="px-4 py-3">
          <span className={`text-[9px] uppercase tracking-widest border px-2 py-1 ${src === "api" ? "text-green-400 border-green-400/30 bg-green-400/5" : "text-amber-400 border-amber-400/30 bg-amber-400/5"}`}>
            {src}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <button onClick={() => onRevoke(rec)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors">
            Revoke
          </button>
        </td>
      </tr>
    );
  } catch (e) {
    console.error("[Admin] Row render error:", e, rec);
    return (
      <tr className="border-b border-border/20">
        <td colSpan={8} className="px-4 py-3 text-[10px] font-mono text-red-400/60">
          Malformed record (id: {String(rec?.id ?? "?")})
        </td>
      </tr>
    );
  }
}

// Quick-tag helper for comma inputs
function TagButtons({ options, current, onChange }: {
  options: string[];
  current: string;
  onChange: (v: string) => void;
}) {
  const toggle = (tag: string) => {
    const items = current.split(",").map(s => s.trim()).filter(Boolean);
    const idx = items.indexOf(tag);
    if (idx >= 0) items.splice(idx, 1); else items.push(tag);
    onChange(items.join(", "));
  };
  const active = current.split(",").map(s => s.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {options.map((opt) => {
        const on = active.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-[9px] px-2 py-1 border uppercase tracking-widest transition-colors ${on ? "border-primary text-primary bg-primary/5" : "border-border/40 text-muted-foreground hover:border-primary/40"}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [siteContent, setContent] = useState<SiteContent | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Controlled mood/useCases for track editor
  const [editorMood, setEditorMood] = useState("");
  const [editorUseCases, setEditorUseCases] = useState("");

  // Access log
  const [submissions, setSubmissions] = useState<UnlockRecord[]>([]);
  const [submissionsSource, setSubmissionsSource] = useState<"api" | "local" | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [logSearch, setLogSearch] = useState("");
  const [logUseFilter, setLogUseFilter] = useState<string>("");

  useEffect(() => {
    setTracks(getTracks());
    setContent(getSiteContent());
  }, []);

  const loadSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    setSubmissionsError(null);
    try {
      const result = await fetchSubmissions();
      setSubmissions(Array.isArray(result.records) ? result.records : []);
      setSubmissionsSource(result.source);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[Admin] loadSubmissions threw:", msg);
      setSubmissionsError("Failed to load submissions. Showing locally stored records.");
      setSubmissions(getLocalSubmissions());
      setSubmissionsSource("local");
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "access-log" || activeTab === "dashboard") {
      loadSubmissions();
    }
  }, [activeTab, loadSubmissions]);

  // Filtered submissions for access log
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((r) => {
      if (logSearch) {
        const q = logSearch.toLowerCase();
        if (
          !String(r.name ?? "").toLowerCase().includes(q) &&
          !String(r.email ?? "").toLowerCase().includes(q) &&
          !String(r.trackTitle ?? "").toLowerCase().includes(q)
        ) return false;
      }
      if (logUseFilter && r.intendedUse !== logUseFilter) return false;
      return true;
    });
  }, [submissions, logSearch, logUseFilter]);

  // Dashboard metrics
  const dashMetrics = useMemo(() => {
    const total = tracks.length;
    const pub = tracks.filter(t => t.accessStatus === "Public").length;
    const priv = tracks.filter(t => t.accessStatus === "Private").length;
    const nda = tracks.filter(t => t.accessStatus === "NDA / Token Access Required").length;
    const totalUnlocks = submissions.length;

    const byUse: Record<string, number> = {};
    submissions.forEach(r => {
      const u = String(r.intendedUse || "Other");
      byUse[u] = (byUse[u] || 0) + 1;
    });

    const byTrack: Record<string, { title: string; count: number }> = {};
    submissions.forEach(r => {
      const id = String(r.trackId || "?");
      if (!byTrack[id]) byTrack[id] = { title: String(r.trackTitle || "Unknown"), count: 0 };
      byTrack[id].count++;
    });
    const topTracks = Object.entries(byTrack)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const latestRequests = [...submissions]
      .sort((a, b) => {
        try { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); }
        catch { return 0; }
      })
      .slice(0, 5);

    return { total, pub, priv, nda, totalUnlocks, byUse, topTracks, latestRequests };
  }, [tracks, submissions]);

  // -------------------------------------------------------------------------
  // Track CRUD
  // -------------------------------------------------------------------------
  const openEditTrack = (t: Track) => {
    setEditingTrack(t);
    setEditorMood((t.mood || []).join(", "));
    setEditorUseCases((t.useCases || []).join(", "));
  };

  const openNewTrack = () => {
    setEditingTrack({ ...EMPTY_TRACK });
    setEditorMood("");
    setEditorUseCases("");
  };

  const handleSaveTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrack) return;
    const fd = new FormData(e.currentTarget);
    const str = (name: string) => (fd.get(name) as string || "").trim();
    const newTrack: Track = {
      id: editingTrack.id || Date.now().toString(),
      title: str("title"),
      artist: str("artist") || "Conduct Alchemy",
      genre: str("genre"),
      bpm: Number(str("bpm")) || 0,
      musicalKey: str("musicalKey"),
      description: str("description"),
      lyrics: str("lyrics"),
      licensingNotes: str("licensingNotes"),
      visualConceptNotes: str("visualConceptNotes"),
      mood: editorMood.split(",").map(s => s.trim()).filter(Boolean),
      versions: str("versions").split(",").map(s => s.trim()).filter(Boolean),
      useCases: editorUseCases.split(",").map(s => s.trim()).filter(Boolean),
      featured: fd.get("featured") === "on",
      heroTrack: fd.get("heroTrack") === "on",
      featuredOrder: str("featuredOrder") ? Number(str("featuredOrder")) : undefined,
      accessStatus: (str("accessStatus") as AccessStatus) || "Public",
      audioUrl: str("audioUrl") || undefined,
      previewAudioUrl: str("previewAudioUrl") || undefined,
      videoUrl: str("videoUrl") || undefined,
      coverArtUrl: str("coverArtUrl") || undefined,
      collaborators: str("collaborators").split(",").map(s => s.trim()).filter(Boolean),
      socialLinks: {
        youtube: str("socialYoutube") || undefined,
        instagram: str("socialInstagram") || undefined,
        spotify: str("socialSpotify") || undefined,
        soundcloud: str("socialSoundcloud") || undefined,
        tiktok: str("socialTiktok") || undefined,
      },
      createdAt: editingTrack.createdAt || new Date().toISOString(),
    };
    const updated = editingTrack.id
      ? tracks.map(t => t.id === newTrack.id ? newTrack : t)
      : [...tracks, newTrack];
    setTracks(updated);
    saveTracks(updated);
    setEditingTrack(null);
  };

  const handleDeleteTrack = (id: string) => {
    if (!confirm("Delete this track? This cannot be undone.")) return;
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated);
    saveTracks(updated);
  };

  // -------------------------------------------------------------------------
  // Site content
  // -------------------------------------------------------------------------
  const handleSaveContent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!siteContent) return;
    const fd = new FormData(e.currentTarget);
    const str = (name: string) => (fd.get(name) as string || "").trim();

    const heroStats: HeroStat[] = [];
    for (let i = 0; i < 4; i++) {
      const value = str(`stat${i}value`);
      const label = str(`stat${i}label`);
      if (value) heroStats.push({ value, label });
    }

    const testimonials: Testimonial[] = [];
    for (let i = 0; i < 3; i++) {
      const quote = str(`testimonial${i}quote`);
      const author = str(`testimonial${i}author`);
      const role = str(`testimonial${i}role`);
      if (quote && author) testimonials.push({ quote, author, role: role || undefined });
    }

    const parseLogos = (field: string): LogoItem[] =>
      str(field).split("\n").map(s => s.trim()).filter(Boolean).map(name => ({ name }));

    const updated: SiteContent = {
      heroTitle: str("heroTitle"),
      heroSubtitle: str("heroSubtitle"),
      heroTagline: str("heroTagline"),
      aboutText: str("aboutText"),
      contactEmail: str("contactEmail"),
      licensingIntro: str("licensingIntro"),
      proCtaTitle: str("proCtaTitle"),
      proCtaText: str("proCtaText"),
      featuredTrackIds: siteContent.featuredTrackIds,
      heroStats,
      collaboratorLogos: parseLogos("collaboratorLogos"),
      clientLogos: parseLogos("clientLogos"),
      testimonials,
    };
    setContent(updated);
    saveSiteContent(updated);
    setIsEditingContent(false);
  };

  // -------------------------------------------------------------------------
  // Import / Export
  // -------------------------------------------------------------------------
  const handleExport = () => {
    const data = { tracks: getTracks(), siteContent: getSiteContent(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conduct-alchemy-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.tracks && Array.isArray(data.tracks)) { setTracks(data.tracks); saveTracks(data.tracks); }
        if (data.siteContent) { setContent(data.siteContent); saveSiteContent(data.siteContent); }
        setImportStatus("Import successful.");
        setTimeout(() => setImportStatus(null), 3000);
      } catch {
        setImportStatus("Error: Invalid JSON file.");
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleRevoke = (rec: UnlockRecord) => {
    if (confirm(`Revoke local access for "${rec.trackTitle}"?`)) {
      revokeLocalAccess(rec.trackId);
      loadSubmissions();
    }
  };

  if (!siteContent) return null;

  // ---------------------------------------------------------------------------
  // Style helpers
  // ---------------------------------------------------------------------------
  const inputCls = "w-full bg-background border border-border/60 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-[10px] font-sans tracking-[0.15em] text-muted-foreground uppercase mb-1.5";
  const sectionHead = "text-[10px] font-sans tracking-[0.2em] uppercase text-muted-foreground border-b border-border/30 pb-3 mb-4";

  const tabCls = (tab: AdminTab) =>
    `text-[10px] font-sans tracking-[0.2em] uppercase px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif">Atelier / CMS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">Dashboard, catalogue, access log, and site content.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {importStatus && <span className="text-xs tracking-widest text-primary animate-pulse">{importStatus}</span>}
          <button onClick={handleExport} className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors">
            Export JSON
          </button>
          <label className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors cursor-pointer">
            Import JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40 mb-10 gap-1 overflow-x-auto">
        <button onClick={() => setActiveTab("dashboard")} className={tabCls("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("catalogue")} className={tabCls("catalogue")}>Catalogue</button>
        <button onClick={() => setActiveTab("content")} className={tabCls("content")}>Site Content</button>
        <button onClick={() => setActiveTab("access-log")} className={tabCls("access-log")}>
          Access Log
          {submissions.length > 0 && (
            <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">{submissions.length}</span>
          )}
        </button>
      </div>

      {/* ================================================================== */}
      {/* TAB: DASHBOARD                                                       */}
      {/* ================================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-10">
          {/* Stat cards */}
          <div>
            <h2 className="text-2xl font-serif mb-6">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Tracks" value={dashMetrics.total} />
              <StatCard label="Public" value={dashMetrics.pub} sub="Open access" />
              <StatCard label="Private / NDA" value={dashMetrics.priv + dashMetrics.nda} sub={`${dashMetrics.priv} Private · ${dashMetrics.nda} NDA`} />
              <StatCard label="Total Unlocks" value={dashMetrics.totalUnlocks} sub={loadingSubmissions ? "Loading…" : submissionsSource === "api" ? "Live from Worker" : "Local fallback"} />
            </div>
          </div>

          {/* Unlocks by use */}
          {dashMetrics.totalUnlocks > 0 && (
            <div>
              <h3 className={sectionHead}>Unlocks by Intended Use</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(dashMetrics.byUse)
                  .sort((a, b) => b[1] - a[1])
                  .map(([use, count]) => (
                    <div key={use} className="border border-border/40 bg-card/20 px-4 py-3 flex items-center gap-3">
                      <span className="font-serif text-xl">{count}</span>
                      <span className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">{use}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Latest requests */}
            <div>
              <h3 className={sectionHead}>Latest Requests</h3>
              {loadingSubmissions && submissions.length === 0 ? (
                <p className="text-xs text-muted-foreground animate-pulse font-sans tracking-widest">Loading…</p>
              ) : dashMetrics.latestRequests.length === 0 ? (
                <p className="text-sm font-serif italic text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {dashMetrics.latestRequests.map((r, i) => (
                    <div key={r.id || i} className="border border-border/30 bg-card/10 px-4 py-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="text-sm font-serif">{String(r.name || "Unknown")}</div>
                          <div className="text-[10px] text-muted-foreground font-sans tracking-wide mt-0.5">
                            {String(r.trackTitle || "Unknown track")} · {String(r.intendedUse || "—")}
                          </div>
                        </div>
                        <div className="text-[9px] text-muted-foreground/60 font-sans whitespace-nowrap shrink-0">
                          {safeFormatDate(r.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Most requested tracks */}
            <div>
              <h3 className={sectionHead}>Most Requested Tracks</h3>
              {dashMetrics.topTracks.length === 0 ? (
                <p className="text-sm font-serif italic text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {dashMetrics.topTracks.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-4 border border-border/30 bg-card/10 px-4 py-3">
                      <span className="text-[10px] font-sans text-muted-foreground/50 w-5 text-right shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-sm truncate">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground/60">Track ID: {t.id}</div>
                      </div>
                      <div className="text-xl font-serif shrink-0">{t.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-4 flex-wrap pt-4 border-t border-border/30">
            <button onClick={() => setActiveTab("catalogue")} className="text-xs uppercase tracking-widest border border-border/60 px-4 py-2 hover:bg-border/30 transition-colors">
              Manage Catalogue →
            </button>
            <button onClick={() => setActiveTab("access-log")} className="text-xs uppercase tracking-widest border border-border/60 px-4 py-2 hover:bg-border/30 transition-colors">
              Full Access Log →
            </button>
            <button onClick={() => setActiveTab("content")} className="text-xs uppercase tracking-widest border border-border/60 px-4 py-2 hover:bg-border/30 transition-colors">
              Edit Site Content →
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB: CATALOGUE                                                       */}
      {/* ================================================================== */}
      {activeTab === "catalogue" && (
        <>
          {editingTrack ? (
            <div className="bg-card/20 p-8 border border-border/40 mb-10 animate-in fade-in">
              <h2 className="text-2xl font-serif mb-8">{editingTrack.id ? "Edit Track" : "New Track"}</h2>
              <form onSubmit={handleSaveTrack} className="space-y-8">

                {/* — Basic Info — */}
                <div>
                  <h3 className={sectionHead}>Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className={labelCls}>Title *</label>
                      <input required name="title" defaultValue={editingTrack.title} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Artist</label>
                      <input name="artist" defaultValue={editingTrack.artist || "Conduct Alchemy"} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Genre *</label>
                      <select name="genre" defaultValue={editingTrack.genre || GENRE_OPTIONS[0]} className={inputCls}>
                        {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>BPM *</label>
                      <input required type="number" name="bpm" defaultValue={editingTrack.bpm || ""} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Musical Key *</label>
                      <input required name="musicalKey" defaultValue={editingTrack.musicalKey} className={inputCls} placeholder="e.g. D Minor" />
                    </div>
                    <div>
                      <label className={labelCls}>Access Status</label>
                      <select name="accessStatus" defaultValue={editingTrack.accessStatus || "Public"} className={inputCls}>
                        {ACCESS_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Featured Order</label>
                      <input type="number" name="featuredOrder" defaultValue={editingTrack.featuredOrder ?? ""} className={inputCls} placeholder="1 = highest priority" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="featured" defaultChecked={editingTrack.featured} className="w-4 h-4 accent-primary" />
                      <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">Featured in Catalogue</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="heroTrack" defaultChecked={editingTrack.heroTrack ?? false} className="w-4 h-4 accent-primary" />
                      <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">Hero / Promoted Track</span>
                    </label>
                  </div>
                </div>

                {/* — Media — */}
                <div>
                  <h3 className={sectionHead}>Playback & Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Audio URL (full track)</label>
                      <input name="audioUrl" defaultValue={editingTrack.audioUrl || ""} className={inputCls} placeholder="https://..." />
                    </div>
                    <div>
                      <label className={labelCls}>Preview Audio URL (45s clip)</label>
                      <input name="previewAudioUrl" defaultValue={editingTrack.previewAudioUrl || ""} className={inputCls} placeholder="https://..." />
                    </div>
                    <div>
                      <label className={labelCls}>Video URL (YouTube / Vimeo)</label>
                      <input name="videoUrl" defaultValue={editingTrack.videoUrl || ""} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div>
                      <label className={labelCls}>Cover Art URL</label>
                      <input name="coverArtUrl" defaultValue={editingTrack.coverArtUrl || ""} className={inputCls} placeholder="https://..." />
                    </div>
                  </div>
                  {editingTrack.coverArtUrl && (
                    <div className="mt-3">
                      <img src={editingTrack.coverArtUrl} alt="Cover preview" className="h-24 object-cover border border-border/30 opacity-80" />
                    </div>
                  )}
                </div>

                {/* — Content — */}
                <div>
                  <h3 className={sectionHead}>Description & Content</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Description *</label>
                      <textarea required name="description" defaultValue={editingTrack.description} rows={3} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Lyrics (or "(Instrumental)")</label>
                      <textarea name="lyrics" defaultValue={editingTrack.lyrics} rows={3} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Licensing Notes *</label>
                      <textarea required name="licensingNotes" defaultValue={editingTrack.licensingNotes} rows={2} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Visual Concept Notes</label>
                      <textarea name="visualConceptNotes" defaultValue={editingTrack.visualConceptNotes} rows={2} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* — Tags — */}
                <div>
                  <h3 className={sectionHead}>Tags & Categorisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Mood (comma-separated) *</label>
                      <input
                        required
                        name="_moodDisplay"
                        value={editorMood}
                        onChange={e => setEditorMood(e.target.value)}
                        className={inputCls}
                        placeholder="Emotional, Hopeful, Cinematic"
                      />
                      <TagButtons options={MOOD_PRESETS} current={editorMood} onChange={setEditorMood} />
                    </div>
                    <div>
                      <label className={labelCls}>Use Cases (comma-separated) *</label>
                      <input
                        required
                        name="_useCasesDisplay"
                        value={editorUseCases}
                        onChange={e => setEditorUseCases(e.target.value)}
                        className={inputCls}
                        placeholder="Film, TV, Advertising"
                      />
                      <TagButtons options={USE_CASE_PRESETS} current={editorUseCases} onChange={setEditorUseCases} />
                    </div>
                    <div>
                      <label className={labelCls}>Versions (comma-separated) *</label>
                      <input required name="versions" defaultValue={(editingTrack.versions || []).join(", ")} className={inputCls} placeholder="Full Orchestral, Strings Only" />
                    </div>
                  </div>
                </div>

                {/* — Collaborators & Social — */}
                <div>
                  <h3 className={sectionHead}>Collaborators & Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Collaborators (comma-separated)</label>
                      <input name="collaborators" defaultValue={(editingTrack.collaborators || []).join(", ")} className={inputCls} placeholder="Ash Choudhury, Jane Doe" />
                    </div>
                    <div>
                      <label className={labelCls}>YouTube URL</label>
                      <input name="socialYoutube" defaultValue={editingTrack.socialLinks?.youtube || ""} className={inputCls} placeholder="https://youtube.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>Instagram URL</label>
                      <input name="socialInstagram" defaultValue={editingTrack.socialLinks?.instagram || ""} className={inputCls} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>Spotify URL</label>
                      <input name="socialSpotify" defaultValue={editingTrack.socialLinks?.spotify || ""} className={inputCls} placeholder="https://open.spotify.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>SoundCloud URL</label>
                      <input name="socialSoundcloud" defaultValue={editingTrack.socialLinks?.soundcloud || ""} className={inputCls} placeholder="https://soundcloud.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>TikTok URL</label>
                      <input name="socialTiktok" defaultValue={editingTrack.socialLinks?.tiktok || ""} className={inputCls} placeholder="https://tiktok.com/..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">
                    Save Track
                  </button>
                  <button type="button" onClick={() => setEditingTrack(null)} className="px-6 py-2.5 border border-border text-xs uppercase tracking-wider hover:bg-border/30 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Catalogue Records</h2>
                <button onClick={openNewTrack} className="bg-foreground text-background px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-primary transition-colors">
                  + New Track
                </button>
              </div>

              <div className="overflow-x-auto border border-border/40">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase bg-card/30 border-b border-border/40">
                    <tr>
                      <th className="px-5 py-4 font-normal tracking-widest">Title</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Genre</th>
                      <th className="px-5 py-4 font-normal tracking-widest">BPM</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Access</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Hero</th>
                      <th className="px-5 py-4 font-normal tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracks.map((track) => (
                      <tr key={track.id} className="border-b border-border/20 hover:bg-card/10 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-serif">{track.title}</div>
                          {track.collaborators && track.collaborators.length > 0 && (
                            <div className="text-[10px] text-muted-foreground/60">With {track.collaborators.join(", ")}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs">{track.genre}</td>
                        <td className="px-5 py-4 text-muted-foreground">{track.bpm}</td>
                        <td className="px-5 py-4">
                          <span className={`text-[9px] uppercase tracking-widest border px-2 py-1 ${ACCESS_STATUS_COLORS[track.accessStatus || "Public"]}`}>
                            {track.accessStatus || "Public"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {track.heroTrack
                            ? <span className="text-primary text-[10px] uppercase tracking-widest">★ Hero</span>
                            : track.featured
                            ? <span className="text-muted-foreground text-[10px]">Featured</span>
                            : <span className="text-muted-foreground/40 text-[10px]">—</span>}
                        </td>
                        <td className="px-5 py-4 text-right space-x-4">
                          <button onClick={() => openEditTrack(track)} className="text-muted-foreground hover:text-foreground uppercase text-[10px] tracking-widest">Edit</button>
                          <button onClick={() => handleDeleteTrack(track.id)} className="text-destructive hover:text-red-400 uppercase text-[10px] tracking-widest">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {tracks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic font-serif">No tracks in catalogue.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: SITE CONTENT                                                    */}
      {/* ================================================================== */}
      {activeTab === "content" && (
        <>
          {isEditingContent ? (
            <div className="bg-card/20 p-8 border border-border/40 animate-in fade-in">
              <h2 className="text-2xl font-serif mb-8">Edit Site Content</h2>
              <form onSubmit={handleSaveContent} className="space-y-8">

                {/* Hero */}
                <div>
                  <h3 className={sectionHead}>Hero</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Hero Title</label>
                      <input required name="heroTitle" defaultValue={siteContent.heroTitle} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Hero Subtitle</label>
                      <input required name="heroSubtitle" defaultValue={siteContent.heroSubtitle} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Hero Tagline</label>
                      <input required name="heroTagline" defaultValue={siteContent.heroTagline} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className={sectionHead}>Homepage Stats (up to 4)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="space-y-2">
                        <div>
                          <label className={labelCls}>Value {i+1}</label>
                          <input name={`stat${i}value`} defaultValue={siteContent.heroStats?.[i]?.value ?? ""} className={inputCls} placeholder="50+" />
                        </div>
                        <div>
                          <label className={labelCls}>Label {i+1}</label>
                          <input name={`stat${i}label`} defaultValue={siteContent.heroStats?.[i]?.label ?? ""} className={inputCls} placeholder="Tracks" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro CTA */}
                <div>
                  <h3 className={sectionHead}>Industry / Pro CTA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>CTA Title</label>
                      <input name="proCtaTitle" defaultValue={siteContent.proCtaTitle} className={inputCls} placeholder="Music for the Screen" />
                    </div>
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <input required name="contactEmail" defaultValue={siteContent.contactEmail} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>CTA Text</label>
                      <textarea name="proCtaText" defaultValue={siteContent.proCtaText} rows={2} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* About + Licensing */}
                <div>
                  <h3 className={sectionHead}>About & Licensing</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>About Text</label>
                      <textarea required name="aboutText" defaultValue={siteContent.aboutText} rows={3} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Licensing Intro</label>
                      <textarea required name="licensingIntro" defaultValue={siteContent.licensingIntro} rows={3} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Logos */}
                <div>
                  <h3 className={sectionHead}>Collaborators & Clients (one name per line)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Collaborator Names</label>
                      <textarea
                        name="collaboratorLogos"
                        defaultValue={(siteContent.collaboratorLogos || []).map(l => l.name).join("\n")}
                        rows={4}
                        className={inputCls}
                        placeholder={"Ash Choudhury\nJane Doe"}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Client / Partner Names</label>
                      <textarea
                        name="clientLogos"
                        defaultValue={(siteContent.clientLogos || []).map(l => l.name).join("\n")}
                        rows={4}
                        className={inputCls}
                        placeholder={"Netflix\nBBC"}
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h3 className={sectionHead}>Testimonials (up to 3)</h3>
                  <div className="space-y-6">
                    {[0,1,2].map(i => (
                      <div key={i} className="border border-border/30 p-4 space-y-3">
                        <div className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground/60 mb-2">Testimonial {i+1}</div>
                        <div>
                          <label className={labelCls}>Quote</label>
                          <textarea name={`testimonial${i}quote`} defaultValue={siteContent.testimonials?.[i]?.quote ?? ""} rows={2} className={inputCls} placeholder="The music elevated the entire project…" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Author</label>
                            <input name={`testimonial${i}author`} defaultValue={siteContent.testimonials?.[i]?.author ?? ""} className={inputCls} placeholder="Jane Smith" />
                          </div>
                          <div>
                            <label className={labelCls}>Role / Company</label>
                            <input name={`testimonial${i}role`} defaultValue={siteContent.testimonials?.[i]?.role ?? ""} className={inputCls} placeholder="Music Supervisor, Netflix" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">
                    Save Content
                  </button>
                  <button type="button" onClick={() => setIsEditingContent(false)} className="px-6 py-2.5 border border-border text-xs uppercase tracking-wider hover:bg-border/30 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-card/10 p-6 border border-border/40">
              <div>
                <h2 className="text-xl font-serif">Site Content</h2>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                  Hero, stats, about, licensing, collaborators, clients, testimonials.
                </p>
              </div>
              <button onClick={() => setIsEditingContent(true)} className="border border-primary/60 text-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
                Edit Content
              </button>
            </div>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: ACCESS LOG                                                       */}
      {/* ================================================================== */}
      {activeTab === "access-log" && (
        <AccessLogErrorBoundary>
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-serif">Access Log</h2>
                <p className="text-xs text-muted-foreground mt-1 font-sans tracking-wide">
                  {loadingSubmissions ? (
                    <span className="text-muted-foreground/50">Checking…</span>
                  ) : IS_MOCK_MODE ? (
                    <span className="text-amber-400/70">Mock mode — local storage. Set <code className="font-mono text-[10px]">VITE_WORKER_URL</code> to connect Worker.</span>
                  ) : submissionsSource === "api" ? (
                    <span className="text-green-400/70">Live — Cloudflare Worker.</span>
                  ) : submissionsSource === "local" ? (
                    <span className="text-amber-400/70">Worker unreachable — local fallback.</span>
                  ) : null}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={loadSubmissions} disabled={loadingSubmissions} className="text-xs tracking-widest uppercase border border-border/60 px-4 py-2 hover:bg-border/30 transition-colors disabled:opacity-40">
                  {loadingSubmissions ? "Loading…" : "Refresh"}
                </button>
                {submissions.length > 0 && (
                  <button onClick={() => exportCsv(filteredSubmissions)} className="text-xs tracking-widest uppercase border border-primary/50 text-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                    Export CSV
                  </button>
                )}
              </div>
            </div>

            {/* Search & Filter */}
            {submissions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="search"
                  placeholder="Search by name, email, or track…"
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  className="flex-1 bg-background border border-border/60 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                />
                <select
                  value={logUseFilter}
                  onChange={e => setLogUseFilter(e.target.value)}
                  className="bg-background border border-border/60 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-muted-foreground"
                >
                  <option value="">All Uses</option>
                  {INTENDED_USES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {(logSearch || logUseFilter) && (
                  <button onClick={() => { setLogSearch(""); setLogUseFilter(""); }} className="text-xs uppercase tracking-widest text-primary/70 hover:text-primary transition-colors whitespace-nowrap">
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {submissionsError && (
              <div className="mb-6 border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-start gap-3">
                <span className="text-red-400 text-sm">⚠</span>
                <p className="text-xs font-sans text-red-400/90 leading-relaxed">{submissionsError}</p>
              </div>
            )}

            {/* Loading */}
            {loadingSubmissions && submissions.length === 0 && (
              <div className="border border-border/40 px-6 py-16 text-center">
                <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground animate-pulse">Loading submissions…</p>
              </div>
            )}

            {/* Empty */}
            {!loadingSubmissions && submissions.length === 0 && !submissionsError && (
              <div className="border border-border/40 px-6 py-16 text-center">
                <p className="text-muted-foreground italic font-serif text-sm">No unlock submissions yet.</p>
                <p className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground/40 mt-2">Submissions appear here once a visitor unlocks a private track.</p>
              </div>
            )}

            {/* Table */}
            {submissions.length > 0 && (
              <>
                <div className="flex flex-wrap gap-4 mb-4 text-[10px] font-sans tracking-widest uppercase">
                  <span className="text-muted-foreground">
                    Showing: <span className="text-foreground">{filteredSubmissions.length}</span>
                    {filteredSubmissions.length !== submissions.length && ` of ${submissions.length}`}
                  </span>
                  {["Film","TV","Advertising","Game","Personal","Other"].map(use => {
                    const count = filteredSubmissions.filter(r => r.intendedUse === use).length;
                    if (!count) return null;
                    return <span key={use} className="text-muted-foreground">{use}: <span className="text-foreground">{count}</span></span>;
                  })}
                </div>

                {filteredSubmissions.length === 0 ? (
                  <div className="border border-border/40 px-6 py-10 text-center">
                    <p className="text-sm font-serif italic text-muted-foreground">No records match your search.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-border/40">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] text-muted-foreground uppercase bg-card/30 border-b border-border/40">
                        <tr>
                          <th className="px-4 py-4 font-normal tracking-widest">Track</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Name</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Email</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Use</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Terms</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Date</th>
                          <th className="px-4 py-4 font-normal tracking-widest">Source</th>
                          <th className="px-4 py-4 font-normal tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((rec, idx) => (
                          <RecordRow key={rec.id || `row-${idx}`} rec={rec} onRevoke={handleRevoke} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </AccessLogErrorBoundary>
      )}
    </div>
  );
}

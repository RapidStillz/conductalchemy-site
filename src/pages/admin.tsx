import {
  useState, useEffect, useCallback, useMemo,
  Component, type ReactNode,
} from "react";
import {
  Track, SiteContent, HeroStat, LogoItem, Testimonial, HistoryEntry,
  getTracks, saveTracks, getSiteContent, saveSiteContent,
  getDraftTracks, saveDraftTracks, getDraftSiteContent, saveDraftSiteContent,
  publishAll, discardDraft, hasDraftChanges,
  getTrackHistory, getSiteContentHistory, rollbackTracks, rollbackSiteContent,
  ACCESS_STATUS_OPTIONS, AccessStatus,
  GENRE_OPTIONS, MOOD_PRESETS, USE_CASE_PRESETS,
  generateSlug,
} from "@/lib/cms";
import {
  UnlockRecord, fetchSubmissions, getLocalSubmissions, revokeLocalAccess,
} from "@/lib/access";
import { validateMediaUrl, type MediaValidation } from "@/lib/media";
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

type AdminTab = "dashboard" | "catalogue" | "content" | "access-log" | "media";

const EMPTY_TRACK: Track = {
  id: "", slug: "", title: "", artist: "Conduct Alchemy", genre: GENRE_OPTIONS[0],
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

function ValidationBadge({ result }: { result: MediaValidation | null }) {
  if (!result || result.severity === "empty") return null;
  const colors: Record<string, string> = {
    ok: "text-green-400 border-green-400/30 bg-green-400/5",
    warning: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    error: "text-red-400 border-red-400/30 bg-red-400/5",
  };
  const icon = result.severity === "ok" ? "✓" : result.severity === "warning" ? "⚠" : "✗";
  return (
    <div className={`text-[10px] font-sans tracking-wide border px-3 py-2 mt-2 flex items-start gap-2 ${colors[result.severity] ?? ""}`}>
      <span className="shrink-0 mt-px">{icon}</span>
      <span>{result.message}</span>
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

  // Controlled fields for track editor
  const [editorMood, setEditorMood] = useState("");
  const [editorUseCases, setEditorUseCases] = useState("");
  const [editorSlug, setEditorSlug] = useState("");
  const [editorGenre, setEditorGenre] = useState(GENRE_OPTIONS[0]);
  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [customGenre, setCustomGenre] = useState("");

  // Draft / Publish state
  const [hasDraft, setHasDraft] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [trackHistory, setTrackHistory] = useState<HistoryEntry<Track[]>[]>([]);
  const [contentHistory, setContentHistory] = useState<HistoryEntry<SiteContent>[]>([]);
  const [showTrackHistory, setShowTrackHistory] = useState(false);
  const [showContentHistory, setShowContentHistory] = useState(false);

  // Access log
  const [submissions, setSubmissions] = useState<UnlockRecord[]>([]);
  const [submissionsSource, setSubmissionsSource] = useState<"api" | "local" | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [logSearch, setLogSearch] = useState("");
  const [logUseFilter, setLogUseFilter] = useState<string>("");
  const [logSort, setLogSort] = useState<"newest" | "oldest">("newest");

  // Media test state
  const [testAudioUrl, setTestAudioUrl] = useState("");
  const [testPreviewUrl, setTestPreviewUrl] = useState("");
  const [testYoutubeUrl, setTestYoutubeUrl] = useState("");
  const [testVimeoUrl, setTestVimeoUrl] = useState("");
  const [testSpotifyUrl, setTestSpotifyUrl] = useState("");
  const [testSoundcloudUrl, setTestSoundcloudUrl] = useState("");
  const [testImageUrl, setTestImageUrl] = useState("");
  const [audioErr, setAudioErr] = useState(false);
  const [previewErr, setPreviewErr] = useState(false);
  const [imgState, setImgState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  useEffect(() => {
    setTracks(getDraftTracks());
    setContent(getDraftSiteContent());
    setHasDraft(hasDraftChanges());
    setTrackHistory(getTrackHistory());
    setContentHistory(getSiteContentHistory());
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

  const filteredSubmissions = useMemo(() => {
    const filtered = submissions.filter((r) => {
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
    return [...filtered].sort((a, b) => {
      try {
        const ta = new Date(a.timestamp).getTime();
        const tb = new Date(b.timestamp).getTime();
        return logSort === "newest" ? tb - ta : ta - tb;
      } catch { return 0; }
    });
  }, [submissions, logSearch, logUseFilter, logSort]);

  const dashMetrics = useMemo(() => {
    const total = tracks.length;
    const pub = tracks.filter(t => t.accessStatus === "Public").length;
    const priv = tracks.filter(t => t.accessStatus === "Private").length;
    const nda = tracks.filter(t => t.accessStatus === "NDA / Token Access Required").length;
    const totalUnlocks = submissions.length;
    const byUse: Record<string, number> = {};
    submissions.forEach(r => { const u = String(r.intendedUse || "Other"); byUse[u] = (byUse[u] || 0) + 1; });
    const byTrack: Record<string, { title: string; count: number }> = {};
    submissions.forEach(r => {
      const id = String(r.trackId || "?");
      if (!byTrack[id]) byTrack[id] = { title: String(r.trackTitle || "Unknown"), count: 0 };
      byTrack[id].count++;
    });
    const topTracks = Object.entries(byTrack).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.count - a.count).slice(0, 5);
    const latestRequests = [...submissions].sort((a, b) => { try { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); } catch { return 0; } }).slice(0, 5);
    return { total, pub, priv, nda, totalUnlocks, byUse, topTracks, latestRequests };
  }, [tracks, submissions]);

  // -------------------------------------------------------------------------
  // Track CRUD — saves as DRAFT
  // -------------------------------------------------------------------------

  const openEditTrack = (t: Track) => {
    setEditingTrack(t);
    setEditorMood((t.mood || []).join(", "));
    setEditorUseCases((t.useCases || []).join(", "));
    setEditorSlug(t.slug || "");
    setEditorGenre(t.genre || GENRE_OPTIONS[0]);
    setIsAddingGenre(false);
    setCustomGenre("");
  };

  const openNewTrack = () => {
    setEditingTrack({ ...EMPTY_TRACK });
    setEditorMood("");
    setEditorUseCases("");
    setEditorSlug("");
    setEditorGenre(GENRE_OPTIONS[0]);
    setIsAddingGenre(false);
    setCustomGenre("");
  };

  const handleSaveTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrack) return;
    const fd = new FormData(e.currentTarget);
    const str = (name: string) => (fd.get(name) as string || "").trim();
    const title = str("title");
    const slug = editorSlug.trim() || generateSlug(title);
    const finalGenre = isAddingGenre ? customGenre.trim() || editorGenre : editorGenre;
    const newTrack: Track = {
      id: editingTrack.id || Date.now().toString(),
      slug,
      title,
      artist: str("artist") || "Conduct Alchemy",
      genre: finalGenre,
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
    saveDraftTracks(updated);
    setHasDraft(true);
    setEditingTrack(null);
  };

  const handleDeleteTrack = (id: string) => {
    if (!confirm("Delete this track from the draft? This cannot be undone.")) return;
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated);
    saveDraftTracks(updated);
    setHasDraft(true);
  };

  // -------------------------------------------------------------------------
  // Site content — saves as DRAFT
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
    saveDraftSiteContent(updated);
    setHasDraft(true);
    setIsEditingContent(false);
  };

  // -------------------------------------------------------------------------
  // Publish / Discard / Rollback
  // -------------------------------------------------------------------------

  const handlePublishAll = () => {
    if (!confirm("Publish all draft changes? The public site will be updated immediately.")) return;
    publishAll();
    setHasDraft(false);
    setTrackHistory(getTrackHistory());
    setContentHistory(getSiteContentHistory());
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const handleDiscardDraft = () => {
    if (!confirm("Discard all unpublished changes and revert to the last published version?")) return;
    discardDraft();
    setTracks(getDraftTracks());
    setContent(getDraftSiteContent());
    setHasDraft(false);
  };

  const handleRollbackTracks = (entry: HistoryEntry<Track[]>) => {
    if (!confirm(`Restore catalogue version from ${safeFormatDate(entry.publishedAt)}?\nThis will become the new published version.`)) return;
    rollbackTracks(entry);
    const restored = getDraftTracks();
    setTracks(restored);
    setHasDraft(false);
    setTrackHistory(getTrackHistory());
  };

  const handleRollbackContent = (entry: HistoryEntry<SiteContent>) => {
    if (!confirm(`Restore content version from ${safeFormatDate(entry.publishedAt)}?`)) return;
    rollbackSiteContent(entry);
    setContent(getDraftSiteContent());
    setHasDraft(false);
    setContentHistory(getSiteContentHistory());
  };

  // -------------------------------------------------------------------------
  // Import / Export (unchanged — uses published data for backup)
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
        if (data.tracks && Array.isArray(data.tracks)) {
          saveTracks(data.tracks);
          saveDraftTracks(data.tracks);
          setTracks(data.tracks);
        }
        if (data.siteContent) {
          saveSiteContent(data.siteContent);
          saveDraftSiteContent(data.siteContent);
          setContent(data.siteContent);
        }
        setHasDraft(false);
        setImportStatus("Import successful — content published directly.");
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

  // Media validation computed values
  const audioV = validateMediaUrl(testAudioUrl, "audio");
  const previewV = validateMediaUrl(testPreviewUrl, "audio");
  const youtubeV = validateMediaUrl(testYoutubeUrl, "youtube");
  const vimeoV = validateMediaUrl(testVimeoUrl, "vimeo");
  const spotifyV = validateMediaUrl(testSpotifyUrl, "spotify");
  const soundcloudV = validateMediaUrl(testSoundcloudUrl, "soundcloud");
  const imageV = validateMediaUrl(testImageUrl, "image");

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">

      {/* ================================================================== */}
      {/* DRAFT WARNING BANNER                                                 */}
      {/* ================================================================== */}
      {hasDraft && (
        <div className="mb-6 border border-amber-400/30 bg-amber-400/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <div>
              <div className="text-xs font-sans tracking-widest uppercase text-amber-400">Unpublished Changes</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Your edits are saved as a draft. The public site still shows the last published version.</div>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={handleDiscardDraft} className="text-[10px] uppercase tracking-widest border border-border/50 text-muted-foreground px-4 py-2 hover:border-red-400/50 hover:text-red-400 transition-colors">
              Discard Draft
            </button>
            <button onClick={handlePublishAll} className="text-[10px] uppercase tracking-widest border border-amber-400/50 text-amber-400 bg-amber-400/5 px-5 py-2 hover:bg-amber-400 hover:text-black transition-colors font-semibold">
              Publish All Changes
            </button>
          </div>
        </div>
      )}

      {publishSuccess && (
        <div className="mb-6 border border-green-400/30 bg-green-400/5 px-5 py-3 flex items-center gap-3">
          <span className="text-green-400 text-sm">✓</span>
          <span className="text-xs font-sans tracking-wide text-green-400">Changes published successfully. The public site has been updated.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif">Atelier / CMS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">Dashboard, catalogue, access log, site content, and media testing.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {importStatus && <span className="text-xs tracking-widest text-primary animate-pulse">{importStatus}</span>}
            <button
              onClick={handleExport}
              title="Download all tracks and site content as a JSON backup file"
              className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors"
            >
              Export Backup ↓
            </button>
            <label
              title="Restore tracks and site content from a previously exported JSON backup"
              className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors cursor-pointer"
            >
              Import Backup ↑
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            {hasDraft && (
              <button onClick={handlePublishAll} className="text-xs tracking-widest uppercase border border-amber-400/60 text-amber-400 bg-amber-400/5 px-5 py-2.5 hover:bg-amber-400 hover:text-black transition-colors">
                Publish Now
              </button>
            )}
          </div>
          <p className="text-[9px] font-sans text-muted-foreground/40 tracking-wide text-right">
            Export/Import saves all tracks &amp; site content as a single .json file.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40 mb-10 gap-1 overflow-x-auto">
        <button onClick={() => setActiveTab("dashboard")} className={tabCls("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("catalogue")} className={tabCls("catalogue")}>
          Catalogue
          {hasDraft && <span className="ml-2 text-[8px] uppercase bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-sm">Draft</span>}
        </button>
        <button onClick={() => setActiveTab("content")} className={tabCls("content")}>
          Site Content
          {hasDraft && <span className="ml-2 text-[8px] uppercase bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-sm">Draft</span>}
        </button>
        <button onClick={() => setActiveTab("access-log")} className={tabCls("access-log")}>
          Access Log
          {submissions.length > 0 && (
            <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">{submissions.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab("media")} className={tabCls("media")}>Media Test</button>
      </div>

      {/* ================================================================== */}
      {/* TAB: DASHBOARD                                                       */}
      {/* ================================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-serif mb-6">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Tracks" value={dashMetrics.total} sub={hasDraft ? "Draft (not yet published)" : "Published"} />
              <StatCard label="Public" value={dashMetrics.pub} sub="Open access" />
              <StatCard label="Private / NDA" value={dashMetrics.priv + dashMetrics.nda} sub={`${dashMetrics.priv} Private · ${dashMetrics.nda} NDA`} />
              <StatCard label="Total Unlocks" value={dashMetrics.totalUnlocks} sub={loadingSubmissions ? "Loading…" : submissionsSource === "api" ? "Live from Worker" : "Local fallback"} />
            </div>
          </div>

          {dashMetrics.totalUnlocks > 0 && (
            <div>
              <h3 className={sectionHead}>Unlocks by Intended Use</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(dashMetrics.byUse).sort((a, b) => b[1] - a[1]).map(([use, count]) => (
                  <div key={use} className="border border-border/40 bg-card/20 px-4 py-3 flex items-center gap-3">
                    <span className="font-serif text-xl">{count}</span>
                    <span className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">{use}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className={sectionHead}>Latest Requests</h3>
              {dashMetrics.latestRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground font-serif italic">No requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {dashMetrics.latestRequests.map((r, i) => (
                    <div key={r.id || i} className="border border-border/30 bg-card/10 px-4 py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-serif">{String(r.name || "Unknown")}</div>
                          <div className="text-[10px] text-muted-foreground tracking-wide">{String(r.trackTitle || "?")} — {String(r.intendedUse || "?")}</div>
                        </div>
                        <div className="text-[9px] text-muted-foreground">{safeFormatDate(r.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className={sectionHead}>Most Requested Tracks</h3>
              {dashMetrics.topTracks.length === 0 ? (
                <p className="text-sm text-muted-foreground font-serif italic">No track unlock data yet.</p>
              ) : (
                <div className="space-y-3">
                  {dashMetrics.topTracks.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-4 border border-border/30 bg-card/10 px-4 py-3">
                      <span className="text-2xl font-serif text-muted-foreground/40">0{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-serif truncate">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground">{t.count} unlock{t.count !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB: CATALOGUE                                                       */}
      {/* ================================================================== */}
      {activeTab === "catalogue" && (
        <>
          {editingTrack ? (
            <div>
              <button onClick={() => setEditingTrack(null)} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2 transition-colors">
                ← Back to Catalogue
              </button>
              <h2 className="text-2xl font-serif mb-8">{editingTrack.id ? `Editing: ${editingTrack.title || "Untitled"}` : "New Track"}</h2>
              <div className="mb-4 border border-amber-400/20 bg-amber-400/5 px-4 py-2.5 text-[10px] font-sans tracking-widest uppercase text-amber-400/80">
                Saving will create a draft. Use "Publish All Changes" to update the live site.
              </div>
              <form onSubmit={handleSaveTrack} className="space-y-8">

                <div className={sectionHead}>Core Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input name="title" defaultValue={editingTrack.title} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Artist</label>
                    <input name="artist" defaultValue={editingTrack.artist} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Slug / URL Path</label>
                  <div className="flex gap-2">
                    <input
                      value={editorSlug}
                      onChange={e => setEditorSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="auto-generated-from-title"
                      className={`${inputCls} flex-1 font-mono text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
                        if (titleInput?.value) setEditorSlug(generateSlug(titleInput.value));
                      }}
                      className="border border-border/50 px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <div className="text-[9px] text-muted-foreground/60 mt-1 font-mono">
                    URL: /music/{editorSlug || "auto-generated"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelCls}>Genre</label>
                    <select
                      value={isAddingGenre ? "__add__" : editorGenre}
                      onChange={e => {
                        if (e.target.value === "__add__") {
                          setIsAddingGenre(true);
                          setCustomGenre("");
                        } else {
                          setIsAddingGenre(false);
                          setEditorGenre(e.target.value);
                        }
                      }}
                      className={`${inputCls} bg-background`}
                    >
                      {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      <option value="__add__">＋ Add new genre…</option>
                    </select>
                    {isAddingGenre && (
                      <div className="flex gap-2 mt-2">
                        <input
                          autoFocus
                          value={customGenre}
                          onChange={e => setCustomGenre(e.target.value)}
                          placeholder="e.g. Neo-Soul / R&B"
                          className={`${inputCls} flex-1 text-xs`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customGenre.trim()) {
                              setEditorGenre(customGenre.trim());
                            }
                            setIsAddingGenre(false);
                          }}
                          className="border border-primary/50 text-primary px-3 py-1.5 text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsAddingGenre(false); setCustomGenre(""); }}
                          className="border border-border/50 text-muted-foreground px-3 py-1.5 text-[10px] uppercase tracking-widest hover:text-foreground transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {isAddingGenre && customGenre.trim() && (
                      <div className="text-[9px] font-mono text-primary/70 mt-1">Will save as: {customGenre.trim()}</div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>BPM</label>
                    <input name="bpm" type="number" defaultValue={editingTrack.bpm} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Musical Key</label>
                    <input name="musicalKey" defaultValue={editingTrack.musicalKey} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Mood Tags</label>
                  <input value={editorMood} onChange={e => setEditorMood(e.target.value)} placeholder="Emotional, Cinematic, ..." className={inputCls} />
                  <TagButtons options={MOOD_PRESETS} current={editorMood} onChange={setEditorMood} />
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea name="description" rows={3} defaultValue={editingTrack.description} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Lyrics</label>
                  <textarea name="lyrics" rows={4} defaultValue={editingTrack.lyrics} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Licensing Notes</label>
                  <textarea name="licensingNotes" rows={3} defaultValue={editingTrack.licensingNotes} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Available Versions (comma-separated)</label>
                  <input name="versions" defaultValue={editingTrack.versions.join(", ")} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Visual Concept Notes</label>
                  <textarea name="visualConceptNotes" rows={2} defaultValue={editingTrack.visualConceptNotes} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Use Cases</label>
                  <input value={editorUseCases} onChange={e => setEditorUseCases(e.target.value)} placeholder="Film, TV, Advertising, ..." className={inputCls} />
                  <TagButtons options={USE_CASE_PRESETS} current={editorUseCases} onChange={setEditorUseCases} />
                </div>

                <div className={sectionHead}>Access & Visibility</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelCls}>Access Status</label>
                    <select name="accessStatus" defaultValue={editingTrack.accessStatus} className={`${inputCls} bg-background`}>
                      {ACCESS_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Featured Order</label>
                    <input name="featuredOrder" type="number" defaultValue={editingTrack.featuredOrder ?? ""} placeholder="e.g. 1" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-3 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="featured" defaultChecked={editingTrack.featured} className="w-4 h-4 accent-primary" />
                      <span className="text-xs tracking-wide font-sans">Featured Track</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="heroTrack" defaultChecked={editingTrack.heroTrack} className="w-4 h-4 accent-primary" />
                      <span className="text-xs tracking-wide font-sans">Hero Track (Home Page)</span>
                    </label>
                  </div>
                </div>

                <div className={sectionHead}>Media URLs</div>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Direct Audio URL (full track)</label>
                    <input name="audioUrl" defaultValue={editingTrack.audioUrl || ""} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Preview Audio URL (45s clip)</label>
                    <input name="previewAudioUrl" defaultValue={editingTrack.previewAudioUrl || ""} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Video URL (YouTube / Vimeo)</label>
                    <input name="videoUrl" defaultValue={editingTrack.videoUrl || ""} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Cover Art Image URL</label>
                    <input name="coverArtUrl" defaultValue={editingTrack.coverArtUrl || ""} placeholder="https://..." className={inputCls} />
                    {editingTrack.coverArtUrl && (
                      <img src={editingTrack.coverArtUrl} alt="Cover preview" className="mt-2 h-24 object-cover border border-border/40" />
                    )}
                  </div>
                </div>

                <div className={sectionHead}>Credits & Social</div>
                <div>
                  <label className={labelCls}>Collaborators (comma-separated)</label>
                  <input name="collaborators" defaultValue={(editingTrack.collaborators || []).join(", ")} placeholder="Producer Name, Vocalist..." className={inputCls} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>YouTube URL</label>
                    <input name="socialYoutube" defaultValue={editingTrack.socialLinks?.youtube || ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram URL</label>
                    <input name="socialInstagram" defaultValue={editingTrack.socialLinks?.instagram || ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Spotify URL</label>
                    <input name="socialSpotify" defaultValue={editingTrack.socialLinks?.spotify || ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>SoundCloud URL</label>
                    <input name="socialSoundcloud" defaultValue={editingTrack.socialLinks?.soundcloud || ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>TikTok URL</label>
                    <input name="socialTiktok" defaultValue={editingTrack.socialLinks?.tiktok || ""} className={inputCls} />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border/30">
                  <button type="submit" className="border border-amber-400/60 text-amber-400 bg-amber-400/5 px-8 py-3 text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-colors">
                    Save as Draft
                  </button>
                  <button type="button" onClick={() => setEditingTrack(null)} className="border border-border px-8 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:bg-border/30 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-serif">Track Catalogue</h2>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    {hasDraft ? (
                      <span className="text-amber-400/70">Showing draft — {tracks.length} track{tracks.length !== 1 ? "s" : ""}. Publish when ready.</span>
                    ) : (
                      <span>{tracks.length} track{tracks.length !== 1 ? "s" : ""} — live</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open("/?preview=1", "_blank")}
                    className="border border-border/50 text-muted-foreground px-4 py-2 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    Preview Homepage
                  </button>
                  <button onClick={openNewTrack} className="border border-primary/60 text-primary px-5 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
                    Add Track
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {tracks.length === 0 && (
                  <div className="border border-border/40 px-6 py-16 text-center">
                    <p className="text-muted-foreground font-serif italic">No tracks yet. Add your first track above.</p>
                  </div>
                )}
                {tracks.map((track) => (
                  <div key={track.id} className="border border-border/40 bg-card/20 hover:border-border/60 transition-colors flex items-center gap-4 p-4">
                    {track.coverArtUrl && (
                      <img src={track.coverArtUrl} alt={track.title} className="w-12 h-12 object-cover border border-border/30 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-serif text-base">{track.title}</span>
                        {track.heroTrack && <span className="text-[8px] uppercase tracking-widest border border-primary/30 text-primary px-1.5 py-0.5">Hero</span>}
                        {track.featured && <span className="text-[8px] uppercase tracking-widest border border-muted-foreground/20 text-muted-foreground/60 px-1.5 py-0.5">Featured</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">{track.genre}</span>
                        <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 ${ACCESS_STATUS_COLORS[track.accessStatus]}`}>
                          {track.accessStatus}
                        </span>
                        <span className="text-[9px] text-muted-foreground/50 font-mono">/music/{track.slug || track.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => window.open(`/music/${track.slug || track.id}?preview=1`, "_blank")}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border/40 px-3 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Preview
                      </button>
                      <button onClick={() => openEditTrack(track)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTrack(track.id)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version history */}
              {trackHistory.length > 0 && (
                <div className="mt-12 border-t border-border/30 pt-8">
                  <button
                    onClick={() => setShowTrackHistory(v => !v)}
                    className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
                  >
                    <span>{showTrackHistory ? "▾" : "▸"}</span>
                    Version History ({trackHistory.length} snapshot{trackHistory.length !== 1 ? "s" : ""})
                  </button>
                  {showTrackHistory && (
                    <div className="space-y-3">
                      {trackHistory.map((entry, i) => (
                        <div key={i} className="border border-border/30 bg-card/10 px-5 py-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-sans">{safeFormatDate(entry.publishedAt)}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{entry.data.length} track{entry.data.length !== 1 ? "s" : ""}</div>
                          </div>
                          <button
                            onClick={() => handleRollbackTracks(entry)}
                            className="text-[10px] uppercase tracking-widest border border-border/50 text-muted-foreground px-4 py-2 hover:border-primary/50 hover:text-primary transition-colors"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: SITE CONTENT                                                    */}
      {/* ================================================================== */}
      {activeTab === "content" && (
        <>
          {isEditingContent && siteContent ? (
            <div>
              <button onClick={() => setIsEditingContent(false)} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2 transition-colors">
                ← Back
              </button>
              <h2 className="text-2xl font-serif mb-8">Edit Site Content</h2>
              <div className="mb-4 border border-amber-400/20 bg-amber-400/5 px-4 py-2.5 text-[10px] font-sans tracking-widest uppercase text-amber-400/80">
                Saving will create a draft. Use "Publish All Changes" to update the live site.
              </div>
              <form onSubmit={handleSaveContent} className="space-y-8">
                <div className={sectionHead}>Hero Section</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Hero Title</label>
                    <input name="heroTitle" defaultValue={siteContent.heroTitle} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Hero Subtitle (kicker)</label>
                    <input name="heroSubtitle" defaultValue={siteContent.heroSubtitle} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Hero Tagline</label>
                  <input name="heroTagline" defaultValue={siteContent.heroTagline} className={inputCls} />
                </div>

                <div className={sectionHead}>Hero Stats (4 max)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0,1,2,3].map(i => {
                    const stat = siteContent.heroStats[i] || { value: "", label: "" };
                    return (
                      <div key={i} className="border border-border/30 p-4 space-y-3">
                        <div>
                          <label className={labelCls}>Stat {i+1} Value</label>
                          <input name={`stat${i}value`} defaultValue={stat.value} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Stat {i+1} Label</label>
                          <input name={`stat${i}label`} defaultValue={stat.label} className={inputCls} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={sectionHead}>About & Licensing</div>
                <div>
                  <label className={labelCls}>About Text</label>
                  <textarea name="aboutText" rows={3} defaultValue={siteContent.aboutText} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Licensing Intro</label>
                  <textarea name="licensingIntro" rows={3} defaultValue={siteContent.licensingIntro} className={inputCls} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Pro CTA Title</label>
                    <input name="proCtaTitle" defaultValue={siteContent.proCtaTitle} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input name="contactEmail" type="email" defaultValue={siteContent.contactEmail} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Pro CTA Body Text</label>
                  <textarea name="proCtaText" rows={2} defaultValue={siteContent.proCtaText} className={inputCls} />
                </div>

                <div className={sectionHead}>Brand Logos</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Collaborator Names (one per line)</label>
                    <textarea name="collaboratorLogos" rows={4} defaultValue={siteContent.collaboratorLogos.map(l => l.name).join("\n")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Client / Partner Names (one per line)</label>
                    <textarea name="clientLogos" rows={4} defaultValue={siteContent.clientLogos.map(l => l.name).join("\n")} className={inputCls} />
                  </div>
                </div>

                <div className={sectionHead}>Testimonials (3 max)</div>
                <div className="space-y-6">
                  {[0,1,2].map(i => {
                    const t = siteContent.testimonials[i] || { quote: "", author: "", role: "" };
                    return (
                      <div key={i} className="border border-border/30 p-5 space-y-4">
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Testimonial {i+1}</div>
                        <div>
                          <label className={labelCls}>Quote</label>
                          <textarea name={`testimonial${i}quote`} rows={2} defaultValue={t.quote} className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Author</label>
                            <input name={`testimonial${i}author`} defaultValue={t.author} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Role / Company</label>
                            <input name={`testimonial${i}role`} defaultValue={t.role || ""} className={inputCls} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 pt-4 border-t border-border/30">
                  <button type="submit" className="border border-amber-400/60 text-amber-400 bg-amber-400/5 px-8 py-3 text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-colors">
                    Save as Draft
                  </button>
                  <button type="button" onClick={() => setIsEditingContent(false)} className="border border-border px-8 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:bg-border/30 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-serif">Site Content</h2>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                    Hero, stats, about, licensing, collaborators, clients, testimonials.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open("/?preview=1", "_blank")}
                    className="border border-border/50 text-muted-foreground px-4 py-2 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    Preview Draft
                  </button>
                  <button onClick={() => setIsEditingContent(true)} className="border border-primary/60 text-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
                    Edit Content
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="border border-border/30 bg-card/10 p-5 space-y-3">
                  <div className={sectionHead}>Hero</div>
                  <div className="text-xl font-serif">{siteContent.heroTitle}</div>
                  <div className="text-xs text-muted-foreground">{siteContent.heroSubtitle}</div>
                  <div className="text-sm font-serif italic">{siteContent.heroTagline}</div>
                </div>
                <div className="border border-border/30 bg-card/10 p-5 space-y-3">
                  <div className={sectionHead}>Stats</div>
                  <div className="grid grid-cols-2 gap-3">
                    {siteContent.heroStats.map((s, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-serif text-primary">{s.value}</span>
                        <span className="text-muted-foreground ml-2 text-[10px] uppercase tracking-widest">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-border/30 bg-card/10 p-5">
                  <div className={sectionHead}>About</div>
                  <p className="text-sm text-muted-foreground">{siteContent.aboutText}</p>
                </div>
                <div className="border border-border/30 bg-card/10 p-5">
                  <div className={sectionHead}>CTA</div>
                  <div className="text-base font-serif">{siteContent.proCtaTitle}</div>
                  <p className="text-xs text-muted-foreground mt-2">{siteContent.proCtaText}</p>
                </div>
              </div>

              {/* Version history */}
              {contentHistory.length > 0 && (
                <div className="border-t border-border/30 pt-8">
                  <button
                    onClick={() => setShowContentHistory(v => !v)}
                    className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
                  >
                    <span>{showContentHistory ? "▾" : "▸"}</span>
                    Content Version History ({contentHistory.length} snapshot{contentHistory.length !== 1 ? "s" : ""})
                  </button>
                  {showContentHistory && (
                    <div className="space-y-3">
                      {contentHistory.map((entry, i) => (
                        <div key={i} className="border border-border/30 bg-card/10 px-5 py-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-sans">{safeFormatDate(entry.publishedAt)}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 font-serif italic">"{entry.data.heroTitle}"</div>
                          </div>
                          <button
                            onClick={() => handleRollbackContent(entry)}
                            className="text-[10px] uppercase tracking-widest border border-border/50 text-muted-foreground px-4 py-2 hover:border-primary/50 hover:text-primary transition-colors"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: ACCESS LOG                                                      */}
      {/* ================================================================== */}
      {activeTab === "access-log" && (
        <AccessLogErrorBoundary>
          <div>
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

            {submissions.length > 0 && (
              <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">Sort:</span>
                  <button
                    onClick={() => setLogSort("newest")}
                    className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                      logSort === "newest"
                        ? "border-primary/60 text-primary bg-primary/5"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    }`}
                  >
                    Newest first
                  </button>
                  <button
                    onClick={() => setLogSort("oldest")}
                    className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                      logSort === "oldest"
                        ? "border-primary/60 text-primary bg-primary/5"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    }`}
                  >
                    Oldest first
                  </button>
                </div>
              </div>
            )}

            {submissionsError && (
              <div className="mb-6 border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-start gap-3">
                <span className="text-red-400 text-sm">⚠</span>
                <p className="text-xs font-sans text-red-400/90 leading-relaxed">{submissionsError}</p>
              </div>
            )}

            {loadingSubmissions && submissions.length === 0 && (
              <div className="border border-border/40 px-6 py-16 text-center">
                <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground animate-pulse">Loading submissions…</p>
              </div>
            )}

            {!loadingSubmissions && submissions.length === 0 && !submissionsError && (
              <div className="border border-border/40 px-6 py-16 text-center">
                <p className="text-muted-foreground italic font-serif text-sm">No unlock submissions yet.</p>
                <p className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground/40 mt-2">Submissions appear here once a visitor unlocks a private track.</p>
              </div>
            )}

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

      {/* ================================================================== */}
      {/* TAB: MEDIA TEST                                                       */}
      {/* ================================================================== */}
      {activeTab === "media" && (
        <div className="space-y-14">
          <div>
            <h2 className="text-2xl font-serif mb-2">Media Test Panel</h2>
            <p className="text-sm text-muted-foreground font-sans">
              Validate and preview all media URLs before adding them to a track. Clear validation messages show exactly what's wrong.
            </p>
          </div>

          {/* ---- AUDIO ---- */}
          <section className="space-y-8">
            <h3 className={sectionHead}>Audio</h3>

            <div>
              <label className={`${labelCls} mb-2`}>Direct Audio URL — Full Track</label>
              <input
                type="url"
                placeholder="https://example.com/track.mp3"
                value={testAudioUrl}
                onChange={e => { setTestAudioUrl(e.target.value); setAudioErr(false); }}
                className={inputCls}
              />
              <ValidationBadge result={audioV} />
              {testAudioUrl && audioV.isValid && (
                <div className="mt-3">
                  <audio
                    key={testAudioUrl}
                    controls
                    className="w-full max-w-xl"
                    onError={() => setAudioErr(true)}
                    onCanPlay={() => setAudioErr(false)}
                  >
                    <source src={testAudioUrl} />
                  </audio>
                  {audioErr && (
                    <div className="text-[10px] font-sans border border-red-400/30 bg-red-400/5 text-red-400 px-3 py-2 mt-2 flex items-center gap-2">
                      <span>✗</span> Audio failed to load. Check the URL is publicly accessible and is a valid audio file (mp3, wav, ogg, flac).
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={`${labelCls} mb-2`}>Preview Audio URL — 45s Clip</label>
              <input
                type="url"
                placeholder="https://example.com/preview.mp3"
                value={testPreviewUrl}
                onChange={e => { setTestPreviewUrl(e.target.value); setPreviewErr(false); }}
                className={inputCls}
              />
              <ValidationBadge result={previewV} />
              {testPreviewUrl && previewV.isValid && (
                <div className="mt-3">
                  <audio
                    key={testPreviewUrl}
                    controls
                    className="w-full max-w-xl"
                    onError={() => setPreviewErr(true)}
                    onCanPlay={() => setPreviewErr(false)}
                  >
                    <source src={testPreviewUrl} />
                  </audio>
                  {previewErr && (
                    <div className="text-[10px] font-sans border border-red-400/30 bg-red-400/5 text-red-400 px-3 py-2 mt-2 flex items-center gap-2">
                      <span>✗</span> Preview audio failed to load. The URL must be publicly accessible.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ---- VIDEO EMBEDS ---- */}
          <section className="space-y-8">
            <h3 className={sectionHead}>Video Embeds</h3>

            <div>
              <label className={`${labelCls} mb-2`}>YouTube URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                value={testYoutubeUrl}
                onChange={e => setTestYoutubeUrl(e.target.value)}
                className={inputCls}
              />
              <ValidationBadge result={youtubeV} />
              {youtubeV.isValid && youtubeV.embedUrl && (
                <div className="mt-4 relative w-full aspect-video border border-border/40 overflow-hidden max-w-2xl">
                  <iframe
                    key={youtubeV.embedUrl}
                    src={youtubeV.embedUrl}
                    title="YouTube preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            <div>
              <label className={`${labelCls} mb-2`}>Vimeo URL</label>
              <input
                type="url"
                placeholder="https://vimeo.com/123456789"
                value={testVimeoUrl}
                onChange={e => setTestVimeoUrl(e.target.value)}
                className={inputCls}
              />
              <ValidationBadge result={vimeoV} />
              {vimeoV.isValid && vimeoV.embedUrl && (
                <div className="mt-4 relative w-full aspect-video border border-border/40 overflow-hidden max-w-2xl">
                  <iframe
                    key={vimeoV.embedUrl}
                    src={vimeoV.embedUrl}
                    title="Vimeo preview"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ---- STREAMING ---- */}
          <section className="space-y-8">
            <h3 className={sectionHead}>Streaming Embeds</h3>

            <div>
              <label className={`${labelCls} mb-2`}>Spotify URL</label>
              <input
                type="url"
                placeholder="https://open.spotify.com/track/..."
                value={testSpotifyUrl}
                onChange={e => setTestSpotifyUrl(e.target.value)}
                className={inputCls}
              />
              <ValidationBadge result={spotifyV} />
              {spotifyV.isValid && spotifyV.embedUrl && (
                <div className="mt-4">
                  <iframe
                    key={spotifyV.embedUrl}
                    src={spotifyV.embedUrl}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="border border-border/40 max-w-2xl block"
                    title="Spotify preview"
                  />
                </div>
              )}
            </div>

            <div>
              <label className={`${labelCls} mb-2`}>SoundCloud URL</label>
              <input
                type="url"
                placeholder="https://soundcloud.com/artist/track"
                value={testSoundcloudUrl}
                onChange={e => setTestSoundcloudUrl(e.target.value)}
                className={inputCls}
              />
              <ValidationBadge result={soundcloudV} />
              {soundcloudV.isValid && soundcloudV.embedUrl && (
                <div className="mt-4">
                  <iframe
                    key={soundcloudV.embedUrl}
                    width="100%"
                    height="166"
                    allow="autoplay"
                    src={soundcloudV.embedUrl}
                    className="border border-border/40 max-w-2xl block"
                    loading="lazy"
                    title="SoundCloud preview"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ---- COVER IMAGE ---- */}
          <section>
            <h3 className={sectionHead}>Cover Image</h3>
            <label className={`${labelCls} mb-2`}>Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={testImageUrl}
              onChange={e => { setTestImageUrl(e.target.value); setImgState("idle"); }}
              className={inputCls}
            />
            <ValidationBadge result={imageV} />
            {testImageUrl && imageV.isValid && (
              <div className="mt-4">
                <img
                  key={testImageUrl}
                  src={testImageUrl}
                  alt="Cover preview"
                  className="max-w-xs max-h-64 object-cover border border-border/40"
                  onLoadStart={() => setImgState("loading")}
                  onLoad={() => setImgState("ok")}
                  onError={() => setImgState("error")}
                />
                {imgState === "loading" && (
                  <div className="text-[10px] text-muted-foreground mt-2 animate-pulse">Loading image…</div>
                )}
                {imgState === "ok" && (
                  <div className="text-[10px] text-green-400 border border-green-400/30 bg-green-400/5 px-3 py-2 mt-2 flex items-center gap-2 max-w-xs">
                    <span>✓</span> Image loaded successfully.
                  </div>
                )}
                {imgState === "error" && (
                  <div className="text-[10px] text-red-400 border border-red-400/30 bg-red-400/5 px-3 py-2 mt-2 flex items-center gap-2 max-w-xs">
                    <span>✗</span> Image failed to load. The URL may be broken, blocked by CORS, or not an image file.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ---- QUICK REFERENCE ---- */}
          <section className="border-t border-border/30 pt-8">
            <h3 className={sectionHead}>Validation Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-sans">
              {[
                { type: "YouTube", pattern: "youtube.com/watch?v=ID or youtu.be/ID" },
                { type: "Vimeo", pattern: "vimeo.com/NUMERIC_ID" },
                { type: "Spotify", pattern: "open.spotify.com/track/ID or /album/ID" },
                { type: "SoundCloud", pattern: "soundcloud.com/artist/track-name" },
                { type: "Audio", pattern: "Any https:// URL (mp3, wav, ogg, flac)" },
                { type: "Image", pattern: "Any https:// URL (.jpg .png .webp .gif .svg)" },
              ].map(row => (
                <div key={row.type} className="border border-border/30 px-4 py-3 flex gap-3">
                  <span className="text-primary shrink-0 tracking-widest uppercase w-24">{row.type}</span>
                  <span className="text-muted-foreground font-mono">{row.pattern}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

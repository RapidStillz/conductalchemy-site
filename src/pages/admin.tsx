import { useState, useEffect, useCallback } from "react";
import {
  Track,
  SiteContent,
  getTracks,
  saveTracks,
  getSiteContent,
  saveSiteContent,
  ACCESS_STATUS_OPTIONS,
  AccessStatus,
} from "@/lib/cms";
import {
  UnlockRecord,
  fetchSubmissions,
  getLocalSubmissions,
  revokeLocalAccess,
} from "@/lib/access";
import { IS_MOCK_MODE } from "@/lib/api-config";

type AdminTab = "catalogue" | "content" | "access-log";

const EMPTY_TRACK: Track = {
  id: "",
  title: "",
  artist: "Conduct Alchemy",
  genre: "",
  mood: [],
  bpm: 0,
  musicalKey: "",
  description: "",
  lyrics: "",
  licensingNotes: "",
  versions: [],
  visualConceptNotes: "",
  useCases: [],
  featured: false,
  accessStatus: "Public",
  createdAt: new Date().toISOString(),
};

const ACCESS_STATUS_COLORS: Record<AccessStatus, string> = {
  Public: "text-green-400 border-green-400/30 bg-green-400/5",
  Private: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  "NDA / Token Access Required": "text-red-400 border-red-400/30 bg-red-400/5",
};

function formatDate(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function exportCsv(records: UnlockRecord[]) {
  const headers = [
    "ID",
    "Track ID",
    "Track Title",
    "Name",
    "Email",
    "Intended Use",
    "Terms Accepted",
    "Timestamp",
    "Source",
    "User Agent",
  ];
  const rows = records.map((r) =>
    [
      r.id,
      r.trackId,
      `"${r.trackTitle.replace(/"/g, '""')}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.email,
      r.intendedUse,
      r.termsAccepted ? "Yes" : "No",
      r.timestamp,
      r.source,
      `"${(r.userAgent ?? "").replace(/"/g, '""')}"`,
    ].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ca-unlock-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("catalogue");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [siteContent, setContent] = useState<SiteContent | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Access log state
  const [submissions, setSubmissions] = useState<UnlockRecord[]>([]);
  const [submissionsSource, setSubmissionsSource] = useState<"api" | "local" | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  useEffect(() => {
    setTracks(getTracks());
    setContent(getSiteContent());
    // Pre-load local submissions immediately; API submissions load on tab open
    setSubmissions(getLocalSubmissions());
  }, []);

  const loadSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    setSubmissionsError(null);
    try {
      const result = await fetchSubmissions();
      // Always guard — ensure we never set a non-array into submissions
      const safe = Array.isArray(result.records) ? result.records : [];
      setSubmissions(safe);
      setSubmissionsSource(result.source);
    } catch (e) {
      console.error("[Admin] loadSubmissions threw:", e);
      setSubmissionsError(
        "Could not load submissions. Falling back to locally stored records."
      );
      setSubmissions(getLocalSubmissions());
      setSubmissionsSource("local");
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "access-log") {
      loadSubmissions();
    }
  }, [activeTab, loadSubmissions]);

  // -------------------------------------------------------------------------
  // Track CRUD
  // -------------------------------------------------------------------------
  const handleSaveTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrack) return;
    const fd = new FormData(e.currentTarget);
    const newTrack: Track = {
      id: editingTrack.id || Date.now().toString(),
      title: fd.get("title") as string,
      artist: (fd.get("artist") as string) || "Conduct Alchemy",
      genre: fd.get("genre") as string,
      bpm: Number(fd.get("bpm")),
      musicalKey: fd.get("musicalKey") as string,
      description: fd.get("description") as string,
      lyrics: fd.get("lyrics") as string,
      licensingNotes: fd.get("licensingNotes") as string,
      visualConceptNotes: fd.get("visualConceptNotes") as string,
      mood: (fd.get("mood") as string).split(",").map((s) => s.trim()).filter(Boolean),
      versions: (fd.get("versions") as string).split(",").map((s) => s.trim()).filter(Boolean),
      useCases: (fd.get("useCases") as string).split(",").map((s) => s.trim()).filter(Boolean),
      featured: fd.get("featured") === "on",
      accessStatus: (fd.get("accessStatus") as AccessStatus) || "Public",
      audioUrl: (fd.get("audioUrl") as string) || undefined,
      createdAt: editingTrack.createdAt || new Date().toISOString(),
    };
    const updated = editingTrack.id
      ? tracks.map((t) => (t.id === newTrack.id ? newTrack : t))
      : [...tracks, newTrack];
    setTracks(updated);
    saveTracks(updated);
    setEditingTrack(null);
  };

  const handleDeleteTrack = (id: string) => {
    if (!confirm("Delete this track? This cannot be undone.")) return;
    const updated = tracks.filter((t) => t.id !== id);
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
    const updated: SiteContent = {
      heroTitle: fd.get("heroTitle") as string,
      heroSubtitle: fd.get("heroSubtitle") as string,
      heroTagline: fd.get("heroTagline") as string,
      aboutText: fd.get("aboutText") as string,
      contactEmail: fd.get("contactEmail") as string,
      licensingIntro: fd.get("licensingIntro") as string,
      featuredTrackIds: siteContent.featuredTrackIds,
    };
    setContent(updated);
    saveSiteContent(updated);
    setIsEditingContent(false);
  };

  // -------------------------------------------------------------------------
  // Import / Export
  // -------------------------------------------------------------------------
  const handleExport = () => {
    const data = {
      tracks: getTracks(),
      siteContent: getSiteContent(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conduct-alchemy-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
          setTracks(data.tracks);
          saveTracks(data.tracks);
        }
        if (data.siteContent) {
          setContent(data.siteContent);
          saveSiteContent(data.siteContent);
        }
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

  if (!siteContent) return null;

  const inputCls =
    "w-full bg-background border border-border/60 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls =
    "block text-[10px] font-sans tracking-[0.15em] text-muted-foreground uppercase mb-1.5";

  const tabCls = (tab: AdminTab) =>
    `text-[10px] font-sans tracking-[0.2em] uppercase px-5 py-3 border-b-2 transition-colors ${
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif">Atelier / CMS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            Manage catalogue, access log, and site content.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {importStatus && (
            <span className="text-xs tracking-widest text-primary animate-pulse">
              {importStatus}
            </span>
          )}
          <button
            onClick={handleExport}
            className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors"
          >
            Export JSON
          </button>
          <label className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40 mb-10 gap-1">
        <button onClick={() => setActiveTab("catalogue")} className={tabCls("catalogue")}>
          Catalogue
        </button>
        <button onClick={() => setActiveTab("content")} className={tabCls("content")}>
          Site Content
        </button>
        <button onClick={() => setActiveTab("access-log")} className={tabCls("access-log")}>
          Access Log
          {submissions.length > 0 && (
            <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">
              {submissions.length}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB: CATALOGUE                                                       */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "catalogue" && (
        <>
          {editingTrack ? (
            <div className="bg-card/20 p-8 border border-border/40 mb-10 animate-in fade-in">
              <h2 className="text-2xl font-serif mb-6">
                {editingTrack.id ? "Edit Track" : "New Track"}
              </h2>
              <form onSubmit={handleSaveTrack} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input required name="title" defaultValue={editingTrack.title} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Artist</label>
                    <input name="artist" defaultValue={editingTrack.artist || "Conduct Alchemy"} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Genre *</label>
                    <input required name="genre" defaultValue={editingTrack.genre} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>BPM *</label>
                    <input required type="number" name="bpm" defaultValue={editingTrack.bpm || ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Musical Key *</label>
                    <input required name="musicalKey" defaultValue={editingTrack.musicalKey} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Access Status</label>
                    <select name="accessStatus" defaultValue={editingTrack.accessStatus || "Public"} className={inputCls}>
                      {ACCESS_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Audio URL (optional — for playback)</label>
                  <input
                    name="audioUrl"
                    defaultValue={editingTrack.audioUrl || ""}
                    className={inputCls}
                    placeholder="https://example.com/track.mp3"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    defaultChecked={editingTrack.featured}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="featured" className="text-xs font-sans tracking-widest uppercase text-muted-foreground cursor-pointer">
                    Featured on Homepage
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Moods (comma-separated) *</label>
                    <input required name="mood" defaultValue={editingTrack.mood?.join(", ")} className={inputCls} placeholder="Emotional, Hopeful, Cinematic" />
                  </div>
                  <div>
                    <label className={labelCls}>Use Cases (comma-separated) *</label>
                    <input required name="useCases" defaultValue={editingTrack.useCases?.join(", ")} className={inputCls} placeholder="Film, TV Drama, Advertising" />
                  </div>
                  <div>
                    <label className={labelCls}>Versions (comma-separated) *</label>
                    <input required name="versions" defaultValue={editingTrack.versions?.join(", ")} className={inputCls} placeholder="Full Orchestral, Strings Only" />
                  </div>
                </div>

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
                <button
                  onClick={() => setEditingTrack(EMPTY_TRACK)}
                  className="bg-foreground text-background px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-primary transition-colors"
                >
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
                      <th className="px-5 py-4 font-normal tracking-widest">Featured</th>
                      <th className="px-5 py-4 font-normal tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracks.map((track) => (
                      <tr key={track.id} className="border-b border-border/20 hover:bg-card/10 transition-colors">
                        <td className="px-5 py-4 font-serif">{track.title}</td>
                        <td className="px-5 py-4 text-muted-foreground text-xs">{track.genre}</td>
                        <td className="px-5 py-4 text-muted-foreground">{track.bpm}</td>
                        <td className="px-5 py-4">
                          <span className={`text-[9px] uppercase tracking-widest border px-2 py-1 ${ACCESS_STATUS_COLORS[track.accessStatus || "Public"]}`}>
                            {track.accessStatus || "Public"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {track.featured
                            ? <span className="text-primary text-xs">Yes</span>
                            : <span className="text-muted-foreground text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4 text-right space-x-4">
                          <button onClick={() => setEditingTrack(track)} className="text-muted-foreground hover:text-foreground uppercase text-[10px] tracking-widest">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTrack(track.id)} className="text-destructive hover:text-red-400 uppercase text-[10px] tracking-widest">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tracks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic font-serif">
                          No tracks in catalogue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB: SITE CONTENT                                                    */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "content" && (
        <>
          {isEditingContent ? (
            <div className="bg-card/20 p-8 border border-border/40 animate-in fade-in">
              <h2 className="text-2xl font-serif mb-6">Edit Site Content</h2>
              <form onSubmit={handleSaveContent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Hero Title</label>
                    <input required name="heroTitle" defaultValue={siteContent.heroTitle} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Hero Subtitle</label>
                    <input required name="heroSubtitle" defaultValue={siteContent.heroSubtitle} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Hero Tagline</label>
                  <input required name="heroTagline" defaultValue={siteContent.heroTagline} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>About Text</label>
                  <textarea required name="aboutText" defaultValue={siteContent.aboutText} rows={4} className={inputCls} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input required name="contactEmail" defaultValue={siteContent.contactEmail} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Licensing Intro</label>
                  <textarea required name="licensingIntro" defaultValue={siteContent.licensingIntro} rows={3} className={inputCls} />
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
                  Global copy: hero, about, licensing intro, contact email.
                </p>
              </div>
              <button
                onClick={() => setIsEditingContent(true)}
                className="border border-primary/60 text-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Edit Content
              </button>
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB: ACCESS LOG                                                       */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "access-log" && (
        <div>
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-serif">Access Log</h2>
              <p className="text-xs text-muted-foreground mt-1 font-sans tracking-wide">
                Private track unlock submissions.{" "}
                {loadingSubmissions ? (
                  <span className="text-muted-foreground/60">Checking…</span>
                ) : IS_MOCK_MODE ? (
                  <span className="text-amber-400/70">
                    Mock mode — data stored locally. Set{" "}
                    <code className="font-mono text-[10px]">VITE_WORKER_URL</code> to connect the Worker.
                  </span>
                ) : submissionsSource === "api" ? (
                  <span className="text-green-400/70">Live — data from Cloudflare Worker.</span>
                ) : submissionsSource === "local" ? (
                  <span className="text-amber-400/70">Worker unreachable — showing local fallback data.</span>
                ) : null}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadSubmissions}
                disabled={loadingSubmissions}
                className="text-xs tracking-widest uppercase border border-border/60 px-4 py-2 hover:bg-border/30 transition-colors disabled:opacity-40"
              >
                {loadingSubmissions ? "Loading…" : "Refresh"}
              </button>
              {submissions.length > 0 && (
                <button
                  onClick={() => exportCsv(submissions)}
                  className="text-xs tracking-widest uppercase border border-primary/50 text-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Error banner */}
          {submissionsError && (
            <div className="mb-6 border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-start gap-3">
              <span className="text-red-400 text-xs mt-0.5">⚠</span>
              <p className="text-xs font-sans text-red-400/90 leading-relaxed">
                {submissionsError}
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {loadingSubmissions && submissions.length === 0 && (
            <div className="border border-border/40 px-6 py-16 text-center">
              <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground animate-pulse">
                Loading submissions…
              </p>
            </div>
          )}

          {/* Empty state (not loading, no error, no records) */}
          {!loadingSubmissions && submissions.length === 0 && !submissionsError && (
            <div className="border border-border/40 px-6 py-16 text-center">
              <p className="text-muted-foreground italic font-serif text-sm">
                No unlock submissions yet.
              </p>
              <p className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground/50 mt-2">
                Submissions appear here once a visitor unlocks a private track.
              </p>
            </div>
          )}

          {/* Table — only render when we have records */}
          {submissions.length > 0 && (
            <>
              {/* Summary chips */}
              <div className="flex flex-wrap gap-4 mb-6 text-[10px] font-sans tracking-widest uppercase">
                <span className="text-muted-foreground">
                  Total: <span className="text-foreground">{submissions.length}</span>
                </span>
                {["Film", "TV", "Advertising", "Game", "Personal", "Other"].map((use) => {
                  const count = submissions.filter((r) => r.intendedUse === use).length;
                  if (!count) return null;
                  return (
                    <span key={use} className="text-muted-foreground">
                      {use}: <span className="text-foreground">{count}</span>
                    </span>
                  );
                })}
              </div>

              <div className="overflow-x-auto border border-border/40">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase bg-card/30 border-b border-border/40">
                    <tr>
                      <th className="px-5 py-4 font-normal tracking-widest">Track</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Name</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Email</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Use</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Terms</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Date</th>
                      <th className="px-5 py-4 font-normal tracking-widest">Source</th>
                      <th className="px-5 py-4 font-normal tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((rec) => (
                      <tr
                        key={rec.id ?? `${rec.trackId}-${rec.timestamp}`}
                        className="border-b border-border/20 hover:bg-card/10 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-serif text-sm leading-tight">
                            {rec.trackTitle ?? "—"}
                          </div>
                          <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">
                            ID {rec.trackId}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-sans text-sm">{rec.name}</td>
                        <td className="px-5 py-4 font-sans text-xs text-muted-foreground">{rec.email}</td>
                        <td className="px-5 py-4">
                          <span className="text-[9px] uppercase tracking-widest border border-border/40 px-2 py-1 text-muted-foreground">
                            {rec.intendedUse}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {rec.termsAccepted
                            ? <span className="text-green-400 text-[10px]">✓ Yes</span>
                            : <span className="text-muted-foreground text-[10px]">—</span>}
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(rec.timestamp)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[9px] uppercase tracking-widest border px-2 py-1 ${
                              rec.source === "api"
                                ? "text-green-400 border-green-400/30 bg-green-400/5"
                                : "text-amber-400 border-amber-400/30 bg-amber-400/5"
                            }`}
                          >
                            {rec.source ?? "local"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Revoke local access for "${rec.trackTitle}"?`)) {
                                revokeLocalAccess(rec.trackId);
                                loadSubmissions();
                              }
                            }}
                            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

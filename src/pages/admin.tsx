import { useState, useEffect } from "react";
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

export default function Admin() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [siteContent, setContent] = useState<SiteContent | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setTracks(getTracks());
    setContent(getSiteContent());
  }, []);

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
      mood: (fd.get("mood") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      versions: (fd.get("versions") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      useCases: (fd.get("useCases") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: fd.get("featured") === "on",
      accessStatus: (fd.get("accessStatus") as AccessStatus) || "Public",
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
  const labelCls = "block text-[10px] font-sans tracking-[0.15em] text-muted-foreground uppercase mb-1.5";

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif">Atelier / CMS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            Manage catalogue, content, and data exports.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {importStatus && (
            <span className="text-xs tracking-widest text-primary animate-pulse">{importStatus}</span>
          )}
          <button
            onClick={handleExport}
            data-testid="button-export-json"
            className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors"
          >
            Export JSON
          </button>
          <label
            className="text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:bg-border/30 transition-colors cursor-pointer"
            data-testid="label-import-json"
          >
            Import JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              data-testid="input-import-json"
            />
          </label>
        </div>
      </div>

      {/* Site Content Panel */}
      {isEditingContent ? (
        <div className="bg-card/20 p-8 border border-border/40 mb-10 animate-in fade-in">
          <h2 className="text-2xl font-serif mb-6">Edit Site Content</h2>
          <form onSubmit={handleSaveContent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Hero Title</label>
                <input required name="heroTitle" defaultValue={siteContent.heroTitle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hero Subtitle (Tagline Line 1)</label>
                <input required name="heroSubtitle" defaultValue={siteContent.heroSubtitle} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Hero Tagline (Line 2)</label>
              <input required name="heroTagline" defaultValue={siteContent.heroTagline} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>About Text</label>
              <textarea
                required
                name="aboutText"
                defaultValue={siteContent.aboutText}
                rows={4}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Contact Email</label>
                <input required name="contactEmail" defaultValue={siteContent.contactEmail} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Licensing Intro</label>
              <textarea
                required
                name="licensingIntro"
                defaultValue={siteContent.licensingIntro}
                rows={3}
                className={inputCls}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                data-testid="button-save-content"
                className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                Save Content
              </button>
              <button
                type="button"
                onClick={() => setIsEditingContent(false)}
                className="px-6 py-2.5 border border-border text-xs uppercase tracking-wider hover:bg-border/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-10 flex justify-between items-center bg-card/10 p-6 border border-border/40">
          <div>
            <h2 className="text-xl font-serif">Site Content</h2>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">
              Global copy: hero, about, licensing intro, contact email.
            </p>
          </div>
          <button
            onClick={() => setIsEditingContent(true)}
            data-testid="button-edit-content"
            className="border border-primary/60 text-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Edit Content
          </button>
        </div>
      )}

      {/* Track Form */}
      {editingTrack ? (
        <div className="bg-card/20 p-8 border border-border/40 mb-10 animate-in fade-in">
          <h2 className="text-2xl font-serif mb-6">
            {editingTrack.id ? "Edit Track" : "New Track"}
          </h2>
          <form onSubmit={handleSaveTrack} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input required name="title" defaultValue={editingTrack.title} className={inputCls} data-testid="input-track-title" />
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
                <select
                  name="accessStatus"
                  defaultValue={editingTrack.accessStatus || "Public"}
                  className={inputCls}
                  data-testid="select-access-status"
                >
                  {ACCESS_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
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
              <button
                type="submit"
                data-testid="button-save-track"
                className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                Save Track
              </button>
              <button
                type="button"
                onClick={() => setEditingTrack(null)}
                className="px-6 py-2.5 border border-border text-xs uppercase tracking-wider hover:bg-border/30 transition-colors"
              >
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
              data-testid="button-new-track"
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
                  <tr
                    key={track.id}
                    className="border-b border-border/20 hover:bg-card/10 transition-colors"
                    data-testid={`row-track-${track.id}`}
                  >
                    <td className="px-5 py-4 font-serif">{track.title}</td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">{track.genre}</td>
                    <td className="px-5 py-4 text-muted-foreground">{track.bpm}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest border px-2 py-1 ${ACCESS_STATUS_COLORS[track.accessStatus || "Public"]}`}
                      >
                        {track.accessStatus || "Public"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {track.featured ? (
                        <span className="text-primary text-xs">Yes</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-4">
                      <button
                        onClick={() => setEditingTrack(track)}
                        data-testid={`button-edit-track-${track.id}`}
                        className="text-muted-foreground hover:text-foreground uppercase text-[10px] tracking-widest"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        data-testid={`button-delete-track-${track.id}`}
                        className="text-destructive hover:text-red-400 uppercase text-[10px] tracking-widest"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {tracks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-muted-foreground italic font-serif"
                    >
                      No tracks in catalogue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

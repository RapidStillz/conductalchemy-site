import { useEffect, useState, useMemo } from "react";
import { getTracks, Track, AccessStatus } from "@/lib/cms";
import { isTrackUnlocked } from "@/lib/access";
import { Link } from "wouter";

const ACCESS_BADGE: Record<AccessStatus, string> = {
  Public: "text-green-400 border-green-400/30",
  Private: "text-amber-400 border-amber-400/30",
  "NDA / Token Access Required": "text-red-400 border-red-400/30",
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <rect x="2.5" y="6" width="9" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const [accessFilter, setAccessFilter] = useState<"all" | "public" | "private">("all");

  useEffect(() => {
    setTracks(getTracks());
  }, []);

  const allMoods = useMemo(() => {
    const moods = new Set<string>();
    tracks.forEach((t) => t.mood.forEach((m) => moods.add(m)));
    return Array.from(moods).sort();
  }, [tracks]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    tracks.forEach((t) => {
      t.genre.split("/").map((p) => p.trim()).forEach((p) => genres.add(p));
    });
    return Array.from(genres).sort();
  }, [tracks]);

  const allUseCases = useMemo(() => {
    const useCases = new Set<string>();
    tracks.forEach((t) => t.useCases.forEach((uc) => useCases.add(uc)));
    return Array.from(useCases).sort();
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      if (activeMood && !t.mood.includes(activeMood)) return false;
      if (activeGenre && !t.genre.includes(activeGenre)) return false;
      if (activeUseCase && !t.useCases.includes(activeUseCase)) return false;
      if (accessFilter === "public" && t.accessStatus !== "Public") return false;
      if (accessFilter === "private" && t.accessStatus === "Public") return false;
      return true;
    });
  }, [tracks, activeMood, activeGenre, activeUseCase, accessFilter]);

  const filterBtnCls = (active: boolean) =>
    `text-xs tracking-widest px-3 py-1.5 border transition-colors uppercase ${
      active
        ? "border-primary text-primary bg-primary/5"
        : "border-border/60 text-muted-foreground hover:border-primary/40"
    }`;

  const hasActiveFilter = activeMood || activeGenre || activeUseCase || accessFilter !== "all";

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-4xl mb-16">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Catalogue</h1>
        <p className="text-xl text-muted-foreground font-serif italic">
          A curated collection of cinematic scores, evocative themes, and cross-cultural compositions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-10">

          <div>
            <h3 className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground uppercase mb-5 border-b border-border/40 pb-3">
              Access
            </h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setAccessFilter("all")} className={filterBtnCls(accessFilter === "all")}>All</button>
              <button onClick={() => setAccessFilter("public")} className={filterBtnCls(accessFilter === "public")}>Public</button>
              <button onClick={() => setAccessFilter("private")} className={filterBtnCls(accessFilter === "private")}>Private</button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground uppercase mb-5 border-b border-border/40 pb-3">
              Mood
            </h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveMood(null)} className={filterBtnCls(!activeMood)}>All</button>
              {allMoods.map((mood) => (
                <button key={mood} onClick={() => setActiveMood(mood === activeMood ? null : mood)} className={filterBtnCls(activeMood === mood)}>
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground uppercase mb-5 border-b border-border/40 pb-3">
              Genre
            </h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveGenre(null)} className={filterBtnCls(!activeGenre)}>All</button>
              {allGenres.map((genre) => (
                <button key={genre} onClick={() => setActiveGenre(genre === activeGenre ? null : genre)} className={filterBtnCls(activeGenre === genre)}>
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground uppercase mb-5 border-b border-border/40 pb-3">
              Use Case
            </h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveUseCase(null)} className={filterBtnCls(!activeUseCase)}>All</button>
              {allUseCases.map((uc) => (
                <button key={uc} onClick={() => setActiveUseCase(uc === activeUseCase ? null : uc)} className={filterBtnCls(activeUseCase === uc)}>
                  {uc}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilter && (
            <button
              onClick={() => { setActiveMood(null); setActiveGenre(null); setActiveUseCase(null); setAccessFilter("all"); }}
              className="text-[10px] uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        {/* Tracks Grid */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-sans tracking-widest text-muted-foreground mb-8 uppercase">
            {filteredTracks.length} {filteredTracks.length === 1 ? "Work" : "Works"}
            {hasActiveFilter && " (filtered)"}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredTracks.map((track) => {
              const accessStatus = track.accessStatus || "Public";
              const isPrivate = accessStatus === "Private" || accessStatus === "NDA / Token Access Required";
              const unlocked = isTrackUnlocked(track.id);

              return (
                <div
                  key={track.id}
                  className="group relative border border-border/40 bg-card/20 hover:border-primary/40 transition-colors duration-300 overflow-hidden flex flex-col"
                >
                  {/* Cover art thumbnail */}
                  {track.coverArtUrl && (
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={track.coverArtUrl}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-[10px] tracking-widest text-primary uppercase">{track.genre}</div>
                      <span className={`text-[8px] uppercase tracking-widest border px-2 py-1 flex items-center gap-1.5 ${ACCESS_BADGE[accessStatus]}`}>
                        {isPrivate && !unlocked && <LockIcon className="w-2.5 h-2.5" />}
                        {accessStatus}
                      </span>
                    </div>

                    <h2 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                      <Link href={`/music/${track.id}`} className="before:absolute before:inset-0">
                        {track.title}
                      </Link>
                    </h2>

                    <p className="text-muted-foreground font-serif italic line-clamp-2 text-sm mb-6 flex-1">
                      {isPrivate && !unlocked
                        ? track.description.slice(0, 80) + "…"
                        : track.description}
                    </p>

                    {/* Collaborators */}
                    {track.collaborators && track.collaborators.length > 0 && (
                      <p className="text-[10px] text-muted-foreground/60 font-sans mb-3">
                        With {track.collaborators.join(", ")}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/20 justify-between items-end">
                      <div className="flex flex-wrap gap-2">
                        {track.mood.map((m) => (
                          <span key={m} className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border/40 px-2 py-1">
                            {m}
                          </span>
                        ))}
                      </div>
                      {isPrivate && !unlocked && (
                        <span className="text-[9px] font-sans tracking-widest text-amber-400/80 uppercase flex items-center gap-1">
                          <LockIcon className="w-2.5 h-2.5" />
                          Preview
                        </span>
                      )}
                      {isPrivate && unlocked && (
                        <span className="text-[9px] font-sans tracking-widest text-green-400/80 uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTracks.length === 0 && (
            <div className="py-24 text-center border border-border/40 bg-card/10">
              <p className="text-muted-foreground font-serif italic mb-4">No works match these criteria.</p>
              <button
                onClick={() => { setActiveMood(null); setActiveGenre(null); setActiveUseCase(null); setAccessFilter("all"); }}
                className="text-xs tracking-[0.2em] uppercase text-primary hover:text-primary/80"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

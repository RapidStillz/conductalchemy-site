import { useEffect, useState, useMemo } from "react";
import { getTracks, Track, AccessStatus } from "@/lib/cms";
import { Link } from "wouter";

const ACCESS_BADGE: Record<AccessStatus, string> = {
  Public: "text-green-400 border-green-400/30",
  Private: "text-yellow-400 border-yellow-400/30",
  "NDA / Token Access Required": "text-red-400 border-red-400/30",
};

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);

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
      t.genre
        .split("/")
        .map((p) => p.trim())
        .forEach((p) => genres.add(p));
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
      return true;
    });
  }, [tracks, activeMood, activeGenre, activeUseCase]);

  const filterBtnCls = (active: boolean) =>
    `text-xs tracking-widest px-3 py-1.5 border transition-colors uppercase ${
      active
        ? "border-primary text-primary bg-primary/5"
        : "border-border/60 text-muted-foreground hover:border-primary/40"
    }`;

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
              Mood
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveMood(null)}
                className={filterBtnCls(!activeMood)}
                data-testid="filter-mood-all"
              >
                All
              </button>
              {allMoods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setActiveMood(mood === activeMood ? null : mood)}
                  className={filterBtnCls(activeMood === mood)}
                  data-testid={`filter-mood-${mood}`}
                >
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
              <button
                onClick={() => setActiveGenre(null)}
                className={filterBtnCls(!activeGenre)}
                data-testid="filter-genre-all"
              >
                All
              </button>
              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
                  className={filterBtnCls(activeGenre === genre)}
                  data-testid={`filter-genre-${genre}`}
                >
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
              <button
                onClick={() => setActiveUseCase(null)}
                className={filterBtnCls(!activeUseCase)}
                data-testid="filter-usecase-all"
              >
                All
              </button>
              {allUseCases.map((uc) => (
                <button
                  key={uc}
                  onClick={() => setActiveUseCase(uc === activeUseCase ? null : uc)}
                  className={filterBtnCls(activeUseCase === uc)}
                  data-testid={`filter-usecase-${uc}`}
                >
                  {uc}
                </button>
              ))}
            </div>
          </div>

          {(activeMood || activeGenre || activeUseCase) && (
            <button
              onClick={() => { setActiveMood(null); setActiveGenre(null); setActiveUseCase(null); }}
              className="text-[10px] uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
              data-testid="button-reset-filters"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        {/* Tracks Grid */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-sans tracking-widest text-muted-foreground mb-8 uppercase">
            {filteredTracks.length} {filteredTracks.length === 1 ? "Work" : "Works"}
            {(activeMood || activeGenre || activeUseCase) && " (filtered)"}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredTracks.map((track) => {
              const accessStatus = track.accessStatus || "Public";
              return (
                <div
                  key={track.id}
                  className="group relative border border-border/40 bg-card/20 p-6 flex flex-col hover:border-primary/40 transition-colors duration-300"
                  data-testid={`card-track-${track.id}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] tracking-widest text-primary uppercase">{track.genre}</div>
                    <span
                      className={`text-[8px] uppercase tracking-widest border px-2 py-1 ${ACCESS_BADGE[accessStatus]}`}
                      data-testid={`badge-access-${track.id}`}
                    >
                      {accessStatus}
                    </span>
                  </div>

                  <h2 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                    <Link
                      href={`/music/${track.id}`}
                      className="before:absolute before:inset-0"
                      data-testid={`link-track-${track.id}`}
                    >
                      {track.title}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground font-serif italic line-clamp-2 text-sm mb-6 flex-1">
                    {track.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/20">
                    {track.mood.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border/40 px-2 py-1"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTracks.length === 0 && (
            <div className="py-24 text-center border border-border/40 bg-card/10">
              <p className="text-muted-foreground font-serif italic mb-4">
                No works match these criteria.
              </p>
              <button
                onClick={() => { setActiveMood(null); setActiveGenre(null); setActiveUseCase(null); }}
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

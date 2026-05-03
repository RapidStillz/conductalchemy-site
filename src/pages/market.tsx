import { useEffect, useState, useMemo } from "react";
import { getTracks, Track } from "@/lib/cms";
import { isTrackUnlocked } from "@/lib/access";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";

// ---------------------------------------------------------------------------
// Market definitions
// ---------------------------------------------------------------------------

export type MarketSlug = "western" | "bollywood" | "international" | "all";

interface MarketDef {
  label: string;
  tagline: string;
  description: string;
  genreKeywords: string[];  // if any genre word matches, track belongs here
  accentClass: string;
  seoDescription: string;
}

const MARKETS: Record<MarketSlug, MarketDef> = {
  western: {
    label: "Western",
    tagline: "Hollywood-grade scores for Western productions",
    description:
      "Orchestral cinematic scores, contemporary soundtrack compositions, and cross-genre works built for Western film, television, and advertising. Influenced by classical technique, modern production, and decades of Hollywood tradition.",
    genreKeywords: [
      "cinematic", "classical", "rock", "electronic", "ambient", "jazz",
      "folk", "pop", "dance", "soundtrack", "alternative", "contemporary",
    ],
    accentClass: "from-blue-900/20",
    seoDescription:
      "Western cinematic and orchestral music for film, TV, and advertising — Conduct Alchemy.",
  },
  bollywood: {
    label: "Bollywood / Eastern",
    tagline: "Authentic South Asian music for the global screen",
    description:
      "Rooted in the rich traditions of Bollywood orchestration, Indian classical music, and contemporary South Asian production. From sweeping romantic themes to percussive action cues — music that carries culture.",
    genreKeywords: ["bollywood", "eastern", "indian", "south asian"],
    accentClass: "from-amber-900/20",
    seoDescription:
      "Bollywood and South Asian music for film, TV, and global productions — Conduct Alchemy.",
  },
  international: {
    label: "International",
    tagline: "World music and cross-cultural fusion for global productions",
    description:
      "Music that draws from multiple traditions — World, Fusion, and cross-cultural compositions that feel at home in international productions, documentaries, and multicultural narratives.",
    genreKeywords: ["world", "fusion", "international", "global", "hip-hop", "urban", "afro"],
    accentClass: "from-green-900/20",
    seoDescription:
      "International and world music for global film, TV, and media productions — Conduct Alchemy.",
  },
  all: {
    label: "All Music",
    tagline: "The complete Conduct Alchemy catalogue",
    description:
      "Browse every composition in the catalogue — from Bollywood orchestrations and Western cinematic scores to world music fusions and electronic ambient soundscapes.",
    genreKeywords: [],
    accentClass: "from-primary/10",
    seoDescription:
      "The complete Conduct Alchemy music catalogue — cinematic scores for sync licensing.",
  },
};

export function getTracksForMarket(slug: MarketSlug, tracks: Track[]): Track[] {
  if (slug === "all") return tracks;
  const def = MARKETS[slug];
  return tracks.filter((t) => {
    if (t.markets && t.markets.includes(slug)) return true;
    const genreLower = t.genre.toLowerCase();
    return def.genreKeywords.some((kw) => genreLower.includes(kw));
  });
}

// ---------------------------------------------------------------------------
// Shared track card
// ---------------------------------------------------------------------------

function TrackCard({ track }: { track: Track }) {
  const isPrivate =
    track.accessStatus === "Private" ||
    track.accessStatus === "NDA / Token Access Required";
  const unlocked = isTrackUnlocked(track.id);
  const href = `/music/${track.slug || track.id}`;

  return (
    <Link href={href}>
      <div className="group relative border border-border/40 bg-card/20 hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">
        {track.coverArtUrl ? (
          <div className="relative h-36 overflow-hidden">
            <img
              src={track.coverArtUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-card/30 flex items-center justify-center border-b border-border/20">
            <div className="text-primary/20">
              <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-sans tracking-widest text-primary uppercase">{track.genre}</span>
            {isPrivate && (
              <span className="text-[8px] uppercase tracking-widest border border-amber-400/30 text-amber-400 px-1.5 py-0.5">
                {unlocked ? "Unlocked" : "Private"}
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{track.title}</h3>
          <p className="text-xs text-muted-foreground font-serif italic line-clamp-2 mb-4 flex-1">{track.description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex gap-1.5 flex-wrap">
              {track.mood.slice(0, 2).map((m) => (
                <span key={m} className="text-[8px] uppercase tracking-widest text-muted-foreground border border-border/40 px-1.5 py-0.5">{m}</span>
              ))}
            </div>
            <span className="text-[9px] tracking-widest uppercase text-primary/60 group-hover:text-primary transition-colors">
              {isPrivate && !unlocked ? "Preview →" : "Listen →"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface MarketPageProps {
  slug: MarketSlug;
}

export default function MarketPage({ slug }: MarketPageProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const market = MARKETS[slug];

  useSEO({
    title: market.label,
    description: market.seoDescription,
    canonical: `https://conductalchemy.com/music/${slug}`,
  });

  useEffect(() => {
    setTracks(getTracks());
  }, []);

  const marketTracks = useMemo(() => getTracksForMarket(slug, tracks), [slug, tracks]);
  const publicCount = marketTracks.filter((t) => t.accessStatus === "Public").length;
  const privateCount = marketTracks.length - publicCount;

  return (
    <div className="flex flex-col w-full">

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className={`relative border-b border-border/40 py-24 md:py-32 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${market.accentClass} via-background to-background`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/music" className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                Catalogue
              </Link>
              <span className="text-muted-foreground/30">›</span>
              <span className="text-[10px] font-sans tracking-widest uppercase text-primary">{market.label}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-none">{market.label}</h1>
            <p className="text-xl text-primary/80 font-serif italic mb-6">{market.tagline}</p>
            <p className="text-muted-foreground font-sans leading-relaxed max-w-xl mb-8">{market.description}</p>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif">{marketTracks.length}</span>
                <span className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">
                  {marketTracks.length === 1 ? "Work" : "Works"}
                </span>
              </div>
              {publicCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">●</span>
                  <span className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">{publicCount} Open Access</span>
                </div>
              )}
              {privateCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-xs">●</span>
                  <span className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">{privateCount} By Arrangement</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OTHER MARKETS NAV                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-border/40 bg-card/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto py-0">
            {(["all", "western", "bollywood", "international"] as MarketSlug[]).map((s) => (
              <Link
                key={s}
                href={`/music/${s}`}
                className={`text-[10px] font-sans tracking-widest uppercase px-5 py-4 border-b-2 whitespace-nowrap transition-colors ${
                  s === slug
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {MARKETS[s].label}
              </Link>
            ))}
            <Link
              href="/music"
              className="text-[10px] font-sans tracking-widest uppercase px-5 py-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground ml-auto whitespace-nowrap"
            >
              Full Catalogue ↗
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TRACKS GRID                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          {marketTracks.length === 0 ? (
            <div className="py-24 text-center border border-border/40 bg-card/10">
              <p className="text-muted-foreground font-serif italic mb-4">
                No tracks in the {market.label} catalogue yet.
              </p>
              <Link href="/music" className="text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                Browse Full Catalogue →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-border/40 py-20 bg-card/10">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-primary mb-4">
            Sync Licensing
          </div>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Need {market.label} music for your production?
          </h2>
          <p className="text-muted-foreground font-serif italic mb-8">
            We work directly with music supervisors, directors, and creative teams. Stems, masters, and custom commissions available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/licensing"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase"
            >
              Licensing Info
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans border border-border hover:border-primary hover:text-primary transition-colors uppercase"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

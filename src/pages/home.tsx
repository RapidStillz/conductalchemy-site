import { useEffect, useState, useMemo, type JSX } from "react";
import { getSiteContent, getTracks, Track, SiteContent } from "@/lib/cms";
import { Link } from "wouter";

// ---------------------------------------------------------------------------
// Social icon helpers
// ---------------------------------------------------------------------------

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, JSX.Element> = {
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.7 1.7 4.8 4.8.1 1.2.1 1.6.1 4.9 0 3.2 0 3.6-.1 4.8-.1 3.1-1.6 4.7-4.8 4.8-1.2.1-1.6.1-4.8.1-3.2 0-3.6 0-4.8-.1-3.2-.1-4.7-1.7-4.8-4.8C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 3.9 2.3 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7C24 15.7 24 15.3 24 12c0-3.3 0-3.7-.1-4.9-.2-4.3-2.5-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z"/>
      </svg>
    ),
    spotify: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    soundcloud: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M1.175 12.225c-.088 0-.163.074-.175.165l-.233 2.154.233 2.105c.012.093.087.164.175.164.086 0 .16-.072.172-.164l.265-2.105-.265-2.154c-.012-.091-.086-.165-.172-.165zm1.491-.398c-.104 0-.188.084-.2.188l-.2 2.544.2 2.452c.012.104.096.188.2.188.107 0 .191-.084.203-.188l.227-2.452-.227-2.544c-.012-.104-.096-.188-.203-.188zm1.542-.315c-.12 0-.218.098-.228.22l-.174 2.859.174 2.757c.01.12.108.218.228.218.122 0 .22-.098.23-.218l.198-2.757-.198-2.859c-.01-.122-.108-.22-.23-.22zm1.551-.24c-.138 0-.249.11-.258.25l-.148 3.099.148 2.989c.009.14.12.25.258.25.14 0 .252-.11.261-.25l.168-2.989-.168-3.099c-.009-.14-.121-.25-.261-.25zm1.57-.208c-.154 0-.279.124-.287.28l-.123 3.307.123 3.193c.008.155.133.279.287.279.157 0 .283-.124.291-.279l.14-3.193-.14-3.307c-.008-.156-.134-.28-.291-.28zm1.585-.183c-.17 0-.308.137-.315.308l-.099 3.49.099 3.36c.007.17.145.308.315.308.172 0 .311-.138.319-.308l.112-3.36-.112-3.49c-.008-.171-.147-.308-.319-.308zm1.601-.163c-.188 0-.341.152-.347.34l-.075 3.653.075 3.518c.006.187.159.339.347.339.189 0 .342-.152.348-.339l.085-3.518-.085-3.653c-.006-.188-.159-.34-.348-.34zm3.877-1.61C13.824 9 12.97 9.285 12.29 9.78c-.192.14-.243.333-.248.518v7.394c.005.194.153.355.349.371h6.012C20.315 18.063 21 17.374 21 16.515c0-.856-.685-1.548-1.537-1.548-.225 0-.437.051-.628.141-.127-2.887-2.449-5.205-5.34-5.205z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  };
  return icons[platform] ?? null;
}

// ---------------------------------------------------------------------------
// Cover art card
// ---------------------------------------------------------------------------

function TrackCard({ track, priority }: { track: Track; priority?: boolean }) {
  const isPrivate =
    track.accessStatus === "Private" ||
    track.accessStatus === "NDA / Token Access Required";

  return (
    <Link href={`/music/${track.id}`}>
      <div className="group relative border border-border/40 bg-card/20 hover:border-primary/50 transition-all duration-500 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Cover art */}
        {track.coverArtUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={track.coverArtUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading={priority ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-card border-b border-border/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            <div className="text-primary/20">
              <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1" />
                <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1" />
                <circle cx="24" cy="24" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-sans tracking-widest text-primary uppercase">
              {track.genre}
            </span>
            {isPrivate && (
              <span className="text-[9px] uppercase tracking-widest border border-amber-400/30 text-amber-400 px-2 py-0.5">
                Private
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {track.title}
          </h3>
          <p className="text-xs text-muted-foreground font-serif italic line-clamp-2 flex-1">
            {track.description}
          </p>
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {track.mood.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="text-[9px] uppercase tracking-widest bg-background border border-border/40 px-2 py-0.5"
                >
                  {m}
                </span>
              ))}
            </div>
            <span className="text-[10px] tracking-widest uppercase text-primary/70 group-hover:text-primary transition-colors">
              {isPrivate ? "Preview →" : "Listen →"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Home() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [allTracks, setAllTracks] = useState<Track[]>([]);

  useEffect(() => {
    const sc = getSiteContent();
    setContent(sc);
    setAllTracks(getTracks());
  }, []);

  const heroTrack = useMemo(
    () => allTracks.find((t) => t.heroTrack) ?? allTracks.find((t) => t.featured && t.accessStatus === "Public") ?? null,
    [allTracks]
  );

  const publicTracks = useMemo(
    () =>
      allTracks
        .filter((t) => t.accessStatus === "Public")
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)),
    [allTracks]
  );

  const featuredTracks = useMemo(() => {
    if (!content) return [];
    return content.featuredTrackIds
      .map((id) => allTracks.find((t) => t.id === id))
      .filter((t): t is Track => !!t);
  }, [content, allTracks]);

  if (!content) return <div className="min-h-screen animate-pulse bg-background" />;

  const hasStats = content.heroStats && content.heroStats.length > 0;
  const hasCollaborators = content.collaboratorLogos && content.collaboratorLogos.length > 0;
  const hasClients = content.clientLogos && content.clientLogos.length > 0;
  const hasTestimonials = content.testimonials && content.testimonials.length > 0;

  return (
    <div className="flex flex-col w-full">

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-primary text-xs font-sans tracking-[0.4em] uppercase">
            {content.heroSubtitle}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-none max-w-4xl mx-auto">
            {content.heroTitle}
          </h1>

          {heroTrack && (
            <div className="border border-border/30 bg-card/20 px-6 py-4 max-w-md mx-auto backdrop-blur-sm">
              <div className="text-[9px] font-sans tracking-[0.3em] uppercase text-primary/70 mb-2">
                Now Featured
              </div>
              <div className="font-serif text-lg">{heroTrack.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{heroTrack.genre}</div>
            </div>
          )}

          <p className="text-lg md:text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
            {content.heroTagline}
          </p>

          <p className="text-sm text-muted-foreground/70 font-sans max-w-xl mx-auto">
            Cinematic music for films, series, games and brands — and for anyone who simply loves music made with intention.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href={heroTrack ? `/music/${heroTrack.id}` : "/music"}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-[0.2em] font-sans bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase"
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                <path d="M4 2.5l7 4.5-7 4.5V2.5z" fill="currentColor" />
              </svg>
              Listen Now
            </Link>
            <Link
              href="/licensing"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans border border-border hover:border-primary hover:text-primary transition-colors uppercase"
            >
              Licensing Enquiries
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="text-[9px] font-sans tracking-widest uppercase">Scroll</div>
          <div className="w-px h-8 bg-foreground/30 animate-pulse" />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* LISTEN NOW — PUBLIC TRACKS                                           */}
      {/* ------------------------------------------------------------------ */}
      {publicTracks.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-primary mb-4">
                  Open Access
                </div>
                <h2 className="text-3xl md:text-4xl font-serif">Listen Now</h2>
                <div className="w-12 h-px bg-primary mt-6" />
                <p className="text-muted-foreground font-serif italic mt-4 max-w-md">
                  Freely available tracks — no signup required. Just press play.
                </p>
              </div>
              <Link
                href="/music"
                className="text-sm font-sans tracking-widest text-muted-foreground hover:text-primary uppercase transition-colors shrink-0"
              >
                Full Catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicTracks.slice(0, 6).map((track, i) => (
                <TrackCard key={track.id} track={track} priority={i < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FEATURED SELECTION (if no public tracks or as supplement)           */}
      {/* ------------------------------------------------------------------ */}
      {publicTracks.length === 0 && featuredTracks.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif">Featured Resonance</h2>
                <div className="w-12 h-px bg-primary mt-6" />
              </div>
              <Link href="/music" className="text-sm font-sans tracking-widest text-muted-foreground hover:text-primary uppercase transition-colors">
                View All Works →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {featuredTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WHO WE ARE — listener-friendly                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 md:py-32 bg-card/20 border-t border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-primary mb-6">
                About the Imprint
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">
                Music made with intention
              </h2>
              <p className="text-muted-foreground font-serif italic text-lg leading-relaxed mb-6">
                "{content.aboutText}"
              </p>
              <Link
                href="/about"
                className="inline-block border-b border-primary/30 pb-1 text-sm tracking-[0.2em] hover:text-primary hover:border-primary transition-all uppercase"
              >
                Our Story
              </Link>
            </div>

            <div className="space-y-6">
              <div className="border border-border/40 p-6 bg-background/50">
                <div className="text-primary/60 mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
                    <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  Whether you're discovering us for the first time or clearing a track for a major production — our music is built to move people.
                </p>
              </div>
              <div className="border border-border/40 p-6 bg-background/50">
                <div className="text-primary/60 mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  Cross-cultural at its core — drawing from Bollywood orchestration, Western classical technique, and contemporary production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOR INDUSTRY — professional CTA                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 md:py-32 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-primary mb-6">
                  For Film, TV & Brands
                </div>
                <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-6">
                  {content.proCtaTitle}
                </h2>
                <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                  {content.proCtaText}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
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
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "🎬", label: "Sync Licensing", desc: "Film, TV, advertising, and digital." },
                  { icon: "🎼", label: "Full Stems & Masters", desc: "Delivered to broadcast spec." },
                  { icon: "🤝", label: "Direct Relationships", desc: "Work with us, not a middleman." },
                  { icon: "🎯", label: "Custom Commissions", desc: "Original compositions on request." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 border border-border/30 p-4 bg-card/20">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <div className="text-sm font-sans tracking-wide font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS ROW                                                            */}
      {/* ------------------------------------------------------------------ */}
      {hasStats && (
        <section className="border-t border-border/40 py-16 bg-card/10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
              {content.heroStats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-2xl md:text-3xl font-serif text-primary">{stat.value}</div>
                  <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* COLLABORATORS / CLIENTS                                              */}
      {/* ------------------------------------------------------------------ */}
      {(hasCollaborators || hasClients) && (
        <section className="border-t border-border/40 py-20">
          <div className="container mx-auto px-4 md:px-8">
            {hasCollaborators && (
              <div className="mb-12">
                <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-muted-foreground/50 text-center mb-8">
                  Collaborators
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {content.collaboratorLogos.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <span className="text-xs font-sans tracking-widest text-muted-foreground/60 uppercase border border-border/30 px-4 py-2 hover:border-primary/30 transition-colors">
                          {item.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hasClients && (
              <div>
                <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-muted-foreground/50 text-center mb-8">
                  {hasCollaborators ? "Clients & Partners" : "Trusted By"}
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {content.clientLogos.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <span className="text-xs font-sans tracking-widest text-muted-foreground/60 uppercase border border-border/30 px-4 py-2 hover:border-primary/30 transition-colors">
                          {item.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS                                                         */}
      {/* ------------------------------------------------------------------ */}
      {hasTestimonials && (
        <section className="py-24 border-t border-border/40 bg-card/10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {content.testimonials.map((t, i) => (
                <div key={i} className="border border-border/40 p-8 bg-background/50 flex flex-col gap-4">
                  <div className="text-primary/30 text-4xl font-serif leading-none">"</div>
                  <p className="font-serif italic text-muted-foreground leading-relaxed flex-1">
                    {t.quote}
                  </p>
                  <div className="pt-4 border-t border-border/20">
                    <div className="text-sm font-sans tracking-wide">{t.author}</div>
                    {t.role && (
                      <div className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground/60 mt-0.5">
                        {t.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VISUAL WORLDS TEASER                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 md:py-32 border-t border-border/40 overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif">Visual Worlds</h2>
            <div className="w-12 h-px bg-primary" />
            <p className="text-lg text-muted-foreground font-serif italic max-w-lg">
              Music is never just heard. It is seen. Explore the cinematic landscapes and narrative seeds forged alongside our compositions.
            </p>
            <Link
              href="/visual-worlds"
              className="inline-flex items-center text-sm font-sans tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors pt-4"
            >
              Enter The Worlds →
            </Link>
          </div>
          <div className="flex-1 w-full aspect-[4/3] bg-card border border-border/40 relative group">
            <div className="absolute inset-0 bg-background/50 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute inset-4 border border-border/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
                Cinematic Concept
              </div>
              <div className="font-serif text-xl">Monsoon Courtyard</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BOTTOM CTA STRIP                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-border/40 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif mb-4">
            Ready to find the right sound?
          </h2>
          <p className="text-muted-foreground text-sm font-sans mb-8 max-w-md mx-auto">
            Browse the catalogue, explore track details, or reach out directly to our licensing team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/music"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase"
            >
              Browse Catalogue
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

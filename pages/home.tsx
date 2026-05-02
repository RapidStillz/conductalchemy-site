import { useEffect, useState } from "react";
import { getSiteContent, getTracks, Track, SiteContent } from "@/lib/cms";
import { Link } from "wouter";

export default function Home() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);

  useEffect(() => {
    const siteContent = getSiteContent();
    setContent(siteContent);
    
    const allTracks = getTracks();
    const featured = allTracks.filter(t => siteContent.featuredTrackIds.includes(t.id));
    setFeaturedTracks(featured);
  }, []);

  if (!content) return <div className="min-h-screen animate-pulse bg-background"></div>;

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-primary text-sm font-sans tracking-[0.3em] uppercase">{content.heroSubtitle}</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-none max-w-4xl mx-auto">
            {content.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
            {content.heroTagline}
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/music" className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase">
              Explore Catalogue
            </Link>
            <Link href="/licensing" className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.2em] font-sans border border-border hover:border-primary hover:text-primary transition-colors uppercase">
              Licensing Enquiries
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif">Featured Resonance</h2>
              <div className="w-12 h-px bg-primary mt-6"></div>
            </div>
            <Link href="/music" className="text-sm font-sans tracking-widest text-muted-foreground hover:text-primary uppercase transition-colors">
              View All Works →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {featuredTracks.map(track => (
              <div key={track.id} className="group flex flex-col border border-border/40 bg-card/30 p-8 hover:border-primary/50 transition-colors duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-xs font-sans tracking-widest text-primary uppercase">{track.genre}</div>
                  <div className="text-xs font-sans text-muted-foreground">{track.bpm} BPM</div>
                </div>
                <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">{track.title}</h3>
                <p className="text-muted-foreground font-serif italic line-clamp-2 mb-8">{track.description}</p>
                <div className="mt-auto pt-6 border-t border-border/40 flex justify-between items-center">
                  <div className="flex gap-2">
                    {track.mood.slice(0,2).map(m => (
                      <span key={m} className="text-[10px] uppercase tracking-widest bg-background border border-border px-2 py-1">{m}</span>
                    ))}
                  </div>
                  <Link href={`/music/${track.id}`} className="text-sm tracking-widest hover:text-primary transition-colors uppercase">
                    Listen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-24 md:py-32 bg-card/20 border-t border-border/40">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="text-primary mb-8">
            <svg className="w-8 h-8 mx-auto opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2L2 12l10 10 10-10L12 2zM12 6l6 6-6 6-6-6 6-6z" />
            </svg>
          </div>
          <p className="text-xl md:text-3xl font-serif leading-relaxed text-muted-foreground mb-12">
            "{content.aboutText}"
          </p>
          <Link href="/about" className="inline-block border-b border-primary/30 pb-1 text-sm tracking-[0.2em] hover:text-primary hover:border-primary transition-all uppercase">
            Our Story
          </Link>
        </div>
      </section>

      {/* Visual Worlds Teaser */}
      <section className="py-24 md:py-32 border-t border-border/40 overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif">Visual Worlds</h2>
            <div className="w-12 h-px bg-primary"></div>
            <p className="text-lg text-muted-foreground font-serif italic max-w-lg">
              Music is never just heard. It is seen. Explore the cinematic landscapes and narrative seeds forged alongside our compositions.
            </p>
            <Link href="/visual-worlds" className="inline-flex items-center text-sm font-sans tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors pt-4">
              Enter The Worlds →
            </Link>
          </div>
          <div className="flex-1 w-full aspect-[4/3] bg-card border border-border/40 relative group">
            <div className="absolute inset-0 bg-background/50 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute inset-4 border border-border/20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xs tracking-widest text-muted-foreground uppercase mb-2">Cinematic Concept</div>
              <div className="font-serif text-xl">Monsoon Courtyard</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
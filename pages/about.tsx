import { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/cms";

export default function About() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  if (!content) return null;

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-5 relative">
          <div className="aspect-[3/4] bg-card border border-border/40 relative">
            <div className="absolute inset-4 border border-border/20"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-7 space-y-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif mb-8">Forged in Resonance.</h1>
            <div className="w-16 h-px bg-primary mb-8"></div>
            <p className="text-xl font-serif leading-relaxed text-muted-foreground">
              {content.aboutText}
            </p>
          </div>

          <div className="space-y-8 text-sm font-sans tracking-wide leading-loose text-muted-foreground">
            <p>
              We do not mass-produce audio. We craft bespoke resonance for visual media. Founded on the belief that true emotional impact requires a synthesis of disparate traditions, Conduct Alchemy brings the grand scale of Western orchestration into dialogue with cross-cultural instruments and scales.
            </p>
            <p>
              Our process mirrors an apothecary's meticulous approach. We measure tension, balance release, and source organic instrumentation to create textures that feel fundamentally human. Whether scoring a sweeping epic or an intimate character drama, our imprint exists to elevate the frame.
            </p>
          </div>

          <div className="pt-12 border-t border-border/40 grid grid-cols-2 gap-8">
            <div>
              <div className="text-2xl font-serif text-foreground mb-2">01.</div>
              <div className="text-xs font-sans tracking-widest uppercase text-primary mb-4">The Craft</div>
              <p className="text-sm text-muted-foreground font-serif italic">Restraint before excess. Every note must earn its place in the mix.</p>
            </div>
            <div>
              <div className="text-2xl font-serif text-foreground mb-2">02.</div>
              <div className="text-xs font-sans tracking-widest uppercase text-primary mb-4">The Scale</div>
              <p className="text-sm text-muted-foreground font-serif italic">Intimacy capable of exploding into grand cinematic breadth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
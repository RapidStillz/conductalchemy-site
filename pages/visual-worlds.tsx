import { useEffect, useState } from "react";
import { getTracks, Track } from "@/lib/cms";
import { Link } from "wouter";

export default function VisualWorlds() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    setTracks(getTracks().filter(t => t.visualConceptNotes));
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Visual Worlds</h1>
        <p className="text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
          Music is not conceived in darkness. It grows from images, scenes, and narrative fragments. These are the visual anchors that forged the resonance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {tracks.map(track => (
          <div key={track.id} className="group cursor-pointer">
            <div className="w-full aspect-video bg-card border border-border/40 mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--background))] opacity-60 z-10"></div>
              <div className="w-[80%] h-[80%] border border-border/20 absolute"></div>
              <div className="text-muted-foreground font-serif italic text-sm text-center px-8 z-20 group-hover:scale-105 transition-transform duration-700">
                "{track.visualConceptNotes}"
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs font-sans tracking-[0.2em] text-primary uppercase mb-2">{track.genre}</div>
                <h3 className="text-2xl font-serif group-hover:text-primary transition-colors">{track.title}</h3>
              </div>
              <Link href={`/music/${track.id}`} className="text-xs font-sans tracking-widest text-muted-foreground uppercase hover:text-foreground">
                Hear Track →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
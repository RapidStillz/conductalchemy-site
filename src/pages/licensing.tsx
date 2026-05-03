import { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/cms";
import { useSEO } from "@/hooks/use-seo";

export default function Licensing() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useSEO({
    title: "Licensing",
    description:
      "Sync licensing for film, television, advertising and digital media. Full stems, alternate edits, and custom commissions available. Work directly with the Conduct Alchemy team.",
    canonical: "https://conductalchemy.com/licensing",
  });

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    console.log("Licensing Enquiry Submitted:", data);
    alert("Enquiry submitted. Check console for details.");
    e.currentTarget.reset();
  };

  if (!content) return null;

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-8">For Film & Media</h1>
        <p className="text-xl text-muted-foreground font-serif italic mb-16 leading-relaxed">
          {content.licensingIntro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-12">
            <section>
              <h3 className="text-xs font-sans tracking-[0.2em] text-primary uppercase mb-6">Available Assets</h3>
              <ul className="space-y-4 text-sm font-sans tracking-wide">
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5"></div>
                  <div>
                    <strong className="block text-foreground mb-1">Full Mixes & Instrumentals</strong>
                    <span className="text-muted-foreground">High-resolution uncompressed audio files.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5"></div>
                  <div>
                    <strong className="block text-foreground mb-1">Separated Stems</strong>
                    <span className="text-muted-foreground">Strings, brass, percussion, choir, synths isolated.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5"></div>
                  <div>
                    <strong className="block text-foreground mb-1">Alternate Edits</strong>
                    <span className="text-muted-foreground">Underscore, trailer stings, 15/30/60s cutdowns.</span>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-sans tracking-[0.2em] text-primary uppercase mb-6">Sync Use Cases</h3>
              <div className="grid grid-cols-2 gap-4 text-sm font-serif italic text-muted-foreground">
                <div>• Theatrical Trailers</div>
                <div>• Main Title Sequences</div>
                <div>• Feature Film Score</div>
                <div>• Premium TV Drama</div>
                <div>• High-end Advertising</div>
                <div>• Video Game Campaigns</div>
              </div>
            </section>
          </div>

          <div className="bg-card/20 border border-border/40 p-8 md:p-10">
            <h3 className="text-2xl font-serif mb-8">Licensing Enquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Name</label>
                <input required type="text" id="name" name="name" className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label htmlFor="company" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Company / Production</label>
                <input required type="text" id="company" name="company" className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Email Address</label>
                <input required type="email" id="email" name="email" className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label htmlFor="projectDetails" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Project Details & Track Needs</label>
                <textarea required id="projectDetails" name="projectDetails" rows={4} className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-foreground text-background py-4 text-xs font-sans tracking-[0.2em] uppercase hover:bg-primary transition-colors">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

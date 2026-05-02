import { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/cms";

export default function Contact() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    console.log("Contact Form Submitted:", data);
    alert("Message sent. Check console for details.");
    e.currentTarget.reset();
  };

  if (!content) return null;

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-serif mb-6 text-center">Contact</h1>
      <p className="text-xl text-muted-foreground font-serif italic text-center mb-16">
        Reach out for bespoke scoring, licensing, or general enquiries.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-xs font-sans tracking-[0.2em] text-primary uppercase mb-8">Direct Contact</h2>
          <div className="space-y-8">
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Licensing & Sync</div>
              <a href={`mailto:${content.contactEmail}`} className="text-lg font-serif hover:text-primary transition-colors">
                {content.contactEmail}
              </a>
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Location</div>
              <address className="text-lg font-serif not-italic text-muted-foreground">
                Los Angeles, CA<br/>
                London, UK
              </address>
            </div>
            <div className="pt-8 border-t border-border/40">
              <p className="text-sm font-sans tracking-wide text-muted-foreground leading-relaxed">
                For immediate sync needs, please include production timelines and rough budget parameters in your initial email.
              </p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-card/10 p-8 border border-border/40">
            <div>
              <label htmlFor="name" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Name</label>
              <input required type="text" id="name" name="name" className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Email</label>
              <input required type="email" id="email" name="email" className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2">Message</label>
              <textarea required id="message" name="message" rows={5} className="w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-xs font-sans tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors" data-testid="button-submit-contact">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default function Legal() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-serif mb-12">Legal Information</h1>
      
      <div className="space-y-12 font-sans text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-4">Copyright Notice</h2>
          <p>
            © {new Date().getFullYear()} Conduct Alchemy. All rights reserved. 
            All musical compositions, sound recordings, lyrics, visual assets, and text contained on this website are the exclusive property of Conduct Alchemy unless otherwise noted. Unauthorized reproduction, distribution, or broadcast is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-4">Licensing Terms</h2>
          <p>
            Sync licenses granted by Conduct Alchemy are specific to the production, term, and territory agreed upon in writing. Mere possession of stems, instrumentals, or preview audio does not constitute a license to synchronize or publish the work.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-4">ISRC Registration</h2>
          <p className="font-serif italic text-foreground/70">
            Placeholder for collective ISRC catalog information. Detailed codes are provided upon final delivery of licensed assets.
          </p>
        </section>
      </div>
    </div>
  );
}
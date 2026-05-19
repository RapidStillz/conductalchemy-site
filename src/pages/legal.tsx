export default function Legal() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-serif mb-4">Legal Information</h1>
      <p className="text-sm text-muted-foreground font-sans mb-12">
        Last updated: {new Date().getFullYear()}. These policies apply to conductalchemy.com and all related services.
      </p>

      <nav className="flex flex-wrap gap-4 mb-16 border-b border-border/30 pb-6">
        {[
          { href: "#privacy", label: "Privacy Policy" },
          { href: "#terms", label: "Terms of Use" },
          { href: "#cookies", label: "Cookie Policy" },
          { href: "#copyright", label: "Copyright" },
          { href: "#licensing", label: "Licensing Terms" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="text-[10px] font-sans tracking-[0.15em] uppercase text-primary hover:underline underline-offset-4"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-16 font-sans text-sm leading-relaxed text-muted-foreground">

        {/* ------------------------------------------------------------------ */}
        {/* PRIVACY POLICY                                                       */}
        {/* ------------------------------------------------------------------ */}
        <section id="privacy">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-6">
            Privacy Policy
          </h2>
          <div className="space-y-4">
            <p>
              Conduct Alchemy ("we", "us", "our") is committed to protecting your personal data and
              respecting your privacy in accordance with the UK General Data Protection Regulation
              (UK GDPR) and the Data Protection Act 2018.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              What data we collect
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Name and email address when you submit an enquiry or newsletter signup</li>
              <li>Intended use and project details provided voluntarily in forms</li>
              <li>Page view data stored locally in your browser (no external analytics)</li>
              <li>Unlock/access requests for private catalogue tracks</li>
            </ul>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              How we use your data
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>To respond to licensing enquiries and contact form submissions</li>
              <li>To send newsletters and updates you have explicitly opted into</li>
              <li>To manage access to private or NDA-protected catalogue content</li>
            </ul>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Data storage
            </h3>
            <p>
              All form data is stored in your browser's localStorage unless you are interacting
              with our Worker API (where available). We do not use third-party CRM platforms or
              send your data to advertising networks.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Your rights
            </h3>
            <p>
              Under UK GDPR you have the right to access, correct, or request deletion of your
              personal data. To exercise these rights, contact us at the email address on our
              Contact page. We will respond within 30 days.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Legal basis
            </h3>
            <p>
              We process your data on the basis of: (a) your explicit consent where a consent
              checkbox is provided; (b) legitimate interests for responding to direct enquiries;
              (c) contractual necessity when processing a licence agreement.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* TERMS OF USE                                                         */}
        {/* ------------------------------------------------------------------ */}
        <section id="terms">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-6">
            Terms of Use
          </h2>
          <div className="space-y-4">
            <p>
              By accessing conductalchemy.com you agree to these terms. If you do not agree,
              please do not use the site.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Permitted use
            </h3>
            <p>
              This site is for personal and commercial enquiry purposes only. You may listen to
              preview audio for evaluation purposes. You may not reproduce, distribute, broadcast,
              or synchronise any audio or visual content without a written licence from Conduct Alchemy.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              No implied licence
            </h3>
            <p>
              Access to preview content — including unlocked stems, samples, or full-length previews —
              does not constitute a licence to use the material commercially or in any publication.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Limitation of liability
            </h3>
            <p>
              Conduct Alchemy is not liable for indirect, consequential, or incidental losses
              arising from use of this site or its content. The site is provided "as is" without
              warranty of any kind.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Governing law
            </h3>
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* COOKIE POLICY                                                        */}
        {/* ------------------------------------------------------------------ */}
        <section id="cookies">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-6">
            Cookie Policy
          </h2>
          <div className="space-y-4">
            <p>
              We use browser localStorage (not traditional cookies) to store your preferences and
              session data. No data is transmitted to third-party cookie networks.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              What we store locally
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <span className="font-medium text-foreground/70">ca_cookie_consent</span> — your
                cookie consent preference
              </li>
              <li>
                <span className="font-medium text-foreground/70">ca_track_access</span> — which
                private tracks you have been granted access to
              </li>
              <li>
                <span className="font-medium text-foreground/70">ca_unlock_log</span> — your
                unlock request history
              </li>
              <li>
                <span className="font-medium text-foreground/70">ca_enquiries</span> — contact
                form submissions (admin only)
              </li>
              <li>
                <span className="font-medium text-foreground/70">ca_newsletter_signups</span> —
                newsletter signup records (admin only)
              </li>
              <li>
                <span className="font-medium text-foreground/70">ca_pageviews</span> — anonymised
                local page view analytics
              </li>
            </ul>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              Managing your preferences
            </h3>
            <p>
              You can clear all locally stored data at any time via your browser's developer tools
              (Application → Local Storage). Declining cookies on the consent banner will prevent
              optional analytics storage but essential session data may still be stored.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* COPYRIGHT                                                            */}
        {/* ------------------------------------------------------------------ */}
        <section id="copyright">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-6">
            Copyright Notice
          </h2>
          <p>
            © {new Date().getFullYear()} Conduct Alchemy. All rights reserved. All musical
            compositions, sound recordings, lyrics, visual assets, and text contained on this
            website are the exclusive property of Conduct Alchemy unless otherwise noted.
            Unauthorised reproduction, distribution, or broadcast is strictly prohibited.
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* LICENSING TERMS                                                      */}
        {/* ------------------------------------------------------------------ */}
        <section id="licensing">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-6">
            Licensing Terms
          </h2>
          <div className="space-y-4">
            <p>
              Sync licences granted by Conduct Alchemy are specific to the production, term, and
              territory agreed upon in writing. Mere possession of stems, instrumentals, or preview
              audio does not constitute a licence to synchronise or publish the work.
            </p>
            <h3 className="text-foreground/80 font-medium text-xs uppercase tracking-widest mt-6 mb-2">
              ISRC Registration
            </h3>
            <p className="font-serif italic text-foreground/70">
              ISRC codes are provided upon final delivery of licensed assets. Contact us for
              catalogue registration details.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

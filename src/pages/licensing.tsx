import { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/cms";
import { submitEnquiry, type EnquirySubject, type Enquiry } from "@/lib/enquiries";
import { useSEO } from "@/hooks/use-seo";

function safeFormatDate(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

export default function Licensing() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Enquiry | null>(null);

  useSEO({
    title: "Licensing",
    description:
      "Sync licensing for film, television, advertising and digital media. Full stems, alternate edits, and custom commissions available. Work directly with the Conduct Alchemy team.",
    canonical: "https://conductalchemy.com/licensing",
  });

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!company.trim()) e.company = "Company or production name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "A valid email is required.";
    if (!projectDetails.trim() || projectDetails.trim().length < 10) e.projectDetails = "Please describe your project (at least 10 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300));
    const result = submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      subject: "Licensing / Sync" as EnquirySubject,
      message: company.trim()
        ? `Company / Production: ${company.trim()}\n\n${projectDetails.trim()}`
        : projectDetails.trim(),
    });
    setSubmitting(false);
    setReceipt(result);
  }

  function handleReset() {
    setReceipt(null);
    setName(""); setCompany(""); setEmail(""); setProjectDetails("");
    setErrors({});
  }

  if (!content) return null;

  const inputCls = "w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2";
  const errCls = "text-[10px] font-sans mt-1.5 text-red-500";

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

            {receipt ? (
              // ---- Receipt ----
              <div>
                <div className="text-[9px] font-sans tracking-[0.3em] uppercase text-green-400 mb-3">Enquiry Received</div>
                <h4 className="text-xl font-serif mb-2">Thank you, {receipt.name}.</h4>
                <p className="text-sm font-serif italic text-muted-foreground mb-8 leading-relaxed">
                  Message sent. Thank you — we'll be in touch at {receipt.email}.
                </p>
                <div className="border border-border/30 bg-background/30 px-5 py-4 space-y-3 mb-6">
                  <div className="text-[9px] font-sans tracking-widest uppercase text-muted-foreground mb-2">Submission summary</div>
                  {[
                    { label: "Name", value: receipt.name },
                    { label: "Email", value: receipt.email },
                    { label: "Submitted", value: safeFormatDate(receipt.timestamp) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 text-sm">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">{label}</span>
                      <span className="font-serif text-right truncate">{value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs uppercase tracking-widest border border-border/60 px-6 py-3 hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              // ---- Form ----
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your full name" autoComplete="name" className={inputCls}
                  />
                  {errors.name && <p className={errCls}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Company / Production</label>
                  <input
                    type="text" value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="Studio, agency, or production name" className={inputCls}
                  />
                  {errors.company && <p className={errCls}>{errors.company}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" autoComplete="email" className={inputCls}
                  />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelCls}>Project Details & Track Needs</label>
                  <textarea
                    value={projectDetails}
                    onChange={e => setProjectDetails(e.target.value)}
                    rows={4}
                    placeholder="Describe your project, timeline, and the type of music you're looking for…"
                    className={`${inputCls} resize-none`}
                  />
                  {errors.projectDetails && <p className={errCls}>{errors.projectDetails}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-foreground text-background py-4 text-xs font-sans tracking-[0.2em] uppercase hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Submit Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/cms";
import {
  submitEnquiry, ENQUIRY_SUBJECTS, type EnquirySubject, type Enquiry,
} from "@/lib/enquiries";
import { useSEO } from "@/hooks/use-seo";

const MSG_MAX = 1000;

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

export default function Contact() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<EnquirySubject | "">("");
  const [message, setMessage] = useState("");
  const [trackRef, setTrackRef] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Enquiry | null>(null);

  useSEO({
    title: "Contact",
    description: "Get in touch with Conduct Alchemy for licensing enquiries, custom commissions, or general questions.",
    canonical: "https://conductalchemy.com/contact",
  });

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "A valid email is required.";
    if (!subject) e.subject = "Please select a subject.";
    if (!message.trim() || message.trim().length < 10) e.message = "Please write at least 10 characters.";
    if (!consent) e.consent = "Please confirm your consent to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      subject: subject as EnquirySubject,
      message: message.trim(),
      trackReference: trackRef.trim() || undefined,
      intendedUse: intendedUse.trim() || undefined,
      gdprConsent: consent,
    });
    setSubmitting(false);
    setReceipt(result);
  }

  function handleReset() {
    setReceipt(null);
    setName(""); setEmail(""); setSubject(""); setMessage(""); setTrackRef("");
    setIntendedUse(""); setConsent(false); setErrors({});
  }

  if (!content) return null;

  const inputCls = "w-full bg-background border border-border/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-xs font-sans tracking-[0.1em] text-muted-foreground uppercase mb-2";
  const errCls = "text-[10px] font-sans mt-1.5 text-red-500";

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-serif mb-6 text-center">Contact</h1>
      <p className="text-xl text-muted-foreground font-serif italic text-center mb-16">
        Reach out for bespoke scoring, licensing, or general enquiries.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left: Direct contact info */}
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
                Los Angeles, CA<br />
                London, UK
              </address>
            </div>
            <div className="pt-8 border-t border-border/40">
              <p className="text-sm font-sans tracking-wide text-muted-foreground leading-relaxed">
                For immediate sync needs, please include production timelines and rough budget parameters in your initial message.
              </p>
            </div>

            {/* Subject guide */}
            <div className="space-y-3 pt-4">
              {[
                { s: "Licensing / Sync", desc: "Clear a track for a production" },
                { s: "Custom Commission", desc: "Original music on request" },
                { s: "Press / Media", desc: "Press requests and interviews" },
                { s: "General", desc: "Anything else" },
              ].map(({ s, desc }) => (
                <div key={s} className="flex gap-3 items-start">
                  <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <div className="text-xs font-sans tracking-wide">{s}</div>
                    <div className="text-[10px] text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form or receipt */}
        <div>
          {receipt ? (
            // ---- Receipt ----
            <div className="bg-card/10 border border-border/40 p-8">
              <div className="text-[9px] font-sans tracking-[0.3em] uppercase text-green-400 mb-3">Message Received</div>
              <h2 className="text-2xl font-serif mb-2">Thank you, {receipt.name}.</h2>
              <p className="text-sm font-serif italic text-muted-foreground mb-8 leading-relaxed">
                Your enquiry has been saved. We'll be in touch at {receipt.email}.
              </p>
              <div className="border border-border/30 bg-background/30 px-5 py-4 space-y-3 mb-6">
                <div className="text-[9px] font-sans tracking-widest uppercase text-muted-foreground mb-2">Submission summary</div>
                {[
                  { label: "Name", value: receipt.name },
                  { label: "Email", value: receipt.email },
                  { label: "Subject", value: receipt.subject },
                  { label: "Sent", value: safeFormatDate(receipt.timestamp) },
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
                Send Another Message
              </button>
            </div>
          ) : (
            // ---- Form ----
            <form onSubmit={handleSubmit} className="space-y-5 bg-card/10 p-8 border border-border/40">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" autoComplete="name" className={inputCls}
                />
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" autoComplete="email" className={inputCls}
                />
                {errors.email && <p className={errCls}>{errors.email}</p>}
              </div>

              <div>
                <label className={labelCls}>Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as EnquirySubject)}
                    className={`${inputCls} appearance-none bg-background cursor-pointer`}
                  >
                    <option value="" disabled>Select a subject…</option>
                    {ENQUIRY_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">▾</span>
                </div>
                {errors.subject && <p className={errCls}>{errors.subject}</p>}
              </div>

              <div>
                <label className={labelCls}>Track Reference <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span></label>
                <input
                  type="text" value={trackRef} onChange={e => setTrackRef(e.target.value)}
                  placeholder="e.g. Rishte Naya, Hobey Main Theme…" className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Intended Use <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span></label>
                <input
                  type="text" value={intendedUse} onChange={e => setIntendedUse(e.target.value)}
                  placeholder="e.g. Film, TV Drama, Advertising, Game…" className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, MSG_MAX))}
                  placeholder="Tell us about your project…"
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
                <div className={`text-[9px] text-right mt-1 font-sans ${message.length >= MSG_MAX ? "text-red-500" : "text-muted-foreground/40"}`}>
                  {message.length} / {MSG_MAX}
                </div>
                {errors.message && <p className={errCls}>{errors.message}</p>}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-primary shrink-0"
                />
                <span className="text-[10px] font-sans text-muted-foreground leading-relaxed">
                  I agree that Conduct Alchemy may contact me regarding this enquiry and send relevant updates.
                  See our <a href="/legal#privacy" className="text-primary underline underline-offset-2">Privacy Policy</a>.
                </span>
              </label>
              {errors.consent && <p className={errCls}>{errors.consent}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-4 text-xs font-sans tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

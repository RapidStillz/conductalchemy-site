import { useState } from "react";
import { submitEnquiry } from "@/lib/enquiries";

interface LicenceRequestModalProps {
  trackTitle: string;
  trackSlug: string;
  onClose: () => void;
}

const INTENDED_USES = [
  "Film",
  "TV Drama",
  "Advertising / Brand",
  "Game / Interactive",
  "Sports / Broadcast",
  "Digital / Social",
  "Other",
];

const MSG_MAX = 800;

export function LicenceRequestModal({ trackTitle, trackSlug, onClose }: LicenceRequestModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "A valid email is required.";
    if (!intendedUse) e.intendedUse = "Please select an intended use.";
    if (!consent) e.consent = "You must agree to the terms to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      subject: "Licensing / Sync",
      message: message.trim() || `Licence request for: ${trackTitle}`,
      trackReference: `${trackTitle} (${trackSlug})`,
      intendedUse,
      gdprConsent: consent,
    });
    setSubmitting(false);
    setDone(true);
  }

  const inputCls =
    "w-full bg-background border border-border/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls =
    "block text-[10px] font-sans tracking-[0.15em] text-muted-foreground uppercase mb-1.5";
  const errCls = "text-[10px] font-sans text-red-400 mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-background border border-border/60 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between p-6 border-b border-border/30">
          <div>
            <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-primary mb-1">
              Licensing Enquiry
            </div>
            <h2 className="text-xl font-serif">{trackTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors mt-1 ml-4 text-lg leading-none shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-green-400 text-2xl">✓</div>
              <h3 className="text-xl font-serif">Request Received</h3>
              <p className="text-sm text-muted-foreground font-serif italic">
                We'll be in touch at {email} shortly.
              </p>
              <button
                onClick={onClose}
                className="border border-border/60 text-muted-foreground px-6 py-2 text-xs uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                  {errors.name && <p className={errCls}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Intended Use *</label>
                <div className="relative">
                  <select
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Select intended use…</option>
                    {INTENDED_USES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    ▾
                  </span>
                </div>
                {errors.intendedUse && <p className={errCls}>{errors.intendedUse}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Additional Notes{" "}
                  <span className="normal-case tracking-normal text-muted-foreground/50">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MSG_MAX))}
                  placeholder="Production name, territory, timeline, budget range…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
                <div className="text-[9px] text-right mt-1 text-muted-foreground/40">
                  {message.length} / {MSG_MAX}
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-primary shrink-0"
                />
                <span className="text-[10px] font-sans text-muted-foreground leading-relaxed">
                  I agree that Conduct Alchemy may contact me regarding this licensing enquiry
                  and related communications. See our{" "}
                  <a
                    href="/legal#privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {errors.consent && <p className={errCls}>{errors.consent}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full border border-primary/60 text-primary py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Submit Licence Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

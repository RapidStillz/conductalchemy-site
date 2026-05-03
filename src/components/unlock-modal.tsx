import { useState } from "react";
import { submitUnlock } from "@/lib/access";

const INTENDED_USE_OPTIONS = [
  "Film",
  "TV",
  "Advertising",
  "Game",
  "Personal",
  "Other",
] as const;

type IntendedUse = (typeof INTENDED_USE_OPTIONS)[number];

const NOTES_MAX = 500;

interface UnlockModalProps {
  trackId: string;
  trackTitle: string;
  isArtefactMode?: boolean;
  onUnlocked: () => void;
  onClose: () => void;
}

export function UnlockModal({
  trackId,
  trackTitle,
  isArtefactMode = false,
  onUnlocked,
  onClose,
}: UnlockModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intendedUse, setIntendedUse] = useState<IntendedUse | "">("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    name: string;
    email: string;
    intendedUse: string;
    source: "api" | "local";
  } | null>(null);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "A valid email is required.";
    if (!intendedUse) e.intendedUse = "Please select an intended use.";
    if (!termsAccepted) e.terms = "You must agree to the terms of use before unlocking.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const result = await submitUnlock({
      trackId,
      trackTitle,
      name: name.trim(),
      email: email.trim(),
      intendedUse: intendedUse as IntendedUse,
      notes: notes.trim() || undefined,
      termsAccepted,
    });

    setSubmitting(false);
    setReceipt({
      name: name.trim(),
      email: email.trim(),
      intendedUse: intendedUse as string,
      source: result.source,
    });
  }

  const art = isArtefactMode;

  const inputCls = `w-full px-4 py-3 text-sm font-sans border outline-none transition-colors focus:border-current ${
    art
      ? "bg-[#faf7f2] border-[#b5a882] text-[#1a1510] placeholder:text-[#1a1510]/40 focus:border-[#8a6e3a]"
      : "bg-transparent border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60"
  }`;

  const selectCls = `w-full px-4 py-3 text-sm font-sans border outline-none appearance-none transition-colors cursor-pointer ${
    art
      ? "bg-[#faf7f2] border-[#b5a882] text-[#1a1510] focus:border-[#8a6e3a]"
      : "bg-background border-border/60 text-foreground focus:border-primary/60"
  }`;

  const labelCls = `block text-[10px] font-sans tracking-[0.2em] uppercase mb-2 ${
    art ? "text-[#5c4a28]" : "text-muted-foreground"
  }`;

  const errorCls = "text-[10px] font-sans mt-1.5 text-red-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Unlock ${trackTitle}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={receipt ? undefined : onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md z-10 ${
          art
            ? "bg-[#f5f0e8] border border-[#b5a882]"
            : "bg-[#0d0d0d] border border-border/50"
        }`}
      >
        {/* ---------------------------------------------------------------- */}
        {/* RECEIPT / SUCCESS SCREEN                                          */}
        {/* ---------------------------------------------------------------- */}
        {receipt ? (
          <>
            <div
              className={`px-8 pt-8 pb-6 border-b ${
                art ? "border-[#1a1510]/10" : "border-border/30"
              }`}
            >
              <div className={`text-[9px] font-sans tracking-[0.3em] uppercase mb-3 ${art ? "text-[#5c4a28]" : "text-green-400"}`}>
                Access Granted
              </div>
              <h2 className={`text-2xl font-serif mb-2 ${art ? "text-[#1a1510]" : "text-foreground"}`}>
                You're in
              </h2>
              <p className={`text-sm font-serif italic leading-relaxed ${art ? "text-[#3a2e1e]/70" : "text-muted-foreground"}`}>
                Your request for "{trackTitle}" has been received. You can now listen to the full work.
              </p>
            </div>

            <div className="px-8 py-7 space-y-4">
              {/* Receipt card */}
              <div className={`border px-5 py-4 space-y-3 ${art ? "border-[#b5a882]/50 bg-[#faf7f2]" : "border-border/40 bg-card/20"}`}>
                <div className={`text-[9px] font-sans tracking-[0.25em] uppercase mb-3 ${art ? "text-[#5c4a28]" : "text-muted-foreground"}`}>
                  Submission receipt
                </div>
                {[
                  { label: "Track", value: trackTitle },
                  { label: "Name", value: receipt.name },
                  { label: "Email", value: receipt.email },
                  { label: "Intended use", value: receipt.intendedUse },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-baseline gap-4">
                    <span className={`text-[10px] font-sans tracking-widest uppercase shrink-0 ${art ? "text-[#5c4a28]" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                    <span className={`text-sm font-serif text-right truncate ${art ? "text-[#1a1510]" : "text-foreground"}`}>
                      {value}
                    </span>
                  </div>
                ))}
                <div className={`pt-2 border-t text-[9px] font-sans tracking-widest uppercase ${art ? "border-[#1a1510]/10 text-[#5c4a28]/60" : "border-border/20 text-muted-foreground/50"}`}>
                  {receipt.source === "api" ? "✓ Submitted to server" : "✓ Saved locally"}
                </div>
              </div>

              <button
                onClick={onUnlocked}
                className={`w-full py-3.5 text-xs font-sans tracking-[0.2em] uppercase border transition-all ${
                  art
                    ? "border-[#8a6e3a] text-white bg-[#8a6e3a] hover:bg-[#6a5020]"
                    : "border-primary text-primary-foreground bg-primary hover:bg-primary/90"
                }`}
              >
                Listen to Full Track
              </button>
            </div>
          </>
        ) : (
          <>
            {/* -------------------------------------------------------------- */}
            {/* FORM                                                             */}
            {/* -------------------------------------------------------------- */}
            <div
              className={`px-8 pt-8 pb-6 border-b ${
                art ? "border-[#1a1510]/10" : "border-border/30"
              }`}
            >
              <div
                className={`text-[9px] font-sans tracking-[0.3em] uppercase mb-3 ${
                  art ? "text-[#5c4a28]" : "text-primary"
                }`}
              >
                Restricted Access
              </div>
              <h2
                className={`text-2xl font-serif mb-2 ${
                  art ? "text-[#1a1510]" : "text-foreground"
                }`}
              >
                Unlock Full Access
              </h2>
              <p
                className={`text-sm font-serif italic leading-relaxed ${
                  art ? "text-[#3a2e1e]/70" : "text-muted-foreground"
                }`}
              >
                "{trackTitle}" is a private composition. Submit your details to
                access the full work.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputCls}
                  autoComplete="name"
                />
                {errors.name && <p className={errorCls}>{errors.name}</p>}
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputCls}
                  autoComplete="email"
                />
                {errors.email && <p className={errorCls}>{errors.email}</p>}
              </div>

              <div>
                <label className={labelCls}>Intended Use</label>
                <div className="relative">
                  <select
                    value={intendedUse}
                    onChange={(e) =>
                      setIntendedUse(e.target.value as IntendedUse)
                    }
                    className={selectCls}
                  >
                    <option value="" disabled>
                      Select a use case…
                    </option>
                    {INTENDED_USE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] ${
                      art ? "text-[#5c4a28]" : "text-muted-foreground"
                    }`}
                  >
                    ▾
                  </div>
                </div>
                {errors.intendedUse && (
                  <p className={errorCls}>{errors.intendedUse}</p>
                )}
              </div>

              {/* Notes / message — optional, 500 char limit */}
              <div>
                <label className={labelCls}>
                  Message / Notes{" "}
                  <span className={`normal-case tracking-normal ${art ? "text-[#5c4a28]/50" : "text-muted-foreground/50"}`}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX))}
                  placeholder="Tell us about your project or production…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
                <div className={`text-[9px] font-sans mt-1 text-right ${
                  notes.length >= NOTES_MAX
                    ? "text-red-500"
                    : art ? "text-[#5c4a28]/40" : "text-muted-foreground/40"
                }`}>
                  {notes.length} / {NOTES_MAX}
                </div>
              </div>

              {/* Terms checkbox — prominent */}
              <div
                className={`rounded-sm border-2 px-4 py-4 transition-colors cursor-pointer ${
                  termsAccepted
                    ? art
                      ? "border-[#8a6e3a]/60 bg-[#8a6e3a]/5"
                      : "border-primary/50 bg-primary/5"
                    : errors.terms
                    ? "border-red-500/60 bg-red-500/5"
                    : art
                    ? "border-[#b5a882] bg-[#faf7f2]"
                    : "border-border/60 bg-card/10 hover:border-border"
                }`}
                onClick={() => {
                  setTermsAccepted(!termsAccepted);
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: "" }));
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    role="checkbox"
                    aria-checked={termsAccepted}
                    className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${
                      termsAccepted
                        ? art
                          ? "bg-[#8a6e3a] border-[#8a6e3a]"
                          : "bg-primary border-primary"
                        : art
                        ? "bg-transparent border-[#b5a882]"
                        : "bg-transparent border-border/80"
                    }`}
                  >
                    {termsAccepted && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2.5px]">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-xs font-sans leading-relaxed select-none ${
                      art ? "text-[#3a2e1e]/90" : "text-foreground/80"
                    }`}
                  >
                    I agree to the{" "}
                    <a
                      href="/legal"
                      target="_blank"
                      rel="noreferrer"
                      className={`underline underline-offset-2 font-medium ${
                        art
                          ? "text-[#5c4a28] hover:text-[#8a6e3a]"
                          : "text-foreground hover:text-primary"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      terms of use
                    </a>
                    . I understand this composition is the intellectual property of
                    Conduct Alchemy.
                  </span>
                </div>
              </div>
              {errors.terms && <p className={`${errorCls} -mt-3`}>{errors.terms}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-3.5 text-xs font-sans tracking-[0.2em] uppercase border transition-all ${
                    submitting
                      ? "opacity-50 cursor-not-allowed"
                      : art
                      ? "border-[#8a6e3a] text-white bg-[#8a6e3a] hover:bg-[#6a5020]"
                      : "border-primary text-primary-foreground bg-primary hover:bg-primary/90"
                  }`}
                >
                  {submitting ? "Submitting…" : "Unlock Track"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-3.5 text-xs font-sans tracking-[0.2em] uppercase border transition-colors ${
                    art
                      ? "border-[#1a1510]/20 text-[#1a1510]/50 hover:text-[#1a1510]"
                      : "border-border/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

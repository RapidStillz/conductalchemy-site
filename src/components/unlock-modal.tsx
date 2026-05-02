import { useState } from "react";
import { unlockTrack } from "@/lib/access";

const INTENDED_USE_OPTIONS = [
  "Film",
  "TV",
  "Advertising",
  "Game",
  "Personal",
  "Other",
] as const;

type IntendedUse = (typeof INTENDED_USE_OPTIONS)[number];

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "A valid email is required.";
    if (!intendedUse) e.intendedUse = "Please select an intended use.";
    if (!termsAccepted) e.terms = "You must agree to the terms of use.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    unlockTrack({
      trackId,
      name: name.trim(),
      email: email.trim(),
      intendedUse: intendedUse as IntendedUse,
    });
    setTimeout(() => {
      setSubmitting(false);
      onUnlocked();
    }, 600);
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
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md z-10 transition-all duration-500 ${
          art
            ? "bg-[#f5f0e8] border border-[#b5a882]"
            : "bg-[#0d0d0d] border border-border/50"
        }`}
      >
        {/* Header */}
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

        {/* Form */}
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
                onChange={(e) => setIntendedUse(e.target.value as IntendedUse)}
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

          <div className="flex items-start gap-3 pt-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={termsAccepted}
              onClick={() => setTermsAccepted(!termsAccepted)}
              className={`mt-0.5 w-4 h-4 shrink-0 border transition-colors ${
                termsAccepted
                  ? art
                    ? "bg-[#8a6e3a] border-[#8a6e3a]"
                    : "bg-primary border-primary"
                  : art
                  ? "bg-transparent border-[#b5a882]"
                  : "bg-transparent border-border/60"
              }`}
            >
              {termsAccepted && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="w-full h-full p-[2px]"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <label
              className={`text-xs font-sans leading-relaxed cursor-pointer ${
                art ? "text-[#3a2e1e]/80" : "text-muted-foreground"
              }`}
              onClick={() => setTermsAccepted(!termsAccepted)}
            >
              I agree to the{" "}
              <a
                href="/legal"
                target="_blank"
                rel="noreferrer"
                className={`underline underline-offset-2 ${
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
            </label>
          </div>
          {errors.terms && <p className={errorCls}>{errors.terms}</p>}

          <div className="flex gap-3 pt-4">
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
              {submitting ? "Unlocking…" : "Unlock Track"}
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
      </div>
    </div>
  );
}

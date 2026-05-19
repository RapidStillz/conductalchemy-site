import { useState } from "react";
import { addNewsletterSignup } from "@/lib/crm";

interface NewsletterFormProps {
  source?: string;
  compact?: boolean;
}

export function NewsletterForm({ source = "unknown", compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!consent) {
      setError("Please check the consent box to continue.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 250));
    const result = addNewsletterSignup(email.trim(), source);
    setSubmitting(false);
    if (result === null) {
      setDone(true); // already subscribed — show success anyway
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className={compact ? "py-2" : "py-4"}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-green-400 mb-1">You're in</div>
        <p className="text-sm font-serif text-muted-foreground">
          Thank you — we'll be in touch with news and releases.
        </p>
      </div>
    );
  }

  const inputCls = "bg-background border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors w-full";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!compact && (
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          Stay in tune
        </div>
      )}
      <div className={compact ? "flex gap-2" : "space-y-2"}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="your@email.com"
          autoComplete="email"
          className={compact ? `${inputCls} flex-1` : inputCls}
        />
        {compact && (
          <button
            type="submit"
            disabled={submitting}
            className="border border-primary/60 text-primary px-5 py-3 text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 disabled:opacity-50"
          >
            {submitting ? "…" : "Subscribe"}
          </button>
        )}
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => { setConsent(e.target.checked); setError(""); }}
          className="mt-0.5 w-3.5 h-3.5 accent-primary shrink-0"
        />
        <span className="text-[10px] font-sans text-muted-foreground leading-relaxed">
          I agree to receive updates and marketing communications from Conduct Alchemy.
          You can unsubscribe at any time. See our{" "}
          <a href="/legal#privacy" className="text-primary underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && <p className="text-[10px] font-sans text-red-400">{error}</p>}

      {!compact && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-primary/60 text-primary py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      )}
    </form>
  );
}

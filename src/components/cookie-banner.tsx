import { useState, useEffect } from "react";
import { getConsentStatus, acceptConsent, declineConsent, type ConsentStatus } from "@/lib/gdpr";
import { Link } from "wouter";

export function CookieBanner() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const s = getConsentStatus();
    setStatus(s);
    if (s === "pending") {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  if (!visible || status !== "pending") return null;

  function handleAccept() {
    acceptConsent();
    setStatus("accepted");
    setVisible(false);
  }

  function handleDecline() {
    declineConsent();
    setStatus("declined");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-md px-4 py-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            We use cookies and local storage to remember your preferences and improve your experience.
            See our{" "}
            <Link href="/legal#privacy" className="text-primary underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/legal#cookies" className="text-primary underline underline-offset-2 hover:no-underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="text-[10px] uppercase tracking-widest border border-border/60 text-muted-foreground px-4 py-2 hover:border-border hover:text-foreground transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-[10px] uppercase tracking-widest border border-primary/60 bg-primary/10 text-primary px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

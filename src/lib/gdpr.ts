// ---------------------------------------------------------------------------
// GDPR / Cookie Consent — localStorage backed
// ---------------------------------------------------------------------------

export type ConsentStatus = "pending" | "accepted" | "declined";

const KEY = "ca_cookie_consent";

export function getConsentStatus(): ConsentStatus {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === "accepted" || raw === "declined") return raw;
    return "pending";
  } catch {
    return "pending";
  }
}

export function acceptConsent(): void {
  try { localStorage.setItem(KEY, "accepted"); } catch { /* ignore */ }
}

export function declineConsent(): void {
  try { localStorage.setItem(KEY, "declined"); } catch { /* ignore */ }
}

export function resetConsent(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

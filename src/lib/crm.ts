// ---------------------------------------------------------------------------
// CRM — newsletter signups (localStorage backed, Cloudflare Pages compatible)
// ---------------------------------------------------------------------------

export interface NewsletterSignup {
  id: string;
  email: string;
  consentGiven: boolean;
  source: string;   // e.g. "homepage", "footer", "track-page"
  timestamp: string;
}

const KEY = "ca_newsletter_signups";

function readAll(): NewsletterSignup[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NewsletterSignup[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: NewsletterSignup[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* full */ }
}

export function getNewsletterSignups(): NewsletterSignup[] {
  return readAll().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function addNewsletterSignup(
  email: string,
  source = "unknown"
): NewsletterSignup | null {
  const all = readAll();
  if (all.some((s) => s.email.toLowerCase() === email.toLowerCase())) return null;
  const entry: NewsletterSignup = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    consentGiven: true,
    source,
    timestamp: new Date().toISOString(),
  };
  all.push(entry);
  writeAll(all);
  return entry;
}

export function removeNewsletterSignup(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function exportNewsletterCsv(signups: NewsletterSignup[]): void {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = "Email,Consent,Source,Timestamp";
  const rows = signups.map((s) =>
    [esc(s.email), s.consentGiven ? "Yes" : "No", esc(s.source), esc(s.timestamp)].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ca-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

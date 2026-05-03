// ---------------------------------------------------------------------------
// Contact enquiries — localStorage backed
// ---------------------------------------------------------------------------

export type EnquirySubject =
  | "Licensing / Sync"
  | "Custom Commission"
  | "General"
  | "Press / Media"
  | "Other";

export const ENQUIRY_SUBJECTS: EnquirySubject[] = [
  "Licensing / Sync",
  "Custom Commission",
  "General",
  "Press / Media",
  "Other",
];

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: EnquirySubject;
  message: string;
  trackReference?: string;
  intendedUse?: string;
  gdprConsent: boolean;
  timestamp: string;
  read: boolean;
}

export interface SubmitEnquiryInput {
  name: string;
  email: string;
  subject: EnquirySubject;
  message: string;
  trackReference?: string;
  intendedUse?: string;
  gdprConsent?: boolean;
}

const KEY = "ca_enquiries";

function readAll(): Enquiry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Enquiry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: Enquiry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

export function getEnquiries(): Enquiry[] {
  return readAll().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getUnreadCount(): number {
  return readAll().filter((e) => !e.read).length;
}

export function submitEnquiry(input: SubmitEnquiryInput): Enquiry {
  const enquiry: Enquiry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...input,
    gdprConsent: input.gdprConsent ?? false,
    timestamp: new Date().toISOString(),
    read: false,
  };
  const items = readAll();
  items.push(enquiry);
  writeAll(items);
  return enquiry;
}

export function markEnquiryRead(id: string): void {
  const items = readAll().map((e) => (e.id === id ? { ...e, read: true } : e));
  writeAll(items);
}

export function markAllRead(): void {
  writeAll(readAll().map((e) => ({ ...e, read: true })));
}

export function deleteEnquiry(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
}

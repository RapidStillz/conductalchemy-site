import { API_BASE, IS_MOCK_MODE } from "./api-config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UnlockRecord {
  id: string;
  trackId: string;
  trackTitle: string;
  name: string;
  email: string;
  intendedUse: string;
  termsAccepted: boolean;
  timestamp: string;
  userAgent?: string;
  source: "api" | "local";
}

export interface SubmitUnlockInput {
  trackId: string;
  trackTitle: string;
  name: string;
  email: string;
  intendedUse: string;
  termsAccepted: boolean;
}

// ---------------------------------------------------------------------------
// Record normalizer — makes every record safe to render regardless of shape
// ---------------------------------------------------------------------------

/**
 * Accepts any unknown value from the API or localStorage and returns a fully
 * populated UnlockRecord (with fallbacks for every field) or null if the raw
 * value is not an object at all.
 */
function normalizeRecord(
  raw: unknown,
  defaultSource: "api" | "local"
): UnlockRecord | null {
  try {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const r = raw as Record<string, unknown>;
    return {
      id: r.id != null ? String(r.id) : `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      trackId: r.trackId != null ? String(r.trackId) : "unknown",
      trackTitle: r.trackTitle != null ? String(r.trackTitle) : "Unknown track",
      name: r.name != null ? String(r.name) : "Unknown",
      email: r.email != null ? String(r.email) : "No email",
      intendedUse: r.intendedUse != null ? String(r.intendedUse) : "Not specified",
      termsAccepted: Boolean(r.termsAccepted),
      timestamp:
        r.timestamp != null
          ? String(r.timestamp)
          : new Date().toISOString(),
      userAgent: r.userAgent != null ? String(r.userAgent) : undefined,
      source:
        r.source === "api" || r.source === "local"
          ? r.source
          : defaultSource,
    };
  } catch {
    return null;
  }
}

function normalizeArray(
  raw: unknown,
  defaultSource: "api" | "local"
): UnlockRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeRecord(item, defaultSource))
    .filter((r): r is UnlockRecord => r !== null);
}

// ---------------------------------------------------------------------------
// Local storage helpers
// ---------------------------------------------------------------------------

const ACCESS_KEY = "ca_track_access";
const LOG_KEY = "ca_unlock_log";

function getLocalAccessMap(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function getLocalLog(): UnlockRecord[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return normalizeArray(parsed, "local");
  } catch {
    return [];
  }
}

function appendToLocalLog(record: UnlockRecord): void {
  try {
    const log = getLocalLog();
    const idx = log.findIndex((r) => r.trackId === record.trackId);
    if (idx >= 0) {
      log[idx] = record;
    } else {
      log.push(record);
    }
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    // localStorage may be full or unavailable — silently ignore
  }
}

function markLocallyUnlocked(trackId: string): void {
  try {
    const map = getLocalAccessMap();
    map[trackId] = true;
    localStorage.setItem(ACCESS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function isTrackUnlocked(trackId: string): boolean {
  return !!getLocalAccessMap()[trackId];
}

export async function submitUnlock(
  input: SubmitUnlockInput
): Promise<{ success: boolean; source: "api" | "local" }> {
  const record: UnlockRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    source: "local",
  };

  if (!IS_MOCK_MODE) {
    try {
      const res = await fetch(`${API_BASE}/api/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        record.source = "api";
        markLocallyUnlocked(input.trackId);
        appendToLocalLog(record);
        console.log("[Conduct Alchemy] Unlock submitted to Worker:", record);
        return { success: true, source: "api" };
      }
    } catch {
      // Network error or timeout — fall through
    }
  }

  record.source = "local";
  markLocallyUnlocked(input.trackId);
  appendToLocalLog(record);
  console.log(
    IS_MOCK_MODE
      ? "[Conduct Alchemy] Mock mode — unlock saved locally:"
      : "[Conduct Alchemy] Worker unreachable — unlock saved locally:",
    record
  );
  return { success: true, source: "local" };
}

/**
 * Fetch all unlock submissions for the admin view.
 *
 * Handles both response shapes:
 *   { ok: true, records: [...] }   ← canonical Worker shape
 *   [...]                          ← raw array fallback
 *
 * Every record is normalized through normalizeRecord so all fields are safe
 * to render, regardless of what the Worker or localStorage contains.
 */
export async function fetchSubmissions(): Promise<{
  records: UnlockRecord[];
  source: "api" | "local";
}> {
  if (!IS_MOCK_MODE) {
    try {
      const res = await fetch(`${API_BASE}/api/unlock`, {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const payload: unknown = await res.json();

        let rawArray: unknown;
        if (Array.isArray(payload)) {
          rawArray = payload;
        } else if (
          payload !== null &&
          typeof payload === "object" &&
          "records" in payload
        ) {
          rawArray = (payload as { records: unknown }).records;
        } else {
          console.warn("[Conduct Alchemy] Unexpected /api/unlock shape:", payload);
          rawArray = [];
        }

        const records = normalizeArray(rawArray, "api");
        console.log(
          `[Conduct Alchemy] Fetched ${records.length} record(s) from Worker.`
        );
        return { records, source: "api" };
      }
      console.warn(
        `[Conduct Alchemy] Worker returned ${res.status} — using local fallback`
      );
    } catch (err) {
      console.warn("[Conduct Alchemy] Worker fetch error — using local fallback:", err);
    }
  }

  return { records: getLocalLog(), source: "local" };
}

export function getLocalSubmissions(): UnlockRecord[] {
  return getLocalLog();
}

export function revokeLocalAccess(trackId: string): void {
  try {
    const map = getLocalAccessMap();
    delete map[trackId];
    localStorage.setItem(ACCESS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

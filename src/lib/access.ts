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
// Local storage helpers
// ---------------------------------------------------------------------------

/** Key that stores per-track unlock state (keyed by trackId). */
const ACCESS_KEY = "ca_track_access";

/** Key that stores the full submission log for admin view. */
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
    return raw ? (JSON.parse(raw) as UnlockRecord[]) : [];
  } catch {
    return [];
  }
}

function appendToLocalLog(record: UnlockRecord): void {
  const log = getLocalLog();
  // Replace if same trackId already exists (re-unlock), otherwise append.
  const idx = log.findIndex((r) => r.trackId === record.trackId);
  if (idx >= 0) {
    log[idx] = record;
  } else {
    log.push(record);
  }
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

function markLocallyUnlocked(trackId: string): void {
  const map = getLocalAccessMap();
  map[trackId] = true;
  localStorage.setItem(ACCESS_KEY, JSON.stringify(map));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Check whether the visitor has already unlocked a track (local cache). */
export function isTrackUnlocked(trackId: string): boolean {
  return !!getLocalAccessMap()[trackId];
}

/**
 * Submit an unlock request.
 *
 * 1. Tries to POST to the Cloudflare Worker (/api/unlock).
 * 2. On success, caches the granted state locally.
 * 3. If the Worker is unavailable (IS_MOCK_MODE or network error), falls
 *    back to localStorage-only storage.
 *
 * Always returns { success: true } — access is never blocked by backend errors.
 */
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
      // Network error or timeout — fall through to local storage
    }
  }

  // Mock / fallback path
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
 * Tries the Worker API first; merges with local log as fallback.
 */
export async function fetchSubmissions(): Promise<{
  records: UnlockRecord[];
  source: "api" | "local";
}> {
  if (!IS_MOCK_MODE) {
    try {
      const res = await fetch(`${API_BASE}/api/unlock`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const records = (await res.json()) as UnlockRecord[];
        return { records, source: "api" };
      }
    } catch {
      // fall through
    }
  }
  return { records: getLocalLog(), source: "local" };
}

/** Return locally cached submissions without a network call. */
export function getLocalSubmissions(): UnlockRecord[] {
  return getLocalLog();
}

/** Revoke local access (useful for testing). */
export function revokeLocalAccess(trackId: string): void {
  const map = getLocalAccessMap();
  delete map[trackId];
  localStorage.setItem(ACCESS_KEY, JSON.stringify(map));
}

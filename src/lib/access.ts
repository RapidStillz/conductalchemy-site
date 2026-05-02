export interface UnlockRecord {
  trackId: string;
  name: string;
  email: string;
  intendedUse: string;
  unlockedAt: string;
}

const STORAGE_KEY = "ca_track_access";

function getAll(): Record<string, UnlockRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, UnlockRecord>) : {};
  } catch {
    return {};
  }
}

export function isTrackUnlocked(trackId: string): boolean {
  return !!getAll()[trackId];
}

export function getUnlockRecord(trackId: string): UnlockRecord | null {
  return getAll()[trackId] ?? null;
}

export function unlockTrack(data: Omit<UnlockRecord, "unlockedAt">): void {
  const all = getAll();
  const record: UnlockRecord = { ...data, unlockedAt: new Date().toISOString() };
  all[data.trackId] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  console.log("[Conduct Alchemy] Track access granted:", JSON.stringify(record, null, 2));
}

export function getAllUnlockRecords(): UnlockRecord[] {
  return Object.values(getAll());
}

export function revokeTrackAccess(trackId: string): void {
  const all = getAll();
  delete all[trackId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

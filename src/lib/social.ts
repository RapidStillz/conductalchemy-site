// ---------------------------------------------------------------------------
// Social metrics — manually maintained, localStorage backed
// ---------------------------------------------------------------------------

export interface SocialPlatform {
  key: string;
  name: string;
  handle: string;
  url: string;
  followers: number;
  posts: number;
  engagement: string;
}

export interface SocialMetrics {
  platforms: SocialPlatform[];
  updatedAt: string;
  notes: string;
}

const KEY = "ca_social_metrics";

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  { key: "youtube",     name: "YouTube",    handle: "", url: "", followers: 0, posts: 0, engagement: "" },
  { key: "instagram",   name: "Instagram",  handle: "", url: "", followers: 0, posts: 0, engagement: "" },
  { key: "spotify",     name: "Spotify",    handle: "", url: "", followers: 0, posts: 0, engagement: "" },
  { key: "soundcloud",  name: "SoundCloud", handle: "", url: "", followers: 0, posts: 0, engagement: "" },
  { key: "tiktok",      name: "TikTok",     handle: "", url: "", followers: 0, posts: 0, engagement: "" },
];

const DEFAULT: SocialMetrics = {
  platforms: DEFAULT_PLATFORMS,
  updatedAt: "",
  notes: "",
};

export function getSocialMetrics(): SocialMetrics {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, platforms: DEFAULT_PLATFORMS.map(p => ({ ...p })) };
    const parsed = JSON.parse(raw) as Partial<SocialMetrics>;
    const savedKeys = new Set((parsed.platforms ?? []).map((p) => p.key));
    const merged = [
      ...(parsed.platforms ?? []),
      ...DEFAULT_PLATFORMS.filter((p) => !savedKeys.has(p.key)),
    ];
    return {
      platforms: merged,
      updatedAt: parsed.updatedAt ?? "",
      notes: parsed.notes ?? "",
    };
  } catch {
    return { ...DEFAULT, platforms: DEFAULT_PLATFORMS.map(p => ({ ...p })) };
  }
}

export function saveSocialMetrics(metrics: SocialMetrics): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      ...metrics,
      updatedAt: new Date().toISOString(),
    }));
  } catch { /* ignore */ }
}

export function getTotalFollowers(metrics: SocialMetrics): number {
  return metrics.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
}

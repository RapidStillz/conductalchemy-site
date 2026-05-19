// ---------------------------------------------------------------------------
// CMS — types, defaults, slug helpers, draft/publish workflow, version history
// ---------------------------------------------------------------------------

export type AccessStatus = "Public" | "Private" | "NDA / Token Access Required";

export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  spotify?: string;
  soundcloud?: string;
  tiktok?: string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  genre: string;
  mood: string[];
  bpm: number;
  musicalKey: string;
  description: string;
  lyrics: string;
  licensingNotes: string;
  versions: string[];
  visualConceptNotes: string;
  useCases: string[];
  markets?: string[];       // explicit market slugs, e.g. ["western", "bollywood"]
  featured: boolean;
  heroTrack?: boolean;
  featuredOrder?: number;
  accessStatus: AccessStatus;
  audioUrl?: string;
  previewAudioUrl?: string;
  previewDuration?: number;   // seconds; default 45 when undefined
  videoUrl?: string;
  coverArtUrl?: string;
  collaborators?: string[];
  socialLinks?: SocialLinks;
  createdAt: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface LogoItem {
  name: string;
  logoUrl?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  featuredTrackIds: string[];
  aboutText: string;
  contactEmail: string;
  licensingIntro: string;
  heroStats: HeroStat[];
  collaboratorLogos: LogoItem[];
  clientLogos: LogoItem[];
  testimonials: Testimonial[];
  proCtaTitle: string;
  proCtaText: string;
}

export interface HistoryEntry<T> {
  data: T;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

export function generateSlug(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export const GENRE_OPTIONS = [
  // Standalone shorthand (new)
  "Acoustic",
  "Bollywood",
  "Children / Family",
  "Cinematic",
  "Eastern Fusion",
  "Experimental",
  "Orchestral",
  "Trailer",
  "Western Pop",
  // Compound originals (preserved)
  "Bollywood / Orchestral",
  "Cinematic / Orchestral",
  "Classical / Orchestral",
  "Dance / Electronic",
  "Electronic / Ambient",
  "Folk / Acoustic",
  "Hip-Hop / Urban",
  "Jazz / Contemporary",
  "Pop / Contemporary",
  "Rock / Alternative",
  "Soundtrack",
  "World / Fusion",
];

export const MOOD_PRESETS = [
  "Emotional", "Hopeful", "Cinematic", "Epic", "Adventurous",
  "Triumphant", "Dark", "Tense", "Mysterious", "Peaceful",
  "Joyful", "Romantic", "Melancholic", "Energetic", "Dramatic",
  "Inspiring", "Playful", "Atmospheric", "Ethereal", "Raw",
];

export const USE_CASE_PRESETS = [
  "Film", "TV", "TV Drama", "Advertising", "Game", "Game Trailers",
  "Sports", "Bollywood", "Digital", "YouTube", "Personal", "Other",
];

export const ACCESS_STATUS_OPTIONS: AccessStatus[] = [
  "Public",
  "Private",
  "NDA / Token Access Required",
];

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_TRACKS: Track[] = [
  {
    id: "1",
    slug: "rishte-naya",
    title: "Rishte Naya",
    artist: "Conduct Alchemy",
    genre: "Bollywood / Orchestral",
    mood: ["Emotional", "Hopeful", "Cinematic"],
    bpm: 72,
    musicalKey: "D Minor",
    description:
      "A soulful exploration of new relationships — the tentative first steps, the unspoken longing. Strings and sitar weave around each other like two people learning to trust.",
    lyrics:
      "Rishte naya, phir bhi purana / Dil ki zubaan, ankahi kahana / Tere bina, meri saans adhuri / Tere saath, yeh safar zaruri",
    licensingNotes:
      "Available for sync licensing. Stems available: strings, sitar, percussion, full mix. Ideal for romantic drama, coming-of-age narratives, Bollywood productions.",
    versions: ["Full Orchestral", "Strings Only", "Sitar & Tabla", "Underscore Version"],
    visualConceptNotes:
      "Two silhouettes in a monsoon courtyard. Warm amber light through rain. Slow-motion droplets. Hands almost touching.",
    useCases: ["Film", "TV Drama", "Bollywood", "Advertising"],
    featured: true,
    heroTrack: true,
    featuredOrder: 1,
    accessStatus: "Public",
    collaborators: [],
    socialLinks: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "hobey-main-theme",
    title: "Hobey — Main Theme",
    artist: "Conduct Alchemy",
    genre: "Cinematic / Orchestral",
    mood: ["Epic", "Adventurous", "Triumphant"],
    bpm: 88,
    musicalKey: "E Major",
    description:
      "The defining sonic identity of the Hobey universe — bold brass, swelling strings, and a motif that lodges in the memory. Built for main-title moments.",
    lyrics: "(Instrumental)",
    licensingNotes:
      "Full theme available for licensing. Stems available: brass, strings, percussion, choir. Perfect for title sequences, trailers, and epic montages.",
    versions: [
      "Full Orchestral",
      "Stripped Version",
      "Percussion Only",
      "Choir & Strings",
      "Trailer Edit",
    ],
    visualConceptNotes:
      "Vast landscape at golden hour. A lone figure on a ridge. Camera pulls back revealing the scale of the world. Epic reveal.",
    useCases: ["Film", "TV", "Game Trailers", "Advertising", "Sports"],
    featured: true,
    featuredOrder: 2,
    accessStatus: "Private",
    collaborators: [],
    socialLinks: {},
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Conduct Alchemy",
  heroSubtitle: "Forged in Resonance",
  heroTagline: "Premium music for film, television, and beyond.",
  featuredTrackIds: ["1", "2"],
  aboutText:
    "Conduct Alchemy is a music imprint forged at the intersection of Western orchestral tradition and cross-cultural storytelling. We create music that resonates — for film, television, advertising, and the human experience.",
  contactEmail: "licensing@conductalchemy.com",
  licensingIntro:
    "Our catalogue is available for sync licensing across film, television, advertising, and digital media. We work directly with music supervisors, directors, and creative teams to find the perfect sonic match.",
  heroStats: [
    { value: "Film, TV & Ads", label: "Sync Ready" },
    { value: "Cross-Cultural", label: "Composition" },
    { value: "Full Stems", label: "Available" },
    { value: "Direct", label: "Licensing" },
  ],
  collaboratorLogos: [],
  clientLogos: [],
  testimonials: [],
  proCtaTitle: "Music for the Screen",
  proCtaText:
    "We work directly with music supervisors, directors, and creative teams. Stems, masters, and custom commissions available on request.",
};

// ---------------------------------------------------------------------------
// Migration helpers
// ---------------------------------------------------------------------------

function migrateTracks(tracks: Track[]): Track[] {
  return tracks.map((t) => ({
    ...t,
    slug: t.slug || generateSlug(t.title),
    accessStatus: (t.accessStatus ?? "Public") as AccessStatus,
    mood: Array.isArray(t.mood) ? t.mood : [],
    versions: Array.isArray(t.versions) ? t.versions : [],
    useCases: Array.isArray(t.useCases) ? t.useCases : [],
    collaborators: Array.isArray(t.collaborators) ? t.collaborators : [],
    socialLinks: t.socialLinks ?? {},
    featured: t.featured ?? false,
    previewDuration: t.previewDuration ?? 45,
  }));
}

function migrateSiteContent(raw: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...raw,
    heroStats: Array.isArray(raw.heroStats) ? raw.heroStats : DEFAULT_SITE_CONTENT.heroStats,
    collaboratorLogos: Array.isArray(raw.collaboratorLogos) ? raw.collaboratorLogos : [],
    clientLogos: Array.isArray(raw.clientLogos) ? raw.clientLogos : [],
    testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : [],
    proCtaTitle: raw.proCtaTitle ?? DEFAULT_SITE_CONTENT.proCtaTitle,
    proCtaText: raw.proCtaText ?? DEFAULT_SITE_CONTENT.proCtaText,
  };
}

// ---------------------------------------------------------------------------
// localStorage keys
// ---------------------------------------------------------------------------

const KEY_TRACKS = "ca_tracks";
const KEY_TRACKS_DRAFT = "ca_tracks_draft";
const KEY_TRACKS_HISTORY = "ca_tracks_history";
const KEY_CONTENT = "ca_site_content";
const KEY_CONTENT_DRAFT = "ca_site_content_draft";
const KEY_CONTENT_HISTORY = "ca_site_content_history";

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

function seedIfEmpty(): void {
  if (!localStorage.getItem(KEY_TRACKS)) {
    localStorage.setItem(KEY_TRACKS, JSON.stringify(DEFAULT_TRACKS));
  }
  if (!localStorage.getItem(KEY_CONTENT)) {
    localStorage.setItem(KEY_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
  }
}

// ---------------------------------------------------------------------------
// PUBLISHED — read by public pages
// ---------------------------------------------------------------------------

export function getTracks(): Track[] {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(KEY_TRACKS);
    return migrateTracks(raw ? JSON.parse(raw) : DEFAULT_TRACKS);
  } catch {
    return migrateTracks(DEFAULT_TRACKS);
  }
}

/**
 * Resolves a track by its numeric ID OR its slug — for backward compatibility
 * when old links use numeric IDs and new links use slugs.
 */
export function getTrack(idOrSlug: string): Track | undefined {
  return getTracks().find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

export function saveTracks(tracks: Track[]): void {
  localStorage.setItem(KEY_TRACKS, JSON.stringify(tracks));
}

export function getSiteContent(): SiteContent {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(KEY_CONTENT);
    return raw ? migrateSiteContent(JSON.parse(raw)) : DEFAULT_SITE_CONTENT;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  localStorage.setItem(KEY_CONTENT, JSON.stringify(content));
}

// ---------------------------------------------------------------------------
// DRAFT — read/written by admin
// ---------------------------------------------------------------------------

export function getDraftTracks(): Track[] {
  try {
    const raw = localStorage.getItem(KEY_TRACKS_DRAFT);
    if (!raw) return getTracks(); // No draft yet — start from published
    return migrateTracks(JSON.parse(raw));
  } catch {
    return getTracks();
  }
}

export function saveDraftTracks(tracks: Track[]): void {
  localStorage.setItem(KEY_TRACKS_DRAFT, JSON.stringify(tracks));
}

export function getDraftSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(KEY_CONTENT_DRAFT);
    if (!raw) return getSiteContent();
    return migrateSiteContent(JSON.parse(raw));
  } catch {
    return getSiteContent();
  }
}

export function saveDraftSiteContent(content: SiteContent): void {
  localStorage.setItem(KEY_CONTENT_DRAFT, JSON.stringify(content));
}

export function hasDraftChanges(): boolean {
  return (
    localStorage.getItem(KEY_TRACKS_DRAFT) !== null ||
    localStorage.getItem(KEY_CONTENT_DRAFT) !== null
  );
}

// ---------------------------------------------------------------------------
// PUBLISH — copies draft → published, saves old published to history
// ---------------------------------------------------------------------------

const MAX_HISTORY = 5;

export function publishTracks(): void {
  const draft = getDraftTracks();
  const current = getTracks();
  // Save current published to history
  const history = getTrackHistory();
  history.unshift({ data: current, publishedAt: new Date().toISOString() });
  history.splice(MAX_HISTORY);
  localStorage.setItem(KEY_TRACKS_HISTORY, JSON.stringify(history));
  // Publish draft
  localStorage.setItem(KEY_TRACKS, JSON.stringify(draft));
  localStorage.removeItem(KEY_TRACKS_DRAFT);
}

export function publishSiteContent(): void {
  const draft = getDraftSiteContent();
  const current = getSiteContent();
  const history = getSiteContentHistory();
  history.unshift({ data: current, publishedAt: new Date().toISOString() });
  history.splice(MAX_HISTORY);
  localStorage.setItem(KEY_CONTENT_HISTORY, JSON.stringify(history));
  localStorage.setItem(KEY_CONTENT, JSON.stringify(draft));
  localStorage.removeItem(KEY_CONTENT_DRAFT);
}

export function publishAll(): void {
  publishTracks();
  publishSiteContent();
}

export function discardDraft(): void {
  localStorage.removeItem(KEY_TRACKS_DRAFT);
  localStorage.removeItem(KEY_CONTENT_DRAFT);
}

// ---------------------------------------------------------------------------
// VERSION HISTORY
// ---------------------------------------------------------------------------

export function getTrackHistory(): HistoryEntry<Track[]>[] {
  try {
    const raw = localStorage.getItem(KEY_TRACKS_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSiteContentHistory(): HistoryEntry<SiteContent>[] {
  try {
    const raw = localStorage.getItem(KEY_CONTENT_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function rollbackTracks(entry: HistoryEntry<Track[]>): void {
  const current = getTracks();
  const history = getTrackHistory().filter(
    (h) => h.publishedAt !== entry.publishedAt
  );
  history.unshift({ data: current, publishedAt: new Date().toISOString() });
  history.splice(MAX_HISTORY);
  localStorage.setItem(KEY_TRACKS_HISTORY, JSON.stringify(history));
  localStorage.setItem(KEY_TRACKS, JSON.stringify(entry.data));
  localStorage.removeItem(KEY_TRACKS_DRAFT);
}

export function rollbackSiteContent(entry: HistoryEntry<SiteContent>): void {
  const current = getSiteContent();
  const history = getSiteContentHistory().filter(
    (h) => h.publishedAt !== entry.publishedAt
  );
  history.unshift({ data: current, publishedAt: new Date().toISOString() });
  history.splice(MAX_HISTORY);
  localStorage.setItem(KEY_CONTENT_HISTORY, JSON.stringify(history));
  localStorage.setItem(KEY_CONTENT, JSON.stringify(entry.data));
  localStorage.removeItem(KEY_CONTENT_DRAFT);
}

// ---------------------------------------------------------------------------
// PREVIEW — public pages can opt into draft content via ?preview=1
// ---------------------------------------------------------------------------

export function getPreviewTracks(): Track[] {
  return getDraftTracks();
}

export function getPreviewSiteContent(): SiteContent {
  return getDraftSiteContent();
}

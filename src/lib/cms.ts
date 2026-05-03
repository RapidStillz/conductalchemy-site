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
  featured: boolean;
  heroTrack?: boolean;
  featuredOrder?: number;
  accessStatus: AccessStatus;
  audioUrl?: string;
  previewAudioUrl?: string;
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

// ---------------------------------------------------------------------------
// Presets (used in CMS editor dropdowns)
// ---------------------------------------------------------------------------

export const GENRE_OPTIONS = [
  "Bollywood / Orchestral",
  "Cinematic / Orchestral",
  "Electronic / Ambient",
  "Jazz / Contemporary",
  "World / Fusion",
  "Hip-Hop / Urban",
  "Rock / Alternative",
  "Classical / Orchestral",
  "Folk / Acoustic",
  "Pop / Contemporary",
  "Dance / Electronic",
  "Soundtrack",
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
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
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
// Storage helpers
// ---------------------------------------------------------------------------

function seedIfEmpty() {
  if (!localStorage.getItem("ca_tracks")) {
    localStorage.setItem("ca_tracks", JSON.stringify(DEFAULT_TRACKS));
  }
  if (!localStorage.getItem("ca_site_content")) {
    localStorage.setItem("ca_site_content", JSON.stringify(DEFAULT_SITE_CONTENT));
  }
}

function migrateTracks(tracks: Track[]): Track[] {
  return tracks.map((t) => ({
    ...t,
    accessStatus: (t.accessStatus ?? "Public") as AccessStatus,
    mood: Array.isArray(t.mood) ? t.mood : [],
    versions: Array.isArray(t.versions) ? t.versions : [],
    useCases: Array.isArray(t.useCases) ? t.useCases : [],
    collaborators: Array.isArray(t.collaborators) ? t.collaborators : [],
    socialLinks: t.socialLinks ?? {},
    featured: t.featured ?? false,
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
// Public API
// ---------------------------------------------------------------------------

export function getTracks(): Track[] {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem("ca_tracks");
    const tracks: Track[] = raw ? JSON.parse(raw) : [];
    return migrateTracks(tracks);
  } catch {
    return migrateTracks(DEFAULT_TRACKS);
  }
}

export function getTrack(id: string): Track | undefined {
  return getTracks().find((t) => t.id === id);
}

export function saveTracks(tracks: Track[]): void {
  localStorage.setItem("ca_tracks", JSON.stringify(tracks));
}

export function getSiteContent(): SiteContent {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem("ca_site_content");
    return raw ? migrateSiteContent(JSON.parse(raw)) : DEFAULT_SITE_CONTENT;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  localStorage.setItem("ca_site_content", JSON.stringify(content));
}

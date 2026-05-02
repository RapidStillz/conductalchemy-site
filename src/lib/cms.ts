export type AccessStatus = "Public" | "Private" | "NDA / Token Access Required";

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
  accessStatus: AccessStatus;
  audioUrl?: string;
  coverArtUrl?: string;
  createdAt: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  featuredTrackIds: string[];
  aboutText: string;
  contactEmail: string;
  licensingIntro: string;
}

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
};

function seedIfEmpty() {
  if (!localStorage.getItem("ca_tracks")) {
    localStorage.setItem("ca_tracks", JSON.stringify(DEFAULT_TRACKS));
  }
  if (!localStorage.getItem("ca_site_content")) {
    localStorage.setItem("ca_site_content", JSON.stringify(DEFAULT_SITE_CONTENT));
  }
}

/** Migrate older records that lack the accessStatus field */
function migrateTracks(tracks: Track[]): Track[] {
  return tracks.map((t) => ({
    ...t,
    accessStatus: (t.accessStatus ?? "Public") as AccessStatus,
  }));
}

export function getTracks(): Track[] {
  seedIfEmpty();
  const raw = localStorage.getItem("ca_tracks");
  const tracks: Track[] = raw ? JSON.parse(raw) : [];
  return migrateTracks(tracks);
}

export function getTrack(id: string): Track | undefined {
  return getTracks().find((t) => t.id === id);
}

export function saveTracks(tracks: Track[]): void {
  localStorage.setItem("ca_tracks", JSON.stringify(tracks));
}

export function getSiteContent(): SiteContent {
  seedIfEmpty();
  const content = localStorage.getItem("ca_site_content");
  return content ? JSON.parse(content) : DEFAULT_SITE_CONTENT;
}

export function saveSiteContent(content: SiteContent): void {
  localStorage.setItem("ca_site_content", JSON.stringify(content));
}

export const ACCESS_STATUS_OPTIONS: AccessStatus[] = [
  "Public",
  "Private",
  "NDA / Token Access Required",
];

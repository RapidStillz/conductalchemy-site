import { useEffect, useState } from "react";
import { getTrack, Track, AccessStatus } from "@/lib/cms";
import { isTrackUnlocked } from "@/lib/access";
import { useRoute, Link } from "wouter";
import { TrackPlayer } from "@/components/track-player";
import { UnlockModal } from "@/components/unlock-modal";

const ACCESS_BADGE: Record<AccessStatus, { label: string; cls: string }> = {
  Public: { label: "Public", cls: "text-green-600 border-green-400/40 bg-green-50" },
  Private: { label: "Private", cls: "text-amber-700 border-amber-400/40 bg-amber-50" },
  "NDA / Token Access Required": {
    label: "NDA / Token Access Required",
    cls: "text-red-700 border-red-400/40 bg-red-50",
  },
};

const ACCESS_BADGE_DARK: Record<AccessStatus, { label: string; cls: string }> = {
  Public: { label: "Public", cls: "text-green-400 border-green-400/30 bg-green-400/5" },
  Private: { label: "Private", cls: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
  "NDA / Token Access Required": {
    label: "NDA / Token Access Required",
    cls: "text-red-400 border-red-400/30 bg-red-400/5",
  },
};

export default function TrackDetail() {
  const [, params] = useRoute("/music/:id");
  const id = params?.id;
  const [track, setTrack] = useState<Track | null>(null);
  const [isArtefactMode, setIsArtefactMode] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getTrack(id);
      setTrack(found || null);
      if (found) {
        setUnlocked(isTrackUnlocked(found.id));
      }
    }
  }, [id]);

  useEffect(() => {
    if (isArtefactMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    return () => {
      document.documentElement.classList.add("dark");
    };
  }, [isArtefactMode]);

  if (!track) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-serif text-muted-foreground">Work not found.</h1>
        <Link href="/music" className="text-xs uppercase tracking-widest text-primary mt-8 inline-block hover:underline">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const accessStatus = track.accessStatus || "Public";
  const isPrivate = accessStatus === "Private" || accessStatus === "NDA / Token Access Required";
  const badge = isArtefactMode ? ACCESS_BADGE[accessStatus] : ACCESS_BADGE_DARK[accessStatus];

  return (
    <>
      {showUnlockModal && (
        <UnlockModal
          trackId={track.id}
          trackTitle={track.title}
          isArtefactMode={isArtefactMode}
          onUnlocked={() => {
            setUnlocked(true);
            setShowUnlockModal(false);
          }}
          onClose={() => setShowUnlockModal(false)}
        />
      )}

      <div className={`min-h-screen transition-colors duration-700 ${isArtefactMode ? "bg-[#f5f0e8] text-[#1a1510]" : ""}`}>
        <div className="container mx-auto px-4 md:px-8 py-12">

          {/* Top Bar */}
          <div className="flex flex-wrap justify-between items-center mb-16 border-b pb-6 gap-4"
            style={{ borderColor: isArtefactMode ? "rgba(26,21,16,0.15)" : undefined }}>
            <div className="flex items-center gap-4">
              <Link
                href="/music"
                className={`text-[10px] font-sans tracking-[0.2em] uppercase transition-colors ${
                  isArtefactMode ? "text-[#1a1510]/50 hover:text-[#1a1510]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ← Catalogue
              </Link>
              <span className={`text-[10px] font-sans tracking-[0.2em] uppercase ${isArtefactMode ? "text-[#1a1510]/30" : "text-border"}`}>/</span>
              <span className={`text-[10px] font-sans tracking-[0.2em] uppercase ${isArtefactMode ? "text-[#1a1510]/50" : "text-muted-foreground"}`}>
                {track.id.slice(0, 4).padStart(4, "0")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[9px] font-sans uppercase tracking-widest border px-3 py-1.5 ${badge.cls}`}
              >
                {badge.label}
              </span>

              <button
                onClick={() => setIsArtefactMode(!isArtefactMode)}
                className={`text-[10px] font-sans tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-500 flex items-center gap-2 ${
                  isArtefactMode
                    ? "border-[#b5a882] text-[#5c4a28] bg-[#ede5d0]"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isArtefactMode ? "bg-[#b5a882]" : "bg-border"
                  }`}
                />
                {isArtefactMode ? "Exit Artefact" : "View as Artefact"}
              </button>
            </div>
          </div>

          {/* Artefact header decoration */}
          {isArtefactMode && (
            <div className="max-w-5xl mx-auto mb-12 text-center">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#1a1510]/40 mb-4">
                Conduct Alchemy — Catalogue Artefact
              </div>
              <div className="border-t border-b border-[#1a1510]/10 py-2 mx-auto max-w-xs" />
            </div>
          )}

          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center flex flex-col items-center">
              <div className={`text-sm font-sans tracking-[0.3em] uppercase mb-6 ${isArtefactMode ? "text-[#5c4a28]" : "text-primary"}`}>
                {track.genre}
              </div>
              <h1 className={`text-5xl md:text-7xl font-serif mb-8 leading-tight ${isArtefactMode ? "tracking-wide text-[#1a1510]" : "tracking-tight"}`}>
                {track.title}
              </h1>
              <div className={`flex flex-wrap justify-center gap-6 text-xs font-sans tracking-widest uppercase border-t border-b py-4 w-full max-w-2xl ${isArtefactMode ? "border-[#1a1510]/15 text-[#1a1510]/60" : "border-border/40 text-muted-foreground"}`}>
                <div><span className="opacity-50 mr-2">BPM</span>{track.bpm}</div>
                <div><span className="opacity-50 mr-2">Key</span>{track.musicalKey}</div>
                <div><span className="opacity-50 mr-2">Artist</span>{track.artist}</div>
              </div>
            </div>

            {/* Player — shown for all tracks */}
            <div className="mb-16">
              <TrackPlayer
                audioUrl={track.audioUrl}
                isPrivate={isPrivate}
                isUnlocked={unlocked}
                trackTitle={track.title}
                isArtefactMode={isArtefactMode}
                onRequestUnlock={() => setShowUnlockModal(true)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
              {/* Main Content */}
              <div className="md:col-span-7 lg:col-span-8 space-y-16">
                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-6 ${isArtefactMode ? "text-[#1a1510]/50" : "text-muted-foreground"}`}>
                    Concept & Emotion
                  </h2>
                  <p className={`text-xl md:text-2xl font-serif leading-relaxed italic ${isArtefactMode ? "text-[#2a1f10]" : ""}`}>
                    {track.description}
                  </p>
                </section>

                {track.lyrics && track.lyrics.trim() !== "(Instrumental)" && (
                  <section>
                    <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-6 ${isArtefactMode ? "text-[#1a1510]/50" : "text-muted-foreground"}`}>
                      Lyrics & Voice
                    </h2>
                    <div className={`font-serif text-lg leading-loose whitespace-pre-wrap pl-6 border-l ${isArtefactMode ? "border-[#b5a882] text-[#2a1f10]" : "border-primary/30"}`}>
                      {isPrivate && !unlocked ? (
                        <span className={`text-sm italic ${isArtefactMode ? "text-[#1a1510]/40" : "text-muted-foreground/50"}`}>
                          — Lyrics available after unlocking this track —
                        </span>
                      ) : (
                        track.lyrics
                      )}
                    </div>
                  </section>
                )}

                {track.visualConceptNotes && (
                  <section className={`border p-8 md:p-10 ${isArtefactMode ? "border-[#1a1510]/15 bg-[#ede5d0]" : "bg-card/30 border-border/40"}`}>
                    <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-6 flex items-center gap-4 ${isArtefactMode ? "text-[#5c4a28]" : "text-primary"}`}>
                      <div className={`w-4 h-px ${isArtefactMode ? "bg-[#b5a882]" : "bg-primary"}`} />
                      Visual World Note
                    </h2>
                    <p className={`text-lg font-serif italic leading-relaxed ${isArtefactMode ? "text-[#3a2e1e]" : "text-muted-foreground"}`}>
                      "{track.visualConceptNotes}"
                    </p>
                  </section>
                )}
              </div>

              {/* Sidebar Meta */}
              <div className="md:col-span-5 lg:col-span-4 space-y-10">
                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-5 border-b pb-4 ${isArtefactMode ? "text-[#1a1510]/50 border-[#1a1510]/15" : "text-muted-foreground border-border/40"}`}>
                    Access Status
                  </h2>
                  <span className={`text-[9px] font-sans uppercase tracking-widest border px-3 py-1.5 ${badge.cls}`}>
                    {badge.label}
                  </span>
                  {isPrivate && !unlocked && (
                    <p className={`text-xs font-sans mt-3 leading-relaxed ${isArtefactMode ? "text-[#3a2e1e]/70" : "text-muted-foreground"}`}>
                      {accessStatus === "Private"
                        ? "This track is restricted. A 45-second preview is available. Submit your details to access the full composition."
                        : "This track requires a signed NDA and token-based access. Contact licensing for details."}
                    </p>
                  )}
                  {isPrivate && unlocked && (
                    <p className={`text-xs font-sans mt-3 leading-relaxed ${isArtefactMode ? "text-[#5c4a28]" : "text-green-400"}`}>
                      Full access granted. Thank you for registering your interest.
                    </p>
                  )}
                </section>

                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-5 border-b pb-4 ${isArtefactMode ? "text-[#1a1510]/50 border-[#1a1510]/15" : "text-muted-foreground border-border/40"}`}>
                    Licensing Meta
                  </h2>
                  <p className={`text-sm font-sans leading-relaxed mb-6 ${isArtefactMode ? "text-[#3a2e1e]/70" : "text-muted-foreground"}`}>
                    {isPrivate && !unlocked
                      ? "Licensing details are available upon access approval."
                      : track.licensingNotes}
                  </p>
                  <Link
                    href="/contact"
                    className={`inline-block text-xs font-sans tracking-[0.2em] border px-6 py-3 uppercase transition-colors w-full text-center ${
                      isArtefactMode
                        ? "border-[#b5a882] text-[#5c4a28] hover:bg-[#b5a882] hover:text-white"
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Request License
                  </Link>
                </section>

                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-5 border-b pb-4 ${isArtefactMode ? "text-[#1a1510]/50 border-[#1a1510]/15" : "text-muted-foreground border-border/40"}`}>
                    Available Versions
                  </h2>
                  <ul className="space-y-4">
                    {track.versions.map((v, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm font-sans tracking-wide ${isArtefactMode ? "text-[#2a1f10]" : ""}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isArtefactMode ? "bg-[#b5a882]" : "bg-border"}`} />
                        {isPrivate && !unlocked ? (
                          <span className={isArtefactMode ? "text-[#1a1510]/30" : "text-muted-foreground/30"}>
                            {v.replace(/./g, "·").slice(0, 12)}···
                          </span>
                        ) : (
                          v
                        )}
                      </li>
                    ))}
                  </ul>
                  {isPrivate && !unlocked && (
                    <button
                      onClick={() => setShowUnlockModal(true)}
                      className={`mt-4 text-[10px] font-sans tracking-[0.2em] uppercase ${isArtefactMode ? "text-[#5c4a28]" : "text-primary"} hover:underline`}
                    >
                      Unlock to see full details →
                    </button>
                  )}
                </section>

                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-5 border-b pb-4 ${isArtefactMode ? "text-[#1a1510]/50 border-[#1a1510]/15" : "text-muted-foreground border-border/40"}`}>
                    Mood Profile
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {track.mood.map((m) => (
                      <span key={m} className={`text-[10px] uppercase tracking-widest border px-3 py-1.5 ${isArtefactMode ? "border-[#1a1510]/20 text-[#2a1f10]" : "border-border/60 text-foreground"}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className={`text-xs font-sans tracking-[0.2em] uppercase mb-5 border-b pb-4 ${isArtefactMode ? "text-[#1a1510]/50 border-[#1a1510]/15" : "text-muted-foreground border-border/40"}`}>
                    Primary Use Cases
                  </h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {track.useCases.map((uc, i) => (
                      <span key={uc} className={`text-xs font-serif italic ${isArtefactMode ? "text-[#3a2e1e]/70" : "text-muted-foreground"}`}>
                        {uc}{i < track.useCases.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {isArtefactMode && (
            <div className="max-w-5xl mx-auto mt-20 text-center">
              <div className="border-t border-[#1a1510]/10 pt-8">
                <div className="text-[9px] tracking-[0.4em] uppercase text-[#1a1510]/30">
                  Conduct Alchemy — All Rights Reserved
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

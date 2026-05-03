import { useRef, useState, useEffect, useCallback } from "react";

const DEFAULT_PREVIEW_SECONDS = 45;

interface TrackPlayerProps {
  audioUrl?: string;
  previewAudioUrl?: string;
  /** Per-track preview duration in seconds. Defaults to 45. */
  previewDuration?: number;
  isPrivate: boolean;
  isUnlocked: boolean;
  trackTitle: string;
  isArtefactMode?: boolean;
  onRequestUnlock: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const BAR_COUNT = 40;
const BAR_HEIGHTS = Array.from(
  { length: BAR_COUNT },
  (_, i) =>
    30 +
    Math.abs(Math.sin(i * 0.7) * 40) +
    Math.abs(Math.sin(i * 1.3) * 20) +
    Math.abs(Math.cos(i * 0.4) * 15)
);

function isGoogleDrive(url: string): boolean {
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export function TrackPlayer({
  audioUrl,
  previewAudioUrl,
  previewDuration,
  isPrivate,
  isUnlocked,
  trackTitle,
  isArtefactMode = false,
  onRequestUnlock,
}: TrackPlayerProps) {
  const PREVIEW_SECONDS = previewDuration ?? DEFAULT_PREVIEW_SECONDS;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previewExpired, setPreviewExpired] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const previewOnly = isPrivate && !isUnlocked;

  // If we're in preview mode and an explicit preview clip was provided, use it
  // and let it play to natural end (it's already a short clip).
  // Otherwise fall back to audioUrl with a 45-second enforce limit.
  const hasExplicitPreview = previewOnly && !!previewAudioUrl;
  const effectiveUrl = hasExplicitPreview ? previewAudioUrl : audioUrl;
  const limit = hasExplicitPreview ? Infinity : previewOnly ? PREVIEW_SECONDS : Infinity;

  const art = isArtefactMode;
  const gdrive = !!(effectiveUrl && isGoogleDrive(effectiveUrl));

  useEffect(() => {
    setHasAudio(false);
    setAudioError(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPreviewExpired(false);

    if (!effectiveUrl) return;

    const audio = new Audio(effectiveUrl);
    audioRef.current = audio;

    const onCanPlay = () => { setHasAudio(true); setAudioError(false); };
    const onMetadata = () => { setDuration(audio.duration); setHasAudio(true); };
    const onTimeUpdate = () => { setCurrentTime(audio.currentTime); };
    const onEnded = () => { setPlaying(false); setCurrentTime(0); };
    const onError = () => { setAudioError(true); setHasAudio(false); setPlaying(false); };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [effectiveUrl]);

  const enforceLimit = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (limit !== Infinity && audio.currentTime >= limit) {
      audio.pause();
      setPlaying(false);
      setPreviewExpired(true);
    }
  }, [limit]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", enforceLimit);
    return () => audio.removeEventListener("timeupdate", enforceLimit);
  }, [enforceLimit]);

  function togglePlay() {
    const audio = audioRef.current;
    if (previewExpired) {
      onRequestUnlock();
      return;
    }
    if (!audio) {
      if (previewOnly) onRequestUnlock();
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (limit !== Infinity && currentTime >= limit) {
        setPreviewExpired(true);
        onRequestUnlock();
        return;
      }
      audio.play().catch(() => {
        setAudioError(true);
        setHasAudio(false);
        setPlaying(false);
      });
      setPlaying(true);
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const target = ratio * duration;
    if (limit !== Infinity && target > limit) {
      onRequestUnlock();
      return;
    }
    audio.currentTime = target;
    setCurrentTime(target);
    setPreviewExpired(false);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const previewProgress = limit !== Infinity && duration > 0 ? (limit / duration) * 100 : 100;

  const primaryColor = art ? "#8a6e3a" : "var(--primary)";
  const mutedColor = art ? "rgba(26,21,16,0.2)" : "rgba(255,255,255,0.12)";
  const textMuted = art ? "text-[#1a1510]/40" : "text-muted-foreground";
  const textPrimary = art ? "text-[#5c4a28]" : "text-primary";

  return (
    <div
      className={`border space-y-5 ${
        art
          ? "border-[#1a1510]/15 bg-[#ede5d0]"
          : "border-border/40 bg-card/30"
      }`}
    >
      {/* Google Drive warning banner */}
      {gdrive && !audioError && (
        <div className={`px-6 pt-5 flex items-start gap-3`}>
          <span className={`text-sm shrink-0 mt-0.5 ${art ? "text-[#8a6e3a]" : "text-amber-400"}`}>⚠</span>
          <p className={`text-[10px] font-sans leading-relaxed ${art ? "text-[#5c4a28]/80" : "text-amber-400/80"}`}>
            Google Drive links may be blocked by browser streaming/CORS policies. For production, use Cloudflare R2 or a direct MP3 URL.
          </p>
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Status label */}
        <div className="flex items-center justify-between">
          <div className={`text-[9px] font-sans tracking-[0.25em] uppercase ${textMuted}`}>
            {!isPrivate && "Full Access"}
            {isPrivate && !isUnlocked && !previewExpired && (
              hasExplicitPreview
                ? "Preview Clip"
                : `Preview · ${formatTime(PREVIEW_SECONDS)} available`
            )}
            {isPrivate && !isUnlocked && previewExpired && "Preview ended"}
            {isPrivate && isUnlocked && (
              <span className={`flex items-center gap-1.5 ${textPrimary}`}>
                <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                  <rect x="2" y="5" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1"/>
                  <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                Full Access Unlocked
              </span>
            )}
          </div>

          {isPrivate && !isUnlocked && (
            <button
              onClick={onRequestUnlock}
              className={`text-[9px] font-sans tracking-[0.2em] uppercase border px-3 py-1.5 transition-colors ${
                art
                  ? "border-[#8a6e3a] text-[#5c4a28] hover:bg-[#8a6e3a] hover:text-white"
                  : "border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              Unlock Full Track
            </button>
          )}
        </div>

        {/* Waveform visualiser */}
        <div className="relative h-16 flex items-end gap-[2px] overflow-hidden select-none">
          {BAR_HEIGHTS.map((h, i) => {
            const barProgress = ((i + 1) / BAR_COUNT) * 100;
            const isFilled = barProgress <= progress;
            const isPreviewZone = previewOnly && barProgress <= previewProgress;

            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-colors duration-100"
                style={{
                  height: `${h}%`,
                  background: isFilled
                    ? primaryColor
                    : isPreviewZone && !isUnlocked
                    ? art ? "rgba(138,110,58,0.25)" : "rgba(var(--primary-rgb, 180,150,80),0.25)"
                    : mutedColor,
                  opacity: previewOnly && limit !== Infinity && !isPreviewZone ? 0.35 : 1,
                }}
              />
            );
          })}

          {/* Preview cap line — only when enforcing time limit */}
          {previewOnly && limit !== Infinity && duration > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${previewProgress}%`,
                background: art ? "rgba(138,110,58,0.6)" : "rgba(var(--primary-rgb,180,150,80),0.6)",
              }}
            />
          )}

          {/* Overlay when preview expired */}
          {previewExpired && (
            <button
              onClick={onRequestUnlock}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: art
                  ? "rgba(245,240,232,0.85)"
                  : "rgba(13,13,13,0.85)",
              }}
            >
              <span
                className={`text-[10px] font-sans tracking-[0.2em] uppercase flex items-center gap-2 ${
                  art ? "text-[#5c4a28]" : "text-primary"
                }`}
              >
                <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                  <rect x="2.5" y="6" width="9" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Unlock to continue
              </span>
            </button>
          )}

          {/* Clickable seek area */}
          {hasAudio && !previewExpired && (
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={handleSeek}
            />
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-5">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={audioError}
            className={`w-10 h-10 border flex items-center justify-center shrink-0 transition-colors disabled:opacity-30 ${
              art
                ? "border-[#b5a882] text-[#5c4a28] hover:bg-[#b5a882]/20"
                : "border-border/60 text-foreground hover:border-primary/60"
            }`}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
                <rect x="3" y="2" width="3" height="10" rx="0.5" fill="currentColor"/>
                <rect x="8" y="2" width="3" height="10" rx="0.5" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
                <path d="M4 2.5l7 4.5-7 4.5V2.5z" fill="currentColor"/>
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="flex-1 space-y-1.5">
            <div
              className={`h-[2px] relative ${art ? "bg-[#1a1510]/15" : "bg-border/40"}`}
              onClick={hasAudio ? handleSeek : undefined}
              style={{ cursor: hasAudio ? "pointer" : "default" }}
            >
              <div
                className="absolute left-0 top-0 h-full transition-all"
                style={{ width: `${progress}%`, background: primaryColor }}
              />
              {previewOnly && limit !== Infinity && (
                <div
                  className="absolute top-0 h-full"
                  style={{
                    left: `${previewProgress}%`,
                    right: 0,
                    background: art ? "#8a6e3a" : "var(--primary)",
                    opacity: 0.12,
                  }}
                />
              )}
            </div>
            <div className={`flex justify-between text-[9px] font-sans ${textMuted}`}>
              <span>{formatTime(currentTime)}</span>
              <span>
                {previewOnly && limit !== Infinity
                  ? `${formatTime(PREVIEW_SECONDS)} preview`
                  : duration > 0
                  ? formatTime(duration)
                  : trackTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Audio error message */}
        {audioError && (
          <div className={`border px-4 py-3 flex items-start gap-3 ${art ? "border-[#1a1510]/20 bg-[#ede5d0]" : "border-red-400/30 bg-red-400/5"}`}>
            <span className={`text-sm shrink-0 mt-0.5 ${art ? "text-[#5c4a28]" : "text-red-400"}`}>✗</span>
            <div className="space-y-1">
              <p className={`text-[10px] font-sans leading-relaxed ${art ? "text-[#3a2e1e]/70" : "text-red-400"}`}>
                Audio failed to load. The URL may be inaccessible or not a streamable audio file.
              </p>
              {gdrive && (
                <p className={`text-[10px] font-sans leading-relaxed ${art ? "text-[#5c4a28]/70" : "text-amber-400/80"}`}>
                  Google Drive links are blocked by browser CORS policies. Use Cloudflare R2 or a direct .mp3 URL for production.
                </p>
              )}
            </div>
          </div>
        )}

        {/* No audio URL */}
        {!effectiveUrl && !audioError && (
          <p className={`text-[10px] font-sans leading-relaxed ${textMuted}`}>
            {previewOnly
              ? "Audio preview available upon upload. Unlock now to receive full stems and masters when released."
              : "Audio file not yet attached. Contact us for stems, masters, and sync-ready files."}
          </p>
        )}
      </div>
    </div>
  );
}

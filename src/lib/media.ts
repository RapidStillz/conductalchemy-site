// ---------------------------------------------------------------------------
// Media validation and embed URL helpers
// Cloudflare Pages compatible — no server or paid APIs required
// ---------------------------------------------------------------------------

export type MediaType = "audio" | "youtube" | "vimeo" | "spotify" | "soundcloud" | "image";

export type ValidationSeverity = "ok" | "warning" | "error" | "empty";

export interface MediaValidation {
  isValid: boolean;
  message: string;
  severity: ValidationSeverity;
  embedUrl?: string;
}

/** True if the URL is a Google Drive or Google Docs link */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

/** True if the URL has a recognised direct audio file extension */
export function isDirectAudioUrl(url: string): boolean {
  return /\.(mp3|wav|ogg|flac|aac|m4a|opus)(\?|#|$)/i.test(url);
}

/**
 * Validate a URL for a specific media type and return a structured result
 * including the embed URL where applicable.
 */
export function validateMediaUrl(url: string, type: MediaType): MediaValidation {
  const trimmed = (url || "").trim();

  if (!trimmed) {
    return { isValid: false, message: "No URL provided.", severity: "empty" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      message: "Invalid URL format — must begin with https://",
      severity: "error",
    };
  }

  if (!parsed.protocol.startsWith("http")) {
    return {
      isValid: false,
      message: "URL must use https:// protocol.",
      severity: "error",
    };
  }

  switch (type) {
    case "audio": {
      if (isGoogleDriveUrl(trimmed)) {
        return {
          isValid: true,
          message:
            "Google Drive links may be blocked by browser streaming/CORS. Use Cloudflare R2 or direct MP3 hosting for production.",
          severity: "warning",
        };
      }
      // Page-based streaming services that can't serve raw audio
      if (
        trimmed.includes("suno.com") ||
        (trimmed.includes("soundcloud.com") && !trimmed.includes("w.soundcloud.com")) ||
        trimmed.includes("open.spotify.com") ||
        trimmed.includes("music.apple.com")
      ) {
        return {
          isValid: false,
          message:
            "Page links from Suno, SoundCloud, Spotify etc. cannot be used as direct audio. You need a direct .mp3, .wav, or CDN audio URL.",
          severity: "warning",
        };
      }
      return {
        isValid: true,
        message: isDirectAudioUrl(trimmed)
          ? "Direct audio file URL detected — use the player below to confirm it loads."
          : "URL format looks valid — use the player below to confirm audio loads.",
        severity: "ok",
      };
    }

    case "youtube": {
      const ytMatch = trimmed.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/
      );
      if (!ytMatch) {
        return {
          isValid: false,
          message:
            "Not a valid YouTube video URL. Expected: youtube.com/watch?v=ID or youtu.be/ID",
          severity: "error",
        };
      }
      return {
        isValid: true,
        message: `Valid YouTube video (ID: ${ytMatch[1]})`,
        severity: "ok",
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
      };
    }

    case "vimeo": {
      const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
      if (!vimeoMatch) {
        return {
          isValid: false,
          message: "Not a valid Vimeo URL. Expected: vimeo.com/VIDEO_ID",
          severity: "error",
        };
      }
      return {
        isValid: true,
        message: `Valid Vimeo video (ID: ${vimeoMatch[1]})`,
        severity: "ok",
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      };
    }

    case "spotify": {
      const spMatch = trimmed.match(
        /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/
      );
      if (!spMatch) {
        return {
          isValid: false,
          message:
            "Not a valid Spotify URL. Expected: open.spotify.com/track/ID",
          severity: "error",
        };
      }
      return {
        isValid: true,
        message: `Valid Spotify ${spMatch[1]} (ID: ${spMatch[2]})`,
        severity: "ok",
        embedUrl: `https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}?utm_source=oembed`,
      };
    }

    case "soundcloud": {
      if (!trimmed.includes("soundcloud.com")) {
        return {
          isValid: false,
          message:
            "Not a SoundCloud URL. Expected: soundcloud.com/artist/track-name",
          severity: "error",
        };
      }
      const encoded = encodeURIComponent(trimmed);
      return {
        isValid: true,
        message: "Valid SoundCloud URL",
        severity: "ok",
        embedUrl: `https://w.soundcloud.com/player/?url=${encoded}&color=%23c8a84b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
      };
    }

    case "image": {
      const hasImageExt = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|#|$)/i.test(
        trimmed
      );
      if (!hasImageExt) {
        return {
          isValid: true,
          message:
            "URL format looks valid. No image extension detected — the preview below will confirm.",
          severity: "warning",
        };
      }
      return {
        isValid: true,
        message: "Image URL looks valid.",
        severity: "ok",
      };
    }
  }
}

/**
 * Detect whether a video URL maps to a known embeddable platform.
 * Returns the platform name or null if unrecognised.
 */
export function detectEmbedPlatform(
  videoUrl: string
): "youtube" | "vimeo" | "spotify" | "soundcloud" | null {
  if (!videoUrl) return null;
  if (/(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(videoUrl)) return "youtube";
  if (/vimeo\.com\/\d+/.test(videoUrl)) return "vimeo";
  if (/open\.spotify\.com\/(track|album|playlist|episode)\//.test(videoUrl)) return "spotify";
  if (videoUrl.includes("soundcloud.com")) return "soundcloud";
  return null;
}

/**
 * Convert a raw video URL to an embed URL for display in an <iframe>.
 * Returns null if the URL is not a recognised embeddable platform.
 */
export function getVideoEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;
  try {
    const ytMatch = videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    const spMatch = videoUrl.match(
      /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/
    );
    if (spMatch)
      return `https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}?utm_source=oembed`;

    if (videoUrl.includes("soundcloud.com")) {
      const encoded = encodeURIComponent(videoUrl);
      return `https://w.soundcloud.com/player/?url=${encoded}&color=%23c8a84b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    }

    // Unrecognised — do not attempt to embed; caller should show a warning
    return null;
  } catch {
    return null;
  }
}

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
      return {
        isValid: true,
        message: "URL format looks valid — use the player below to confirm audio loads.",
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
 * Convert a raw video URL to an embed URL for display in an <iframe>.
 * Returns null if the URL is not a recognised embeddable format.
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

    // Generic embed — return as-is
    if (videoUrl.startsWith("http")) return videoUrl;
    return null;
  } catch {
    return null;
  }
}

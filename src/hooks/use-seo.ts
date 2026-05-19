import { useEffect } from "react";

// ---------------------------------------------------------------------------
// SEO hook — sets page title, meta descriptions, Open Graph, and Twitter cards
// Works client-side for Cloudflare Pages (SPA); no SSR required.
// ---------------------------------------------------------------------------

const SITE_NAME = "Conduct Alchemy";
const DEFAULT_DESCRIPTION =
  "Premium cinematic music for film, television, advertising and beyond. Sync licensing, full stems, and custom commissions available.";
const DEFAULT_OG_IMAGE = "/opengraph.jpg";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  type?: "website" | "music.song" | "article";
}

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  const selector = `meta[${attr}="${CSS.escape(key)}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  ogImage,
  canonical,
  type = "website",
}: SEOProps = {}): void {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESCRIPTION;
  const image = ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    // Standard
    upsertMeta("name", "description", desc);

    // Open Graph
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter Card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", image);

    // Canonical
    if (canonical) {
      upsertLink("canonical", canonical);
    }
  }, [fullTitle, desc, image, canonical, type]);
}

# Conduct Alchemy Asset Register

Status: Active / official logo patch received
Owner: Ash / RapidStillz
Purpose: Track where Conduct Alchemy brand, music, visual and licensing assets live so future ChatGPT and coding-agent sessions do not recreate or ignore existing work.

## Storage principle

Use the right location for the right asset type.

- GitHub: lightweight web-ready assets, source-of-truth docs, implementation references, SVG/PNG logos, compressed artwork, design tokens.
- Google Drive: heavy source files, masters, stems, full-resolution artwork, video source files, exported pitch decks and working documents.
- Cloudflare R2: future production delivery/storage for controlled assets where needed.
- Cloudflare Pages: deployed website/app only, not master storage.

## Proposed GitHub structure

```text
/public/brand/conduct-alchemy/logo/
/public/brand/conduct-alchemy/marks/
/public/brand/conduct-alchemy/icons/
/public/brand/conduct-alchemy/favicons/
/public/brand/conduct-alchemy/backgrounds/
/public/brand/conduct-alchemy/previews/
/public/brand/conduct-alchemy/social/
/public/brand/conduct-alchemy/artwork/
/public/brand/conduct-alchemy/licensing/
/public/brand/conduct-alchemy/releases/
```

## Official logo asset patch

Uploaded package:

```text
Conduct_Alchemy_Official_Logo_Asset_Patch_v1.zip
```

Purpose:

```text
Drop into RapidStillz/conductalchemy-site so CSS-created logo marks can be replaced with approved assets.
```

Manifest committed:

```text
docs/CONDUCT_ALCHEMY_LOGO_ASSET_MANIFEST.json
```

Implementation instruction committed:

```text
docs/CODEX_REPLACE_CSS_LOGO_WITH_OFFICIAL_ASSETS.md
```

### Recommended implementation files

| Usage | Asset path |
| --- | --- |
| Dark header logo | `/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-white.svg` |
| Light header logo | `/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-black.svg` |
| Dark nav logo | `/brand/conduct-alchemy/logo/svg/ca-logo-nav-white.svg` |
| Light nav logo | `/brand/conduct-alchemy/logo/svg/ca-logo-nav-black.svg` |
| Dark hero primary | `/brand/conduct-alchemy/logo/svg/ca-logo-primary-white.svg` |
| Light hero primary | `/brand/conduct-alchemy/logo/svg/ca-logo-primary-black.svg` |
| Motif dark UI | `/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg` |
| Motif light UI | `/brand/conduct-alchemy/marks/svg/ca-motif-vector.svg` |
| Favicon ICO | `/brand/conduct-alchemy/favicons/favicon.ico` |
| Apple touch icon | `/brand/conduct-alchemy/favicons/apple-touch-icon.png` |

### Logo rules

- Primary full lockup = motif + Conduct Alchemy wordmark + divider + FORGED IN RESONANCE.
- Horizontal lockup = motif + Conduct Alchemy wordmark only; no divider; no strapline.
- Motif only = symbol only; use for favicon, loader, app/social icon and small UI marks.
- Do not recreate the motif with CSS except as an emergency placeholder.
- Do not distort, recolour or rearrange approved logo assets.

## Asset categories

### Logo / brand marks

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Primary Conduct Alchemy logo | Uploaded ZIP patch | `/public/brand/conduct-alchemy/logo/svg/ca-logo-primary-*.svg` | Received / needs file commit | Full lockup variants available |
| Horizontal logo | Uploaded ZIP patch | `/public/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-*.svg` | Received / needs file commit | Use for headers/nav where space allows |
| Nav logo | Uploaded ZIP patch | `/public/brand/conduct-alchemy/logo/svg/ca-logo-nav-*.svg` | Received / needs file commit | Compact header/nav implementation |
| Wordmark | Uploaded ZIP patch | `/public/brand/conduct-alchemy/logo/svg/ca-wordmark-*.svg` | Received / needs file commit | Text-only applications |
| Icon / motif | Uploaded ZIP patch | `/public/brand/conduct-alchemy/marks/svg/ca-motif-vector*.svg` | Received / needs file commit | Replace CSS approximation |
| Favicons/icons | Uploaded ZIP patch | `/public/brand/conduct-alchemy/favicons/` and `/icons/` | Received / needs binary commit | Browser/device icons |

### Brand guidelines

| Document | Current location | Repo location | Status | Notes |
| --- | --- | --- | --- | --- |
| Conduct Alchemy brand source of truth | GitHub PR branch | `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md` | Active | Updated from latest boards |
| Web/app visual system | GitHub PR branch | `docs/CONDUCT_ALCHEMY_WEB_APP_VISUAL_SYSTEM.md` | Active | Created from latest boards |
| Logo asset manifest | GitHub PR branch | `docs/CONDUCT_ALCHEMY_LOGO_ASSET_MANIFEST.json` | Active | From official logo patch |
| Codex logo replacement instruction | GitHub PR branch | `docs/CODEX_REPLACE_CSS_LOGO_WITH_OFFICIAL_ASSETS.md` | Active | Guides replacement of CSS logo |

### Background / texture assets

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Dark texture | Uploaded ZIP patch | `/public/brand/conduct-alchemy/backgrounds/ca-bg-dark-texture.jpg` | Received / needs binary commit | Dark mode material texture |
| Light texture | Uploaded ZIP patch | `/public/brand/conduct-alchemy/backgrounds/ca-bg-light-texture.jpg` | Received / needs binary commit | Artifact mode material texture |
| Parchment texture | Uploaded ZIP patch | `/public/brand/conduct-alchemy/backgrounds/ca-bg-parchment-texture.jpg` | Received / needs binary commit | Archive/editorial surfaces |
| Motif overlay | Uploaded ZIP patch | `/public/brand/conduct-alchemy/backgrounds/ca-bg-motif-overlay.png` | Received / needs binary commit | Subtle brand overlay |

### Social / preview assets

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Social cover | Uploaded ZIP patch | `/public/brand/conduct-alchemy/social/ca-social-cover-1200x630.png` | Received / needs binary commit | OG/social sharing image |
| Social icons | Uploaded ZIP patch | `/public/brand/conduct-alchemy/social/` | Received / needs binary commit | Social avatars/icons |
| Logo previews | Uploaded ZIP patch | `/public/brand/conduct-alchemy/previews/` | Received / needs binary commit | Reference renders |

### Release / music visuals

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| We Were Something artwork/visuals | To confirm | To add if relevant | Unknown | May exist in Studio OS/RapidStillz assets |
| Rishta Naya artwork/visuals | To confirm | To add if relevant | Unknown | Check prior Conduct Alchemy conversations |
| General Conduct Alchemy visual motifs | Latest visual boards + logo patch | To add | Partially received | Use brand boards and official motif |

### Licensing/sync assets

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Licensing page hero visual | Latest visual boards | To implement | Direction confirmed | Should reflect premium business/licensing board |
| Music licensing one-sheet | To confirm | Optional | Missing | Could be useful later |
| Track catalogue / pitch assets | To confirm | Controlled access later | Missing | Do not expose publicly without review |

## Immediate action required

1. Commit the official logo SVG/PNG/icon/background files from the ZIP patch to `/public/brand/conduct-alchemy/`.
2. Replace CSS-created logo marks with official assets.
3. Use horizontal logo for header/navigation.
4. Use motif only for compact UI marks, player marks, favicon and icon contexts.
5. Use full primary lockup for hero/editorial contexts only.
6. Keep heavy originals in Google Drive or later Cloudflare R2 if file sizes become unsuitable for GitHub.

## ChatGPT / coding-agent instruction

Before any Conduct Alchemy site/app/brand work, agents must check:

1. `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md`
2. `docs/CONDUCT_ALCHEMY_WEB_APP_VISUAL_SYSTEM.md`
3. `docs/CONDUCT_ALCHEMY_ASSET_REGISTER.md`
4. `docs/CONDUCT_ALCHEMY_LOGO_ASSET_MANIFEST.json`
5. `/public/brand/conduct-alchemy/` once assets are committed

If relevant assets are missing, do not invent final branding. Use explicit provisional styling only and request/locate assets first.

# Conduct Alchemy Asset Register

Status: Draft / requires population
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
/public/brand/conduct-alchemy/artwork/
/public/brand/conduct-alchemy/licensing/
/public/brand/conduct-alchemy/releases/
```

## Asset categories

### Logo / brand marks

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Primary Conduct Alchemy logo | To confirm | To add | Missing | Needed before final brand pass |
| Icon / mark | To confirm | To add | Missing | Needed for header/favicon/social cards |
| Dark-background logo | To confirm | To add | Missing | Needed for site pages |
| Light-background logo | To confirm | To add | Missing | Optional |

### Brand guidelines

| Document | Current location | Repo location | Status | Notes |
| --- | --- | --- | --- | --- |
| Conduct Alchemy brand source of truth | GitHub PR branch | `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md` | Draft | Created as control point |
| Visual identity / colour / typography guide | To confirm | To add | Missing | Pull from prior conversations/assets |
| Brand voice / tone guide | To confirm | To add | Missing | Needs consolidation |

### Release / music visuals

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| We Were Something artwork/visuals | To confirm | To add if relevant | Unknown | May already exist in Studio OS/RapidStillz assets |
| Rishta Naya artwork/visuals | To confirm | To add if relevant | Unknown | Check prior Conduct Alchemy conversations |
| General Conduct Alchemy visual motifs | To confirm | To add | Missing | Needed for non-generic page styling |

### Licensing/sync assets

| Asset | Current location | Web-ready location | Status | Notes |
| --- | --- | --- | --- | --- |
| Licensing page hero visual | To confirm | To add | Missing | Should reflect CA identity |
| Music licensing one-sheet | To confirm | Optional | Missing | Could be useful later |
| Track catalogue / pitch assets | To confirm | Controlled access later | Missing | Do not expose publicly without review |

## Immediate action required

1. Identify existing Conduct Alchemy brand/logo/visual files from prior conversations or drives.
2. Decide which assets are final, provisional or deprecated.
3. Store lightweight web-ready assets in GitHub under `/public/brand/conduct-alchemy/`.
4. Link heavy/source assets to Google Drive folders from this register.
5. Update the licensing page only after assets/guidance are confirmed.

## ChatGPT / coding-agent instruction

Before any Conduct Alchemy site/app/brand work, agents must check:

1. `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md`
2. `docs/CONDUCT_ALCHEMY_ASSET_REGISTER.md`
3. `/public/brand/conduct-alchemy/` if it exists

If relevant assets are missing, do not invent final branding. Use explicit provisional styling only and request/locate assets first.

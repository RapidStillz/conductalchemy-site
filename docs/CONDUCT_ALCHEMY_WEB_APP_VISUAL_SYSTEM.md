# Conduct Alchemy Web/App Visual System

Status: Current working guide
Owner: Ash / RapidStillz
Purpose: Translate the Conduct Alchemy brand boards into implementation guidance for website, app, admin, licensing, music catalogue and future Studio OS work.

## Core experience model

Conduct Alchemy has two primary public modes:

### Dark Mode
Focus. Depth. Immersion.

Use for:

- homepage hero
- immersive music discovery
- licensing mood-setting
- featured works
- visual worlds
- premium access moments
- cinematic storytelling

Visual traits:

- graphite black / deep charcoal backgrounds
- restrained amber highlights
- large serif headlines
- logo and symbol in white or warm ivory
- minimal navigation
- audio-first UI patterns
- high craft, low noise

### Artifact Mode
Clarity. Warmth. Reflection.

Use for:

- song/track pages
- catalogue evaluation
- rights and licensing metadata
- tables, filters and structured review
- printable/editorial presentation
- client/supervisor/agency evaluation contexts

Visual traits:

- paper / parchment / ivory background
- black editorial typography
- thin rules and dividers
- structured metadata panels
- refined catalogue tables
- archival, object-like feeling

## View as Artifact / Exit Artifact

This is a core Conduct Alchemy interface mechanism.

It should allow users to shift between:

- immersive discovery: Dark Mode
- considered review: Artifact Mode

It is not merely a theme switch. It is part of the brand storytelling.

Implementation notes:

- Button labels: `View as Artifact` and `Exit Artifact`
- Use on home, song page, catalogue and licensing contexts where switching perspective adds value.
- The switch should feel precise and intentional, not novelty UI.

## Navigation direction

Public navigation examples from brand boards:

- Catalogue
- Visual Worlds
- Licensing
- About
- Artifacts
- Journal
- Music Library
- For Business
- Story
- Community
- Contact

Primary CTAs:

- Request Access
- Request Licensing Access
- License This Track
- Request Clearance
- Explore the Library
- Discover the Catalogue

Use small uppercase nav labels with refined spacing.

## Homepage pattern

Desired components:

- Conduct Alchemy masthead / horizontal logo
- cinematic hero statement
- clear CTA pair: catalogue + licensing/access
- optional audio intro: Listen to the Alchemy
- featured works row
- visual worlds band
- licensing confidence section
- footer with brand pillars and navigation

Example tone:

- Music for storytellers. Crafted by visionaries.
- Exceptional music. Clear rights. Confident creativity.
- Curated music for story and brand.

## Licensing / Business page pattern

The licensing page should feel like a premium business-facing entry point, not a price calculator.

Core message:

- Exceptional music
- Clear rights
- Confident creativity
- Built for agencies, brands, production companies and creative decision makers

Recommended sections:

1. Hero / proposition
2. Trust / credibility signal where legitimate
3. Licensing pillars
4. Use cases
5. How access works
6. Business-ready track preview or controlled catalogue link
7. Project enquiry / request access

Avoid:

- public fixed pricing
- too much FAQ
- excessive scroll
- heavy generic card grids
- generic dark SaaS style

## Song Library pattern

Artifact-mode catalogue.

Features:

- page title: Song Library
- refined search/filter sidebar
- featured collections
- curated moods
- list/table view
- track rows with artwork, waveform, duration, BPM, key, access status
- premium/standard/exclusive labels
- mood, genre, use-case filters

This is a core commercial and discovery interface.

## Song page pattern

Artifact-mode evaluation surface.

Required concepts:

- song artwork
- title
- artist/source
- catalog number
- duration
- BPM
- time signature
- key
- waveform player
- mood profile
- primary use cases
- available versions
- rights and clearances
- story notes
- lyrics excerpt where appropriate
- related tracks
- `License This Track` CTA
- `View as Artifact` / `Exit Artifact` mechanic

## Content Hub / Journal pattern

Editorial light-mode content feed.

Features:

- story, sound, inspiration framing
- featured story cards
- shorts/reels
- latest releases
- story snippets
- community spotlight
- submit your content CTA
- stay in tune email capture

## Admin/Internal tools pattern

Internal tools should feel calm, precise and premium — not flashy.

Use:

- dark side navigation
- paper main panels
- structured tables
- pipeline boards
- simple status dots
- refined cards
- clear review actions

Modules from visual boards:

- CMS
- Lead Tool / CRM
- Licensing Management
- Metrics / Analytics
- Track Manager
- Access Control
- Asset Library
- User Roles

Admin principle:

> Designed for clarity and focus.

## UI component language

Buttons:

- Primary dark on paper: black filled button with uppercase label
- Primary on dark: amber or ivory button
- Secondary: outline button with fine border
- Icon buttons: circular, minimal

Cards:

- Use thin borders and paper/graphite surfaces
- Avoid bulky SaaS card shadows
- Use dividers and grid structure rather than heavy rounded panels

Forms:

- Minimal fields
- Thin borders
- small uppercase labels
- clear privacy/rights notes
- no excessive decoration

Metadata:

- small uppercase
- letter-spaced
- separated by dots or thin dividers
- treated like catalogue/labelling information

## Colour tokens

```css
--ca-black: #050505;
--ca-charcoal: #1F2120;
--ca-slate: #70736F;
--ca-warm-grey: #A2A39E;
--ca-paper: #EDE9E3;
--ca-soft-white: #F7F5F0;
--ca-amber: #D4A24A;
```

## Typography tokens

```css
--ca-display: 'Cormorant Garamond', Georgia, serif;
--ca-ui: 'IBM Plex Sans', Inter, system-ui, sans-serif;
```

## Implementation priority

1. Establish shared CSS/token layer.
2. Add web-ready logo/symbol assets.
3. Rework licensing page using brand pattern.
4. Build homepage using dark mode.
5. Build song library using Artifact mode.
6. Build song page template.
7. Build admin modules using internal-system pattern.

## Current design risk

The current licensing PR must not be treated as final until it reflects:

- typography pairing
- CA palette
- logo system
- View as Artifact language where appropriate
- refined editorial/catalogue layout
- less generic landing-page structure

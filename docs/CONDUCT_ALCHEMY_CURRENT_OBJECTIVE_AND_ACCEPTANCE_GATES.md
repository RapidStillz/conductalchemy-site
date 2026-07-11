# Conduct Alchemy — Current Objective and Acceptance Gates

Status: Active override for current launch work
Owner: Ash / RapidStillz
Applies to: `/licensing`, homepage, public brand copy, visual review, programme-control updates

## Current launch objective

Conduct Alchemy is the wider music brand and commercial platform. Licensing is an important business capability and launch pathway, but it must not redefine the whole brand as merely a licensing business.

The active sequence is fixed:

1. Close the existing `/licensing` PR loop against founder feedback.
2. Preserve the working Worker submission path and `/admin` behaviour.
3. Move directly into the already-started homepage build.
4. Do not create replacement systems, alternate infrastructure, or new strategic detours.

This sequence is not a new strategic discovery and must not be repeatedly reopened as though it were undecided.

## Positioning rule

Do not describe Conduct Alchemy as:

- a "premium licensing house"
- only a sync/licensing service
- a stock-music catalogue
- a generic marketplace
- a SaaS product

Preferred framing:

> Conduct Alchemy is a music brand built around distinctive songs, storytelling, artists, audiences and commercially useful creative pathways — including licensing.

On `/licensing`, describe the page and service rather than narrowing the identity of the whole brand. Example:

> Conduct Alchemy offers a considered licensing route for filmmakers, brands, agencies, creators and other storytellers seeking distinctive music and clearly scoped usage.

## Founder-feedback precedence

Founder feedback overrides earlier draft copy, old PR descriptions and stale source-of-truth language where they conflict.

Before asking Ash to review a preview, the controller must confirm that all previously stated founder corrections have been implemented or explicitly identify any item that is still open.

A page must not be called "ready for founder review" merely because:

- CI passed
- Cloudflare deployed
- routes return HTTP 200
- screenshots were captured
- code uses an approved-looking asset path

Those are technical gates, not product approval.

## Mandatory pre-review checklist

### Brand and copy

- No "premium licensing house" positioning remains.
- The page presents licensing as one Conduct Alchemy capability, not the complete brand identity.
- Copy matches the current founder-approved direction rather than an older source document.

### Logo and visual assets

- The exact founder-approved logo treatment is used.
- The logo is not recreated as live SVG text or substituted with a lookalike asset.
- The full `y` descender in "Alchemy" is visible at desktop and mobile sizes.
- Motif and hero treatment match the approved visual direction.
- A technically valid SVG path is not sufficient evidence of visual approval.

### Product experience

- Hero visual direction reflects the approved Conduct Alchemy experience.
- Buyer journey and CTA hierarchy remain clear.
- Artifact Mode is exercised, not just present.
- Mobile review is performed on the actual deployed build.

### Functional safety

- Existing Worker `/submit` path remains compatible.
- Legacy payload fields remain available unless the Worker is deliberately migrated.
- `/admin` remains functional.
- No changes to secrets, auth, payment, NDA, token or storage boundaries without founder approval.

## Review-state vocabulary

Use only these states:

- `TECHNICALLY GREEN — PRODUCT CORRECTIONS OUTSTANDING`
- `READY FOR FOUNDER VISUAL REVIEW`
- `READY FOR MERGE APPROVAL`
- `NOT READY — BLOCKERS LISTED`

Do not use `READY FOR FOUNDER VISUAL REVIEW` while known founder feedback remains unimplemented.

## Current known blockers

At the time this document was added:

1. `/licensing` still contains the rejected phrase "premium licensing house".
2. The currently deployed logo treatment has not been accepted by the founder.
3. The hero visual remains inconsistent with the founder's prior direction.
4. The root homepage on `main` remains a placeholder; homepage work exists separately and remains queued after the licensing correction loop.
5. Real form submission and admin mutation evidence remain incomplete.

Therefore the current state is:

`NOT READY — BLOCKERS LISTED`

## Controller behaviour

- Treat repeated rediscovery of already-fixed priorities as a programme-control defect.
- Search prior founder feedback and current objective documents before proposing a change in direction.
- Do not convert engineering activity into claims of product progress.
- Do not ask Ash to repeat feedback already recorded.
- Record corrections durably in the relevant PR and source-of-truth files.
- Continue safe implementation without founder interruption where no genuine decision is required.

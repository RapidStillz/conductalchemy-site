# Conduct Alchemy — Current State

Status: ACTIVE PRODUCTION / FOUNDER GATE  
Last updated: 2026-07-25  
Authoritative repository: `RapidStillz/conductalchemy-site`

## Corrected programme position

Conduct Alchemy is the wider music and creative brand: distinctive songs, storytelling, artists, audiences, original properties, experimentation and commercially useful pathways, including licensing. It must not be narrowed into a licensing-first business.

The brand and product work were not lost. Canonical guidance, official assets, implementation rules, licensing delivery, automated QA and the first Studio OS runtime are already present in GitHub history and active branches. Development must inherit this work rather than restart it.

## Existing canon and implementation

The active licensing branch contains the current Conduct Alchemy references and approved web-ready asset paths:

- `docs/CONDUCT_ALCHEMY_CURRENT_OBJECTIVE_AND_ACCEPTANCE_GATES.md`
- `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md`
- `docs/CONDUCT_ALCHEMY_WEB_APP_VISUAL_SYSTEM.md`
- `docs/CONDUCT_ALCHEMY_ASSET_REGISTER.md`
- `docs/CONDUCT_ALCHEMY_LOGO_ASSET_MANIFEST.json`
- `docs/CODEX_REPLACE_CSS_LOGO_WITH_OFFICIAL_ASSETS.md`
- `public/brand/conduct-alchemy/`

Current approved implementation direction:

- Display/editorial: Cormorant Garamond.
- UI/body: IBM Plex Sans.
- Palette: `#050505`, `#1F2120`, `#70736F`, `#A2A39E`, `#EDE9E3`, `#F7F5F0`, `#D4A24A`.
- Premium editorial, archival, apothecary and Le Labo-influenced visual language.
- Dark Mode for immersive discovery; Artifact Mode for considered review.
- Official logo and motif only; no CSS reconstruction, lookalike or AI-generated replacement.

Founder feedback and the current-objective document take precedence over older copy that described Conduct Alchemy as a premium licensing house.

## Studio OS status

The Studio OS bootstrap is merged into `main`; it is not merely planned. It includes:

- Cloudflare Worker API and D1 database integration.
- Project, asset, decision, knowledge and relationship records.
- Event and activity audit trail.
- Founder Dashboard and Decision Centre.
- Automated validation and controlled deployment workflows.
- Seeded Conduct Alchemy project, We Were Something asset, founder decision and the canon safeguard that Conduct Alchemy is not licensing-first.

This existing runtime is the foundation for autonomous coordination and organisational memory. Future work should extend it rather than propose a replacement architecture.

## Active delivery lanes

### PR #1 — Licensing

Branch: `feat/licensing-premium-conversion`  
State: `READY FOR FOUNDER VISUAL REVIEW` / not approved for merge.

Verified work includes desktop/mobile rendering, Artifact Mode, approved asset use, live Worker form submission, legacy payload compatibility, lead visibility, admin status/value mutation, cleanup and automated browser diagnostics. The remaining gate is Ash's visual/product judgement.

### PR #2 — Canonical homepage lane

Branch: `feat/homepage-premium-build`  
State: draft, intentionally stacked behind PR #1.

This is the clean homepage lane that reuses the approved Conduct Alchemy assets and Dark/Artifact experience model. Once PR #1 is approved and merged, refresh this branch against final `main`, rerun validation and preview QA, then continue product/visual refinement.

### PR #5 — Non-canonical homepage experiment

Branch: `ca-homepage-v1`  
State: open but must not be merged in its current form.

It introduced an invented `CA` orbit/monogram, substitute typography, purple visual system and improvised identity. It conflicts with the approved canon and is superseded as a production direction unless deliberately rebuilt using canonical assets and founder-approved product decisions.

## Immediate executable backlog

1. Maintain PR #1 at the founder gate without further strategic drift or unnecessary rebuilding.
2. Prepare the canonical homepage lane for refresh against `main`; do not use PR #5's invented identity.
3. Consolidate the current brand/objective/asset documents from the licensing branch into the authoritative main-branch startup structure after the licensing merge, preserving history and founder-feedback precedence.
4. Extend Studio OS startup retrieval so new agents automatically surface current objectives, canon, active PR sequencing and founder gates.
5. Continue the We Were Something autonomous-production proof through the existing Studio OS project/asset/decision model whenever the founder gate is not required.
6. Record Food for Thought items through the knowledge/decision workflow rather than rebuilding or silently reprioritising the programme.

## Zero-idle rule

A founder gate blocks only the dependent action. It does not stop the organisation. While PR #1 awaits founder approval, work may continue on non-conflicting tasks such as runtime hardening, canon indexing, asset traceability, production-proof preparation and branch audit. No agent should stop merely because one lane is awaiting review.

## Release rule

No Conduct Alchemy artefact is approved unless:

- it declares the canonical inputs it inherits;
- it reflects current founder feedback;
- it uses the approved logo, motif, typography and palette;
- it passes current-head technical and deployed-product checks;
- it has not silently reframed Conduct Alchemy as licensing-first; and
- founder approval is explicitly recorded where required.
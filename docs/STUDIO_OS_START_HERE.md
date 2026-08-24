# Studio OS — Start Here

Status: ACTIVE GOVERNANCE AND RUNTIME ENTRY POINT  
Owner: Ash / RapidStillz  
Repository: `RapidStillz/conductalchemy-site`

## Mandatory startup protocol

Before any person, agent, new conversation or automation proposes or produces work for Conduct Alchemy, RapidStillz or Studio OS, it must:

1. Read this file and the relevant current-objective/current-state record.
2. Load inherited canon, founder feedback, approved assets and active decisions before proposing change.
3. Inspect the existing Studio OS project, asset, decision, knowledge and activity records.
4. Read `studio-os/component-registry.json` before proposing a new external tool, model, framework or agent component.
5. Continue the highest-priority unblocked production task; do not restart planning already completed.
6. Do not reopen, replace or reinterpret approved decisions without an explicit change request.
7. Record material decisions, evidence, assets, component evaluations and status changes back into GitHub and Studio OS.
8. Run the drift gate and component-governance gate before presenting, publishing, deploying or merging work.

## Existing Studio OS runtime — already implemented

Studio OS is not a new proposal. The first working vertical slice is merged under `studio-os/` and includes:

- `studio-os/src/worker.ts` — founder-authenticated Cloudflare Worker API.
- `studio-os/src/domain.ts` — shared project, asset, decision, knowledge, relationship and event contracts.
- `studio-os/migrations/0001_core.sql` — D1 schema for projects, assets, decisions, knowledge, relationships, events and activity audit.
- `studio-os/migrations/0002_conduct_alchemy_seed.sql` — Conduct Alchemy, We Were Something, founder-decision and canon seed records.
- `studio-os/dashboard/` — Founder Dashboard and Decision Centre.
- `studio-os/component-registry.json` — governed register for external candidate components and their due-diligence/test/adoption status.
- `studio-os/scripts/validate-components.mjs` — CI-enforced component governance gate; unverified candidates cannot silently become adopted infrastructure.
- `.github/workflows/studio-os-validate.yml` — automated runtime validation.
- `.github/workflows/studio-os-deploy.yml` — controlled Cloudflare development deployment.
- Cloudflare Worker: `rapidstillz-studio-os-api`.
- D1 binding: `STUDIO_OS_DB`; development database: `studio-os-dev`.

Do not describe these systems as missing or redesign them from first principles. Extend and harden the existing implementation.

## Candidate-component operating rule

External discoveries are not automatically part of Studio OS. Every candidate must pass the following lifecycle:

`discovered -> due_diligence -> approved_for_test -> testing -> adopted | parked | rejected | superseded`

A discussion, social-media post, README or recommendation is not integration evidence.

Before a component may become `adopted`, Studio OS requires:

- canonical source verified;
- license and commercial-use implications verified;
- capability gap stated so duplication is visible;
- security/privacy review completed for the intended deployment mode;
- zero/free/paid cost path recorded;
- controlled test against a real Studio OS/CA/RS task;
- acceptance criteria met;
- rollback/replacement path documented;
- tangible integration evidence such as committed adapter/config/test/output/receipt;
- owner assigned.

AGPL/copyleft code must not be copied into a proprietary/networked commercial Studio OS component merely because its architecture is useful. Architecture and behaviour may be studied; code adoption requires an explicit licensing decision.

Prefer adapters and replaceable capability interfaces. Studio OS owns project truth, governance, evidence, rights, routing and quality criteria; providers/models/editors remain replaceable workers.

## Conduct Alchemy canonical references

For current Conduct Alchemy website and product work, retrieve these records from the active licensing branch until they are deliberately consolidated into main:

- `docs/CONDUCT_ALCHEMY_CURRENT_OBJECTIVE_AND_ACCEPTANCE_GATES.md`
- `docs/CONDUCT_ALCHEMY_BRAND_SOURCE_OF_TRUTH.md`
- `docs/CONDUCT_ALCHEMY_WEB_APP_VISUAL_SYSTEM.md`
- `docs/CONDUCT_ALCHEMY_ASSET_REGISTER.md`
- `docs/CONDUCT_ALCHEMY_LOGO_ASSET_MANIFEST.json`
- `docs/CODEX_REPLACE_CSS_LOGO_WITH_OFFICIAL_ASSETS.md`
- `public/brand/conduct-alchemy/`

Approved implementation direction includes:

- Cormorant Garamond for display/editorial typography.
- IBM Plex Sans for UI/body typography.
- Graphite, charcoal, paper, soft-white and restrained amber palette.
- Premium editorial, apothecary and Le Labo-influenced art direction.
- Dark Mode for immersion and Artifact Mode for review and clarity.
- Approved logo and motif assets only; no CSS or AI recreation.

Founder feedback and the current-objective document override stale draft wording where conflicts exist.

## Current production lanes

1. **Licensing PR #1** — technically and operationally green; awaiting founder visual/product approval. It must not be merged without Ash's approval.
2. **Homepage PR #2** — the clean stacked homepage lane using approved assets; refresh against final `main` after PR #1 is approved and merged.
3. **Homepage PR #5** — contains a separately invented identity treatment and must not be treated as canonical or merged in its current form.
4. **Studio OS runtime** — merged and operational as a development vertical slice; continue hardening rather than re-planning.
5. **We Were Something** — retained as the flagship autonomous creative-production proof and the default controlled benchmark for video-production candidates where practical.

## Non-negotiable operating rules

- Conduct Alchemy is a wider music and creative brand; licensing is one capability, not its defining identity.
- Approved canon is inherited, not recreated.
- Research from Food for Thought must be evaluated and recorded as rejected, parked, tested, adopted or superseded before changing production.
- Candidate-component research must become a registry status plus evidence; "could be useful" is not an end state.
- Work continues in coherent batches until a genuine approval, external access, missing source asset or consequential decision blocks it.
- When one task is blocked, pull the next unblocked task from the active backlog.
- Technical success, deployment or screenshots do not equal founder approval.
- No visual is founder-ready unless the exact approved logo treatment, motif, typography, palette and prior corrections have been checked on the deployed result.
- An agent saying work is complete is not proof. Completion requires inspectable evidence appropriate to the task: committed code, tests, logs, receipts, hashes, deployed output, generated files or equivalent.

## Drift gate

Before release, confirm:

- The current objective and founder feedback were loaded.
- Canonical assets were used rather than approximated.
- No approved decision was silently reopened.
- No existing system or asset was unnecessarily rebuilt.
- Positioning remains creative-first and not licensing-first.
- Current-head validation and deployment evidence exist.
- Product approval is not being inferred from technical evidence.
- New decisions and status have been written back to the organisational record.
- Any external component used is present in `studio-os/component-registry.json` at the correct evidence-backed status.
- No component is being described as integrated unless tangible integration evidence exists.

If any answer is no, the artefact is not release-ready.

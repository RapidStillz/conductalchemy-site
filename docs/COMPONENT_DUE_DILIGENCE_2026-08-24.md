# Studio OS Component Due Diligence — 24 Aug 2026

Status: ACTIVE DECISION RECORD  
Scope: candidate components surfaced through recent research and social discovery  
Rule: discussion is not adoption; adoption requires evidence.

## Verified in this pass

### HyperFrames — APPROVED FOR CONTROLLED TEST
Canonical source: https://github.com/heygen-com/hyperframes  
License: Apache-2.0  
Observed current characteristics: agent-oriented HTML/CSS/media-to-video rendering; CLI, lint/check/preview/render workflow; deterministic frame capture; FFmpeg-based production; active releases in Aug 2026; no per-render commercial threshold in the open-source core.

Decision: Treat as the strongest current candidate for the deterministic composition/render layer. Keep behind a Studio OS capability adapter so the project does not depend on HyperFrames-specific project format.

### Kinocut — APPROVED FOR CONTROLLED TEST
Canonical source: https://github.com/KyaniteLabs/kinocut  
License: Apache-2.0  
Observed current characteristics: local-first FFmpeg editing; MCP/Python/CLI surfaces; typed tools; preflight validation; quality gates; Video Receipts; current published release documented in Aug 2026.

Decision: Treat as the strongest current candidate for agent editing/QC/provenance. The Video Receipt pattern is adopted immediately as a Studio OS architectural principle, but Kinocut itself is not marked adopted until a real CA/RS edit passes the acceptance gate.

### OpenMontage — APPROVED FOR BLACK-BOX / ARCHITECTURE TEST ONLY
Canonical source: https://github.com/calesthio/OpenMontage  
License: GNU AGPLv3  
Observed current characteristics: pipeline manifests, stage director skills, checkpoints, provider/tool integrations, contract tests and agent-production concepts. Project is active but has a large, fast-moving PR/issue surface.

Decision: High-value architecture reference, but do not copy/incorporate AGPL code into a proprietary/networked commercial Studio OS path without an explicit licensing decision. Use it to benchmark workflow behaviour, recovery, checkpoints and approval patterns.

### MoneyPrinterTurbo — APPROVED FOR SPECIALIST TEST
Canonical source: https://github.com/harry0703/MoneyPrinterTurbo  
License: MIT  
Observed current characteristics: automated topic/keyword-to-short-video workflow; active open-source project; permissive license. External providers and media sources can introduce cost and rights constraints.

Decision: Test as a specialist CA social/RS explainer automation path, not as the flagship cinematic film engine.

## Not promoted to adoption in this pass

### OpenVid
Status: DUE DILIGENCE. Useful-looking presentation/post layer, but canonical licensing and current dependency assumptions must be reverified before adoption.

### Donkey Cut
Status: DUE DILIGENCE. Potential human-friendly AI editor; verify canonical repository, license, local/free boundaries and overlap with Kinocut/HyperFrames before spending integration effort.

### JoyAI-Video-Edit
Status: PARKED. Technically promising for generative repair/transformation, but current practical compute requirements and zero-cost execution route make it unsuitable for immediate operational integration. Reopen when a viable compute route is proven.

### TencentDB Agent Memory
Status: DUE DILIGENCE. Do not replace the existing D1/GitHub canon with an unverified memory framework. Official source, license, provenance semantics, update/delete behaviour and recovery characteristics must be established first.

## Architecture changes adopted now

The research has produced four platform changes that do not require binding Studio OS to a third-party implementation:

1. **Provider-agnostic capability contract** — models, editors, renderers and memory systems are replaceable workers rather than sources of project truth.
2. **Execution Receipt** — an agent's statement that work is done is not completion evidence. Every consequential execution can record inputs, outputs, evidence, cost, QC and reproducibility metadata.
3. **Component lifecycle** — `discovered -> due_diligence -> approved_for_test -> testing -> adopted | parked | rejected | superseded`.
4. **CI adoption gate** — unverified-license candidates cannot silently be marked adopted, and adopted candidates require test/security/integration/rollback evidence.

These changes are implemented in:

- `studio-os/component-registry.json`
- `studio-os/scripts/validate-components.mjs`
- `studio-os/src/domain.ts`
- `studio-os/migrations/0003_governed_components.sql`
- `.github/workflows/studio-os-validate.yml`
- `docs/STUDIO_OS_START_HERE.md`

## First controlled production benchmark

Default benchmark: **We Were Something** proof sequence where practical.

Test order:

1. HyperFrames — deterministic 10–15s composition/render from existing approved assets; no paid generation required.
2. Kinocut — same asset package through trim/assembly/audio/QC; require a failing QC test plus a valid receipt.
3. Compare overlap: retain both only if each has a distinct operational role.
4. OpenMontage — black-box checkpoint/recovery benchmark; extract behaviours and interface lessons, not AGPL code.
5. MoneyPrinterTurbo — separate low-cost CA/RS social/explainer test.

No candidate is to be called "integrated" until committed integration evidence and a successful execution receipt exist.

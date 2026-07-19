# Studio OS Bootstrap v1

This directory contains the first working Studio OS vertical slice inside the existing Conduct Alchemy repository.

## Included

- Cloudflare D1 schema for projects, assets, decisions, knowledge, relationships, events and audit activity.
- Shared TypeScript domain contracts.
- Cloudflare Worker API with:
  - `GET /api/health`
  - `GET /api/projects`
  - `POST /api/projects`
  - `POST /api/assets`
- Founder-token authentication.
- Event and audit records created alongside core writes.

## Safe deployment sequence

1. Copy `wrangler.toml.example` to `wrangler.toml` locally.
2. Create a dedicated development D1 database.
3. Replace the placeholder database ID.
4. Run the migration against development only.
5. Add `FOUNDER_TOKEN` through `wrangler secret put FOUNDER_TOKEN`.
6. Deploy the Worker to a development URL.
7. Verify `/api/health`, then create a project and asset.
8. Connect the React founder interface only after the API smoke test passes.

## First proof

The initial acceptance path is:

1. Create the Conduct Alchemy project.
2. Create the `We Were Something` song asset linked to it.
3. Confirm both records are persisted.
4. Confirm corresponding events and audit activity exist.
5. Display those records in the Founder Dashboard.

## Safety notes

- No production Cloudflare resource is referenced by these files.
- No secret is committed.
- Existing Conduct Alchemy routes and deployment files are untouched.
- The branch is intended for review and smoke testing before merge.

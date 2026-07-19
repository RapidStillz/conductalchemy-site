-- Idempotent development seed for the first Studio OS vertical slice.

INSERT OR IGNORE INTO projects
(id, human_id, title, summary, status, health, owner_id, priority, created_at, updated_at)
VALUES
('project-conduct-alchemy', 'PRJ-CA-001', 'Conduct Alchemy',
 'Creative music brand, catalogue, artist development and experimentation platform. Licensing is one capability, not the defining purpose.',
 'active', 'attention', 'founder', 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO assets
(id, human_id, project_id, asset_type, title, summary, status, version, owner_id, created_at, updated_at)
VALUES
('asset-we-were-something', 'AST-WWS-001', 'project-conduct-alchemy', 'song', 'We Were Something',
 'Flagship proof-of-concept track and autonomous music-video production test. Core emotional premise: We did not fail — we just ended.',
 'active', 1, 'founder', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO decisions
(id, human_id, title, decision, rationale, status, owner_id, review_date, created_at, updated_at)
VALUES
('decision-video-poc', 'DEC-CA-001', 'Confirm first autonomous video smoke test',
 'Approve one representative scene from We Were Something as the first visible Studio OS creative-production proof.',
 'A small but complete scene proves the production workflow before committing resources to the full music video.',
 'open', 'founder', NULL, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO knowledge
(id, human_id, title, summary, knowledge_type, confidence, status, owner_id, review_date, created_at, updated_at)
VALUES
('knowledge-ca-purpose', 'KNW-CA-001', 'Conduct Alchemy is not licensing-first',
 'Conduct Alchemy is a broader creative brand and catalogue ecosystem. Licensing remains commercially useful but must not displace music, culture, experimentation, artist development, community or the autonomous video proof objective.',
 'canon', 'fact', 'validated', 'founder', NULL, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO relationships
(id, source_type, source_id, relationship_type, target_type, target_id, confidence, notes, created_at, updated_at)
VALUES
('rel-ca-wws', 'project', 'project-conduct-alchemy', 'contains', 'asset', 'asset-we-were-something', 1,
 'We Were Something is the first flagship production asset tracked by Studio OS.', datetime('now'), datetime('now')),
('rel-wws-decision', 'asset', 'asset-we-were-something', 'requires', 'decision', 'decision-video-poc', 1,
 'The production smoke test is waiting for explicit founder confirmation.', datetime('now'), datetime('now')),
('rel-ca-canon', 'project', 'project-conduct-alchemy', 'governed_by', 'knowledge', 'knowledge-ca-purpose', 1,
 'Protects the programme from drifting back to a licensing-first strategy.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO activity_log
(id, actor_id, action, entity_type, entity_id, reason, after_json, created_at)
VALUES
('activity-ca-seed', 'studio-os', 'PROJECT_SEEDED', 'project', 'project-conduct-alchemy',
 'Conduct Alchemy starter workspace created', '{}', datetime('now')),
('activity-wws-seed', 'studio-os', 'ASSET_SEEDED', 'asset', 'asset-we-were-something',
 'We Were Something registered as the first creative production proof', '{}', datetime('now'));

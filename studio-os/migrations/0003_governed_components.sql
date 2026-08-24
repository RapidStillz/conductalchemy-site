PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS component_evaluations (
  id TEXT PRIMARY KEY,
  component_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  canonical_source TEXT NOT NULL,
  license TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('discovered','due_diligence','approved_for_test','testing','adopted','parked','rejected','superseded')),
  capability_gap TEXT NOT NULL,
  cost_position TEXT NOT NULL,
  risk_json TEXT NOT NULL DEFAULT '[]',
  acceptance_json TEXT NOT NULL DEFAULT '[]',
  security_evidence TEXT,
  test_evidence TEXT,
  integration_evidence TEXT,
  rollback_plan TEXT,
  owner_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(component_id)
);

CREATE TABLE IF NOT EXISTS execution_receipts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  component_id TEXT NOT NULL,
  capability TEXT NOT NULL,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('succeeded','failed','blocked','rejected')),
  input_refs_json TEXT NOT NULL DEFAULT '[]',
  output_refs_json TEXT NOT NULL DEFAULT '[]',
  evidence_refs_json TEXT NOT NULL DEFAULT '[]',
  cost_usd REAL NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  paid_call_approved_by_founder INTEGER NOT NULL DEFAULT 0 CHECK (paid_call_approved_by_founder IN (0,1)),
  reproducibility_json TEXT,
  qc_json TEXT,
  error TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_component_evaluations_status ON component_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_component_evaluations_category ON component_evaluations(category);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_project ON execution_receipts(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_component ON execution_receipts(component_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_outcome ON execution_receipts(outcome, created_at DESC);

export type LifecycleStatus =
  | "draft"
  | "active"
  | "validated"
  | "operational"
  | "retired";

export type HealthStatus = "healthy" | "attention" | "blocked";
export type Confidence = "fact" | "validated" | "hypothesis" | "speculation";
export type DecisionStatus = "open" | "confirmed" | "reversed" | "superseded";

export type ComponentStatus =
  | "discovered"
  | "due_diligence"
  | "approved_for_test"
  | "testing"
  | "adopted"
  | "parked"
  | "rejected"
  | "superseded";

export type CapabilityKind =
  | "reasoning"
  | "memory"
  | "research"
  | "image_generation"
  | "video_generation"
  | "video_transformation"
  | "video_editing"
  | "video_rendering"
  | "audio"
  | "publishing"
  | "measurement"
  | "other";

export interface BaseRecord {
  id: string;
  humanId: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends BaseRecord {
  summary: string;
  status: LifecycleStatus;
  health: HealthStatus;
  priority: 1 | 2 | 3 | 4 | 5;
  archivedAt?: string | null;
}

export interface Asset extends BaseRecord {
  projectId?: string | null;
  assetType: string;
  summary: string;
  status: LifecycleStatus;
  version: number;
  archivedAt?: string | null;
}

export interface Decision extends BaseRecord {
  decision: string;
  rationale: string;
  status: DecisionStatus;
  reviewDate?: string | null;
}

export type KnowledgeType =
  | "best_practice"
  | "lesson"
  | "research"
  | "standard"
  | "canon"
  | "pattern"
  | "observation"
  | "faq";

export interface Knowledge extends BaseRecord {
  summary: string;
  knowledgeType: KnowledgeType;
  confidence: Confidence;
  status: "draft" | "active" | "validated" | "deprecated" | "superseded";
  reviewDate?: string | null;
}

export interface Relationship {
  id: string;
  sourceType: string;
  sourceId: string;
  relationshipType: string;
  targetType: string;
  targetId: string;
  confidence: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Provider-agnostic contract used by Studio OS to avoid coupling a workflow to
 * one model, editor, renderer or SaaS. External candidates implement a
 * capability; Studio OS retains project truth, governance and routing.
 */
export interface CapabilityProvider {
  componentId: string;
  capability: CapabilityKind;
  enabled: boolean;
  zeroCostPath: boolean;
  requiresFounderApprovalForPaidCalls: boolean;
  supportsDeterministicReplay?: boolean;
  notes?: string;
}

export type ExecutionOutcome = "succeeded" | "failed" | "blocked" | "rejected";

/**
 * Evidence record for real execution. Agent narration is not completion proof.
 * A successful production step must point to inspectable artefacts/logs/tests.
 */
export interface ExecutionReceipt {
  id: string;
  projectId: string;
  componentId: string;
  capability: CapabilityKind;
  action: string;
  outcome: ExecutionOutcome;
  startedAt: string;
  finishedAt: string;
  inputRefs: string[];
  outputRefs: string[];
  evidenceRefs: string[];
  costUsd: number;
  paidCallApprovedByFounder: boolean;
  reproducibility?: {
    command?: string;
    configRef?: string;
    inputHash?: string;
    outputHash?: string;
  };
  qc?: {
    passed: boolean;
    checks: string[];
    notes?: string;
  };
  error?: string;
}

export const EVENT_TYPES = [
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "ASSET_CREATED",
  "ASSET_UPDATED",
  "DECISION_CREATED",
  "DECISION_APPROVED",
  "KNOWLEDGE_ADDED",
  "RELATIONSHIP_CREATED",
  "FOUNDER_APPROVAL_REQUIRED",
  "COMPONENT_EVALUATED",
  "COMPONENT_TEST_STARTED",
  "COMPONENT_TEST_COMPLETED",
  "COMPONENT_ADOPTED",
  "EXECUTION_RECEIPT_RECORDED",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface StudioEvent<TPayload = Record<string, unknown>> {
  id: string;
  eventType: EventType;
  entityType: string;
  entityId: string;
  actorId: string;
  correlationId?: string | null;
  payload: TPayload;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export type LifecycleStatus =
  | "draft"
  | "active"
  | "validated"
  | "operational"
  | "retired";

export type HealthStatus = "healthy" | "attention" | "blocked";
export type Confidence = "fact" | "validated" | "hypothesis" | "speculation";
export type DecisionStatus = "open" | "confirmed" | "reversed" | "superseded";

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

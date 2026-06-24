export type MemoryScope = "department" | "personal";

export type MemoryType = "risk_case" | "rule" | "personal_experience";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface RiskMemory {
  id: string;
  title: string;
  memoryType: MemoryType;
  scope: MemoryScope;
  rawText: string;
  summary: string;
  riskType: string;
  scene: string;
  triggerSignal: string;
  rootCause: string;
  decisionBasis: string[];
  solutionPath: string[];
  preventionChecklist: string[];
  relatedModules: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  confidenceScore: number;
}

export interface GraphEntity {
  id: string;
  memoryId: string;
  name: string;
  type:
    | "risk_event"
    | "risk_type"
    | "root_cause"
    | "system_module"
    | "action"
    | "signal"
    | "rule"
    | "evidence"
    | "person"
    | "page";
}

export interface GraphRelation {
  id: string;
  memoryId: string;
  source: string;
  relation: string;
  target: string;
  evidenceText: string;
}

export interface QALog {
  id: string;
  question: string;
  answer: string;
  agentType: "department" | "personal";
  citedMemoryIds: string[];
  matchedRelations: GraphRelation[];
  confidence: ConfidenceLevel;
  nextActions: string[];
  createdAt: string;
}

export interface RiskGraphDB {
  memories: RiskMemory[];
  entities: GraphEntity[];
  relations: GraphRelation[];
  qaLogs: QALog[];
}

export interface StructuredMemoryBundle {
  memory: RiskMemory;
  entities: GraphEntity[];
  relations: GraphRelation[];
  usedFallback?: boolean;
}

export interface CitedMemory {
  id: string;
  title: string;
  summary: string;
  riskType: string;
  scope: MemoryScope;
}

export interface AgentAskResponse {
  answer: string;
  citedMemories: CitedMemory[];
  matchedRelations: GraphRelation[];
  confidence: ConfidenceLevel;
  nextActions: string[];
  usedFallback?: boolean;
}

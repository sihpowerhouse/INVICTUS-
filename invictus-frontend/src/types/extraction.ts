export type EntityType = 'NAME' | 'LOCATION' | 'DATE';

export interface DocumentEntity {
  id: string;
  type: EntityType;
  text: string;
  start?: number;
  end?: number;
  confidence: number;
  source: string;
}

export type ExtractionStatus = 'NOT STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REQUIRES REVIEW';

export interface ProcessingTimelineEvent {
  step: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  timestamp?: string;
}

export interface ExtractedIntelligence {
  documentId: string;
  status: ExtractionStatus;
  method: string;
  provider: string;
  model: string;
  confidence: number | null; // e.g. 95 (percentage) or null if unavailable
  text: string;
  entities: DocumentEntity[];
  timeline: ProcessingTimelineEvent[];
}

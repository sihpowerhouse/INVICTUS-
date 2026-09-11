export type SearchMode = 'KEYWORD' | 'SEMANTIC' | 'HYBRID';

export interface SearchResult {
  id: string;
  title: string;
  sourceType: 'DOCUMENT' | 'EVIDENCE' | 'MEDIA' | 'CASE';
  caseId: string;
  excerpt: string;
  relevanceScore: number;
  date: string;
  status: string;
  page?: number;
  lines?: string;
  isAuthorized: boolean;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  version: number;
  page: number;
  startLine: number;
  endLine: number;
  excerpt: string;
}

export interface EvidenceBasis {
  totalSources: number;
  documentCount: number;
  mediaCount: number;
  evidenceCount: number;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AIAnswer {
  id: string;
  question: string;
  answer: string;
  basis: EvidenceBasis;
  citations: Citation[];
  status: 'SUCCESS' | 'INSUFFICIENT_EVIDENCE' | 'UNAUTHORIZED';
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  event: string;
  sourceType: 'CASE' | 'DOCUMENT' | 'EVIDENCE' | 'MEDIA';
  sourceId: string;
  sourceName: string;
  caseId: string;
}

export type EntityType = 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'VEHICLE' | 'DOCUMENT';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  relatedIds: string[];
}

export type InconsistencyType = 'INCIDENT DATE' | 'LOCATION CONFLICT' | 'CLAIM DIFFERENCE' | 'TIMELINE CONFLICT';

export interface InconsistencySource {
  sourceId: string;
  sourceName: string;
  value: string;
}

export interface PotentialInconsistency {
  id: string;
  caseId: string;
  type: InconsistencyType;
  sourceA: InconsistencySource;
  sourceB: InconsistencySource;
  description: string;
}

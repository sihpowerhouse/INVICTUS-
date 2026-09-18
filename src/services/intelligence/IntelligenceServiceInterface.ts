import type { 
  SearchResult, AIAnswer, TimelineEvent, Entity, PotentialInconsistency, SearchMode 
} from '../../types/intelligence';

export interface IIntelligenceService {
  search(query: string, filters: any, mode: SearchMode): Promise<SearchResult[]>;
  getCaseAnswer(question: string, caseId?: string): Promise<AIAnswer>;
  getDocumentAnswer(question: string, versionId: string): Promise<AIAnswer>;
  getTimeline(caseId?: string): Promise<TimelineEvent[]>;
  getEntities(caseId?: string): Promise<Entity[]>;
  getInconsistencies(caseId?: string): Promise<PotentialInconsistency[]>;
}

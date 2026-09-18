import type { IIntelligenceService } from './IntelligenceServiceInterface';
import type { 
  SearchResult, AIAnswer, TimelineEvent, Entity, PotentialInconsistency, SearchMode, Citation 
} from '../../types/intelligence';
import { request } from '../api/apiClient';

export class ApiIntelligenceAdapter implements IIntelligenceService {
  async search(_query: string, _filters: any, _mode: SearchMode): Promise<SearchResult[]> {
    // Search is not yet integrated with the real backend.
    throw new Error('Search is not yet implemented on the real backend.');
  }

  async getCaseAnswer(question: string, caseId?: string): Promise<AIAnswer> {
    if (!caseId) {
      throw new Error('Case ID is required for AI chat.');
    }

    try {
      const response = await request<{
        answer: string;
        sources: Array<{
          page?: number;
          document_id?: string;
          version_id?: string;
          chunk_index?: number;
        }>;
        provider: string;
        context_chunks: number;
        latency_ms: number;
      }>('/case/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          case_id: caseId,
          question: question
        })
      });

      const isInsufficient = response.answer.includes('I could not find that information') || 
                             response.answer.includes('No processed document content is available') ||
                             response.answer.includes('still processing');
      
      const citations: Citation[] = response.sources.map((src: any, index: number) => ({
        id: `cit-${index}-${src.version_id || 'unknown'}`,
        documentId: src.document_id || 'Unknown',
        versionId: src.version_id,
        page: src.page,
        chunkIndex: src.chunk_index,
      }));

      return {
        id: `ans-${Date.now()}`,
        question,
        answer: response.answer,
        status: isInsufficient ? 'INSUFFICIENT_EVIDENCE' : 'SUCCESS',
        provider: response.provider,
        contextChunks: response.context_chunks,
        latencyMs: response.latency_ms,
        citations,
        basis: {
          totalSources: citations.length,
          documentCount: citations.length, // approximation since sources may share docs
          mediaCount: 0,
          evidenceCount: 0,
          relevance: 'HIGH'
        }
      };

    } catch (error: any) {
      if (error.status === 403 || error.status === 401) {
        return {
          id: `err-${Date.now()}`,
          question,
          answer: error.message || 'Access Denied',
          status: 'UNAUTHORIZED',
          citations: [],
          basis: { totalSources: 0, documentCount: 0, mediaCount: 0, evidenceCount: 0, relevance: 'LOW' }
        };
      }
      throw error;
    }
  }

  async getTimeline(_caseId: string): Promise<TimelineEvent[]> {
    throw new Error('Timeline is not yet implemented on the real backend.');
  }

  async getEntities(_caseId: string): Promise<Entity[]> {
    throw new Error('Entities are not yet implemented on the real backend.');
  }

  async getInconsistencies(_caseId: string): Promise<PotentialInconsistency[]> {
    throw new Error('Inconsistencies are not yet implemented on the real backend.');
  }
}

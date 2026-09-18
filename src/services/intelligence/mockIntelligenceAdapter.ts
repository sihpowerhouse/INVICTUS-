import type { IIntelligenceService } from './IntelligenceServiceInterface';
import type { 
  SearchResult, AIAnswer, TimelineEvent, Entity, PotentialInconsistency, SearchMode 
} from '../../types/intelligence';
import { 
  mockSearchResults, mockAnswers, mockTimeline, mockEntities, mockInconsistencies 
} from '../../mock/intelligence';

export class MockIntelligenceAdapter implements IIntelligenceService {
  async search(query: string, _filters: any, _mode: SearchMode): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!query.trim()) return [];
    return [...mockSearchResults];
  }

  async getCaseAnswer(question: string, _caseId?: string): Promise<AIAnswer> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('financial') || lowerQ.includes('money')) {
      return mockAnswers['insufficient'];
    }
    if (lowerQ.includes('informant') || lowerQ.includes('classified')) {
      return mockAnswers['unauthorized'];
    }
    return mockAnswers['default'];
  }

  async getDocumentAnswer(question: string, versionId: string): Promise<AIAnswer> {
    // For VITE_USE_MOCK_DATA=true, just simulate a successful generic response or error.
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      id: `ans-mock-${Date.now()}`,
      question,
      answer: `This is a mock answer for document version ${versionId}. Real mock data is not permitted by user instructions.`,
      status: 'SUCCESS',
      provider: 'mock',
      contextChunks: 1,
      latencyMs: 1200,
      citations: [],
      basis: {
        totalSources: 0, documentCount: 0, mediaCount: 0, evidenceCount: 0, relevance: 'HIGH'
      }
    };
  }

  async getTimeline(_caseId?: string): Promise<TimelineEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockTimeline];
  }

  async getEntities(_caseId?: string): Promise<Entity[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockEntities];
  }

  async getInconsistencies(_caseId?: string): Promise<PotentialInconsistency[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockInconsistencies];
  }
}

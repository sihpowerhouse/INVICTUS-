import type { 
  SearchResult, AIAnswer, TimelineEvent, Entity, PotentialInconsistency, SearchMode 
} from '../types/intelligence';
import { 
  mockSearchResults, mockAnswers, mockTimeline, mockEntities, mockInconsistencies 
} from '../mock/intelligence';

class IntelligenceService {
  async search(query: string, _filters: any, _mode: SearchMode): Promise<SearchResult[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!query.trim()) return [];
    
    // Simple mock filter: return all results for demo
    return [...mockSearchResults];
  }

  async getCaseAnswer(question: string, _caseId?: string): Promise<AIAnswer> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking time
    
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('financial') || lowerQ.includes('money')) {
      return mockAnswers['insufficient'];
    }
    
    if (lowerQ.includes('informant') || lowerQ.includes('classified')) {
      return mockAnswers['unauthorized'];
    }
    
    return mockAnswers['default'];
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

export const intelligenceService = new IntelligenceService();

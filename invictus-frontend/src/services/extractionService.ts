import type { ExtractedIntelligence, DocumentEntity, ProcessingTimelineEvent } from '../types/extraction';

/**
 * Isolated mock adapter for extraction intelligence.
 * Simulates backend response for forensic document analysis.
 */
class ExtractionService {
  async getIntelligenceForDocument(documentId: string): Promise<ExtractedIntelligence> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEntities: DocumentEntity[] = [
          { id: 'E1', type: 'NAME', text: 'VICTOR REYES', confidence: 96, source: 'NATIVE' },
          { id: 'E2', type: 'LOCATION', text: 'PORT OF SEATTLE', confidence: 92, source: 'NATIVE' },
          { id: 'E3', type: 'DATE', text: 'OCTOBER 12, 2026', confidence: 99, source: 'NATIVE' },
          { id: 'E4', type: 'NAME', text: 'SARAH CHEN', confidence: 88, source: 'NATIVE' },
        ];

        const mockText = `INCIDENT REPORT\n\nOn OCTOBER 12, 2026, operatives observed VICTOR REYES near the cargo terminal at the PORT OF SEATTLE. Surveillance footage confirms the presence of an unidentified secondary individual, later suspected to be SARAH CHEN, exchanging a sealed package. Operative requested immediate forensic review of the manifest.`;

        const mockTimeline: ProcessingTimelineEvent[] = [
          { step: 'DOCUMENT LOADED', status: 'COMPLETED', timestamp: new Date(Date.now() - 5000).toISOString() },
          { step: 'TEXT EXTRACTION', status: 'COMPLETED', timestamp: new Date(Date.now() - 4000).toISOString() },
          { step: 'ENTITY EXTRACTION', status: 'COMPLETED', timestamp: new Date(Date.now() - 2000).toISOString() },
          { step: 'CHUNKING', status: 'COMPLETED', timestamp: new Date(Date.now() - 1000).toISOString() },
          { step: 'INDEXING', status: 'COMPLETED', timestamp: new Date().toISOString() },
        ];

        resolve({
          documentId,
          status: 'COMPLETED',
          method: 'NATIVE TEXT EXTRACTION',
          provider: 'INTERNAL',
          model: 'INVICTUS-NLP-v2',
          confidence: 94,
          text: mockText,
          entities: mockEntities,
          timeline: mockTimeline,
        });
      }, 600);
    });
  }
}

export const extractionService = new ExtractionService();

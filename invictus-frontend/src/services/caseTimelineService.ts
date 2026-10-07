import type { CaseTimelineEvent } from '../types/case';

export interface CaseTimelineFilter {
  query?: string;
  category?: 'ALL' | 'DOCUMENTS' | 'EVIDENCE' | 'MEDIA' | 'ACCESS' | 'AI' | 'SECURITY';
}

class CaseTimelineService {
  private readonly MOCK_DELAY = 600;

  async getTimeline(caseId: string, filter?: CaseTimelineFilter): Promise<CaseTimelineEvent[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate potential failure to ensure error states are tested
        if (caseId === 'FAIL_TEST') {
          return reject(new Error('Timeline retrieval failed'));
        }

        let events = [...mockTimelineEvents];
        
        // Filter by category
        if (filter?.category && filter.category !== 'ALL') {
          events = events.filter(e => this.matchesCategory(e, filter.category!));
        }

        // Search by query
        if (filter?.query) {
          const q = filter.query.toLowerCase();
          events = events.filter(e => 
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            (e.actor && e.actor.toLowerCase().includes(q)) ||
            (e.department && e.department.toLowerCase().includes(q))
          );
        }

        // Sort descending
        events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        resolve(events);
      }, this.MOCK_DELAY);
    });
  }

  private matchesCategory(event: CaseTimelineEvent, category: string): boolean {
    switch (category) {
      case 'DOCUMENTS':
        return event.type.startsWith('DOCUMENT_') || event.type === 'OCR_COMPLETED' || event.type === 'ENTITY_EXTRACTION_COMPLETED' || event.type === 'INDEXING_COMPLETED';
      case 'EVIDENCE':
        return event.type.startsWith('EVIDENCE_');
      case 'MEDIA':
        return event.type.startsWith('MEDIA_');
      case 'ACCESS':
        return event.type.startsWith('ACCESS_') || event.type.startsWith('EXTERNAL_');
      case 'AI':
        return event.type.startsWith('AI_');
      case 'SECURITY':
        return event.type === 'INTEGRITY_CHECKED' || event.type === 'SIGNATURE_CREATED';
      default:
        return true;
    }
  }
}

// Ensure deterministic dates relative to "now"
const now = Date.now();
const hourMs = 60 * 60 * 1000;
const dayMs = 24 * hourMs;

const mockTimelineEvents: CaseTimelineEvent[] = [
  {
    id: 'evt_1',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 10 * 60000).toISOString(), // 10 mins ago
    type: 'AI_QUERY',
    title: 'CASE AI QUERY',
    description: '"What evidence connects the suspect to the warehouse?" -> Answer Generated.',
    actor: 'YASH T',
    actorRole: 'OFFICER',
    department: 'POLICE / INVESTIGATION',
    status: 'SUCCESS',
    severity: 'INFO'
  },
  {
    id: 'evt_2',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 2 * hourMs).toISOString(),
    type: 'DOCUMENT_UPLOADED',
    title: 'DOCUMENT UPLOADED',
    description: 'Forensic_Report_03.pdf uploaded to case files.',
    actor: 'SARAH M',
    actorRole: 'ANALYST',
    department: 'CYBER CRIME',
    resourceId: 'DOC-26190-001',
    resourceType: 'DOCUMENT',
    status: 'SUCCESS',
    severity: 'INFO'
  },
  {
    id: 'evt_3',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 2 * hourMs - 5 * 60000).toISOString(),
    type: 'INDEXING_COMPLETED',
    title: 'DOCUMENT INDEXED',
    description: 'OCR + entity extraction completed. Available to Case AI.',
    resourceId: 'DOC-26190-001',
    resourceType: 'DOCUMENT',
    status: 'SUCCESS',
    severity: 'INFO'
  },
  {
    id: 'evt_4',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 25 * hourMs).toISOString(),
    type: 'EXTERNAL_DOCUMENT_VIEWED',
    title: 'EXTERNAL DOCUMENT VIEW',
    description: 'WITNESS_STATEMENT_MARCUS.docx viewed via external portal.',
    actor: 'lawyer@example.com',
    actorRole: 'EXTERNAL_PARTICIPANT',
    resourceId: 'DOC-26190-002',
    resourceType: 'DOCUMENT',
    status: 'SUCCESS',
    severity: 'WARNING'
  },
  {
    id: 'evt_5',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 2 * dayMs).toISOString(),
    type: 'ACCESS_GRANTED',
    title: 'ACCESS GRANTED',
    description: 'External participant lawyer@example.com granted READ ONLY access.',
    actor: 'YASH T',
    actorRole: 'OFFICER',
    department: 'POLICE / INVESTIGATION',
    status: 'SUCCESS',
    severity: 'INFO'
  },
  {
    id: 'evt_6',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 3 * dayMs).toISOString(),
    type: 'PROCESSING_FAILED',
    title: 'PROCESSING FAILED',
    description: 'Entity extraction failed on Encrypted_Ledger.pdf. Corrupted file.',
    resourceId: 'DOC-26190-003',
    resourceType: 'DOCUMENT',
    status: 'FAILED',
    severity: 'CRITICAL'
  },
  {
    id: 'evt_7',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 4 * dayMs).toISOString(),
    type: 'INTEGRITY_CHECKED',
    title: 'INTEGRITY VERIFIED',
    description: 'Chain of custody hash verification completed successfully for all evidence.',
    actor: 'SYSTEM',
    department: 'AUTOMATED COMPLIANCE',
    status: 'SUCCESS',
    severity: 'INFO'
  },
  {
    id: 'evt_8',
    caseId: 'CAS-26190',
    timestamp: new Date(now - 10 * dayMs).toISOString(),
    type: 'FIR_CREATED',
    title: 'FIR REGISTERED',
    description: 'Initial First Information Report filed and case instantiated.',
    actor: 'YASH T',
    actorRole: 'OFFICER',
    department: 'POLICE / INVESTIGATION',
    status: 'SUCCESS',
    severity: 'INFO'
  }
];

export const caseTimelineService = new CaseTimelineService();

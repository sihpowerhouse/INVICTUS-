import type { AccessHistoryEvent } from '../types/access';
import type { Document } from '../types/document';

class AccessService {
  async getAccessHistory(_caseId: string): Promise<AccessHistoryEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'H1',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            user: 'commander.vance@police.gov',
            action: 'LOGIN',
            resource: 'SYSTEM',
            result: 'SUCCESS'
          },
          {
            id: 'H2',
            timestamp: new Date(Date.now() - 80000000).toISOString(),
            user: 'commander.vance@police.gov',
            action: 'INVITATION SENT',
            resource: 'lawyer@example.com (2 Documents)',
            result: 'SUCCESS'
          },
          {
            id: 'H3',
            timestamp: new Date(Date.now() - 72000000).toISOString(),
            user: 'lawyer@example.com',
            action: 'REGISTRATION COMPLETED',
            resource: 'PORTAL',
            result: 'SUCCESS'
          },
          {
            id: 'H4',
            timestamp: new Date(Date.now() - 36000000).toISOString(),
            user: 'lawyer@example.com',
            action: 'DOCUMENT VIEWED',
            resource: 'DOC-1234',
            result: 'SUCCESS'
          }
        ]);
      }, 600);
    });
  }

  async getAuthorizedDocuments(): Promise<Document[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Deterministic mock of documents authorized for external user
        resolve([
          {
            id: 'DOC-1234',
            caseId: 'CASE-2026-0042',
            name: 'FIR.pdf',
            type: 'FIR',
            size: '2.0 MB',
            status: 'VERIFIED',
            uploadedBy: 'Commander Vance',
            department: 'Police',
            version: '1.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            language: 'ENG',
            pages: 10
          },
          {
            id: 'DOC-5678',
            caseId: 'CASE-2026-0042',
            name: 'Forensic_Report.pdf',
            type: 'FORENSIC_REPORT',
            size: '5.0 MB',
            status: 'VERIFIED',
            uploadedBy: 'Forensics Dept',
            department: 'Forensics',
            version: '1.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            language: 'ENG',
            pages: 24
          }
        ]);
      }, 500);
    });
  }
}

export const accessService = new AccessService();

import type { ICaseService } from './CaseServiceInterface';
import type { Case } from '../../types/case';
import { mockCases } from '../../mock/cases';

export class MockCaseAdapter implements ICaseService {
  async getCases(): Promise<Case[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockCases]);
      }, 300);
    });
  }

  async getCaseById(id: string): Promise<Case | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockCases.find((c) => c.id === id);
        resolve(found || null);
      }, 300);
    });
  }

  async searchCases(q: string): Promise<Case[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const query = q.toLowerCase();
        const found = mockCases.filter(
          (c) => c.id.toLowerCase().includes(query) || 
                 c.title.toLowerCase().includes(query) || 
                 (c.firNumber?.toLowerCase().includes(query) ?? false)
        );
        resolve(found);
      }, 300);
    });
  }
}

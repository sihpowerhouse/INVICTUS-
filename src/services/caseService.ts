import { mockCases } from '../mock/cases';
import type { Case } from '../types/case';

/**
 * CaseService
 * Provides data access for Case entities.
 * Currently uses local mock data. Designed to be swapped with HTTP calls later.
 */
class CaseService {
  /**
   * Fetch all cases (with optional filtering later).
   */
  async getCases(): Promise<Case[]> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockCases]);
      }, 300);
    });
  }

  /**
   * Fetch a specific case by ID.
   */
  async getCaseById(id: string): Promise<Case | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockCases.find((c) => c.id === id);
        resolve(found || null);
      }, 300);
    });
  }
}

export const caseService = new CaseService();

import type { Case } from '../../types/case';

export interface ICaseService {
  /**
   * Fetch all cases (with optional filtering later).
   */
  getCases(): Promise<Case[]>;

  /**
   * Fetch a specific case by ID.
   */
  getCaseById(id: string): Promise<Case | null>;

  /**
   * Search cases by operational query.
   */
  searchCases(q: string): Promise<Case[]>;
}

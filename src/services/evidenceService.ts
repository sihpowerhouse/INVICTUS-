// Evidence Service — INVICTUS SIH26190
// Frontend-only mock service. No backend calls.

import type { Evidence } from '../types/evidence';
import { MOCK_EVIDENCE } from '../mock/evidence';

function simulateAsync<T>(data: T, delayMs = 120): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delayMs));
}

export const evidenceService = {
  getEvidence(): Promise<Evidence[]> {
    return simulateAsync([...MOCK_EVIDENCE]);
  },

  getEvidenceById(id: string): Promise<Evidence | undefined> {
    return simulateAsync(MOCK_EVIDENCE.find(e => e.id === id));
  },

  getEvidenceByCaseId(caseId: string): Promise<Evidence[]> {
    return simulateAsync(MOCK_EVIDENCE.filter(e => e.caseId === caseId));
  },
};

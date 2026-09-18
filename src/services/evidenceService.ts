// Evidence Service — INVICTUS SIH26190
// Frontend-only mock service. No backend calls.

import type { Evidence } from '../types/evidence';
import { MOCK_EVIDENCE } from '../mock/evidence';

const isMockMode = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

function simulateAsync<T>(data: T, delayMs = 120): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delayMs));
}

export const evidenceService = {
  getEvidence(): Promise<Evidence[]> {
    if (!isMockMode) return Promise.resolve([]);
    return simulateAsync([...MOCK_EVIDENCE]);
  },

  getEvidenceById(id: string): Promise<Evidence | undefined> {
    if (!isMockMode) return Promise.resolve(undefined);
    return simulateAsync(MOCK_EVIDENCE.find(e => e.id === id));
  },

  getEvidenceByCaseId(caseId: string): Promise<Evidence[]> {
    if (!isMockMode) return Promise.resolve([]);
    return simulateAsync(MOCK_EVIDENCE.filter(e => e.caseId === caseId));
  },
};

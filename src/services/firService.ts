import type { IFirService } from './fir/FirServiceInterface';
import { MockFirAdapter } from './fir/mockFirAdapter';
import { ApiFirAdapter } from './fir/apiFirAdapter';
import { USE_MOCK_DATA } from './api/apiClient';

export const firService: IFirService = USE_MOCK_DATA 
  ? new MockFirAdapter() 
  : new ApiFirAdapter();

// Re-export types for convenience
export * from './fir/FirServiceInterface';

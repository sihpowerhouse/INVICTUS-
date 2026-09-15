import type { IFirService } from './fir/FirServiceInterface';
import { MockFirAdapter } from './fir/mockFirAdapter';
import { ApiFirAdapter } from './fir/apiFirAdapter';

const USE_MOCK_DATA = true;

export const firService: IFirService = USE_MOCK_DATA 
  ? new MockFirAdapter() 
  : new ApiFirAdapter();

// Re-export types for convenience
export * from './fir/FirServiceInterface';

import type { IDocumentService } from './document/DocumentServiceInterface';
import { MockDocumentAdapter } from './document/mockDocumentAdapter';
import { ApiDocumentAdapter } from './document/apiDocumentAdapter';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const documentService: IDocumentService = useMockData 
  ? new MockDocumentAdapter() 
  : new ApiDocumentAdapter();

import type { IDocumentService } from './document/DocumentServiceInterface';
import { MockDocumentAdapter } from './document/mockDocumentAdapter';
import { ApiDocumentAdapter } from './document/apiDocumentAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const documentService: IDocumentService = USE_MOCK_DATA 
  ? new MockDocumentAdapter() 
  : new ApiDocumentAdapter();

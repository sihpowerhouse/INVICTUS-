import type { IFirService, FIRPayload, FIRCreationState, FIRCreationResult } from './FirServiceInterface';
import type { User } from '../../types/auth';

export class ApiFirAdapter implements IFirService {
  async createFIR(
    _payload: FIRPayload,
    _currentUser: User | null,
    _onProgress: (state: FIRCreationState) => void
  ): Promise<FIRCreationResult> {
    // Scaffolded for actual backend integration.
    // Must map HTTP streaming or WebSockets to the onProgress callback.
    throw new Error('ApiFirAdapter not implemented. Switch USE_MOCK_DATA to true.');
  }
}

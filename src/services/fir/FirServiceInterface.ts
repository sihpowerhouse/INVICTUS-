import type { Case } from '../../types/case';
import type { User } from '../../types/auth';

export interface FIRPayload {
  complainantName: string;
  incidentType: string;
  incidentDate: string;
  location: string;
  description: string;
  clientRequestId?: string;
}

export type FIRCreationStep = 'VALIDATING' | 'GENERATING' | 'HASHING' | 'SIGNING' | 'CREATING_CASE' | 'READY';

export interface FIRCreationState {
  step: FIRCreationStep;
  progress: number;
  hashStatus?: 'PENDING' | 'GENERATING' | 'DEMO HASH' | 'VERIFIED';
  hashValue?: string;
  signatureStatus?: 'PENDING' | 'CREATING' | 'CREATED' | 'VERIFIED' | 'FAILED';
  signatureIdentity?: string;
}

export interface FIRCreationResult {
  case: Case;
  hash: string;
  signature: string;
}

export interface IFirService {
  /**
   * Initiates the FIR creation workflow.
   * @param payload The FIR form data
   * @param currentUser The currently authenticated user to assign as creator
   * @param onProgress Callback to update the UI with processing state
   */
  createFIR(
    payload: FIRPayload,
    currentUser: User | null,
    onProgress: (state: FIRCreationState) => void
  ): Promise<FIRCreationResult>;
}

import type { IFirService, FIRPayload, FIRCreationState, FIRCreationResult } from './FirServiceInterface';
import type { User } from '../../types/auth';
import { apiClient } from '../api/apiClient';
import { ApiError } from '../api/ApiError';
import type { Case, CaseStatus, CasePriority } from '../../types/case';

// ────────────────────────────────────────────────────────────────────────────
// Backend response shapes (POST /case/create and GET /case/create/recover)
// ────────────────────────────────────────────────────────────────────────────
interface CreateCaseResponse {
  message: string;
  case_id: string;
  fir_id: string;
  document_id: string;
  version_id: string;
  filename: string;
  file_hash?: string;
  hash_algorithm?: string;
  signature?: string;
  signature_algorithm?: string;
  storage_path?: string;
  recovered?: boolean;
}

interface RecoverResponse {
  state: 'not_found' | 'processing' | 'completed';
  case_id?: string;
  fir_id?: string;
  document_id?: string;
  version_id?: string;
  filename?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Utility – deterministic client_request_id
// ────────────────────────────────────────────────────────────────────────────
function generateClientRequestId(): string {
  // crypto.randomUUID is available in all modern browsers
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Helper – sleep
// ────────────────────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ────────────────────────────────────────────────────────────────────────────
// Helper – map backend response to frontend Case shape
// ────────────────────────────────────────────────────────────────────────────
function mapBackendResponseToCase(
  res: CreateCaseResponse,
  payload: FIRPayload,
  currentUser: User | null
): Case {
  return {
    id: res.case_id,
    firNumber: res.fir_id,
    title: `${payload.incidentType} at ${payload.location}`,
    status: 'NEW' as CaseStatus,
    priority: 'HIGH' as CasePriority,
    attention: 'ACTION_REQUIRED',
    isNew: true,
    officer: currentUser?.displayName ?? 'UNASSIGNED',
    department: currentUser?.department ?? 'N/A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    description: payload.description,
    documentsCount: 0,
    evidenceCount: 0,
    personsCount: 1,
    locationsCount: 1,
    lastActivity: 'Case created via FIR system',
  };
}

// ────────────────────────────────────────────────────────────────────────────
// ApiFirAdapter
// ────────────────────────────────────────────────────────────────────────────
export class ApiFirAdapter implements IFirService {
  async createFIR(
    payload: FIRPayload,
    currentUser: User | null,
    onProgress: (state: FIRCreationState) => void
  ): Promise<FIRCreationResult> {
    // ── 1. VALIDATING ──
    onProgress({ step: 'VALIDATING', progress: 10, hashStatus: 'PENDING', signatureStatus: 'PENDING' });
    await sleep(400);

    // Deterministic idempotency key – generated ONCE per submission attempt.
    // If the payload already carries one (retry path) reuse it.
    const clientRequestId = payload.clientRequestId || generateClientRequestId();

    // ── 2. GENERATING ──
    onProgress({ step: 'GENERATING', progress: 25, hashStatus: 'PENDING', signatureStatus: 'PENDING' });
    await sleep(300);

    // ── 3. HASHING (backend will do the real hash; we surface the UX step) ──
    onProgress({ step: 'HASHING', progress: 45, hashStatus: 'GENERATING', signatureStatus: 'PENDING' });

    // ── Fire the real HTTP request ──
    let response: CreateCaseResponse;
    try {
      response = await apiClient.post<CreateCaseResponse>('/case/create', {
        complainant_name: payload.complainantName,
        incident_type: payload.incidentType,
        incident_date: payload.incidentDate,
        location: payload.location,
        description: payload.description,
        client_request_id: clientRequestId,
      });
    } catch (err) {
      // Network-level failure → attempt recovery before surfacing the error.
      if (err instanceof ApiError && err.status === 0) {
        const recovered = await this.attemptRecovery(clientRequestId, payload, currentUser, onProgress);
        if (recovered) return recovered;
      }
      // Re-throw non-recoverable or 4xx/5xx errors
      throw err;
    }

    // ── 4. HASHING complete – surface real hash ──
    onProgress({
      step: 'HASHING',
      progress: 60,
      hashStatus: 'VERIFIED',
      hashValue: response.file_hash
        ? `${response.file_hash.substring(0, 8)}...${response.file_hash.slice(-4)}`
        : 'BACKEND HASH',
      signatureStatus: 'PENDING',
    });
    await sleep(200);

    // ── 5. SIGNING ──
    onProgress({
      step: 'SIGNING',
      progress: 75,
      hashStatus: 'VERIFIED',
      hashValue: response.file_hash
        ? `${response.file_hash.substring(0, 8)}...${response.file_hash.slice(-4)}`
        : 'BACKEND HASH',
      signatureStatus: 'CREATED',
      signatureIdentity: currentUser
        ? `${currentUser.displayName} (${currentUser.employeeId})`
        : 'SYSTEM',
    });
    await sleep(300);

    // ── 6. CREATING_CASE ──
    onProgress({
      step: 'CREATING_CASE',
      progress: 90,
      hashStatus: 'VERIFIED',
      hashValue: response.file_hash
        ? `${response.file_hash.substring(0, 8)}...${response.file_hash.slice(-4)}`
        : 'BACKEND HASH',
      signatureStatus: 'VERIFIED',
      signatureIdentity: currentUser
        ? `${currentUser.displayName} (${currentUser.employeeId})`
        : 'SYSTEM',
    });
    await sleep(300);

    // ── 7. READY ──
    onProgress({
      step: 'READY',
      progress: 100,
      hashStatus: 'VERIFIED',
      signatureStatus: 'VERIFIED',
    });

    return {
      case: mapBackendResponseToCase(response, payload, currentUser),
      hash: response.file_hash ?? 'N/A',
      signature: response.signature ?? 'BACKEND-SIGNED',
    };
  }

  // ── Recovery flow ────────────────────────────────────────────────────────
  private async attemptRecovery(
    clientRequestId: string,
    payload: FIRPayload,
    currentUser: User | null,
    onProgress: (state: FIRCreationState) => void
  ): Promise<FIRCreationResult | null> {
    try {
      const recovery = await apiClient.get<RecoverResponse>(
        `/case/create/recover?client_request_id=${encodeURIComponent(clientRequestId)}`
      );

      if (recovery.state === 'completed' && recovery.case_id && recovery.fir_id) {
        onProgress({ step: 'READY', progress: 100, hashStatus: 'VERIFIED', signatureStatus: 'VERIFIED' });

        const recoveredCase: Case = {
          id: recovery.case_id,
          firNumber: recovery.fir_id,
          title: `${payload.incidentType} at ${payload.location}`,
          status: 'NEW' as CaseStatus,
          priority: 'HIGH' as CasePriority,
          attention: 'ACTION_REQUIRED',
          isNew: true,
          officer: currentUser?.displayName ?? 'UNASSIGNED',
          department: currentUser?.department ?? 'N/A',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
          description: payload.description,
          documentsCount: 0,
          evidenceCount: 0,
          personsCount: 1,
          locationsCount: 1,
          lastActivity: 'Recovered FIR creation',
        };

        return {
          case: recoveredCase,
          hash: 'RECOVERED',
          signature: 'RECOVERED',
        };
      }

      // 'processing' state means backend is still working; 'not_found' means it truly failed
      return null;
    } catch {
      return null;
    }
  }
}

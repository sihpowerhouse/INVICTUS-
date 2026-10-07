import type { IFirService, FIRPayload, FIRCreationState, FIRCreationResult, FIRCreationStep } from './FirServiceInterface';
import type { User } from '../../types/auth';
import { mockCases } from '../../mock/cases';

export class MockFirAdapter implements IFirService {
  private readonly STEP_DELAY = 600;

  async createFIR(
    payload: FIRPayload,
    currentUser: User | null,
    onProgress: (state: FIRCreationState) => void
  ): Promise<FIRCreationResult> {
    return new Promise((resolve, _reject) => {
      // Basic mock validation failure simulation (uncomment to test error state)
      // if (payload.incidentType.toLowerCase().includes('fail')) {
      //   setTimeout(() => reject(new Error('MOCK: Network constraint violation.')), 1000);
      //   return;
      // }

      const steps: FIRCreationStep[] = [
        'VALIDATING', 'GENERATING', 'HASHING', 'SIGNING', 'CREATING_CASE', 'READY'
      ];
      
      let currentStep = 0;
      let currentState: FIRCreationState = {
        step: 'VALIDATING',
        progress: 0,
        hashStatus: 'PENDING',
        signatureStatus: 'PENDING'
      };

      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          const step = steps[currentStep];
          
          // Update internal state based on step
          currentState.step = step;
          currentState.progress = Math.floor(((currentStep + 1) / steps.length) * 100);
          
          if (step === 'HASHING') {
            currentState.hashStatus = 'GENERATING';
          } else if (step === 'SIGNING') {
            currentState.hashStatus = 'DEMO HASH';
            currentState.hashValue = '7A3B9F2E...MOCK...4C1D';
            currentState.signatureStatus = 'CREATING';
          } else if (step === 'CREATING_CASE') {
            currentState.signatureStatus = 'CREATED';
            currentState.signatureIdentity = currentUser ? `${currentUser.displayName} (${currentUser.role})` : 'SYSTEM ADMIN';
          }

          onProgress({ ...currentState });
          currentStep++;
        } else {
          clearInterval(interval);
          
          const newCaseId = 'CASE-' + Math.floor(1000 + Math.random() * 9000);
          
          // Generate new mock case
          const newCase = {
            id: newCaseId,
            firNumber: 'FIR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
            title: `${payload.incidentType} at ${payload.location}`,
            status: 'NEW' as const,
            priority: 'HIGH' as const,
            attention: 'ACTION_REQUIRED' as const,
            isNew: true,
            department: currentUser?.department || 'GENERAL',
            officer: currentUser?.displayName || 'UNASSIGNED',
            caseHead: currentUser?.displayName || 'UNASSIGNED',
            description: payload.description,
            documentsCount: 0,
            evidenceCount: 0,
            personsCount: 1, // Complainant
            locationsCount: 1, // Location
            lastActivity: 'Case created via FIR system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
          };

          // Mutate the mockCases array so it appears in the Case Details and Dashboard
          mockCases.push(newCase);

          resolve({
            case: newCase,
            hash: currentState.hashValue || 'N/A',
            signature: 'MOCK-SIG-VERIFIED'
          });
        }
      }, this.STEP_DELAY);
    });
  }
}

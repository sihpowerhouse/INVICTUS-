import type { IMemberService } from './MemberServiceInterface';
import type { CaseMember } from '../../types/case';

export class MockMemberAdapter implements IMemberService {
  async getCaseMembers(_caseId: string): Promise<CaseMember[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'EMP-001',
            name: 'Cmdr. Vance',
            role: 'LEAD INVESTIGATOR',
            department: 'HOMICIDE',
            memberType: 'INTERNAL',
            accessState: 'APPROVED',
            joinedAt: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          {
            id: 'EXT-001',
            name: 'A. Lawyer',
            email: 'lawyer@example.com',
            role: 'EXTERNAL COUNSEL',
            department: 'DEFENSE',
            memberType: 'EXTERNAL',
            accessState: 'APPROVED',
            joinedAt: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ]);
      }, 600);
    });
  }

  async inviteEmployee(_caseId: string, _employeeId: string, _permissionLevel: string, _allowedDocumentTypes: string[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
    });
  }

  async verifyOTP(_employeeId: string, otp: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(otp.length === 6), 500);
    });
  }

  async searchMembers(_caseId: string, _query: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { employee_id: 'EMP-002', full_name: 'Jane Doe', department: 'CYBER' }
      ]), 400);
    });
  }

  async getInviteOptions(_caseId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        roles: ['read', 'upload', 'sign', 'grant'],
        document_types: ['FIR', 'EVIDENCE', 'WARRANT']
      }), 400);
    });
  }
}

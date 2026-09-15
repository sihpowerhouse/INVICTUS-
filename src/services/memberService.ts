import type { CaseMember } from '../types/case';

class MemberService {
  private readonly MOCK_DELAY = 500;

  async getCaseMembers(_caseId: string): Promise<CaseMember[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'M1', name: 'Commander Vance', role: 'Lead Investigator', department: 'Police', accessState: 'APPROVED', joinedAt: new Date().toISOString() },
        ]);
      }, this.MOCK_DELAY);
    });
  }

  async inviteEmployee(_caseId: string, employeeId: string, role: string): Promise<CaseMember> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'M' + Math.floor(Math.random() * 1000),
          name: 'Employee ' + employeeId,
          role,
          department: 'Unknown',
          accessState: 'INVITED',
        });
      }, this.MOCK_DELAY);
    });
  }

  async verifyOTP(_employeeId: string, otp: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Any 6-digit code starting with 123 is valid for mock
        resolve(otp.startsWith('123') || otp === '123456');
      }, this.MOCK_DELAY);
    });
  }
}

export const memberService = new MemberService();

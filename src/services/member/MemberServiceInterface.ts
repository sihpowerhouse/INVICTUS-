import type { CaseMember } from '../../types/case';

export interface IMemberService {
  getCaseMembers(caseId: string): Promise<CaseMember[]>;
  inviteEmployee(caseId: string, employeeId: string, permissionLevel: string, allowedDocumentTypes: string[]): Promise<void>;
  verifyOTP(employeeId: string, otp: string): Promise<boolean>;
  searchMembers(caseId: string, query: string): Promise<any[]>;
  getInviteOptions(caseId: string): Promise<any>;
}

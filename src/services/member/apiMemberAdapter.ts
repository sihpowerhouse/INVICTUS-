import type { CaseMember } from '../../types/case';
import type { IMemberService } from './MemberServiceInterface';
import { apiClient } from '../api/apiClient';

export class ApiMemberAdapter implements IMemberService {
  async getCaseMembers(caseId: string): Promise<CaseMember[]> {
    const data = await apiClient.get<any>(`/case/members?case_id=${encodeURIComponent(caseId)}`);
    
    // Map backend members to frontend CaseMember format
    let allMembers: CaseMember[] = [];
    
    if (data.members && Array.isArray(data.members)) {
      const internalMembers = data.members.map((m: any) => ({
        id: m.employee_id || m.user_id,
        name: m.full_name || m.name || 'Unknown User',
        email: m.email || '',
        role: m.role || m.permission_level || 'OFFICER',
        department: m.department_name || m.department || 'INTERNAL',
        memberType: 'INTERNAL',
        accessState: 'APPROVED',
        joinedAt: m.joined_at || new Date().toISOString()
      }));
      allMembers = [...allMembers, ...internalMembers];
    }
    
    if (data.external_participants && Array.isArray(data.external_participants)) {
      const externalMembers = data.external_participants.map((e: any) => ({
        id: e.user_id || e.email,
        name: e.name || e.email || 'Unknown External',
        email: e.email || '',
        role: e.role || e.permission_level || 'EXTERNAL',
        department: e.organization_name || 'EXTERNAL',
        memberType: 'EXTERNAL',
        accessState: 'APPROVED',
        joinedAt: e.joined_at || new Date().toISOString()
      }));
      allMembers = [...allMembers, ...externalMembers];
    }
    
    return allMembers;
  }

  async searchMembers(caseId: string, query: string): Promise<any[]> {
    return apiClient.get<any[]>(`/case/search-members?case_id=${encodeURIComponent(caseId)}&q=${encodeURIComponent(query)}`);
  }

  async getInviteOptions(caseId: string): Promise<any> {
    return apiClient.get<any>(`/case/invite-options?case_id=${encodeURIComponent(caseId)}`);
  }

  async inviteEmployee(caseId: string, employeeId: string, permissionLevel: string, allowedDocumentTypes: string[]): Promise<void> {
    const payload = {
      case_id: caseId,
      employee_id: employeeId,
      permission_level: permissionLevel,
      allowed_document_types: allowedDocumentTypes
    };
    
    await apiClient.post<any>('/case/invite', payload);
  }

  async verifyOTP(_employeeId: string, _otp: string): Promise<boolean> {
    throw new Error('OTP verification for members is handled by SecurityService.');
  }
}

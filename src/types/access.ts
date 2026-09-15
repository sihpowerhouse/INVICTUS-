export type DocumentPermission = 'READ ONLY';

export interface DocumentAccess {
  documentId: string;
  permission: DocumentPermission;
}

export interface ExternalInvitation {
  id: string;
  caseId: string;
  email: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  documents: DocumentAccess[];
  createdAt: string;
}

export interface AccessHistoryEvent {
  id: string;
  timestamp: string;
  user: string;
  action: 'INVITATION SENT' | 'REGISTRATION COMPLETED' | 'LOGIN' | 'DOCUMENT VIEWED' | 'ACCESS DENIED';
  resource: string;
  result: 'SUCCESS' | 'FAILURE';
}

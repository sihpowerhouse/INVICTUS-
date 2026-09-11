import type {
  DocumentIntegrity,
  IntegritySummary,
  AuditEvent,
  AccessRequest,
  SecurityEvent
} from '../types/security';

export const mockIntegritySummary: IntegritySummary = {
  totalDocuments: 1250,
  verifiedCount: 1205,
  pendingCount: 42,
  failedCount: 3,
  totalVersionChains: 384,
  totalSignatures: 890,
  totalAuditEvents: 15420,
  recentDocuments: [] // Will be populated from mockDocumentIntegrity
};

export const mockDocumentIntegrity: DocumentIntegrity = {
  documentId: 'DOC-26190-001',
  documentName: 'Forensic_Report_Final.pdf',
  caseId: 'CAS-26190',
  status: 'VERIFIED',
  lastVerifiedAt: '2026-09-11T14:45:00Z',
  hash: {
    algorithm: 'SHA-256',
    currentHash: '9f82a19c8bd83a21345fbc9a87bcd129a0f43e5d781b2c4e5f6a7b8c9d0e1f2a',
    previousHash: '73ac182b8109d93a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    computedAt: '2026-09-11T14:45:00Z'
  },
  signature: {
    status: 'VERIFIED',
    algorithm: 'ECDSA P-256',
    signedBy: 'Dr. Sarah Jenkins (Chief Forensic Officer)',
    signedAt: '2026-09-11T14:42:00Z',
    department: 'FORENSICS'
  },
  versions: [
    {
      version: 3,
      timestamp: '2026-09-11T14:40:00Z',
      actor: 'Dr. Sarah Jenkins',
      department: 'FORENSICS',
      status: 'VERIFIED',
      hashPreview: '9f82a19c...',
      isCurrent: true
    },
    {
      version: 2,
      timestamp: '2026-09-10T09:15:00Z',
      actor: 'Officer M. Vance',
      department: 'FIELD OPS',
      status: 'VERIFIED',
      hashPreview: '73ac182b...',
      isCurrent: false
    },
    {
      version: 1,
      timestamp: '2026-09-09T16:30:00Z',
      actor: 'System',
      department: 'AUTOMATED INGEST',
      status: 'VERIFIED',
      hashPreview: '1b4d8c92...',
      isCurrent: false
    }
  ],
  merkleRoot: 'd8a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
  merkleNodes: [
    {
      id: 'ROOT',
      hash: 'd8a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
      label: 'MERKLE ROOT',
      type: 'ROOT',
      parentId: null,
      children: ['BRANCH_A', 'BRANCH_B']
    },
    {
      id: 'BRANCH_A',
      hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      label: 'CHAIN A',
      type: 'BRANCH',
      parentId: 'ROOT',
      children: ['LEAF_1', 'LEAF_2']
    },
    {
      id: 'BRANCH_B',
      hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      label: 'CHAIN B',
      type: 'BRANCH',
      parentId: 'ROOT',
      children: ['LEAF_3', 'LEAF_4']
    },
    {
      id: 'LEAF_1',
      hash: '9f82a19c8bd83a21345fbc9a87bcd129a0f43e5d781b2c4e5f6a7b8c9d0e1f2a',
      label: 'DOC-26190-001 (v3)',
      type: 'LEAF',
      parentId: 'BRANCH_A',
      children: []
    },
    {
      id: 'LEAF_2',
      hash: '73ac182b8109d93a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      label: 'DOC-26190-001 (v2)',
      type: 'LEAF',
      parentId: 'BRANCH_A',
      children: []
    },
    {
      id: 'LEAF_3',
      hash: '1b4d8c92f1e2d3c4b5a69786756453423120f1e2d3c4b5a69786756453423120',
      label: 'DOC-26190-001 (v1)',
      type: 'LEAF',
      parentId: 'BRANCH_B',
      children: []
    },
    {
      id: 'LEAF_4',
      hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      label: 'META-26190-001',
      type: 'LEAF',
      parentId: 'BRANCH_B',
      children: []
    }
  ]
};

mockIntegritySummary.recentDocuments = [mockDocumentIntegrity];

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'AUD-10492',
    timestamp: '2026-09-11T15:02:44Z',
    actor: 'System',
    department: 'SECURITY',
    action: 'INTEGRITY_CHECK',
    target: 'DOC-26190-001',
    targetType: 'DOCUMENT',
    result: 'SUCCESS',
    caseId: 'CAS-26190'
  },
  {
    id: 'AUD-10491',
    timestamp: '2026-09-11T14:45:00Z',
    actor: 'System',
    department: 'SECURITY',
    action: 'SIGNATURE_VERIFIED',
    target: 'DOC-26190-001 (v3)',
    targetType: 'DOCUMENT',
    result: 'SUCCESS',
    caseId: 'CAS-26190'
  },
  {
    id: 'AUD-10490',
    timestamp: '2026-09-11T14:42:00Z',
    actor: 'Dr. Sarah Jenkins',
    department: 'FORENSICS',
    action: 'MODIFIED',
    target: 'DOC-26190-001',
    targetType: 'DOCUMENT',
    result: 'SUCCESS',
    caseId: 'CAS-26190'
  },
  {
    id: 'AUD-10489',
    timestamp: '2026-09-11T13:15:22Z',
    actor: 'Det. Miller',
    department: 'HOMICIDE',
    action: 'VIEWED',
    target: 'MED-26190-001',
    targetType: 'MEDIA',
    result: 'SUCCESS',
    caseId: 'CAS-26190'
  },
  {
    id: 'AUD-10488',
    timestamp: '2026-09-11T11:05:10Z',
    actor: 'Unknown User (IP: 192.168.1.104)',
    department: 'EXTERNAL',
    action: 'VIEWED',
    target: 'DOC-26190-001',
    targetType: 'DOCUMENT',
    result: 'FAILURE',
    caseId: 'CAS-26190'
  }
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'REQ-5510',
    requester: 'Officer T. Vance',
    department: 'FIELD OPS',
    caseId: 'CAS-26190',
    documentId: 'DOC-26190-002',
    documentName: 'Witness_A_Statement.pdf',
    permission: 'VIEW',
    requestedAt: '2026-09-11T15:30:00Z',
    reason: 'Required for cross-referencing field reports.',
    status: 'PENDING'
  },
  {
    id: 'REQ-5509',
    requester: 'Dr. A. Patel',
    department: 'CYBER',
    caseId: 'CAS-26190',
    documentId: 'MED-26190-001',
    documentName: 'CCTV_North_Entrance.mp4',
    permission: 'DOWNLOAD',
    requestedAt: '2026-09-11T10:15:00Z',
    reason: 'Deep-fake analysis requested by lead investigator.',
    status: 'APPROVED'
  },
  {
    id: 'REQ-5508',
    requester: 'J. Doe (Contractor)',
    department: 'EXTERNAL',
    caseId: 'CAS-26191',
    documentId: 'DOC-26191-001',
    documentName: 'Classified_Informants.pdf',
    permission: 'VIEW',
    requestedAt: '2026-09-10T16:45:00Z',
    reason: 'General case review.',
    status: 'DENIED'
  }
];

export const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'SE-991',
    timestamp: '2026-09-11T15:02:44Z',
    type: 'INTEGRITY VERIFIED',
    description: 'System-wide integrity verification completed successfully.',
    severity: 'INFO'
  },
  {
    id: 'SE-990',
    timestamp: '2026-09-11T11:05:10Z',
    type: 'UNAUTHORIZED ACCESS ATTEMPT',
    description: 'Failed access attempt to restricted document DOC-26190-001.',
    severity: 'CRITICAL',
    actor: 'IP: 192.168.1.104',
    target: 'DOC-26190-001'
  },
  {
    id: 'SE-989',
    timestamp: '2026-09-10T08:30:00Z',
    type: 'SIGNATURE INVALID',
    description: 'Detected malformed signature block on DOC-10024.',
    severity: 'WARNING',
    target: 'DOC-10024'
  }
];

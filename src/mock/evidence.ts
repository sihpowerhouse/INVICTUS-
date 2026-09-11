// Mock Evidence Data — INVICTUS SIH26190
// These are clearly fictional demonstration records only.

import type {
  Evidence,
  CustodyEvent,
  ActivityEvent,
  EvidenceIntegrity,
} from '../types/evidence';

const custody001: CustodyEvent[] = [
  {
    id: 'ce-001-1',
    action: 'REGISTERED',
    actor: 'SI Priya Rajan',
    department: 'Police Investigation Unit',
    location: 'Crime Scene — 14B Sector 9',
    timestamp: '2026-09-09T08:14:00',
    note: 'Device found at scene and sealed per protocol.',
  },
  {
    id: 'ce-001-2',
    action: 'TRANSFERRED',
    actor: 'SI Priya Rajan',
    department: 'Police Investigation Unit',
    location: 'District Police Headquarters',
    timestamp: '2026-09-09T18:21:00',
  },
  {
    id: 'ce-001-3',
    action: 'RECEIVED',
    actor: 'FSL Officer A. Kumar',
    department: 'Forensic Science Laboratory',
    location: 'FSL Intake — Block C',
    timestamp: '2026-09-10T09:13:00',
  },
  {
    id: 'ce-001-4',
    action: 'EXAMINATION_STARTED',
    actor: 'Forensic Officer D. Mehta',
    department: 'Forensic Science Laboratory',
    location: 'FSL Digital Lab',
    timestamp: '2026-09-10T14:30:00',
    note: 'Device imaging initiated. Storage: 128 GB.',
  },
  {
    id: 'ce-001-5',
    action: 'REPORT_SUBMITTED',
    actor: 'Forensic Officer D. Mehta',
    department: 'Forensic Science Laboratory',
    location: 'FSL Digital Lab',
    timestamp: '2026-09-11T14:42:00',
    note: 'Preliminary forensic report generated and attached.',
  },
];

const custody002: CustodyEvent[] = [
  {
    id: 'ce-002-1',
    action: 'REGISTERED',
    actor: 'SI Vikram Shah',
    department: 'Police Investigation Unit',
    location: 'Surveillance Control Room',
    timestamp: '2026-09-08T10:00:00',
  },
  {
    id: 'ce-002-2',
    action: 'TRANSFERRED',
    actor: 'SI Vikram Shah',
    department: 'Police Investigation Unit',
    location: 'District Headquarters',
    timestamp: '2026-09-08T15:30:00',
  },
  {
    id: 'ce-002-3',
    action: 'RECEIVED',
    actor: 'FSL Technician R. Bose',
    department: 'Forensic Science Laboratory',
    location: 'FSL Imaging Unit',
    timestamp: '2026-09-09T08:45:00',
  },
];

const custody003: CustodyEvent[] = [
  {
    id: 'ce-003-1',
    action: 'REGISTERED',
    actor: 'Insp. N. Sharma',
    department: 'Police Investigation Unit',
    location: 'Interrogation Room 3, DHQ',
    timestamp: '2026-09-07T11:00:00',
  },
  {
    id: 'ce-003-2',
    action: 'EXAMINATION_STARTED',
    actor: 'Audio Analyst P. Gupta',
    department: 'Forensic Science Laboratory',
    location: 'FSL Audio Lab',
    timestamp: '2026-09-08T09:00:00',
  },
  {
    id: 'ce-003-3',
    action: 'VERIFIED',
    actor: 'Senior Analyst R. Nair',
    department: 'Forensic Science Laboratory',
    location: 'FSL Audio Lab',
    timestamp: '2026-09-09T16:30:00',
    note: 'Audio integrity confirmed. No tampering detected.',
  },
];

const custody004: CustodyEvent[] = [
  {
    id: 'ce-004-1',
    action: 'REGISTERED',
    actor: 'SI Priya Rajan',
    department: 'Police Investigation Unit',
    location: 'Crime Scene — 14B Sector 9',
    timestamp: '2026-09-09T08:30:00',
  },
  {
    id: 'ce-004-2',
    action: 'TRANSFERRED',
    actor: 'SI Priya Rajan',
    department: 'Police Investigation Unit',
    location: 'District Headquarters',
    timestamp: '2026-09-09T19:00:00',
    note: 'Documents sealed in evidence bag #A-219.',
  },
];

const activity001: ActivityEvent[] = [
  { id: 'ae-001-1', type: 'REGISTERED', actor: 'SI Priya Rajan', timestamp: '2026-09-09T08:14:00' },
  { id: 'ae-001-2', type: 'VIEWED', actor: 'IO A. Verma', timestamp: '2026-09-09T20:00:00' },
  { id: 'ae-001-3', type: 'TRANSFERRED', actor: 'System', timestamp: '2026-09-10T09:13:00' },
  { id: 'ae-001-4', type: 'REPORT_ATTACHED', actor: 'FSL Officer D. Mehta', timestamp: '2026-09-11T14:42:00' },
];

const activity002: ActivityEvent[] = [
  { id: 'ae-002-1', type: 'REGISTERED', actor: 'SI Vikram Shah', timestamp: '2026-09-08T10:00:00' },
  { id: 'ae-002-2', type: 'VIEWED', actor: 'IO A. Verma', timestamp: '2026-09-08T18:00:00' },
  { id: 'ae-002-3', type: 'TRANSFERRED', actor: 'System', timestamp: '2026-09-09T08:45:00' },
];

const activity003: ActivityEvent[] = [
  { id: 'ae-003-1', type: 'REGISTERED', actor: 'Insp. N. Sharma', timestamp: '2026-09-07T11:00:00' },
  { id: 'ae-003-2', type: 'VIEWED', actor: 'IO A. Verma', timestamp: '2026-09-07T15:00:00' },
  { id: 'ae-003-3', type: 'VERIFIED', actor: 'Senior Analyst R. Nair', timestamp: '2026-09-09T16:30:00' },
];

const activity004: ActivityEvent[] = [
  { id: 'ae-004-1', type: 'REGISTERED', actor: 'SI Priya Rajan', timestamp: '2026-09-09T08:30:00' },
  { id: 'ae-004-2', type: 'FLAGGED', actor: 'System', timestamp: '2026-09-09T22:00:00', note: 'Requires review — document count mismatch.' },
];

const integrity001: EvidenceIntegrity = {
  sha256: 'a3f2c1d4e5b67890abcdef1234567890abcdef1234567890abcdef1234567890',
  version: 'v2',
  signature: 'SIG-FSL-D.MEHTA-26190-001',
  state: 'VERIFIED',
  checkedAt: '2026-09-11T14:42:00',
};

const integrity002: EvidenceIntegrity = {
  sha256: 'b7e3a2f1c4d5698012abcdef4321098765fedcba0987654321fedcba09876543',
  version: 'v1',
  signature: 'SIG-FSL-R.BOSE-26190-002',
  state: 'PENDING',
  checkedAt: '2026-09-09T08:45:00',
};

const integrity003: EvidenceIntegrity = {
  sha256: 'c9d8e7f6a5b412309876543210fedcba9876543210abcdef1234567890abcdef',
  version: 'v1',
  signature: 'SIG-FSL-R.NAIR-26190-003',
  state: 'VERIFIED',
  checkedAt: '2026-09-09T16:30:00',
};

const integrity004: EvidenceIntegrity = {
  sha256: 'd1e2f3a4b5c6789012345678abcdef0987654321fedcba0123456789abcdef01',
  version: 'v1',
  signature: '',
  state: 'PENDING',
  checkedAt: '2026-09-09T19:00:00',
};

export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: 'EVD-26190-001',
    caseId: 'CASE-26190-001',
    title: 'Mobile Device — Samsung Galaxy',
    description: 'Android device recovered from primary scene. Suspected to contain relevant communications and media.',
    type: 'DEVICE',
    status: 'UNDER_EXAMINATION',
    custodyState: 'AT_FSL',
    department: 'Forensic Science Laboratory',
    currentHolder: 'Forensic Officer D. Mehta',
    location: 'FSL Digital Lab',
    createdAt: '2026-09-09T08:14:00',
    updatedAt: '2026-09-11T14:42:00',
    lastActivityAt: '2026-09-11T14:42:00',
    relatedDocumentIds: ['DOC-26190-001'],
    relatedMediaIds: [],
    custodyEvents: custody001,
    activityEvents: activity001,
    integrity: integrity001,
  },
  {
    id: 'EVD-26190-002',
    caseId: 'CASE-26190-001',
    title: 'Forensic Image Set — CCTV Export',
    description: 'Collection of 48 extracted frames from CCTV footage covering 09 Sep 0200–0600 hrs.',
    type: 'IMAGE',
    status: 'IN_CUSTODY',
    custodyState: 'AT_FSL',
    department: 'Forensic Science Laboratory',
    currentHolder: 'FSL Technician R. Bose',
    location: 'FSL Imaging Unit',
    createdAt: '2026-09-08T10:00:00',
    updatedAt: '2026-09-09T08:45:00',
    lastActivityAt: '2026-09-09T08:45:00',
    relatedDocumentIds: [],
    relatedMediaIds: ['MEDIA-26190-001'],
    custodyEvents: custody002,
    activityEvents: activity002,
    integrity: integrity002,
  },
  {
    id: 'EVD-26190-003',
    caseId: 'CASE-26190-001',
    title: 'Interrogation Recording — Primary Subject',
    description: 'Audio recording of formal interrogation session. Duration: 1h 42m.',
    type: 'AUDIO',
    status: 'VERIFIED',
    custodyState: 'ARCHIVED',
    department: 'Forensic Science Laboratory',
    currentHolder: 'Senior Analyst R. Nair',
    location: 'FSL Audio Lab',
    createdAt: '2026-09-07T11:00:00',
    updatedAt: '2026-09-09T16:30:00',
    lastActivityAt: '2026-09-09T16:30:00',
    relatedDocumentIds: ['DOC-26190-002'],
    relatedMediaIds: ['MEDIA-26190-002'],
    custodyEvents: custody003,
    activityEvents: activity003,
    integrity: integrity003,
  },
  {
    id: 'EVD-26190-004',
    caseId: 'CASE-26190-002',
    title: 'Physical Documents — Financial Records',
    description: 'Bundle of 14 original documents including bank statements and transaction records.',
    type: 'PHYSICAL_RECORD',
    status: 'REQUIRES_REVIEW',
    custodyState: 'IN_CUSTODY',
    department: 'Police Investigation Unit',
    currentHolder: 'SI Priya Rajan',
    location: 'District Headquarters — Evidence Room 2',
    createdAt: '2026-09-09T08:30:00',
    updatedAt: '2026-09-09T22:00:00',
    lastActivityAt: '2026-09-09T22:00:00',
    relatedDocumentIds: [],
    relatedMediaIds: [],
    custodyEvents: custody004,
    activityEvents: activity004,
    integrity: integrity004,
  },
];

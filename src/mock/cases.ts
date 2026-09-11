import type { Case } from '../types/case';

export const mockCases: Case[] = [
  {
    id: 'INV-26190-001',
    title: 'Operation Orion',
    status: 'ACTIVE',
    priority: 'HIGH',
    attention: 'ACTION_REQUIRED',
    attentionDetails: 'FSL REPORT PENDING',
    isNew: false,
    department: 'POLICE / INVESTIGATION',
    officer: 'YASH T',
    description: 'Investigation into unauthorized access and data exfiltration from state-operated infrastructure servers.',
    documentsCount: 42,
    evidenceCount: 13,
    personsCount: 7,
    locationsCount: 4,
    lastActivity: '2 hours ago',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    lastActivityAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    persons: [
      { id: 'p1', name: 'John Doe', role: 'ACCUSED', relevance: 'Primary suspect.' },
      { id: 'p2', name: 'Jane Smith', role: 'WITNESS', relevance: 'IT Admin.' },
      { id: 'p3', name: 'Yash T', role: 'OFFICER', relevance: 'Lead Officer.' }
    ],
    locations: [
      { id: 'l1', location: 'Server Room Alpha', type: 'INCIDENT SITE', reference: 'Breach point.' }
    ],
    documents: [
      { id: 'd1', name: 'Incident Report (Initial)', type: 'PDF', version: 'v1.0', status: 'VERIFIED' }
    ],
    timeline: [
      { id: 't1', date: '01 SEP 2026', event: 'INCIDENT', description: 'Unauthorized access detected.' }
    ]
  },
  {
    id: 'INV-26190-002',
    title: 'Financial Investigation (Crypto-Ledger)',
    status: 'REVIEW',
    priority: 'MEDIUM',
    attention: 'OVERDUE',
    attentionDetails: 'CASE REVIEW OVERDUE',
    isNew: false,
    department: 'CYBER CRIME',
    officer: 'SARAH M',
    description: 'Tracing illicit cryptocurrency transactions.',
    documentsCount: 15,
    evidenceCount: 4,
    personsCount: 2,
    locationsCount: 0,
    lastActivity: 'Yesterday, 18:42',
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
    lastActivityAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'INV-26190-003',
    title: 'Evidence Recovery Task 9',
    status: 'NEW',
    priority: 'CRITICAL',
    attention: 'NONE',
    isNew: true,
    department: 'FSL / FORENSICS',
    officer: 'DR. ALAN R',
    description: 'Data recovery from heavily damaged seized hard drives.',
    documentsCount: 8,
    evidenceCount: 1,
    personsCount: 3,
    locationsCount: 1,
    lastActivity: 'Just Now',
    createdAt: new Date().toISOString(), // Now
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  },
  {
    id: 'INV-26190-004',
    title: 'Archive Record Update',
    status: 'ARCHIVED',
    priority: 'LOW',
    attention: 'NONE',
    isNew: false,
    department: 'RECORDS / DOCUMENT CONTROL',
    officer: 'ADMIN',
    description: 'Routine digitization and archival of past case files.',
    documentsCount: 120,
    evidenceCount: 0,
    personsCount: 0,
    locationsCount: 0,
    lastActivity: '1 month ago',
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(), // 2 months ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(), // 1 month ago
    lastActivityAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    id: 'INV-26190-005',
    title: 'Dark Web Vendor Identification',
    status: 'ACTIVE',
    priority: 'HIGH',
    attention: 'WAITING',
    attentionDetails: 'ACCESS REQUEST PENDING',
    isNew: false,
    department: 'CYBER CRIME',
    officer: 'YASH T',
    description: 'Identification of vendor "Silk2" operating on dark web marketplaces.',
    documentsCount: 24,
    evidenceCount: 6,
    personsCount: 1,
    locationsCount: 0,
    lastActivity: '4 days ago',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(), // 4 days ago
    lastActivityAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'INV-26190-006',
    title: 'OCR Scanning Incident 42',
    status: 'NEW',
    priority: 'MEDIUM',
    attention: 'ACTION_REQUIRED',
    attentionDetails: 'OCR REVIEW REQUIRED',
    isNew: true,
    department: 'DOCUMENT CONTROL',
    officer: 'SARAH M',
    description: 'Manual review required for OCR extraction failures on seized handwritten ledgers.',
    documentsCount: 2,
    evidenceCount: 1,
    personsCount: 0,
    locationsCount: 0,
    lastActivity: '8 min ago',
    createdAt: new Date(Date.now() - 480000).toISOString(), // 8 mins ago
    updatedAt: new Date(Date.now() - 480000).toISOString(),
    lastActivityAt: new Date(Date.now() - 480000).toISOString(),
  }
];

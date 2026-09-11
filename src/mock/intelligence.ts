import type { 
  SearchResult, AIAnswer, TimelineEvent, Entity, PotentialInconsistency 
} from '../types/intelligence';

export const mockSearchResults: SearchResult[] = [
  {
    id: 'RES-001',
    title: 'FORENSIC REPORT',
    sourceType: 'DOCUMENT',
    caseId: 'CAS-26190',
    excerpt: '...material consistent with the scene was found on the suspect\'s clothing...',
    relevanceScore: 94,
    date: '2026-01-15T10:30:00Z',
    status: 'VERIFIED',
    page: 7,
    lines: '12–18',
    isAuthorized: true
  },
  {
    id: 'RES-002',
    title: 'WITNESS STATEMENT A',
    sourceType: 'DOCUMENT',
    caseId: 'CAS-26190',
    excerpt: '...I saw a dark vehicle leaving the area at high speed around 23:45...',
    relevanceScore: 91,
    date: '2026-01-13T14:00:00Z',
    status: 'PROCESSED',
    page: 2,
    lines: '4–6',
    isAuthorized: true
  },
  {
    id: 'RES-003',
    title: 'CCTV FOOTAGE - NORTH ENTRANCE',
    sourceType: 'MEDIA',
    caseId: 'CAS-26190',
    excerpt: 'Subject matching description enters frame.',
    relevanceScore: 88,
    date: '2026-01-10T23:40:00Z',
    status: 'PROCESSED',
    isAuthorized: true
  },
  {
    id: 'RES-004',
    title: 'CLASSIFIED INFORMANTS FILE',
    sourceType: 'DOCUMENT',
    caseId: 'CAS-26190',
    excerpt: 'REDACTED',
    relevanceScore: 85,
    date: '2026-01-12T09:00:00Z',
    status: 'RESTRICTED',
    isAuthorized: false
  }
];

export const mockAnswers: Record<string, AIAnswer> = {
  'default': {
    id: 'ANS-001',
    question: 'What evidence connects the accused to the scene?',
    answer: 'The available evidence indicates three primary connections to the scene.\n\nFirst, the forensic report confirmed that material found on the suspect\'s clothing was consistent with the soil composition at the incident location. Second, Witness A provided a statement placing a vehicle matching the suspect\'s registration at the scene around the time of the incident. Finally, CCTV footage from the North Entrance captured an individual matching the suspect\'s physical description entering the perimeter at 23:40.',
    status: 'SUCCESS',
    basis: {
      totalSources: 3,
      documentCount: 2,
      mediaCount: 1,
      evidenceCount: 0,
      relevance: 'HIGH'
    },
    citations: [
      {
        id: 'CIT-001',
        documentId: 'DOC-26190-001',
        documentName: 'Forensic_Report.pdf',
        version: 3,
        page: 7,
        startLine: 12,
        endLine: 18,
        excerpt: '...material consistent with the scene was found on the suspect\'s clothing...'
      },
      {
        id: 'CIT-002',
        documentId: 'DOC-26190-002',
        documentName: 'Witness_A_Statement.pdf',
        version: 1,
        page: 2,
        startLine: 4,
        endLine: 6,
        excerpt: '...I saw a dark vehicle leaving the area at high speed around 23:45...'
      }
    ]
  },
  'insufficient': {
    id: 'ANS-002',
    question: 'What is the suspect\'s exact financial history?',
    answer: 'I could not find enough relevant evidence to answer this question. The current case files do not contain comprehensive financial records or transaction histories for the suspect.',
    status: 'INSUFFICIENT_EVIDENCE',
    basis: {
      totalSources: 0,
      documentCount: 0,
      mediaCount: 0,
      evidenceCount: 0,
      relevance: 'LOW'
    },
    citations: []
  },
  'unauthorized': {
    id: 'ANS-003',
    question: 'Who is the confidential informant?',
    answer: 'This evidence cannot be shown to the current user. Access to confidential informant identities requires Level 4 clearance.',
    status: 'UNAUTHORIZED',
    basis: {
      totalSources: 1,
      documentCount: 1,
      mediaCount: 0,
      evidenceCount: 0,
      relevance: 'HIGH'
    },
    citations: []
  }
};

export const mockTimeline: TimelineEvent[] = [
  {
    id: 'EVT-001',
    date: '10 JAN',
    time: '23:30',
    event: 'INCIDENT',
    sourceType: 'CASE',
    sourceId: 'CAS-26190',
    sourceName: 'Operation Orion',
    caseId: 'CAS-26190'
  },
  {
    id: 'EVT-002',
    date: '10 JAN',
    time: '23:40',
    event: 'SUBJECT DETECTED',
    sourceType: 'MEDIA',
    sourceId: 'MED-26190-001',
    sourceName: 'CCTV North Entrance',
    caseId: 'CAS-26190'
  },
  {
    id: 'EVT-003',
    date: '11 JAN',
    time: '08:15',
    event: 'FIR FILED',
    sourceType: 'DOCUMENT',
    sourceId: 'DOC-26190-FIR',
    sourceName: 'Initial_Report.pdf',
    caseId: 'CAS-26190'
  },
  {
    id: 'EVT-004',
    date: '13 JAN',
    time: '14:00',
    event: 'WITNESS STATEMENT',
    sourceType: 'DOCUMENT',
    sourceId: 'DOC-26190-002',
    sourceName: 'Witness_A_Statement.pdf',
    caseId: 'CAS-26190'
  },
  {
    id: 'EVT-005',
    date: '15 JAN',
    time: '10:30',
    event: 'FORENSIC REPORT LOGGED',
    sourceType: 'DOCUMENT',
    sourceId: 'DOC-26190-001',
    sourceName: 'Forensic_Report.pdf',
    caseId: 'CAS-26190'
  }
];

export const mockEntities: Entity[] = [
  { id: 'ENT-001', name: 'Marcus Vance', type: 'PERSON', relatedIds: ['CAS-26190'] },
  { id: 'ENT-002', name: 'Sarah Jenkins', type: 'PERSON', relatedIds: ['DOC-26190-002'] },
  { id: 'ENT-003', name: 'Sector 4 Industrial Park', type: 'LOCATION', relatedIds: ['CAS-26190', 'MED-26190-001'] },
  { id: 'ENT-004', name: 'Apex Logistics', type: 'ORGANIZATION', relatedIds: ['CAS-26190'] },
  { id: 'ENT-005', name: 'Black SUV (XYZ-1234)', type: 'VEHICLE', relatedIds: ['DOC-26190-002'] }
];

export const mockInconsistencies: PotentialInconsistency[] = [
  {
    id: 'INC-001',
    caseId: 'CAS-26190',
    type: 'INCIDENT DATE',
    description: 'The exact timing of the incident differs between the witness statement and the initial report.',
    sourceA: {
      sourceId: 'DOC-26190-FIR',
      sourceName: 'Initial_Report.pdf',
      value: 'Incident occurred prior to 23:00 on 10 January.'
    },
    sourceB: {
      sourceId: 'DOC-26190-002',
      sourceName: 'Witness_A_Statement.pdf',
      value: 'I saw the vehicle speeding away at 23:45 on 10 January.'
    }
  },
  {
    id: 'INC-002',
    caseId: 'CAS-26190',
    type: 'LOCATION CONFLICT',
    description: 'Subject location is reported differently by the subject and CCTV.',
    sourceA: {
      sourceId: 'DOC-26190-INT',
      sourceName: 'Interrogation_Transcript.pdf',
      value: 'Subject claims to have been at home all night.'
    },
    sourceB: {
      sourceId: 'MED-26190-001',
      sourceName: 'CCTV North Entrance',
      value: 'Subject detected entering Sector 4 Industrial Park.'
    }
  }
];

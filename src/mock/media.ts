import type { Media, TranscriptLine, ImportantMoment } from '../types/media';

const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;

function createTranscript(lines: { time: number, speaker: string, text: string }[]): TranscriptLine[] {
  return lines.map((l, i) => {
    const min = Math.floor(l.time / 60);
    const sec = l.time % 60;
    const timeStr = `00:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return {
      id: `tr-${i}`,
      timestamp: timeStr,
      timestampMs: l.time * MS_PER_SEC,
      speaker: l.speaker,
      text: l.text
    };
  });
}

const mockTranscriptA = createTranscript([
  { time: 10, speaker: 'SPEAKER 1', text: 'Recording started. Subject is present.' },
  { time: 24, speaker: 'SPEAKER 1', text: 'Where were you on Monday the 12th?' },
  { time: 31, speaker: 'SPEAKER 2', text: 'I was at home. I didn\'t go out.' },
  { time: 42, speaker: 'SPEAKER 1', text: 'We have footage showing your vehicle downtown at 21:00.' },
  { time: 55, speaker: 'SPEAKER 2', text: 'That must be a mistake. My car was parked all night.' },
  { time: 70, speaker: 'SPEAKER 1', text: 'We will review the traffic cameras. Let\'s discuss the transaction.' },
  { time: 85, speaker: 'SPEAKER 2', text: 'I don\'t know anything about that.' },
  { time: 134, speaker: 'SPEAKER 1', text: 'Can you explain the large deposit made on Tuesday?' },
  { time: 145, speaker: 'SPEAKER 2', text: 'I sold some old equipment.' },
  { time: 190, speaker: 'SPEAKER 1', text: 'Who did you sell it to?' },
  { time: 205, speaker: 'SPEAKER 2', text: 'A guy from out of town. I don\'t have his name.' }
]);

const mockMomentsA: ImportantMoment[] = [
  { id: 'm-1', timestamp: '00:00:24', timestampMs: 24000, title: 'Question about Monday', description: 'Subject asked about whereabouts.' },
  { id: 'm-2', timestamp: '00:00:42', timestampMs: 42000, title: 'Mention of vehicle', description: 'Investigator presents contradiction regarding vehicle.' },
  { id: 'm-3', timestamp: '00:02:14', timestampMs: 134000, title: 'Deposit question', description: 'Inquiry about Tuesday deposit.' },
];

export const MOCK_MEDIA: Media[] = [
  {
    id: 'MEDIA-26190-001',
    caseId: 'CAS-26190',
    evidenceId: 'EVD-26190-003',
    title: 'Interrogation Audio — Primary Subject',
    filename: 'INT_SubA_09SEP.wav',
    type: 'AUDIO',
    duration: 31 * MS_PER_MIN + 48 * MS_PER_SEC,
    durationFormatted: '00:31:48',
    language: 'EN-US',
    recordedAt: '2026-09-09T14:30:00Z',
    uploadedBy: 'J. VANCE (ID: 8842)',
    department: 'INTELLIGENCE DIVISION',
    status: 'READY',
    lastActivityAt: '2026-09-10T09:12:00Z',
    transcript: mockTranscriptA,
    importantMoments: mockMomentsA,
    relatedCaseIds: ['CAS-26190'],
    relatedEvidenceIds: ['EVD-26190-003']
  },
  {
    id: 'MEDIA-26190-002',
    caseId: 'CAS-26190',
    evidenceId: 'EVD-26190-002',
    title: 'CCTV Export — Sector 9 — 09 SEP',
    filename: 'CCTV_S9_09SEP_2100.mp4',
    type: 'VIDEO',
    duration: 4 * MS_PER_MIN + 12 * MS_PER_SEC,
    durationFormatted: '00:04:12',
    language: 'N/A',
    recordedAt: '2026-09-09T21:00:00Z',
    uploadedBy: 'AUTO-INGEST',
    department: 'SURVEILLANCE',
    status: 'FLAGGED',
    lastActivityAt: '2026-09-09T22:45:00Z',
    transcript: createTranscript([{ time: 0, speaker: 'SYSTEM', text: '[AMBIENT NOISE]' }, { time: 45, speaker: 'SYSTEM', text: '[VEHICLE APPROACHING]' }]),
    importantMoments: [
      { id: 'm-1', timestamp: '00:00:45', timestampMs: 45000, title: 'Vehicle sighted', description: 'Target vehicle enters frame.' }
    ],
    relatedCaseIds: ['CAS-26190'],
    relatedEvidenceIds: ['EVD-26190-002']
  },
  {
    id: 'MEDIA-26191-001',
    caseId: 'CAS-26191',
    title: 'Wiretap #4 — Target Alpha',
    filename: 'WT4_ALPHA_12SEP.mp3',
    type: 'AUDIO',
    duration: 1 * 60 * MS_PER_MIN + 42 * MS_PER_MIN,
    durationFormatted: '01:42:00',
    language: 'EN-US',
    recordedAt: '2026-09-12T03:15:00Z',
    uploadedBy: 'SYSTEM',
    department: 'SIGINT',
    status: 'PROCESSING',
    lastActivityAt: '2026-09-12T04:00:00Z',
    transcript: [],
    importantMoments: [],
    relatedCaseIds: ['CAS-26191'],
    relatedEvidenceIds: []
  }
];

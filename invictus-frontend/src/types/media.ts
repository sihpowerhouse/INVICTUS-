export type MediaType = 'AUDIO' | 'VIDEO';
export type MediaStatus = 'UNPROCESSED' | 'PROCESSING' | 'READY' | 'FLAGGED' | 'ARCHIVED';

export interface TranscriptLine {
  id: string;
  timestamp: string; // "00:00:00" format or ms
  timestampMs: number;
  speaker: string;
  text: string;
}

export interface ImportantMoment {
  id: string;
  timestamp: string;
  timestampMs: number;
  title: string;
  description?: string;
}

export interface Media {
  id: string;
  caseId: string;
  evidenceId?: string;
  title: string;
  filename: string;
  type: MediaType;
  duration: number; // in milliseconds
  durationFormatted: string; // e.g., "1H 42M" or "00:31:48"
  language: string;
  recordedAt: string; // ISO format
  uploadedBy: string;
  department: string;
  status: MediaStatus;
  lastActivityAt: string; // ISO format

  transcript: TranscriptLine[];
  importantMoments: ImportantMoment[];
  relatedCaseIds: string[];
  relatedEvidenceIds: string[];
}

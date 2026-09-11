export type DocumentType = 
  | 'FIR'
  | 'POLICE_REPORT'
  | 'WITNESS_STATEMENT'
  | 'FORENSIC_REPORT'
  | 'CHARGE_SHEET'
  | 'COURT_FILING'
  | 'LEGAL_NOTICE'
  | 'EVIDENCE_RECORD'
  | 'OTHER';

export type DocumentStatus = 
  | 'UPLOADED'
  | 'PROCESSING'
  | 'OCR_COMPLETE'
  | 'METADATA_REVIEW'
  | 'VERIFIED'
  | 'REQUIRES_REVIEW'
  | 'FAILED';

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  version: string;
  language: string;
  pages: number;
  size: string; // e.g., "2.4 MB"
  uploadedBy: string;
  department: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  
  // Intelligence metadata
  ocrConfidence?: number;
  extractionMethod?: string;
  confidentiality?: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET';
  
  // Mock extracted entities
  keywords?: string[];
  persons?: string[];
  organizations?: string[];
  locations?: string[];
  incidentDate?: string;
}

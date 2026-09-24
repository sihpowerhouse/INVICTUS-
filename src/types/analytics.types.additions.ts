/**
 * ADD THIS to: src/types/analytics.ts
 * (append to the end of the existing file — do not replace the file)
 */

export interface DepartmentAnalyticsSnapshot {
  openCases: number;
  closedCases: number;
  otherCases: number;
  totalDocuments: number;
  verifiedDocuments: number;
  documentsWithIssues: number;
  participants: number;
  aiCompleted: number;
  aiProcessing: number;
  aiFailed: number;
  documentTypeBreakdown: { type: string; count: number }[];
  casesInSelectedRange: number;
  recentCases: {
    id: string;
    firId: string;
    status: string;
    createdAt: string;
    accessLevel: string;
  }[];
}

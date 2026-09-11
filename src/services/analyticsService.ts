import type {
  CaseActivityPoint,
  CaseStatusCount,
  DepartmentWorkload,
  DocumentProcessingPoint,
  EvidenceMovementPoint,
  PendingAction,
  SystemActivity,
  AnalyticsSummary
} from '../types/analytics';
import {
  MOCK_CASE_ACTIVITY,
  MOCK_CASE_STATUS,
  MOCK_DEPT_WORKLOAD,
  MOCK_DOC_PROCESSING,
  MOCK_EVIDENCE_MOVEMENT,
  MOCK_PENDING_ACTIONS,
  MOCK_SYSTEM_ACTIVITY,
  MOCK_ANALYTICS_SUMMARY
} from '../mock/analytics';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getCaseActivity(): Promise<CaseActivityPoint[]> {
    await delay(300);
    return MOCK_CASE_ACTIVITY;
  },

  async getCaseStatus(): Promise<CaseStatusCount[]> {
    await delay(200);
    return MOCK_CASE_STATUS;
  },

  async getDepartmentWorkload(): Promise<DepartmentWorkload[]> {
    await delay(400);
    return MOCK_DEPT_WORKLOAD;
  },

  async getDocumentProcessing(): Promise<DocumentProcessingPoint[]> {
    await delay(250);
    return MOCK_DOC_PROCESSING;
  },

  async getEvidenceMovement(): Promise<EvidenceMovementPoint[]> {
    await delay(350);
    return MOCK_EVIDENCE_MOVEMENT;
  },

  async getPendingActions(): Promise<PendingAction[]> {
    await delay(150);
    return MOCK_PENDING_ACTIONS;
  },

  async getSystemActivity(): Promise<SystemActivity[]> {
    await delay(300);
    return MOCK_SYSTEM_ACTIVITY;
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await delay(100);
    return MOCK_ANALYTICS_SUMMARY;
  }
};

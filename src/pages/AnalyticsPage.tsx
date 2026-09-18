import { useState, useEffect } from 'react';
import './AnalyticsPage.css';
import { analyticsService } from '../services/analyticsService';
import type { 
  CaseActivityPoint, 
  CaseStatusCount, 
  DepartmentWorkload as DeptWorkload, 
  DocumentProcessingPoint, 
  EvidenceMovementPoint, 
  PendingAction, 
  SystemActivity, 
  AnalyticsSummary as SummaryType 
} from '../types/analytics';

import AnalyticsSummary from '../components/analytics/AnalyticsSummary';
import CaseActivityChart from '../components/analytics/CaseActivityChart';
import CaseStatusChart from '../components/analytics/CaseStatusChart';
import DepartmentWorkload from '../components/analytics/DepartmentWorkload';
import DocumentProcessingChart from '../components/analytics/DocumentProcessingChart';
import EvidenceMovementChart from '../components/analytics/EvidenceMovementChart';
import PendingActionsPanel from '../components/analytics/PendingActionsPanel';
import SystemActivityPanel from '../components/analytics/SystemActivityPanel';

const IS_API_MODE = import.meta.env.VITE_USE_MOCK_DATA !== 'true';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [caseActivity, setCaseActivity] = useState<CaseActivityPoint[]>([]);
  const [caseStatus, setCaseStatus] = useState<CaseStatusCount[]>([]);
  const [deptWorkload, setDeptWorkload] = useState<DeptWorkload[]>([]);
  const [docProcessing, setDocProcessing] = useState<DocumentProcessingPoint[]>([]);
  const [evidenceMovement, setEvidenceMovement] = useState<EvidenceMovementPoint[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [systemActivity, setSystemActivity] = useState<SystemActivity[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [
          sumData,
          actData,
          statusData,
          deptData,
          docData,
          evData,
          pendingData,
          sysData
        ] = await Promise.all([
          analyticsService.getAnalyticsSummary(),
          analyticsService.getCaseActivity(),
          analyticsService.getCaseStatus(),
          analyticsService.getDepartmentWorkload(),
          analyticsService.getDocumentProcessing(),
          analyticsService.getEvidenceMovement(),
          analyticsService.getPendingActions(),
          analyticsService.getSystemActivity()
        ]);

        if (mounted) {
          setSummary(sumData);
          setCaseActivity(actData);
          setCaseStatus(statusData);
          setDeptWorkload(deptData);
          setDocProcessing(docData);
          setEvidenceMovement(evData);
          setPendingActions(pendingData);
          setSystemActivity(sysData);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => { mounted = false; };
  }, []);

  if (loading || !summary) {
    return (
      <div className="analytics-page">
        <div className="documents-page__loading">INITIALIZING OPERATIONAL INTELLIGENCE...</div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-page__header">
        <div className="analytics-page__title-group">
          <p className="page-tag">INVICTUS / COMMAND CENTER</p>
          <h1 className="analytics-page__title">OPERATIONAL INTELLIGENCE</h1>
        </div>
        <div className="analytics-page__actions">
          <div className="analytics-time-period">
            {IS_API_MODE ? 'API MODE — AUTHORIZED CASES ONLY' : 'PERIOD: LAST 30 DAYS'}
          </div>
        </div>
      </header>

      <AnalyticsSummary summary={summary} />

      <div className="analytics-grid">
        <div className="analytics-primary">
          <CaseActivityChart data={caseActivity} />
        </div>

        <div className="analytics-secondary">
          <CaseStatusChart data={caseStatus} />
        </div>
        <div className="analytics-secondary">
          <DepartmentWorkload data={deptWorkload} />
        </div>
        <div className="analytics-secondary">
          <DocumentProcessingChart data={docProcessing} />
        </div>

        <div className="analytics-secondary" style={{ gridColumn: 'span 12' }}>
          <EvidenceMovementChart data={evidenceMovement} />
        </div>

        <div className="analytics-operational">
          <PendingActionsPanel actions={pendingActions} />
        </div>
        <div className="analytics-operational">
          <SystemActivityPanel activities={systemActivity} />
        </div>
      </div>

      {/* System note footer */}
      <div className="analytics-system-note">
        <div className="analytics-system-note__live">
          <div className="analytics-system-note__live-dot" />
          LIVE TELEMETRY
        </div>
        <span className="analytics-system-note__desc">
          Showing only metrics currently exposed by authorized backend services.
          {IS_API_MODE && ' Mock data is disabled in API mode.'}
        </span>
      </div>
    </div>
  );
}

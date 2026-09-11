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
      } catch (err) {
        console.error('Failed to load analytics data', err);
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
          <div className="analytics-time-period">PERIOD: LAST 30 DAYS</div>
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
    </div>
  );
}

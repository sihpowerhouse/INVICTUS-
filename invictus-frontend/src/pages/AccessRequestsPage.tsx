import { useState, useEffect } from 'react';
import './AccessRequestsPage.css';
import { securityService } from '../services/securityService';
import type { AccessRequest, AccessRequestStatus } from '../types/security';
import AccessRequestCard from '../components/security/AccessRequestCard';

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    securityService.getAccessRequests().then(res => {
      setRequests(res);
      setIsLoading(false);
    });
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: AccessRequestStatus) => {
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    await securityService.updateAccessRequestStatus(id, newStatus);
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pastRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="access-requests-page">
      <div className="access-requests-page__header">
        <p className="page-tag">INVICTUS / SECURITY</p>
        <h1 className="page-title">ACCESS REQUESTS</h1>
      </div>

      {isLoading ? (
        <div className="intelligence-loading">LOADING ACCESS REQUESTS...</div>
      ) : (
        <div className="access-requests-page__layout">
          {pendingRequests.length > 0 && (
            <div className="security-panel">
              <div className="security-panel__header">
                <h3 className="security-panel__title" style={{ color: 'var(--accent)' }}>ACTION REQUIRED</h3>
                <span className="status-badge status-badge--amber">{pendingRequests.length} PENDING</span>
              </div>
              <div className="access-requests-grid">
                {pendingRequests.map(req => (
                  <AccessRequestCard key={req.id} request={req} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          <div className="security-panel">
            <div className="security-panel__header">
              <h3 className="security-panel__title">RECENT RESOLUTIONS</h3>
            </div>
            <div className="access-requests-grid">
              {pastRequests.map(req => (
                <AccessRequestCard key={req.id} request={req} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

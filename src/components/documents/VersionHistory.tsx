import './VersionHistory.css';
import type { Document } from '../../types/document';

interface VersionHistoryProps {
  document: Document;
}

export default function VersionHistory({ document: doc }: VersionHistoryProps) {
  // Generate some mock previous versions based on current version
  // If version is v3, we'll mock v2 and v1.
  const currentVersionNum = parseInt(doc.version.replace('v', '')) || 1;
  
  const history = [];
  for (let i = currentVersionNum; i >= 1; i--) {
    history.push({
      version: `v${i}`,
      date: new Date(new Date(doc.updatedAt).getTime() - (currentVersionNum - i) * 86400000).toLocaleDateString(),
      user: i === currentVersionNum ? doc.uploadedBy : 'SYSTEM AUTO',
      status: i === currentVersionNum ? doc.status : 'SUPERSEDED',
      active: i === currentVersionNum
    });
  }

  return (
    <div className="version-history">
      <div className="vh-header">
        <h3 className="vh-title">VERSION HISTORY</h3>
      </div>
      
      <div className="vh-timeline">
        {history.map(item => (
          <div key={item.version} className={`vh-item ${item.active ? 'active' : ''}`}>
            <div className="vh-marker" />
            <div className="vh-content">
              <div className="vh-version-row">
                <span className="vh-version">{item.version}</span>
                <span className="vh-status">{item.status.replace('_', ' ')}</span>
              </div>
              <div className="vh-meta">
                {item.date} • <span className="vh-meta-user">{item.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

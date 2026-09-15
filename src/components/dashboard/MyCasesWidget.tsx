import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../../services/caseService';
import type { Case } from '../../types/case';
import './MyCasesWidget.css';

export default function MyCasesWidget() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    caseService.getCases().then(data => {
      if (mounted) {
        // Max 2 cases for the compact right panel to maintain fixed viewport console
        const activeCases = data.filter(c => c.status === 'ACTIVE').slice(0, 2);
        setCases(activeCases);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="my-cases-widget">
      <div className="my-cases-widget__header">
        <span className="my-cases-widget__title">MY CASES</span>
        <button 
          className="my-cases-widget__view-all"
          onClick={() => navigate('/cases')}
        >
          VIEW ALL
        </button>
      </div>

      <div className="my-cases-widget__content">
        {isLoading ? (
          <div className="my-cases-widget__skeleton-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="my-cases-widget__skeleton-row skeleton-box" />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="my-cases-widget__empty">NO ACTIVE CASES</div>
        ) : (
          <div className="my-cases-list">
            {cases.map(c => (
              <div key={c.id} className="my-cases-item" onClick={() => navigate(`/cases/${c.id}`)}>
                <div className="my-cases-item__top">
                  <span className="my-cases-item__id">{c.firNumber || c.id}</span>
                </div>
                <div className="my-cases-item__title" title={c.title}>{c.title}</div>
                <div className="my-cases-item__bottom">
                  <span className={`my-cases-item__status case-status--${c.status.toLowerCase()}`}>
                    {c.status} / {c.priority}
                  </span>
                  <span className="my-cases-item__time">{c.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

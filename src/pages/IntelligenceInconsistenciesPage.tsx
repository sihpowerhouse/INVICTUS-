import { useState, useEffect } from 'react';
import './IntelligenceInconsistenciesPage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { PotentialInconsistency, Entity } from '../types/intelligence';

import InconsistencyCard from '../components/intelligence/InconsistencyCard';
import EntityPanel from '../components/intelligence/EntityPanel';

export default function IntelligenceInconsistenciesPage() {
  const [inconsistencies, setInconsistencies] = useState<PotentialInconsistency[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    Promise.all([
      intelligenceService.getInconsistencies('CAS-26190'),
      intelligenceService.getEntities('CAS-26190')
    ]).then(([incData, entData]) => {
      if (mounted) {
        setInconsistencies(incData);
        setEntities(entData);
        setIsLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="intel-inconsistencies-page">
      <div className="intel-inconsistencies-page__header">
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190</p>
        <h1 className="page-title">POTENTIAL INCONSISTENCIES</h1>
      </div>

      <div className="intel-inconsistencies-page__layout">
        <main className="intel-inconsistencies-main">
          {isLoading ? (
            <div className="intelligence-loading">ANALYZING CONFLICTS...</div>
          ) : inconsistencies.length === 0 ? (
            <div className="intelligence-empty">NO INCONSISTENCIES FOUND</div>
          ) : (
            inconsistencies.map(inc => (
              <InconsistencyCard key={inc.id} inconsistency={inc} />
            ))
          )}
        </main>

        <aside className="intel-inconsistencies-sidebar">
          {isLoading ? (
            <div className="intelligence-loading">EXTRACTING ENTITIES...</div>
          ) : (
            <EntityPanel entities={entities} />
          )}
        </aside>
      </div>
    </div>
  );
}
